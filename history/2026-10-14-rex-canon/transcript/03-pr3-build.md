# Pull request 3 (Safe passenger): the build

2026-10-14 19:16:18 UTC to 2026-10-14 20:36:13 UTC. 5 assistant events, 2 commit events, 1 subagent events, 8 tool call events, 3 wakeup events.

On claude/canon-3-passenger, stacked on #33, one background subagent built item 5 (95a22f9). Safe passenger is on by default, with its own heading in Their powers: a person he throws or catches feels only a manageable push at the launch, in the air and when they land. The landing's energy is taken back, but its push still reaches the ground, so it shakes the ground as a real landing does. Pull request 3 was opened as #34.

Events are in the order they happened in the session; each workflow’s subagents are listed under the call that launched it, with their own start times.


- `Bash` Create the PR 3 branch from PR 2's branch: `git checkout -q -b claude/canon-3-passenger claude/canon-2-recoil && git push -q -u origin claude/canon-3-passenger 2>&1 | tail -1; git log --oneline -1; git...`
- `Agent` Build PR 3: Safe passenger by default (general-purpose, in the background)

**Subagent `Build PR 3: Safe passenger by default`** · Agent tool, in the background · started 2026-10-14 19:16:40 UTC · reported 2026-10-14 20:35:38 UTC

- Pull request 3 (Safe passenger on by default) is built and committed. It is commit 95a22f9 on claude/canon-3-passenger, one commit on top of PR2's 68ecb9b. Nothing was pushed, merged or changed on GitHub.

<details>
<summary>Prompt, verbatim (4,194 characters)</summary>

Agent `a7e7d7d7a8e31bc62` (general-purpose).

```text
You are building pull request 3 of rex-strength-lab/BRIEF-canon.md (item 5: Safe passenger on by default, covering the landing and the drag) in /home/user/rex-strength-lab on branch claude/canon-3-passenger (stay on it; don't push, merge or edit GitHub). It is stacked on pull request 2 (#33, branch claude/canon-2-recoil, their own recoil to their source), which is built and reviewed; this branch starts from its last commit. CLAUDE.md is loaded for you: follow its standard (factual accuracy, honest labelling, plain short sentences, plain numbers).

Read first: rex-strength-lab/BRIEF-canon.md item 5, "Rules for every item" and the Answers (Q8); rex-strength-lab/RUN-canon.md; the build spec /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr3/SPEC.md (decisions 1–11, the brief's figures at 3,000 kg, the tests); the `pr3_passenger` entry of /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr345/map.json (every site with main's line numbers, current text and proposed changes; prototypes in ../understand345/passenger/, including engine-pr3.js). Pull request 2 changed the same throw code, effort box (offBy), cards, catch chips and README since that map was made: re-find each site here, and read the README section "Their own recoil goes to their source" so your copy fits with it.

Build everything in SPEC.md: the engine (passengerLaunch/passengerDrag/passenger, passengerLanding, the landing blast for a person with the switch on, comments), the page (DEFAULTS, the saveV 3 migration, the switch's place and eyebrow, the summary line, the copy on Throw and Catch, the effort box's credit and its person line, catchPassengerG, the catch miss callout, the heat caveat), the cards, research/final-presence.json's comic_passenger_drag_g relabel (then python3 build-data.py), the README (a section for this pull request: what changed, decisions 1–11 in plain words, what moved against pull request 2's branch, the tests; Known limits), and the tests (powers.js part 1's shim for exactly the 8 Safe-passenger fixture keys plus the assertion that only they differ; the 5a check; the new landing checks; presence.js's turned-round check; shots.js's new checks, each of which must fail on pull request 2's page; POWERS_OFF gets safePassenger: false and the marker; the mass migration's expectations move to saveV 3 while a {saveV: 2, m: 3007} save keeps 3,007 kg).

Rules: with every power off (Safe passenger off included) every engine result stays exactly as on main (powers.js part 1); the frozen comparisons keep their 3,007 kg pins; saved pages load (decision 2); test/shots.js passes at 390 and 1280 px, light and dark.

Verify, one test at a time (4 shared CPUs): cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js && node test/calibration.js && node test/presence.js && node test/shots.js && node test/powers.js && node test/ladder.js && node test/sweep.js. All must pass. Reproduce the brief's figures (SPEC.md) with a scratch script and quote them in your report. Mutation check: in scratch copies (under /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr3/mutants/), (a) make the drag hazard fire again with the switch on, (b) drop the landing's energy, (c) let the landing's momentum vanish from the ground, (d) keep the landing blast, (e) skip the migration, (f) read a saveV 2 save as a choice: each must fail a check. Look at the screenshots of Throw with the person and Catch with the person, Their powers, at both widths and themes.

Commit on the branch with the rebuilt dist/index.html and src/data.js, and a STATUS.md line under 'In progress' that pull request 3 is built on claude/canon-3-passenger, its review rounds next (keep the rest of STATUS as it is). End the commit message with:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0136zsmhtj8TCY2T2u8SKMVX

Report back: every change by area (quote key new sentences), the brief's figures as reproduced, the mutation results, the test counts, and anything you decided that the spec didn't settle.
```

</details>

<details>
<summary>Its report, verbatim (10,672 characters)</summary>

```text
## Pull request 3 (Safe passenger on by default) is built and committed

It is commit **95a22f9** on `claude/canon-3-passenger`, one commit on top of PR2's 68ecb9b. Nothing was pushed, merged or changed on GitHub. CI was not started. The full Lab test line and `test/sweep.js` pass. Each of the six mutants fails at least one check, and the nine new page checks all fail on PR2's page.

### Tests (run one at a time, on this branch)
- **build-data and build:** OK.
- **calibration.js:** all checks passed.
- **presence.js:** 383 checks passed.
- **shots.js:** passes in all four views (1280/390, light/dark). Overflow 0, no page errors, no broken text.
- **powers.js:** 159/159. Part 1: 15,533 cases match main, and the 8 Safe-passenger cases match through the shim. Without the shim exactly those 8 differ, with the passenger hazard now never, in both passes.
- **ladder.js:** 562/562.
- **sweep.js:** 7,776 contexts, 0 problems.

After the full run I made two small edits:
- I reworded one engine comment. I rebuilt, and the page differs from the tested one only in that comment.
- I guarded one check in powers.js so a mutant fails it cleanly instead of crashing. `powers.js --skip-off` passes 155/155 with it.

### The brief's figures, reproduced
Script: `scratchpad/pr3/figures.js`. Setup: Rex at 3,000 kg, a person thrown 30 m at 45°, default dial, the four powers on.

| Case | Figures |
|---|---|
| Safe passenger on | Least effort 3,342 kg-force (3.68%). Released at 16.4 m/s, goes 30.0 m, lands at 18.0 m/s (like a 16.5 m fall). 14,600 J taken back; momentum 1,630 kg·m/s reaches the ground over 31 ms. Ceiling is plaster: onset 26,990 kg-force (29.8%). |
| Safe passenger off | Least effort 332.7 kg-force (range 3.03 m). Ceiling is the passenger hazard at 334 kg-force (onset 333.4). |
| All-out | 80.8 m/s, lands 668 m away. With the switch on, the launch, drag and landing no longer count. |
| Four powers off, Safe passenger on | No ceiling (PR2 branch: the drag at about 39,600). Plaster reach all-out is 1.36 m from the landing. |

What moved against PR2's engine (`scratchpad/pr3/moved.js`):
- **At 100% air absorbed with the switch on:** identical on both branches. The move at the defaults comes only from flipping the default.
- **Below 100%:** the drag ceiling goes from 78,200 kg-force at 50% and 39,300–39,600 at 0% to none.
- **At a 10⁹ kg dial:** the windows preset goes from 1.78 million to 388 million kg-force, and houses from 1.61 million to 241 million. The ceiling (plaster, about 27,000) and the boom and air hazards (about 1.6 million) are unchanged.

### Mutation results (copies in `scratchpad/pr3/mutants/`)
| Mutant | What fails |
|---|---|
| (a) drag hazard fires with the switch on | powers 5a check, the brief's-figures check, part 1's shim check (both passes), presence's turned-round check |
| (b) landing energy dropped | powers section 7 landing check and brief's figures; the page landing check (engine gives 0 J) |
| (c) landing momentum vanishes from the ground | the section 7 landing check and brief's figures |
| (d) landing blast kept | the section 7 blast check |
| (e) migration skipped | the page's default-and-save-mark check |
| (f) a save marked 2 read as a choice | the same check |

For (c) the check first crashed on a null pulse; I guarded it so it now fails cleanly.

### Changes by area
**Engine (`src/engine.js`)**
- `passengerLaunch`, `passengerDrag`, and `passenger = !o.safePassenger && (launch || drag)`.
- `passengerLanding(r, o)` returns `{ absorbed: r.Eimpact, J }` only when the switch is on and a person lands below 1% of light speed. It lives beside the hazards, so no result gains a key.
- `throwBlast`'s landing part is 0 for a person with the switch on, guarded for calls with no object. The relativistic branch is untouched.
- Comments: the header explains why Safe passenger stays out of `anyPower`, and the PASSENGER block notes the limits apply with the switch off.

**Page (`src/app.html`)**
- `DEFAULTS.safePassenger` is true and `saveV` is 3. `savedV < 3` turns the switch on; the 3,007 kg migration stays on `savedV < 2`.
- A new eyebrow "People they throw or catch", placed between Things keep their form and Air resistance absorbed.
- The intro hint lists it among the defaults. The summary line reads "default powers on" only when all five are on.
- Switch label: "someone they throw or catch feels only a manageable push, spread through their whole body, at the launch, in the air and when they land, so they come down unharmed. The landing's push still reaches the ground, so it shakes the ground as a real landing does; its energy, the harm a fall would do, is taken back. It doesn't cover heating in a very fast flight (Things keep their form does). Only a person is a passenger: Ollie is as tough as Rex."
- Throw text with the switch on: "They land at 18 m/s, like falling 16.5 m. Safe passenger spreads the landing through them too and takes back its energy (14.6 kJ), so they come down unharmed. The landing's push still reaches the ground, so it shakes the ground as a real landing does."
- Throw text with the switch off adds: "With Safe passenger off the lab doesn't judge that fall."
- Where the flight would burn them (Things keep their form off, hot flight): "...but it doesn't cover the heating in flight (below), so the lab can't say they come down unharmed."
- Chip: "Safe passenger: a manageable push, spread through them". The "Lands at" tile reads "14.6 kJ taken back: Safe passenger".
- Impact line for a very fast person: "…all of it taken back by Safe passenger, so no crater, quake or blast where they land."
- Effort box credit: "Safe passenger is on, so it leaves out the person pressed past the ride limits."
- Effort box person line (switch on): "For a person, Safe passenger covers the launch, the air in flight and the landing. The landing's energy is taken back, so they come down unharmed; its push still reaches the ground, and the shaking from it counts." This has heat and no-landing variants.
- Catch: `catchPassengerG` returns null first when the switch is on. The chip reads "Safe passenger: throw, flight and catch spread through them".
- Catch miss for a person: "If Ollie misses, they land X behind him at V. Safe passenger spreads the landing through them and takes back its energy (E), so they come down unharmed, with no crater or blast. Its push still reaches the ground and shakes it."

**Cards (`src/static-data.js`)**
- Card 15: the hazard list says "with Safe passenger off". "Their powers change what counts" gains Safe passenger, and the line about a person's landing is reworded.
- Card 16: "(with Safe passenger off)".
- Card 20: five default powers, named, plus the full Safe passenger paragraph. It covers the landing split, the quick stop rather than a gentle one, heat not covered, and only a person being a passenger.
- Game of catch card: one sentence on a person.

**Data:** `comic_passenger_drag_g` is relabelled "judged with Safe passenger off; since 14 Oct 2026 it covers the drag". Its note is updated and its status unchanged. `data.js` is rebuilt.

**README**
- Intro now says five default powers.
- The test descriptions for shots.js and powers.js are updated.
- New section "Safe passenger on by default (BRIEF-canon.md pull request 3)": what changed, decisions 1–11 in plain words, what moved against PR2, the tests, and that reviews are next.
- Known limits: the passenger-limits bullet is rewritten, and the effort-box credit list gains Safe passenger.

**STATUS.md:** a new In-progress line says pull request 3 is built, with its review rounds next. Everything else is unchanged.

**Tests**
- `powers.js`: part 1 shim and assertions; 5a check rewritten against `passengerDrag`, plus "never with the switch on; off means launch or drag".
- `powers.js` new section 7: the landing split; null cases; the blast; no new keys and `anyPower`; the brief's figures.
- `presence.js`: the drag check is turned round.
- `shots.js`, existing checks:
  - `POWERS_OFF` gets `safePassenger: false, saveV: 3`.
  - The mass-migration expectations move to mark 3, and saves marked 2 or 3 with 3,007 kg keep it.
  - In each view it draws the person throw, the person in Catch and Their powers open, and checks those for overflow and broken text.
- `shots.js`, nine new checks, each failing on PR2's page:
  1. The default and the save mark.
  2. The eyebrow and intro.
  3. The summary line.
  4. The person throw's least effort and ceiling.
  5. The landing text, on and off, matched to the engine.
  6. The hot-flight caveat.
  7. The effort box credit and person line.
  8. The very fast impact.
  9. Catch with a person.

I looked at the screenshots of the person throw, the person in Catch and Their powers at both widths and themes. None scrolls sideways and the text wraps cleanly. The 1280 Their powers picture temporarily un-sticks the sidebar so the whole panel shows.

### Decisions the spec didn't settle
- **Placement and wording:** where the eyebrow sits; "safe passenger" listed after "things keep their form" in the summary; the tile, impact and miss wording.
- **Heat test:** "burns" means Things keep their form off, the air not fully absorbed, and the flight over 1,200 K. The effort box also counts a fireball flight as hot.
- **0% slider read-out:** it said "with all their powers off"; I reworded it to name the three powers it actually needs off, since Safe passenger is now on by default.
- **Card 15:** I dropped "comes down unharmed" from it; the heat caveat lives on card 20.
- **Catch miss:** for a person with the switch on, the miss also drops the blast block and the crater and quake lines.
- **Spec correction:** the spec said a gentle-stop reading would move the ceiling to the boom. In fact there would be no ceiling at the default dial, and the boom (about 1.6 million kg-force) only at a 10⁹ kg dial; the README says this.
- **For the reviewers:**
  - The drag sentence says "a manageable push" even at extreme drag (5,900 g at Mach 7.9 with real air); that follows canon.
  - At the default least effort the person throw also rattles windows 5 m from the landing (the rattle preset is 1,494 kg-force). That isn't a hazard by the lab's rule, but the page now says it by default.
- **Left alone:** the PR2 line in STATUS still says "Pull request 3 … is next", as you asked. The README's Review history has no pull request 3 entry yet.

Scratch scripts are in `scratchpad/pr3/`: `figures.js`, `moved.js`, `gentle.js`, `block.js` (runs only the PR3 page checks against a built page) and the `mutants/` folder. I removed the PR2 worktree I had created; the earlier `main-tree` worktree is untouched.
```

</details>

**Claude · 2026-10-14 19:16:42 UTC**

The PR 3 builder is running. I'll check PR 2's CI run when it has had time to finish.


- `ToolSearch` select:mcp__github__actions_list,mcp__github__actions_get,mcp__github__get_job_logs
- `mcp__github__actions_list` list_workflow_runs test.yml

**Claude · 2026-10-14 19:16:47 UTC**

CI run 60 for PR 2 is in progress. I'll check it when the PR 3 builder reports back.


*Woken · 2026-10-14 19:32:54 UTC · Background task a49e042df6ded7fa6 completed: Agent "Fix PR 2 re-check findings and close out" finished. Next: CI passed on PR 2 (run 60, about 10 minutes, at 68ecb9b). Waiting on the PR 3 builder.*


- `mcp__github__actions_get` get_workflow_run 38622247287

**Claude · 2026-10-14 19:33:02 UTC**

CI passed on PR 2 (run 60, about 10 minutes, at `68ecb9b`). Waiting on the PR 3 builder.


*Stop hook · 2026-10-14 19:33:03 UTC: Stop hook feedback:
[~/.claude/stop-hook-git-check.sh]: There are uncommitted changes in the repository. Please commit and push these changes to the remote branch.*

**Claude · 2026-10-14 19:33:05 UTC**

Those uncommitted changes are the PR 3 builder's work in progress on `claude/canon-3-passenger`. It commits once its full test line passes, so I'm leaving them alone until it reports.


> **Commit** `95a22f9` · 2026-10-14 20:34:47 UTC · Pull request 3 of BRIEF-canon.md: Safe passenger on by default, covering the landing and the drag  [rex-strength-lab]


- `Bash` Check PR 3 branch state and STATUS lines: `git status --short | head; git log --oneline -3; grep -n "Owner's session" STATUS.md | head -5`


*Woken · 2026-10-14 20:35:39 UTC · Background task a7e7d7d7a8e31bc62 completed: Agent "Build PR 3: Safe passenger by default" finished. Next: Pushed. Opening PR 3 (base claude/canon-2-recoil), then review round 1 of its two.*


- `Bash` Fix STATUS, push PR 3, read its README section: `python3 - <<'EOF'` (+9 lines)


> **Commit** `58c5374` · 2026-10-14 20:35:50 UTC · STATUS: CI passed on pull request 2 (#33); pull request 3 built  [rex-strength-lab]

**Claude · 2026-10-14 20:35:55 UTC**

Pushed. Opening PR 3 (base `claude/canon-2-recoil`), then review round 1 of its two.


- `mcp__github__create_pull_request` Rex lab: Safe passenger on by default, covering the landing and the drag (BRIEF-canon.md pull request 3; stacked on #33, merge #33 first) (head claude/canon-3-passenger, base claude/canon-2-recoil)
