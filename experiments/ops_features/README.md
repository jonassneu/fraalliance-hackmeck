# Operational and state features (2026-10-30)

**Question:** besides the weather, do features that describe the airport's current state help the
operating-direction model? Candidates:

- **Published prognosis structure:** is the valid hour inside a transition block, hours until the prognosis expects a
  change, agreement with the flown direction, and gaps in the prognosis.
- **Recent history:** number of switches and westbound share in the last 24 h, and the mix of directions in the last
  flown hour (a switch under way).
- **METAR now:** the official rule on the latest observation vs. the flown direction, the 3 h tailwind trend, and the
  forecast bias at issue time.
- **Night-ban reset:** the labels carry the evening direction through the night ban, so the first morning hour is
  decided afresh.
- **Calendar and lead:** weekend, day of week, position within the 48 h horizon.

**Answer:** the best of about 30 single features improved the walk-forward Brier score by only 0.0001
(0.0358 → 0.0357). The best combination is `add_ops_features` in `final_features.py`: night reset, rule-vs-flown
disagreement at leads ≤ 3 h, and prognosis transition block. It gained only 0.0004, which is within noise, so it was
**not adopted**.

**Insight worth keeping:** about 30 % of the +1 h "switches" in the labels are the first morning hour after the
night ban, where the evening direction was carried through the night. They are an artefact of the labelling, not real
switches, and the model card discloses this.

## Files

| Script | Purpose |
| --- | --- |
| `feats.py` | All candidate features (issue-time safe) |
| `build.py` → `build4.py` | Build the experiment feature cache `data/ops_feats.parquet` step by step |
| `run.py` | Single-feature additions and substitutions vs. production → `results/` |
| `combo.py`, `combo2.py` | Combinations of the best single features |
| `weekly.py`, `wk6.py` | Per-week robustness of the candidate sets; diagnosis of the weakest test week |
| `rwy18.py` | The same state features for the Runway 18 model |
| `final_features.py` | Drop-in implementation of the best set (not adopted) |

Results: `results/results_33.csv` and `results/single_features.txt`.
Run from the repository root, e.g. `uv run python experiments/ops_features/run.py`.
