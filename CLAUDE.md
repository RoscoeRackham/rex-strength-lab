# Working in this repo

Three projects about Rex (an indestructible 10 ft dinosaur) and Ollie (his equally strong bull-man boyfriend): `rex-strength-lab/` (physics simulator), `build-calculator/` (weight and girths from height and build), and `build-comparison/` (in progress; see its BRIEF.md). Each is a single self-contained HTML page published as a claude.ai Artifact.

## The owner's standard

The owner is a professional critic. Factual accuracy and honest labelling come first.

- Every number on a page is either sourced or labelled an estimate with its reasoning. "Sourced" means you fetched the source and confirmed the number on the page; give the exact URL.
- Prefer primary or authoritative sources: journals, textbooks, government surveys, standards bodies. Fan sites and magazines only when nothing better exists, and then say so.
- Never present speculation as fact. Say what each model ignores and where it stops being valid.
- Plain numbers: no huge percentages, long digit strings, or "≈" for a big gap. Round to what the data supports.
- Page tone: plain, specific, readable for a general audience. Short sentences; gloss any jargon.
- Reviews look for real defects (wrong physics or formulas, wrong or unsupported claims, broken pages). Skip style preferences.

## Canon

- Rex: 10 ft (3.048 m) tall by the owner's ruling; about 2,700 kg (2,300–3,000 kg), measured from `rex-strength-lab/assets/duo.jpg`.
- Ollie: as strong, tough and big as Rex. Plush bull-man: horns, nose ring, leather vest, cargo pants, laced boots, no visible claws. Measured at Rex's scale (3.06 m to his horn tips).
- Both are male, and both are 5–10% body fat (7.5% as the working value), from their definition and occasional vascularity. Rex's tail does not count toward his muscle level, and muscle scores use height to the top of the skull (not Rex's crest or Ollie's horns).
- Do not invent other canon for either; ask.
- Art in `rex-strength-lab/assets/` is the owner's. Use it; don't redraw the characters.

## House pattern for a project

- `src/` builds into one `dist/index.html` with everything inlined: no runtime dependencies, external scripts or images. Google Fonts are the only outside request.
- Research facts live in JSON, each with a key, a status (verified, official, reported, derived, estimate, ...), sources and notes. The page shows each number's status.
- The model runs in both Node and the browser, so tests can call it directly.
- Tests: Node checks for the model, plus a headless-Chromium `test/shots.js` (390 px and 1280 px, light and dark; fails on NaN/undefined/Infinity in text, console errors or horizontal scroll).
- Work in stages: research with verified facts, then design, then build, then adversarial review rounds (several independent angles; every finding reproduced with code before it counts), then fixes and re-verification. Keep the review records in the project (`research/reviews/` or `data/NOTES.md`).
- Each project has a README covering what it does, how to build and test it, the sources, the review history and the known limits.
- `history/` holds the transcript of the session that built the first two projects. Its `scratchpad/workflows/` scripts show how the research and review rounds were run.

## Two people, two accounts

- **Owner:** owns the GitHub repo and both live Artifacts. Works only in Claude Code cloud sessions (claude.ai/code and the Claude apps).
- **Collaborator:** works locally on Windows: the Claude Code CLI, the VS Code extension, and VS Code itself.

Neither can see the other's sessions, chats or memory. Anything the other person needs goes into the repo. Rules for every session, on either account:

1. **Start from a fresh `main`.** Pull first. Read `STATUS.md` before changing anything.
2. **Work on a branch, never on `main`.** Cloud sessions use their own `claude/...` branches; the collaborator uses `terantic/...`. Merge `main` into a long-running branch at least daily.
3. **Merge through a pull request.** The PR says what changed, how it was tested, and what it needs from the other person. CI (`.github/workflows/test.yml`) must pass before merging.
4. **Stay inside the folders you've claimed in `STATUS.md`.** Shared files need care:
   - `build-calculator/data/builds.json` and `src/calc.js` are shared by the Build Calculator and Build Comparison. Only one open branch changes them at a time; claim them in `STATUS.md`.
   - Generated files (`*/dist/index.html`, `rex-strength-lab/src/data.js`) are never merged by hand. On a conflict, take either side, rebuild, and commit the result. CI fails if they don't match their sources.
   - Keep root `README.md` and this file's changes small, and merge them quickly. Changes to this file's standards are agreed by both people.
5. **Before pushing, update `STATUS.md`:** what you finished, what's in progress, and what you're waiting on.
6. **Publishing:** only the owner's account can update the live Artifacts. After a merge to `main`, the owner's session rebuilds and republishes to the existing URLs (listed in the root README). The collaborator may publish separate preview pages for review and link them in the PR, and must say they are previews.
7. **Long runs** (overnight or many subagents) end with a `history/` entry, built the same way as the existing transcript, so the other person can see what happened and why.

## Build and test

From the repo root; each line ends back at the root, so they run one after the other in the same shell:

```
cd rex-strength-lab && python build-data.py && node build.js && node test/calibration.js && node test/shots.js && cd ..
cd build-calculator && node build.js && node test/test.js && node test/shots.js && cd ..
```

- On macOS and Linux the Python command may be `python3`.
- Windows: set `PYTHONUTF8=1`, or Python reads the UTF-8 research files with the system code page and fails.
- `test/shots.js` finds Playwright and Chromium through `$PLAYWRIGHT` and `$CHROME`, `/opt` (cloud sandbox), or a local or global npm install. Both exit non-zero on a problem.
- `.gitattributes` keeps text as LF; the ANSUR II CSVs stay CRLF, byte-for-byte as published.
