# Build Calculator

Pick a build and a height. The page estimates body weight and seven tape girths: chest, waist, flexed upper arm, forearm, thigh, calf and neck. Every number says what kind of source it has: measured, official, reported, derived or estimate. Where no source exists, the page says unknown.

Live page: https://claude.ai/artifact/9aKMVmtGqXXT2kGMYvZb5E (private until shared)

## Builds (55)

- **Everyday:** US Army ANSUR II men and women (5th, 50th, 95th percentile; measured), US adults from NHANES 2015-2018 (measured), plus three ANSUR II subgroups used as shape templates.
- **Natural athletes:** drug-tested natural pro bodybuilders (Chappell 2019), Kouri 1995 non-users, pre-steroid Mr America winners, Steve Reeves.
- **Bodybuilders:** seven pros (mostly magazine-reported) and five study groups.
- **Strongmen and lifters:** five.
- **Comic characters:** 21, with official heights and weights from Marvel.com, DC.com and DK licensed guides. Publishers give no girths, so those are derived from the closest measured build.
- **Rex and Ollie:** measured from their reference picture (10 ft); mass by ruling, 3,007 kg each in all (Rex: 2,700 kg without his tail).

## Model

- Same-shape scaling: weight scales with height cubed and girths with height. With a weight override, girths scale with the square root of weight over height. In ANSUR II the chest follows this law (exponent 1.02).
- Missing girths come from a template build and are labelled derived.
- Reverse mode estimates weight from typed girths two ways: the ANSUR II girth regression (RMSE about 1.6 kg) and a stacked-frustum volume model times density from body fat (Siri). It warns outside the measured range (for example a flexed arm above 49 cm).
- BMI and FFMI, with Kouri's 25.0 shown as the highest value in that study's sample of 74 non-users, not a hard limit.

## Build and test

```
node build.js          # data + calc.js + app.html -> dist/index.html
node test/test.js      # 22 checks, including ANSUR II CSV re-derivations (~10 s)
node test/shots.js     # headless Chromium at 390 and 1280 px, light and dark (needs Playwright)
```

## Files

- `data/builds.json`: builds, 140 sourced facts, and the log of the 93 corrections applied. `data/NOTES.md` explains the judgement calls and gaps.
- `data/ansur2/`: the ANSUR II public CSVs (US Army, public domain), used by the tests.
- `src/calc.js`: the model (node and browser). `src/app.html`: the page.
- `tools/derive_frustum.js`: derives the volume-model ratios from the ANSUR II CSVs.

## Known limits

- Builds above BMI 43.45 (the highest BMI with measured girths here), and heights outside 1.28-2.19 m, are beyond the human data. Their girths are shown as estimates with a warning, or hidden on request.
- Bodybuilder girths are mostly fan-site or magazine figures without dates or methods.
- ANSUR II has no body-fat data, so its reference fat for the volume model is an assumption.
