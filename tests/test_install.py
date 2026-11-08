"""Installation from a release: bundle build -> unpack round trip, and the service schedule (offline)."""
import hashlib
import io
import json
import tarfile
from datetime import datetime, timezone
from xml.etree import ElementTree

import pytest

from fra import portable
from ops import backup, install, release_bundle, serve


def _fake_data(tmp_path):
    data = tmp_path / "src" / "data"
    m = data / "archive" / "models" / "blend-x"
    (m / "library").mkdir(parents=True)
    (m / "model.pkl").write_bytes(b"logit")
    (m / "decision_model.pkl").write_bytes(b"decision")
    (m / "library" / "MANIFEST.json").write_text(json.dumps({"frozen_utc": "2026-10-31T18:49:09+00:00"}))
    (m / "library" / "ifs_runs.parquet").write_bytes(b"ifs")
    (data / "scene3d.json").write_text("{}")
    sha = lambda b: hashlib.sha256(b).hexdigest()[:12]
    reg = {"variants": [{"name": "blend-x", "role": "champion", "runtime": "tag", "entry": "fra.blend:forecast",
                         "models": {"model": "data/archive/models/blend-x/model.pkl",
                                    "decision": "data/archive/models/blend-x/decision_model.pkl"},
                         "sha256": sha(b"logit"), "models_sha256": {"decision": sha(b"decision")}}]}
    (data / "archive" / "variants.json").write_text(json.dumps(reg))
    return data


@pytest.fixture
def target(tmp_path, monkeypatch):
    root = tmp_path / "install"
    (root / "data").mkdir(parents=True)
    monkeypatch.setattr(install, "ROOT", root)
    monkeypatch.setattr(install, "DATA", root / "data")
    return root


def test_bundle_round_trip(tmp_path, target):
    data = _fake_data(tmp_path)
    out, digest = release_bundle.build(data, "blend-x", "v9.9", tmp_path / "dist")
    out2, digest2 = release_bundle.build(data, "blend-x", "v9.9", tmp_path / "dist2")
    assert digest == digest2                                  # reproducible archive
    written, kept, conflicts = install.unpack(out)
    assert not conflicts and not kept
    reg = json.loads((target / "data" / "archive" / "variants.json").read_text())
    assert [v["name"] for v in reg["variants"]] == ["blend-x"] and "runtime" not in reg["variants"][0]
    assert (target / "data" / "ifs_runs.parquet").read_bytes() == b"ifs"
    assert install.installed_ok("v9.9") and not install.installed_ok("v1.0")
    # a second unpack changes nothing; a locally changed file is reported, not replaced
    (target / "data" / "scene3d.json").write_text('{"local": 1}')
    written, kept, conflicts = install.unpack(out)
    assert conflicts == ["data/scene3d.json"] and (target / "data" / "scene3d.json").read_text() == '{"local": 1}'
    install.unpack(out, force=True)
    assert (target / "data" / "scene3d.json").read_text() == "{}"


def test_bundle_refuses_wrong_pin(tmp_path):
    data = _fake_data(tmp_path)
    (data / "archive" / "models" / "blend-x" / "model.pkl").chmod(0o644)
    (data / "archive" / "models" / "blend-x" / "model.pkl").write_bytes(b"other")
    with pytest.raises(SystemExit):
        release_bundle.build(data, "blend-x", "v9.9", tmp_path / "dist")


def test_unpack_refuses_paths_outside_data(tmp_path, target):
    bad = tmp_path / "bad.tar.gz"
    with tarfile.open(bad, "w:gz") as tar:
        ti = tarfile.TarInfo("ops/serve.py")
        ti.size = 1
        tar.addfile(ti, io.BytesIO(b"x"))
    with pytest.raises(SystemExit):
        install.unpack(bad)


def test_schedule():
    t = lambda h, m, s=0: datetime(2026, 11, 6, h, m, s, tzinfo=timezone.utc)
    assert serve.next_event(t(16, 23), 30) == (t(16, 30), "run")
    assert serve.next_event(t(16, 30), 30) == (t(16, 50), "retry")
    assert serve.next_event(t(16, 55), 30) == (t(17, 30), "run")
    assert serve.next_event(t(23, 51), 30) == (datetime(2026, 11, 7, 0, 30, tzinfo=timezone.utc), "run")


def test_lock_excludes_a_second_holder(tmp_path):
    p = tmp_path / "x.lock"
    with open(p, "w") as a, open(p, "w") as b:
        portable.lock_nowait(a)
        with pytest.raises(BlockingIOError):
            portable.lock_nowait(b)
        portable.unlock(a)
        portable.lock_nowait(b)
        portable.unlock(b)


def test_backup_copy_without_rsync(tmp_path):
    src = tmp_path / "archive"
    (src / "issued").mkdir(parents=True)
    (src / "run_cache").mkdir()
    (src / "issued" / "forecast_x.csv").write_text("1")
    (src / "run_cache" / "big.bin").write_text("skip")
    (src / ".archive.lock").write_text("")
    (src / "a.tmp").write_text("skip")
    dst = tmp_path / "copy"
    backup.copy_new(src, dst)
    assert sorted(p.relative_to(dst).as_posix() for p in dst.rglob("*") if p.is_file()) == ["issued/forecast_x.csv"]
    (dst / "keep.txt").write_text("stays")          # nothing is removed from the copy
    (src / "issued" / "forecast_x.csv").write_text("22")
    backup.copy_new(src, dst)
    assert (dst / "issued" / "forecast_x.csv").read_text() == "22" and (dst / "keep.txt").exists()


def test_task_definition(monkeypatch):
    monkeypatch.setenv("USERDOMAIN", "AIR&PORT")
    monkeypatch.setenv("USERNAME", "ops")
    root = ElementTree.fromstring(install.task_xml("0.0.0.0", 8081))
    ns = "{http://schemas.microsoft.com/windows/2004/02/mit/task}"
    assert root.find(f"{ns}Principals/{ns}Principal/{ns}UserId").text == "AIR&PORT\\ops"
    assert root.find(f"{ns}Settings/{ns}ExecutionTimeLimit").text == "PT0S"   # the default would stop it after 3 days
    args = root.find(f"{ns}Actions/{ns}Exec/{ns}Arguments").text
    assert "--host 0.0.0.0 --port 8081" in args and "service.log" in args


def test_web_types_do_not_depend_on_the_machine():
    assert serve.Handler.extensions_map[".js"] == "text/javascript"
    assert serve.Handler.extensions_map[".json"] == "application/json"
