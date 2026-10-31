"""Batch 5: temperature robustness (multi-window average, clipping, fixed constants)."""
import sys, time
import numpy as np, pandas as pd
from experiments.harness import load, evaluate
from experiments.model_structure.variants import mk_bucket, B4
from experiments.model_structure.variants4 import mk_temp, LG

def mk_temp_multi(base_fp, windows=(14, 28, 60), groups=B4, a_min=0.3, a_max=3.0):
    fps = [mk_temp(base_fp, w, groups, a_min, a_max) for w in windows]
    def fp(tr, y, te):
        p_full = base_fp(tr, y, te); z = LG(p_full); las = []
        for f in fps:
            out = f(tr, y, te)
            with np.errstate(divide="ignore", invalid="ignore"):
                a = np.where(np.abs(z) > 1e-3, LG(out) / z, 1.0)
            las.append(np.log(np.clip(a, 1e-3, 1e3)))
        return 1 / (1 + np.exp(-np.exp(np.mean(las, axis=0)) * z))
    return fp

def mk_fixed_temp(base_fp, a=1.3):
    def fp(tr, y, te):
        return 1 / (1 + np.exp(-a * LG(base_fp(tr, y, te))))
    return fp

G1 = [(1, 48)]
VARIANTS = {
    "fixed1.2": lambda: mk_fixed_temp(mk_bucket(), 1.2), "fixed1.3": lambda: mk_fixed_temp(mk_bucket(), 1.3),
    "fixed1.5": lambda: mk_fixed_temp(mk_bucket(), 1.5), "fixed1.7": lambda: mk_fixed_temp(mk_bucket(), 1.7),
    "t14_amax1.3": lambda: mk_temp(mk_bucket(), 14, a_max=1.3), "t14_amax1.4": lambda: mk_temp(mk_bucket(), 14, a_max=1.4),
    "t14_amin0.8_amax1.5": lambda: mk_temp(mk_bucket(), 14, a_min=0.8, a_max=1.5),
    "t21_amax1.5": lambda: mk_temp(mk_bucket(), 21, a_max=1.5), "t28_amax1.5": lambda: mk_temp(mk_bucket(), 28, a_max=1.5),
    "t60_amax1.5": lambda: mk_temp(mk_bucket(), 60, a_max=1.5), "t90_amax1.5": lambda: mk_temp(mk_bucket(), 90, a_max=1.5),
    "t14_g1_amax1.5": lambda: mk_temp(mk_bucket(), 14, groups=G1, a_max=1.5), "t21_g1_amax1.5": lambda: mk_temp(mk_bucket(), 21, groups=G1, a_max=1.5),
    "tmulti_14_28_60": lambda: mk_temp_multi(mk_bucket(), (14, 28, 60)), "tmulti_14_28_60_amax1.5": lambda: mk_temp_multi(mk_bucket(), (14, 28, 60), a_max=1.5),
    "tmulti_10_14_21": lambda: mk_temp_multi(mk_bucket(), (10, 14, 21)),
}

if __name__ == "__main__":
    names = sys.argv[1:] or list(VARIANTS)
    d = load(); out = []
    for n in names:
        t = time.time()
        try:
            r = evaluate(d, od_model=VARIANTS[n](), label=n)["od25"]
        except Exception as e:
            import traceback; traceback.print_exc(); print(n, "FAILED", repr(e), flush=True); continue
        r["name"] = n; r["secs"] = round(time.time() - t, 1); out.append(r)
        pd.DataFrame(out).to_csv(f"experiments/model_structure/results/results5_{names[0]}.csv", index=False)
