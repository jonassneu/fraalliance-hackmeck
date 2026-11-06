"""Installation from a release: bundle build -> unpack round trip, and the service schedule (offline)."""
import hashlib
import io
import json
import tarfile
from datetime import datetime, timezone

import pytest

from ops import install, release_bundle, serve


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
