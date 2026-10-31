# Experiments

Research code behind the design decisions in [research/conclusion.md](../research/conclusion.md). None of it is
needed to train or run the forecast; the production pipeline is in [`fra/`](../fra).

Every study uses the shared walk-forward harness [`harness.py`](harness.py). It caches the production feature table,
reproduces the production model exactly and scores a variant on the same test hours. The test period is 15 Sep to
30 Oct 2026, split into weekly folds, and each week is predicted by a model trained only on outcomes known before it.

```python
from experiments.harness import load, evaluate, PROD_OD
d = load()                                    # cached feature table: production columns + labels
d["my_feat"] = ...                            # candidate column (only information known at issue time!)
evaluate(d, od_features=PROD_OD + ["my_feat"])
```

## Studies

On the hackathon day, four studies ran in parallel. Scores are walk-forward Brier scores of the operating-direction
model at leads 1/6/24/48 h; lower is better. Production started at 0.0358.

| Study | Question | Outcome |
| --- | --- | --- |
| [`model_structure/`](model_structure) | Can a different model structure, training window or calibration beat the production logistic regression? | About 40 variants tried. Only per-lead temperature scaling helped (0.0358 → 0.0344). **Adopted.** |
| [`weather_features/`](weather_features) | Which extra weather features help? | Three features **adopted**: lowest tailwind in the previous 6 h, NE/SE easterly regime, 100 m–10 m shear (0.0363 → 0.0348 over all leads, confirmed on a Mar–Sep 2026 holdout). |
| [`ops_features/`](ops_features) | Do operational state features help (night-ban reset, prognosis transitions, METAR vs. flown direction)? | Best set within noise (−0.0004). Not adopted. Found that ~30 % of +1 h "switches" are the night ban carried over. |
| [`rwy18/`](rwy18) | Are the Runway 18 closure labels right, and how should closure skill be measured? | Label bug found and fixed. A single-bucket model with C = 3 was **adopted**, together with closure metrics (Brier skill, AUC, hits and false alarms at P(open) < 0.8). |

Each folder has a README with the details, its scripts, and a `results/` folder with the result tables.

## Re-running

The studies need the local data archive built by the pipeline in the main [README](../README.md#reproduce-the-pipeline).
Run them from the repository root, for example:

```bash
uv run python experiments/harness.py --refresh                 # rebuild the cached feature table
uv run python -m experiments.weather_features.run round1        # one study's entry point (see its README)
```
