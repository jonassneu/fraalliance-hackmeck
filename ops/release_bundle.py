"""Build the model bundle of a release: everything a new installation needs that is not in git.

    uv run python -m ops.release_bundle --version v2.0 [--data DIR] [--variant blend-v2] [--out dist/]

The bundle (a .tar.gz, about 8 MB, files under data/) holds:

    data/archive/models/<variant>/     the frozen model files of the champion: logistic model, decision model and
                                       the forecast-error library (pinned by sha256 in the registry)
    data/archive/variants.json         a registry with this one variant as the champion
    data/ifs_runs.parquet              the ECMWF IFS run archive as frozen with the library. The live forecast
                                       uses the exact-run path (the runs it was trained on) only when this
                                       archive exists; its content is read only for forecasts of past hours
    data/scene3d.json                  the 3D airport scene, built from OpenStreetMap (ODbL), so a new installation
                                       does not download ~190 MB of map tiles
    data/BUNDLE.json                   version, sha256 and size of every file

The archive is reproducible: sorted members, fixed timestamps and owners, gzip without a time stamp.
ops/install.py downloads it from the release, checks the sha256 pinned in ops/release.json and unpacks it.
"""

import argparse
import gzip
import hashlib
import io
import json
import sys
import tarfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MTIME = 1_793_923_200  # 2026-11-06 00:00 UTC, fixed for every member


def sha256_bytes(b):
    return hashlib.sha256(b).hexdigest()


def build(data, variant, version, out_dir):
    data = Path(data)
    reg = json.loads((data / "archive" / "variants.json").read_text())
    v = next((x for x in reg["variants"] if x["name"] == variant), None)
    if v is None:
        sys.exit(f"variant {variant} not in {data / 'archive' / 'variants.json'}")
    v = {k: x for k, x in v.items() if k != "runtime"}   # an installation runs its own code, not a frozen runtime
    v["role"], v["enabled"] = "champion", True
    mdir = data / "archive" / "models" / variant
    files = {}
    for p in sorted(mdir.rglob("*")):
        if p.is_file():
            files[f"data/archive/models/{variant}/{p.relative_to(mdir).as_posix()}"] = p.read_bytes()
    # the registry's sha256 pins must hold for the files that go into the bundle
    pins = {"model": v.get("sha256"), **(v.get("models_sha256") or {})}
    for key, pref in pins.items():
        if not pref:
            continue
        rel = v["models"][key]
        if rel not in files:
            sys.exit(f"{rel} ({key}) not found under {mdir}")
        if not sha256_bytes(files[rel]).startswith(pref):
            sys.exit(f"{rel}: sha256 does not match the registry pin {pref}")
    lib = mdir / "library" / "ifs_runs.parquet"
    if lib.exists():
        files["data/ifs_runs.parquet"] = lib.read_bytes()
    scene = data / "scene3d.json"
    if scene.exists():
        files["data/scene3d.json"] = scene.read_bytes()
    files["data/archive/variants.json"] = (json.dumps(
        {"version": 1,
         "doc": "Variant registry of this installation (fra.archive.load_variants). The champion issues the "
                "official forecast every hour (ops/serve.py); see ops/README.md for challengers.",
         "installed_from": version, "variants": [v]}, indent=1) + "\n").encode()
    frozen = json.loads((mdir / "library" / "MANIFEST.json").read_text()).get("frozen_utc") \
        if (mdir / "library" / "MANIFEST.json").exists() else None
    manifest = dict(version=version, variant=variant, library_frozen_utc=frozen,
                    licence=dict(models="as the repository", scene3d="built from OpenStreetMap data, (c) OpenStreetMap "
                                 "contributors, ODbL 1.0", weather="Open-Meteo.com, CC BY 4.0"),
                    files={k: dict(sha256=sha256_bytes(b), bytes=len(b)) for k, b in sorted(files.items())})
    files["data/BUNDLE.json"] = (json.dumps(manifest, indent=1) + "\n").encode()

    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / f"fra-forecast-models-{version}.tar.gz"
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w", format=tarfile.PAX_FORMAT) as tar:
        for d in sorted({p.as_posix() for k in files for p in Path(k).parents if p.as_posix() != "."}):
            ti = tarfile.TarInfo(d)
            ti.type, ti.mode, ti.mtime = tarfile.DIRTYPE, 0o755, MTIME
            tar.addfile(ti)
        for k in sorted(files):
            ti = tarfile.TarInfo(k)
            ti.size, ti.mode, ti.mtime = len(files[k]), 0o644, MTIME
            tar.addfile(ti, io.BytesIO(files[k]))
    with open(out, "wb") as f, gzip.GzipFile(fileobj=f, mode="wb", mtime=0, filename="") as gz:
        gz.write(buf.getvalue())
    digest = hashlib.sha256(out.read_bytes()).hexdigest()
    print(f"wrote {out} ({out.stat().st_size / 1e6:.1f} MB), sha256 {digest}")
    for k, m in manifest["files"].items():
        print(f"  {m['bytes'] / 1e6:7.2f} MB  {m['sha256'][:12]}  {k}")
    return out, digest


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--version", required=True, help="release tag, e.g. v2.0")
    ap.add_argument("--data", default=str(ROOT / "data"), help="data folder of the running system")
    ap.add_argument("--variant", default="blend-v2", help="the champion to ship")
    ap.add_argument("--out", default=str(ROOT / "dist"))
    a = ap.parse_args(argv)
    build(a.data, a.variant, a.version, a.out)


if __name__ == "__main__":
    main()
