# Runbook: pull requests 2–5 of BRIEF-canon.md in one session

For the owner's Claude Code session. It builds pull requests 2–5 of `BRIEF-canon.md` one after another, with the full review rounds, without waiting for anyone. Written by the collaborator's session on 14 Oct 2026. The collaborator chose stacked branches and full review rounds; the owner merges at the end.

Pull request 1 (the 3,000 kg mass) is merged (#31). All the brief's questions are answered, and the owner confirmed the canon among them (CLAUDE.md, "Rulings of 14 Oct 2026").

Expect a long run: roughly 6–11 hours of building, plus the review rounds.

## The prompt to start it

Paste this into a new cloud session:

> Read CLAUDE.md, STATUS.md, rex-strength-lab/BRIEF-canon.md (all of it, the Answers included) and rex-strength-lab/RUN-canon.md. Then carry out RUN-canon.md from start to finish: pull requests 2–5 of the brief, on stacked branches, with the full review rounds. Don't stop except where RUN-canon.md says to. Don't merge, publish or force-push.

## Before you start

1. Start from a fresh `main` (pull). Read CLAUDE.md, `STATUS.md`, `BRIEF-canon.md` (all of it) and this file.
2. Check the tools: Playwright and Chromium for `test/shots.js` (CLAUDE.md, "Build and test"; the cloud sandbox has them under `/opt`), and GitHub access to push and open pull requests.
3. On the first branch, claim `rex-strength-lab/` (all of it) in `STATUS.md`, for the session's run of pull requests 2–5. Claim `build-calculator/data/builds.json` and `src/calc.js` too only if a pull request turns out to touch them (none should).

## Stacked branches

| Pull request | Brief item | Branch | Branches from | Its pull request's base |
|---|---|---|---|---|
| 2 | Recoil into their source, the catches included, with item 3's ledger test, the recoil copy and the new tagline (items 2, 3, 7) | `claude/canon-2-recoil` | `main` | `main` |
| 3 | Safe passenger on by default, covering the landing and the drag (item 5) | `claude/canon-3-passenger` | `claude/canon-2-recoil` | `claude/canon-2-recoil` |
| 4 | Contests, and the two Never knocked back switches with their notes (item 4) | `claude/canon-4-contests` | `claude/canon-3-passenger` | `claude/canon-3-passenger` |
| 5 | The shimmer (item 6) | `claude/canon-5-shimmer` | `claude/canon-4-contests` | `claude/canon-4-contests` |

- Each pull request's base is the branch before it, so each shows only its own changes. Say in each title and body that it is stacked on the one before ("stacked on #N; merge #N first").
- Finish each pull request's review rounds before starting the next, so nothing is built on an unreviewed change.
- If a later round changes an earlier branch, merge that branch into every later one (`git merge`, not a rebase), rebuild the generated files (CLAUDE.md: take either side on a conflict, rebuild, commit), and rerun the test line.
- Never merge into `main`, never publish, never force-push.

## For each pull request

1. **Branch** from the previous one (or from `main` for pull request 2).
2. **Build** what the brief's item says: what changes, the files and functions, the tests. Follow the Answers. Where the brief marks a reading "confirm in review", use that reading and let the review rounds check it.
3. **Test** with the full line from CLAUDE.md for every project the pull request touches; the Rex lab line includes `test/powers.js` and `test/ladder.js`. Run `test/sweep.js` too for an engine change. Commit the rebuilt generated files. The rules in the brief's "Rules for every item" must hold. In particular, with every power off every engine result stays as on `main`, and the frozen comparisons keep running on the 3,007 kg build they were written with.
4. **Push and open the pull request** (base as in the table). The body follows CLAUDE.md rule 3: what changed, how it was tested, what it needs.
5. **Review** in the rounds below.
6. **Close out**: run the full test line again after the last round; update the project's README (review history, known limits) and `STATUS.md` ("built and reviewed, open as #N, stacked on #M"); push.
7. Start the next pull request from this branch.

Push after each build and after each review round, so nothing is lost if the session ends.

## Review rounds (full, as the brief sets them)

| Pull request | Rounds and lenses |
|---|---|
| 2 | Three rounds and a re-check. **Physics:** each move's momentum, and the ledger closing with only the canon's cases in the endless ocean. **Code and tests:** mutants that put the push back into the ground, one move at a time; each must fail a check. **Copy and layout:** no recoil "into the planet", Pull's reason for having no shaking, the tagline. |
| 3 | Two rounds. **Physics and claims:** the landing's split (its momentum real, its energy taken back) and the drag. **Code, layout and the migration:** the save mark, an old save with `safePassenger: false`. |
| 4 | Three rounds and a re-check. **Physics:** the charger of unbounded mass, the paradox cases, the shoving match's new outcome, the standing arm wrestle. **The two-player tests:** every row of item 4's table, and the effort search's time. **Copy:** how the Collide tab explains the paradox, and the switches' notes (which name the fireball's push in the game of catch, item 4). |
| 5 | Two rounds. **Design, copy and accessibility:** the glow's placement on `dino.jpg` and `art-unstoppable.jpg` at both widths and in both themes, and the tile read by screen readers. **Code and data:** which drag figure feeds the shimmer, the floor, the steps taken from the ladder by key. |

- Each round uses independent reviewer subagents, one per lens. Each finding is reproduced, or refuted, with code by a separate skeptic before it counts. Fix the confirmed findings and verify each fix.
- A **re-check** is a focused pass over the previous round's fixes: revert each fix's test in a scratch copy and confirm it fails.
- Records go in `rex-strength-lab/research/reviews/canon-<n>-round<k>.json`, in the format of `gui-c-round3.json`. `canon-1-round1.json` and `canon-1-round2.json` are this brief's first two.
- How earlier rounds were run: the workflow scripts in `history/2026-10-12-rex-gui/scratchpad/workflows/` (for example `rex-gui-b-review.js`).

## When to stop, and when to carry on

Carry on in every case except these:
1. **A canon question** that CLAUDE.md, the brief and its Answers don't settle, and that blocks the current pull request. Write it into `STATUS.md` under Waiting on, finish whatever doesn't depend on it, and go on to the later pull requests only if they don't depend on it either; otherwise stop and report.
2. **The test line can't pass** without breaking one of the brief's "Rules for every item". Stop and report.
3. **A tool is missing** (Playwright or Chromium, GitHub access). Stop and report.

Anything else (a design choice, a review finding, a test that needs changing): decide, record the decision in the pull request and the review record, and carry on.

## CI

CI runs only when someone starts it (CLAUDE.md rule 3), and each run takes about 11 minutes. Don't start it on every push. If the session can start workflows, start it once per pull request after its last review round: `gh workflow run test.yml --ref <branch>`. Otherwise the owner starts it on each of the four before merging.

## At the end

1. **The session** writes the run's `history/` entry (CLAUDE.md rule 7), built the same way as the existing entries (`history/tools/`). It goes on the last branch or a branch of its own. The session also updates `STATUS.md`: the four pull requests open and stacked, and what the owner has to do next.
2. **The owner** starts CI on each pull request if the session didn't, then merges them in order: 2 first, then 3, 4 and 5. Use merge commits, not squash merges, so the stacked branches stay valid. After each merge, check that the next pull request's base has moved to `main` (GitHub does this when the merged branch is deleted); retarget it by hand if not.
3. **The owner** rebuilds all three projects from `main` and republishes the live pages once. This also covers the republish still owed after #31.
