# The request, the research and the first build

2026-10-11 17:58:51 UTC to 2026-10-11 19:07:44 UTC. 46 assistant events, 5 commit events, 14 subagent events, 144 tool call events, 1 user events.

The owner asked for BRIEF-presence.md to be built and went to bed. rex-strength-lab/ was claimed in STATUS.md, three research workflows were launched (seven topics: step, attenuation, elephant, thresholds, ripple, comic, growth; each topic checked by a skeptic), and while they ran the engine got effort (the strength used for a push), the restraint solver (goals, hazards, courtesy ceiling, presets), the comic switches, the absorption and growth modes, the two-player effort and a Walk tab on a provisional step model, with an all-out test that compares every move against the engine on main.

Events are in the order they happened in the session; each workflow’s subagents are listed under the call that launched it, with their own start times.

## Owner · 2026-10-11 17:58:51 UTC

```text
Read CLAUDE.md, then rex-strength-lab/BRIEF-presence.md. Build it in the order the brief gives: research with verified facts first, then the Walk tab, effort and the not-so-heroic presets, the comic switches, and the absorption and growth modes, with adversarial review rounds and fixes, then publish the updated Rex lab to its existing live page. Use workflows for the research and review rounds, modelled on history/scratchpad/workflows/.

Work on a claude/ branch. Claim rex-strength-lab/ in STATUS.md first, update it as you go, push regularly, and open a pull request when it's ready for review. Don't merge it yourself. If you run short of time, stop at a clean point and record exactly where in STATUS.md so a second run can pick up. Finish with a history/ entry for this session, like the existing ones.

I'm going to bed, so get as far as you can.
```

**Claude · 2026-10-11 17:58:53 UTC**

I'll start by reading the brief, STATUS.md, and the existing workflow scripts.


- `Bash` Show repo state, recent history, and STATUS.md: `git status && git log --oneline -15 && ls -la && cat STATUS.md`
- `Bash` Read the presence brief: `cat rex-strength-lab/BRIEF-presence.md`
- `Bash` List Rex lab files, history, README and CI: `find rex-strength-lab -type f -not -path '*/node_modules/*' | head -100 && echo ---- && find history -maxdepth 3 | head -80 && cat README.md && cat .github/w...`
- `Bash` Read Rex lab README and file sizes: `cat rex-strength-lab/README.md && wc -l rex-strength-lab/src/* rex-strength-lab/build.js rex-strength-lab/build-data.py rex-strength-lab/test/* && ls -la rex...`
- `Bash` List workflow scripts and read history READMEs: `ls -la history/2026-10-11-build-comparison-step1/scratchpad/workflows history/2026-10-11-build-comparison-step1/scratchpad/wfout history/scratchpad && cat hi...`
- `Bash` Read the research workflow script from the last session: `cat history/2026-10-11-build-comparison-step1/scratchpad/workflows/build-comparison-research-wf_94de1f40-a68.js`
- `Bash` Read the review round 1 workflow script: `cat history/2026-10-11-build-comparison-step1/scratchpad/workflows/build-comparison-review-r1-wf_8b48fe3b-227.js; ls history/scratchpad/workflows`
- `Bash` Create working branch and inspect research JSON format: `git checkout -b claude/rex-presence && python3 -c "` (+10 lines)

**Claude · 2026-10-11 17:59:17 UTC**

Branch `claude/rex-presence` created. Reading the engine and page code next, then claiming STATUS.md and launching the research workflow.


- `Bash` Read build-data.py, build.js and static data: `cat rex-strength-lab/build-data.py | head -150 && cat rex-strength-lab/build.js && cat rex-strength-lab/src/static-data.js | head -c 6000`
- `Bash` Outline the engine's top-level definitions: `cd /home/user/rex-strength-lab/rex-strength-lab && grep -nE "^(function|const|let|var) |^  (function|[a-zA-Z_]+:) |^// ---" src/engine.js | head -300`
- `Bash` Read the start of the engine (constants, bodies): `sed -n 1,130p src/engine.js`
- `Bash` Read crater, quake, blast and penetration functions: `sed -n 580,700p src/engine.js`
- `Bash` Read gravity, moveCheck, weight and lift functions: `sed -n 735,1060p src/engine.js`
- `Bash` Read throw, jump, stomp, punch, clap, sprint, pull: `sed -n 1060,1400p src/engine.js`

**Claude · 2026-10-11 17:59:34 UTC**

Still reading the engine (two-player tests and the strength ladder next), then the page.


- `Bash` Read pushApart and anchorCapacity: `sed -n 189,360p src/engine.js`
- `Bash` Read partner throw and list later engine functions: `sed -n 1600,1700p src/engine.js && grep -n "function \|thresholdDefs\|ladder\|catchGame\|collide" src/engine.js | sed -n 1,400p | awk -F: '$1>1600'`
- `Bash` Read threshold, calibrateComic, exports; locate thresholdDefs: `sed -n 2770,2832p src/engine.js && grep -n "thresholdDefs" src/app.html | head`
- `Bash` Outline the page's functions, sections and tabs: `grep -nE "function [a-zA-Z_]+\(|<section|data-tab|class=\"tab|id=\"[a-z]+\"" src/app.html | head -250`
- `Bash` List all existing research fact keys: `python3 -c "` (+6 lines)

**Claude · 2026-10-11 18:02:02 UTC**

Claiming `rex-strength-lab/` in STATUS.md and pushing before launching research.


- `Bash` Claim the Rex lab in STATUS.md, commit and push: `cd /home/user/rex-strength-lab && python3 - <<'EOF'` (+15 lines)


> **Commit** `078dc58` · 2026-10-11 18:02:07 UTC · STATUS: claim rex-strength-lab/ for the presence brief on claude/rex-presence  [rex-strength-lab]


- `Bash` Check CPU, memory, disk and tool locations: `nproc; free -g | head -2; df -h /tmp | tail -1; ls /opt/pw-browsers; ls /opt/node22/lib/node_modules 2>/dev/null; which node python3; node --version`

**Claude · 2026-10-11 18:03:32 UTC**

Machine has 4 CPUs, so each workflow runs only 2 agents at a time. I'll split research into three concurrent workflows (same script, different topic lists) to get six agents running.


- `Bash` Create scratch dirs; inspect a few existing facts: `mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/{research,wfout,review1,review2,review3} && cd /home/user/...` (+8 lines)
  - result: Exit code 1
  - result: {
  - result: "key": "walking_running_peak_vertical_force",


### Workflow `rex-presence-research` · 2026-10-11 18:05:03 UTC

- `Workflow` rex-presence-research: Research verified facts for the Rex lab presence brief (step forces, ground vibration, elephants, thresholds, the water-glass ripple, comic switches, growth physics), then adversarially verify each topic
  - run `wf_bb193dee-61c`: 6 subagents, listed below

**Subagent `research:step`** · rex-presence-research · started 2026-10-11 18:05:05 UTC

- facts: 42 (22 verified, 14 derived, 4 estimate, 1 disputed, 1 reported).
- Topic "step": I re-read the existing fact walkingrunningpeakverticalforce (Nilsson & Thorstensson 1989), and its quote is correct. Keller et al.

<details>
<summary>Prompt, verbatim (5,935 characters)</summary>

Workflow run `wf_bb193dee-61c`, phase `Research`, agent `a226db41e20de9497`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a226db41e20de9497.txt](prompts/a226db41e20de9497.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

TOPIC "step": the forces and timings of a footstep, from soft-footed to a deliberate heavy stamp, and elephants as the real comparison.
(1) Human walking: peak vertical ground reaction force (existing fact walking_running_peak_vertical_force: check it), stance time, step frequency and preferred speed (e.g. Bohannon 2011 or other normative data), and the heel-strike impact transient (magnitude in body weights, rise time, duration; e.g. Whittle, Keller et al. 1996 Clin Biomech, Verdini et al. 2006). (2) Deliberate heavy steps: foot stamping in military drill (e.g. Carden et al. 2015 BMJ Open Sport Exerc Med "Force and acceleration characteristics of military foot drill"), stomping or heel drops: peak force in body weights, loadi … [1,576 more characters on this line; the full prompt is in prompts/a226db41e20de9497.txt]
```

</details>

**Subagent `research:attenuation`** · rex-presence-research · started 2026-10-11 18:05:06 UTC

- facts: 49 (25 verified, 15 derived, 6 estimate, 3 reported).
- Topic "attenuation": how hard the ground shakes (peak particle velocity, PPV) at 1–200 m from a step of a 3 t body. 49 facts: 25 verified, 15 derived, 6 estimates, 3 reported.

<details>
<summary>Prompt, verbatim (6,213 characters)</summary>

Workflow run `wf_bb193dee-61c`, phase `Research`, agent `a51d3a6710e8b43e1`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a51d3a6710e8b43e1.txt](prompts/a51d3a6710e8b43e1.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

TOPIC "attenuation": ground vibration (peak particle velocity, PPV) at a distance from an impact on the ground surface, at low energies (a 3 t body's footsteps: roughly 10 J to 10 kJ of impact energy, at 1 m to 200 m).
(1) Mayne, Jones & Dumas (1984) "Ground response to dynamic compaction", J. Geotech. Eng. ASCE 110(6):757-774: find the exact law (PPV vs sqrt(W H)/d), the fitted constants and units, upper-bound vs average lines, the data's range of energies, distances and soils. Also Mayne (1985) and Lukas (1986) FHWA/RD-86/133 "Dynamic Compaction for Highway Construction, Vol. 1" (a US government report, likely fetchable from the FHWA or NTL site): PPV vs scaled distance. (2) BS 5228-2:2009+A1:2014 Annex E Table E.1 empirical predictions (dynamic compaction, percussive piling with k_p by ground type, vibrat … [1,771 more characters on this line; the full prompt is in prompts/a51d3a6710e8b43e1.txt]
```

</details>

**Subagent `research:elephant`** · rex-presence-research · started 2026-10-11 18:30:16 UTC

- facts: 30 (15 verified, 11 derived, 3 estimate, 1 reported).
- Topic "elephant": measured ground vibration from elephant footsteps, plus a few other animals, to support the line "about like an elephant walking past". Seven primary studies were fetched and read: Steinmann et al.

<details>
<summary>Prompt, verbatim (5,169 characters)</summary>

Workflow run `wf_bb193dee-61c`, phase `Research`, agent `a283cd1784fe947d7`.

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

TOPIC "elephant": measured seismic (ground) vibration from elephant footfalls and other large animals, to anchor "about like an elephant walking past" with a sourced number.
Find and read: O'Connell-Rodwell, Arnason & Hart (2000) "Seismic properties of Asian elephant (Elephas maximus) vocalizations and locomotion", J. Acoust. Soc. Am. 108(6):3066-3072; Wood, O'Connell-Rodwell & Klemperer (2005) "Using seismic sensors to detect elephants and other large mammals: a potential census technique", J. Appl. Ecol. 42:587-594; Mortimer et al. (2018) "Classifying elephant behaviour through seismic vibrations", Current Biology 28(9):R547-R548 (and its supplement); Reinwald et al. (2021) J. R. Soc. Interface; Szenicer et al. (2022) Remote Sens. Ecol. Conserv. "Seismic savanna"; any others (Günther et al. 2004 GRL; O'Connell-Rodwell 2007 Physiology "Keeping an ear to the ground"). For each: the measured ground velocity (or displacement or acceleration) amplitude and units, distance, ground type, sensor, frequency content, the elephant's gait and mass, detection range, and whether the number is a peak, an RMS or a spectral level. Convert to peak particle velocity in mm/s where the paper allows; say exactly how and label it derived. Also any measurements for horses, cattle, giraffes, or people walking (footstep detection with geophones; e.g. the US Army Research Laboratory or NCPA reports) as further anchors with masses. Recommend which number(s) the page should use for "an elephant walking past at D metres" and how uncertain they are.
```

</details>

**Subagent `verify:step`** · rex-presence-research · started 2026-10-11 18:52:00 UTC

- checks: 42 (36 ok, 6 not ok).
- Not OK: step_alexander2004_dynamic_similarity; step_rex_ollie_heel_strike_estimate; step_rex_ollie_stamp_load (+3 more).
- The sourcing is mostly sound. I re-fetched more than 25 sources (12 Europe PMC abstracts, 6 full texts, the Fukuchi CSV, the Alexander, Ren and Hutchinson pages, the Ren Fig.

<details>
<summary>Prompt, verbatim (79,642 characters)</summary>

Workflow run `wf_bb193dee-61c`, phase `Verify`, agent `aa89e7d1e34b601b8`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/aa89e7d1e34b601b8.txt](prompts/aa89e7d1e34b601b8.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

You are a skeptical fact-checker for the topic "step". Below are the researcher's facts and model recommendation. Re-fetch the cited URLs for every fact the page is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, unit conversion, quotation and status against what the source actually says; recompute every derived number with your own script. Mark ok=false with a correction for anything wrong, mislabelled (a secondary summary presented as the primary paper, an estimate or a fan source marked verified, a sample maximum called a limit, the wrong units or wrong peak/RMS basis), or unsupported. Judge the model recommendation: wrong physics, wrong formula, constants used outside the range they were fitted to, overstated certainty? List important missing items.

RESEARCH:
{
 "summary": "Topic \"step\": I re-read the existing fact walking_running_peak_vertical_force (Nilsson & Thorstensson 1989), and its quote is correct. Keller et al. 1996 confirms the engine's W8.WALK_LOAD = 1.2: they measured 1.2 BW at 1.5 m/s.\n\nThe impact part of a normal step is now measured directly. Baines et al. 2018 (PLOS ONE) found, in barefoot walking at 1.3 m/s:\n- the heel lands at 0.57 m/s downward (0.39–0.78);\n- the impact peak comes 17.5 ms after contact, and heel strike is over in 30 ms;\n- 3.8 J is absorbed per step;\n- the effective mass is about 11% of body mass (Chi & Schmi … [2,943 more characters on this line; the full prompt is in prompts/aa89e7d1e34b601b8.txt]
 "facts": [
  {
   "key": "step_keller1996_walking_grf",
   "category": "step",
   "label": "Peak vertical ground force and loading rate from walking to running (people)",
   "status": "verified",
   "value_si": 1.2,
   "unit_si": "body weights",
   "low_si": 1.2,
   "high_si": 2.5,
   "display": "1.2 × body weight at 1.5 m/s, rising linearly to about 2.5 × at 6 m/s; loading rate 8–30 body weights per second",
   "sources": [
    {
     "title": "Keller et al. (1996), Relationship between vertical ground reaction force and speed during walking, slow jogging, and running, Clin Biomech 11:253 (PubMed 11415629), abstract via Europe PMC API",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:11415629%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'GRF-time histories were recorded for 13 male and 10 female recreational athletes during walking and slow jogging at speeds between 1.5 and 3.0 m s(-1), and running at speeds between 3.5 and 6.0 m s(-1).' and 'In both male and female subjects, F(z) increased linearly during walking and running from 1.2 BW to approximately 2.5 BW at 6.0 m s(-1), remaining constant during forward lean sprinting at higher speeds. F(z) was linearly correlated to G(z), the latter ranging from 8 to 30 BW s(-1) over this speed range.' F(z) is the 'thrust maximum GRF' and G(z) the 'loading rate'. The abstract does not say whether G(z) is an average or an instantaneous rate. This confirms the existing key walking_running_peak_vertical_force, which I re-read through the Europe PMC API (Nilsson & Thorstensson 1989: 'increased with speed from approximately 1.0 to 1.5 b.w.' in walking). Both support W8.WALK_LOAD = 1.2. My inference: if 8 BW/s is the average rate up to the first peak, 1.2 BW is reached in about 0.15 s.",
   "who_when": "Keller, Weisberger, Ray, Hasan, Shiavi & Spengler 1996"
  },
  {
   "key": "step_bohannon2011_normal_walking_speed",
   "category": "step",
   "label": "Normal (comfortable) human walking speed, meta-analysis",
   "status": "verified",
   "value_si": 1.43,
   "unit_si": "m/s",
   "low_si": 0.94,
   "high_si": 1.43,
   "display": "Group means from 0.94 m/s (women 80–99) to 1.43 m/s (men 40–49); 23,111 people",
   "sources": [
    {
     "title": "Bohannon & Williams Andrews (2011), Normal walking speed: a descriptive meta-analysis, Physiotherapy 97:182 (PubMed 21820535), abstract via Europe PMC API",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:21820535%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'Forty-one articles contributed data to the analysis. Combined, they provided data from 23111 subjects. The gait speed was homogeneous within strata and ranged from a mean of 143.4 cm/second for men aged 40 to 49 years to a mean of 94.3 cm/second for women aged 80 to 99 years.' Walks were 3 to 30 m long at a normal pace. The per-decade table is behind a paywall and was not read. value_si is the top group mean, not a typical young adult.",
   "who_when": "Bohannon & Williams Andrews 2011"
  },
  {
   "key": "step_tudorlocke2019_cadence_vs_speed",
   "category": "step",
   "label": "Walking cadence (steps per minute) at set treadmill speeds, adults 21–40",
   "status": "verified",
   "value_si": 1.893,
   "unit_si": "steps/s (Hz)",
   "low_si": 1.602,
   "high_si": 2.15,
   "display": "113.6 steps/min at 3.0 mph (1.34 m/s); 96.1 at 2.0 mph; 129.0 at 4.0 mph",
   "values_json": "{\"speed_mph\":[0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5],\"cadence_steps_per_min_mean\":[45.4,67.8,83.8,96.1,105.8,113.6,121.5,129.0,139.9],\"sd\":[12.4,9.1,8.0,6.5,6.1,6.1,7.0,7.6,9.3],\"n\":[76,76,76,76,75,74,70,62,34],\"cohort\":{\"men_height_cm\":177.1,\"women_height_cm\":164.3,\"all_height_cm\":170.7,\"leg_length_cm_men\":83.5,\"leg_length_cm_women\":76.0,\"leg_length_cm_all\":79.7,\"mass_kg_all\":72.8}}",
   "sources": [
    {
     "title": "Tudor-Locke et al. (2019), Walking cadence (steps/min) and intensity in 21–40 year olds: CADENCE-adults, IJBNPA 16:8 (PMC6337834), full text via Europe PMC",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6337834/fullTextXML"
    }
   ],
   "notes": "Table 'Sample sizes, cadences, VO2, and METs for treadmill bouts': '3.0 | 74 | 113.6 ± 6.1 | 101–127'. These are 76 healthy adults (38 men, 38 women) in 5-minute treadmill bouts, with cadence counted by hand. Bouts ended when people chose to run, so the higher speeds have fewer walkers. Leg length was standing minus seated height ('Leg length was then calculated by subtracting the seated height from standing height'), about 0.47 of stature. That is not hip-joint height. Treadmill walking, not overground.",
   "who_when": "Tudor-Locke et al. 2019"
  },
  {
   "key": "step_fukuchi2018_preferred_froude",
   "category": "step",
   "label": "Comfortable walking speed as a Froude number (young adults, measured)",
   "status": "derived",
   "value_si": 0.18,
   "unit_si": "dimensionless (v²/(g·L))",
   "low_si": 0.1,
   "high_si": 0.29,
   "display": "Comfortable overground walking: Froude number 0.18 ± 0.04 (0.10–0.29), 1.24 m/s, leg 0.51 of height (24 young adults)",
   "sources": [
    {
     "title": "Fukuchi, Fukuchi & Duarte (2018), A public dataset of overground and treadmill walking kinematics and kinetics in healthy individuals, PeerJ 6:e4640 (PMC5922232), full text via Europe PMC",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5922232/fullTextXML"
    },
    {
     "title": "Same dataset, metadata file WBDSinfo.csv (Figshare 10.6084/m9.figshare.5722711)",
     "url": "https://ndownloader.figshare.com/files/68504641"
    }
   ],
   "notes": "I computed this from the dataset's metadata file (script fukuchi_fr.py), using the 'Young' group's overground comfortable-speed trials (n = 24). Mean speed 1.24 ± 0.14 m/s; leg 0.877 m; stature 1.711 m. Fr = v²/(9.81 L) per person: mean 0.182, sd 0.040, min 0.100, max 0.290. Leg/stature = 0.513 ± 0.015. Paper: 'Leg length was measured by assessing the distance from the anterior superior iliac spine (ASIS) to the ipsilateral medial malleolus while the participant lay in a supine position.' The paper calls its dimensionless speed (printed 'v∗=v∕gl0', i.e. v/√(g l0)) a Froude number. I used Alexander's definition, v²/(gL). Barefoot, 10 m walkway, lab conditions.",
   "who_when": "Data: Fukuchi et al. 2018; computation: this research, 2026"
  },
  {
   "key": "step_alexander2004_dynamic_similarity",
   "category": "step",
   "label": "Dynamic similarity: Froude number on hip height; human walking duty factor",
   "status": "verified",
   "value_si": 0.6,
   "unit_si": "duty factor (fraction of stride with the foot down)",
   "low_si": 0.55,
   "high_si": 0.7,
   "display": "Duty factor about 0.7 in very slow walking, falling to 0.55 in fast walking; use hip height as the length; step 0.8–1.2 hip heights",
   "sources": [
    {
     "title": "Alexander (2004), Bipedal animals, and their differences from humans, J Anat 204:321 (PMC1571302)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC1571302/"
    }
   ],
   "notes": "Quotes: 'dynamic similarity is possible only between systems moving at equal Froude numbers, (speed)2/(length × gravitational acceleration).' 'Alexander (1976) and Alexander & Jayes (1983) formulated the hypothesis that similar animals of different sizes, travelling over land at equal Froude numbers, would tend to move in dynamically similar fashion. Strict dynamic similarity would not be possible, because animals of different sizes are generally not geometrically similar' and 'For our characteristic length, we used the height of the hip joint from the ground in normal standing'. 'Humans use duty factors of about 0.7 in very slow walking, falling to about 0.55 in fast walking (for example, see Alexander, 1989).' 'Step lengths both of humans and of ratites are in the range 0.8–1.2(hip height) throughout the range of walking and running speeds' (his 'step length' is the distance travelled while one foot is down). Walking means a duty factor above 0.5. value_si 0.6 is my working middle value. Alexander 1989 (Physiol Rev) and Alexander & Jayes 1983 (J Zool) were not read.",
   "who_when": "Alexander 2004"
  },
  {
   "key": "step_kram1997_walk_run_froude",
   "category": "step",
   "label": "Walk-to-run switch at Froude number about 0.5",
   "status": "verified",
   "value_si": 0.5,
   "unit_si": "dimensionless (v²/(g·L))",
   "display": "People (and other bipeds) switch from walking to running at a Froude number of about 0.5",
   "sources": [
    {
     "title": "Kram, Domingo & Ferris (1997), Effect of reduced gravity on the preferred walk-run transition speed, J Exp Biol 200:821 (PubMed 9076966), abstract via Europe PMC API",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:9076966%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'The ratio of the centripetal and gravitational forces (mv2/L)/(mg) reduces to the dimensionless Froude number (v2/gL). Applying this model to a walking human, m is body mass, v is forward velocity, L is leg length and g is gravity. In normal gravity, humans and other bipeds with different leg lengths all choose to switch from a walk to a run at different absolute speeds but at approximately the same Froude number (0.5).' The inverted-pendulum walk becomes impossible at Fr = 1; people switch earlier, at 0.5.",
   "who_when": "Kram, Domingo & Ferris 1997"
  },
  {
   "key": "step_human_stance_time",
   "category": "step",
   "label": "Human stance time at a normal walk (computed)",
   "status": "derived",
   "value_si": 0.63,
   "unit_si": "s",
   "low_si": 0.58,
   "high_si": 0.74,
   "display": "Each foot is down about 0.6 s per step at 1.34 m/s (0.58–0.74 s)",
   "sources": [
    {
     "title": "Tudor-Locke et al. (2019) CADENCE-adults (cadence at 3.0 mph)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6337834/fullTextXML"
    },
    {
     "title": "Alexander (2004) J Anat (duty factors)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC1571302/"
    }
   ],
   "notes": "Stance = duty factor × stride period. Stride period = 2 / step frequency = 2 / (113.6/60) = 1.057 s (step_tudorlocke2019_cadence_vs_speed). Duty factor 0.55–0.7 (step_alexander2004_dynamic_similarity), with 0.6 as the middle; 0.6 is my choice, not measured at this speed. Cross-check: Baines et al. 2018 measured 1.9 Hz steps at 1.3 m/s, the same stride. I fetched no directly measured stance time. Öberg et al. 1993 (J Rehabil Res Dev) failed TLS verification on the VA site, and I did not bypass it.",
   "who_when": "Computed 2026 from Tudor-Locke 2019 and Alexander 2004"
  },
  {
   "key": "step_baines2018_heel_strike",
   "category": "step",
   "label": "Heel strike in barefoot walking: heel speed, timing, energy absorbed, effective mass",
   "status": "verified",
   "value_si": 0.57,
   "unit_si": "m/s (heel vertical speed at contact)",
   "low_si": 0.39,
   "high_si": 0.78,
   "display": "At 1.3 m/s the heel lands at 0.57 m/s downward; the impact peaks 17.5 ms after contact; heel strike lasts 30 ms; about 3.8 J absorbed per step",
   "values_json": "{\"_format\":\"[overall mean, lowest subject mean, highest subject mean]\",\"walking_speed_m_s\":[1.3,1.1,1.5],\"step_frequency_Hz\":[1.9,1.7,2.1],\"heel_vertical_speed_at_contact_m_s\":[0.57,0.39,0.78],\"heel_vertical_speed_at_impact_peak_m_s\":[0.52,0.35,0.75],\"time_to_impact_peak_ms\":[17.5,12.0,23.3],\"heel_strike_duration_ms\":[29.8,20.0,45.2],\"vertical_foot_ankle_compression_mm\":[12.9,9.5,15.5],\"energy_absorbed_total_J\":[3.8,1.4,6.9],\"energy_absorbed_vertical_J\":[2.7,1.2,4.6],\"effective_mass_to_end_pct_body_mass\":[11.1,8.6,19.5],\"effective_mass_to_peak_pct\":[17.6,9.3,46.8],\"effective_mass_ChiSchmitt_method_pct\":[4.1,3.5,5.2]}",
   "sources": [
    {
     "title": "Baines, Schwab & van Soest (2018), Experimental estimation of energy absorption during heel strike in human barefoot walking, PLOS ONE 13:e0197428 (PMC6023236), full text via Europe PMC",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6023236/fullTextXML"
    }
   ],
   "notes": "Table 1, 12 healthy adults (4 men, 8 women), 76.7 ± 15 kg, barefoot, preferred speed, force plate synchronised with Optotrak. Quotes: 'the vertical heel velocity remained more or less constant during the initial part of heel strike (Table 1: on average ŻH(t0) = −0.57 m/s and ŻH(tp) = −0.52 m/s)'. 'The mechanical energy loss of heel strike is around 3.8 J for preferred walking speeds (≈ 1.3 m/s)'. 'The improved application of the effective foot mass model resulted in ... ΔEe = −2.5 ± 0.9 J, with corresponding foot mass Me = 11 ± 3% of bodyweight.' The size of the impact peak in body weights is shown only in a figure, not tabulated. Heights and leg lengths were not reported. This is the best direct measurement found, and it conflicts with Winter 1992 (step_winter1992_heel_contact_velocity).",
   "who_when": "Baines, Schwab & van Soest 2018"
  },
  {
   "key": "step_chi_schmitt2005_effective_mass",
   "category": "step",
   "label": "Effective mass stopped at heel strike (older method)",
   "status": "verified",
   "value_si": 0.063,
   "unit_si": "fraction of body mass",
   "low_si": 0.037,
   "high_si": 0.063,
   "display": "6.3% of body mass in walking (5.3% running, 3.7% crouched walking); 0.24–3.99 J at impact",
   "sources": [
    {
     "title": "Chi & Schmitt (2005), Mechanical energy and effective foot mass during impact loading of walking and running, J Biomech 38:1387 (PubMed 15922749), abstract via Europe PMC API",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:15922749%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'The magnitude of Meff as a percentage of body mass (M(B)) varies with knee angle at impact and significantly differs among gaits: 6.3%M(B) in walking, 5.3%M(B) in running, and 3.7%M(B) in crouched walking.' and 'At the instant prior to heel strike, Etot ranges from 0.24 to 3.99 J.' Baines et al. 2018 show that this method's assumption (heel speed zero at the impact peak) is not met. With synchronised data they get 11% (to the end of heel strike). Treat 6.3% as a low estimate. Published estimates span 4–18% of body mass.",
   "who_when": "Chi & Schmitt 2005"
  },
  {
   "key": "step_winter1992_heel_contact_velocity",
   "category": "step",
   "label": "Heel speed at contact (older marker study)",
   "status": "disputed",
   "value_si": 0.87,
   "unit_si": "m/s (horizontal)",
   "display": "Heel contact: vertical speed 'negligible', horizontal 0.87 m/s",
   "sources": [
    {
     "title": "Winter (1992), Foot trajectory in human gait: a precise and multifactorial motor control task, Phys Ther 72:45 (PubMed 1728048), abstract via Europe PMC API",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:1728048%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'Heel-contact velocity was negligible vertically and small (0.87 m/s) horizontally.' 11 subjects, 10 walking trials each. Disputed: Baines et al. 2018 measured 0.57 m/s downward at contact with synchronised high-rate force and motion data. My reading is that the marker data were smoothed through the contact instant; the full text is paywalled and was not read. Use Baines for the impact calculation.",
   "who_when": "Winter 1992"
  },
  {
   "key": "step_verdini2006_hst_incidence",
   "category": "step",
   "label": "How often a heel-strike transient appears in barefoot walking",
   "status": "verified",
   "value_si": 0.76,
   "unit_si": "fraction of trials (sharp transient)",
   "display": "A sharp heel-strike spike appears in 76% of barefoot walking trials (smooth 13%, none 11%)",
   "sources": [
    {
     "title": "Verdini et al. (2006), Identification and characterisation of heel strike transient, Gait Posture 23:77 (PubMed 16263287), abstract via Europe PMC API",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:16263287%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'A short-lived sharp HST was present in 76% of the trials while a smooth HST, of longer duration was seen in 13.3% of the trials. The transient phenomenon was absent in the remaining 10.7% of trials.' The size (in body weights) and rise time are not in the abstract, and the full text is paywalled. Whittle 1999 (Gait Posture review) was also not readable.",
   "who_when": "Verdini, Marcucci, Benedetti & Leo 2006"
  },
  {
   "key": "step_blackburn2016_hst_timing",
   "category": "step",
   "label": "Timing of the heel-strike transient after contact",
   "status": "verified",
   "value_si": 0.0135,
   "unit_si": "s",
   "low_si": 0.011,
   "high_si": 0.016,
   "display": "The heel-strike spike peaks 11–16 ms after the foot touches down",
   "sources": [
    {
     "title": "Blackburn et al. (2016), Comparison of three methods for identifying the heelstrike transient during walking gait, Med Eng Phys 38:581 (PubMed 27118622), abstract via Europe PMC API",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:27118622%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'Twenty-eight healthy subjects walked at a self-selected pace' and 'the Radin and Modified Hunt methods identifying the HST 11-16ms following ground contact and the Hunt method identifying the HST 83-122ms following ground contact.' The 83–122 ms result is a different feature (the loading peak). Consistent with Baines et al. 2018 (impact peak at 17.5 ms, 12–23).",
   "who_when": "Blackburn, Pietrosimone, Harkey, Luc & Pamukoff 2016"
  },
  {
   "key": "step_yoon2025_quiet_walking",
   "category": "step",
   "label": "Soft-footed walking: how much people cut their footstep impact when asked to walk quietly",
   "status": "verified",
   "value_si": 0.446,
   "unit_si": "fractional reduction in impact loading rate",
   "low_si": 0.446,
   "high_si": 0.692,
   "display": "Walking quietly cuts the impact loading rate by 45% (heel-first, 29% slower) to 69% (toe- or flat-footed, 23% slower)",
   "sources": [
    {
     "title": "Yoon et al. (2025), How to walk to reduce footstep noise in multi-story residential buildings, Ergonomics (PubMed 38186284), abstract via Europe PMC API",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:38186284%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'participants who struck the ground with the rearfoot reduced the impact loading rate by 44.6% with 29.3% slower walking speed than normal walking. Those who struck with the fore- or mid-foot reduced the impact loading by 69.2% with a 23.4% decrease in speed. Quiet walking with the non-rearfoot strike pattern reduced the impact loading by 48.7%, even when asked to walk as fast as normal walking.' 26 young participants. The abstract gives no change in peak force: the weight still has to be carried, so the peak stays near body weight. Anchors the 'soft-footed' end of effort.",
   "who_when": "Yoon, Kwon, Yoon, Choi & Shin 2025"
  },
  {
   "key": "step_carden2015_drill_peak_force",
   "category": "step",
   "label": "Peak force of army drill stamps (deliberate straight-leg heel stamp)",
   "status": "verified",
   "value_si": 6.5,
   "unit_si": "body weights",
   "low_si": 3.1,
   "high_si": 6.6,
   "display": "Drill stamps: 3.1–6.6 × body weight (trained men 5.9–6.6, untrained men 3.7–4.6, trained women 3.1–4.1); marching 1.1–1.3",
   "values_json": "{\"units\":\"multiples of body weight, mean (SD)\",\"columns\":[\"March\",\"Halt\",\"To attention\",\"To ease\",\"Right turn\",\"Left turn\"],\"trained_women\":[\"1.1 (0.1)\",\"4.1 (1.3)\",\"3.4 (0.8)\",\"3.1 (0.8)\",\"3.5 (0.9)\",\"3.5 (0.9)\"],\"trained_men\":[\"1.2 (0.1)\",\"6.5 (1.5)\",\"6.1 (1.2)\",\"6.2 (1.5)\",\"5.9 (1.6)\",\"6.6 (1.7)\"],\"untrained_men\":[\"1.3 (0.2)\",\"4.4 (1.1)\",\"4.3 (1.1)\",\"3.7 (0.7)\",\"4.2 (0.9)\",\"4.6 (1.1)\"]}",
   "sources": [
    {
     "title": "Carden et al. (2015), Force and acceleration characteristics of military foot drill: implications for injury risk in recruits, BMJ Open Sport Exerc Med 1:e000025 (PMC5117012), full text via Europe PMC",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5117012/fullTextXML"
    }
   ],
   "notes": "Table 3. Participants: 24 trained soldiers (12 men, 81.5 kg, 180 cm; 12 women, 66.6 kg) and 12 untrained men (70.6 kg). All wore Combat Assault Boots. Kistler plates at 1,000 Hz; peak = 'highest instantaneous vertical ground reaction force'. Technique, quoted: 'an exaggerated stamping of one foot into the ground from 90° hip flexion'. 'Soldiers performing drill manoeuvres are instructed to flex the hip to around 90°, and then stamp the heel in to the ground as hard as possible in an attempt to make a ‘loud noise’.' 'The experimenters observed that all participants impacted the ground with a straight leg'. The trained men's higher values partly reflect body mass and practised technique. Contact duration and foot speed were not reported.",
   "who_when": "Carden, Izard, Greeves, Lake & Myers 2015"
  },
  {
   "key": "step_carden2015_drill_loading_rate",
   "category": "step",
   "label": "Loading rate of army drill stamps",
   "status": "verified",
   "value_si": 983,
   "unit_si": "body weights per second",
   "low_si": 316,
   "high_si": 983,
   "display": "Drill stamps load the ground at 316–983 body weights per second (marching 42–70)",
   "values_json": "{\"units\":\"BW/s, mean (SD), peak instantaneous\",\"columns\":[\"March\",\"Halt\",\"To attention\",\"To ease\",\"Right turn\",\"Left turn\"],\"trained_women\":[\"42 (14)\",\"461 (254)\",\"343 (98)\",\"316 (99)\",\"343 (117)\",\"324 (123)\"],\"trained_men\":[\"64 (31)\",\"983 (333)\",\"832 (201)\",\"924 (309)\",\"794 (266)\",\"928 (300)\"],\"untrained_men\":[\"70 (27)\",\"491 (169)\",\"499 (118)\",\"420 (60)\",\"515 (138)\",\"536 (179)\"],\"peak_tibial_acceleration_trained_men_halt_m_s2\":\"207 (57)\"}",
   "sources": [
    {
     "title": "Carden et al. (2015), BMJ Open Sport Exerc Med (PMC5117012), Table 4",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5117012/fullTextXML"
    }
   ],
   "notes": "Loading rate was 'calculated as the first derivative of vertical ground reaction and time using finite difference method', taking the largest instantaneous value, with the force filtered at 100 Hz. Discussion: 'the highest loading rate measured by Munro et al11 for running (113 BW/s at 5 m/s) was only around a third of our lowest recorded value.'",
   "who_when": "Carden et al. 2015"
  },
  {
   "key": "step_rawcliffe2020_drill_time_to_peak",
   "category": "step",
   "label": "Time from contact to peak force in drill stamps",
   "status": "verified",
   "value_si": 0.026,
   "unit_si": "s",
   "low_si": 0.016,
   "high_si": 0.036,
   "display": "Drill stamps reach peak force 16–36 ms after contact; peaks above 5 × body weight and 350 body weights per second",
   "sources": [
    {
     "title": "Rawcliffe et al. (2020), The effects of British Army footwear on ground reaction force and temporal parameters of British Army foot drill, J Strength Cond Res 34:754 (PubMed 28800005), abstract via Europe PMC API",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:28800005%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'the mean of 8 trials from 15 recreationally active men were collected from 4 foot drills' and 'Foot drill produced peak vGRF and peak vertical rate of force development in excess of 5 bw, and 350 bw·s, respectively. Time to peak vGRF ranged from 0.016 to 0.036 ms across foot drills'. The printed unit 'ms' must be seconds. 0.016 ms would need about 300,000 BW/s, against the 350 BW/s reported, while 5 BW in 0.016–0.036 s averages 140–310 BW/s, which fits. Three footwear types; the training shoe attenuated most. value_si is the midpoint of the range (my choice).",
   "who_when": "Rawcliffe, Graham, Simpson, Moir, Martindale, Psycharakis & Connaboy 2020"
  },
  {
   "key": "step_decker2003_drop_landing",
   "category": "step",
   "label": "60 cm drop landing: peak force",
   "status": "reported",
   "value_si": 3.4,
   "unit_si": "body weights",
   "display": "Landing from a 60 cm drop: about 3.4 × body weight (as cited by Carden et al.)",
   "sources": [
    {
     "title": "Carden et al. (2015), citing Decker et al. (2003) Clin Biomech 18:662",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5117012/fullTextXML"
    },
    {
     "title": "Decker et al. (2003) abstract (does not state the force), via Europe PMC API",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:12880714%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Carden: 'Mean drill manoeuvre peak vertical impact forces for TRAINED men (6.3 BW), women (3.5 BW) and UNTRAINED men (4.2 BW) were 41%, 3% and 13% greater than those reported by Decker et al30 for a 60 cm drop landing (3.4 BW).' Decker's abstract does not give the force, so this is not verified at the source. Physics: a 0.60 m drop lands at √(2gh) = 3.4 m/s. People landing from drops bend their knees; drill stamps are straight-legged, hence the higher loading rates.",
   "who_when": "Decker et al. 2003, via Carden et al. 2015"
  },
  {
   "key": "step_ansur_leg_proportions",
   "category": "step",
   "label": "Human leg proportions: crotch, hip (trochanter) and knee heights as fractions of stature",
   "status": "derived",
   "value_si": 0.5128,
   "unit_si": "fraction of stature (trochanterion height)",
   "display": "US Army men (n = 4,082): crotch 0.48, hip (top of thigh bone) 0.51, knee 0.28 of height; thigh about 0.23",
   "sources": [
    {
     "title": "ANSUR II public data (Gordon et al. 2014), men, as stored in this repo at build-calculator/data/ansur2/ANSUR_II_MALE_Public.csv",
     "url": "https://www.openlab.psu.edu/ansur2/"
    }
   ],
   "notes": "I computed per-person ratios to stature from the repo's ANSUR II men file: crotchheight 0.4815 (sd 0.0141); trochanterionheight 0.5128 (sd 0.0152); lateralfemoralepicondyleheight (knee) 0.2799 (sd 0.0080); mean stature 1,756 mm. The trochanterion (top of the greater trochanter) is a surface landmark near hip-joint height, not identical to it. Hip sits 0.031 of stature above the crotch. Thigh about 0.5128 − 0.2799 = 0.233 of stature.",
   "who_when": "Data: Gordon et al. 2014; ratios computed 2026"
  },
  {
   "key": "step_rex_ollie_hip_height_estimate",
   "category": "step",
   "label": "Rex's and Ollie's hip height (leg length for gait scaling)",
   "status": "estimate",
   "value_si": 1.37,
   "unit_si": "m",
   "low_si": 1.28,
   "high_si": 1.46,
   "display": "Hip height about 0.45 of height: 1.37 m (1.28–1.46 m)",
   "sources": [
    {
     "title": "Owner's turnaround art: build-comparison/assets/rex-turnaround.png and ollie-turnaround.png (front views), measured here",
     "url": "https://www.openlab.psu.edu/ansur2/"
    }
   ],
   "notes": "Our own measurement, not published. Rex's front view: crest tip at y≈13 px, sole y≈750, crotch (lowest point of the briefs between the thighs) y≈445, so the crotch is at 0.414 H. Ollie: horn tips y≈18, soles y≈775, crotch y≈462, so 0.413 H. Adding the human crotch-to-hip gap (0.031 H, step_ansur_leg_proportions) gives 0.445 H for both; scaling by the human ratio gives 0.44 H. The range 0.42–0.48 H covers reading error (±5 px ≈ ±0.007 H) and the unknown hip-joint position inside such massive thighs (the joint is hidden). The engine already uses Lleg = 0.45 H in groundUnderWeight. Heights to crest and horn tips are canon (3.048 m). Rex is drawn with his whole sole down. Whether he walks heel-first like a person is not canon.",
   "who_when": "Measured 2026"
  },
  {
   "key": "step_rex_ollie_preferred_walk_speed",
   "category": "step",
   "label": "Rex's and Ollie's comfortable walking pace (people scaled up at equal Froude number)",
   "status": "derived",
   "value_si": 1.6,
   "unit_si": "m/s",
   "low_si": 1.16,
   "high_si": 1.98,
   "display": "About 1.6 m/s (5.8 km/h); 1.2 m/s at an elephant-like Froude 0.1; 2.0 m/s brisk",
   "sources": [
    {
     "title": "Fukuchi et al. (2018) dataset (preferred Froude number)",
     "url": "https://ndownloader.figshare.com/files/68504641"
    },
    {
     "title": "Alexander (2004) J Anat (dynamic similarity)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC1571302/"
    }
   ],
   "notes": "v = √(Fr g h), with h = 1.37 m (1.28–1.46). Fr 0.18 gives 1.56 m/s (1.50–1.61 across h); Fr 0.10 gives 1.16; Fr 0.29 gives 1.98. Matching CADENCE's 1.34 m/s human (Fr 0.209 on hip height 0.875 m) gives 1.68 m/s. Assumes they walk like people scaled up, so it ignores their bulk (wide thighs, wide stance), boots and personal choice. It is only a default pace. Elephants pick lower Froude numbers (about 0.1; step_elephant_preferred_froude).",
   "who_when": "Computed 2026"
  },
  {
   "key": "step_rex_ollie_walk_run_speed",
   "category": "step",
   "label": "Speed where Rex or Ollie would break into a run",
   "status": "derived",
   "value_si": 2.59,
   "unit_si": "m/s",
   "low_si": 2.51,
   "high_si": 2.68,
   "display": "Walk-to-run switch near 2.6 m/s (9.3 km/h)",
   "sources": [
    {
     "title": "Kram, Domingo & Ferris (1997) (Fr 0.5)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:9076966%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "v = √(0.5 × 9.81 × h): 2.59 m/s at h = 1.37 m (2.51–2.68 for h = 1.28–1.46). Kram measured this with leg length; the engine should use the same hip height throughout. Above this, the walking step model (about 1.2 BW) no longer applies; running loads are 2–3 BW (walking_running_peak_vertical_force).",
   "who_when": "Computed 2026"
  },
  {
   "key": "step_rex_ollie_step_frequency",
   "category": "step",
   "label": "Rex's and Ollie's step rate and step length at a comfortable walk",
   "status": "derived",
   "value_si": 1.49,
   "unit_si": "steps/s (Hz)",
   "low_si": 1.3,
   "high_si": 1.58,
   "display": "About 88–91 steps per minute (1.5 per second), each step about 1.1 m",
   "values_json": "{\"fit\":\"f_hat = f*sqrt(h/g) = 0.789 * Fr^0.211 (CADENCE-adults 2.0-4.0 mph, hip h = 0.5128 x 1.707 m)\",\"Rex_Ollie_h_1.37m\":{\"Fr\":[0.05,0.10,0.18,0.25,0.50],\"speed_m_s\":[0.82,1.16,1.56,1.83,2.59],\"steps_per_min\":[67,78,88,95,109],\"step_length_m\":[0.73,0.89,1.06,1.16,1.42],\"stance_s_at_duty_0.6\":[1.07,0.92,0.82,0.76,0.66]}}",
   "sources": [
    {
     "title": "Tudor-Locke et al. (2019) CADENCE-adults (cadence table)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6337834/fullTextXML"
    }
   ],
   "notes": "Dimensionless step rate f̂ = f √(h/g). CADENCE cohort: stature 1.707 m, so hip ≈ 0.875 m (ANSUR ratio). At 3.0 mph, f̂ = 1.893 × √(0.875/9.81) = 0.566 and Fr = 0.209. A power fit over 2.0–4.0 mph gives f̂ = 0.789 Fr^0.211. For h = 1.37 m: at Fr 0.209 (1.68 m/s), f = 0.566 √(9.81/1.37) = 1.51 Hz (91/min), step 1.11 m; at Fr 0.18 (1.56 m/s), 1.47 Hz (88/min), step 1.06 m. Equal-Froude scaling makes every time 1.25× longer than the human's (√(1.37/0.875)). Treadmill data. Assumes human-like gait.",
   "who_when": "Computed 2026"
  },
  {
   "key": "step_rex_ollie_stance_time",
   "category": "step",
   "label": "How long each of Rex's or Ollie's feet stays down per step",
   "status": "derived",
   "value_si": 0.8,
   "unit_si": "s",
   "low_si": 0.73,
   "high_si": 0.93,
   "display": "About 0.8 s per footfall at a comfortable walk (0.73–0.93 s)",
   "sources": [
    {
     "title": "Alexander (2004) J Anat (duty factor 0.55–0.7)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC1571302/"
    },
    {
     "title": "Tudor-Locke et al. (2019) CADENCE-adults",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6337834/fullTextXML"
    }
   ],
   "notes": "Stance = duty factor × 2 / f. At f = 1.47–1.51 Hz the stride is 1.32–1.36 s; duty 0.55–0.7 gives 0.73–0.93 s; 0.6 gives 0.79–0.82 s. This equals the human 0.63 s × 1.25. Compare an elephant: 1.5 s for an African elephant's hind foot at 1.2 m/s (step_hutchinson2006_elephant_timing).",
   "who_when": "Computed 2026"
  },
  {
   "key": "step_rex_ollie_walking_foot_load",
   "category": "step",
   "label": "Load on one foot at each walking step, and pressure under it",
   "status": "derived",
   "value_si": 35400,
   "unit_si": "N",
   "low_si": 29500,
   "high_si": 44200,
   "display": "35 kN (about 3.6 tonnes-force) per step at 1.2 × body weight; Rex's paw 114 kPa, Ollie's boot 236 kPa",
   "sources": [
    {
     "title": "Keller et al. (1996) and the existing key walking_running_peak_vertical_force (1.0–1.5 BW)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:11415629%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "1.2 × 3,007 kg × 9.81 = 35.4 kN; the range is 1.0–1.5 BW (29.5–44.2 kN). Pressure = force / sole area (existing key rex_ollie_picture_build: Rex 0.31 m², Ollie 0.15 m²). Rex: 95 / 114 / 143 kPa; Ollie: 197 / 236 / 295 kPa at 1.0 / 1.2 / 1.5 BW. These are averages over the sole; real soles load unevenly (an elephant's local peaks are about twice its average). A walking biped puts its whole weight on one foot at a time, so the peak is about 1.2 BW per foot. Floor: averaged over a stride, each stance must carry M g × stride / (2 × stance) = 1/(2 × duty) ≈ 0.83 BW, so even soft-footed walking cannot drop the peak much below about 0.9–1.0 BW.",
   "who_when": "Computed 2026"
  },
  {
   "key": "step_rex_ollie_heel_strike_estimate",
   "category": "step",
   "label": "Impact part of one of Rex's or Ollie's normal steps (heel strike, scaled from people)",
   "status": "estimate",
   "value_si": 160,
   "unit_si": "J",
   "low_si": 80,
   "high_si": 410,
   "display": "Roughly 100–250 J absorbed at each heel strike, over about 20–40 ms (rough)",
   "sources": [
    {
     "title": "Baines et al. (2018) PLOS ONE (human heel strike)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6023236/fullTextXML"
    }
   ],
   "notes": "Scaled at equal Froude number, energy goes as M g h. Human (Baines): 3.8 J total and 2.7 J vertical for 76.7 kg. I assumed hip height 0.90 m (stature about 1.75 m; not reported). That gives E/(M g h) = 5.6e-3 total and 4.0e-3 vertical. For Rex and Ollie (3,007 kg, h 1.37 m): 228 J total (84–413 across subject means) and 162 J vertical. Cross-check by ½ m_e v²: heel speed 0.57 × √(1.37/0.90) = 0.70 m/s (0.48–0.96), effective mass 4–18% (123–529 kg), giving 31–131 J (83 J at 11%). The impact peak would come at about 22 ms and heel strike end at about 37 ms if the timing scaled the same way, but heel-pad stiffness does not scale with size, so timing is uncertain. Assumes heel-first walking. Ollie's boots would soften and lengthen the spike (Lafortune & Hennig 1992: harder midsoles transmit more shock; no number). Small next to the weight-bearing load (35 kN for about 0.8 s).",
   "who_when": "Estimated 2026"
  },
  {
   "key": "step_stamp_contact_speed_estimate",
   "category": "step",
   "label": "How fast the foot meets the ground in a deliberate stamp",
   "status": "estimate",
   "value_si": 3.7,
   "unit_si": "m/s",
   "low_si": 3.7,
   "high_si": 6.5,
   "display": "Rex or Ollie stamping from thigh-horizontal: about 3.7 m/s by gravity alone, perhaps up to 6.5 m/s driven (people: 2.9 and 3–5 m/s)",
   "sources": [
    {
     "title": "Carden et al. (2015) (stamp from 90° hip flexion)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5117012/fullTextXML"
    },
    {
     "title": "ANSUR II public data (thigh 0.233 of stature)",
     "url": "https://www.openlab.psu.edu/ansur2/"
    }
   ],
   "notes": "No measured foot speed for a drill stamp was found. With the thigh horizontal and the shin vertical, the foot is raised about one thigh length (0.233 H): 0.42 m for a 1.80 m man, so 2.9 m/s falling freely. A driven stamp is faster; 3–5 m/s is my guess. For a 3.048 m body: 0.71 m, so 3.7 m/s by gravity, and 3.9–6.5 m/s if human driven speeds scale by √1.70. Impulse check: a half-sine pulse peaking at 6.5 BW over 2 × (16–36 ms) delivers 0.13–0.30 BW·s. Less the body-weight share, that is M × (1.0–2.2 m/s) of momentum. A leg alone (16% of mass, existing key segment_mass_fraction_whole_leg) at 3–5 m/s supplies only M × 0.5–0.8 m/s. So a stamp also arrests part of the body's fall: its effective mass is well above a walking heel strike's, perhaps a third to a half of body mass. Impact energy for Rex and Ollie, ½ m_e v²: 1.3 kJ (the engine's legEff, 183 kg, at 3.7 m/s); 3.3 kJ (whole leg at 3.7 m/s); 10 kJ (half the body at 3.7 m/s); up to 32 kJ (half the body at 6.5 m/s).",
   "who_when": "Estimated 2026"
  },
  {
   "key": "step_rex_ollie_stamp_load",
   "category": "step",
   "label": "Force of a deliberate drill-style stamp by Rex or Ollie (human effort, scaled)",
   "status": "derived",
   "value_si": 192000,
   "unit_si": "N",
   "low_si": 100000,
   "high_si": 195000,
   "display": "A soldier-style stamp: 4–6.5 × body weight, 130–190 kN; Rex's paw 420–620 kPa, Ollie's boot 870–1,280 kPa",
   "sources": [
    {
     "title": "Carden et al. (2015) (drill stamp multiples)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5117012/fullTextXML"
    },
    {
     "title": "Rawcliffe et al. (2020) (time to peak)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:28800005%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Multiples × 29.5 kN: 3.4 BW (drop landing, reported) 100 kN; 4.4 BW (untrained men) 130 kN; 6.5 BW (trained men) 192 kN. Pressure on Rex's 0.31 m² paw: 324 / 419 / 619 kPa; on Ollie's 0.15 m² boot: 669 / 865 / 1,278 kPa. Loading rates of 300–1,000 BW/s give 9–29 MN/s. Time to peak 16–36 ms in people, about 20–45 ms if scaled by 1.25 (uncertain). This assumes they stamp like soldiers at human effort; above that, the existing Stomp model takes over.",
   "who_when": "Computed 2026"
  },
  {
   "key": "step_elephant_body_mass_larramendi2016",
   "category": "step",
   "label": "Body mass of average adult elephants, by species and sex",
   "status": "verified",
   "value_si": 3000,
   "unit_si": "kg (African bush elephant cow)",
   "low_si": 2000,
   "high_si": 6000,
   "display": "Average adults in good condition: African bush bull 6.0 t (3.20 m at the shoulder), cow 3.0 t (2.60 m); Asian bull 4.0 t (2.75 m), cow 2.7 t (2.40 m); African forest bull 2.0 t (2.20 m)",
   "values_json": "{\"African bush (Loxodonta africana)\":{\"male\":{\"shoulder_m\":3.20,\"mass_kg\":6000},\"female\":{\"shoulder_m\":2.60,\"mass_kg\":3000}},\"Asian (Elephas maximus)\":{\"male\":{\"shoulder_m\":2.75,\"mass_kg\":4000},\"female\":{\"shoulder_m\":2.40,\"mass_kg\":2700}},\"African forest (Loxodonta cyclotis)\":{\"male\":{\"shoulder_m\":2.20,\"mass_kg\":2000}},\"Laws_1975_male_formula\":\"BM(kg) = 5.07e-4 x SH(cm)^2.803 (underestimates; poor-condition population)\"}",
   "sources": [
    {
     "title": "Larramendi (2016), Shoulder height, body mass, and shape of proboscideans, Acta Palaeontol Pol 61(3):537–574 (open access PDF)",
     "url": "https://app.pan.pl/archive/published/app61/app001362014.pdf"
    }
   ],
   "notes": "Quotes (p. 550–551): 'the average shoulder height in good conditions for this species is 260 cm for females and 320 cm for males'. 'the body mass of an average-sized African male bush elephant at 320 cm in good condition is expected to be around 6000 kg'. 'at 260 cm shoulder height a body mass of 3000 kg (non-pregnant) is expected in good conditions'. 'An average-sized male E. maximus (275 cm), in optimal conditions, is about 4000 kg and an average fully grown female elephant (non-pregnant) is around 2700 kg'. 'an average African forest elephant male of 220 cm at the shoulders should be around 2000 kg'. Caveat, also from the paper: older Asian-elephant weights came from 'clearly obese animals' in captivity, some '60–85% heavier'. Zoo animals vary widely; Hutchinson 2006's heaviest was a 4,632 kg African female.",
   "who_when": "Larramendi 2016 (compiling Laws 1966, Laws et al. 1975, Hanks 1972, Sukumar et al. 1988 and others)"
  },
  {
   "key": "step_elephant_match_3007kg",
   "category": "step",
   "label": "Which elephant weighs as much as Rex or Ollie",
   "status": "derived",
   "value_si": 1,
   "unit_si": "ratio to an average African bush elephant cow",
   "display": "3,007 kg = an average adult female African elephant; 1.1 × an Asian cow, 0.75 × an Asian bull, half an African bull",
   "sources": [
    {
     "title": "Larramendi (2016) Acta Palaeontol Pol",
     "url": "https://app.pan.pl/archive/published/app61/app001362014.pdf"
    }
   ],
   "notes": "3,007 / 3,000 = 1.00 (African bush cow); / 2,700 = 1.11 (Asian cow); / 4,000 = 0.75 (Asian bull); / 6,000 = 0.50 (African bull); / 2,000 = 1.50 (forest bull). The accurate phrase is 'as heavy as a female African elephant', not 'an African elephant' (people picture a bull, twice as heavy).",
   "who_when": "Computed 2026"
  },
  {
   "key": "step_ren2010_elephant_limb_forces",
   "category": "step",
   "label": "Elephant walking: peak vertical force on each foot",
   "status": "verified",
   "value_si": 0.55,
   "unit_si": "body weights (forefoot, normal walk, read from figure)",
   "low_si": 0.36,
   "high_si": 1,
   "display": "Walking Asian elephants: about 0.55 × body weight on a forefoot, 0.36 × on a hind foot; never above 1 × (fore) or 0.7 × (hind) at any speed; 60% of weight on the forelimbs",
   "sources": [
    {
     "title": "Ren, Miller, Lair & Hutchinson (2010), Integration of biomechanical compliance, leverage, and power in elephant limbs, PNAS 107:7078 (PMC2872429)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2872429/"
    },
    {
     "title": "Same paper, Figure 1 (image read for the walking peaks)",
     "url": "https://cdn.ncbi.nlm.nih.gov/pmc/blobs/63b2/2872429/ad359a354f36/pnas.0911396107fig01.jpg"
    }
   ],
   "notes": "Quotes: 'peak vertical GRFs were ~50% higher for the forelimbs than for the hindlimbs (corresponding to a weight distribution of ~60% on the forelimbs)'. 'Maximal vertical GRFs were <1 body weight (BW) for each forelimb and <0.7 BW for each hindlimb.' 'Six juvenile Asian elephants (mean age, 8.5 ± 3.0 years; mean mass, 2,291 ± 669 kg; mean hip height, 1.52 ± 0.19 m'. Figure 1A covers 'normal walking ... at dimensionless speeds ... of 0.30–0.35 ... and velocities of ~1.2'. From the figure I read the forelimb trace peaking near 0.55 BW and the hindlimb near 0.36 BW (±0.03; small 408×201 px image). 'compliant limbs dampen impact accelerations and keep peak GRFs low'. Juveniles, not 3-tonne adults.",
   "who_when": "Ren, Miller, Lair & Hutchinson 2010"
  },
  {
   "key": "step_hutchinson2006_elephant_timing",
   "category": "step",
   "label": "Elephant stance time and duty factor",
   "status": "verified",
   "value_si": 1.5,
   "unit_si": "s (one African elephant's hind foot at 1.2 m/s)",
   "low_si": 0.26,
   "high_si": 4,
   "display": "Elephant foot down 1.5 s at 1.2 m/s; duty factor 0.66 at 1.6 m/s (Asian, Froude 0.18); 0.44–0.85 across speeds",
   "values_json": "{\"duty_factor_vs_uhat\":{\"form\":\"y = a - b log x (log base not stated; base 10 gives 0.70 at u_hat 0.3)\",\"African\":{\"a\":0.53,\"b\":0.32,\"R2\":0.89},\"Asian\":{\"a\":0.51,\"b\":0.32,\"R2\":0.84}},\"stance_s_vs_uhat\":{\"form\":\"y = a x^b\",\"African\":{\"a\":0.37,\"b\":-0.93,\"R2\":0.91},\"Asian\":{\"a\":0.40,\"b\":-0.94,\"R2\":0.93}},\"duty_factor_range\":{\"African\":[0.44,0.85],\"Asian\":[0.37,0.78]},\"stance_range_s\":{\"African\":[0.26,4.00],\"Asian\":[0.20,2.90]},\"body_mass_range_kg\":[116,4632]}",
   "sources": [
    {
     "title": "Hutchinson et al. (2006), The locomotor kinematics of Asian and African elephants: changes with speed and size, J Exp Biol 209:3812 (journal page, read via WebFetch)",
     "url": "https://journals.biologists.com/jeb/article/209/19/3812/16362/The-locomotor-kinematics-of-Asian-and-African"
    },
    {
     "title": "Same paper, abstract via Europe PMC API",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:16985198%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Fig. 2 caption, confirmed verbatim: 'Right hind foot of an African elephant shown in lateral view during slow walking (1.2 m s-1; tst=1.5 s).' Results, citing Christian et al. 1999, for 'an Asian elephant moving at 1.6 m s-1' '(Fr=0.18; β=0.66)'. Abstract: 'over 2400 strides from 14 African and 48 Asian elephant individuals (body mass 116-4632 kg)' and an aerial phase 'occurs at a Froude number of around 1'. Tables 2 and 3 are from the journal page, read through WebFetch: the PDF was blocked by a Cloudflare challenge, and the quotes were confirmed in a second pass. The stance regression pools all sizes in seconds, so it is size-blind; use it with caution.",
   "who_when": "Hutchinson, Schwerda, Famini, Dale, Fischer & Kram 2006"
  },
  {
   "key": "step_elephant_preferred_froude",
   "category": "step",
   "label": "Speed elephants choose to walk at",
   "status": "verified",
   "value_si": 0.1,
   "unit_si": "Froude number (v²/(g·hip height))",
   "low_si": 0.05,
   "high_si": 0.1,
   "display": "Elephants often choose Froude about 0.1; five African elephants walked 1.1–1.3 m/s (Froude 0.05–0.08)",
   "sources": [
    {
     "title": "Panagiotopoulou et al. (2016), Foot pressure distributions during walking in African elephants, R Soc Open Sci 3:160203 (PMC5098964), full text via Europe PMC",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5098964/fullTextXML"
    }
   ],
   "notes": "Quotes: 'The mean walking speed of all African elephants was 1.2 ms−1 (table 1). This corresponded to a Froude number ... of 0.07 for all subjects' and 'Hutchinson et al. [21] found that elephants often self-selected similar speeds (Fr ∼ 0.1), which may seem slow but larger animals tend to choose relatively slower speeds'. Keepers guided the elephants, so the speeds were not wholly self-chosen. At Fr 0.1, Rex's and Ollie's 1.37 m hips give 1.16 m/s.",
   "who_when": "Panagiotopoulou et al. 2016, citing Hutchinson et al. 2006"
  },
  {
   "key": "step_panagiotopoulou2016_elephant_feet",
   "category": "step",
   "label": "African elephants: foot size, walking speed and peak foot pressures",
   "status": "verified",
   "value_si": 1.27,
   "unit_si": "m (forefoot circumference of the ~3,000 kg bull)",
   "low_si": 1.06,
   "high_si": 1.27,
   "display": "Five African elephants (1.5–3.0 t, keepers' estimates): forefoot circumference 1.06–1.27 m; peak local pressures 200–320 kPa",
   "values_json": "{\"subject\":[1,2,3,4,5],\"age_y\":[15,18,11,12,13],\"sex\":[\"M\",\"M\",\"F\",\"F\",\"F\"],\"mass_kg_estimated\":[2800,3000,1500,1800,2300],\"shoulder_m\":[2.43,2.50,2.22,2.12,2.30],\"right_fore_circumference_m\":[1.21,1.27,1.06,1.06,1.08],\"right_hind_circumference_m\":[1.18,1.24,1.07,1.10,1.08],\"mean_Froude\":[0.07,0.05,0.07,0.08,0.08],\"speed_m_s\":[1.24,1.11,1.24,1.24,1.34],\"mean_max_pressure_kPa\":{\"fore_left\":[317,251,256,262,315],\"fore_right\":[296,312,236,224,318],\"hind_left\":[237,250,243,200,297],\"hind_right\":[244,248,251,235,284]}}",
   "sources": [
    {
     "title": "Panagiotopoulou et al. (2016), R Soc Open Sci 3:160203 (PMC5098964), Table 1",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5098964/fullTextXML"
    }
   ],
   "notes": "'all body masses were thus based on approximations by the park keepers'. Zebris plates at 100 Hz, about 0.55 sensors/cm². 'the forefeet showed significantly higher mean peak foot pressures ... (fore 264 ± 5.31, hind 246 ± 5.09'. The text also says 'The mean peak pressures during the whole stance phase among all ROIs, feet and subjects in the African elephants were 946 kPa' (Asian sample 567 kPa). That does not match the per-foot table (224–318 kPa), and I could not reconcile the two, so use the table. These are local peaks under the toes; the sole's average pressure is lower.",
   "who_when": "Panagiotopoulou, Pataky, Day, Hensman, Hensman, Hutchinson & Clemente 2016"
  },
  {
   "key": "step_elephant_forefoot_area",
   "category": "step",
   "label": "Forefoot sole area of a 2.5–3 tonne elephant",
   "status": "derived",
   "value_si": 0.1,
   "unit_si": "m²",
   "low_si": 0.075,
   "high_si": 0.128,
   "display": "About 0.08–0.13 m² per forefoot (Rex's paw 0.31 m², Ollie's boot 0.15 m²)",
   "sources": [
    {
     "title": "Panagiotopoulou et al. (2016) (circumferences)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5098964/fullTextXML"
    },
    {
     "title": "Schanz et al. (2013) (footprint 0.32 × 0.30 m)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC3812993/fullTextXML"
    }
   ],
   "notes": "Treating a circumference C as a circle gives area C²/(4π): 1.06 m → 0.089 m²; 1.21 → 0.117; 1.27 → 0.128 m² (the ~3,000 kg bull). Schanz's 2,530 kg cow left 0.32 × 0.30 m prints: as an ellipse, 0.075 m². Larramendi 2016 notes the conventional rule of 'multiplying the forefoot circumference by two' to get shoulder height.",
   "who_when": "Computed 2026"
  },
  {
   "key": "step_elephant_vs_rex_footfall",
   "category": "step",
   "label": "One of Rex's or Ollie's walking steps compared with a same-weight elephant's forefoot",
   "status": "derived",
   "value_si": 2.2,
   "unit_si": "ratio of peak foot force",
   "display": "Each step puts about 2.2 × the force of a 3-tonne elephant's forefoot into the ground (35 kN against 16 kN), at similar pressure for Rex and about 1.1–1.9 × for Ollie",
   "sources": [
    {
     "title": "Ren et al. (2010) PNAS (0.55 BW per forefoot)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2872429/"
    },
    {
     "title": "Larramendi (2016) (3,000 kg cow)",
     "url": "https://app.pan.pl/archive/published/app61/app001362014.pdf"
    }
   ],
   "notes": "Elephant: 0.55 × 3,000 kg × 9.81 = 16.2 kN per forefoot at a walk. Average pressure over 0.128–0.075 m² is 126–215 kPa. Rex and Ollie: 35.4 kN at 1.2 BW; 114 kPa (Rex) and 236 kPa (Ollie). The elephant's footfalls are also slower (stance 1.5 s at 1.2 m/s against about 0.8 s), so the load rises more gently. Ground-vibration comparisons need the measured elephant seismic data from the vibration topic; this fact compares only the forces.",
   "who_when": "Computed 2026"
  },
  {
   "key": "step_schanz2013_elephant_footprint",
   "category": "step",
   "label": "Measured footprint depth of a weighed elephant in prepared sand",
   "status": "verified",
   "value_si": 0.022,
   "unit_si": "m",
   "low_si": 0.02,
   "high_si": 0.026,
   "display": "A weighed 2,530 kg African elephant cow left forefoot prints 20–26 mm deep in medium sand",
   "values_json": "{\"elephant\":\"Sweeny, African elephant cow, Wuppertal Zoo\",\"mass_kg_all_four_feet_on_scale\":2530,\"both_hindlimbs_on_scale_kg\":1125,\"both_forelimbs_on_scale_kg\":1530,\"one_forelimb_on_scale_kg\":1390,\"footprint_length_m\":0.32,\"footprint_width_m\":0.30,\"forefoot_depths_m\":[0.020,0.021,0.026],\"sand\":\"Rhine sand, poorly graded medium sand, grains 0.1-4.0 mm\",\"friction_angle_deg\":35,\"cohesion_kPa\":0,\"dilatancy_deg\":5,\"E50_ref_MPa\":42,\"Eoed_ref_MPa\":42,\"Eur_ref_MPa\":208,\"dry_density_g_cm3\":1.6,\"relative_density\":[0.30,0.47],\"test_pit_m\":[5.25,2.20,0.90],\"FEA_static_forefoot_stress_kPa\":{\"standing\":93,\"step2\":99,\"step3\":166,\"max_static\":185},\"dynamic_factor\":{\"forelimb\":3.5,\"hindlimb\":1.6},\"FEA_depth_m\":0.018,\"measured_depth_m\":0.022,\"back_calculated_mass_kg\":2635}",
   "sources": [
    {
     "title": "Schanz et al. (2013), Quantitative interpretation of tracks for determination of body mass, PLOS ONE 8:e77606 (PMC3812993), full text via Europe PMC",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC3812993/fullTextXML"
    },
    {
     "title": "Same paper, inline formula image for the standing stress (σ = 93); the others (e070–e075, e096, e097) were read the same way",
     "url": "https://cdn.ncbi.nlm.nih.gov/pmc/blobs/280d/3812993/a2551398ceab/pone.0077606.e071.jpg"
    }
   ],
   "notes": "Quotes: 'the elephant was standing with all limbs on the scale (m = 2530 kg)'. 'average footprint length is 0.32 m, average width is 0.30 m, and the average depths of the three scanned forefoot impressions is 0.020 m, 0.021 m, and 0.026 m, respectively.' 'the relative density of the subsoil was found to be between 0.30 and 0.47'. 'A factor of approximately 3.5 relating [σ_dyn+stat] to [σ_stat] was identified using the DIC technique to quantify the velocity of the elephant's foot when coming into contact with the subsoil.' The stresses, densities and depths are printed as inline images, which I downloaded and read: σ = 93, 99, 166 and σ_max = 185 kN/m²; ρ_d = 1.6; u_Exp = 0.022; u_FEA = 0.018. The sand was compacted in three layers with a hand roller (relative density 0.30–0.47, loose to medium). This is one animal in one sand: the only measured large-animal footprint depth with known mass and soil that I found.",
   "who_when": "Schanz, Lins, Viefhaus, Barciaga, Läbe, Preuschoft, Witzel & Sander 2013"
  },
  {
   "key": "step_schanz2013_touchdown_speed",
   "category": "step",
   "label": "Elephant forefoot touchdown speed implied by Schanz et al.'s dynamic factor",
   "status": "derived",
   "value_si": 1.04,
   "unit_si": "m/s",
   "display": "About 1 m/s (back-calculated); the same factor implies a 1.1 × body weight forefoot peak, double what force plates show",
   "sources": [
    {
     "title": "Schanz et al. (2013) Eq. 1 (image read: σ_dyn = m·v1²/(2·s·A))",
     "url": "https://cdn.ncbi.nlm.nih.gov/pmc/blobs/280d/3812993/e5ede7ccf4b2/pone.0077606.e008.jpg"
    },
    {
     "title": "Schanz et al. (2013) full text",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC3812993/fullTextXML"
    }
   ],
   "notes": "Their Eq. 1 defines m as 'the weight distributed over the limb considered', v1 as the limb's speed 'on impact', s as 'the path of deceleration (i.e., the deformation of the subsoil)' and A as foot area. The speed they measured (by image correlation at 60 frames/s) is not printed. Back-calculation: f_dyn = 3.5 on loading step 2 (99 kPa, limb share 0.32), so σ_dyn = 2.5 × 99 = 248 kPa; m = 0.32 × 2,530 = 810 kg; s = 0.022 m; A = π × 0.16² = 0.080 m²; hence v1 = √(2 s A σ_dyn / m) = 1.04 m/s. Tension: 3.5 × 0.32 = 1.12 BW on one forefoot, against Ren et al.'s force-plate walking peak of about 0.55 BW and maximum of under 1 BW at any speed. Their energy formula probably overstates the dynamic load.",
   "who_when": "Computed 2026 from Schanz et al. 2013"
  },
  {
   "key": "step_falkingham2011_goldilocks",
   "category": "step",
   "label": "When footprints form at all (track-formation physics)",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "A print forms only when the foot's pressure is near the ground's yield strength: on firmer ground, no print; on much softer ground, the animal gets mired",
   "sources": [
    {
     "title": "Falkingham, Bates, Margetts & Manning (2011), The 'Goldilocks' effect: preservation bias in vertebrate track assemblages, J R Soc Interface 8:1142 (PubMed 21233145), abstract via Europe PMC API",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:21233145%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'Ideal, semi-infinite elastic-plastic substrates displayed a ‘Goldilocks’ quality where only a narrow range of loads could produce tracks, given that small animals failed to indent the substrate, and larger animals would be unable to traverse the area without becoming mired. If a firm subsurface layer is assumed, a more complete assemblage is possible'. A 2014 follow-up (Falkingham, Hage & Bäker, R Soc Open Sci, PMC4448835; abstract read) found that strain hardening and layering widen that range: 'any given substrate can therefore only preserve a range of tracks from those animals which exert an underfoot pressure at approximately the yield strength of the sediment'. No numbers to use.",
   "who_when": "Falkingham et al. 2011"
  },
  {
   "key": "step_fhwa_soil_modulus_table",
   "category": "step",
   "label": "Typical soil stiffness (elastic modulus) for settlement estimates",
   "status": "verified",
   "value_si": null,
   "unit_si": "Pa",
   "display": "Loose sand 10–29 MPa, medium-dense 29–48 MPa, dense 48–77 MPa; soft clay 2.4–14 MPa",
   "values_json": "{\"units\":\"Es in ksi as printed (MPa = ksi x 6.895)\",\"Clay-Soft Sensitive\":[0.347,2.08],\"Clay-Med Stiff to Stiff\":[2.08,6.94],\"Clay-Very Stiff\":[6.94,13.89],\"Loess\":[2.08,8.33],\"Silt\":[0.278,2.78],\"Fine Sand-Loose\":[1.11,1.67],\"Fine Sand-Medium Dense\":[1.67,2.78],\"Fine Sand-Dense\":[2.78,4.17],\"Sand-Loose\":[1.39,4.17],\"Sand-Medium Dense\":[4.17,6.94],\"Sand-Dense\":[6.94,11.11],\"Gravel-Loose\":[4.17,11.11],\"Gravel Medium Dense\":[11.11,13.89],\"Gravel-Dense\":[13.89,27.78],\"Poisson_ratio\":{\"clay\":[0.4,0.5],\"sand_fine\":0.25,\"sand_loose\":[0.2,0.36],\"sand_dense\":[0.3,0.4]}}",
   "sources": [
    {
     "title": "FHWA (2017), Geotechnical Engineering Circular No. 5: Geotechnical Site Characterization, FHWA-NHI-16-072, Table 8-10 (as reproduced from AASHTO 2014) and Eq. 8.16",
     "url": "https://www.fhwa.dot.gov/engineering/geotech/pubs/nhi16072.pdf"
    }
   ],
   "notes": "Table 8–10, 'Typical values for Es and ν for different soil types (modified from AASHTO, 2014)', as reproduced in FHWA GEC 5 (AASHTO itself not read). The text around Eq. 8.16: 'The general equation for displacement at the center of an applied surface load is (8.16) where q is the applied stress, B is the width of the loaded area, I is a settlement influence factor, Es is the equivalent elastic modulus, and ν is Poisson's ratio for the soil.' The equation is an image that did not extract. The form s = q·B·I·(1−ν²)/Es is my reading of the listed variables. EM 1110-1-1904 (USACE settlement manual) could not be fetched: one mirror's certificate had expired, and the others returned HTML.",
   "who_when": "FHWA 2017 / AASHTO 2014"
  },
  {
   "key": "step_em1110_clay_depth_factor",
   "category": "step",
   "label": "Clay bearing capacity grows as a footing (or foot) sinks deeper",
   "status": "verified",
   "value_si": 1.46,
   "unit_si": "ratio N_c(D)/N_c(0) at D/B = 4",
   "low_si": 1,
   "high_si": 1.46,
   "display": "Clay bearing factor rises 1.15× at half a foot-width deep, 1.24× at one width, 1.46× at four widths; deep foundations in clay use N_c up to 9",
   "values_json": "{\"D_over_B\":[0.0,0.5,1.0,2.0,3.0,4.0],\"Ncw_D_over_Ncw_0\":[1.00,1.15,1.24,1.36,1.43,1.46],\"deep_clay_end_bearing\":\"Ncp = 6[1 + 0.2(L/Bb)] <= 9\",\"sand_critical_depth\":\"circular D/B about 4: below it only punching shear\"}",
   "sources": [
    {
     "title": "USACE EM 1110-1-1905 Bearing Capacity of Soils (1992), Table 4-7 and §5 (the copy the project already cites)",
     "url": "https://www.tugraz.at/fileadmin/user_upload/Institute/IAG/Files/18_Bearing_Capacity_of_Soils-USACE.pdf"
    }
   ],
   "notes": "Table 4-7 'Influence of Footing Depth D (Department of the Navy 1982)': D/B 0.0 → 1.00, 0.5 → 1.15, 1.0 → 1.24, 2.0 → 1.36, 3.0 → 1.43, 4.0 → 1.46. This is given for two-layer clay footings. Deep foundations in saturated clay: 'Ncp = 6 [1 + 0.2 (L/Bb)] ≤ 9' (Reese & O'Neill 1988), and 'Ncp for total stress analysis is assumed 9 for general shear and 7 for local'. Also: 'Local shear is a punching-type failure and it is more likely to occur in loose sands, silty sands, and weak clays' and 'For circular foundations, this critical relative depth is about D/B = 4'. The engine's clay sinking uses overburden only (Nq = 1); these factors would stop a foot at a finite depth in mud.",
   "who_when": "USACE 1992"
  },
  {
   "key": "step_footprint_model_check",
   "category": "step",
   "label": "Check: the engine's sinking rule against the measured elephant footprint",
   "status": "derived",
   "value_si": 0.23,
   "unit_si": "m (predicted depth at φ 35°, against 0.022 measured)",
   "low_si": 0.039,
   "high_si": 0.53,
   "display": "For the weighed elephant, the engine's rule predicts a 0.23 m deep print (φ 35°) where 0.02 m was measured; elastic settlement predicts 2–9 mm",
   "sources": [
    {
     "title": "Schanz et al. (2013) (measured case)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC3812993/fullTextXML"
    },
    {
     "title": "USACE EM 1110-1-1905 (bearing factors used by the engine)",
     "url": "https://www.tugraz.at/fileadmin/user_upload/Institute/IAG/Files/18_Bearing_Capacity_of_Soils-USACE.pdf"
    }
   ],
   "notes": "Script derive.py. I applied the engine's groundUnderWeight rule, D = (p − q0)/(ρ g Nq) with q0 = 0.5 γ B Nγ × 0.6 (Vesic Nγ, square factor), to the elephant: γ = 15.7 kN/m³, B = √0.075 = 0.274 m, and Ren's walking peak of 0.55 BW (13.6 kN, so 181 kPa). Results: φ 30° gives 0.53 m; φ 35° (Schanz's triaxial value) 0.23 m; φ 40° 0.04 m. Measured: 0.020–0.026 m. With Schanz's own 1.12 BW load: 0.59 m at φ 35°. Elastic s = q B (1−ν²)(π/4)/Es at 350 kPa: 9 mm (Es 9.6 MPa), 3 mm (29 MPa), 2 mm (48 MPa). So failure-based sinking overpredicts about tenfold unless φ is about 40° (sand is stronger at the very low stresses under a foot). Elasticity underpredicts, because a footprint is mostly local plastic flow. The same rule on the engine's loose sand (37 kPa at 0.1 m², Nq 18.4): a person (80 kg, 1.2 BW, 0.0126 m² walking sole) sinks 0.21 m per step, Rex 0.17 m and Ollie 0.66 m. That does not match experience on dry sand, but I fetched no measured human footprint depth to prove it.",
   "who_when": "Computed 2026"
  },
  {
   "key": "step_rex_ollie_footprint_estimate",
   "category": "step",
   "label": "Rex's and Ollie's walking footprint depth in sand like the elephant's (scaled from it)",
   "status": "estimate",
   "value_si": 0.02,
   "unit_si": "m (Rex)",
   "low_si": 0.012,
   "high_si": 0.041,
   "display": "In firm-ish medium sand: Rex about 1–3 cm, Ollie about 2–4 cm per walking step (rough)",
   "values_json": "{\"rule\":\"depth = 0.022 m x (p / p_e) x (B / 0.274 m), p_e = 181 kPa (Ren-based load) or 350 kPa (Schanz's load)\",\"Rex\":{\"p_kPa\":114,\"B_m\":0.557,\"depth_m\":[0.015,0.028]},\"Ollie\":{\"p_kPa\":236,\"B_m\":0.387,\"depth_m\":[0.021,0.041]}}",
   "sources": [
    {
     "title": "Schanz et al. (2013) (anchor)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC3812993/fullTextXML"
    }
   ],
   "notes": "Scales the one measured elephant print linearly with pressure × foot width (the way surface settlement scales). The pressure that made the print is uncertain: 181 kPa (0.55 BW, force plates) or 350 kPa (Schanz's dynamic estimate). Rex: 114 kPa, B = √0.31 = 0.557 m, so 0.015–0.028 m. Ollie: 236 kPa, B = 0.387 m, so 0.021–0.041 m. Valid only for sand like Schanz's (compacted medium sand, relative density 0.3–0.5) and pressures up to about twice the anchor. It does not cover loose dry sand, wet sand, mud or clay, and it ignores the impact part and the foot's shape.",
   "who_when": "Estimated 2026"
  }
 ],
 "model_recommendation": "STEP MODEL for one foot per step. Body mass M = 3,007 kg, weight W = M g = 29.5 kN. Hip height h = 0.45 H = 1.37 m, the leg length for all scaling; the engine already uses Lleg = 0.45 H.\n\n1. Pace and timing: people scaled up at equal Froude number (Alexander; Kram).\n- Speed: v = √(Fr g h). Default Fr = 0.18, the measured comfortable human walk: 1.56 m/s, shown as \"about 1.6 m/s\".\n- Slider: Fr 0.05–0.5, which is 0.8 m/s (elephant-slow) to 2.6 m/s (the walk-to-run limit). Above Fr 0.5 they would run, and this model stops.\n- Step rate: f = 0.789 Fr^0.211 √(g/h). T … [4,554 more characters on this line; the full prompt is in prompts/aa89e7d1e34b601b8.txt]
 "gaps": "Could not find or verify, and what to say on the page instead:\n\n1. Walking heel-strike transient size in body weights. Whittle 1999 and Verdini 2006 are paywalled, and no open source tabulates it. The page should describe the impact by its energy and heel speed (Baines 2018), not as a force spike in body weights.\n\n2. Directly measured human stance time. Öberg 1993 failed TLS on the VA site, and Bohannon's per-decade table is paywalled. Stance time is derived as duty factor × stride period; label it \"computed\".\n\n3. Foot speed and contact duration of a drill stamp. Neither is r … [2,181 more characters on this line; the full prompt is in prompts/aa89e7d1e34b601b8.txt]
}
```

</details>

**Subagent `verify:attenuation`** · rex-presence-research · started 2026-10-11 18:56:53 UTC

- checks: 49 (37 ok, 12 not ok).
- Not OK: vib_mayne_law_low_energy_failure; vib_trl429_hsdc_digitised; vib_trl429_validity_100m (+9 more).
- Sources and physics are largely sound; fix the figure misreading, the overstated validation and the labels before building on it. I re-fetched all 16 cited URLs, and every quoted sentence and table value checks out against the source: BS 5228-2 E.1/E.2, TRL 429, Lauzon, Lukas/GEC 1, Colombero, ...

<details>
<summary>Prompt, verbatim (110,696 characters)</summary>

Workflow run `wf_bb193dee-61c`, phase `Verify`, agent `a2311a5c0fd01f98d`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a2311a5c0fd01f98d.txt](prompts/a2311a5c0fd01f98d.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

You are a skeptical fact-checker for the topic "attenuation". Below are the researcher's facts and model recommendation. Re-fetch the cited URLs for every fact the page is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, unit conversion, quotation and status against what the source actually says; recompute every derived number with your own script. Mark ok=false with a correction for anything wrong, mislabelled (a secondary summary presented as the primary paper, an estimate or a fan source marked verified, a sample maximum called a limit, the wrong units or wrong peak/RMS basis), or unsupported. Judge the model recommendation: wrong physics, wrong formula, constants used outside the range they were fitted to, overstated certainty? List important missing items.

RESEARCH:
{
 "facts": [
  {
   "key": "vib_bs5228_dynamic_compaction_predictor",
   "category": "attenuation",
   "label": "BS 5228-2 Table E.1: ground vibration from dynamic compaction (weight dropped on the ground)",
   "status": "verified",
   "value_si": 0.000037,
   "unit_si": "m/s (coefficient k in PPV = k (sqrt(W_h)/x)^1.7, W_h in J, x in m)",
   "display": "PPV ≤ 0.037 (√W_h / x)^1.7 mm/s; W_h = potential energy of the raised tamper (J), x = distance along the ground (m); valid 5–100 m and 1–12 MJ",
   "sources": [
    {
     "title": "BS 5228-2:2009+A1:2014 Annex E, Tables E.1 and E.2 (licensed copy filed as public-inquiry core document CD43.12, Omega West)",
     "url": "https://www.omegawestdocuments.com/media/documents/43/CD43.12%20-%204%20Code%20of%20practice%20for%20noise%20and%20vibration%20control%20on%20construction%20and%20open%20sites%20part%202%20vibration;.pdf"
    },
    {
     "title": "York Potash Harbour Facilities Order, ES Appendix 14.1 Construction vibration calculations (2014), used only for the units caution",
     "url": "https://northeastfc.uk/Infrastructure/projects/north-east/york-potash-harbour-facilities-order/TR030002-000493-Section%2014%20App%2014.1%20Construction%20vibration%20calculations.pdf"
    }
   ],
   "who_when": "BSI 2014, reproducing Hiller & Crabb (TRL) 2000",
   "notes": "Table E.1 row 'Dynamic compaction': 'νres ≤ 0.037 [√Wh / x]^1.7', parameter range '5 ≤ x ≤ 100 m' and '1.0 ≤ Wh ≤ 12 MJ'. Key: 'νres resultant PPV, in millimetres per second (mm·s−1)'; 'Wh potential energy of a raised tamper, in joules (J)'; 'x distance measured along the ground surface, in metres (m)'. Annex E.1: 'Hiller and Crabb [11] have derived empirical formulae relating resultant PPV with a number of other parameters ... from field measurements.' No scaling factor or probability is given for this row: it is an upper-bound style predictor (TRL 429 calls it Mayne's 'conservative upper limit'). It is the same law as Mayne (1985) in other units: 0.037 × (9,806.65)^0.85 = 91.4, i.e. 92 (√(M[t]·H[m]) / x)^1.7. PPV here is the resultant (vector) peak particle velocity. A footstep (10 J–10 kJ) is 100 to 100,000 times below the 1 MJ floor of the stated range, and 1–5 m is below its 5 m floor. Caution for implementers: W_h is in joules; one published calculation sheet (York Potash ES appendix 14.1) appears to apply the piling formula with energy in kJ.",
   "values_json": "{\"table\": \"BS 5228-2:2009+A1:2014 Table E.1 (resultant PPV in mm/s)\", \"rows\": [{\"operation\": \"Vibratory compaction (steady state)\", \"equation\": \"v_res = k_s sqrt(n_d) [A/(x+L_d)]^1.5\", \"scaling\": \"k_s = 75 (50%), 143 (33.3%), 276 (5%)\", \"range\": \"1 <= n_d <= 2; 0.4 <= A <= 1.72 mm; 2 <= x <= 110 m; 0.75 <= L_d <= 2.2 m\"}, {\"operation\": \"Vibratory compaction (start up and run down)\", \"equation\": \"v_res = k_t sqrt(n_d) [A^1.5/(x+L_d)^1.3]\", \"scaling\": \"k_t = 65 (50%), 106 (33.3%), 177 (5%)\", \"range\": \"as above\"}, {\"operation\": \"Percussi … [1,021 more characters on this line; the full prompt is in prompts/a2311a5c0fd01f98d.txt]
  },
  {
   "key": "vib_bs5228_percussive_piling_kp",
   "category": "attenuation",
   "label": "BS 5228-2 Table E.2: ground factor k_p for percussive piling (PPV ≤ k_p √W / r^1.3)",
   "status": "verified",
   "value_si": null,
   "unit_si": "mm/s per (J^0.5 m^-1.3)",
   "display": "k_p = 5 (piles at refusal), 3 (very stiff clay, dense granular), 1.5 (stiff clay, medium dense granular, compacted fill), 1 (soft clay, loose granular, loose fill, organic)",
   "sources": [
    {
     "title": "BS 5228-2:2009+A1:2014 Annex E, Tables E.1 and E.2 (licensed copy filed as public-inquiry core document CD43.12, Omega West)",
     "url": "https://www.omegawestdocuments.com/media/documents/43/CD43.12%20-%204%20Code%20of%20practice%20for%20noise%20and%20vibration%20control%20on%20construction%20and%20open%20sites%20part%202%20vibration;.pdf"
    },
    {
     "title": "Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)",
     "url": "https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf"
    }
   ],
   "who_when": "BSI 2014; Hiller & Crabb 2000 (TRL 429 Table 9)",
   "notes": "Table E.2 'Values of kp for use in predictions of vibration from percussive piling'. The BS copy prints the 1.5 row as 'Pile toe not being driven through: Stiff cohesive soils ...' while TRL 429 Table 9 (the origin) reads 'Pile toe being driven through: Stiff cohesive soils; Medium dense granular soils; Compacted fill. 1.5'. TRL 429 eq. 19 defines W as 'the hammer energy per blow (J)' and r as 'the distance from the toe of the pile to the point of interest (m)'. TRL: k_p values were 'calculated such that the value of vres at a distance (r) of 10m equates to the less conservative of the values' of Whyley & Sarsby (1992) and CEN (1998). The energy is released at the pile toe at depth, so this is not a surface-impact law; it is listed only because it is the one BS predictor with a ground-type factor (soft/loose ground 1 vs very stiff/dense 3: a factor of 3 between ground classes).",
   "values_json": "{\"refusal\": 5, \"very stiff cohesive / dense granular / fill with large obstructions\": 3, \"stiff cohesive / medium dense granular / compacted fill\": 1.5, \"soft cohesive / loose granular / loose fill / organic\": 1, \"units\": \"v_res mm/s, W in J, r in m\"}"
  },
  {
   "key": "vib_mayne1985_upper_bound_trl",
   "category": "attenuation",
   "label": "Mayne (1985) upper-bound law for dynamic compaction vibration, as printed in TRL 429",
   "status": "verified",
   "value_si": 0.092,
   "unit_si": "m/s (coefficient; M in tonnes, H in m, x in m, exponent 1.7)",
   "display": "v_res ≤ 92 (√(M·H) / x)^1.7 mm/s (M tamper mass in t, H drop height in m, x distance in m)",
   "sources": [
    {
     "title": "Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)",
     "url": "https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf"
    }
   ],
   "who_when": "Mayne 1985, as reproduced by Hiller & Crabb 2000",
   "notes": "TRL 429 section 6.2 (p. 62): 'Mayne et al (1984) presented data from a number of dynamic compaction case histories and suggested a predictor which could be used to determine a conservative upper limit of vibration. The predictor was subsequently revised (Mayne, 1985) and presented as: v_res ≤ 92 [√(MH)/x]^1.7 (21) where v_res is the peak particle velocity (mm/s); M is the tamper weight (tonnes); H is the drop height (m); x is the distance from impact (m).' TRL's own Coventry check (8.5 t from 10 m and 12 m, i.e. 0.8 and 1.0 MJ, measured at 5–120 m) 'verified the predictor ... which provided a reasonable upper bound to the data (Figure 43). However, the attenuation rate on the site monitored by TRL was lower than that proposed by Mayne, which resulted in an over prediction close to the source and an underestimate of vibration levels at distances in excess of 60m from the impact.' Identical to the BS 5228-2 dynamic compaction row (0.037 with energy in J). The original Mayne papers were not fetched (ASCE paywall)."
  },
  {
   "key": "vib_mayne_law_low_energy_failure",
   "category": "attenuation",
   "label": "Mayne/BS 5228 dynamic-compaction law at low drop energy: TRL finds it under-predicts by up to 10×",
   "status": "verified",
   "value_si": 10,
   "unit_si": "ratio (measured / predicted, worst case)",
   "low_si": 2,
   "high_si": 10,
   "display": "For a 7 t weight dropped 1.2 m (82 kJ), measured PPV exceeded the Mayne (1985) prediction by up to an order of magnitude",
   "sources": [
    {
     "title": "Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)",
     "url": "https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf"
    }
   ],
   "who_when": "Hiller & Crabb 2000, data of Allen 1996",
   "notes": "TRL 429 p. 62–63 on the high-speed dynamic compactor ('a 7 tonne weight dropped from a height of up to 1.2m onto a metal plate, which remains in contact with the ground'): 'The predictor appears to be unreliable for this compaction process, under estimating the vibration level by up to an order of magnitude. It is possible that Mayne’s predictor is less reliable for low energy dynamic compaction than for more energetic compaction. Most of the data from which Mayne’s predictor was derived were from higher energy compaction than the energy of the high speed dynamic compaction apparatus. Furthermore, inspection of Mayne’s field data shows that the predictor becomes less conservative as the potential energy of the raised tamper decreases.' 82 kJ is already 12 times below the 1 MJ floor of BS 5228's range; footsteps (10 J–10 kJ) are lower still, so the law cannot be trusted at Rex's scale without correction. See vib_trl429_hsdc_digitised for the numbers read off the figure."
  },
  {
   "key": "vib_trl429_hsdc_digitised",
   "category": "attenuation",
   "label": "High-speed dynamic compactor (7 t from 1.2 m, 82 kJ): measured PPV vs distance, read from TRL 429 Fig. 44",
   "status": "derived",
   "value_si": null,
   "unit_si": "m/s",
   "display": "About 120–150 mm/s at 5.6 m, 22–30 at 10.5 m, 8–10 at 16 m, 4–8 at 35 m, 2–4 at 57–75 m, 1.3–1.5 mm/s at 120 m (three sites); Mayne (1985) predicts 30, 10, 5, 1.3, 0.4–0.6 and 0.16 mm/s",
   "sources": [
    {
     "title": "Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)",
     "url": "https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf"
    }
   ],
   "who_when": "Allen 1996 data as plotted by Hiller & Crabb 2000; read off the figure by us 2026",
   "notes": "Values read by eye from the log-log plot in TRL 429 Figure 44 ('Vibration data from the high speed dynamic compactor reported by Allen (1996) compared with ppv predicted for the 7t tamper dropped from 1.2m using Mayne’s equation (1985)'; sites Weston, Waterbeach, Ipswich): reading error about ±20%. Predictions computed by us from 92 (√(7×1.2)/x)^1.7 (W = 7,000 × 9.80665 × 1.2 = 82.4 kJ). Ratio measured/predicted: 4–5 at 5.6 m, 2–3 at 10–20 m, 3–7 at 35–57 m, 8–12 at 75–120 m. The measured fall-off is about x^-1.1 to x^-1.3, slower than the law's x^-1.7. The weight lands on a steel plate already in contact with the ground, so this is a cleaner, stiffer impact than a crane drop.",
   "values_json": "{\"distance_m\": [5.6, 10.5, 16, 21, 35, 57, 75, 120], \"measured_mm_s\": [[120, 150], [22, 30], [8, 10], [7, 10], [4, 8], [1.8, 4], [2.8, 4.3], [1.3, 1.5]], \"mayne1985_mm_s\": [29.8, 10.2, 5.0, 3.2, 1.3, 0.58, 0.36, 0.16], \"note\": \"measured values read from TRL 429 Fig. 44, +/-20%\"}"
  },
  {
   "key": "vib_trl429_validity_100m",
   "category": "attenuation",
   "label": "TRL 429: empirical construction-vibration predictors hold to about 100 m",
   "status": "verified",
   "value_si": 100,
   "unit_si": "m",
   "display": "Valid up to about 100 m from the source; extrapolating much further is not recommended (usually conservative)",
   "sources": [
    {
     "title": "Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)",
     "url": "https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf"
    }
   ],
   "who_when": "Hiller & Crabb 2000",
   "notes": "TRL 429 p. 73: 'The predictors are valid up to a distance of about 100m from the vibration source. ... Extrapolation much beyond this distance is not recommended although it will generally provide a conservative estimate.' Also: 'the effects of material damping on attenuation have not been included in the predictors because in nearly all cases the fit of the model to the data was not significantly improved by its inclusion. The slopes of the attenuation curves are, however, steeper than those expected theoretically from geometric attenuation'. 'For the other activities predictors presented as upper bounds to the data and therefore are expected to be generally conservative.'"
  },
  {
   "key": "vib_mayne1984_upper_bound",
   "category": "attenuation",
   "label": "Mayne, Jones & Dumas (1984) original upper-bound law for dynamic compaction vibration",
   "status": "reported",
   "value_si": 0.07,
   "unit_si": "m/s (coefficient; W in tonnes, H in m, d in m, exponent 1.4)",
   "display": "PPV ≤ 70 (√(W·H) / d)^1.4 mm/s (W tamper in t, H drop in m, d in m)",
   "sources": [
    {
     "title": "Lauzon, Morel, Briet & Beaton (c. 2011) Ground Vibrations Induced by Dynamic Compaction and Rapid Impact Compaction (ISSMGE online library, GEO11 paper 581)",
     "url": "https://www.issmge.org/uploads/publications/84/52/GEO11Paper581.pdf"
    }
   ],
   "who_when": "Mayne, Jones & Dumas 1984, as reproduced by Lauzon et al. c. 2011",
   "notes": "Not seen in the original (J. Geotech. Eng. ASCE 110(6):757-774 is paywalled). Lauzon et al. eq. [2]: 'For preliminary estimates, Mayne et al (1984) proposed the following formula as a conservative upper limit to the ground vibration levels: PPV (mm/s) ≤ 70 (√(W H)/d)^1.4 ... Where W is in tonnes and H and d are in metres.' An eng-tips forum post gives the same 70 and 1.4. TRL 429 says this 1984 predictor 'was subsequently revised (Mayne, 1985)' to 92 and 1.7. The data range of the 1984 paper (energies, distances, soils) could not be verified. At the Pisa drop test (3.8 kJ) it does better than the 1985 form: 10 mm/s at 2.5 m (measured 9) and 0.12 mm/s at 60 m (measured 0.2)."
  },
  {
   "key": "vib_mayne1985_normalised_law",
   "category": "attenuation",
   "label": "Mayne (1985) normalised form: PPV scaled by impact speed and tamper radius",
   "status": "reported",
   "value_si": 0.2,
   "unit_si": "1 (coefficient; PPV in the same units as impact speed)",
   "display": "PPV = 0.2 √(2gH) (d/r₀)^-1.7 (impact speed √(2gH), tamper radius r₀; based on 12 sites)",
   "sources": [
    {
     "title": "Lauzon, Morel, Briet & Beaton (c. 2011) Ground Vibrations Induced by Dynamic Compaction and Rapid Impact Compaction (ISSMGE online library, GEO11 paper 581)",
     "url": "https://www.issmge.org/uploads/publications/84/52/GEO11Paper581.pdf"
    }
   ],
   "who_when": "Mayne 1985, as reproduced by Lauzon et al. c. 2011",
   "notes": "Lauzon et al. eq. [4]: 'Based on vibration monitoring data from 12 different sites, Mayne (1985) proposed the following approximation: PPV = 0.2 √(2 g H) (d/ro)^-1.7 ... Where d is the distance, from the point of impact and ro is the radius of the tamper. PPV, g and H are in consistent units. With this approach, Mayne (1985) could attain a better fit for his set of data.' The source paper (ASCE Soil Dynamics Committee convention, Detroit 1985) was not fetched. Note it is independent of mass: it predicts the same shaking for any weight with the same contact radius and impact speed, which cannot hold for a footstep (a slow load, not a drop)."
  },
  {
   "key": "vib_lukas_scaled_energy_chart",
   "category": "attenuation",
   "label": "FHWA chart: PPV against scaled energy factor √E / d, one line per soil type (Lukas 1986, 1995)",
   "status": "verified",
   "value_si": null,
   "unit_si": "m/s",
   "display": "PPV grows with √(energy)/distance; separate lines for 8 ground types; data span scaled energy factor ≈ 0.07–6 √(t·m)/m and PPV ≈ 1–250 mm/s",
   "sources": [
    {
     "title": "Lukas (1986) Dynamic Compaction for Highway Construction, Vol. 1: Design and Construction Guidelines, FHWA/RD-86/133 (USDOT ROSAP scan)",
     "url": "https://rosap.ntl.bts.gov/view/dot/68405/dot_68405_DS1.pdf"
    },
    {
     "title": "Lukas (1995) Geotechnical Engineering Circular No. 1: Dynamic Compaction, FHWA-SA-95-037 (USDOT ROSAP scan)",
     "url": "https://rosap.ntl.bts.gov/view/dot/40768/dot_40768_DS1.pdf"
    }
   ],
   "who_when": "Lukas 1986 (Fig. 35); Lukas 1995 (GEC 1 Fig. 7)",
   "notes": "FHWA/RD-86/133 p. 99: 'Lukas (51, 54, 56) and Steinberg and Lukas (87), have accumulated information regarding the particle velocity measured at ground surface from dynamic compaction operations at varying distances from the point of impact in different soil types. This data is shown in Figure 35. The magnitude of ground vibration increases with the square root of the energy applied and decreases as the distance from the point of impact. This figure can be used for planning purposes.' Fig. 35 axes: particle velocity in in/s against 'scaled energy factor (√energy – foot pounds / distance – feet)'. GEC 1 (1995) Fig. 7 gives the SI version: x axis 'SCALED ENERGY FACTOR, (√(ENERGY (kJ)/9.8) / DISTANCE (m))', y axis particle velocity (mm/sec), soils: 1 very stiff silty clay, 2 medium dense micaceous sand, 3 clayey mine spoil, 4 building rubble, 5 collapsible silt, 6 loose sand, 7 loose sand fill, 8 loose decomposed garbage; GEC 1 p. 12: 'This chart is based on records taken from many sites and provides a good estimation of ground vibration levels for planning purposes.' The plotted lines span roughly 0.07 to 6 on the x axis (our reading). A footstep of 10 J–10 kJ at 1–200 m has a scaled energy factor of about 0.0002–1, mostly to the left of the data."
  },
  {
   "key": "vib_gec1_chart_digitised",
   "category": "attenuation",
   "label": "FHWA GEC 1 chart read off: PPV at the marked point of each soil line, and at a scaled energy factor of 1",
   "status": "derived",
   "value_si": null,
   "unit_si": "m/s",
   "display": "At √(E[kJ]/9.8)/d = 1: roughly 13 mm/s (decomposed garbage, loose sand fill) to 80 mm/s (very stiff silty clay); a factor of about 6 between ground types",
   "sources": [
    {
     "title": "Lukas (1995) Geotechnical Engineering Circular No. 1: Dynamic Compaction, FHWA-SA-95-037 (USDOT ROSAP scan)",
     "url": "https://rosap.ntl.bts.gov/view/dot/40768/dot_40768_DS1.pdf"
    }
   ],
   "who_when": "Lukas 1995 figure, read by us 2026",
   "notes": "Marker points read off GEC 1 Fig. 7 (x = scaled energy factor in √(t·m)/m, y = PPV in mm/s), reading error about ±25%: (1) very stiff silty clay x 0.58, 42; (2) medium dense micaceous sand x 1.2, 57; (3) clayey mine spoil x 3.9, 154; (4) building rubble x 0.14, 4.6; (5) collapsible silt x 0.46, 22; (6) loose sand x 0.65, 15; (7) loose sand fill x 1.2, 20; (8) loose decomposed garbage x 0.44, 4.7. Line slopes read as about 1.0–1.4 on log-log axes. Values at x = 1 extrapolated by us with slope 1.2: (1) ~80, (2) ~46, (3) ~30, (4) ~49, (5) ~56, (6) ~25, (7) ~16, (8) ~13 mm/s. For comparison the BS 5228 / Mayne (1985) upper bound gives 91 mm/s and Mayne (1984) 70 mm/s at x = 1. Stiffer, denser ground gives more PPV per unit scaled energy in this dynamic-compaction data (loose fills absorb energy in the crater), which is the opposite of the elastic small-load trend (softer ground shakes more for the same force); keep the two regimes apart.",
   "values_json": "{\"units\": \"x = sqrt(E[kJ]/9.8)/d[m]; PPV mm/s\", \"points\": {\"very stiff silty clay\": [0.58, 42], \"medium dense micaceous sand\": [1.2, 57], \"clayey mine spoil\": [3.9, 154], \"building rubble\": [0.14, 4.6], \"collapsible silt\": [0.46, 22], \"loose sand\": [0.65, 15], \"loose sand fill\": [1.2, 20], \"loose decomposed garbage\": [0.44, 4.7]}, \"at_x_1_slope_1p2\": {\"very stiff silty clay\": 80, \"medium dense micaceous sand\": 46, \"clayey mine spoil\": 30, \"building rubble\": 49, \"collapsible silt\": 56, \"loose sand\": 25, \"loose sand fill\": 16, \"loose decomposed garbage\": 13}}"
  },
  {
   "key": "vib_dynamic_compaction_frequency",
   "category": "attenuation",
   "label": "Dominant frequency of ground vibration from dropped weights (dynamic compaction, rapid impact compaction)",
   "status": "verified",
   "value_si": null,
   "unit_si": "Hz",
   "low_si": 3,
   "high_si": 50,
   "display": "Crane dynamic compaction 3–10 Hz (FHWA) or 5–10 Hz / 25–35 Hz (two Canadian sites); rapid impact compaction (9 t hammer on a plate) 20–30 Hz and 40–50 Hz",
   "sources": [
    {
     "title": "Lukas (1986) Dynamic Compaction for Highway Construction, Vol. 1: Design and Construction Guidelines, FHWA/RD-86/133 (USDOT ROSAP scan)",
     "url": "https://rosap.ntl.bts.gov/view/dot/68405/dot_68405_DS1.pdf"
    },
    {
     "title": "Lauzon, Morel, Briet & Beaton (c. 2011) Ground Vibrations Induced by Dynamic Compaction and Rapid Impact Compaction (ISSMGE online library, GEO11 paper 581)",
     "url": "https://www.issmge.org/uploads/publications/84/52/GEO11Paper581.pdf"
    }
   ],
   "who_when": "Lukas 1986; Lauzon et al. c. 2011",
   "notes": "Lukas 1986 p. 101: 'Most of the dynamic compaction vibrations produce frequencies in the range of 3 to 10 Hertz'. Lauzon et al., Trois-Rivières (loose to compact fine sand, water table 1.7 m): 'Vibration frequencies for the DC rig are generally between 5 and 10 Hz. For the RIC rig, frequencies are generally between 20 and 30 Hz.' Québec City (crushed-stone fill 2–6 m on bedrock; 11 t tamper from 18 m): 'For DC tampers dropped from full height, frequencies are typically in the range of 25 to 35 Hz with similar values when the drop height has been reduced to half. For ironing using DC methods and for RIC, the frequencies typically are in the range between 40 and 50 Hz.' Frequency depends on the ground (stiffer, thinner deposits give higher frequency) and on the impact (smaller, quicker impacts give higher frequency)."
  },
  {
   "key": "vib_repeat_drops_raise_ppv",
   "category": "attenuation",
   "label": "PPV from the same drop rises as the ground under it is compacted (2–8× over repeated drops)",
   "status": "verified",
   "value_si": null,
   "unit_si": "ratio",
   "low_si": 2,
   "high_si": 8,
   "display": "18.1 t from 30 m: 4 → 13 mm/s at 20 m over 21 drops; 11 t from 18 m: 1–2 → ~8 mm/s at 10 m over 6 drops",
   "sources": [
    {
     "title": "Lukas (1986) Dynamic Compaction for Highway Construction, Vol. 1: Design and Construction Guidelines, FHWA/RD-86/133 (USDOT ROSAP scan)",
     "url": "https://rosap.ntl.bts.gov/view/dot/68405/dot_68405_DS1.pdf"
    },
    {
     "title": "Lauzon, Morel, Briet & Beaton (c. 2011) Ground Vibrations Induced by Dynamic Compaction and Rapid Impact Compaction (ISSMGE online library, GEO11 paper 581)",
     "url": "https://www.issmge.org/uploads/publications/84/52/GEO11Paper581.pdf"
    }
   ],
   "who_when": "Dumas & Beaton via Lukas 1986; Lauzon et al. c. 2011",
   "notes": "Lukas 1986 p. 100: 'Dumas and Beaton (25) present information showing how the peak particle velocity increases from .16 to .51 in/sec (4 to 13 mm/sec) as the number of drops increases from 1 to 21. These readings were obtained at a point located 66 ft (20 m) from the imprint where a 20 ton (18.1 t) tamper was being dropped over a height of 98 ft (30 m) onto a silty rock fill.' Lauzon et al.: 'For the first blow, the vibration level was measured between 1 and 2 mm/s. After 6 blows the vibration level reached close to 8 mm/s at a distance of 10 m from the point of impact.' Relevance: the first drop onto soft ground loses energy to cratering; a footstep on firm ground behaves more like the later, stiffer drops. This is part of why one energy law cannot fit all drops to better than a factor of a few. Interesting cross-check (ours): 18.1 t × 30 m = 5.3 MJ gives 119 mm/s at 20 m from BS 5228's upper bound, versus 4–13 measured: an upper bound 9–30 times above these readings."
  },
  {
   "key": "vib_pisa_drop_test_ppv",
   "category": "attenuation",
   "label": "Low-energy drop test: 130 kg dropped about 3 m onto soil at Pisa, PPV at 2.5–60 m",
   "status": "verified",
   "value_si": 0.009,
   "unit_si": "m/s (PPV at 2.5 m)",
   "low_si": 0.0002,
   "high_si": 0.009,
   "display": "9 mm/s at 2.5 m falling to 0.2 mm/s at 60 m; fitted fall-off ∝ r^-1.28; central frequency about 25 Hz (≈3.8 kJ, momentum 997 kg·m/s)",
   "sources": [
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    }
   ],
   "who_when": "Colombero, Kontoe, Foti & Potts 2015 (field data of Foti 2000/2003)",
   "notes": "'The drop load test configuration consisted of a 130 kg weight dropped from a height of approximately 3 m, hitting the ground directly in order to avoid mass rebound and to reach lower frequencies. The vibrations at the surface were recorded by 24 in-line geophones at 2.5m spacing.' 'The magnitude of the peak particle velocities recorded in Pisa decreases from 9 mm/s at a distance of 2.5 m from the source to 0.2 mm/s at a distance of 60 m (Figure 6, white circles).' Power law fit 'slope q = 1.282' (field) and 1.272 (their finite-element model). Source pulse fitted with 'TS = 0.04s' and momentum 'Cb = 997.4 kg·m/s'; synthetic source 'based on a single central frequency (25 Hz)'. From the plotted time histories (our reading, ±30%): about 5 mm/s at 5 m and 0.4–0.5 mm/s at 35 m. Site: Piazza dei Miracoli, layered sands and soft clays, Vs 150–245 m/s in the top 40 m (see vib_pisa_soil_profile). Energy 130 × 9.80665 × 3 ≈ 3.8 kJ: this is the one verified measurement found inside the footstep energy range (10 J–10 kJ). Velocities appear to be vertical-geophone readings (SASW set-up).",
   "values_json": "{\"distance_m\": [2.5, 5, 35, 60], \"ppv_mm_s\": [9, 5, 0.5, 0.2], \"quality\": [\"quoted\", \"read from Fig. 5\", \"read from Fig. 5\", \"quoted\"], \"fit_exponent_q\": 1.282, \"drop\": \"130 kg from ~3 m, directly on ground\", \"central_frequency_Hz\": 25}"
  },
  {
   "key": "vib_pisa_soil_profile",
   "category": "attenuation",
   "label": "Pisa test site: shear-wave speed, unit weight and damping of the layers",
   "status": "verified",
   "value_si": 170,
   "unit_si": "m/s (typical Vs, top 10 m)",
   "low_si": 150,
   "high_si": 380,
   "display": "Vs 150–245 m/s in the upper layers (380 m/s deep sand), unit weight 16.75–20 kN/m³, damping ratio 2–7%",
   "sources": [
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    }
   ],
   "who_when": "Colombero et al. 2015 (Table 1, after Foti 2003)",
   "notes": "Table 1 'Soil properties used in the finite element analysis': MG Vs 155 m/s, γ 19.00 kN/m³, ξ* 7.0%; A1 180, 18.50, 5.4%; A2 170, 18.00, 2.5%; BI 150, 16.75, 3.1%; BII 235, 19.50, 2.0%; BIII 245, 18.75, 2.0%; BIV 215, 18.00, 2.0%; C 380, 20.00, 2.0%; Poisson's ratio 0.33 for all. Water table taken at 1.3 m. Unit weights 16.75–20 kN/m³ correspond to densities 1,710–2,040 kg/m³. These are the inputs we used to test the elastic model against the Pisa drop (vib_model_check_pisa).",
   "values_json": "{\"layer\": [\"MG\", \"A1\", \"A2\", \"BI\", \"BII\", \"BIII\", \"BIV\", \"C\"], \"Vs_m_s\": [155, 180, 170, 150, 235, 245, 215, 380], \"unit_weight_kN_m3\": [19.0, 18.5, 18.0, 16.75, 19.5, 18.75, 18.0, 20.0], \"damping_ratio_pct\": [7.0, 5.4, 2.5, 3.1, 2.0, 2.0, 2.0, 2.0], \"poisson\": 0.33}"
  },
  {
   "key": "vib_drop_test_exponent_by_soil",
   "category": "attenuation",
   "label": "Measured fall-off exponent q (PPV ∝ r^-q) for drop-weight tests: about 1.0 on sand, 1.6 on clay",
   "status": "verified",
   "value_si": 1.3,
   "unit_si": "1",
   "low_si": 1,
   "high_si": 1.6,
   "display": "q ≈ 1.0 (sandy soils) to 1.6 (clayey soils) for drop load tests; Pisa field fit 1.28",
   "sources": [
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    },
    {
     "title": "Auersch & Said (2010) Attenuation of ground vibrations due to different technical sources, Earthquake Engineering and Engineering Vibration 9(3):337-344 (TRID abstract)",
     "url": "https://trid.trb.org/View/1101903"
    }
   ],
   "who_when": "Auersch 2010 via Colombero et al. 2015; Auersch & Said 2010",
   "notes": "Colombero et al. section 2.2: 'The experimental exponent q has been found varying between values of 1.0 and 1.6 for drop load tests carried out on sandy and clayey soils respectively (Auersch 2010).' Auersch & Said 2010 abstract (TRID): 'Nineteen measurements of ground vibrations induced by eight different technical sources including road and rail traffic' ... power-law exponents between 0.5 and 2.0 depending on the source; higher than geometric theory predicts, mainly from material (and scattering) damping; soil layering (dispersion) adds roughly 0.5 to the exponent for impulsive loads. Theory for a surface point load: 0.5 for Rayleigh waves alone (vib_geometric_spreading_exponents). The empirical 1.0–1.6 is what spreading plus damping plus layering gives over 2.5–60 m."
  },
  {
   "key": "vib_pisa_vs_empirical_laws",
   "category": "attenuation",
   "label": "How the dynamic-compaction laws do at 3.8 kJ (Pisa drop)",
   "status": "derived",
   "value_si": 5,
   "unit_si": "ratio (measured / BS 5228 predicted at 60 m)",
   "display": "BS 5228/Mayne 1985: 8.7 mm/s at 2.5 m (measured 9) but 0.04 mm/s at 60 m (measured 0.2, 5× low). Mayne 1984: 10 and 0.12 mm/s (1.7× low at 60 m)",
   "sources": [
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    },
    {
     "title": "BS 5228-2:2009+A1:2014 Annex E, Tables E.1 and E.2 (licensed copy filed as public-inquiry core document CD43.12, Omega West)",
     "url": "https://www.omegawestdocuments.com/media/documents/43/CD43.12%20-%204%20Code%20of%20practice%20for%20noise%20and%20vibration%20control%20on%20construction%20and%20open%20sites%20part%202%20vibration;.pdf"
    },
    {
     "title": "Lauzon, Morel, Briet & Beaton (c. 2011) Ground Vibrations Induced by Dynamic Compaction and Rapid Impact Compaction (ISSMGE online library, GEO11 paper 581)",
     "url": "https://www.issmge.org/uploads/publications/84/52/GEO11Paper581.pdf"
    }
   ],
   "who_when": "our calculation 2026",
   "notes": "W_h = 130 × 9.80665 × 3 = 3,825 J. BS 5228: 0.037 × (√3825/x)^1.7 → 8.65 mm/s at 2.5 m, 0.039 mm/s at 60 m. Mayne 1984 (reported): M·H = 0.39 t·m, 70 × (0.625/x)^1.4 → 10.0 mm/s at 2.5 m, 0.117 mm/s at 60 m. Measured 9 and 0.2 mm/s. So at footstep-scale energy the near field happens to agree, while the far field is under-predicted because real low-energy attenuation (r^-1.0 to r^-1.3) is slower than the law's r^-1.7 (or r^-1.4). Both 2.5 m and 3.8 kJ lie outside BS 5228's stated range (5–100 m, 1–12 MJ). One site only: treat as an indication, not a calibration."
  },
  {
   "key": "vib_caltrans_impact_pile_driver",
   "category": "attenuation",
   "label": "Caltrans screening law for impact pile drivers (energy-scaled, with distance exponent n)",
   "status": "verified",
   "value_si": 0.01651,
   "unit_si": "m/s (PPV_ref = 0.65 in/s at 25 ft for 36,000 ft·lb)",
   "display": "PPV = 0.65 in/s × (25/D[ft])^1.1 × (E/36,000 ft·lb)^0.5",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, April 2020 (Andrews, Buehler, Gill & Bender)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "who_when": "Caltrans 2020 (Eq. 9)",
   "notes": "Caltrans 2020 section 7.1.1: 'PPV Impact Pile Driver = PPVRef (25/D)^n x (Eequip/ERef)^0.5 (in/sec) (Eq. 9) Where: PPVRef = 0.65 in/sec for a reference pile driver at 25 ft. D = distance from pile driver to the receiver in ft. n = 1.1 ... ERef = 36,000 ft-lb (rated energy of reference pile driver)'. 'Literature indicates that the value of “n” in the above equation is generally 1 to 1.5. The suggested value for n is 1.1.' Rated energies of drivers: 'about 20,000–300,000 foot-pounds' (27–410 kJ); 'Smaller drivers have rated energies as low as 300 ft-lbs' (0.4 kJ). Caltrans Eq. 8: 'if the energy of the driving force changes from E1 to E2, the vibration amplitude changes from V1 to V2 according to ... V2 = V1(E2/E1)^0.5'. Pile energy enters at depth; listed as a second empirical comparison only."
  },
  {
   "key": "vib_woods_jedele_n_by_soil_class",
   "category": "attenuation",
   "label": "Woods & Jedele (1985) distance exponent n by soil class (PPV = k D^-n), as given by Caltrans",
   "status": "verified",
   "value_si": 1.1,
   "unit_si": "1",
   "low_si": 1,
   "high_si": 1.5,
   "display": "Class I weak/soft soils: suggested 1.4 (no data); II competent soils: measured 1.5, suggested 1.3; III hard soils: 1.1; IV hard rock: suggested 1.0 (no data)",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, April 2020 (Andrews, Buehler, Gill & Bender)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "who_when": "Woods & Jedele 1985 via Woods 1997 (NCHRP Synthesis 253) and Caltrans 2020 Table 17",
   "notes": "Caltrans Table 17 'Measured and Suggested “n” Values Based on Soil Class': I 'Weak or soft soils: loose soils, dry or partially saturated peat and muck, mud, loose beach sand, and dune sand, recently plowed ground, soft spongy forest or jungle floor, organic soils, top soil. (shovel penetrates easily)' — 'Data not available', suggested 1.4. II 'Competent soils: most sands, sandy clays, silty clays, gravel, silts, weathered rock. (can dig with shovel)' — 1.5, suggested 1.3. III 'Hard soils: dense compacted sand, dry consolidated clay, consolidated glacial till, some exposed rock. (cannot dig with shovel, need pick to break up)' — 1.1, 1.1. IV 'Hard, competent rock: bedrock, freshly exposed hard rock. (difficult to break with hammer)' — 'Data not available', 1.0. Caltrans: the n value 'is a composite value or pseudo-attenuation coefficient that accounts for both geometric and material damping'. Woods & Jedele's frequency-dependent α table was not found in an accessible source.",
   "values_json": "{\"class\": [\"I weak/soft\", \"II competent\", \"III hard\", \"IV hard rock\"], \"n_measured\": [null, 1.5, 1.1, null], \"n_suggested\": [1.4, 1.3, 1.1, 1.0]}"
  },
  {
   "key": "vib_construction_frequency_range",
   "category": "attenuation",
   "label": "Typical frequency of ground vibration from construction and traffic; wave speeds and wavelengths",
   "status": "verified",
   "value_si": 15,
   "unit_si": "Hz",
   "low_si": 10,
   "high_si": 30,
   "display": "Usually 10–30 Hz, centred near 15 Hz; pile driving 4–30 Hz; ground wave speeds 61–610 m/s, wavelengths 3–152 m",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, April 2020 (Andrews, Buehler, Gill & Bender)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "who_when": "Caltrans 2020 citing Hendriks 2002",
   "notes": "Caltrans p. 17: 'Typical vibration from transportation and construction sources typically falls in the range of 10–30 Hz and usually centers around 15 Hz (Hendriks 2002).' p. 17: 'damage levels in terms of velocity in the frequency range of 1–80 Hz tend to be independent of frequency. This is also true for complaint levels in a frequency range of 8–80 Hz.' Chapter on wave barriers: 'Pile driving typically generates ground vibration with frequencies in the range of 4–30 Hz. With common wave velocities in the range of 61–610 m/s, typical wavelengths can be in the range of 3–152 m.'"
  },
  {
   "key": "vib_footstep_frequency_band",
   "category": "attenuation",
   "label": "Human footsteps: force mostly at 1–4 Hz; ground particle velocity mostly at 20–90 Hz",
   "status": "verified",
   "value_si": null,
   "unit_si": "Hz",
   "low_si": 20,
   "high_si": 90,
   "display": "Footstep force peaks at 1–4 Hz (walking rhythm); the seismic particle-velocity response is site-specific, characteristic band 20–90 Hz",
   "sources": [
    {
     "title": "Ekimov & Sabatier (2006) Vibration and sound signatures of human footsteps in buildings, J Acoust Soc Am 120(2):762-8 (PubMed abstract, PMID 16938964, via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=16938964&rettype=abstract&retmode=text"
    }
   ],
   "who_when": "Ekimov & Sabatier 2006",
   "notes": "Abstract: 'Early research showed the maximum value for the force of multiple footsteps to be in the frequency band of 1-4 Hz.' 'the low-frequency band (below 500 Hz) is well known in the literature, and generated by the force normal to the ground/floor. The seismic particle velocity response to footsteps was shown to be site specific and the characteristic frequency band was 20-90 Hz.' 'Different walking styles result in different vibration signatures in the low-frequency range.' The gap between 1–4 Hz force and 20–90 Hz velocity is the physics in vib_physics_rayleigh_farfield: ground velocity grows as frequency^1.5 for the same force amplitude, so the fast parts of the footfall (heel strike, foot slap) dominate what a sensor feels. No absolute footstep PPV values with distance were found in a primary source."
  },
  {
   "key": "vib_elephant_seismic_speed_frequency",
   "category": "attenuation",
   "label": "Asian elephant footfalls and rumbles: ground-wave speed, frequency and range of measurement",
   "status": "verified",
   "value_si": 256,
   "unit_si": "m/s (seismic propagation speed at the site)",
   "low_si": 248,
   "high_si": 264,
   "display": "Seismic signals travelled at 248–264 m/s, predominant frequency about 20 Hz, well above background at 40 m",
   "sources": [
    {
     "title": "O'Connell-Rodwell, Arnason & Hart (2000) Seismic properties of Asian elephant vocalizations and locomotion, J Acoust Soc Am 108(6):3066-72 (PubMed abstract, PMID 11144599, via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=11144599&rettype=abstract&retmode=text"
    }
   ],
   "who_when": "O'Connell-Rodwell, Arnason & Hart 2000",
   "notes": "Abstract: 'elephant generated signals associated with rumbles and \"foot stomps\" propagated at different velocities in the two media, the acoustic signals traveling at 309 m/s and the seismic signals at 248-264 m/s. Both types of signals had predominant frequencies in the range of 20 Hz. Seismic signal amplitudes considerably above background noise were recorded at 40 m from the generating elephants for both the rumble and the stomp. Seismic propagation models suggest that seismic waveforms from vocalizations are potentially detectable by instruments at distances of up to 16 km, and up to 32 km for locomotion generated signals.' The 248–264 m/s is a Rayleigh-type surface-wave speed, implying a shear-wave speed of about 270–290 m/s at that site (c_R ≈ 0.92 c_s). The 16–32 km figures are model estimates of instrumental detectability, not felt vibration. The elephant comparison as a whole belongs to the elephant research topic; it is listed here because it anchors frequency and wave speed."
  },
  {
   "key": "vib_elephant_stomp_ppv",
   "category": "attenuation",
   "label": "Asian elephant foot stomps: ground velocity at 3–12 m and at 40 m (peak-to-peak)",
   "status": "reported",
   "value_si": 0.0000487,
   "unit_si": "m/s peak-to-peak (at 3–12 m)",
   "low_si": 0.000017,
   "high_si": 0.0000487,
   "display": "About 48.7 µm/s peak-to-peak at 3–12 m and 17.0 µm/s at 40 m (roughly 0.024 and 0.009 mm/s peak)",
   "sources": [
    {
     "title": "Towards Long Range Detection of Elephants Using Seismic Signals; A Geophone-Sensor Interface for Embedded Systems (arXiv:2406.05140, 2024), Section III, citing O'Connell-Rodwell et al. 2000",
     "url": "https://arxiv.org/pdf/2406.05140"
    },
    {
     "title": "O'Connell-Rodwell, Arnason & Hart (2000) Seismic properties of Asian elephant vocalizations and locomotion, J Acoust Soc Am 108(6):3066-72 (PubMed abstract, PMID 11144599, via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=11144599&rettype=abstract&retmode=text"
    },
    {
     "title": "BS 5228-2:2009+A1:2014 Annex E, Tables E.1 and E.2 (licensed copy filed as public-inquiry core document CD43.12, Omega West)",
     "url": "https://www.omegawestdocuments.com/media/documents/43/CD43.12%20-%204%20Code%20of%20practice%20for%20noise%20and%20vibration%20control%20on%20construction%20and%20open%20sites%20part%202%20vibration;.pdf"
    }
   ],
   "who_when": "O'Connell-Rodwell et al. 2000, as quoted in arXiv:2406.05140 (2024)",
   "notes": "Secondary quote, not seen in the original paper (only its abstract was fetched): 'According to [44], the RMS velocity of elephant rumbles is 0.437 µm/s at a distance of 3-12 m and is 0.264 µm/s at a distance of 40 m. For the corresponding distances, experimental peak-to-peak velocities for stomps were 48.7 µm/s and 17.0 µm/s, respectively.' Peak (zero-to-peak) is about half of peak-to-peak. The elephants' masses and the force of a 'stomp' are not given in what we fetched, so this is an order-of-magnitude anchor: an elephant (weight not stated in what we fetched) produced ground velocity of a few hundredths of a mm/s at about 10 m, about 6–12 times below the BS 5228-2 Table B.1 guide values for vibration that 'might be just perceptible' (0.14 mm/s 'in the most sensitive situations', 0.3 mm/s 'in residential environments'); thresholds proper belong to the thresholds topic. Ratio 3–12 m to 40 m ≈ 2.9."
  },
  {
   "key": "vib_wave_energy_partition_miller_pursey",
   "category": "attenuation",
   "label": "Energy radiated by a vertical force on the ground surface, and its split among wave types (Miller & Pursey 1955)",
   "status": "verified",
   "value_si": 0.6735,
   "unit_si": "1 (Rayleigh-wave share)",
   "low_si": 0.67,
   "high_si": 0.6735,
   "display": "Mean power Π = 1.209 ω² P² / (π ρ c_p³) for a harmonic force P cos ωt (Poisson ratio 1/4); 67.35% Rayleigh, 25.76% shear, 6.89% compressional",
   "sources": [
    {
     "title": "Sanchez-Sesma, Weaver, Kawase, Matsushima, Luzon & Campillo (2011) Energy partitions among elastic waves for dynamic surface loads in a semi-infinite solid, BSSA (accepted manuscript)",
     "url": "https://www.isterre.fr/IMG/pdf/Sanchez_Sema_BSSA.pdf"
    },
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, April 2020 (Andrews, Buehler, Gill & Bender)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    },
    {
     "title": "Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)",
     "url": "https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf"
    }
   ],
   "who_when": "Miller & Pursey 1955, as reproduced by Sanchez-Sesma et al. 2011; Caltrans 2020; TRL 2000",
   "notes": "Sanchez-Sesma et al.: 'they found that the total power radiated by a vertical harmonic load Pe^{iωt} is given by Π=1.209ω²P²/πρα³, where ω = circular frequency, ρ = mass density, and α = propagation velocity of P waves. Such an amount is partitioned among P, SV and Rayleigh waves in 6.89, 25.76 and 67.35 per cent, respectively. They assumed a Poisson ratio ν =1/4'. Caltrans p. 13: 'About 67% of energy is transmitted in the R-wave, 26% in the S-wave, and 7% in the P-wave (Richart 1970).' TRL 429 p. 5: 'Miller and Pursey (1955) showed that approximately two thirds of the energy from a source located at the ground surface is radiated as Rayleigh waves.' The 1955 paper itself (Proc. R. Soc. A 233:55-69) was not fetched. Valid for a source small compared with the wavelength. We used the 1.209 and 67.35% values to check our own Rayleigh-wave amplitude (vib_physics_rayleigh_farfield); they agree to 0.02%."
  },
  {
   "key": "vib_geometric_spreading_exponents",
   "category": "attenuation",
   "label": "Geometric spreading: how amplitude falls with distance for each wave type from a surface point source",
   "status": "verified",
   "value_si": 0.5,
   "unit_si": "1 (Rayleigh-wave exponent, surface source and receiver)",
   "display": "Surface source, surface receiver: Rayleigh waves ∝ r^-0.5, body waves ∝ r^-2; buried source: body waves ∝ r^-1",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, April 2020 (Andrews, Buehler, Gill & Bender)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    },
    {
     "title": "Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)",
     "url": "https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf"
    }
   ],
   "who_when": "Amick 2000 via Caltrans 2020 (Table 1); TRL 2000",
   "notes": "Caltrans Table 1 'Geometric Attenuation Coefficients' (source: Amick 2000): point on surface, R wave, measured at surface, γ = 0.5; point on surface, body (P or S), surface, 2; point at depth, body, surface, 1; point at depth, body, depth, 1. Eq. 5: 'vb = va (ra/rb)^γ'. Caltrans: 'The amplitude of R-waves decreases in direct proportion to the square root of the distance from the source.' TRL 429 p. 5: 'the particle velocity attenuates according to 1/r and 1/r^0.5 for body and surface waves, respectively.' Near the source (within about a third of a wavelength) the quasi-static field, which falls as 1/r, dominates instead (vib_physics_nearfield_boussinesq).",
   "values_json": "{\"surface source, R wave, surface\": 0.5, \"surface source, body wave, surface\": 2, \"depth source, body wave, surface\": 1, \"depth source, body wave, depth\": 1}"
  },
  {
   "key": "vib_bornitz_damping_form",
   "category": "attenuation",
   "label": "Bornitz/Mintrop attenuation form: geometric spreading times exponential material damping",
   "status": "verified",
   "value_si": 0.1,
   "unit_si": "1/m (α used by Greenwood & Farmer 1971 and Heckman & Hagerty 1978)",
   "low_si": 0.05,
   "high_si": 0.1,
   "display": "A₁ = A₀ (r₀/r₁)^β e^{-α(r₁ - r₀)}, β = 0.5 for surface waves; α ≈ 0.03 ft⁻¹ (0.10 m⁻¹) has been used for all soils",
   "sources": [
    {
     "title": "Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)",
     "url": "https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf"
    },
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, April 2020 (Andrews, Buehler, Gill & Bender)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "who_when": "Mintrop 1911 / Bornitz 1931 via TRL 2000; Richart 1970 via Caltrans 2020",
   "notes": "TRL 429 eq. (5) 'A1 = A0 (r0/r1)^β e^{-α(r1 - r0)} where A1 is the amplitude at distance r1 from the source; A0 is the amplitude at distance r0 from the source; α is the absorption coefficient; and ß is the geometric spreading term. Mintrop (1911) presented this equation with ß having a value of 0.5'. 'Greenwood and Farmer (1971) and Heckman and Hagerty (1978) assumed α to have a value of 0.03ft-1 (0.10m-1). However, these authors considered that this value is applicable to all cases and is not dependent upon the geology.' Massarsch (1992) example: amplitude at 50 m 'more than an order of magnitude higher without damping than when a coefficient of attenuation (α) of 0.05m-1 is assumed'. Caltrans Eq. 6 (Richart 1970): 'vb = va (ra/rb)^0.5 e^{α(ra – rb)}'. α depends on frequency (α = 2π f ξ / c_R for damping ratio ξ), so a single α applied to a pulse over-damps it at long range; our pulse treatment is vib_physics_damping_factor."
  },
  {
   "key": "vib_material_damping_coefficients",
   "category": "attenuation",
   "label": "Measured material-damping coefficients α for soils (Amick 2000 compilation, Caltrans Table 2)",
   "status": "verified",
   "value_si": 0.1,
   "unit_si": "1/m (typical)",
   "low_si": 0.01,
   "high_si": 0.65,
   "display": "α from 0.01 m⁻¹ (saturated fine sand) to about 0.65 m⁻¹ (dune sand); 0.02 m⁻¹ for a 4-inch concrete slab on compact granular fill",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, April 2020 (Andrews, Buehler, Gill & Bender)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "who_when": "Amick 2000 and Hendriks 2002 via Caltrans 2020",
   "notes": "Caltrans Table 2 'Summary of Material-Damping Coefficients (Applies to Both P- and S-Waves)', α ft⁻¹ / m⁻¹: Forssblad silty gravelly sand 0.04 / 0.13; Richart 4-in. concrete slab over compact granular fill 0.006 / 0.02; Woods silty fine sand 0.079 / 0.26; Barkan saturated fine grain sand 0.003 / 0.010; frozen 0.018 / 0.06; saturated sand with peat and organic silt 0.012 / 0.04; clayey sand, clay with some sand, and silt above water level 0.012 / 0.04; marly chalk 0.03 / 0.1; loess 0.03 / 0.1; saturated clay with sand and silt 0.0–0.037 / 0.0–0.12; Dalmatov sand and silt 0.079–0.11 / printed 0.026–0.36; Clough & Chameau sand fill over bay mud 0.015–0.061 / 0.05–0.2; dune sand 0.076–0.2 / printed 0.025–0.65; Peng soft Bangkok clay 0.079–0.13 / printed 0.026–0.44; Hendriks sand-silt, clayey silt, silty sand 0.006 / 0.021. The three 'printed' metric lower bounds are inconsistent with their ft⁻¹ values (0.079 ft⁻¹ = 0.26 m⁻¹, 0.076 ft⁻¹ = 0.25 m⁻¹): apparent decimal slips in the table. Frequencies of measurement are not given, so these α values cannot be transferred to a different frequency without assuming one.",
   "values_json": "{\"units\": \"alpha per metre (per foot in brackets)\", \"silty gravelly sand (Forssblad)\": \"0.13 (0.04)\", \"4-in concrete slab over compact granular fill (Richart)\": \"0.02 (0.006)\", \"silty fine sand (Woods)\": \"0.26 (0.079)\", \"saturated fine sand (Barkan)\": \"0.010 (0.003)\", \"saturated fine sand, frozen\": \"0.06 (0.018)\", \"saturated sand with peat/organic silt\": \"0.04 (0.012)\", \"clayey sand, clay, silt above water\": \"0.04 (0.012)\", \"marly chalk\": \"0.1 (0.03)\", \"loess\": \"0.1 (0.03)\", \"saturated clay with sand and silt\": \"0.0-0.12 (0.0-0.037)\", \"sand and silt (Dalmatov)\": \"0.26-0.36 (0.079-0.11); printed 0.026-0.36\", \"sand fill over bay mud\": \"0.05-0.2 (0.015-0.061)\", \"dune sand\": \"0.25-0.65 (0.076-0.2); printed 0.025-0.65\", \"soft Bangkok clay\": \"0.26-0.44 (0.079-0.13); printed 0.026-0.44\", \"sand-silt, clayey silt, silty sand (Hendriks)\": \"0.021 (0.006)\"}"
  },
  {
   "key": "vib_soil_p_to_s_speed_ratio",
   "category": "attenuation",
   "label": "Soils: compressional-wave speed is about 1.7 times the shear-wave speed (Poisson ratio about 0.24)",
   "status": "verified",
   "value_si": 1.7,
   "unit_si": "ratio c_p / c_s",
   "display": "c_p ≈ 1.7 c_s for (unsaturated) soils, close to the ν = 1/4 \"Poisson solid\" (√3 = 1.73) that the exact formulas assume",
   "sources": [
    {
     "title": "Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)",
     "url": "https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf"
    }
   ],
   "who_when": "Hiller & Crabb 2000",
   "notes": "TRL 429 p. 5: 'For soils, the compressional wave velocity is typically about 1.7 times the shear wave velocity.' c_p/c_s = 1.7 corresponds to ν = 0.24 (our conversion: ν = (r² − 2)/(2(r² − 1))). Saturated soils are different: below the water table c_p is set by the pore water (about 1,500 m/s) while c_s stays low, so ν approaches 0.5 (Pisa model used 0.33). Our model constants are for ν = 1/4; at ν = 0.45–0.49 the far-field coefficient falls by about 35–40% and the near-field one by about 27–32% (vib_physics_rayleigh_farfield)."
  },
  {
   "key": "vib_physics_nearfield_boussinesq",
   "category": "attenuation",
   "label": "Near the step: quasi-static ground velocity from a changing vertical force (Boussinesq)",
   "status": "derived",
   "value_si": 0.1194,
   "unit_si": "1 (coefficient (1-ν)/2π at ν = 1/4)",
   "display": "PPV_near = (1 − ν) · (dF/dt)_max / (2π ρ c_s² r) ≈ 0.119 (dF/dt)_max / (ρ c_s² r)",
   "sources": [
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    }
   ],
   "who_when": "our derivation 2026 (Boussinesq static surface displacement, differentiated in time)",
   "notes": "Static vertical surface displacement at distance r from a vertical point force F on an elastic half-space: u = (1 − ν) F / (2π μ r), μ = ρ c_s² (Boussinesq). When the force changes slowly compared with the wave transit time, the ground follows quasi-statically, so v = (1 − ν) Ḟ / (2π μ r). Checks we ran: (1) the low-frequency limit of the full wavenumber integral for the surface Green's function reproduced −(1 − ν)/(2π) = −0.11937 to within 0.03% (computed −0.11940); (2) the exact time-domain solution (vib_physics_pekeris_step_response) gives PPV·r → 0.375 F_p/(ρ c_s² T) for a Hann pulse and 0.1875 F_p/(ρ c_s² τ) for a raised-cosine ramp, exactly (1 − ν)·max(df/dt)/(2π) for those shapes. Valid for r below about 0.4 c_s T (Hann) or 1.1 c_s τ (ramp), and for r larger than about twice the footprint radius. Colombero et al. is cited only because they list Pekeris (1955) and Lamb (1904) as the classical point-load solutions; the formula is textbook elasticity, not taken from them."
  },
  {
   "key": "vib_physics_rayleigh_farfield",
   "category": "attenuation",
   "label": "Far from the step: Rayleigh-wave amplitude from a vertical surface force (Lamb 1904, pole residue)",
   "status": "derived",
   "value_si": 0.0763,
   "unit_si": "1 (coefficient C1/√(2π ξ_R) at ν = 1/4)",
   "display": "Harmonic force F cos ωt: Rayleigh vertical velocity amplitude = 0.0763 F ω^1.5 / (ρ c_s^2.5 √r) (ν = 1/4); c_R = 0.919 c_s",
   "sources": [
    {
     "title": "Sanchez-Sesma, Weaver, Kawase, Matsushima, Luzon & Campillo (2011) Energy partitions among elastic waves for dynamic surface loads in a semi-infinite solid, BSSA (accepted manuscript)",
     "url": "https://www.isterre.fr/IMG/pdf/Sanchez_Sema_BSSA.pdf"
    }
   ],
   "who_when": "our derivation 2026, checked against Miller & Pursey 1955 (via Sanchez-Sesma et al. 2011)",
   "notes": "Surface vertical displacement for a vertical harmonic point force: u_z = (F/2πμ) ∫ k_s² ν_α k J0(kr) / R(k) dk, with R(k) = (2k² − k_s²)² − 4k² ν_α ν_β (Rayleigh function), ν_α = √(k² − k_p²), ν_β = √(k² − k_s²). The Rayleigh pole gives |u_z| = (F/μ) C1 √(k_s / (2π ξ_R r)), where ξ_R = c_s/c_R and C1 = |ξ_R √(ξ_R² − γ²) / D'(ξ_R)| with D(ξ) = (2ξ² − 1)² − 4ξ² √(ξ² − γ²) √(ξ² − 1), γ = c_s/c_p. For ν = 1/4: ξ_R = 1.08766 (c_R = 0.9194 c_s), C1 = 0.19957. Velocity = ω u: 0.19957/√(2π·1.08766) = 0.0763. Independent checks: (1) the Rayleigh power implied by this amplitude and the Rayleigh eigenfunctions is 0.04989 ω²F²/(ρ c_s³); Miller & Pursey's 67.35% × 1.209/(π·3^1.5) = 0.04988, agreement 0.02%; (2) C1 equals √(3√3 + 5)/16 = 0.19957, the Rayleigh singularity coefficient in Pekeris's closed form, to 9 digits; (3) the Rayleigh horizontal/vertical ratio comes out 0.681, the textbook value for ν = 1/4. The ω^1.5 growth is why the quick parts of a footfall dominate the far field. Constants for other Poisson ratios in values_json (computed the same way).",
   "values_json": "{\"nu\": [0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.49], \"cR_over_cs\": [0.9022, 0.911, 0.9194, 0.9274, 0.935, 0.9422, 0.949, 0.9541], \"C1\": [0.2449, 0.2214, 0.1996, 0.1794, 0.1608, 0.1438, 0.1282, 0.1167], \"far_coef_C1_over_sqrt_2pi_xiR\": [0.0928, 0.0843, 0.0763, 0.0689, 0.062, 0.0557, 0.0498, 0.0455], \"rayleigh_H_over_V\": [0.727, 0.705, 0.681, 0.656, 0.63, 0.602, 0.574, 0.55], \"near_coef_(1-nu)/2pi\": [0.1353, 0.1273, 0.1194, 0.1114, 0.1035, 0.0955, 0.0875, 0.0812]}"
  },
  {
   "key": "vib_physics_pekeris_step_response",
   "category": "attenuation",
   "label": "Exact surface motion from a suddenly applied vertical point force (Pekeris 1955 closed form, ν = 1/4), numerically checked",
   "status": "derived",
   "value_si": null,
   "unit_si": "m (displacement)",
   "display": "w(r,t) = (P/μr)·W(τ), τ = c_s t / r: zero before the P wave (τ < 1/√3); singular at the Rayleigh arrival τ_R = 1.0877; static 3P/(8πμr) afterwards",
   "sources": [
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    }
   ],
   "who_when": "Pekeris 1955 (formula reconstructed by us and verified numerically, 2026)",
   "notes": "Step load P·H(t), Poisson solid, displacement in the load direction, γ_R² = (3 + √3)/4: τ < 1/√3: W = 0. 1/√3 < τ < 1: W = (1/32π)[6 − √3/√(τ² − 1/4) − √(3√3 + 5)/√(γ_R² − τ²) + √(3√3 − 5)/√(τ² − (3 − √3)/4)]. 1 < τ < γ_R: W = (1/16π)[6 − √(3√3 + 5)/√(γ_R² − τ²)]. τ > γ_R: W = 6/(16π) = 3/(8π). We could not fetch Pekeris (1955), PNAS 41:469 (PMC behind a browser check) or Kausel (2012), so we checked the formula ourselves: convolved with a smooth force pulse it matches an independent numerical wavenumber integration of the frequency-domain Green's function to 0.5% (r = c_s T), 0.6% (3 c_s T) and 1.3% (10 c_s T) RMS of peak, with peak velocities within 3–11% (the numerical version carries 0.2% damping, which explains the larger gap at long range). Its Rayleigh singularity coefficient also matches the independent residue calculation exactly. Velocity for any force history: v(r,t) = d/dt ∫ Ḟ(t − s) w_step(r, s) ds. Scripts: scratchpad research/attenuation/scripts/lamb_check2.py and ppv_table.py."
  },
  {
   "key": "vib_physics_pulse_ppv_model",
   "category": "attenuation",
   "label": "Recommended PPV model for one footfall: exact elastic result for a smooth force pulse, in closed form",
   "status": "derived",
   "value_si": null,
   "unit_si": "m/s",
   "display": "PPV = max(near, far) × D; Hann pulse of peak F, length T: near = 0.375 F/(ρ c_s² T r), far = 0.620 F/(ρ c_s^2.5 T^1.5 √r); ramp of rise time τ: near = 0.1875 F/(ρ c_s² τ r), far = 0.181 F/(ρ c_s^2.5 τ^1.5 √r)",
   "sources": [
    {
     "title": "Sanchez-Sesma, Weaver, Kawase, Matsushima, Luzon & Campillo (2011) Energy partitions among elastic waves for dynamic surface loads in a semi-infinite solid, BSSA (accepted manuscript)",
     "url": "https://www.isterre.fr/IMG/pdf/Sanchez_Sema_BSSA.pdf"
    },
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    }
   ],
   "who_when": "our derivation 2026 (Lamb/Pekeris elastic half-space, ν = 1/4)",
   "notes": "Vertical PPV at the surface, distance r, from a vertical force on an elastic half-space (density ρ, shear-wave speed c_s, Poisson ratio 1/4). Two smooth force shapes: 'Hann' F(t) = F·½(1 − cos 2πt/T), 0 ≤ t ≤ T (a stamp or impact that rises and falls); 'ramp' F(t) = F·½(1 − cos πt/τ) for t ≤ τ, then held (a footstep loading up; unloading at toe-off is a second, mirror event). Exact elastic PPV (Pekeris kernel convolved numerically) is PPV = F/(ρ c_s³ T²)·Π(x), x = r/(c_s T), tabulated in values_json. Asymptotes: Π → 0.375/x (Hann) and 0.1875/x (ramp) near the source; Π → 0.620/√x and 0.181/√x far away (the far constants also follow analytically from vib_physics_rayleigh_farfield: 0.6198 and 0.1808). max(near, far) is within 17% (Hann, worst at x ≈ 1.3) and 13% (ramp, x ≈ 0.9) of the exact elastic value; the power mean (near^3.75 + far^3.75)^(1/3.75) is within 5% for the ramp. D is the damping factor in vib_physics_damping_factor (≈1 within a few wavelengths). Half-sine pulses (kinks at start and end) give unbounded elastic PPV and are not used; real onsets are smooth. Assumes: homogeneous half-space (no layering, water table or slab), point source (footprint radius ≲ 0.2 c_s T), linear ground (shear strain PPV/c_s below about 10⁻⁴), vertical force only.",
   "values_json": "{\"x_r_over_csT\": [0.02, 0.038, 0.072, 0.137, 0.26, 0.493, 0.936, 1.778, 3.375, 6.407, 12.164, 23.094, 43.843, 83.236, 158.021, 300.0], \"Pi_hann\": [18.8, 9.88, 5.22, 2.79, 1.51, 0.885, 0.566, 0.426, 0.312, 0.239, 0.175, 0.132, 0.1, 0.0686, 0.05, 0.0348], \"Pi_ramp\": [9.38, 4.94, 2.6, 1.38, 0.73, 0.398, 0.227, 0.145, 0.0977, 0.0707, 0.0515, 0.0383, 0.0287, 0.02, 0.0145, 0.0102], \"PPV\": \"F/(rho cs^3 T^2) * Pi(x); T = pulse length (Hann) or rise time tau (ramp)\", \"asymptotes\": {\"hann_near\": \"0.375/x\", \"hann_far\": \"0.620/sqrt(x)\", \"ramp_near\": \"0.1875/x\", \"ramp_far\": \"0.181/sqrt(x)\"}, \"nu\": 0.25, \"table_noise\": \"about 3% from sampling the Rayleigh singularity\"}"
  },
  {
   "key": "vib_physics_damping_factor",
   "category": "attenuation",
   "label": "Material damping of a footfall pulse with distance (constant damping ratio ξ applied to every frequency)",
   "status": "derived",
   "value_si": null,
   "unit_si": "1",
   "display": "D = (1 + (ζ/0.224)^1.4)^(−2.5/1.4) for a Hann pulse, D = (1 + (ζ/0.195)^2.05)^(−1.5/2.05) for a ramp; ζ = ξ r / (c_R T)",
   "sources": [
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    },
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, April 2020 (Andrews, Buehler, Gill & Bender)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "who_when": "our derivation 2026",
   "notes": "Each frequency ω decays as exp(−ω ξ r / c_R) (constant-Q damping; Colombero et al. use the same exp(−2πξ r/λ_R) form, eq. 2). Applied to the far-field Rayleigh pulse spectrum (F̂(ω)·ω^1.5) and taking the new peak gives D(ζ), ζ = ξ r/(c_R T). Fits within a factor 1.10 (Hann) and 1.21 (ramp) of the computed D over ζ = 0.001–100. At long range D falls as ζ^-2.5 (Hann) or ζ^-1.5 (ramp): the pulse stretches as high frequencies die, so PPV decays as a power of distance, not exponentially. A single fixed α (Bornitz) applied to the peak over-damps a pulse at long range (it gave 10⁻⁴–10⁻⁶ of the elastic value at 200 m for soft soil, which no data support). We apply D to both near and far terms (harmless near the source, where ζ is small, and it stops the 1/r term from dominating at long range). Example: Pisa drop (ξ = 0.03, r = 60 m, c_R = 138 m/s, T = 0.03 s): ζ = 0.43, D = 0.12.",
   "values_json": "{\"zeta\": [0.0, 0.001, 0.00316, 0.01, 0.0316, 0.1, 0.316, 1.0, 3.16, 10.0, 31.6, 100.0], \"D_hann\": [1.0, 0.994, 0.981, 0.943, 0.83, 0.562, 0.188, 0.021, 0.00132, 7.53e-05, 4.23e-06, 2.24e-07], \"D_ramp\": [1.0, 0.996, 0.989, 0.965, 0.894, 0.707, 0.365, 0.0975, 0.0185, 0.00328, 0.000553, 7.2e-05], \"fit_hann\": \"(1+(zeta/0.224)^1.4)^(-2.5/1.4)\", \"fit_ramp\": \"(1+(zeta/0.195)^2.05)^(-1.5/2.05)\"}"
  },
  {
   "key": "vib_physics_seismic_energy_from_force",
   "category": "attenuation",
   "label": "Seismic energy radiated by a changing vertical force on the ground",
   "status": "derived",
   "value_si": 0.1481,
   "unit_si": "1 (coefficient in E = k ∫(dF/dt)² dt / (ρ c_s³), ν = 1/4)",
   "display": "E_seismic = 2.418/(π ρ c_p³) ∫ (dF/dt)² dt = 0.148 ∫ (dF/dt)² dt / (ρ c_s³); two-thirds of it in Rayleigh waves",
   "sources": [
    {
     "title": "Sanchez-Sesma, Weaver, Kawase, Matsushima, Luzon & Campillo (2011) Energy partitions among elastic waves for dynamic surface loads in a semi-infinite solid, BSSA (accepted manuscript)",
     "url": "https://www.isterre.fr/IMG/pdf/Sanchez_Sema_BSSA.pdf"
    }
   ],
   "who_when": "our derivation 2026 from Miller & Pursey 1955",
   "notes": "From Π = 1.209 ω² P²/(π ρ c_p³) for P cos ωt, the real part of the ground's point admittance is Re Y = 2Π/P² = 2.418 ω²/(π ρ c_p³). For a transient force, E = (1/π) ∫₀^∞ |F̂(ω)|² Re Y dω = 2.418/(π ρ c_p³) · ∫ Ḟ² dt (Parseval). With c_p = √3 c_s: 0.148 ∫Ḟ² dt/(ρ c_s³). Our own Rayleigh flux gives the same 0.1482. Examples (ours): Pisa drop as a 0.025–0.04 s Hann pulse of momentum 997 kg·m/s on c_s = 160 m/s: 6–25 J, i.e. 0.2–0.6% of the 3.8 kJ drop energy, above the 10⁻⁴ (range 10⁻⁵–10⁻³) seismic efficiency the lab uses for large impacts (existing key seismic_efficiency_impact, Collins et al. 2005). Rex walking (1.2 × body weight, 0.1 s raised-cosine rise and fall) on loose sand (ρ 1,600, c_s 120): about 1.7 J per step; stiff clay 0.15 J; granite 6 × 10⁻⁵ J. The energy depends on how fast the force changes, not on body energy, so a seismic-efficiency factor is the wrong tool for footsteps."
  },
  {
   "key": "vib_model_check_pisa",
   "category": "attenuation",
   "label": "Check: the elastic pulse model against the Pisa drop test (130 kg from 3 m)",
   "status": "derived",
   "value_si": 1.3,
   "unit_si": "ratio (worst model/measured, best-guess inputs)",
   "display": "Inputs c_s 150 m/s, ρ 1,850 kg/m³, ξ 0.03, Hann pulse 0.03 s carrying the drop momentum (997 N·s): 9.3, 6.1, 0.65, 0.21 mm/s at 2.5, 5, 35, 60 m vs measured 9, 5, 0.5, 0.2",
   "sources": [
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    }
   ],
   "who_when": "our calculation 2026",
   "notes": "Pulse: Hann with F·T/2 = 997.4 N·s (momentum of 130 kg at √(2g·3) = 7.67 m/s, no rebound, as the test intended), T = 0.03 s (the measured central frequency is about 25 Hz; T = 1/f gives 0.04 s, so 0.025–0.04 s was tried). Soil from the site table (vib_pisa_soil_profile). Spread over the plausible inputs (T 0.025–0.04 s, c_s 150–170 m/s, ξ 0.03): 3.4–14.5 mm/s at 2.5 m, 2.3–9.3 at 5 m, 0.38–0.79 at 35 m, 0.15–0.24 at 60 m. So with the force history roughly known the model is good to about a factor of 1.5, and the main error comes from the contact time (near-field PPV ∝ 1/T). The test's contact time was not measured; one site only."
  },
  {
   "key": "vib_model_check_elephant",
   "category": "attenuation",
   "label": "Check: the elastic pulse model against elephant stomps (weak test: force unknown)",
   "status": "derived",
   "value_si": null,
   "unit_si": "m/s",
   "display": "A 10 kN footfall with a 0.05–0.1 s ramp on ground with c_s 280 m/s gives 11–35 µm/s at 7.5–12 m and 4–9 µm/s at 40 m; reported about 24 and 8.5 µm/s (peak)",
   "sources": [
    {
     "title": "Towards Long Range Detection of Elephants Using Seismic Signals; A Geophone-Sensor Interface for Embedded Systems (arXiv:2406.05140, 2024), Section III, citing O'Connell-Rodwell et al. 2000",
     "url": "https://arxiv.org/pdf/2406.05140"
    },
    {
     "title": "O'Connell-Rodwell, Arnason & Hart (2000) Seismic properties of Asian elephant vocalizations and locomotion, J Acoust Soc Am 108(6):3066-72 (PubMed abstract, PMID 11144599, via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=11144599&rettype=abstract&retmode=text"
    }
   ],
   "who_when": "our calculation 2026",
   "notes": "Ground from the measured 248–264 m/s surface-wave speed (c_s ≈ 280 m/s), ρ = 1,800 kg/m³ and ξ = 0.03 assumed. Force per foot and rise time are guesses (about a quarter to a half of a 3–4 t animal's weight; 20 Hz signal content suggests 0.025–0.1 s); a 10–20 kN Hann pulse of 0.05 s instead gives 82–163 µm/s at 7.5 m and 23–47 µm/s at 40 m. The model brackets the reported values within about a factor of 2–3 for plausible inputs and reproduces the near/far ratio (model 2–4, reported 2.9). This tests the distance trend more than the absolute level."
  },
  {
   "key": "vib_rayleigh_horizontal_and_resultant",
   "category": "attenuation",
   "label": "Vertical vs resultant PPV for a footfall",
   "status": "derived",
   "value_si": 1.1,
   "unit_si": "ratio resultant/vertical",
   "low_si": 1,
   "high_si": 1.2,
   "display": "Resultant (vector) PPV ≈ 1.0–1.2 × the vertical PPV the model gives",
   "sources": [
    {
     "title": "BS 5228-2:2009+A1:2014 Annex E, Tables E.1 and E.2 (licensed copy filed as public-inquiry core document CD43.12, Omega West)",
     "url": "https://www.omegawestdocuments.com/media/documents/43/CD43.12%20-%204%20Code%20of%20practice%20for%20noise%20and%20vibration%20control%20on%20construction%20and%20open%20sites%20part%202%20vibration;.pdf"
    }
   ],
   "who_when": "our calculation 2026",
   "notes": "Rayleigh wave at ν = 1/4: horizontal/vertical amplitude 0.68, a quarter cycle apart, so the resultant peak is close to the vertical peak. Quasi-static near field: radial/vertical surface displacement = (1 − 2ν)/(2(1 − ν)) = 1/3 at ν = 1/4, resultant 1.05 × vertical. BS 5228-2 Table E.1 predicts the resultant ('νres resultant PPV'); some damage standards use the largest single component. Treat model PPV × 1.1 as resultant."
  },
  {
   "key": "vib_building_amplification",
   "category": "attenuation",
   "label": "Ground-to-building amplification of vibration in low-rise houses",
   "status": "verified",
   "value_si": 3,
   "unit_si": "ratio (structure / ground)",
   "low_si": 2,
   "high_si": 4,
   "display": "Resonance can raise vibration at the structure 2–4× above the ground level in low-rise residential buildings",
   "sources": [
    {
     "title": "Lauzon, Morel, Briet & Beaton (c. 2011) Ground Vibrations Induced by Dynamic Compaction and Rapid Impact Compaction (ISSMGE online library, GEO11 paper 581)",
     "url": "https://www.issmge.org/uploads/publications/84/52/GEO11Paper581.pdf"
    },
    {
     "title": "BS 5228-2:2009+A1:2014 Annex E, Tables E.1 and E.2 (licensed copy filed as public-inquiry core document CD43.12, Omega West)",
     "url": "https://www.omegawestdocuments.com/media/documents/43/CD43.12%20-%204%20Code%20of%20practice%20for%20noise%20and%20vibration%20control%20on%20construction%20and%20open%20sites%20part%202%20vibration;.pdf"
    }
   ],
   "who_when": "Lauzon et al. c. 2011",
   "notes": "Lauzon et al. section 4.1: 'Since the guidelines of RI 8507 accounts indirectly for soil-structure interaction, possible amplification due to resonance structural vibrations is included in the proposed criteria. These amplifications can raise the vibrations at the structure level by a factor ranging from 2 to 4 in low rise residential buildings.' No primary source is given for the 2–4 in that sentence. BS 5228-2 Table B.1 note A: 'The magnitudes of the values presented apply to a measurement position that is representative of the point of entry into the recipient.' Relevance: this model gives free-field ground PPV; a glass on a suspended floor inside a house may see 2–4× more near the floor's resonance. Mainly for the thresholds topic."
  },
  {
   "key": "vib_nehrp_site_classes_vs30",
   "category": "attenuation",
   "label": "NEHRP site classes by average shear-wave speed in the top 30 m",
   "status": "verified",
   "value_si": null,
   "unit_si": "m/s",
   "display": "A hard rock > 1,500; B rock 760–1,500; C very dense soil and soft rock 360–760; D stiff soil 180–360; E < 180 m/s",
   "sources": [
    {
     "title": "USGS Open-File Report 97-501 (NEHRP soil profile types by Vs30)",
     "url": "https://pubs.usgs.gov/of/1997/0501/report.pdf"
    }
   ],
   "who_when": "USGS OFR 97-501 (NEHRP 1994 provisions)",
   "notes": "Table: 'A Vs30 > 1500 m/s, hard rock; B 760 m/s < Vs30 < 1500 m/s, rock; C 360 m/s < Vs30 < 760 m/s, very dense soil and soft rock; D 180 m/s < Vs30 < 360 m/s, stiff soil; E Vs30 < 180 m/s'. These are 30 m averages; the top few metres that carry footstep-frequency surface waves are usually slower than the average.",
   "values_json": "{\"A\": \">1500 hard rock\", \"B\": \"760-1500 rock\", \"C\": \"360-760 very dense soil and soft rock\", \"D\": \"180-360 stiff soil\", \"E\": \"<180\"}"
  },
  {
   "key": "vib_soil_shear_speed_by_type",
   "category": "attenuation",
   "label": "Shear-wave speed by soil type and density (national seismic code table)",
   "status": "verified",
   "value_si": null,
   "unit_si": "m/s",
   "display": "Loose sand < 200; medium dense sand and gravel 200–400; dense sand and gravel 400–700; soft clay < 200; stiff clay 200–300; very stiff clay 300–700; hard clay > 700 m/s",
   "sources": [
    {
     "title": "Turkish seismic code (Ministry of Public Works and Settlement, Specification for Structures to be Built in Disaster Areas), Table 12.1 Soil Groups, as hosted by IISEE/BRI Japan",
     "url": "https://iisee.kenken.go.jp/net/seismic_design_code/turkey/table-turkey3.htm"
    }
   ],
   "who_when": "Turkish Ministry of Public Works and Settlement seismic code, Table 12.1 (IISEE copy)",
   "notes": "Table 12.1 'Soil Groups' (shear wave velocity column): (A) 1 massive volcanic/unweathered metamorphic/stiff cemented sedimentary rock > 1000; 2 'Very dense sand and gravel' (N > 50, Dr 85–100%) > 700; 3 'Hard clay, silty clay' > 700. (B) 1 soft volcanic rock, weathered sedimentary rock 700–1000; 2 'Dense sand and gravel' (N 30–50, Dr 65–85%) 400–700; 3 'Very stiff clay, silty clay' 300–700. (C) 1 highly weathered rock 400–700; 2 'Medium dense sand and grovel' [sic] (N 10–30, Dr 35–65%) 200–400; 3 'Stiff clay, silty clay' (qu 100–200 kPa) 200–300. (D) 1 'Soft, deep alluvial layers with high water table' < 200; 2 'Loose sand' (N 0–10, Dr < 35%) < 200; 3 'Soft clay, silty clay' (qu < 100 kPa) < 200. Code values describe soil layers, not the loose top metre; see vib_ground_wave_params_by_surface for the values we pick.",
   "values_json": "{\"loose sand\": \"<200\", \"medium dense sand and gravel\": \"200-400\", \"dense sand and gravel\": \"400-700\", \"very dense sand and gravel\": \">700\", \"soft clay\": \"<200\", \"stiff clay\": \"200-300\", \"very stiff clay\": \"300-700\", \"hard clay\": \">700\", \"soft alluvium, high water table\": \"<200\", \"rock\": \">700 to >1000\"}"
  },
  {
   "key": "vib_ice_seismic_speeds",
   "category": "attenuation",
   "label": "Seismic wave speeds in ice (polar ice sheets)",
   "status": "verified",
   "value_si": 1940,
   "unit_si": "m/s (shear, −16 to −29 °C)",
   "low_si": 1934,
   "high_si": 1960,
   "display": "Shear waves 1,934–1,960 m/s; P waves 3,795 − 2.30·T m/s (T in °C); Poisson ratio about 0.33",
   "sources": [
    {
     "title": "Kohnen (1974) The temperature dependence of seismic waves in ice, Journal of Glaciology 13(67):144-147",
     "url": "https://www.cambridge.org/core/services/aop-cambridge-core/content/view/0DAA1D118D8BC16DA025F8B300C442EA/S0022143000023467a.pdf/the-temperature-dependence-of-seismic-waves-in-ice.pdf"
    }
   ],
   "who_when": "Kohnen 1974",
   "notes": "Kohnen eq. (1): 'Vp = −(2·30 ± 0.17) T + 3795 m/s'. Table II lists measured Vs of 1934–1960 m/s at −16.5 to −29 °C and Poisson's ratio 0.327–0.332; 'Assuming a constant Poisson's ratio of 0.329'. dVs/dT = −1.2 m/s per degree, so near 0 °C about 1,915–1,920 m/s (our extrapolation). Glacier ice; lake ice is similar material but forms a thin floating plate, so these bulk speeds do not by themselves give the vibration from a step on lake ice (vib_plate_surfaces_not_modelled)."
  },
  {
   "key": "vib_granite_shear_speed",
   "category": "attenuation",
   "label": "Granite: shear-wave speed near the surface",
   "status": "derived",
   "value_si": 3000,
   "unit_si": "m/s",
   "low_si": 2100,
   "high_si": 3500,
   "display": "About 3,000 m/s (2,100–3,500), from near-surface P speeds of 3.7–6.1 km/s divided by about √3",
   "sources": [
    {
     "title": "USGS Open-File Report 97-501 (NEHRP soil profile types by Vs30)",
     "url": "https://pubs.usgs.gov/of/1997/0501/report.pdf"
    }
   ],
   "who_when": "our derivation 2026 from existing key collide_rock_wave_speed_estimate",
   "notes": "Relies on the existing lab fact collide_rock_wave_speed_estimate (granite P waves near the surface 3.7–6.1 km/s, Birch 1960; bar-wave speed 3.71 km/s, Padmanabha et al. 2021). For ν ≈ 0.25, c_s = c_p/√3: 2.1–3.5 km/s. NEHRP class A (hard rock) is > 1,500 m/s (USGS OFR 97-501). On granite the model gives about 1,000 times less shaking than on loose sand for the same step, because near-field PPV ∝ 1/(ρ c_s²)."
  },
  {
   "key": "vib_steel_shear_speed",
   "category": "attenuation",
   "label": "Steel: shear-wave speed (for reference only; a deck is a plate)",
   "status": "estimate",
   "value_si": 3200,
   "unit_si": "m/s",
   "low_si": 3100,
   "high_si": 3250,
   "display": "About 3.2 km/s (from G ≈ 79 GPa and ρ = 7,850 kg/m³)",
   "sources": [],
   "who_when": "our estimate 2026",
   "notes": "c_s = √(G/ρ) with a typical structural-steel shear modulus of 77–80 GPa (not fetched in this run) and the lab's verified steel density 7,850 kg/m³ (existing key density_structural_steel): 3,130–3,190 m/s; textbook tables give about 3.2 km/s. Listed only for completeness: a steel deck vibrates as a plate on supports, and the half-space model does not apply (vib_plate_surfaces_not_modelled)."
  },
  {
   "key": "vib_small_strain_damping_ratio",
   "category": "attenuation",
   "label": "Material damping ratio of soils and rock at small (footstep) strains",
   "status": "estimate",
   "value_si": 0.03,
   "unit_si": "1",
   "low_si": 0.005,
   "high_si": 0.07,
   "display": "Soils about 2–5% (Pisa site: 2–7%); rock about 0.5–2%",
   "sources": [
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    },
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, April 2020 (Andrews, Buehler, Gill & Bender)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "who_when": "our estimate 2026, anchored on Colombero et al. 2015 Table 1",
   "notes": "Pisa site layers: 2.0–7.0% (verified, vib_pisa_soil_profile); Colombero et al. fitted k = 2πξ = 0.302 for the measured drop data (ξ ≈ 4.8%). Caltrans α values (vib_material_damping_coefficients) convert to ξ = α c_R/(2π f): for 20 Hz and c_R 150 m/s, most entries (0.02–0.26 m⁻¹) give 2–30%, and dune sand's 0.65 m⁻¹ would give about 80%, implausible at 20 Hz, so those α were probably measured at higher frequencies. Our picks: loose sand 4%, dense sand and gravel 3%, soft clay 5%, stiff clay 3%, road or slab subgrade 3%, granite 1%. Damping matters little within about 10 m and controls the result beyond about 30 m."
  },
  {
   "key": "vib_ground_wave_params_by_surface",
   "category": "attenuation",
   "label": "Ground-wave parameters for the lab's nine surfaces (what the Walk tab should use)",
   "status": "estimate",
   "value_si": null,
   "unit_si": "m/s, kg/m³, 1",
   "display": "c_s: loose sand 120, dense sand/gravel 300, soft clay 120, stiff clay 250, asphalt or concrete on grade 250 (subgrade), granite 3,000 m/s; lake ice and steel deck not modelled as ground",
   "sources": [
    {
     "title": "Turkish seismic code (Ministry of Public Works and Settlement, Specification for Structures to be Built in Disaster Areas), Table 12.1 Soil Groups, as hosted by IISEE/BRI Japan",
     "url": "https://iisee.kenken.go.jp/net/seismic_design_code/turkey/table-turkey3.htm"
    },
    {
     "title": "USGS Open-File Report 97-501 (NEHRP soil profile types by Vs30)",
     "url": "https://pubs.usgs.gov/of/1997/0501/report.pdf"
    },
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    },
    {
     "title": "Kohnen (1974) The temperature dependence of seismic waves in ice, Journal of Glaciology 13(67):144-147",
     "url": "https://www.cambridge.org/core/services/aop-cambridge-core/content/view/0DAA1D118D8BC16DA025F8B300C442EA/S0022143000023467a.pdf/the-temperature-dependence-of-seismic-waves-in-ice.pdf"
    },
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, April 2020 (Andrews, Buehler, Gill & Bender)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "who_when": "our picks 2026 from the verified tables",
   "notes": "Densities are the lab's existing surface values (data.js), except road and slab where the subgrade (about 2,000 kg/m³) carries the waves. Shear speeds are near-surface picks inside the verified class ranges (loose sand and soft clay < 200, stiff clay 200–300, dense sand and gravel 400–700 at depth but lower near the surface; Pisa's soft layers 150–180). At 10–50 Hz the surface wave samples the top 2–10 m, so near-surface values are the right ones and the code values are upper guides. Asphalt (0.1–0.3 m) and a 10 cm slab are much thinner than the 5–25 m wavelengths, so the subgrade sets the shaking; the stiff layer spreads the footprint load and lowers PPV within about a metre (not modelled). Poisson ratio 0.25 assumed throughout; saturated soft clay is nearer 0.45–0.5, which lowers PPV by about a third. Uncertainty on c_s is about ±40% for soils; near-field PPV scales as 1/c_s², far-field as 1/c_s^2.5, so c_s alone gives a factor of about 2 either way.",
   "values_json": "{\"sand\": {\"rho\": 1600, \"cs\": 120, \"cs_range\": [80, 180], \"xi\": 0.04, \"model\": \"half-space\"}, \"gravel\": {\"rho\": 2000, \"cs\": 300, \"cs_range\": [200, 450], \"xi\": 0.03, \"model\": \"half-space\"}, \"softclay\": {\"rho\": 1700, \"cs\": 120, \"cs_range\": [80, 170], \"xi\": 0.05, \"model\": \"half-space (nu may be ~0.45 if saturated)\"}, \"stiffclay\": {\"rho\": 1900, \"cs\": 250, \"cs_range\": [200, 350], \"xi\": 0.03, \"model\": \"half-space\"}, \"asphalt\": {\"rho\": 2000, \"cs\": 250, \"cs_range\": [180, 400], \"xi\": 0.03, \"model\": \"half-space of the subgrade; pavement layers ignored\"}, \"concrete\": {\"rho\": 2000, \"cs\": 250, \"cs_range\": [180, 400], \"xi\": 0.03, \"model\": \"half-space of the subgrade; 10 cm slab ignored\"}, \"ice\": {\"rho\": 917, \"cs\": 1920, \"xi\": null, \"model\": \"not modelled: floating plate (flexural-gravity waves)\"}, \"steel\": {\"rho\": 7850, \"cs\": 3200, \"xi\": null, \"model\": \"not modelled: plate on supports\"}, \"granite\": {\"rho\": 2700, \"cs\": 3000, \"cs_range\": [2100, 3500], \"xi\": 0.01, \"model\": \"half-space\"}}"
  },
  {
   "key": "vib_plate_surfaces_not_modelled",
   "category": "attenuation",
   "label": "Lake ice and steel deck: the ground-wave model does not apply",
   "status": "estimate",
   "value_si": null,
   "unit_si": "",
   "display": "Not modelled: on floating ice or a supported steel deck the step excites plate bending waves, not ground waves",
   "sources": [
    {
     "title": "Kohnen (1974) The temperature dependence of seismic waves in ice, Journal of Glaciology 13(67):144-147",
     "url": "https://www.cambridge.org/core/services/aop-cambridge-core/content/view/0DAA1D118D8BC16DA025F8B300C442EA/S0022143000023467a.pdf/the-temperature-dependence-of-seismic-waves-in-ice.pdf"
    }
   ],
   "who_when": "our assessment 2026",
   "notes": "The model assumes a deep solid half-space. Thick lake ice floats on water: a step makes the sheet bend and sends flexural-gravity waves through it, with spreading, dispersion and damping set by ice thickness and water depth. A steel deck plate rests on beams: the response is the deck's own resonances. Neither was researched in this run. Recommended page wording: 'Ground shaking is not modelled on lake ice or a steel deck (they flex as plates).' The bulk speeds (ice c_s about 1.9 km/s, Kohnen 1974; steel about 3.2 km/s, estimate) are listed for reference only."
  },
  {
   "key": "vib_extrapolation_to_footsteps",
   "category": "attenuation",
   "label": "How far the dynamic-compaction laws are being stretched for footsteps",
   "status": "derived",
   "value_si": 100000,
   "unit_si": "ratio (BS 5228 lower energy limit / smallest footstep energy)",
   "low_si": 100,
   "high_si": 100000,
   "display": "Footsteps (10 J–10 kJ) sit 100–100,000× below BS 5228's 1 MJ floor; at 82 kJ the law already under-predicts 2–10×, at 3.8 kJ about 5× at 60 m. Walking is a slow load, not a drop, so an energy law has no clear input at all",
   "sources": [
    {
     "title": "BS 5228-2:2009+A1:2014 Annex E, Tables E.1 and E.2 (licensed copy filed as public-inquiry core document CD43.12, Omega West)",
     "url": "https://www.omegawestdocuments.com/media/documents/43/CD43.12%20-%204%20Code%20of%20practice%20for%20noise%20and%20vibration%20control%20on%20construction%20and%20open%20sites%20part%202%20vibration;.pdf"
    },
    {
     "title": "Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)",
     "url": "https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf"
    },
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    },
    {
     "title": "Lukas (1995) Geotechnical Engineering Circular No. 1: Dynamic Compaction, FHWA-SA-95-037 (USDOT ROSAP scan)",
     "url": "https://rosap.ntl.bts.gov/view/dot/40768/dot_40768_DS1.pdf"
    }
   ],
   "who_when": "our assessment 2026",
   "notes": "Ranges: BS 5228-2 dynamic compaction 1–12 MJ and 5–100 m; GEC 1 chart data at scaled energy factor ≈ 0.07–6 √(t·m)/m; a 10 J–10 kJ footstep at 1–200 m has a factor of 0.0002–1. Evidence below the range: 82 kJ (TRL 429, Allen 1996): measured 2–10× above Mayne (1985), worst at long range; 3.8 kJ (Pisa): agrees at 2.5 m, 5× low at 60 m; 10 J–1 kJ: no measured drop data found. Pattern: at low energy the near field roughly follows the law but the fall-off is slower (r^-1.0 to r^-1.3 measured vs r^-1.7), so errors grow with distance, to roughly 10× by 100 m. More basically, the laws' input is the energy of a free-falling weight that craters the ground; a walking step loads the ground over 0.1–0.3 s with no free fall, and its shaking depends on force and loading rate (vib_physics_pulse_ppv_model). Recommendation: use the elastic model; show BS 5228 only as an out-of-range comparison for stamps that are true drops."
  },
  {
   "key": "vib_rex_step_examples",
   "category": "attenuation",
   "label": "Example output: vertical PPV from one of Rex's (or Ollie's) steps, by ground and distance (placeholder step forces)",
   "status": "derived",
   "value_si": null,
   "unit_si": "m/s",
   "display": "Normal walk (1.2 × weight, 0.1 s rise) on loose sand: about 3 mm/s at 1 m, 1 at 3 m, 0.3 at 10 m, 0.03 at 100 m; on stiff clay about 5× less; on granite about 1,000× less",
   "sources": [
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    },
    {
     "title": "Sanchez-Sesma, Weaver, Kawase, Matsushima, Luzon & Campillo (2011) Energy partitions among elastic waves for dynamic surface loads in a semi-infinite solid, BSSA (accepted manuscript)",
     "url": "https://www.isterre.fr/IMG/pdf/Sanchez_Sema_BSSA.pdf"
    }
   ],
   "who_when": "our calculation 2026",
   "notes": "Computed with vib_physics_pulse_ppv_model, vib_physics_damping_factor and vib_ground_wave_params_by_surface; weight 3,007 kg (canon). The step force histories are placeholders: 1.2 × body weight is the lab's W8.WALK_LOAD (existing key walking_running_peak_vertical_force, 1.0–1.5 × in human walking), but the rise times (0.1 and 0.2 s) and the 'heavy step' (3 ×, 0.05 s) and 'stamp' (10 ×, 0.03 s) inputs are illustrations until the step-force research supplies them. Ollie gives the same numbers (same mass and force; his 0.15 m² boot sole vs Rex's 0.31 m² paw does not matter while the footprint is small compared with the wavelength). Values within 1–3 m of a stamp on soft soil (tens of mm/s and up) imply ground strain above 10⁻⁴ and are over-estimates (vib_linear_strain_limit).",
   "values_json": "{\"distance_m\": [1, 3, 10, 30, 100, 200], \"units\": \"vertical PPV mm/s\", \"walk_1.2BW_ramp_0.1s\": {\"sand\": [2.9, 0.96, 0.28, 0.12, 0.026, 0.0075], \"gravel\": [0.37, 0.12, 0.037, 0.012, 0.0054, 0.0025], \"softclay\": [2.7, 0.9, 0.26, 0.1, 0.019, 0.0052], \"stiffclay\": [0.56, 0.19, 0.056, 0.019, 0.0083, 0.0036], \"asphalt_or_concrete_subgrade\": [0.53, 0.18, 0.053, 0.018, 0.0079, 0.0034], \"granite\": [0.0027, 0.00091, 0.00027, 9.1e-05, 2.7e-05, 1.4e-05]}, \"walk_1.2BW_ramp_0.2s\": {\"sand\": [1.4, 0.48, 0.14, 0.049, 0.018, 0.0066], \"gravel\": [0.18, 0.061, 0.018, 0. … [1,088 more characters on this line; the full prompt is in prompts/a2311a5c0fd01f98d.txt]
  },
  {
   "key": "vib_linear_strain_limit",
   "category": "attenuation",
   "label": "Where the elastic model stops: ground strain near a heavy step",
   "status": "estimate",
   "value_si": 0.0001,
   "unit_si": "1 (shear strain ≈ PPV / c_s)",
   "low_si": 0.00001,
   "high_si": 0.001,
   "display": "Trust the model while PPV/c_s < about 10⁻⁴ (e.g. below 12 mm/s on loose sand, 25 mm/s on stiff clay); closer in, soil softens and damps more, so the model over-estimates",
   "sources": [
    {
     "title": "Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)",
     "url": "https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf"
    }
   ],
   "who_when": "our estimate 2026",
   "notes": "Shear strain in a passing wave is about particle velocity / wave speed. Soil stiffness starts to fall and damping to rise somewhere around 10⁻⁵–10⁻⁴ strain and soils yield near 10⁻³ (typical soil-dynamics ranges; no source fetched in this run). Pisa: 9 mm/s at 2.5 m on 150 m/s ground is 6 × 10⁻⁵ strain and the elastic model still matched. A stamp giving 70–160 mm/s at 1–3 m on loose sand (10⁻³) is outside the linear range: cap or flag those values. Inside the footprint the ground yields (footprint depth is a separate bearing-capacity result)."
  },
  {
   "key": "vib_walking_two_feet_caveat",
   "category": "attenuation",
   "label": "Walking: the other foot unloading partly cancels the far-field shaking",
   "status": "estimate",
   "value_si": 0.5,
   "unit_si": "factor (possible reduction, far field, walking only)",
   "low_si": 0.5,
   "high_si": 1,
   "display": "While one foot loads, the other unloads; at distances and wavelengths much larger than the stride, the net force changes less, so walking PPV far away may be up to about 2× lower than a single-foot calculation",
   "sources": [
    {
     "title": "Ekimov & Sabatier (2006) Vibration and sound signatures of human footsteps in buildings, J Acoust Soc Am 120(2):762-8 (PubMed abstract, PMID 16938964, via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=16938964&rettype=abstract&retmode=text"
    }
   ],
   "who_when": "our estimate 2026",
   "notes": "The ground sees the sum of both feet's forces. While each foot alone goes from zero to 1.0–1.5 × body weight, the sum of both feet in walking varies much less, because one foot unloads as the other loads (general walking biomechanics, not from the cited abstract; Ekimov & Sabatier only note that the force of multiple footsteps is concentrated at 1–4 Hz). For wavelengths long compared with Rex's stride (1–2 m) the loading and unloading feet act partly as one varying source, which lowers the far-field PPV; near either foot (r of a few metres or less) the nearer foot dominates and the single-foot result holds. Fast transients (foot slap at touchdown) do not cancel. Not quantified with data; treat the single-foot model as an upper estimate for walking."
  }
 ],
 "summary": "Topic \"attenuation\": how hard the ground shakes (peak particle velocity, PPV) at 1–200 m from a step of a 3 t body. 49 facts: 25 verified, 15 derived, 6 estimates, 3 reported.\n\nWhat I verified from the fetched documents:\n- **BS 5228-2 Table E.1, dynamic compaction row.** PPV_res ≤ 0.037 (√W_h/x)^1.7 mm/s, with W_h in J. Valid for 5–100 m and 1–12 MJ. Source: a licensed copy of the standard filed as a public-inquiry core document. Table E.2's k_p values are also verified.\n- **Mayne 1985 law.** v ≤ 92 (√(M·H)/x)^1.7 mm/s, as printed in TRL Report 429. It is the same law as the … [3,268 more characters on this line; the full prompt is in prompts/a2311a5c0fd01f98d.txt]
 "model_recommendation": "Use the elastic-ground pulse model for the Walk tab (vib_physics_pulse_ppv_model). Do not use the dynamic-compaction energy laws as the main model: a walking step is a load that rises over 0.1–0.3 s with no free fall, so those laws have no clear input.\n\nINPUTS per footfall: peak vertical force F (N) and one time scale.\n- Walking: rise time τ, for a load that ramps up and is held. Toe-off unloading is a second, similar event; take the larger.\n- Stamp or impact: pulse length T (Hann shape).\n- Ground: ρ, c_s, ξ from vib_ground_wave_params_by_surface. Distance r in m … [3,305 more characters on this line; the full prompt is in prompts/a2311a5c0fd01f98d.txt]
 "gaps": "Not fetched, so the page should cite only through what was fetched:\n- **Mayne, Jones & Dumas 1984** (ASCE, paywalled). Its 70(√WH/d)^1.4 law is only \"reported\", and its data range (energies, distances, number of sites, soils) is unknown. Say \"as reproduced by Lauzon et al.\" or rely on the BS 5228/TRL form, which is verified.\n- **Mayne 1985** (convention paper): seen only through TRL 429 (verified) and Lauzon et al. (normalised form, reported).\n- **Lukas 1986's exact chart lines**: only figures, no fitted equations. The digitised values are \"derived\", ±25%.\n- **Miller & Purs … [2,157 more characters on this line; the full prompt is in prompts/a2311a5c0fd01f98d.txt]
}
```

</details>

**Subagent `verify:elephant`** · rex-presence-research · started 2026-10-11 19:02:48 UTC

- checks: 30 (23 ok, 7 not ok).
- Not OK: elephant_steinmann2025_group_20m; elephant_steinmann2025_site_spread; elephant_steinmann2025_soft_feet_finding (+4 more).
- Sound, with a handful of labelling fixes needed. All 12+ cited sources were re-fetched and read: Steinmann GFZ PDF (the published version), Mortimer main text and supplement, Wood 2005, O'Connell-Rodwell 2006, Wijayaraja 2024 and 2025, PubMed, Crossref, PMC Ren & Hutchinson, the SICB page, ...

<details>
<summary>Prompt, verbatim (64,335 characters)</summary>

Workflow run `wf_bb193dee-61c`, phase `Verify`, agent `ac134b11615fd1da2`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/ac134b11615fd1da2.txt](prompts/ac134b11615fd1da2.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

You are a skeptical fact-checker for the topic "elephant". Below are the researcher's facts and model recommendation. Re-fetch the cited URLs for every fact the page is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, unit conversion, quotation and status against what the source actually says; recompute every derived number with your own script. Mark ok=false with a correction for anything wrong, mislabelled (a secondary summary presented as the primary paper, an estimate or a fan source marked verified, a sample maximum called a limit, the wrong units or wrong peak/RMS basis), or unsupported. Judge the model recommendation: wrong physics, wrong formula, constants used outside the range they were fitted to, overstated certainty? List important missing items.

RESEARCH:
{
 "summary": "Topic \"elephant\": measured ground vibration from elephant footsteps, plus a few other animals, to support the line \"about like an elephant walking past\". Seven primary studies were fetched and read: Steinmann et al. 2025 (MEE, full text), Mortimer et al. 2018 (Curr Biol, main text and supplement), Wood et al. 2005 (J Appl Ecol), O'Connell-Rodwell et al. 2006 (Behav Ecol Sociobiol), Wijayaraja et al. 2024 and 2025 (arXiv versions of IEEE Access papers) and Ren & Hutchinson 2008 (masses). Abstracts only were available for O'Connell-Rodwell et al. 2000 (PubMed), Szenicer et al. 2 … [1,861 more characters on this line; the full prompt is in prompts/ac134b11615fd1da2.txt]
 "facts": [
  {
   "key": "elephant_steinmann2025_walk_20m_displacement",
   "category": "elephant",
   "label": "Walking African bush elephant 20 m away: peak vertical ground displacement (Kenya, sandy dry ground)",
   "status": "derived",
   "value_si": 4e-8,
   "unit_si": "m",
   "low_si": 1.9e-8,
   "high_si": 4e-8,
   "display": "Largest step about 4 × 10⁻⁸ m (40 nanometres); a typical step about 2 × 10⁻⁸ m",
   "sources": [
    {
     "title": "Steinmann, Nissen-Meyer, Cotton, Tilmann & Mortimer (2025) Decoding the footsteps of the African savanna: classifying wildlife using seismic signals and machine learning. Methods Ecol. Evol. 16(4):819-836, doi:10.1111/2041-210X.70021 (published version, GFZ repository)",
     "url": "https://gfzpublic.gfz.de/pubman/item/item_5034960_2/component/file_5034988/5034960.pdf"
    }
   ],
   "notes": "Read from Figure 3f, titled 'elephant, NWP05, 20 m'. Its y-axis is 'Displacement [m]' at scale 1e-8, with dashed gridlines at ±2.5. Page 5 was rendered at 400 dpi and the grey trace measured in pixels against the printed gridlines (script: scratchpad research/elephant/scripts/digitize.py). Largest peak: +4.0e-8 m (minimum −3.1e-8 m). Median of the 12 largest separate peaks: 1.9e-8 m. Several steps visibly reach the 2.5e-8 m gridline. Reading error is about ±0.1e-8 m. Conditions: 'station NWP05, which is located on sandy dry ground'. 'Taxonomic labels and estimated distances to animals were derived from the camera trap images using software-assisted visual inspection', so the 20 m is an estimate. One 10 s record of one wild animal, vertical component, broadband seismometers (Mpala Research Centre, Kenya, Feb–Mar 2019). The paper says 'the data is at 200 Hz and the data is high-pass filtered with a 5 Hz corner frequency'. It does not describe the instrument correction; the axis label says displacement. The animal's mass is not reported. Footfalls 'are visible as impulses in the seismograms above 10 Hz'.",
   "who_when": "Steinmann et al., 2025 (data recorded 2019)"
  },
  {
   "key": "elephant_steinmann2025_walk_20m_ppv",
   "category": "elephant",
   "label": "Walking African bush elephant 20 m away: peak vertical ground velocity (converted from displacement)",
   "status": "derived",
   "value_si": 0.0000047,
   "unit_si": "m/s",
   "low_si": 0.0000022,
   "high_si": 0.0000061,
   "display": "About 0.005 mm/s (0.002–0.006 mm/s) at 20 m",
   "sources": [
    {
     "title": "Steinmann et al. (2025) Methods Ecol. Evol. 16:819-836, Fig. 3f (published version, GFZ repository)",
     "url": "https://gfzpublic.gfz.de/pubman/item/item_5034960_2/component/file_5034988/5034960.pdf"
    }
   ],
   "notes": "Formula: peak velocity ≈ 2π f × peak displacement, treating each footfall as a narrow-band wavelet at its dominant frequency. Inputs: largest-step displacement 4.0e-8 m and typical step 1.9e-8 m (key elephant_steinmann2025_walk_20m_displacement), f = 18.7 Hz (key elephant_steinmann2025_footfall_frequency). Results: largest step 2π × 18.7 × 4.0e-8 = 4.7e-6 m/s; typical step 2.2e-6 m/s. Over the energy quartiles 13.8–24.3 Hz the largest step gives 3.5e-6 to 6.1e-6 m/s. An impulsive wavelet's true peak velocity can differ from this by tens of percent. Vertical component only: for Rayleigh waves in a Poisson solid (ν = 0.25), horizontal/vertical = 0.68 (our calculation), so the three-component vector peak would be up to about 1.2× this. Best single anchor because it is the only calibrated, peer-reviewed, open-access record of a walking elephant at a stated distance. Still one animal, one site, one record.",
   "who_when": "Derived here (2026) from Steinmann et al., 2025"
  },
  {
   "key": "elephant_steinmann2025_footfall_frequency",
   "category": "elephant",
   "label": "Dominant frequency of a walking elephant's footfalls at 20 m",
   "status": "derived",
   "value_si": 19,
   "unit_si": "Hz",
   "low_si": 14,
   "high_si": 24,
   "display": "About 19 Hz (most energy 14–24 Hz)",
   "sources": [
    {
     "title": "Steinmann et al. (2025) Methods Ecol. Evol. 16:819-836, Fig. 3f scalogram (GFZ repository)",
     "url": "https://gfzpublic.gfz.de/pubman/item/item_5034960_2/component/file_5034988/5034960.pdf"
    }
   ],
   "notes": "Brightness-weighted frequency of the printed scalogram (log axis 10–100 Hz, ticks found in pixels; script scratchpad research/elephant/scripts/scal.py). Brightest row 20.4 Hz, weighted median 18.7 Hz, quartiles 13.8 and 24.3 Hz. This matches the other studies: Wood et al. 2005, 'All species have a peak around 25 Hz' and most footfall energy in 10–40 Hz. O'Connell-Rodwell et al. 2000 (PubMed abstract): 'predominant frequencies in the range of 20 Hz'. Wijayaraja et al. 2024: power-spectrum peaks at 26–29 Hz. Mortimer et al. 2018 Table S1: dominant ranges of 5–10 Hz to 20–25 Hz for walks. Ground type changes it: Steinmann says giraffe footfalls on muddy ground near the waterhole 'exhibit almost no energy above 30 Hz', while on rocky ground they show 'little energy below 20 Hz'.",
   "who_when": "Derived here (2026) from Steinmann et al., 2025"
  },
  {
   "key": "elephant_steinmann2025_running_38m",
   "category": "elephant",
   "label": "Running African bush elephant 38 m away: peak vertical displacement and converted velocity",
   "status": "derived",
   "value_si": 0.0000044,
   "unit_si": "m/s",
   "low_si": 0.000003,
   "high_si": 0.0000058,
   "display": "Displacement about 2.5 × 10⁻⁸ m; about 0.004 mm/s at 38 m",
   "sources": [
    {
     "title": "Steinmann et al. (2025) Methods Ecol. Evol. 16:819-836, Fig. 3g 'running elephant, NTA02, 38 m' (GFZ repository)",
     "url": "https://gfzpublic.gfz.de/pubman/item/item_5034960_2/component/file_5034988/5034960.pdf"
    }
   ],
   "notes": "Pixel reading of Fig. 3g (y-axis 1e-8 m, gridline at +2.5): largest peak +2.5e-8 m, minimum −1.9e-8 m, median of the 12 largest peaks 1.3e-8 m. Scalogram: weighted median 27.8 Hz (quartiles 19.2–36.8 Hz). v = 2π × 27.8 × 2.5e-8 = 4.4e-6 m/s (3.0e-6 to 5.8e-6 over the quartiles). The text says running gives 'smaller time intervals between individual footfalls'. Station NTA02 is near the waterhole; the paper says most stations there share 'similar site conditions'. Its ground is not described beyond that.",
   "who_when": "Derived here (2026) from Steinmann et al., 2025"
  },
  {
   "key": "elephant_steinmann2025_group_20m",
   "category": "elephant",
   "label": "Group of four walking elephants at the same station and nominal 20 m: peak vertical displacement and velocity",
   "status": "derived",
   "value_si": 7.5e-7,
   "unit_si": "m/s",
   "low_si": 6e-7,
   "high_si": 0.000001,
   "display": "Displacement about 5 × 10⁻⁹ m; about 0.0008 mm/s, about 8× weaker than the single elephant",
   "sources": [
    {
     "title": "Steinmann et al. (2025) Methods Ecol. Evol. 16:819-836, Fig. 3h 'elephant group, NWP05, 20 m' (GFZ repository)",
     "url": "https://gfzpublic.gfz.de/pubman/item/item_5034960_2/component/file_5034988/5034960.pdf"
    }
   ],
   "notes": "Pixel reading of Fig. 3h (y-axis 1e-9 m, gridlines ±5): largest peak 5.3e-9 m, median of the 12 largest 3.0e-9 m. Weighted frequency 22.5 Hz, so v = 2π × 22.5 × 5.3e-9 = 7.5e-7 m/s. The paper says 'Figure 3h shows a group of four elephants in locomotion, resulting in a tremor-like signal.' The same station and the same labelled distance as the single elephant (Fig. 3f) give 8× less, so steps and estimated distances vary a lot. The camera-trap distance may refer to the nearest animal, or the group may have walked more softly. Use this to widen the uncertainty band, not as a separate anchor.",
   "who_when": "Derived here (2026) from Steinmann et al., 2025"
  },
  {
   "key": "elephant_steinmann2025_other_animals",
   "category": "elephant",
   "label": "Other savanna animals (giraffe, zebra, human, hyena, warthog): peak vertical displacement and converted velocity at stated distances",
   "status": "derived",
   "value_si": null,
   "unit_si": "m/s",
   "display": "Giraffe at 20 m about 0.04 mm/s; zebra at 47 m about 0.003; human at 53 m about 0.002; warthog at 32 m about 0.0006; hyena at 17 m about 0.0002 (all on one station except warthog)",
   "sources": [
    {
     "title": "Steinmann et al. (2025) Methods Ecol. Evol. 16:819-836, Figs 3 and 4 (GFZ repository)",
     "url": "https://gfzpublic.gfz.de/pubman/item/item_5034960_2/component/file_5034988/5034960.pdf"
    }
   ],
   "notes": "Same method as the elephant facts: pixel readings of the printed seismograms and scalograms, then v = 2π f u. For Fig. 4, f = 20 Hz is assumed because the scalograms were not measured. The paper reports no masses, and the human's mass and gait are unknown. The authors' ranking: 'The giraffe produces the footfall signals with the largest amplitudes for individual animals, followed by the elephant, zebra and human.' Distances are camera-trap estimates. These are single 10 s records, so treat each as one example, not an average.",
   "values_json": "{\"source\":\"Steinmann et al. 2025, Figs 3 and 4, digitized\",\"rows\":[{\"animal\":\"giraffe walking\",\"station\":\"NWP05 (sandy dry ground)\",\"distance_m\":20,\"peak_disp_m\":2.5e-7,\"dominant_Hz\":24,\"ppv_mm_s\":0.038},{\"animal\":\"zebra\",\"station\":\"NWP05\",\"distance_m\":47,\"peak_disp_m\":2.3e-8,\"dominant_Hz\":24,\"ppv_mm_s\":0.0034},{\"animal\":\"human\",\"station\":\"NWP05\",\"distance_m\":53,\"peak_disp_m\":1.6e-8,\"dominant_Hz\":20,\"ppv_mm_s\":0.002},{\"animal\":\"hyena\",\"station\":\"NWP05\",\"distance_m\":17,\"peak_disp_m\":1.7e-9,\"dominant_Hz\":21,\"ppv_mm_s\":0.0002},{\"animal\":\"warthog\",\"station\":\"NTA02\",\"distance_m\":32,\"peak_disp_m\":2.7e-9,\"dominant_Hz\":33,\"ppv_mm_s\":0.0006},{\"animal\":\"giraffe walking (Fig 4a)\",\"station\":\"NNL62 (rocky ground)\",\"distance_m\":34,\"peak_disp_m\":2.3e-9,\"dominant_Hz\":\"20 assumed\",\"ppv_mm_s\":0.0003},{\"animal\":\"giraffe walking (Fig 4b)\",\"station\":\"ETA00 (near waterhole)\",\"distance_m\":26,\"peak_disp_m\":3.5e-9,\"dominant_Hz\":\"20 assumed\",\"ppv_mm_s\":0.0004},{\"animal\":\"giraffe walking (Fig 4c)\",\"station\":\"ETA00\",\"distance_m\":103,\"peak_disp_m\":2.2e-10,\"dominant_Hz\":\"20 assumed\",\"ppv_mm_s\":0.00003}]}",
   "who_when": "Derived here (2026) from Steinmann et al., 2025"
  },
  {
   "key": "elephant_steinmann2025_site_spread",
   "category": "elephant",
   "label": "How much the ground changes the signal: walking giraffes at 20–34 m on three stations",
   "status": "derived",
   "value_si": 100,
   "unit_si": "ratio",
   "low_si": 70,
   "high_si": 110,
   "display": "About ×100 between stations at similar distances; ×16 drop from 26 m to 103 m at one station",
   "sources": [
    {
     "title": "Steinmann et al. (2025) Methods Ecol. Evol. 16:819-836, Figs 3e and 4a–c (GFZ repository)",
     "url": "https://gfzpublic.gfz.de/pubman/item/item_5034960_2/component/file_5034988/5034960.pdf"
    }
   ],
   "notes": "Peak displacements (pixel readings): NWP05 (sandy dry ground) at 20 m, 2.5e-7 m; ETA00 at 26 m, 3.5e-9 m; NNL62 (rocky ground) at 34 m, 2.3e-9 m. Ratios: 2.5e-7/3.5e-9 = 71; 2.5e-7/2.3e-9 = 109. The paper puts frequency differences down to site: 'NNL62 is located on hard-rock terrain ... ETB00 is situated on muddy ground with high water content, which attenuates high-frequency seismic waves'. (The text says ETB00; the figure is labelled ETA00.) Part of the ×100 may come from individual animals and estimated distances, not ground alone. We could not tell whether stations used different instruments. At ETA00, 26 m → 103 m drops 3.5e-9 → 2.2e-10 m (×16). The 103 m trace looks close to the noise floor, so that decay may be overstated.",
   "who_when": "Derived here (2026) from Steinmann et al., 2025"
  },
  {
   "key": "elephant_steinmann2025_soft_feet_finding",
   "category": "elephant",
   "label": "Elephants' cushioned feet send a weaker, less sharp signal than hooves (authors' observation)",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "The heaviest animal gave smaller signals than a giraffe and similar ones to a more distant zebra",
   "sources": [
    {
     "title": "Steinmann et al. (2025) Methods Ecol. Evol. 16:819-836 (GFZ repository)",
     "url": "https://gfzpublic.gfz.de/pubman/item/item_5034960_2/component/file_5034988/5034960.pdf"
    }
   ],
   "notes": "Quotes: 'While hoofed animals such as giraffes, zebras and warthogs produce clear and sharp impulses (Figure 3a,b,e), elephant with its soft cushion-like feet and hyena with its paws do not show these clear impulses (Figure 3d,f).' 'It is surprising to see that the elephant, having the largest average weight compared to the other animals, produces smaller amplitudes than the giraffe and similar amplitudes to the zebra, which is even more distant.' 'The giraffe, for instance, generates a distinct double impulse every second.' What this means for the model: seismic output depends on how sharply the foot lands, not only on mass. A 3 t animal with a hard heel or hoof could beat an elephant at the same mass.",
   "who_when": "Steinmann et al., 2025"
  },
  {
   "key": "elephant_steinmann2025_classification_distance",
   "category": "elephant",
   "label": "Distances at which savanna footfalls were still classified (elephant, giraffe, hyena, zebra)",
   "status": "verified",
   "value_si": 150,
   "unit_si": "m",
   "low_si": 50,
   "high_si": 150,
   "display": "87% balanced accuracy up to 50 m; 77% up to 150 m",
   "sources": [
    {
     "title": "Steinmann et al. (2025) Methods Ecol. Evol. 16:819-836 (GFZ repository)",
     "url": "https://gfzpublic.gfz.de/pubman/item/item_5034960_2/component/file_5034988/5034960.pdf"
    },
    {
     "title": "Steinmann et al., EGU General Assembly 2025 abstract EGU25-2842",
     "url": "https://meetingorganizer.copernicus.org/EGU25/EGU25-2842.html"
    }
   ],
   "notes": "Quote: 'The machine learning model achieves a balanced accuracy of 87% with a maximum animal-sensor distance of 50 m and 77% with a maximum animal-sensor distance of 150 m'. Recordings were taken only from 'seismic stations that are not further away than 150 m from the localized animals'. The dataset (SeisSavanna) has 70,637 three-component 10 s seismograms from 11 wildlife categories, over 62,000 of them labelled elephant. This is a detection and classification range for a sensitive seismometer, not a range at which people could feel anything.",
   "who_when": "Steinmann et al., 2025"
  },
  {
   "key": "elephant_szenicer2022_detection_100m",
   "category": "elephant",
   "label": "Elephants detected seismically up to 100 m away (machine learning, Kenyan savanna)",
   "status": "verified",
   "value_si": 100,
   "unit_si": "m",
   "display": "80–90% balanced accuracy for elephants up to 100 m",
   "sources": [
    {
     "title": "Szenicer et al. (2022) Seismic savanna: machine learning for classifying wildlife and behaviours using ground-based vibration field recordings. Remote Sens. Ecol. Conserv. 8(2):236-250 — abstract via Crossref",
     "url": "https://api.crossref.org/works/10.1002/rse2.242"
    }
   ],
   "notes": "Abstract quote: 'Our classifiers ... achieved 80%–90% balanced accuracy in detecting elephants up to 100 m away, and over 90% balanced accuracy in recognising running and rumbling behaviours'. Data: '8000 h seismic recordings and 250 k camera trap pictures'. The full text was blocked (publisher bot check), so it gives no amplitudes here. It is the same Mpala dataset as Steinmann et al. 2025.",
   "who_when": "Szenicer et al., 2022 (online 2021)"
  },
  {
   "key": "elephant_mortimer2018_fastwalk_velocity",
   "category": "elephant",
   "label": "Fast-walking wild African elephant: peak vertical ground velocity at the geophone (2–30 m, mostly river sand)",
   "status": "derived",
   "value_si": 0.00036,
   "unit_si": "m/s",
   "low_si": 0.00021,
   "high_si": 0.00037,
   "display": "0.2–0.36 mm/s for three footfalls; the geophone was 2–30 m away (exact distance not given)",
   "sources": [
    {
     "title": "Mortimer, Rees, Koelemeijer & Nissen-Meyer (2018) Classifying elephant behaviour through seismic vibrations. Curr. Biol. 28(9):R547-R548, Fig. 1D (UCL repository)",
     "url": "https://discovery.ucl.ac.uk/id/eprint/10063309/1/1-s2.0-S0960982218304202-main.pdf"
    },
    {
     "title": "Mortimer et al. (2018) Supplemental Information (Elsevier CDN)",
     "url": "https://ars.els-cdn.com/content/image/1-s2.0-S0960982218304202-mmc1.pdf"
    }
   ],
   "notes": "Fig. 1D is labelled 'Fast walk' with the y-axis 'Velocity (m s-1)', ticks at ±4×10^-4. The caption calls it 'recorded vertical ground velocity'. A 600 dpi pixel reading gives positive peaks 3.6e-4, 3.4e-4 and 2.1e-4 m/s and negative peaks 2.6e-4, 2.6e-4 and 2.1e-4 m/s. The main text links the fast walk to a 946 N source force. Setup (supplement): 'One geophone (RTC-4.5Hz-395 vertical, USA)'; 'Sampling frequency was 600 Hz'; 'we positioned the geophone close (range of 2 to 30 m) to a focal individual'; 'elephants were mostly on river sands, but we also obtained recordings from elephants on gneiss'. Samburu and Buffalo Springs, Kenya; masses not given. Caution 1: the supplement says voltage was 'converted to velocity by multiplying by a calibration factor (set by hardware) of 23.4 V m-1 s-1'. Taken literally the units imply division, so the wording is loose. An elastic half-space check with the paper's own 946 N force on loose sand gives 1–3×10^-4 m/s at 2–10 m (key elephant_halfspace_check), so the scale is plausible. Caution 2: these values are 40–80× the Steinmann value at 20 m. That fits only if the elephant was within a few metres and/or on soft sand.",
   "who_when": "Mortimer et al., 2018"
  },
  {
   "key": "elephant_mortimer2018_source_forces",
   "category": "elephant",
   "label": "Seismic source force of elephant behaviours (peak of the deconvolved force, 4.5–25 Hz band)",
   "status": "verified",
   "value_si": 946,
   "unit_si": "N",
   "low_si": 125,
   "high_si": 1190,
   "display": "Walks 125–946 N (fast walk 946 N); a climbing step 1,190 N; rumbles 69–2,546 N",
   "sources": [
    {
     "title": "Mortimer et al. (2018) Supplemental Table S1 (Elsevier CDN)",
     "url": "https://ars.els-cdn.com/content/image/1-s2.0-S0960982218304202-mmc1.pdf"
    },
    {
     "title": "Mortimer et al. (2018) Curr. Biol. 28:R547-R548 (UCL repository)",
     "url": "https://discovery.ucl.ac.uk/id/eprint/10063309/1/1-s2.0-S0960982218304202-main.pdf"
    }
   ],
   "notes": "Table S1 'Max. force (N)'. A source function is 'the force strength and pattern generated by the elephant at the source'. It was found by deconvolution against on-site weight drops: 'We calibrated the force generated through the weight dropping by using high-speed camera footage and force-motion equations'. Main text: 'maximum seismological force 2546 N versus 946 N' for rumble versus fast walk. This is the dynamic force in the seismic band only, not the full ground reaction force. For comparison, the existing key walking_running_peak_vertical_force puts walking at 1.0–1.5× body weight, about 30–45 kN for a 3 t animal. 'Walks were chosen as they included the maximum, minimum and median maximum forces during that recording.'",
   "values_json": "{\"unit\":\"N (max of source function); dominant frequency range in Hz\",\"rows\":[{\"behaviour\":\"Walk 1 (adult 1)\",\"max_force_N\":279,\"dominant_Hz\":\"10-15\"},{\"behaviour\":\"Walk 2 (young 1)\",\"max_force_N\":273,\"dominant_Hz\":\"10-15\"},{\"behaviour\":\"Walk 3 (adult 2)\",\"max_force_N\":125,\"dominant_Hz\":\"20-25\"},{\"behaviour\":\"Walk 4 (adult 3), the fast walk of Fig. 1\",\"max_force_N\":946,\"dominant_Hz\":\"5-10\"},{\"behaviour\":\"Walk 5 (young 2)\",\"max_force_N\":289,\"dominant_Hz\":\"10-15\"},{\"behaviour\":\"Climbing step\",\"max_force_N\":1190,\"dominant_Hz\":\"20-25\"},{\"behaviour\":\"Bull 1 rumbles 1-3\",\"max_force_N\":\"1314, 2546, 2100\"},{\"behaviour\":\"Cow rumbles\",\"max_force_N\":\"69, 2238, 1401\"},{\"behaviour\":\"Car (about 10 mph, closest 4 m)\",\"max_force_N\":88,\"dominant_Hz\":\"20-25\"}]}",
   "who_when": "Mortimer et al., 2018"
  },
  {
   "key": "elephant_mortimer2018_source_force_vs_weight",
   "category": "elephant",
   "label": "Elephant step: seismic-band source force as a share of body weight",
   "status": "estimate",
   "value_si": 0.03,
   "unit_si": "ratio",
   "low_si": 0.004,
   "high_si": 0.05,
   "display": "About 0.5–4% of body weight (if the elephants weighed 2.5–3.5 t)",
   "sources": [
    {
     "title": "Mortimer et al. (2018) Supplemental Table S1 (forces)",
     "url": "https://ars.els-cdn.com/content/image/1-s2.0-S0960982218304202-mmc1.pdf"
    },
    {
     "title": "Ren & Hutchinson (2008) J. R. Soc. Interface 5:195-211, Table 1 (masses of comparable elephants)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2705974/"
    }
   ],
   "notes": "Formula: F_seis / (m g). The Kenyan elephants were not weighed, so we assumed 2,500–3,500 kg, in line with key elephant_ren2008_masses. Adult walks: 125 N → 0.4–0.5%; 279 N → 0.8–1.1%; 946 N (fast walk) → 2.8–3.9%. Climbing step 1,190 N → 3.5–4.9%. Adult bulls can weigh much more, which would lower the shares. Use: an elephant-like soft step puts only a few percent of body weight into the 5–25 Hz band that makes ground vibration. Feeding the full ground reaction force (1.2 × body weight, W8.WALK_LOAD) into a seismic formula would overstate it by about 30–200×.",
   "who_when": "Estimate here (2026) from Mortimer et al., 2018"
  },
  {
   "key": "elephant_mortimer2018_modelled_range",
   "category": "elephant",
   "label": "Modelled range at which an elephant fast walk stays detectable over background noise",
   "status": "verified",
   "value_si": 3600,
   "unit_si": "m",
   "low_si": 0,
   "high_si": 3600,
   "display": "Up to 3.6 km in a model (sand, quiet, 10–15 Hz band); not detectable at 1 km in high noise",
   "sources": [
    {
     "title": "Mortimer et al. (2018) Curr. Biol. 28:R547-R548 (UCL repository)",
     "url": "https://discovery.ucl.ac.uk/id/eprint/10063309/1/1-s2.0-S0960982218304202-main.pdf"
    },
    {
     "title": "Mortimer et al. (2018) Supplemental Table S1",
     "url": "https://ars.els-cdn.com/content/image/1-s2.0-S0960982218304202-mmc1.pdf"
    }
   ],
   "notes": "Main text: 'Maximum propagation range estimates were 6.4 km for cow rumble versus 3.6 km for fast elephant walk'. Higher noise cut ranges by '84 ± 16% lower under higher noise on average'. Fig. 1 caption: 'Only fast walk at 1000 m is not detectable over background noise'. Detection used STA/LTA (short-term over long-term average, threshold 1.6) on modelled waveforms for a sensitive geophone. This is instrument detectability, not human feeling. Table S1 walk ranges run from 0 to 3,600 m depending on ground, noise and band.",
   "who_when": "Mortimer et al., 2018"
  },
  {
   "key": "elephant_oconnell2000_stomp_pp_velocity",
   "category": "elephant",
   "label": "Asian elephant foot stomps: peak-to-peak vertical ground velocity at 3–12 m and at 40 m (as quoted by a later paper)",
   "status": "reported",
   "value_si": 0.0000487,
   "unit_si": "m/s (peak-to-peak)",
   "low_si": 0.000017,
   "high_si": 0.0000487,
   "display": "48.7 µm/s peak-to-peak at 3–12 m; 17.0 µm/s at 40 m",
   "sources": [
    {
     "title": "Wijayaraja, Wijekoon, Wijesundara & Wickramasinghe (2024) Toward long range detection of elephants using seismic signals: a geophone-sensor interface for embedded systems (arXiv 2406.05140; published IEEE Access 12:72210-72223), quoting O'Connell-Rodwell et al. 2000",
     "url": "https://arxiv.org/pdf/2406.05140"
    }
   ],
   "notes": "Secondary quote of O'Connell-Rodwell, Arnason & Hart (2000) J. Acoust. Soc. Am. 108:3066-3072: 'According to [44], the RMS velocity of elephant rumbles is 0.437 µm/s at a distance of 3-12 m and is 0.264 µm/s at a distance of 40 m. For the corresponding distances, experimental peak-to-peak velocities for stomps were 48.7 µm/s and 17.0 µm/s, respectively.' The same paper quotes from [44]: 'The footfall signature of the elephant (i.e., stomp) has a mean frequency of 24.03 Hz (±2.98)'. Its Table 1 lists the 2000 study's geophone as 10 Hz vertical at 8000 samples/s. The primary paper was paywalled and blocked, so these numbers are not confirmed against it; hence 'reported'. Captive Asian elephants; masses unknown; ground type unknown here.",
   "values_json": "{\"stomp_peak_to_peak_um_s\":{\"3-12 m\":48.7,\"40 m\":17.0},\"rumble_rms_um_s\":{\"3-12 m\":0.437,\"40 m\":0.264},\"stomp_mean_frequency_Hz\":\"24.03 (+/-2.98)\",\"rumble_mean_frequency_Hz\":20.66}",
   "who_when": "O'Connell-Rodwell, Arnason & Hart, 2000 (quoted by Wijayaraja et al., 2024)"
  },
  {
   "key": "elephant_oconnell2000_stomp_ppv",
   "category": "elephant",
   "label": "Asian elephant foot stomps: zero-to-peak vertical velocity (half of the quoted peak-to-peak)",
   "status": "derived",
   "value_si": 0.000024,
   "unit_si": "m/s",
   "low_si": 0.0000085,
   "high_si": 0.000049,
   "display": "About 0.024 mm/s at 3–12 m and 0.0085 mm/s at 40 m",
   "sources": [
    {
     "title": "Wijayaraja et al. (2024) arXiv 2406.05140, quoting O'Connell-Rodwell et al. 2000",
     "url": "https://arxiv.org/pdf/2406.05140"
    }
   ],
   "notes": "Formula: zero-to-peak ≈ peak-to-peak / 2, assuming a waveform symmetric about zero. The true peak lies between p-p/2 and p-p. 48.7/2 = 24.4 µm/s (up to 48.7) at 3–12 m; 17.0/2 = 8.5 µm/s at 40 m. These are deliberate stomps, probably from a mock charge (key elephant_oconnell_stomp_mock_charge), so they likely overstate an ordinary walking step. Decay between the two distances gives an exponent n = 0.4–0.9 (key elephant_decay_exponent_from_data).",
   "who_when": "Derived here (2026) from O'Connell-Rodwell et al., 2000 (secondary)"
  },
  {
   "key": "elephant_oconnell_stomp_mock_charge",
   "category": "elephant",
   "label": "The O'Connell-Rodwell 'foot stomps' came from a mock charge, not ordinary walking",
   "status": "verified",
   "value_si": 32000,
   "unit_si": "m",
   "display": "'foot stomps from a mock charge could possibly travel up to 32 kilometers' (modelled, instrumental)",
   "sources": [
    {
     "title": "O'Connell-Rodwell, Arnason & Hart, SICB meeting abstract 'Exploring the Possibility of Low-Frequency Seismic Communication in Elephants and Other Large Mammals'",
     "url": "https://sicb.org/?p=37257"
    },
    {
     "title": "O'Connell-Rodwell, Arnason & Hart (2000) J. Acoust. Soc. Am. 108:3066-72, PubMed abstract (PMID 11144599)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=11144599,12083604&rettype=abstract&retmode=text"
    }
   ],
   "notes": "SICB quote: 'Using seismic modeling, we estimated that the elephant rumbles that we recorded could potentially travel up to 16.7 km in the ground and foot stomps from a mock charge could possibly travel up to 32 kilometers.' The 2000 JASA abstract: 'up to 16 km' for vocalizations and 'up to 32 km for locomotion generated signals'. The matching 32 km suggests the 2000 paper's 'foot stomps' are these mock-charge stomps. That is our inference, not stated in the 2000 abstract. The SICB page shows no meeting year; its archive entry was migrated in 2021. 32 km is a model of instrument detectability, not a measurement.",
   "who_when": "O'Connell-Rodwell, Arnason & Hart (SICB abstract, c. 2001; JASA 2000)"
  },
  {
   "key": "elephant_oconnell2000_abstract_measurements",
   "category": "elephant",
   "label": "Asian elephant rumbles and stomps: seismic wave speed, frequency and distance recorded",
   "status": "verified",
   "value_si": 40,
   "unit_si": "m",
   "display": "Clearly above background at 40 m; ground waves at 248–264 m/s; frequencies near 20 Hz",
   "sources": [
    {
     "title": "O'Connell-Rodwell, Arnason & Hart (2000) Seismic properties of Asian elephant (Elephas maximus) vocalizations and locomotion. J. Acoust. Soc. Am. 108(6):3066-72, PubMed abstract",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=11144599,12083604&rettype=abstract&retmode=text"
    }
   ],
   "notes": "Abstract quotes: 'elephant generated signals associated with rumbles and \"foot stomps\" propagated at different velocities in the two media, the acoustic signals traveling at 309 m/s and the seismic signals at 248-264 m/s. Both types of signals had predominant frequencies in the range of 20 Hz. Seismic signal amplitudes considerably above background noise were recorded at 40 m from the generating elephants for both the rumble and the stomp.' A 1998 JASA meeting abstract (doi:10.1121/1.423611, read via OpenAlex) describes geophones at about 30 m intervals out to 120 m. The full paper was not available.",
   "values_json": "{\"seismic_speed_m_s\":\"248-264\",\"acoustic_speed_m_s\":309,\"predominant_frequency_Hz\":\"about 20\",\"recorded_above_noise_at_m\":40,\"modelled_instrumental_range_km\":{\"rumble\":16,\"locomotion\":32}}",
   "who_when": "O'Connell-Rodwell, Arnason & Hart, 2000"
  },
  {
   "key": "elephant_oconnell_rumble_ground_velocity",
   "category": "elephant",
   "label": "Seismic part of a natural elephant rumble at 10 m (for contrast with footsteps)",
   "status": "verified",
   "value_si": 2.76e-7,
   "unit_si": "m/s (RMS, 40–60 Hz band)",
   "display": "Mean 0.276 µm/s RMS at 10 m, about 100× weaker than a stomp nearby",
   "sources": [
    {
     "title": "O'Connell-Rodwell et al. (2006) Wild elephant (Loxodonta africana) breeding herds respond to artificially transmitted seismic stimuli. Behav. Ecol. Sociobiol. 59:842-850 (author PDF, UCLA)",
     "url": "https://bec.ucla.edu/wp-content/uploads/sites/108/archive/papers/OConnellRodwell_4.16.07.pdf"
    }
   ],
   "notes": "Quote: playback was raised 'to peak presentation velocities ranging from 0.44 to 1.1 μm/s root mean square (RMS) at 10 m from the elephants, approximating the velocity of a naturally occurring seismic elephant rumble (40–60 Hz) at this distance (mean 0.276 μm/s; O'Connell-Rodwell et al. 2000a)'. The 2024 secondary quote gives 0.437 µm/s RMS at 3–12 m and 0.264 at 40 m for rumbles. Band-limited RMS values are not peak values. Only here to show that rumbles are much weaker than footfalls in these Asian elephant data. Mortimer 2018 found the reverse in source force (rumbles up to 2,546 N), so the two groups differ.",
   "who_when": "O'Connell-Rodwell et al., 2006 (citing 2000a)"
  },
  {
   "key": "elephant_oconnell2006_surface_wave_attenuation",
   "category": "elephant",
   "label": "Measured surface-wave attenuation fitted near an elephant waterhole (Etosha calcrete, 40–60 Hz)",
   "status": "verified",
   "value_si": 0.018,
   "unit_si": "1/m",
   "low_si": 0.018,
   "high_si": 0.05,
   "display": "L = L0 · e^(−αr) / √r, with α = 0.018 per m (elephant-generated background) to 0.05 per m (buried shakers)",
   "sources": [
    {
     "title": "O'Connell-Rodwell et al. (2006) Behav. Ecol. Sociobiol. 59:842-850, Eq. 1 and Table 1 (author PDF, UCLA)",
     "url": "https://bec.ucla.edu/wp-content/uploads/sites/108/archive/papers/OConnellRodwell_4.16.07.pdf"
    }
   ],
   "notes": "Quotes: 'we used the standard surface wave attenuation rate model (White 1965)'. Eq. (1) 'relates the velocity level L (m/s) at distance r based on a source signal level L0 and propagation constant α'. Fitted values: 'α=0.05/m and L0=25.5×10−6 m3/2/s ... for shaker-induced motions'; background 'α=0.018/m and L0=4×10−7 m3/2/s'. 'It was assumed that the noise was produced by a single source at the water hole (i.e., the elephants) as their footfalls create seismic noise'. Ground: 'the substrate environment in Etosha National Park is relatively homogeneous calcrete'. The background at the elephants' position, 5 m from the waterhole, was '−12 dB re 1 μm/s' (0.25 µm/s RMS, 40–60 Hz band). That is band-limited RMS of many animals' footfalls, not a single-step peak. The fit used only two geophones (10 m and 90 m). The 1/√r spreading plus e^(−αr) damping is the physically expected form for surface waves. At 20 m it gives e^(−0.36) to e^(−1.0) on top of spreading.",
   "who_when": "O'Connell-Rodwell et al., 2006"
  },
  {
   "key": "elephant_wood2005_detection_radius",
   "category": "elephant",
   "label": "Range at which a single geophone picked up elephant footfalls at an Etosha waterhole",
   "status": "verified",
   "value_si": 100,
   "unit_si": "m",
   "display": "About 100 m",
   "sources": [
    {
     "title": "Wood, O'Connell-Rodwell & Klemperer (2005) Using seismic sensors to detect elephants and other large mammals: a potential census technique. J. Appl. Ecol. 42:587-594 (Stanford CRUSTAL PDF)",
     "url": "https://crustal.stanford.edu/sites/g/files/sbiybj21541/files/media/file/wood.elecensus.jappliedecol.2005_0.pdf"
    }
   ],
   "notes": "Quote: 'Given that the duration of the recording in which footfalls are visible is 166 s, the radius of detection is roughly 100 m.' Speed: 'we estimated its speed at 1·2 m s−1'. Discussion: 'the detection radius for an elephant footfall is roughly 100 m in Etosha National Park. This will vary depending on the soil type'. Setup: 'a single 4·5 Hz vertical geophone ... buried 1 m from a major path leading to the waterhole, at a depth of 15 cm'; 31 bull and 12 herd recordings at Mushara waterhole, June 2002. The figures show no absolute amplitudes ('Amplitude normalized by maximum dynamic range of recording equipment'). Wild African elephants, masses not given.",
   "who_when": "Wood, O'Connell-Rodwell & Klemperer, 2005"
  },
  {
   "key": "elephant_wood2005_overhead_vs_20m",
   "category": "elephant",
   "label": "How much weaker a bull's footfalls were at 20 m than directly over the geophone",
   "status": "verified",
   "value_si": 10,
   "unit_si": "amplitude ratio",
   "display": "About 20 dB (×10 in amplitude) weaker at 20 m",
   "sources": [
    {
     "title": "Wood et al. (2005) J. Appl. Ecol. 42:587-594, Fig. 4 and text (Stanford CRUSTAL PDF)",
     "url": "https://crustal.stanford.edu/sites/g/files/sbiybj21541/files/media/file/wood.elecensus.jappliedecol.2005_0.pdf"
    }
   ],
   "notes": "Quote: 'we can use Fig. 4 to estimate the maximum amplitude for an elephant that passed 20 m from the geophone. As indicated on the figure, this is considerably lower (∼20 dB) than when the elephant passed directly over the geophone.' Conversion: 20 dB = 10^(20/20) = ×10 in amplitude, because the amplitude envelope is an amplitude, not a power. If 'directly over' means 1–2 m, the decay exponent is n = ln 10 / ln(20/r0) = 0.77–1.0. This is an estimate from one bull's envelope and speed, not a calibrated pair of measurements.",
   "who_when": "Wood, O'Connell-Rodwell & Klemperer, 2005"
  },
  {
   "key": "elephant_wood2005_spectrum_and_gait",
   "category": "elephant",
   "label": "Elephant footfall spectrum and step timing (Etosha)",
   "status": "verified",
   "value_si": 25,
   "unit_si": "Hz",
   "low_si": 10,
   "high_si": 40,
   "display": "Most energy 10–40 Hz, peak near 25 Hz; a front-foot strike about every 1.5 s at 1.2 m/s",
   "sources": [
    {
     "title": "Wood et al. (2005) J. Appl. Ecol. 42:587-594 (Stanford CRUSTAL PDF)",
     "url": "https://crustal.stanford.edu/sites/g/files/sbiybj21541/files/media/file/wood.elecensus.jappliedecol.2005_0.pdf"
    }
   ],
   "notes": "Quotes: 'All species have a peak around 25 Hz but the shape of the spectra are different, with the elephant spectrum having the most pronounced low-frequency component'. 'A25Hz /A50Hz ∼ 1000 for elephants, but ≤ 100 for the other measured species.' Band-pass 10–40 Hz was used 'as most of the energy of the footfalls fell within this band pass range'. 'a large amplitude event (a front foot striking the ground) every ∼1·5 s, preceded by a smaller amplitude event (a rear foot striking the ground)'. Speed 1.2 m/s for the bull in Fig. 4. Species recorded: elephant, gemsbok, giraffe, human, kudu, lion. Amplitudes are normalized only.",
   "values_json": "{\"energy_band_Hz\":\"10-40\",\"spectral_peak_Hz\":25,\"A25_over_A50\":{\"elephant\":\"about 1000\",\"other species\":\"100 or less\"},\"front_footfall_interval_s\":1.5,\"walking_speed_m_s\":1.2}",
   "who_when": "Wood, O'Connell-Rodwell & Klemperer, 2005"
  },
  {
   "key": "elephant_wijayaraja2024_detection_and_masses",
   "category": "elephant",
   "label": "Weighed Sri Lankan elephants walking past a geophone: masses and detection range",
   "status": "verified",
   "value_si": 155.6,
   "unit_si": "m",
   "display": "Elephants of 2,700–3,500 kg; a 2,700 kg elephant detected walking 155.6 m away",
   "sources": [
    {
     "title": "Wijayaraja et al. (2024) arXiv 2406.05140 (published IEEE Access 12:72210-72223)",
     "url": "https://arxiv.org/pdf/2406.05140"
    }
   ],
   "notes": "Table 5 (Pinnawala Elephant Orphanage, partly tamed): E1 56 y, 3,500 kg, 233 cm; E2 25 y, 3,100 kg, 237 cm; E3 16 y, 2,700 kg, 222 cm. Quote: 'The maximum distance was reported when the gain setting was S2: Av(total) = 25,911, and the reported maximum distance was 155.6 m. The detection range was limited only by the available physical space'. Gain 580: detected 0–50 m; gain 940: 50–100 m. Geophone: 'RGI-HS 10' vertical, 'sensitivity of 85.8 V/m/s', 10 Hz. Power-spectrum peaks for E3 walking: 28.4, 29.3 and 26.28 Hz. Human subjects of 60–90 kg were also recorded. The figures show only ADC readings: 'The figures depict amplitudes corresponding to ADC readings; as such, specific units were not provided.'",
   "who_when": "Wijayaraja, Wijekoon, Wijesundara & Wickramasinghe, 2024"
  },
  {
   "key": "elephant_wijayaraja2024_derived_velocity",
   "category": "elephant",
   "label": "2,700 kg Sri Lankan elephant walking 0–50 m from the geophone: rough peak vertical velocity from ADC counts",
   "status": "derived",
   "value_si": 0.000004,
   "unit_si": "m/s",
   "low_si": 0.0000034,
   "high_si": 0.0000049,
   "display": "About 0.004 mm/s somewhere within 0–50 m (low confidence)",
   "sources": [
    {
     "title": "Wijayaraja et al. (2024) arXiv 2406.05140, Figs 18a and 21 (gain S0 = 580)",
     "url": "https://arxiv.org/pdf/2406.05140"
    }
   ],
   "notes": "Formula: v = counts × ADC step / (gain × geophone sensitivity). Inputs stated in the paper: 10-bit ADC 'with a resolution of 4.88 mV'; overall gain 580 (setting S0); sensitivity 85.8 V/(m/s). Fig. 21 (elephant E3, location 2, gain S0) peaks at about 35–50 counts from the mean (read by eye). Result: 35–50 × 4.88e-3 / (580 × 85.8) = 3.4e-6 to 4.9e-6 m/s. The distance within the 0–50 m track is unknown. Filter and amplifier response near 25 Hz are assumed flat. Weak, but it agrees in size with the Steinmann 20 m value.",
   "who_when": "Derived here (2026) from Wijayaraja et al., 2024"
  },
  {
   "key": "elephant_wijayaraja2025_wild_range",
   "category": "elephant",
   "label": "Wild Sri Lankan elephants detected by footfall vibration up to 140 m",
   "status": "verified",
   "value_si": 140,
   "unit_si": "m",
   "low_si": 66.9,
   "high_si": 155.6,
   "display": "155.6 m in controlled conditions; 140 m in the wild",
   "sources": [
    {
     "title": "Wijayaraja, Wijekoon & Wijesundara (2025) Event detection and classification for long range sensing of elephants using seismic signals (arXiv 2509.02920)",
     "url": "https://arxiv.org/pdf/2509.02920"
    }
   ],
   "notes": "Abstract: 'the maximum validated detection range was 155.6 m in controlled conditions and 140 m in natural environments'. Text: footfalls were recorded 'from wild elephants at distances ranging from 66.9 meters to 140 meters'. Acquiring footfall signals 'was challenging, particularly over long distances, due to their very low amplitudes and high susceptibility to noise'. Same 85.8 V/(m/s) 10 Hz geophone with a high-gain amplifier, so this is an instrument range.",
   "who_when": "Wijayaraja, Wijekoon & Wijesundara, 2025"
  },
  {
   "key": "elephant_ren2008_masses",
   "category": "elephant",
   "label": "Weighed elephants of about Rex and Ollie's mass (biomechanics study)",
   "status": "verified",
   "value_si": null,
   "unit_si": "kg",
   "low_si": 2550,
   "high_si": 3230,
   "display": "2,550–3,230 kg (five elephants aged 12–14, weighed on a truck scale)",
   "sources": [
    {
     "title": "Ren & Hutchinson (2008) The three-dimensional locomotor dynamics of African (Loxodonta africana) and Asian (Elephas maximus) elephants reveal a smooth gait transition at moderate speed. J. R. Soc. Interface 5:195-211, Table 1 (PMC)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2705974/"
    }
   ],
   "notes": "Table 1: Chandrika, Asian F, 14 y, 3,000 kg; Damini, Asian F, 12 y, 2,840 kg; Five, African F, 14 y, 2,780 kg; Jack, African M, 13 y, 3,230 kg; Latabe, African F, 13 y, 2,550 kg. Methods: 'All elephants had known body masses (mb) from placing all four limbs on a truck scale (±2 kg).' Read with WebFetch on the PMC page; a direct curl returned only a page shell. Rex and Ollie at 3,007 kg each sit inside this range. Adult bulls are much heavier (not sourced here). None of the seismic studies weighed their elephants except Wijayaraja et al. 2024 (2,700–3,500 kg).",
   "who_when": "Ren & Hutchinson, 2008 (published online 2007)"
  },
  {
   "key": "elephant_decay_exponent_from_data",
   "category": "elephant",
   "label": "How fast elephant footfall vibration falls with distance: exponent n in PPV ∝ D^−n, from the elephant studies",
   "status": "derived",
   "value_si": 1,
   "unit_si": "dimensionless",
   "low_si": 0.4,
   "high_si": 2,
   "display": "n about 1 (0.4–2): halving the distance roughly doubles the vibration",
   "sources": [
    {
     "title": "Wood et al. (2005) J. Appl. Ecol. 42:587-594",
     "url": "https://crustal.stanford.edu/sites/g/files/sbiybj21541/files/media/file/wood.elecensus.jappliedecol.2005_0.pdf"
    },
    {
     "title": "Wijayaraja et al. (2024) arXiv 2406.05140 (quoting O'Connell-Rodwell 2000)",
     "url": "https://arxiv.org/pdf/2406.05140"
    },
    {
     "title": "Steinmann et al. (2025) Fig. 4b,c (GFZ repository)",
     "url": "https://gfzpublic.gfz.de/pubman/item/item_5034960_2/component/file_5034988/5034960.pdf"
    }
   ],
   "notes": "Formula: n = ln(A1/A2) / ln(D2/D1). (1) O'Connell-Rodwell stomps: 24.4 → 8.5 µm/s from '3–12 m' to 40 m gives n = 0.41 (D1 = 3), 0.55 (D1 = 6), 0.87 (D1 = 12). (2) Wood: ×10 from 'directly over' (taken as 1–2 m) to 20 m gives n = 0.77–1.0. (3) Steinmann giraffes at ETA00: 3.5e-9 → 2.2e-10 m from 26 to 103 m gives n = 2.0. That pair is probably steepened by the far trace sitting near the noise floor, and the two may be different animals. Theory: surface waves spread as D^−0.5, and soil damping steepens the decay with distance (key elephant_oconnell2006_surface_wave_attenuation). n = 1 is a reasonable single value for 5–100 m.",
   "who_when": "Derived here (2026)"
  },
  {
   "key": "elephant_halfspace_check",
   "category": "elephant",
   "label": "Physics check: ground velocity from a footfall-sized force on an elastic half-space",
   "status": "estimate",
   "value_si": 0.000012,
   "unit_si": "m/s",
   "low_si": 0.000001,
   "high_si": 0.0003,
   "display": "With Mortimer's 125–946 N forces at 20 Hz: about 0.001–0.01 mm/s at 20 m on firm soil, up to 0.1–0.3 mm/s within a few metres on loose sand",
   "sources": [
    {
     "title": "Mortimer et al. (2018) Supplemental Table S1 (source forces used as inputs)",
     "url": "https://ars.els-cdn.com/content/image/1-s2.0-S0960982218304202-mmc1.pdf"
    }
   ],
   "notes": "Formula: Lamb's problem, the Rayleigh-wave far field from a vertical harmonic point force F on a Poisson half-space (ν = 0.25). u_z(r) = (F k_s / (2μ)) × G × sqrt(2 / (π k_R r)), with k_s = 2πf/Vs, μ = ρVs², k_R = k_s/0.9194 and G = 0.1996, found from the residue at the Rayleigh pole. Velocity v = 2πf u_z. Check: the same spectral integral reduces to Boussinesq's static w = F(1−ν)/(2πμr) as f → 0 (script scratchpad research/elephant/scripts/lamb.py). Results at 20 Hz: (a) loose sand, ρ 1,700, Vs 120 m/s: F = 946 N gives 0.27 mm/s at 2 m, 0.12 at 10 m, 0.085 at 20 m; F = 125 N gives 0.035, 0.016, 0.011 mm/s. (b) Firmer soil, ρ 1,900, Vs 250 m/s: 946 N gives 0.038, 0.017, 0.012 mm/s; 125 N gives 0.005, 0.0023, 0.0016 mm/s. (c) Soft rock, Vs 600 m/s: 946 N gives 0.0012 mm/s at 20 m. So the measured spread (0.005 mm/s at 20 m in Steinmann; 0.2–0.36 mm/s close in on river sand in Mortimer) fits forces of a few hundred newtons on ground of different stiffness. It also suggests Mortimer's velocity scale is right despite the loose 'multiplying' wording. Ignores: soil damping (factor e^(−αr), α about 0.02–0.05 per m), layering, the near field within about one wavelength (7–30 m at 20 Hz), and the finite foot size. The soil densities and shear-wave speeds are assumed typical values, not sourced here.",
   "who_when": "Estimate here (2026)"
  },
  {
   "key": "elephant_anchor_ppv_vs_distance",
   "category": "elephant",
   "label": "Recommended page anchor: an elephant walking past at D metres (peak vertical ground velocity)",
   "status": "estimate",
   "value_si": 0.000005,
   "unit_si": "m/s (at D = 20 m)",
   "low_si": 7e-7,
   "high_si": 0.00004,
   "display": "About 0.005 mm/s at 20 m (range 0.0007–0.04); about 0.01 mm/s at 10 m; about 0.02 mm/s at 5 m",
   "sources": [
    {
     "title": "Steinmann et al. (2025) Methods Ecol. Evol. 16:819-836 (central value)",
     "url": "https://gfzpublic.gfz.de/pubman/item/item_5034960_2/component/file_5034988/5034960.pdf"
    },
    {
     "title": "Wijayaraja et al. (2024) arXiv 2406.05140 (O'Connell-Rodwell stomp values; own data)",
     "url": "https://arxiv.org/pdf/2406.05140"
    },
    {
     "title": "Mortimer et al. (2018) Curr. Biol. 28:R547-R548 (close-range fast walk)",
     "url": "https://discovery.ucl.ac.uk/id/eprint/10063309/1/1-s2.0-S0960982218304202-main.pdf"
    },
    {
     "title": "Wood et al. (2005) J. Appl. Ecol. 42:587-594 (decay and detection radius)",
     "url": "https://crustal.stanford.edu/sites/g/files/sbiybj21541/files/media/file/wood.elecensus.jappliedecol.2005_0.pdf"
    }
   ],
   "notes": "Formula: PPV_elephant(D) = 0.005 mm/s × (20 m / D) for 5 ≤ D ≤ 100 m, band ×0.15 to ×8. Central value: Steinmann walk at 20 m, 0.0047 mm/s. Exponent n = 1 from key elephant_decay_exponent_from_data. Band: the low end covers Steinmann's typical step (0.0022) and the four-elephant group (0.00075). The high end covers O'Connell-Rodwell stomps scaled to 20 m (0.004–0.019) and Steinmann running (0.006–0.008). It also covers Mortimer's 0.2–0.36 mm/s fast walk, but only if that was within about 2–3 m: 0.005 × 20/2 × 8 = 0.4. Wijayaraja's rough 0.004 mm/s at 0–50 m also fits. Vertical component only; the three-component vector peak would be up to about 1.2×. Beyond about 100–150 m single footfalls sink into background noise for good seismometers (Wood about 100 m; Steinmann data to 150 m; Wijayaraja 140–156 m). Below about 5 m it depends strongly on soil; up to 0.2–0.4 mm/s has been recorded within a few metres on loose sand. A walking elephant is cushion-footed; a deliberate stomp runs about 2–4× higher.",
   "values_json": "{\"formula\":\"PPV(D) = 0.005 mm/s x (20 m / D), valid 5-100 m, vertical component\",\"band\":\"x0.15 to x8\",\"rows\":[{\"D_m\":5,\"central_mm_s\":0.02,\"low_mm_s\":0.003,\"high_mm_s\":0.16},{\"D_m\":10,\"central_mm_s\":0.01,\"low_mm_s\":0.0015,\"high_mm_s\":0.08},{\"D_m\":20,\"central_mm_s\":0.005,\"low_mm_s\":0.0007,\"high_mm_s\":0.04},{\"D_m\":50,\"central_mm_s\":0.002,\"low_mm_s\":0.0003,\"high_mm_s\":0.016},{\"D_m\":100,\"central_mm_s\":0.001,\"low_mm_s\":0.00015,\"high_mm_s\":0.008}],\"checks\":{\"Steinmann walk 20 m\":0.0047,\"Steinmann running 38 m\":0.0044,\"O'Connell-Rodwell stomp 3-12 m (0-pk)\":0.024,\"O'Connell-Rodwell stomp 40 m (0-pk)\":0.0085,\"Mortimer fast walk 2-30 m\":\"0.21-0.36\",\"Wijayaraja 0-50 m\":0.004}}",
   "who_when": "Estimate here (2026) from the studies above"
  }
 ],
 "model_recommendation": "1. Elephant comparison on the Walk tab\n   - Use PPV_elephant(D) = 0.005 mm/s × (20 m / D), valid for 5–100 m, vertical component (key elephant_anchor_ppv_vs_distance).\n   - Show the band ×0.15 to ×8 (0.0007–0.04 mm/s at 20 m) as a shaded range, not a single line.\n   - Below 5 m, show \"rises steeply; depends on ground. Up to 0.2–0.4 mm/s measured within a few metres on loose sand (Mortimer 2018)\". Do not extrapolate the formula there.\n   - Beyond about 100–150 m, show \"below background noise; only sensitive instruments detect it\" (Wood 2005; Steinmann 2025; Wij … [4,229 more characters on this line; the full prompt is in prompts/ac134b11615fd1da2.txt]
 "gaps": "1. Primary paper not available: O'Connell-Rodwell, Arnason & Hart (2000), JASA 108:3066-72.\n   - Paywalled; the publisher site and ResearchGate returned 403 and no open copy exists (OpenAlex/Unpaywall: closed). Only the PubMed abstract was read.\n   - The stomp values (48.7 and 17.0 µm/s peak-to-peak at 3–12 m and 40 m), the rumble RMS values (0.437 and 0.264 µm/s) and the 24.03 Hz stomp frequency come from a secondary quote (Wijayaraja et al. 2024), so they are \"reported\".\n   - Unknown: the exact distances inside \"3–12 m\", the ground type, the elephants' masses, and whether \" … [3,868 more characters on this line; the full prompt is in prompts/ac134b11615fd1da2.txt]
}
```

</details>


### Workflow `rex-presence-research` · 2026-10-11 18:05:07 UTC

- `Workflow` rex-presence-research: Research verified facts for the Rex lab presence brief (step forces, ground vibration, elephants, thresholds, the water-glass ripple, comic switches, growth physics), then adversarially verify each topic
  - run `wf_83090d59-a30`: 4 subagents, listed below

**Subagent `research:thresholds`** · rex-presence-research · started 2026-10-11 18:05:09 UTC

- facts: 46 (36 verified, 5 estimate, 3 derived, 1 reported, 1 disputed).
- Research topic "thresholds" (vibration levels at which people feel it, things rattle, cosmetic damage starts, and people lose their footing), for the Walk tab. 46 facts.

<details>
<summary>Prompt, verbatim (5,807 characters)</summary>

Workflow run `wf_83090d59-a30`, phase `Research`, agent `a31e5cb387875a3c7`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a31e5cb387875a3c7.txt](prompts/a31e5cb387875a3c7.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

TOPIC "thresholds": vibration levels at which (a) people feel it, (b) ornaments, crockery and windows rattle, (c) cosmetic damage to buildings starts, plus (d) where people lose their footing, and the frequency dependence of each.
Find the actual tables, with their units, durations (transient vs continuous) and frequency ranges: BS 5228-2:2009+A1:2014 Table B.1 (guidance on effects of vibration levels) and B.2; BS 7385-2:1993 Table 1 and its notes (transient vibration guide values for cosmetic damage: reinforced or framed vs unreinforced or light framed, frequency-dependent); DIN 4150-3:2016 (or 1999) Table 1 short-term vibration guideline values by building type and frequency band; ISO 2631-2 and BS 6472-1 for human perception (what can be quoted); the US Bureau of Mines RI 8507 (Siskind et al. 1980) safe-level criteri … [1,353 more characters on this line; the full prompt is in prompts/a31e5cb387875a3c7.txt]
```

</details>

**Subagent `research:ripple`** · rex-presence-research · started 2026-10-11 18:05:09 UTC

- facts: 20 (13 verified, 3 estimate, 2 derived, 2 reported).
- I found no measured threshold for when a glass of water shows visible ripples at footstep frequencies (10–40 Hz). Searches covered physics-education journals, Leicester's Physics Special Topics (its own search returns no results), seismoscope and Mercalli literature, liquid-mirror telescopes, ...

<details>
<summary>Prompt, verbatim (5,346 characters)</summary>

Workflow run `wf_83090d59-a30`, phase `Research`, agent `a39321d7e524350d0`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a39321d7e524350d0.txt](prompts/a39321d7e524350d0.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

TOPIC "ripple": the "Jurassic Park" water-glass test. At what ground vibration does a glass (or cup) of water on a table show visible ripples on its surface?
(1) Look hard for a measured value: physics-education or popular-physics analyses of the film scene (e.g. University of Leicester "Physics Special Topics" student papers, American Journal of Physics, Physics Education, The Physics Teacher), seismoscope or liquid-surface vibration-detection literature, liquid-mirror or "water glass" vibration tests, laboratory studies of surface waves in vibrated containers (wall-driven meniscus waves vs the parametric Faraday instability, which needs about g-level accelerations), any measurements with smartphones or accelerometers. Record the vibration level ( … [965 more characters on this line; the full prompt is in prompts/a39321d7e524350d0.txt]
```

</details>

**Subagent `verify:ripple`** · rex-presence-research · started 2026-10-11 18:23:43 UTC

- checks: 20 (11 ok, 9 not ok).
- Not OK: ripple_no_measured_threshold; ripple_shao2021_edge_wave_anchor; ripple_faraday_onset_small_tank (+6 more).
- The research is careful, and nearly all quoted numbers and sentences match the re-fetched sources. I fetched 16 URLs and recomputed with my own scripts: the IAPWS table, the Mercalli wording, the ShakeMap legend, the Shao et al.

<details>
<summary>Prompt, verbatim (44,510 characters)</summary>

Workflow run `wf_83090d59-a30`, phase `Verify`, agent `a8533bf080ddb5648`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a8533bf080ddb5648.txt](prompts/a8533bf080ddb5648.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

You are a skeptical fact-checker for the topic "ripple". Below are the researcher's facts and model recommendation. Re-fetch the cited URLs for every fact the page is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, unit conversion, quotation and status against what the source actually says; recompute every derived number with your own script. Mark ok=false with a correction for anything wrong, mislabelled (a secondary summary presented as the primary paper, an estimate or a fan source marked verified, a sample maximum called a limit, the wrong units or wrong peak/RMS basis), or unsupported. Judge the model recommendation: wrong physics, wrong formula, constants used outside the range they were fitted to, overstated certainty? List important missing items.

RESEARCH:
{
 "summary": "I found no measured threshold for when a glass of water shows visible ripples at footstep frequencies (10–40 Hz). Searches covered physics-education journals, Leicester's Physics Special Topics (its own search returns no results), seismoscope and Mercalli literature, liquid-mirror telescopes, vibration-standard tables and smartphone experiments. So the page value is DERIVED, not measured.\n\nThe derivation uses sourced inputs:\n- Water surface tension, 72.74 mN/m at 20 °C (IAPWS).\n- The capillary-gravity dispersion relation (Wilson et al. 2022), which gives ripple wavelengths of  … [2,718 more characters on this line; the full prompt is in prompts/a8533bf080ddb5648.txt]
 "facts": [
  {
   "key": "ripple_no_measured_threshold",
   "category": "ripple",
   "label": "Measured naked-eye threshold for visible ripples in a glass at footstep frequencies",
   "status": "estimate",
   "display": "Unknown: no measured value found",
   "value_si": null,
   "unit_si": "m/s",
   "sources": [
    {
     "title": "University of Leicester Physics Special Topics: journal search for 'Jurassic Park' (returns No Results)",
     "url": "https://journals.le.ac.uk/index.php/pst/search/search?query=Jurassic+Park"
    }
   ],
   "notes": "This is a recorded negative result, not a number. Searches covered: physics-education journals (AJP, Physics Education, The Physics Teacher), Leicester PST (its search page shows 'No Results' for Jurassic Park), seismoscope and macroseismic sources, liquid-mirror telescope vibration papers (qualitative only: ripples from vibration noted, no threshold), construction, railway and blasting vibration tables, and smartphone or phyphox experiments. None gives a measured ground-vibration level at which ripples in a drinking glass become visible to the eye. The page must therefore present the water-glass threshold as derived (see ripple_threshold_recommended).",
   "who_when": "This research, 2026"
  },
  {
   "key": "ripple_mmi1931_liquids",
   "category": "ripple",
   "label": "Modified Mercalli scale (1931): what earthquakes do to liquids in open vessels",
   "status": "verified",
   "display": "MM IV: 'Disturbed liquids in open vessels slightly'; MM V: small spills from well-filled containers",
   "value_si": null,
   "unit_si": "",
   "sources": [
    {
     "title": "Natural Resources Canada, Earthquakes Canada: The Modified Mercalli (MM) Intensity Scale (1931 version, after Wood & Neumann 1931, BSSA 21, 277-283)",
     "url": "https://earthquakescanada.nrcan.gc.ca/info-gen/scales-echelles/mercalli-en.php"
    }
   ],
   "notes": "As reproduced by NRCan. Exact text: MM II '...sometimes trees, structures, liquids, bodies of water, may sway...'. MM IV 'Felt indoors by many, outdoors by few. ... Rattling of dishes, windows, doors; glassware and crockery clink and clash. ... Disturbed liquids in open vessels slightly.' MM V 'Felt indoors by practically all ... Spilled liquids in small amounts from well-filled open containers.' MM VI 'Liquid set in strong motion.' MM VII 'Waves on ponds, lakes, and running water.' These are reported human observations in earthquakes. Ground motion there is dominated by low frequencies, so the liquid response is mostly whole-surface sloshing and tilt, not the short ripples footsteps would make. Use as context only.",
   "who_when": "Wood & Neumann 1931, reproduced by NRCan",
   "values_json": "{\"MM II\":\"sometimes ... liquids, bodies of water, may sway\",\"MM IV\":\"Disturbed liquids in open vessels slightly\",\"MM V\":\"Spilled liquids in small amounts from well-filled open containers\",\"MM VI\":\"Liquid set in strong motion\",\"MM VII\":\"Waves on ponds, lakes, and running water\"}"
  },
  {
   "key": "ripple_shakemap_mmi_iv_pgv",
   "category": "ripple",
   "label": "Peak ground velocity at Mercalli intensity IV ('liquids slightly disturbed'), USGS ShakeMap scale",
   "status": "verified",
   "display": "Intensity IV (Light): PGV 1.41 cm/s, PGA 2.76 %g",
   "value_si": 0.0141,
   "unit_si": "m/s",
   "sources": [
    {
     "title": "USGS ShakeMap, Macroseismic Intensity Map, 16 km SW of Ludlow CA (M7.1, 1999), legend 'Scale based on Worden et al. (2012)'",
     "url": "https://earthquake.usgs.gov/product/shakemap/ci9108652/atlas/1594160205748/download/intensity.pdf"
    }
   ],
   "notes": "Read from the map legend; the rendered legend was checked visually. Legend row 'PGV(cm/s): <0.0215 | 0.135 | 1.41 | 4.65 | 9.64 ...' under 'INTENSITY: I | II-III | IV | V | VI'. PGA row '<0.0464 | 0.297 | 2.76 | 6.2 | 11.5' (%g). Shaking 'Light', damage 'None' at IV. Worden et al. (2012) itself was not fetched. That these are the PGV values at each intensity is my reading; it agrees with the IV column. Caveats: earthquake shaking at roughly 0.5-5 Hz with long duration. At 1-2 Hz, 1.41 cm/s tilts a glass's surface quasi-statically by about 0.5-1 degree, which is sloshing rather than ripples. Not transferable to 10-40 Hz footsteps; context only. It shows casual observers notice disturbed liquids only around 'felt by many' shaking at low frequency.",
   "who_when": "USGS ShakeMap, scale after Worden et al. 2012",
   "values_json": "{\"II-III\":{\"PGV_cm_s\":0.135,\"PGA_pct_g\":0.297},\"IV\":{\"PGV_cm_s\":1.41,\"PGA_pct_g\":2.76},\"V\":{\"PGV_cm_s\":4.65,\"PGA_pct_g\":6.2}}"
  },
  {
   "key": "ripple_shao2021_edge_wave_anchor",
   "category": "ripple",
   "label": "Lab anchor: concentric edge waves in a glass-sized tank shaken vertically (clearly imaged level)",
   "status": "verified",
   "display": "~0.5 m/s² vertical at 11.2 Hz (≈7 mm/s PPV) gave a clear ring pattern; R = 35 mm water tank",
   "value_si": 0.5,
   "unit_si": "m/s^2",
   "sources": [
    {
     "title": "Shao, Gabbard, Bostwick & Saylor (2021), On the role of meniscus geometry in capillary wave generation, Experiments in Fluids 62:59, doi:10.1007/s00348-021-03161-3 (NSF public-access copy)",
     "url": "https://par.nsf.gov/servlets/purl/10311610"
    }
   ],
   "notes": "Quotes: 'a circular acrylic tank having a radius R = 35 mm and depth H = 22 mm'; 'The shaker ... provided vertical vibration of the tank'; 'we are interested in waves under resonant conditions, i.e., where the waves emanate from the tank edge, propagate inward, and are reflected back at the geometric center to create a standing wave field'; 'Herein we studied the resonant condition which existed at a driving frequency of 11.2 Hz. For the results presented here, the amplitude of tank acceleration was on the order of 0.5 m/s2.'; 'Our apparatus was not capable of measuring the actual wave height'. Viewing was wave-slope imaging with collimated white light (2 mm hole at 300 mm focal length) and a camera with a 1 s exposure, not the naked eye. Derived: PPV = A/(2πf) = 0.5/(2π·11.2) ≈ 7.1 mm/s; displacement ≈ 0.1 mm. It is NOT a threshold; it is a level that gave robust, clearly imaged rings at a tank resonance. Under the model in ripple_threshold_noticeable this gives a reflected-light deflection of about 20-40 arcmin, comparable to the imaging source's 23-arcmin angular size, so the two agree.",
   "who_when": "Shao, Gabbard, Bostwick & Saylor 2021"
  },
  {
   "key": "ripple_meniscus_mechanism",
   "category": "ripple",
   "label": "Why up-and-down shaking makes ring waves: the meniscus (a flat surface makes none)",
   "status": "verified",
   "display": "Edge waves need a meniscus; vibration makes g effectively time-varying and the meniscus shape oscillates",
   "value_si": null,
   "unit_si": "",
   "sources": [
    {
     "title": "Shao, Gabbard, Bostwick & Saylor (2021), Experiments in Fluids 62:59 (NSF PAR copy)",
     "url": "https://par.nsf.gov/servlets/purl/10311610"
    }
   ],
   "notes": "Quotes: 'such a meniscus is needed to form capillary waves, that the lack of a meniscus (a flat interface at the wall) prevents the formation of these waves, and that a meniscus of either positive or negative curvature serves equally well'; 'When a tank is vibrated, g effectively becomes a time-varying value and the meniscus geometry must vary to accommodate the new value. The changing meniscus geometry is the oscillating change in the surface at the tank edge which causes waves to propagate. For the flat interface, the effective variation in g has no effect on the interface'. Also 'the greater the degree of under/overfilling, the greater the amplitude of a standing capillary wave field for a fixed amplitude of wave generator motion.' Implication: a glass that water wets (large meniscus) should ring more readily than a plastic cup whose contact angle is near 90 degrees.",
   "who_when": "Shao et al. 2021"
  },
  {
   "key": "ripple_edge_waves_below_faraday",
   "category": "ripple",
   "label": "Edge (meniscus) waves appear far below the Faraday threshold, at the drive frequency, and are concentric",
   "status": "verified",
   "display": "Edge waves: harmonic, axisymmetric (concentric), at amplitudes 'much smaller than the Faraday wave threshold'",
   "value_si": null,
   "unit_si": "",
   "sources": [
    {
     "title": "Shao, Wilson, Saylor & Bostwick (2021), Surface wave pattern formation in a cylindrical container, J. Fluid Mech. 915, A19, doi:10.1017/jfm.2021.97 (NSF PAR copy)",
     "url": "https://par.nsf.gov/servlets/purl/10311615"
    }
   ],
   "notes": "Quotes (PDF text is letter-spaced; reconstructed): 'The presence of a meniscus at the contact line between the interface and vibrating container induces motions that are harmonic with respect to the driving frequency and are referred to as edge waves. These typically appear for driving amplitudes much lower than the Faraday wave threshold'; 'Harmonic edge waves can be excited by under-filling the container such that α < 90° wherein edge waves occur for driving amplitudes much smaller than the Faraday wave threshold. Edge waves are always axisymmetric ℓ = 0 and the radial mode number n increases with frequency.' Fig. 6 shows sharp edge-wave resonances (n = 1 to 6) between about 8 and 23 Hz in the R = 35 mm tank. No forcing amplitude is given for the edge waves. Derived from wall geometry (not from this paper): side-to-side shaking moves the wall's normal component as cos θ around the glass, so its waves are two-lobed, not concentric. The film's concentric rings point to up-and-down shaking.",
   "who_when": "Shao, Wilson, Saylor & Bostwick 2021"
  },
  {
   "key": "ripple_faraday_onset_small_tank",
   "category": "ripple",
   "label": "Faraday (parametric) wave onset for water in a 70 mm tank, vertical shaking 10-20 Hz",
   "status": "verified",
   "display": "Onset ≈0.3–2.5 m/s² (3–25% g); lowest ≈0.3–0.5 m/s² at mode resonances; waves at half the drive frequency",
   "value_si": 0.4,
   "low_si": 0.3,
   "high_si": 2.5,
   "unit_si": "m/s^2",
   "sources": [
    {
     "title": "Shao, Wilson, Saylor & Bostwick (2021), J. Fluid Mech. 915, A19, Fig. 4 (NSF PAR copy)",
     "url": "https://par.nsf.gov/servlets/purl/10311615"
    }
   ],
   "notes": "Values read off Fig. 4 ('Acceleration A against driving frequency fd showing the Faraday wave tongues'; axis A (m s-2) 0 to 2.5, fd 10-20 Hz). Read-off uncertainty about ±0.1 m/s²; the authors' own increments were 0.2 m/s². Conditions: R = 35 mm, H = 22 mm, deionized water, brimful with a pinned contact line and a flat interface (α = 90°), which minimises contact-line damping. Quotes: 'For Faraday waves, the observed frequency fo is half the driving frequency fo = 0.5fd'; 'the interface is flat below the threshold acceleration'. This CORRECTS the task text's 'about g-level accelerations': in a glass-sized pinned container onset is a few to 25% of g. An ordinary part-filled glass has a moving, hysteretic contact line and more damping, so the threshold is probably higher (not measured here). In PPV terms, 0.3 m/s² at 20 Hz is 2.4 mm/s, about 10× the derived ripple threshold. The instability also grows over many cycles, so single footstep pulses are unlikely to trigger it.",
   "who_when": "Shao, Wilson, Saylor & Bostwick 2021"
  },
  {
   "key": "ripple_water_surface_tension_20c",
   "category": "ripple",
   "label": "Surface tension of water at 20 °C",
   "status": "verified",
   "display": "72.74 mN/m at 20 °C (71.98 at 25 °C)",
   "value_si": 0.07274,
   "low_si": 0.07198,
   "high_si": 0.07274,
   "unit_si": "N/m",
   "sources": [
    {
     "title": "IAPWS R1-76(2014), Revised Release on Surface Tension of Ordinary Water Substance, Table 1",
     "url": "https://iapws.org/technical-guidance/release/Surf-H2O.download"
    }
   ],
   "notes": "Table 1 rows: '20 | 72.74 | 0.36 | 72.74 | 0.00' and '25 | 71.98 | 0.36 | 71.97 | 0.01' (t in °C, experimental, uncertainty, calculated, difference; mN/m). Uncertainty 0.36 mN/m. Tap water with surfactants or a film can be lower; that is not modelled. Water density: relies on existing key density_water_4c (USGS); 998 kg/m³ used at 20 °C.",
   "who_when": "IAPWS 2014"
  },
  {
   "key": "ripple_capillary_gravity_dispersion",
   "category": "ripple",
   "label": "Dispersion relation for ripples (capillary-gravity waves) on water",
   "status": "verified",
   "display": "ω² = (g k + σ k³/ρ) tanh(k h)",
   "value_si": null,
   "unit_si": "",
   "sources": [
    {
     "title": "Wilson, Shao, Saylor & Bostwick (2022), Role of edge effects and fluid depth in azimuthal Faraday waves, Phys. Rev. Fluids 7, 014803, eq. (21) (NSF PAR copy)",
     "url": "https://par.nsf.gov/servlets/purl/10391457"
    },
    {
     "title": "Karjanto (2010), First- and second-order wave generation theory, Appl. Math. Comput. Sci. 1(2) 181-197, eq. (5)",
     "url": "https://arxiv.org/pdf/1704.08416"
    }
   ],
   "notes": "Wilson et al. eq. (21), dimensionless: 'λn = i Oh kn² ± sqrt[(Bo kn + kn³) tanh(kn h) + 2kn² Ec − Oh² kn⁴], where Re[λ] is the frequency and Im[λ] is the decay rate'. 'Lengths are scaled by the radius of the cylinder R, time with the capillary timescale sqrt(ρR³/σ)', with Bo = ρgR²/σ. For a liquid (Ec = 0) with weak viscosity (Oh → 0) this is the dimensional form above; the conversion is mine. Karjanto gives the gravity-only limit 'ω² = gk tanh kh. (5)'. For a glass (h ≈ 5-10 cm) tanh(kh) ≈ 1 at 10-40 Hz.",
   "who_when": "Wilson et al. 2022; Karjanto 2010"
  },
  {
   "key": "ripple_viscous_damping_rate",
   "category": "ripple",
   "label": "Viscous damping rate of small ripples",
   "status": "verified",
   "display": "Γ = 2νk² (weak damping)",
   "value_si": null,
   "unit_si": "1/s",
   "sources": [
    {
     "title": "Denner, Paré & Zaleski (2017), Dispersion and viscous attenuation of capillary waves with finite amplitude, Eur. Phys. J. Special Topics (arXiv:1701.07613)",
     "url": "https://arxiv.org/pdf/1701.07613"
    },
    {
     "title": "Wilson et al. (2022), Phys. Rev. Fluids 7, 014803, Table I (water viscosity and density)",
     "url": "https://par.nsf.gov/servlets/purl/10391457"
    }
   ],
   "notes": "Denner et al.: 'The damping rate based on Eq. (3) is Γ = 2νk², applicable for k ≪ ω0/ν'. Water properties from Wilson et al. Table I, water:glycerol 1:0: surface tension 71.6 mN/m, viscosity 0.96 mPa s, density 997 kg/m³, giving ν ≈ 0.96 × 10⁻⁶ m²/s. Ignores the extra damping at the container wall and contact line, which dominates in small containers.",
   "who_when": "Denner, Paré & Zaleski 2017"
  },
  {
   "key": "ripple_wave_scales_derived",
   "category": "ripple",
   "label": "Ripple size and speed in a glass at 10, 20 and 40 Hz (computed)",
   "status": "derived",
   "display": "Wavelength 24 / 12 / 7 mm at 10 / 20 / 40 Hz; speed ≈ 24–28 cm/s",
   "value_si": 0.0119,
   "low_si": 0.0069,
   "high_si": 0.0237,
   "unit_si": "m",
   "sources": [
    {
     "title": "IAPWS R1-76(2014) surface tension",
     "url": "https://iapws.org/technical-guidance/release/Surf-H2O.download"
    },
    {
     "title": "Wilson et al. (2022) Phys. Rev. Fluids, dispersion eq. (21)",
     "url": "https://par.nsf.gov/servlets/purl/10391457"
    },
    {
     "title": "Denner et al. (2017), damping Γ = 2νk²",
     "url": "https://arxiv.org/pdf/1701.07613"
    }
   ],
   "notes": "Formula: solve ω² = (gk + σk³/ρ) tanh(kh) for k with σ = 0.07274 N/m, ρ = 998 kg/m³, g = 9.80665 m/s², h = 0.08 m. Then λ = 2π/k, phase speed ω/k, group speed (g + 3σk²/ρ)/(2ω), decay rate Γ = 2νk² (ν = 0.96e-6 m²/s) and decay length c_group/Γ. value_si is the 20 Hz wavelength. Viscous decay lengths (≈1.5, 0.5, 0.24 m) are far larger than a glass, so bulk viscosity does not stop ripples crossing it; wall and contact-line damping are not included. Time for waves to cross a 35 mm radius: about 0.1-0.18 s, comparable to one footstep pulse. The capillary length l_c = sqrt(σ/ρg) = 2.73 mm.",
   "who_when": "This research, 2026",
   "values_json": "{\"10 Hz\":{\"k_per_m\":265,\"wavelength_mm\":23.7,\"phase_speed_cm_s\":23.7,\"group_speed_cm_s\":20.0,\"viscous_decay_length_m\":1.5},\"20 Hz\":{\"k_per_m\":526,\"wavelength_mm\":11.9,\"phase_speed_cm_s\":23.9,\"group_speed_cm_s\":28.0,\"viscous_decay_length_m\":0.5},\"40 Hz\":{\"k_per_m\":906,\"wavelength_mm\":6.9,\"phase_speed_cm_s\":27.7,\"group_speed_cm_s\":37.7,\"viscous_decay_length_m\":0.24}}"
  },
  {
   "key": "ripple_wavemaker_deep_water_ratio",
   "category": "ripple",
   "label": "Wave made by a moving wall in deep water: amplitude vs wall displacement",
   "status": "verified",
   "display": "Wave amplitude → 2 × wall displacement amplitude as kh → ∞ (linear wavemaker theory)",
   "value_si": 2,
   "low_si": 1,
   "high_si": 2,
   "unit_si": "ratio",
   "sources": [
    {
     "title": "Karjanto (2010), First- and second-order wave generation theory (arXiv:1704.08416), Remark 1",
     "url": "https://arxiv.org/pdf/1704.08416"
    }
   ],
   "notes": "Quotes: 'the first-order transfer function Tn is defined as the ratio between the surface wave amplitude of the propagating mode Cn0 as output and the maximum stroke |Sn| as input'; '...approaching the asymptotic limit of Tn(1) = 2 for kn0 h → ∞.'; 'This first-order theory can also be found in Dean and Dalrymple'. Derived for a hinged-flap wavemaker. In deep water only near-surface motion matters, so a glass wall translating as a piston gives the same limit; a projection argument gives a = 2X. Ignores surface tension at the wall, the meniscus and contact-line pinning. Cocciaro, Faetti & Nobili (1991, JFM 231, 325; abstract only, via TRID) report that the wetting boundary condition gives 'unusual' amplitude and phase in a horizontally shaken cylinder. So the model uses a = X to 2X (low_si 1).",
   "who_when": "Karjanto 2010, after Dean & Dalrymple 1991"
  },
  {
   "key": "ripple_meniscus_height",
   "category": "ripple",
   "label": "Height of the water meniscus at a vertical wall",
   "status": "verified",
   "display": "z = l_c·√(2(1 − sin θ)); max √2·l_c ≈ 3.9 mm for water",
   "value_si": 0.00313,
   "low_si": 0.00012,
   "high_si": 0.00386,
   "unit_si": "m",
   "sources": [
    {
     "title": "Delon, Fermigier, Snoeijer & Andreotti, Relaxation of a dewetting contact line Part 2: Experiments (arXiv:0705.3583, J. Fluid Mech.), eq. (4.1)",
     "url": "https://arxiv.org/pdf/0705.3583"
    }
   ],
   "notes": "Quote: 'the liquid rises above the bath up to a height zcl ... according to the classical relation (Landau & Lifschitz 1959), zcl = lγ sqrt(2(1 − sin θ)), where θ is the equilibrium contact angle (receding or advancing). This relation implies that a perfectly wetting liquid can achieve a maximum rise of √2 times the capillary length lγ.' Derived with l_c = sqrt(σ/ρg) = 2.73 mm: θ = 0° gives 3.86 mm; 20° gives 3.13 mm (value_si); 50° gives 1.86 mm; 87.4° (polystyrene) gives 0.12 mm; 102.1° (polypropylene) gives a 0.57 mm depression. The contact angle of water on household glass is not sourced here (estimate 0-50°).",
   "who_when": "Delon et al. (Landau & Lifshitz 1959)"
  },
  {
   "key": "ripple_plastic_contact_angles",
   "category": "ripple",
   "label": "Water contact angle on common cup plastics",
   "status": "reported",
   "display": "Polypropylene 102°, polystyrene 87°, polycarbonate 82°",
   "value_si": null,
   "unit_si": "deg",
   "sources": [
    {
     "title": "Diversified Enterprises (Accu Dyne Test), Critical Surface Tension and Contact Angle with Water for Various Polymers",
     "url": "https://www.accudynetest.com/polytable_03_print.html"
    }
   ],
   "notes": "Table rows: 'Polypropylene (PP) | 30.5 | 102.1'; 'Polystyrene (PS) | 9003-53-6 | 34 | 87.4'; 'Polycarbonate (PC) | 24936-68-3 | 44 | 82' (critical surface tension mN/m, water contact angle degrees). Vendor compilation of literature values: secondary, hence 'reported'. Relevance: angles near 90° give almost no meniscus and so weak ring (edge) waves under up-and-down shaking. Side-to-side wall-driven ripples still form.",
   "who_when": "Diversified Enterprises, compilation (accessed 2026)"
  },
  {
   "key": "ripple_visual_acuity_1arcmin",
   "category": "ripple",
   "label": "Normal visual acuity: minimum angle of resolution",
   "status": "verified",
   "display": "1 minute of arc (6/6, 20/20)",
   "value_si": 0.000291,
   "unit_si": "rad",
   "sources": [
    {
     "title": "Kalloniatis & Luu, Visual Acuity, Webvision (University of Utah)",
     "url": "https://webvision.med.utah.edu/book/part-viii-psychophysics-of-vision/visual-acuity/"
    }
   ],
   "notes": "Quote: 'For a visual acuity of 6/6 (20/20), one of the strokes of the letter subtends one minute of arc at the eye. Therefore, the minimum angle of resolution (MAR) is one minute of arc and the logMAR is 0'. 1 arcmin = 2.91e-4 rad. Used as the best-case limit for seeing a reflected image shift or blur. A surface tilt s turns a reflected ray by 2s, so the threshold slope is 0.5 arcmin. Hyperacuity tasks (vernier) can do better on static targets; casual noticing needs much more (see ripple_threshold_noticeable).",
   "who_when": "Kalloniatis & Luu, Webvision"
  },
  {
   "key": "ripple_eye_temporal_resolution",
   "category": "ripple",
   "label": "Eye's flicker sensitivity (bears on 10-40 Hz ripples)",
   "status": "verified",
   "display": "Most sensitive at 15–20 Hz in bright light; cut-off ≈60 Hz (bright), ≈15 Hz (dim)",
   "value_si": 60,
   "low_si": 15,
   "high_si": 60,
   "unit_si": "Hz",
   "sources": [
    {
     "title": "Kalloniatis & Luu, Temporal Resolution, Webvision (University of Utah)",
     "url": "https://webvision.med.utah.edu/book/part-viii-psychophysics-of-vision/temporal-resolution/"
    }
   ],
   "notes": "Quote: 'The eye appears to be most sensitive to a frequency of 15 to 20 Hz at high luminances (photopic vision). At photopic light levels, less than 1% contrast is required to detect the stimulus and the high temporal frequency cut off is close to 60 Hz. At low light levels the maximum contrast is about 20% and the high temporal frequency cut off is approximately 15 Hz.' Implication: in daylight, 10-40 Hz ripple flicker is visible. In dim light (the film's night scene) it fuses, and what you see is the time-averaged ring pattern, which is exactly what long-exposure slope imaging records.",
   "who_when": "Kalloniatis & Luu, Webvision"
  },
  {
   "key": "ripple_threshold_ideal_eye",
   "category": "ripple",
   "label": "Water-glass ripples: best-case visibility threshold (1-arcmin reflected-light criterion)",
   "status": "derived",
   "display": "≈0.02 mm/s PPV (0.01–0.04 mm/s at 10–40 Hz); ripples only 0.2–0.6 µm high",
   "value_si": 0.00002,
   "low_si": 0.00001,
   "high_si": 0.00004,
   "unit_si": "m/s",
   "sources": [
    {
     "title": "Webvision: Visual Acuity (1 arcmin)",
     "url": "https://webvision.med.utah.edu/book/part-viii-psychophysics-of-vision/visual-acuity/"
    },
    {
     "title": "Karjanto (2010) wavemaker transfer function",
     "url": "https://arxiv.org/pdf/1704.08416"
    },
    {
     "title": "Wilson et al. (2022) dispersion relation",
     "url": "https://par.nsf.gov/servlets/purl/10391457"
    },
    {
     "title": "Delon et al. meniscus height",
     "url": "https://arxiv.org/pdf/0705.3583"
    },
    {
     "title": "IAPWS surface tension",
     "url": "https://iapws.org/technical-guidance/release/Surf-H2O.download"
    }
   ],
   "notes": "Assumption: a ripple is just visible when it turns a reflected image by 1 arcmin, the acuity limit; surface slope s = 0.5 arcmin = 1.45e-4 rad, so wave amplitude a = s/k. Side-to-side mechanism: wall displacement X = a/r with r = 2 (deep-water theory) to 1, so PPV = 2πf·X. Up-and-down (meniscus) mechanism, order-of-magnitude model: quasi-static meniscus height change δz = (A/2g)·z_m, emitted with source factor η = 1/sqrt(1 + (k·l_c)²) (my Fourier estimate for an exponential meniscus of width l_c), so PPV = a·2g/(z_m·η·2πf). Glass meniscus z_m = 3.13 mm (θ = 20°) to 1.86 mm (θ = 50°). The page threshold is the lower of the two (the glass responds to whichever component is stronger). The best-case threshold is about 0.02 mm/s, below any vibration a person feels. Error: the factor depends on lighting and viewer; it needs a sharp reflected edge or light and close, attentive viewing. Script: scratchpad/research/ripple_scripts/final.py.",
   "who_when": "This research, 2026",
   "values_json": "{\"10 Hz\":{\"wave_amp_um\":0.55,\"side_to_side_PPV_mm_s\":\"0.017-0.035\",\"up_down_PPV_mm_s_glass\":\"0.068-0.11\",\"threshold_mm_s\":0.017},\"20 Hz\":{\"wave_amp_um\":0.28,\"side_to_side_PPV_mm_s\":\"0.017-0.035\",\"up_down_PPV_mm_s_glass\":\"0.024-0.040\",\"threshold_mm_s\":0.017},\"40 Hz\":{\"wave_amp_um\":0.16,\"side_to_side_PPV_mm_s\":\"0.020-0.040\",\"up_down_PPV_mm_s_glass\":\"0.011-0.018\",\"threshold_mm_s\":0.011}}"
  },
  {
   "key": "ripple_threshold_noticeable",
   "category": "ripple",
   "label": "Water-glass ripples: noticeable to an attentive viewer (10-arcmin criterion), per frequency",
   "status": "estimate",
   "display": "≈0.2 mm/s at 10 Hz, ≈0.2 mm/s at 20 Hz, ≈0.1 mm/s at 40 Hz (each within a factor of 2-3)",
   "value_si": 0.0002,
   "low_si": 0.0001,
   "high_si": 0.0004,
   "unit_si": "m/s",
   "sources": [
    {
     "title": "Webvision: Visual Acuity",
     "url": "https://webvision.med.utah.edu/book/part-viii-psychophysics-of-vision/visual-acuity/"
    },
    {
     "title": "Shao et al. (2021) Exp. Fluids 62:59 (consistency anchor)",
     "url": "https://par.nsf.gov/servlets/purl/10311610"
    },
    {
     "title": "Karjanto (2010) wavemaker theory",
     "url": "https://arxiv.org/pdf/1704.08416"
    },
    {
     "title": "Wilson et al. (2022) dispersion relation",
     "url": "https://par.nsf.gov/servlets/purl/10391457"
    }
   ],
   "notes": "Same model as ripple_threshold_ideal_eye, but visibility set at a reflected-image swing of 10 arcmin: ten times the acuity limit, a third of the Moon's width. The 10× factor is an assumption, a reasoned guess for 'you notice it without hunting for it'. Results (PPV of the strongest component at the table top): 10 Hz side-to-side 0.17-0.35, up-and-down 0.68-1.1, lower 0.17 mm/s. 20 Hz side-to-side 0.17-0.35, up-and-down 0.24-0.40, lower 0.17 mm/s. 40 Hz side-to-side 0.20-0.40, up-and-down 0.11-0.18, lower 0.11 mm/s. Ripple amplitude needed: 5.5, 2.8, 1.6 µm. Consistency check: Shao et al.'s clearly imaged rings at 7 mm/s (11.2 Hz) come out at 20-40 arcmin in this model, so a few mm/s gives obvious, film-like rings. Ignores: table and floor amplification, glass resonances (sharp edge-wave peaks every few Hz could lower it several-fold at those frequencies), contact-line pinning and hysteresis at sub-micron amplitudes (could raise it), and pulse vs steady shaking (a footstep is a short burst of a few cycles).",
   "who_when": "This research, 2026",
   "values_json": "{\"criterion\":\"reflected-image deflection 10 arcmin\",\"10 Hz\":{\"wave_amp_um\":5.5,\"side_to_side_mm_s\":\"0.17-0.35\",\"up_down_glass_mm_s\":\"0.68-1.1\",\"threshold_mm_s\":0.17},\"20 Hz\":{\"wave_amp_um\":2.8,\"side_to_side_mm_s\":\"0.17-0.35\",\"up_down_glass_mm_s\":\"0.24-0.40\",\"threshold_mm_s\":0.17},\"40 Hz\":{\"wave_amp_um\":1.6,\"side_to_side_mm_s\":\"0.20-0.40\",\"up_down_glass_mm_s\":\"0.11-0.18\",\"threshold_mm_s\":0.11},\"obvious_film_like_rings\":\"a few mm/s (Shao 2021 anchor: 7 mm/s at 11.2 Hz)\"}"
  },
  {
   "key": "ripple_threshold_recommended",
   "category": "ripple",
   "label": "Water glass visibly ripples (Jurassic Park test): value for the Walk tab",
   "status": "estimate",
   "display": "About 0.2 mm/s at the table (derived, not measured; range 0.02–1 mm/s)",
   "value_si": 0.0002,
   "low_si": 0.00002,
   "high_si": 0.001,
   "unit_si": "m/s",
   "sources": [
    {
     "title": "Webvision: Visual Acuity (eye limit)",
     "url": "https://webvision.med.utah.edu/book/part-viii-psychophysics-of-vision/visual-acuity/"
    },
    {
     "title": "Shao et al. (2021) Exp. Fluids 62:59 (ring waves from the meniscus; lab anchor)",
     "url": "https://par.nsf.gov/servlets/purl/10311610"
    },
    {
     "title": "Shao et al. (2021) J. Fluid Mech. 915 A19 (edge waves far below Faraday onset)",
     "url": "https://par.nsf.gov/servlets/purl/10311615"
    },
    {
     "title": "Karjanto (2010) wavemaker theory",
     "url": "https://arxiv.org/pdf/1704.08416"
    },
    {
     "title": "IAPWS R1-76(2014) surface tension",
     "url": "https://iapws.org/technical-guidance/release/Surf-H2O.download"
    }
   ],
   "notes": "Single frequency-independent value for 10-40 Hz: the model's frequency dependence (0.11-0.17 mm/s at the 10-arcmin criterion) is smaller than its uncertainty. Rounded to 0.2 mm/s. Likely error: a factor of 3 either way. The full plausible range runs from 0.02 mm/s (sharp-eyed viewer watching a crisp reflection) to about 1 mm/s (casual glance, plastic cup, dim light). Obvious concentric rings like the film's: a few mm/s. Apply to the PPV of the strongest single component at the glass. Assumes a table on a ground-floor slab that moves with the ground; no floor or table amplification. Status 'estimate' because the visibility criterion is assumed; all physical inputs are sourced.",
   "who_when": "This research, 2026"
  },
  {
   "key": "ripple_film_effect_production",
   "category": "ripple",
   "label": "How the Jurassic Park water-glass shot was made (context only)",
   "status": "reported",
   "display": "Practical effect: guitar string(s) driving the cup, plucked off-camera (Michael Lantieri)",
   "value_si": null,
   "unit_si": "",
   "sources": [
    {
     "title": "Koimoi (Heena Singh, 29 Oct 2024): Did you know the iconic water ripple scene in Jurassic Park was created with a guitar string?",
     "url": "https://www.koimoi.com/hollywood-news/did-you-know-the-iconic-water-ripple-scene-in-jurassic-park-was-created-with-a-guitar-string-heres-how-they-did-it/"
    },
    {
     "title": "Film Stories (Simon Brew, 27 Sep 2022): Jurassic Park: the simple genius behind its lowest tech, most effective effects shot",
     "url": "https://filmstories.co.uk/features/jurassic-park-the-simple-genius-behind-its-lowest-tech-most-effective-effects-shot/"
    }
   ],
   "notes": "Koimoi quotes Lantieri, without naming the interview: 'It was a tough thing to do ... finally, messing around with a guitar one night, I set a glass [on it] and started playing notes on a guitar and got to the right frequency, a right note, and it did exactly what I wanted it to do.' Film Stories (author's narration, no cited interview): the team 'ran guitar strings through' the car, and a crew member lying on the car's floor plucked them; no CGI. Other popular accounts say the string ran through the car floor or sat 'under the dashboard'; that detail was not verified, and the primary interviews (DVD or Blu-ray extras) were not fetched. Physics note: plucking a string touching the cup shakes it up and down, which matches the concentric edge-wave mechanism (ripple_edge_waves_below_faraday).",
   "who_when": "Lantieri (1993 production), as reported 2022-2024"
  }
 ],
 "model_recommendation": "Engine constant: RIPPLE_PPV = 2.0e-4 m/s (0.2 mm/s), with RIPPLE_PPV_LOW = 2e-5 and RIPPLE_PPV_HIGH = 1e-3 m/s for the uncertainty band. Use one value across 10–40 Hz: the model's frequency dependence is smaller than its error. Compare it with the predicted PPV of the strongest single component (as the vibration standards do; check the threshold topic's convention). The \"ripple radius\" is the distance where the walker's PPV falls to 0.2 mm/s. Report the band as the distances where PPV equals 1 mm/s and 0.02 mm/s.\n\nOptional frequency-dependent version (if the engin … [2,428 more characters on this line; the full prompt is in prompts/a8533bf080ddb5648.txt]
 "gaps": "No measured naked-eye threshold for visible ripples in a glass at footstep frequencies was found. Sources searched:\n- Physics-education journals: none on the scene.\n- Leicester Physics Special Topics: its search returns no results.\n- Seismoscope and Mercalli sources: qualitative only.\n- Liquid-mirror telescope papers: ripples from vibration described, no threshold.\n- Vibration-standard tables: no liquid-surface criterion.\n- Smartphone or phyphox experiments: none found.\n- The Clemson PDF of Shao et al. 2021 JFM returned 503; the NSF PAR copy was used instead.\n- APS DFD abstra … [1,865 more characters on this line; the full prompt is in prompts/a8533bf080ddb5648.txt]
}
```

</details>

**Subagent `verify:thresholds`** · rex-presence-research · started 2026-10-11 18:37:20 UTC

- checks: 46 (39 ok, 7 not ok).
- Not OK: thr_ri8507_duration_dependence_table15; thr_iso2631_1989_building_criteria; thr_rattle_mmi4_accel_at_footstep_frequency (+4 more).
- The quoted numbers are accurate, but three recommended page values need fixing before they are used: - Footing: "probably cautious" is unsupported. - Rattle: it should be labelled an estimate, and its ordering conflicts with the sources.

<details>
<summary>Prompt, verbatim (108,550 characters)</summary>

Workflow run `wf_83090d59-a30`, phase `Verify`, agent `ae00483018eeaa074`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/ae00483018eeaa074.txt](prompts/ae00483018eeaa074.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

You are a skeptical fact-checker for the topic "thresholds". Below are the researcher's facts and model recommendation. Re-fetch the cited URLs for every fact the page is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, unit conversion, quotation and status against what the source actually says; recompute every derived number with your own script. Mark ok=false with a correction for anything wrong, mislabelled (a secondary summary presented as the primary paper, an estimate or a fan source marked verified, a sample maximum called a limit, the wrong units or wrong peak/RMS basis), or unsupported. Judge the model recommendation: wrong physics, wrong formula, constants used outside the range they were fitted to, overstated certainty? List important missing items.

RESEARCH:
{
 "summary": "Research topic \"thresholds\" (vibration levels at which people feel it, things rattle, cosmetic damage starts, and people lose their footing), for the Walk tab. 46 facts. I fetched and read every primary table myself, apart from the paywalled standards:\n- Caltrans (2020): Tables 4-7, 13, 19-22, plus its appended 2004 Technical Advisory reproducing Whiffin & Leonard (1971) LR 418.\n- FTA (2018): Report 0123, via the ROSA P copy, because transit.dot.gov returned 403.\n- BS 5228-2:2009 Annex B: a licensed copy posted by a county council. It reproduces BS 7385-2 Table 1. The A1:2014 … [2,492 more characters on this line; the full prompt is in prompts/ae00483018eeaa074.txt]
 "model_recommendation": "1) THRESHOLDS FOR VIB.TH (m/s, compared with the engine's free-field ground PPV from ppvAt):\n- feel = 0.3e-3 (keep the placeholder). Set by BS 5228-2 Table B.1, \"might be just perceptible in residential environments\", for construction vibration (about 8-80 Hz) felt indoors.\n  - Show the range 0.14e-3 (most sensitive, BS 5228-2) to 1.0e-3 (Caltrans Table 20: barely perceptible for a single isolated transient).\n  - Use 0.3e-3 for a walk past, which is a train of steps.\n  - For one isolated step, the page may say \"the most sensitive notice from about 0.3 mm/s; mos … [5,168 more characters on this line; the full prompt is in prompts/ae00483018eeaa074.txt]
 "gaps": "What I could not find or verify, and what the page should say instead:\n- **Rattling:** I found no standard, agency guide or measurement giving a ground-vibration PPV at which windows, crockery or ornaments rattle. Caltrans, FTA and USBM say only that rattling happens at or below the level people feel. The number offered here (about 1 mm/s, 0.3-3) is my conversion of earthquake intensity IV acceleration to footstep frequencies. The page must label it an estimate and say no standard sets it.\n- **Losing footing:** no standard covers footing loss from ground vibration, and nothing cove … [2,721 more characters on this line; the full prompt is in prompts/ae00483018eeaa074.txt]
 "facts": [
  {
   "key": "thr_bs5228_2_table_b1_effects",
   "category": "thresholds",
   "label": "BS 5228-2 Table B.1: effects of vibration levels on people (construction vibration, PPV)",
   "status": "verified",
   "value_si": 0.0003,
   "unit_si": "m/s",
   "low_si": 0.00014,
   "high_si": 0.01,
   "display": "0.14 mm/s just perceptible (most sensitive); 0.3 mm/s just perceptible in homes; 1.0 mm/s likely complaint; 10 mm/s intolerable beyond a very brief exposure",
   "values_json": "{\"units\": \"PPV, mm/s\", \"0.14\": \"Vibration might be just perceptible in the most sensitive situations for most vibration frequencies associated with construction. At lower frequencies, people are less sensitive to vibration.\", \"0.3\": \"Vibration might be just perceptible in residential environments.\", \"1.0\": \"It is likely that vibration of this level in residential environments will cause complaint, but can be tolerated if prior warning and explanation has been given to residents.\", \"10\": \"Vibration is likely to be intolerable for any more than a very brief exposure to this level (A1:2014 adds: in most building environments).\", \"footnote_A_2014\": \"The magnitudes of the values presented apply to a measurement position that is representative of the point of entry into the recipient.\", \"footnote_C_2014\": \"Single or infrequent occurrences of these levels do not necessarily correspond to the stated effect in every case.\"}",
   "sources": [
    {
     "title": "BS 5228-2:2009 Code of practice for noise and vibration control on construction and open sites, Part 2: Vibration (licensed copy posted by Nottinghamshire County Council), Annex B",
     "url": "https://www.nottinghamshire.gov.uk/media/110052/british-standard-bs5228-2009.pdf"
    },
    {
     "title": "MetroLink EIAR Vol. 5 Appendix A14.1 'Relevant guidance and standards' (Jacobs IDOM), hosted by An Bord Pleanala (Irish planning board); reproduces BS 5228-2:2009+A1:2014, BS 7385-2, DIN 4150-3:2016, HS2 tables",
     "url": "https://www.pleanala.ie/publicaccess/EIAR-NIS/314724/5_EIAR/Volume%205%20Appendices/Chapter%2014%20Ground-borne%20Noise%20and%20Vibration/A14.1%20Relevant%20guidance%20and%20standards.pdf"
    }
   ],
   "notes": "BS 5228-2:2009 Annex B, Table B.1 'Guidance on effects of vibration levels' (p. 36 of the standard). Rows quoted in values_json. The A1:2014 amendment (seen only as reproduced in the An Bord Pleanala appendix, Table 14.12) keeps the four values and adds footnotes A-C: values apply at 'the point of entry into the recipient'; 'A transfer function ... needs to be applied if only external measurements are available'; 'Single or infrequent occurrences of these levels do not necessarily correspond to the stated effect in every case.' Frequency: written for 'most vibration frequencies associated with construction'; 'At lower frequencies, people are less sensitive'. Duration: not stated for each row; the 10 mm/s row refers to exposure time. value_si is the 0.3 mm/s residential row.",
   "who_when": "BSI 2008 (BS 5228-2:2009, amended A1:2014)"
  },
  {
   "key": "thr_bs5228_2_perception_range",
   "category": "thresholds",
   "label": "BS 5228-2 B.2: human threshold of perception, PPV",
   "status": "verified",
   "value_si": 0.0003,
   "unit_si": "m/s",
   "low_si": 0.00014,
   "high_si": 0.0003,
   "display": "Threshold of perception typically 0.14-0.3 mm/s PPV",
   "sources": [
    {
     "title": "BS 5228-2:2009 Code of practice for noise and vibration control on construction and open sites, Part 2: Vibration (licensed copy posted by Nottinghamshire County Council), Annex B",
     "url": "https://www.nottinghamshire.gov.uk/media/110052/british-standard-bs5228-2009.pdf"
    }
   ],
   "notes": "BS 5228-2:2009 clause B.2 (p. 35): 'Human beings are known to be very sensitive to vibration, the threshold of perception being typically in the PPV range of 0.14 mm/s to 0.3 mm/s. Vibrations above these values can disturb, startle, cause annoyance or interfere with work activities.' Also: 'generally, vertical vibrations are more perceptible than horizontal vibrations, although at very low frequencies this tendency is reversed.' and 'Loose fittings are prone to rattle and movement.' Context is people in buildings exposed to construction vibration.",
   "who_when": "BSI 2008"
  },
  {
   "key": "thr_caltrans2020_table20_human_transient_continuous",
   "category": "thresholds",
   "label": "Caltrans 2020 Table 20: human response to vibration, transient vs continuous (PPV)",
   "status": "verified",
   "value_si": 0.001016,
   "unit_si": "m/s",
   "low_si": 0.000254,
   "high_si": 0.001016,
   "display": "Barely perceptible: 0.04 in/s (1.0 mm/s) transient, 0.01 in/s (0.25 mm/s) continuous; distinctly 0.25/0.04 in/s; strongly 0.9/0.10 in/s; severe 2.0/0.4 in/s",
   "values_json": "{\"units\": \"max PPV, in/s (mm/s)\", \"Barely perceptible\": {\"transient\": \"0.04 (1.0)\", \"continuous_or_frequent_intermittent\": \"0.01 (0.25)\"}, \"Distinctly perceptible\": {\"transient\": \"0.25 (6.4)\", \"continuous_or_frequent_intermittent\": \"0.04 (1.0)\"}, \"Strongly perceptible\": {\"transient\": \"0.9 (22.9)\", \"continuous_or_frequent_intermittent\": \"0.10 (2.5)\"}, \"Severe\": {\"transient\": \"2.0 (50.8)\", \"continuous_or_frequent_intermittent\": \"0.4 (10.2)\"}}",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "notes": "Caltrans 2020, Table 20 'Guideline Vibration Annoyance Potential Criteria' (manual p. 38, PDF p. 62). Note under the table: 'Transient sources create a single isolated vibration event, such as blasting or drop balls. Continuous/frequent intermittent sources include impact pile drivers, pogo-stick compactors, crack-and-seat equipment, vibratory pile drivers, and vibratory compaction equipment.' Caltrans calls it 'a synthesis of criteria' from its Chapter 6 (Reiher 1931, Whiffen 1971, Wiss 1974, ISO 2631). Caltrans states it is 'not an official policy, standard, specification, or regulation'. No frequency range given for Table 20; Caltrans elsewhere assumes 10-30 Hz for construction and traffic sources. value_si = barely perceptible, transient (1.016 mm/s); low_si = barely perceptible, continuous (0.254 mm/s). mm/s = in/s x 25.4.",
   "who_when": "Caltrans 2020 (Andrews, Buehler, Gill, Bender)"
  },
  {
   "key": "thr_caltrans2020_source_classes",
   "category": "thresholds",
   "label": "Caltrans 2020: which sources count as transient and which as continuous",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "Transient = a single isolated event (blasting, drop balls); continuous/frequent intermittent = repeated impacts or vibratory plant (impact pile drivers, compactors)",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "notes": "Caltrans 2020 section 7.3 (p. 37): 'it is apparent that damage thresholds for continuous sources are less than those for single-event or transient sources ... many types of construction activities fall between a single event and a continuous source. An impact pile driver, for example, continuously generates single transient events. As a practical matter ... the criteria can only be reasonably separated into two categories: continuous and transient.' And: 'This synthesis of criteria essentially assumes that the threshold for continuous sources is about half of the threshold for transient sources.' Relevance: a single stomp is like a drop ball (transient); a walk past is a train of impacts, closer to an impact pile driver (continuous/frequent intermittent). That mapping is my reading, not Caltrans's.",
   "who_when": "Caltrans 2020"
  },
  {
   "key": "thr_whiffin_leonard_1971_lr418_people",
   "category": "thresholds",
   "label": "Whiffin & Leonard (1971) TRRL LR 418: human reaction to continuous (traffic) vibration, PPV",
   "status": "verified",
   "value_si": 0.0003,
   "unit_si": "m/s",
   "low_si": 0.00015,
   "high_si": 0.0003,
   "display": "Threshold of perception 0.15-0.30 mm/s (0.006-0.019 in/s); readily perceptible 2.0 mm/s; begins to annoy 2.5 mm/s; annoying 5 mm/s; unpleasant 10-15 mm/s",
   "values_json": "{\"units\": \"PPV vertical, mm/s (in/s)\", \"0.15-0.30 (0.006-0.019)\": \"Threshold of perception; possibility of intrusion\", \"2.0 (0.08)\": \"Vibrations readily perceptible\", \"2.5 (0.10)\": \"Amplitude at which continuous vibrations begin to annoy people\", \"5.0 (0.20)\": \"Vibrations annoying to people in buildings\", \"10-15 (0.4-0.6)\": \"Vibrations considered unpleasant by people subjected to continuous vibrations and unacceptable to some people walking on bridges\"}",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "notes": "As reproduced in Caltrans Technical Advisory TAV-04-01-R0201 (R. Hendriks, 23 January 2004), Table 2 'Reaction of People and Damage to Buildings at Various Continuous Vibration Amplitudes', printed in the appendix of Caltrans 2020 (PDF p. 143), citing 'A Survey of Traffic-induced Vibrations by Whiffen and Leonard, Transport and Road Research Laboratory, RRL Report LR418, Crowthorne, 1971'. Footnote: 'The vibration amplitudes are based on peak particle velocity in the vertical direction. Where human reactions are concerned, the value is at the point at which the person is situated. For buildings, the value refers to the ground motion.' Note the mm/s and in/s columns do not match exactly (0.006-0.019 in/s is 0.15-0.48 mm/s); I keep the mm/s column. Continuous traffic vibration; no frequency range given. The original LR 418 was not opened.",
   "who_when": "Whiffin & Leonard 1971, via Caltrans TAV-04-01-R0201 (Hendriks 2004) in Caltrans 2020"
  },
  {
   "key": "thr_wiss1974_transient_people",
   "category": "thresholds",
   "label": "Wiss (1974): human response to transient vibration, PPV",
   "status": "verified",
   "value_si": 0.000889,
   "unit_si": "m/s",
   "low_si": 0.000889,
   "high_si": 0.0508,
   "display": "Barely perceptible 0.035 in/s (0.9 mm/s); distinctly 0.24 in/s (6.1 mm/s); strongly 0.9 in/s (22.9 mm/s); severe 2.0 in/s (50.8 mm/s)",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "notes": "As reproduced in Caltrans 2020 Table 6 'Human Response to Transient Vibration' (p. 22): 2.0 Severe; 0.9 Strongly perceptible; 0.24 Distinctly perceptible; 0.035 Barely perceptible (in/s). Caltrans: 'The results in Tables 4-6 suggest that the thresholds for perception and annoyance are higher for transient vibration than for continuous vibration.' For comparison Caltrans Table 4 (Reiher 1931, steady state): slightly perceptible 0.012 in/s (0.30 mm/s), distinctly 0.035 (0.89), strongly 0.10 (2.5). Original papers not opened.",
   "who_when": "Wiss 1974; Reiher 1931 (via Caltrans 2020)"
  },
  {
   "key": "thr_ri8507_duration_dependence_table15",
   "category": "thresholds",
   "label": "Human perception rises steeply as the event gets shorter (USBM RI 8507 Table 15)",
   "status": "verified",
   "value_si": 0.003302,
   "unit_si": "m/s",
   "low_si": 0.0002794,
   "high_si": 0.003302,
   "display": "Barely perceptible (mean): 0.130 in/s (3.3 mm/s) for a 0.5 s event, 0.095 (2.4) at 1 s, 0.033 (0.84) at 5 s, 0.020 (0.51) at 300 s; most-sensitive threshold 0.011 in/s (0.28 mm/s)",
   "values_json": "{\"units\": \"PPV in/s (mm/s); duration s\", \"barely_perceptible\": {\"mean_0.5s\": \"0.130 (3.3) W&P\", \"mean_1s\": \"0.095 (2.4) W&P\", \"mean_5s\": \"0.033 (0.84) W&P\", \"mean_300s\": \"0.020 (0.51) R&M\", \"threshold_5s\": \"0.011 (0.28) W&P\", \"threshold_300s\": \"0.011 (0.28) R&M\"}, \"distinctly_perceptible\": {\"mean_0.5s\": \"0.700 (17.8)\", \"mean_1s\": \"0.500 (12.7)\", \"mean_5s\": \"0.280 (7.1)\", \"mean_300s\": \"0.060 (1.5)\", \"threshold_0.5s\": \"0.300 (7.6)\", \"threshold_1s\": \"0.230 (5.8)\", \"threshold_5s\": \"0.100 (2.5)\", \"threshold_300s\": \"0.033 (0.84)\"}, \"strongly_perceptible\": {\"mean_0.5s\": \"1.400 (35.6)\", \"mean_1s\": \"1.150 (29.2)\", \"mean_5s\": \"0.630 (16.0)\", \"mean_300s\": \"0.170 (4.3) at 9 Hz\", \"threshold_0.5s\": \"0.910 (23.1)\", \"threshold_1s\": \"0.810 (20.6)\", \"threshold_5s\": \"0.390 (9.9)\", \"threshold_300s\": \"0.102 (2.6)\"}, \"severe\": {\"mean_300s\": \"0.550 (14.0) at 9 Hz\", \"threshold_5s\": \"1.13 (28.7)\", \"threshold_300s\": \"0.301 (7.6)\"}, \"acceptable_Murray\": \"<= 0.415 tau^1.29 in/s for durations 0.2-4 s\", \"sources\": \"W&P = Wiss and Parmelee (1974); R&M = Reiher and Meister (1931)\"}",
   "sources": [
    {
     "title": "Siskind, Stagg, Kopp & Dowding (1980) US Bureau of Mines Report of Investigations 8507, Structure Response and Damage Produced by Ground Vibration from Surface Mine Blasting (Pennsylvania DEP copy; scanned, read by OCR and page images)",
     "url": "https://files.dep.state.pa.us/Mining/BureauOfMiningPrograms/BMPPortalFiles/Blasting_Research_Papers/1980%20Siskind%20RI%208507%20Structure%20Response%20and%20Damage%20Produced%20by%20Ground%20Vibration%20from%20Surface%20Mine%20Blasting%20(No.%2018).pdf"
    }
   ],
   "notes": "RI 8507 Table 15 'Subjective responses of humans to vibrations of various durations' (report p. 67, PDF p. 71), read from a 300 dpi page image; all digits checked by eye. Text (p. 65): 'In cases where distinctly perceptible applies (i.e., infrequent and short-duration events), these results suggest that levels of over 0.5 in/sec could be tolerated. The barely perceptible levels are still below 0.1 in/sec ... The studies just discussed all involve people in a test situation rather than in their own homes. None of the problems of damage fear, startle, house rattle, and other secondary effects were present. Undoubtedly, the addition of such effects lowers the thresholds at which people react.' Earlier (p. 62): Reiher and Meister's 'slightly perceptible' 0.010-0.033 in/s and 'strongly perceptible' 0.10 in/s were 'essentially independent of frequency over the range 4 to 25 Hz'. Relevance: a single footstep is a short event, so the mean barely-perceptible level for 0.5-1 s events (2.4-3.3 mm/s) is far above the 0.3 mm/s quoted for continuous vibration, but the most sensitive people still notice about 0.28 mm/s.",
   "who_when": "Siskind et al. 1980, citing Wiss & Parmelee 1974 and Reiher & Meister 1931"
  },
  {
   "key": "thr_iso2631_1989_building_criteria",
   "category": "thresholds",
   "label": "ISO 2631 (1989) building vibration criteria (8-80 Hz), rms velocity",
   "status": "verified",
   "value_si": 0.0002032,
   "unit_si": "m/s",
   "low_si": 0.0001016,
   "high_si": 0.0008128,
   "display": "Residence 78 VdB day / 75 night = 0.008 in/s rms (0.20 mm/s rms); operating room 72 VdB = 0.004 in/s rms (0.10 mm/s rms); office 0.016 in/s; workshop 0.032 in/s",
   "values_json": "{\"units\": \"rms velocity in/s (mm/s); VdB re 1 micro-in/s\", \"Workshop\": \"90 VdB, 0.032 (0.81)\", \"Office\": \"84 VdB, 0.016 (0.41)\", \"Residence\": \"78 VdB day / 75 night, 0.008 (0.20)\", \"Hospital operating room\": \"72 VdB, 0.004 (0.10)\"}",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "notes": "As reproduced in Caltrans 2020 Table 7 'ISO 2631 Vibration Criteria' (p. 22). Caltrans: ISO 2631 'suggested that humans are sensitive to particle velocity in the range of 8-80 Hz ... Below 8 Hz, the body is less sensitive to vibration, and therefore responds more uniformly to acceleration (i.e., higher velocities are needed to elicit the same response). Table 7 summarizes the vibration criteria in ISO 2631 for vibration sources with predominant frequencies in the range of 8-80 Hz.' These are rms values, not PPV; for a sine wave PPV = 1.41 x rms, for impulsive signals much more (see thr_fta2018_crest_factor). The ISO standard itself (paywalled) was not opened. The 2003 revision of ISO 2631-2 is reported to contain no limit values (thr_iso2631_2_2003_no_limits).",
   "who_when": "ISO 2631-2:1989 via Caltrans 2020"
  },
  {
   "key": "thr_iso2631_2_2003_no_limits",
   "category": "thresholds",
   "label": "ISO 2631-2: 1989 edition limits in PPV terms, and the 2003 edition's lack of limits",
   "status": "reported",
   "value_si": 0.0003,
   "unit_si": "m/s",
   "low_si": 0.00014,
   "high_si": 0.01,
   "display": "1989 edition: about 0.3 mm/s PPV for continuous vibration by day, 0.14 mm/s at night, 5-10 mm/s for transient events; 2003 edition has no vibration limits",
   "sources": [
    {
     "title": "Watercare Services (Auckland) evidence, P. Millar, Appendix B 'Review of vibration standards' (reproduces DIN 4150-3:1999 Table 1)",
     "url": "https://assets.watercare.co.nz/media/peter_millar_appendix_b_9d042ff732.pdf"
    }
   ],
   "notes": "Expert evidence for Watercare (Auckland), Appendix B para 1-2: 'The 1989 Standard recommends a ppV limit of about 0.3 mm/s for continuous vibrations during the day, which is at perception levels, while a ppV limit of 5-10 mm/s is recommended for transient (short time frame) events. A considerably lower limit of 0.14 mm/s is recommended at night.' and 'superseded in 2003 by an informative standard which contains no vibration limits'. Secondary source (a consultant's evidence), hence 'reported'. Consistent with FTA 2018 (p. 118): the 2003 ISO 2631-2 'acknowledges that human response to vibration in buildings is very complex' and 'the degree of annoyance cannot always be explained by the magnitude of the vibration alone'. ISO text not opened (paywalled).",
   "who_when": "P. Millar for Watercare (undated evidence, c. 2010s)"
  },
  {
   "key": "thr_iso_base_curve_link_to_bs5228",
   "category": "thresholds",
   "label": "Why BS 5228-2 says 0.14 mm/s: the ISO 2631 base curve as a peak (my inference)",
   "status": "derived",
   "value_si": 0.0001414,
   "unit_si": "m/s",
   "display": "ISO base curve 0.10 mm/s rms x 1.41 = 0.14 mm/s peak; residence x2-4 = 0.28-0.57 mm/s peak",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    },
    {
     "title": "BS 5228-2:2009 Code of practice for noise and vibration control on construction and open sites, Part 2: Vibration (licensed copy posted by Nottinghamshire County Council), Annex B",
     "url": "https://www.nottinghamshire.gov.uk/media/110052/british-standard-bs5228-2009.pdf"
    }
   ],
   "notes": "Inference, not stated by either source. Caltrans Table 7 gives the ISO 2631 operating-theatre criterion (the base curve) as 0.004 in/s rms = 0.10 mm/s rms. For a sine wave, peak = rms x sqrt(2) = 0.144 mm/s, which matches BS 5228-2's 'just perceptible in the most sensitive situations' 0.14 mm/s. The residential day criterion (0.008 in/s rms = 0.20 mm/s rms) gives 0.29 mm/s peak, matching BS 5228-2's residential 0.3 mm/s. This supports reading both BS numbers as the ISO base curve and its residential multiple, valid in the 8-80 Hz band.",
   "who_when": "Derived here from Caltrans 2020 Table 7 and BS 5228-2:2009"
  },
  {
   "key": "thr_fta2018_human_response_vdb",
   "category": "thresholds",
   "label": "FTA 2018: human response to ground-borne vibration in buildings (rms velocity level)",
   "status": "verified",
   "value_si": null,
   "unit_si": "dB re 1 micro-in/s (rms)",
   "display": "65 VdB approximate threshold of perception (about 0.045 mm/s rms, about 0.2 mm/s PPV); 75 VdB barely-to-distinctly perceptible boundary; 85 VdB tolerable only if infrequent; 100 VdB damage threshold for typical buildings",
   "values_json": "{\"units\": \"VdB re 1e-6 in/s rms; mm/s rms; PPV via crest factor 4-5 (derived)\", \"50 VdB\": \"typical background in residential areas (0.008 mm/s rms)\", \"65 VdB\": \"Approximate threshold of perception for many humans (0.045 mm/s rms; PPV about 0.18-0.23 mm/s)\", \"75 VdB\": \"Approximate dividing line between barely perceptible and distinctly perceptible. Many people find transit vibration at this level annoying (0.14 mm/s rms; PPV about 0.57-0.71)\", \"85 VdB\": \"Vibration tolerable only if there are an infrequent number of events per day (0.45 mm/s rms; PPV about 1.8-2.3)\", \"100 VdB\": \"threshold of potential damage for typical buildings (2.5 mm/s rms; PPV about 10-13)\"}",
   "sources": [
    {
     "title": "FTA (2018) Transit Noise and Vibration Impact Assessment Manual, FTA Report No. 0123 (Volpe Center), ROSA P copy of the official PDF",
     "url": "https://rosap.ntl.bts.gov/view/dot/37056/dot_37056_DS1.pdf"
    }
   ],
   "notes": "FTA 2018 section 5.1-5.5: 'The background vibration velocity level in residential areas is usually 50 VdB or lower, and the threshold of perception for humans is approximately 65 VdB. A vibration level of 85 VdB in a residence can result in strong annoyance.' (p. 113). Table 5-5 'Human Response to Different Levels of Ground-Borne Vibration and Noise' (p. 120) gives the 65/75/85 VdB rows quoted. 'A vibration level that causes annoyance is well below the damage risk threshold for typical buildings (100 VdB).' (p. 118). VdB = 20 log10(v_rms / 1e-6 in/s) (Eq. 5-1, p. 111). Conversions (mine): 65 VdB = 1.78e-3 in/s rms = 0.045 mm/s rms; PPV = crest factor x rms, with FTA's own crest factor of 4 (used for its Table 7-5) to 5 (trains). These criteria are for repeated transit events measured inside buildings; Table 6-2 defines frequent events as more than 70 per day, occasional 30-70, infrequent fewer than 30 (Caltrans 2020 Table 8's note misprints 'fewer than 70').",
   "who_when": "FTA 2018 (Quagliata, Ahearn, Boeker, Roof, Meister, Singleton)"
  },
  {
   "key": "thr_fta2018_crest_factor",
   "category": "thresholds",
   "label": "Crest factor: peak (PPV) to rms ratio of a vibration signal",
   "status": "verified",
   "value_si": 4,
   "unit_si": "1",
   "low_si": 1.41,
   "high_si": 8,
   "display": "Typically above 1.41; 4-5 for train vibration; 8 or more is not unusual for impulsive signals; FTA uses 4 to convert PPV limits to rms",
   "sources": [
    {
     "title": "FTA (2018) Transit Noise and Vibration Impact Assessment Manual, FTA Report No. 0123 (Volpe Center), ROSA P copy of the official PDF",
     "url": "https://rosap.ntl.bts.gov/view/dot/37056/dot_37056_DS1.pdf"
    }
   ],
   "notes": "FTA 2018 footnote viii (p. 111): 'The ratio of PPV to maximum rms amplitude is defined as the crest factor for the signal. The crest factor is typically greater than 1.41, although a crest factor of 8 or more is not unusual for impulsive signals. For ground-borne vibration from trains, the crest factor is usually 4 to 5.' Section 7.2 (p. 185): 'The approximate rms vibration velocity levels were calculated from the PPV limits using a crest factor of 4.' Also: rms 'is typically calculated over a one-second period' (p. 111). Relevance: a footstep is impulsive, so an rms-based perception criterion (ISO, FTA) corresponds to a higher PPV than for steady vibration.",
   "who_when": "FTA 2018"
  },
  {
   "key": "thr_fta2018_outdoors",
   "category": "thresholds",
   "label": "FTA 2018: ground vibration is felt differently outdoors",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "'Ground-borne vibration is almost never a problem outdoors' (no number)",
   "sources": [
    {
     "title": "FTA (2018) Transit Noise and Vibration Impact Assessment Manual, FTA Report No. 0123 (Volpe Center), ROSA P copy of the official PDF",
     "url": "https://rosap.ntl.bts.gov/view/dot/37056/dot_37056_DS1.pdf"
    }
   ],
   "notes": "FTA 2018 section 5.5 (p. 118): 'Ground-borne vibration is almost never a problem outdoors. Although the motion of the ground may be perceived, without the effects associated with the shaking of a building, the motion does not provoke the same adverse human reaction.' Also (p. 117): 'The effects of ground-borne vibration can include perceptible movement of floors in buildings, rattling of windows, shaking of items on shelves or hanging on walls, and low-frequency noise'. Relevance: the Walk tab's listener may stand outdoors; all the perception criteria here were set for people inside buildings.",
   "who_when": "FTA 2018"
  },
  {
   "key": "thr_bs6472_1_vdv_hs2",
   "category": "thresholds",
   "label": "BS 6472-1 vibration dose value (VDV) criteria as used by HS2 (homes)",
   "status": "verified",
   "value_si": 0.2,
   "unit_si": "m/s^1.75",
   "low_si": 0.1,
   "high_si": 0.8,
   "display": "Lowest observed adverse effect: VDV 0.2 m/s^1.75 by day, 0.1 at night; significant adverse effect: 0.8 by day, 0.4 at night",
   "sources": [
    {
     "title": "MetroLink EIAR Vol. 5 Appendix A14.1 'Relevant guidance and standards' (Jacobs IDOM), hosted by An Bord Pleanala (Irish planning board); reproduces BS 5228-2:2009+A1:2014, BS 7385-2, DIN 4150-3:2016, HS2 tables",
     "url": "https://www.pleanala.ie/publicaccess/EIAR-NIS/314724/5_EIAR/Volume%205%20Appendices/Chapter%2014%20Ground-borne%20Noise%20and%20Vibration/A14.1%20Relevant%20guidance%20and%20standards.pdf"
    }
   ],
   "notes": "As reproduced in An Bord Pleanala Appendix A14.1 Table 14.13, 'table from HS2 Information Paper E21, based on the VDV method of BS 6472-1:2008': LOAEL VDVday 0.2, VDVnight 0.1; SOAEL VDVday 0.8, VDVnight 0.4 m/s^1.75. VDV = (integral of frequency-weighted acceleration^4 dt)^(1/4) over the day or night, so it depends on how many steps and for how long; it does not convert to a single PPV. BS 5228-2 (B.2) chooses PPV instead for construction: 'for construction it is considered more appropriate to provide guidance in terms of the PPV'. BS 6472-1 itself (paywalled) not opened. Not recommended for the page beyond a mention.",
   "who_when": "HS2 Information Paper E21, based on BS 6472-1:2008 (via Jacobs IDOM EIAR)"
  },
  {
   "key": "thr_rattle_below_perception_caltrans",
   "category": "thresholds",
   "label": "Caltrans: rattling of dishes, windows and doors can happen below the level people feel",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "Rattling of a china cabinet 'can also occur, even when vibration levels are well below perception' (no number)",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "notes": "Caltrans 2020 Chapter 5 (p. 19): 'secondary effects, such as the rattling of a china cabinet, can also occur, even when vibration levels are well below perception.' Caltrans TA V-04-01 (appendix, PDF p. 143-144): 'Frequently, low amplitude traffic vibrations can cause irritating secondary vibrations, such as a slight rattling of doors, windows, stacked dishes, etc. These objects are often in a state of neutral equilibrium and readily respond to very low amplitudes of vibrations. The rattling sound gives rise to exaggerated vibration complaints, even though there is very little risk of damage.' Same TA (PDF p. 149): 'The threshold of perception, or roughly 0.25 mm/s (0.01 in/sec) may be considered annoying by those people. Low amplitude vibrations may also cause secondary vibrations and audible effects such as a slight rattling of doors, windows and dishes'. No source here gives a numeric rattling threshold.",
   "who_when": "Caltrans 2020; Caltrans TAV-04-01-R0201 (Hendriks 2004)"
  },
  {
   "key": "thr_rattle_ri8507_midwall",
   "category": "thresholds",
   "label": "USBM RI 8507: wall motion rattles windows and dishes; walls amplify ground motion",
   "status": "verified",
   "value_si": 4,
   "unit_si": "1",
   "low_si": 1.5,
   "high_si": 4,
   "display": "Midwall motion causes 'window sashes rattling, picture frames tilting, dishes jiggling, and knick-knacks falling'; typical amplification 1.5 (whole house, 4-12 Hz) and 4 (midwalls, 10-25 Hz) at resonance; below 1 above 40 Hz",
   "sources": [
    {
     "title": "Siskind, Stagg, Kopp & Dowding (1980) US Bureau of Mines Report of Investigations 8507, Structure Response and Damage Produced by Ground Vibration from Surface Mine Blasting (Pennsylvania DEP copy; scanned, read by OCR and page images)",
     "url": "https://files.dep.state.pa.us/Mining/BureauOfMiningPrograms/BMPPortalFiles/Blasting_Research_Papers/1980%20Siskind%20RI%208507%20Structure%20Response%20and%20Damage%20Produced%20by%20Ground%20Vibration%20from%20Surface%20Mine%20Blasting%20(No.%2018).pdf"
    }
   ],
   "notes": "RI 8507 abstract (p. 1): 'These vibrations produce not only structure resonances (4 to 12 Hz for whole structures and 10 to 25 Hz for midwalls) ... Structure response amplification factors were measured; typical values were 1.5 for structures as a whole (racking) and 4 for midwalls, at their respective resonance frequencies. For blast vibrations above 40 Hz, all amplification factors for frame residential structures were less than unity.' p. 18: 'Midwall motions (normal to the wall surface) were also measured and are primarily responsible for window sashes rattling, picture frames tilting, dishes jiggling, and knick-knacks falling.' p. 6: 'Many examples of continual complaints about severe rattling at levels below 0.5 in/sec [12.7 mm/s] are attributable to the low frequencies.' p. 62: human response is complicated by 'the many secondary effects of wall-produced window, dish, and bric-a-brac rattling. Persons inside buildings will hear and feel the predominantly 5- to 25-Hz structure midwall and midfloor response vibrations.' Abstract: 'The human response and annoyance problem from ground vibration is aggravated by wall rattling, secondary noises, and the presence of airblast.' No rattle threshold is given. value_si = midwall factor.",
   "who_when": "Siskind et al. 1980"
  },
  {
   "key": "thr_rattle_ems98",
   "category": "thresholds",
   "label": "EMS-98 intensity IV-V: china, glasses, windows and doors rattle",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "IV 'Largely observed': china, glasses, windows and doors rattle; V 'Strong': china and glasses clatter, small top-heavy objects may fall, liquids oscillate",
   "sources": [
    {
     "title": "Grunthal (ed.) (1998) European Macroseismic Scale 1998 (EMS-98), Cahiers du Centre Europeen de Geodynamique et de Seismologie vol. 15 (doi:10.2312/EMS-98); copy hosted by Masaryk University",
     "url": "https://sid.ipe.muni.cz/ems-98_eng.pdf"
    }
   ],
   "notes": "EMS-98 core scale (PDF p. 19): 'IV. Largely observed: a) The earthquake is felt indoors by many and felt outdoors only by very few. A few people are awakened. The level of vibration is not frightening ... b) China, glasses, windows and doors rattle. Hanging objects swing. Light furniture shakes visibly in a few cases. Woodwork creaks in a few cases. c) No damage.' 'V. Strong: ... b) Hanging objects swing considerably. China and glasses clatter together. Small, top-heavy and/or precariously supported objects may be shifted or fall down. Doors and windows swing open or shut. In a few cases window panes break. Liquids oscillate and may spill from well-filled containers.' 'III. Weak: ... Hanging objects swing slightly.' EMS-98 is a descriptive scale with no ground-motion values; for numbers see thr_wald1999_shakemap_intensity_table (California MMI, assumed roughly equal to EMS at these levels).",
   "who_when": "Grunthal (ed.) 1998"
  },
  {
   "key": "thr_usgs_mmi_abridged",
   "category": "thresholds",
   "label": "USGS abbreviated Modified Mercalli Intensity: II to VI",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "IV: 'Dishes, windows, doors disturbed; walls make cracking sound. Sensation like heavy truck striking building.' V: 'some dishes, windows broken. Unstable objects overturned.'",
   "sources": [
    {
     "title": "USGS, The Severity of an Earthquake (General Interest Publication), abbreviated Modified Mercalli Intensity scale",
     "url": "https://pubs.usgs.gov/gip/earthq4/severitygip.html"
    }
   ],
   "notes": "USGS 'The Severity of an Earthquake', abbreviated MMI (Wood & Neumann 1931): II 'Felt only by a few persons at rest, especially on upper floors of buildings. Delicately suspended objects may swing.' III 'Felt quite noticeably by persons indoors ... Vibration similar to the passing of a truck.' IV 'Felt indoors by many, outdoors by few during the day. At night, some awakened. Dishes, windows, doors disturbed; walls make cracking sound. Sensation like heavy truck striking building. Standing motor cars rocked noticeably.' V 'Felt by nearly everyone; many awakened. some dishes, windows broken. Unstable objects overturned.' VI 'Felt by all, many frightened. Some heavy furniture moved; a few instances of fallen plaster. Damage slight.' This abbreviated version has no 'difficult to stand' wording; EMS-98 and JMA do.",
   "who_when": "USGS (Wood & Neumann 1931 scale)"
  },
  {
   "key": "thr_jma_intensity_descriptions",
   "category": "thresholds",
   "label": "JMA seismic intensity scale: dishes rattle (3-4), walking hard (5 Upper), standing hard (6 Lower)",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "3: dishes in cupboards may rattle; 4: dishes rattle, unstable ornaments may fall; 5 Upper: walking difficult without holding on; 6 Lower: difficult to remain standing; 6 Upper: impossible to remain standing",
   "sources": [
    {
     "title": "Japan Meteorological Agency, Tables explaining the JMA Seismic Intensity Scale",
     "url": "https://www.jma.go.jp/jma/en/Activities/inttable.html"
    }
   ],
   "notes": "JMA table, human perception and indoor situation: '3 Felt by most people in buildings. Felt by some people walking ... Dishes in cupboards may rattle.' '4 Most people are startled ... dishes in cupboards rattle. Unstable ornaments may fall.' '5 Lower Many people are frightened and feel the need to hold onto something stable ... Many unstable ornaments fall.' '5 Upper Many people find it hard to move; walking is difficult without holding onto something stable.' '6 Lower It is difficult to remain standing.' '6 Upper It is impossible to remain standing or move without crawling. People may be thrown through the air.' The page gives no ground-motion values (JMA intensity is computed from filtered acceleration); no PGV is attached here.",
   "who_when": "Japan Meteorological Agency (current table)"
  },
  {
   "key": "thr_wald1999_shakemap_intensity_table",
   "category": "thresholds",
   "label": "Peak ground velocity and acceleration for each Modified Mercalli intensity (Wald et al. 1999, California)",
   "status": "verified",
   "value_si": 0.011,
   "unit_si": "m/s",
   "low_si": 0.011,
   "high_si": 0.034,
   "display": "MMI IV (dishes, windows rattle): PGV 1.1-3.4 cm/s (11-34 mm/s), PGA 1.4-3.9 %g; VI 8.1-16 cm/s; VII 16-31 cm/s; VIII 31-60 cm/s",
   "values_json": "{\"units\": \"PGV cm/s (mm/s); PGA %g (m/s^2)\", \"I Not felt\": {\"PGV\": \"<0.1 (<1)\", \"PGA\": \"<0.17 (<0.017)\", \"damage\": \"none\"}, \"II-III Weak\": {\"PGV\": \"0.1-1.1 (1-11)\", \"PGA\": \"0.17-1.4 (0.017-0.14)\", \"damage\": \"none\"}, \"IV Light\": {\"PGV\": \"1.1-3.4 (11-34)\", \"PGA\": \"1.4-3.9 (0.14-0.38)\", \"damage\": \"none\"}, \"V Moderate\": {\"PGV\": \"3.4-8.1 (34-81)\", \"PGA\": \"3.9-9.2 (0.38-0.90)\", \"damage\": \"very light\"}, \"VI Strong\": {\"PGV\": \"8.1-16 (81-160)\", \"PGA\": \"9.2-18 (0.90-1.8)\", \"damage\": \"light\"}, \"VII Very strong\": {\"PGV\": \"16-31 (160-310)\", \"PGA\": \"18-34 (1.8-3.3)\", \"damage\": \"moderate\"}, \"VIII Severe\": {\"PGV\": \"31-60 (310-600)\", \"PGA\": \"34-65 (3.3-6.4)\", \"damage\": \"moderate/heavy\"}, \"IX Violent\": {\"PGV\": \"60-116 (600-1160)\", \"PGA\": \"65-124 (6.4-12.2)\", \"damage\": \"heavy\"}, \"X+ Extreme\": {\"PGV\": \">116 (>1160)\", \"PGA\": \">124 (>12.2)\", \"damage\": \"very heavy\"}}",
   "sources": [
    {
     "title": "Wald et al., ShakeMap Manual, USGS Techniques and Methods 12-A1 (version 1.0, 2006), section 2.5 and Figure 2.5 (reproduces Wald, Quitoriano, Heaton & Kanamori 1999, Earthquake Spectra 15(3):557-564)",
     "url": "https://pubs.usgs.gov/tm/2005/12A01/pdf/508TM12-A1.pdf"
    }
   ],
   "notes": "USGS TM 12-A1, Figure 2.5 'ShakeMap Instrumental Intensity Scale Legend' (p. 56), read from a 300 dpi page image; reproduces the Wald et al. (1999) regressions. I reproduced each band edge from the manual's equations (rounding convention 'values between 5.50 and 6.49 round to intensity VI'): PGV edges from Imm = 2.10 log PGV + 3.40 below V and Imm = 3.47 log PGV + 2.35 from V up (PGV in cm/s); PGA edges below V from Imm = 2.20 log PGA + 1.00 (PGA in cm/s^2). The manual warns these are 'instrumental intensities ... not based on observations of the earthquake effects on people or structures'. Ground motions are free-field station records (largest horizontal component) from eight California earthquakes; durations are many seconds. The original paper (Earthquake Spectra 15(3):557-564, doi:10.1193/1.1586058) was not opened (paywalled). ShakeMap now uses Worden et al. (2012) instead, with different ranges; not fetched. value_si/low/high = MMI IV PGV band.",
   "who_when": "Wald, Quitoriano, Heaton & Kanamori 1999 (via USGS ShakeMap manual, Wald et al. 2006)"
  },
  {
   "key": "thr_wald1999_low_intensity_caveat",
   "category": "thresholds",
   "label": "Wald 1999: below intensity V the velocity values are imposed, not fitted, and low intensities follow acceleration",
   "status": "verified",
   "value_si": null,
   "unit_si": "m/s^2",
   "low_si": 0.01,
   "high_si": 0.02,
   "display": "Felt/not-felt boundary about 1-2 cm/s^2 peak acceleration; the low-intensity PGV relation was imposed to join it",
   "sources": [
    {
     "title": "Wald et al., ShakeMap Manual, USGS Techniques and Methods 12-A1 (version 1.0, 2006), section 2.5 and Figure 2.5 (reproduces Wald, Quitoriano, Heaton & Kanamori 1999, Earthquake Spectra 15(3):557-564)",
     "url": "https://pubs.usgs.gov/tm/2005/12A01/pdf/508TM12-A1.pdf"
    }
   ],
   "notes": "USGS TM 12-A1 p. 55: 'Because we are also interested in estimating intensity at lower values, and our current collection of data from historical earthquakes does not provide constraints for lower intensity, we have imposed the following relationship between PGA and Imm: Imm = 2.20 log (PGA) + 1.00 ... We determined that the boundary between not felt and felt (Imm I and II, respectively) regions corresponds to approximately 1 to 2 cm/s/s, at least for this range of magnitudes [M 3.5-5.0] ... The corresponding equation for PGV and Imm is: Imm = 2.10 log (PGV) + 3.40'. And: 'Using peak acceleration to estimate low intensities is intuitively consistent with the notion that lower (<VI) intensities are assigned based on felt accounts, and people are more sensitive to ground acceleration than velocity.' So the MMI IV velocity band (11-34 mm/s) is weakly constrained; its acceleration band (0.14-0.38 m/s^2) is the better guide.",
   "who_when": "Wald et al. 1999 via USGS TM 12-A1"
  },
  {
   "key": "thr_earthquake_frequency_vs_intensity",
   "category": "thresholds",
   "label": "Earthquake shaking that sets intensity is low in frequency (Sokolov 1998, via USGS)",
   "status": "verified",
   "value_si": null,
   "unit_si": "Hz",
   "display": "Intensity V-VII best matches 3-6 Hz shaking; the lowest intensities 7-8 Hz; above VIII 0.7-1.0 Hz. The Wald 1999 PGA/PGV bands imply about 1.7-2.7 Hz",
   "sources": [
    {
     "title": "Wald et al., ShakeMap Manual, USGS Techniques and Methods 12-A1 (version 1.0, 2006), section 2.5 and Figure 2.5 (reproduces Wald, Quitoriano, Heaton & Kanamori 1999, Earthquake Spectra 15(3):557-564)",
     "url": "https://pubs.usgs.gov/tm/2005/12A01/pdf/508TM12-A1.pdf"
    }
   ],
   "notes": "USGS TM 12-A1 p. 55: 'seismic intensities correlate well for rather narrow ranges of Fourier amplitude spectra of ground acceleration, with 0.7-1.0 Hz being most representative of Imm > VIII, whereas the 3-6 Hz range best represents Imm V to VII, and the 7-8 Hz range best correlates with the lowest Imm range.' Derived (mine): dividing each Wald band's PGA by 2 pi x its PGV gives an equivalent sine frequency of 2.0-2.7 Hz for II-III and 1.7-2.0 Hz for IV-VIII. Footstep vibration is expected to be higher in frequency and much shorter (one pulse per step); its dominant frequency should come from the attenuation research.",
   "who_when": "Sokolov 1998 via Wald et al. 2006"
  },
  {
   "key": "thr_rattle_mmi4_accel_at_footstep_frequency",
   "category": "thresholds",
   "label": "Rattling level converted to footstep frequencies via acceleration (my derivation)",
   "status": "derived",
   "value_si": 0.0011,
   "unit_si": "m/s",
   "low_si": 0.00073,
   "high_si": 0.0061,
   "display": "MMI IV acceleration (1.4-3.9 %g = 0.14-0.38 m/s^2) equals PPV 1.1-3.0 mm/s at 20 Hz, 2.2-6.1 mm/s at 10 Hz, 0.7-2.0 mm/s at 30 Hz",
   "sources": [
    {
     "title": "Wald et al., ShakeMap Manual, USGS Techniques and Methods 12-A1 (version 1.0, 2006), section 2.5 and Figure 2.5 (reproduces Wald, Quitoriano, Heaton & Kanamori 1999, Earthquake Spectra 15(3):557-564)",
     "url": "https://pubs.usgs.gov/tm/2005/12A01/pdf/508TM12-A1.pdf"
    },
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    },
    {
     "title": "BS 5228-2:2009 Code of practice for noise and vibration control on construction and open sites, Part 2: Vibration (licensed copy posted by Nottinghamshire County Council), Annex B",
     "url": "https://www.nottinghamshire.gov.uk/media/110052/british-standard-bs5228-2009.pdf"
    }
   ],
   "notes": "Formula: PPV = a / (2 pi f) for a sinusoid, with a = MMI IV PGA band (Wald 1999) and f the footstep vibration's dominant frequency. 0.137 m/s^2 / (2 pi x 20 Hz) = 1.09 mm/s; 0.383 / (2 pi x 20) = 3.04 mm/s. Rationale: Wald et al. say low intensities follow acceleration, and ISO 2631 (via Caltrans) says people respond to acceleration below 8 Hz but to velocity at 8-80 Hz, so neither PGV nor PGA transfers exactly; acceleration is the better fit for loose objects, which rattle when their supports accelerate. Check: the felt/not-felt boundary (0.17 %g = 0.017 m/s^2) gives 0.13 mm/s at 20 Hz, close to BS 5228-2's 'just perceptible in the most sensitive situations' 0.14 mm/s, which supports the method. Ignores: duration (earthquakes last seconds to minutes; a footstep is one short pulse), building resonance (midwalls amplify up to 4 times at 10-25 Hz, RI 8507), and the outdoor ground versus indoor floor difference. Treat as an estimate band, not a measured threshold.",
   "who_when": "Derived here from Wald et al. 1999 (via USGS 2006)"
  },
  {
   "key": "thr_one_g_vertical",
   "category": "thresholds",
   "label": "Ground velocity at which a vertical shake exceeds 1 g (loose objects hop) (my derivation)",
   "status": "derived",
   "value_si": 0.078,
   "unit_si": "m/s",
   "low_si": 0.039,
   "high_si": 0.156,
   "display": "PPV = g / (2 pi f): 156 mm/s at 10 Hz, 78 mm/s at 20 Hz, 52 mm/s at 30 Hz, 39 mm/s at 40 Hz",
   "sources": [
    {
     "title": "Wald et al., ShakeMap Manual, USGS Techniques and Methods 12-A1 (version 1.0, 2006), section 2.5 and Figure 2.5 (reproduces Wald, Quitoriano, Heaton & Kanamori 1999, Earthquake Spectra 15(3):557-564)",
     "url": "https://pubs.usgs.gov/tm/2005/12A01/pdf/508TM12-A1.pdf"
    }
   ],
   "notes": "Physics, not a published threshold: for sinusoidal vertical motion of amplitude v (velocity), peak acceleration is 2 pi f v; when that exceeds g = 9.80665 m/s^2 an unattached object on the ground momentarily loses contact. v = 9.80665 / (2 pi f). Shows why a fixed PPV threshold cannot cover both earthquakes (about 2 Hz) and footsteps (higher): at 2 Hz the same 1 g would need 780 mm/s. Objects slide sideways at lower acceleration (friction coefficient times g). The USGS source is listed only for the frequency context; the formula is standard kinematics.",
   "who_when": "Derived here"
  },
  {
   "key": "thr_bs7385_2_table1_cosmetic",
   "category": "thresholds",
   "label": "BS 7385-2 Table 1: transient vibration guide values for cosmetic damage (frequency-dependent)",
   "status": "verified",
   "value_si": 0.015,
   "unit_si": "m/s",
   "low_si": 0.015,
   "high_si": 0.05,
   "display": "Homes and light commercial (line 2): 15 mm/s at 4 Hz rising to 20 mm/s at 15 Hz and 50 mm/s at 40 Hz and above; below 4 Hz, 0.6 mm displacement. Framed and industrial (line 1): 50 mm/s at 4 Hz and above",
   "values_json": "{\"units\": \"peak component particle velocity, mm/s, at the base of the building; transient vibration\", \"line 1 Reinforced or framed structures; industrial and heavy commercial buildings\": {\"4-15 Hz\": \"50 at 4 Hz and above\", \"15 Hz and above\": \"50 at 4 Hz and above\"}, \"line 2 Unreinforced or light framed structures; residential or light commercial buildings\": {\"4-15 Hz\": \"15 at 4 Hz increasing to 20 at 15 Hz\", \"15 Hz and above\": \"20 at 15 Hz increasing to 50 at 40 Hz and above\"}, \"note 2\": \"For line 2, at frequencies below 4 Hz, a maximum displacement of 0.6 mm (zero to peak) is not to be exceeded (15.1 mm/s at 4 Hz).\"}",
   "sources": [
    {
     "title": "BS 5228-2:2009 Code of practice for noise and vibration control on construction and open sites, Part 2: Vibration (licensed copy posted by Nottinghamshire County Council), Annex B",
     "url": "https://www.nottinghamshire.gov.uk/media/110052/british-standard-bs5228-2009.pdf"
    },
    {
     "title": "MetroLink EIAR Vol. 5 Appendix A14.1 'Relevant guidance and standards' (Jacobs IDOM), hosted by An Bord Pleanala (Irish planning board); reproduces BS 5228-2:2009+A1:2014, BS 7385-2, DIN 4150-3:2016, HS2 tables",
     "url": "https://www.pleanala.ie/publicaccess/EIAR-NIS/314724/5_EIAR/Volume%205%20Appendices/Chapter%2014%20Ground-borne%20Noise%20and%20Vibration/A14.1%20Relevant%20guidance%20and%20standards.pdf"
    }
   ],
   "notes": "BS 7385-2:1993 Table 1 as reproduced in BS 5228-2:2009 Table B.2 and Figure B.1 (p. 38), and again in An Bord Pleanala Table 14.1 (citing BS 7385-2:1993 and BS 5228-2:2009+A1:2014). Notes: 'Values referred to are at the base of the building.' BS 5228-2 B.3.2: 'Strains imposed in a building by ground motion will tend to be greater if lower frequencies predominate ... The dominant frequency to use for the assessment is that associated with the greatest amplitude.' 'Limits for transient vibration, above which cosmetic damage could occur'. Figure B.1 draws the lines on logarithmic axes (4-250 Hz, 10-100 mm/s); the text does not say how to interpolate. BS 7385-2 itself (paywalled) not opened. value_si = line 2 at 4 Hz.",
   "who_when": "BSI 1993 (BS 7385-2), as reproduced in BS 5228-2:2009"
  },
  {
   "key": "thr_bs7385_2_multipliers_and_continuous",
   "category": "thresholds",
   "label": "BS 7385-2 via BS 5228-2: minor damage at 2x, major at 4x the guide values; up to 50% lower for continuous vibration",
   "status": "verified",
   "value_si": 2,
   "unit_si": "1",
   "low_si": 0.5,
   "high_si": 4,
   "display": "Minor damage possible above 2x Table B.2; major damage above 4x; for continuous vibration with resonance, reduce guide values by up to 50%",
   "sources": [
    {
     "title": "BS 5228-2:2009 Code of practice for noise and vibration control on construction and open sites, Part 2: Vibration (licensed copy posted by Nottinghamshire County Council), Annex B",
     "url": "https://www.nottinghamshire.gov.uk/media/110052/british-standard-bs5228-2009.pdf"
    },
    {
     "title": "MetroLink EIAR Vol. 5 Appendix A14.1 'Relevant guidance and standards' (Jacobs IDOM), hosted by An Bord Pleanala (Irish planning board); reproduces BS 5228-2:2009+A1:2014, BS 7385-2, DIN 4150-3:2016, HS2 tables",
     "url": "https://www.pleanala.ie/publicaccess/EIAR-NIS/314724/5_EIAR/Volume%205%20Appendices/Chapter%2014%20Ground-borne%20Noise%20and%20Vibration/A14.1%20Relevant%20guidance%20and%20standards.pdf"
    }
   ],
   "notes": "BS 5228-2:2009 p. 38: 'Minor damage is possible at vibration magnitudes which are greater than twice those given in Table B.2, and major damage to a building structure can occur at values greater than four times the tabulated values. ... The guide values in Table B.2 relate predominantly to transient vibration which does not give rise to resonant responses in structures, and to low-rise buildings. Where the dynamic loading caused by continuous vibration is such as to give rise to dynamic magnification due to resonance, especially at the lower frequencies where lower guide values apply, then the guide values in Table B.2 might need to be reduced by up to 50%.' BS 7385-2 note quoted by An Bord Pleanala: 'There are insufficient cases where continuous vibration has caused damage to buildings to substantiate these guide values, but they are based on common practice'. Useful for the not-so-heroic presets: minor damage to homes from about 30-100 mm/s and major from about 60-200 mm/s, depending on frequency (2x and 4x of 15-50 mm/s).",
   "who_when": "BSI 1993/2008"
  },
  {
   "key": "thr_bs7385_2_damage_probability_zero",
   "category": "thresholds",
   "label": "BS 7385-2: probability of damage tends to zero at 12.5 mm/s",
   "status": "verified",
   "value_si": 0.0125,
   "unit_si": "m/s",
   "display": "12.5 mm/s peak component particle velocity",
   "sources": [
    {
     "title": "BS 5228-2:2009 Code of practice for noise and vibration control on construction and open sites, Part 2: Vibration (licensed copy posted by Nottinghamshire County Council), Annex B",
     "url": "https://www.nottinghamshire.gov.uk/media/110052/british-standard-bs5228-2009.pdf"
    },
    {
     "title": "MetroLink EIAR Vol. 5 Appendix A14.1 'Relevant guidance and standards' (Jacobs IDOM), hosted by An Bord Pleanala (Irish planning board); reproduces BS 5228-2:2009+A1:2014, BS 7385-2, DIN 4150-3:2016, HS2 tables",
     "url": "https://www.pleanala.ie/publicaccess/EIAR-NIS/314724/5_EIAR/Volume%205%20Appendices/Chapter%2014%20Ground-borne%20Noise%20and%20Vibration/A14.1%20Relevant%20guidance%20and%20standards.pdf"
    }
   ],
   "notes": "BS 5228-2:2009 p. 39: 'BS 7385-2 notes that the probability of damage tends towards zero at 12.5 mm/s peak component particle velocity.' Same sentence in An Bord Pleanala A14.1 p. 2. Also: 'A building of historical value should not (unless it is structurally unsound) be assumed to be more sensitive.' Matches the USBM 0.5 in/s (12.7 mm/s) plaster safe level.",
   "who_when": "BSI 1993 via BS 5228-2:2009"
  },
  {
   "key": "thr_din4150_3_1999_table1",
   "category": "thresholds",
   "label": "DIN 4150-3:1999 Table 1: short-term vibration guideline values for buildings, by frequency",
   "status": "verified",
   "value_si": 0.005,
   "unit_si": "m/s",
   "low_si": 0.003,
   "high_si": 0.05,
   "display": "Dwellings: 5 mm/s below 10 Hz, 5-15 mm/s at 10-50 Hz, 15-20 mm/s at 50-100 Hz (foundation); 15 mm/s top floor. Sensitive or listed: 3, 3-8, 8-10, 8. Commercial: 20, 20-40, 40-50, 40",
   "values_json": "{\"units\": \"peak particle velocity, mm/s; foundation by frequency band, plus plane of uppermost floor (all frequencies)\", \"line 1 commercial, industrial and similar\": {\"<10 Hz\": \"20\", \"10-50 Hz\": \"20 to 40\", \"50-100 Hz\": \"40 to 50\", \"uppermost floor\": \"40\"}, \"line 2 dwellings and similar\": {\"<10 Hz\": \"5\", \"10-50 Hz\": \"5 to 15\", \"50-100 Hz\": \"15 to 20\", \"uppermost floor\": \"15\"}, \"line 3 sensitive, of great intrinsic value (e.g. preservation order)\": {\"<10 Hz\": \"3\", \"10-50 Hz\": \"3 to 8\", \"50-100 Hz\": \"8 to 10\", \"uppermost floor\": \"8\"}, \"footnote\": \"For frequencies above 100 Hz, at least the values specified in this column shall be applied\"}",
   "sources": [
    {
     "title": "Watercare Services (Auckland) evidence, P. Millar, Appendix B 'Review of vibration standards' (reproduces DIN 4150-3:1999 Table 1)",
     "url": "https://assets.watercare.co.nz/media/peter_millar_appendix_b_9d042ff732.pdf"
    }
   ],
   "notes": "As reproduced in Watercare evidence Appendix B, 'Table 2: Guideline values of vibration velocity, for evaluating the effects of short-term vibration, DIN4150-3:1999'. Short-term vibration means vibration that does not occur often enough to cause fatigue or resonance (standard's definition, seen only in search snippets, not confirmed). DIN is stricter than BS 7385-2 at low frequencies (5 mm/s vs 15 mm/s for homes below 10 Hz). Values are guideline values intended to avoid even minor damage. DIN 4150-3 itself (paywalled) not opened. value_si = dwellings below 10 Hz.",
   "who_when": "DIN 1999, via Watercare (Auckland)"
  },
  {
   "key": "thr_din4150_3_2016_table1",
   "category": "thresholds",
   "label": "DIN 4150-3:2016 Table 1 as reproduced (one cell conflicts with the 1999 edition)",
   "status": "disputed",
   "value_si": 0.005,
   "unit_si": "m/s",
   "low_si": 0.003,
   "high_si": 0.05,
   "display": "2016 reproduction matches 1999 except dwellings at 50-100 Hz read '40 to 50' (1999: '15 to 20'); adds floor slabs, vertical, 20 mm/s at all frequencies",
   "values_json": "{\"units\": \"v_i,max mm/s\", \"line 1\": {\"1-10 Hz\": \"20\", \"10-50 Hz\": \"20 to 40\", \"50-100 Hz\": \"40 to 50\", \"topmost floor horizontal\": \"40\", \"floor slabs vertical\": \"20\"}, \"line 2\": {\"1-10 Hz\": \"5\", \"10-50 Hz\": \"5 to 15\", \"50-100 Hz\": \"40 to 50 [as printed; 1999 edition 15 to 20]\", \"topmost floor horizontal\": \"15\", \"floor slabs vertical\": \"20\"}, \"line 3\": {\"1-10 Hz\": \"3\", \"10-50 Hz\": \"3 to 8\", \"50-100 Hz\": \"8 to 10\", \"topmost floor horizontal\": \"8\", \"floor slabs vertical\": \"20 (footnote b: may need lowering markedly)\"}, \"note\": \"Even if guideline values as in line 1, columns 2 to 5, are complied with, minor damage cannot be excluded.\"}",
   "sources": [
    {
     "title": "MetroLink EIAR Vol. 5 Appendix A14.1 'Relevant guidance and standards' (Jacobs IDOM), hosted by An Bord Pleanala (Irish planning board); reproduces BS 5228-2:2009+A1:2014, BS 7385-2, DIN 4150-3:2016, HS2 tables",
     "url": "https://www.pleanala.ie/publicaccess/EIAR-NIS/314724/5_EIAR/Volume%205%20Appendices/Chapter%2014%20Ground-borne%20Noise%20and%20Vibration/A14.1%20Relevant%20guidance%20and%20standards.pdf"
    },
    {
     "title": "Watercare Services (Auckland) evidence, P. Millar, Appendix B 'Review of vibration standards' (reproduces DIN 4150-3:1999 Table 1)",
     "url": "https://assets.watercare.co.nz/media/peter_millar_appendix_b_9d042ff732.pdf"
    }
   ],
   "notes": "An Bord Pleanala A14.1 Table 14.3 'Guideline Values for Vibration Velocity, vi,max, for Evaluating the Effects of Short-Term Vibration on Structures' (DIN 4150-3:2016-12), read from a page image. The line-2, 50-100 Hz cell reads '40 to 50', which breaks the pattern (higher than the 15 mm/s top-floor value) and contradicts the 1999 table's '15 to 20'; likely a transcription error, but I could not open the 2016 standard to check. Use the 1999 values (thr_din4150_3_1999_table1) for the page.",
   "who_when": "DIN 2016 via Jacobs IDOM EIAR"
  },
  {
   "key": "thr_usbm_ri8507_safe_levels",
   "category": "thresholds",
   "label": "USBM RI 8507: safe blasting vibration for houses (cosmetic cracking threshold)",
   "status": "verified",
   "value_si": 0.0127,
   "unit_si": "m/s",
   "low_si": 0.0127,
   "high_si": 0.0508,
   "display": "Below 40 Hz: 0.50 in/s (12.7 mm/s) for plaster-on-lath, 0.75 in/s (19 mm/s) for drywall; above 40 Hz: 2.0 in/s (51 mm/s)",
   "sources": [
    {
     "title": "Siskind, Stagg, Kopp & Dowding (1980) US Bureau of Mines Report of Investigations 8507, Structure Response and Damage Produced by Ground Vibration from Surface Mine Blasting (Pennsylvania DEP copy; scanned, read by OCR and page images)",
     "url": "https://files.dep.state.pa.us/Mining/BureauOfMiningPrograms/BMPPortalFiles/Blasting_Research_Papers/1980%20Siskind%20RI%208507%20Structure%20Response%20and%20Damage%20Produced%20by%20Ground%20Vibration%20from%20Surface%20Mine%20Blasting%20(No.%2018).pdf"
    },
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "notes": "RI 8507 Conclusion 6 (p. 68): 'Practical safe criteria for blasts that generate low-frequency ground vibrations are 0.75 in/sec for modern gypsumboard houses and 0.50 in/sec for plaster on lath interiors. For frequencies above 40 Hz, a safe particle velocity maximum of 2.0 in/sec is recommended for all houses.' Abstract: 'Threshold damage was defined as the occurrence of cosmetic damage; that is, the most superficial interior cracking of the type that develops in all homes independent of blasting.' Conclusion 8: 'The chance of damage from a blast generating peak particle velocities below 0.5 in/sec is not only small (5 pct for worst cases) but decreases more rapidly than the mean prediction'. Conclusion 7: 'there may be no absolute minimum vibration damage threshold when the vibration (from any cause, for instance slamming a door) could in some case precipitate a crack about to occur.' Same limits restated in Caltrans 2020 section 11.4.3.1. Blast events last about 1-2 s (Caltrans 11.4.1). Data: 219 blasts at 76 homes plus nine earlier studies.",
   "who_when": "Siskind, Stagg, Kopp & Dowding 1980"
  },
  {
   "key": "thr_usbm_ri8507_figure_b1_curve",
   "category": "thresholds",
   "label": "USBM RI 8507 Figure B-1: frequency-dependent safe level for houses",
   "status": "verified",
   "value_si": 0.0127,
   "unit_si": "m/s",
   "low_si": 0.0127,
   "high_si": 0.0508,
   "display": "0.030 in (0.76 mm) displacement below about 2.7-4 Hz; 0.50 in/s plaster or 0.75 in/s drywall up to about 10-15 Hz; then 0.008 in (0.2 mm) displacement to 40 Hz; 2.0 in/s above 40 Hz",
   "values_json": "{\"units\": \"PPV in/s (mm/s); displacement in (mm)\", \"plaster\": {\"<2.65 Hz\": \"0.030 in (0.76 mm) displacement\", \"2.65-9.95 Hz\": \"0.50 in/s (12.7)\", \"9.95-39.8 Hz\": \"0.008 in (0.20 mm) displacement, i.e. v = 2 pi f x 0.2 mm\", \">=40 Hz\": \"2.0 in/s (50.8)\"}, \"drywall\": {\"<3.98 Hz\": \"0.030 in displacement\", \"3.98-14.9 Hz\": \"0.75 in/s (19.1)\", \"14.9-39.8 Hz\": \"0.008 in displacement\", \">=40 Hz\": \"2.0 in/s (50.8)\"}, \"corner_frequencies\": \"derived: f = v / (2 pi d)\"}",
   "sources": [
    {
     "title": "Siskind, Stagg, Kopp & Dowding (1980) US Bureau of Mines Report of Investigations 8507, Structure Response and Damage Produced by Ground Vibration from Surface Mine Blasting (Pennsylvania DEP copy; scanned, read by OCR and page images)",
     "url": "https://files.dep.state.pa.us/Mining/BureauOfMiningPrograms/BMPPortalFiles/Blasting_Research_Papers/1980%20Siskind%20RI%208507%20Structure%20Response%20and%20Damage%20Produced%20by%20Ground%20Vibration%20from%20Surface%20Mine%20Blasting%20(No.%2018).pdf"
    }
   ],
   "notes": "RI 8507 Appendix B (p. 73-74): 'Above 40 Hz, a constant peak particle velocity of 2.0 in/sec is the maximum safe value. Below 40 Hz, the maximum velocity decreases at a rate equivalent to a constant peak displacement of 0.008 in. At frequencies corresponding to 0.75 in/sec for Drywall, and 0.50 in/sec for plaster, constant particle velocities are again appropriate. An ultimate maximum displacement of 0.030 in is recommended, which would only be of concern where very low frequencies are encountered (< 4 Hz).' Corner frequencies are mine, from f = v / (2 pi d): 0.5 in/s at 0.008 in -> 9.95 Hz; 0.75 -> 14.9 Hz; 2.0 -> 39.8 Hz; 0.5 at 0.030 in -> 2.65 Hz; 0.75 -> 3.98 Hz. The report adds: 'This method ... has the disadvantage of possibly underestimating annoyance reactions ... the higher midwall response frequencies will make the 20- to 35-Hz vibrations relatively annoying'.",
   "who_when": "Siskind et al. 1980"
  },
  {
   "key": "thr_siskind_damage_probabilities",
   "category": "thresholds",
   "label": "Siskind et al. (1980): probability of blast damage to houses by PPV",
   "status": "verified",
   "value_si": 0.0127,
   "unit_si": "m/s",
   "low_si": 0.0127,
   "high_si": 0.4318,
   "display": "Threshold (cosmetic) damage: 5% at 0.5 in/s (13 mm/s), 50% at 2.5 in/s (64 mm/s); minor: 5% at 1.8 (46), 50% at 5.0 (127); major: 5% at 2.5 (64), 50% at 6.0 in/s (152 mm/s)",
   "values_json": "{\"units\": \"PPV in/s (mm/s) at 5/10/50/90 % probability\", \"Threshold damage: loosening of paint, small plaster cracks at joints\": \"0.5 (12.7) / 0.7 (17.8) / 2.5 (63.5) / 9.0 (229)\", \"Minor damage: loosening and falling of plaster, cracks in masonry around openings, hairline to 3 mm cracks, fall of loose mortar\": \"1.8 (45.7) / 2.2 (55.9) / 5.0 (127) / 16.0 (406)\", \"Major damage: cracks of several mm in walls, rupture of opening vaults, structural weakening, fall of masonry, load support ability affected\": \"2.5 (63.5) / 3.0 (76.2) / 6.0 (152) / 17.0 (432)\"}",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    },
    {
     "title": "Siskind, Stagg, Kopp & Dowding (1980) US Bureau of Mines Report of Investigations 8507, Structure Response and Damage Produced by Ground Vibration from Surface Mine Blasting (Pennsylvania DEP copy; scanned, read by OCR and page images)",
     "url": "https://files.dep.state.pa.us/Mining/BureauOfMiningPrograms/BMPPortalFiles/Blasting_Research_Papers/1980%20Siskind%20RI%208507%20Structure%20Response%20and%20Damage%20Produced%20by%20Ground%20Vibration%20from%20Surface%20Mine%20Blasting%20(No.%2018).pdf"
    }
   ],
   "notes": "As reproduced in Caltrans 2020 Table 13 'Siskind Vibration Damage Thresholds' (p. 25): 'Siskind et al. (1980) applied probabilistic methods to vibration damage thresholds for blasting. Three damage thresholds have been identified and are described in Table 13 in terms of PPV for probabilities of 5, 10, 50, and 90%.' The damage-class wording matches RI 8507 Table 10 'Damage classification'. I did not cross-check the probability numbers against RI 8507's probability plots (figs. 55-59). Blasting, mostly low-frequency, residential houses. value_si = 5% threshold damage.",
   "who_when": "Siskind et al. 1980 via Caltrans 2020"
  },
  {
   "key": "thr_caltrans2020_table19_damage",
   "category": "thresholds",
   "label": "Caltrans 2020 Table 19: building damage potential, transient vs continuous (PPV)",
   "status": "verified",
   "value_si": 0.0127,
   "unit_si": "m/s",
   "low_si": 0.002032,
   "high_si": 0.0508,
   "display": "Older homes: 0.5 in/s (12.7 mm/s) transient, 0.3 in/s (7.6 mm/s) continuous; new homes 1.0/0.5 in/s; fragile 0.2/0.1 in/s; ruins 0.12/0.08 in/s; modern commercial 2.0/0.5 in/s",
   "values_json": "{\"units\": \"max PPV in/s (mm/s): transient / continuous or frequent intermittent\", \"Extremely fragile historic buildings, ruins, ancient monuments\": \"0.12 (3.0) / 0.08 (2.0)\", \"Fragile buildings\": \"0.2 (5.1) / 0.1 (2.5)\", \"Historic and some old buildings\": \"0.5 (12.7) / 0.25 (6.4)\", \"Older residential structures\": \"0.5 (12.7) / 0.3 (7.6)\", \"New residential structures\": \"1.0 (25.4) / 0.5 (12.7)\", \"Modern industrial/commercial buildings\": \"2.0 (50.8) / 0.5 (12.7)\"}",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "notes": "Caltrans 2020 Table 19 'Guideline Vibration Damage Potential Threshold Criteria' (p. 38, PDF p. 62), same transient/continuous note as Table 20 (transient: blasting, drop balls; continuous/frequent intermittent: impact pile drivers, compactors). A synthesis of Chae, Swiss SN 640312, Konan, Whiffen, Siskind, Dowding and AASHTO criteria (Tables 9-15). No frequency dependence. value_si = older residential, transient.",
   "who_when": "Caltrans 2020"
  },
  {
   "key": "thr_fta2018_table7_5_damage",
   "category": "thresholds",
   "label": "FTA 2018 Table 7-5: construction vibration damage criteria",
   "status": "verified",
   "value_si": 0.00508,
   "unit_si": "m/s",
   "low_si": 0.003048,
   "high_si": 0.0127,
   "display": "I reinforced concrete/steel/timber 0.5 in/s (12.7 mm/s); II engineered concrete and masonry 0.3 (7.6); III non-engineered timber and masonry 0.2 (5.1); IV extremely susceptible 0.12 (3.0)",
   "values_json": "{\"units\": \"PPV in/s (mm/s); approximate Lv in VdB\", \"I. Reinforced-concrete, steel or timber (no plaster)\": \"0.5 (12.7), 102 VdB\", \"II. Engineered concrete and masonry (no plaster)\": \"0.3 (7.6), 98 VdB\", \"III. Non-engineered timber and masonry buildings\": \"0.2 (5.1), 94 VdB\", \"IV. Buildings extremely susceptible to vibration damage\": \"0.12 (3.0), 90 VdB\"}",
   "sources": [
    {
     "title": "FTA (2018) Transit Noise and Vibration Impact Assessment Manual, FTA Report No. 0123 (Volpe Center), ROSA P copy of the official PDF",
     "url": "https://rosap.ntl.bts.gov/view/dot/37056/dot_37056_DS1.pdf"
    }
   ],
   "notes": "FTA 2018 Table 7-5 'Construction Vibration Damage Criteria' (p. 186): 'The approximate rms vibration velocity levels were calculated from the PPV limits using a crest factor of 4.' Applies to construction equipment, including impact pile drivers (repeated impacts); no transient/continuous split and no frequency dependence. An ordinary wood-frame house is category III (5.1 mm/s), which is stricter than BS 7385-2 or USBM. value_si = category III.",
   "who_when": "FTA 2018"
  },
  {
   "key": "thr_whiffin_leonard_1971_buildings",
   "category": "thresholds",
   "label": "Whiffin & Leonard (1971): continuous vibration and buildings, PPV",
   "status": "verified",
   "value_si": 0.005,
   "unit_si": "m/s",
   "low_si": 0.0025,
   "high_si": 0.015,
   "display": "5 mm/s (0.2 in/s): threshold of risk of 'architectural' damage to plastered houses; 2.5 mm/s virtually no risk; 10-15 mm/s architectural and possibly minor structural damage; 2 mm/s upper limit for ruins",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "notes": "As reproduced in Caltrans TAV-04-01-R0201 (Hendriks 2004) Table 2 (Caltrans 2020 appendix, PDF p. 143): '2.0 mm/s: Recommended upper amplitude of the vibration to which ruins and ancient monuments should be subjected'; '2.5: Virtually no risk of architectural damage to normal buildings'; '5.0: Threshold at which there is a risk of architectural damage to normal dwelling - houses with plastered walls and ceilings'; '10-15: Vibrations at a greater amplitude than normally expected from traffic, but would cause architectural damage and possibly minor structural damage'; '0.15-0.30: Vibrations unlikely to cause damage of any type'. 'For buildings, the value refers to the ground motion. No allowance is included for the amplifying effect, if any, of structural components.' The TA notes 5 mm/s 'is one tenth of the maximum safe amplitude of 50 mm/sec (2 in/sec) for single events' and 'appears to be conservative even for sustained pile driving'; it suggests pile-driving peaks near normal dwellings 'should probably not be allowed to exceed 7.5 mm/s (0.3 in/sec)'. Continuous (traffic) vibration.",
   "who_when": "Whiffin & Leonard 1971, via Caltrans TAV-04-01-R0201 (Hendriks 2004) in Caltrans 2020"
  },
  {
   "key": "thr_other_damage_criteria_caltrans",
   "category": "thresholds",
   "label": "Other building damage criteria summarised by Caltrans (Chae, Swiss, Konan, Dowding, AASHTO)",
   "status": "verified",
   "value_si": null,
   "unit_si": "m/s",
   "display": "Range 0.1-4 in/s (2.5-102 mm/s) depending on building and whether single or repeated; Swiss criteria assume 10-30 Hz",
   "values_json": "{\"units\": \"PPV in/s\", \"Chae 1978 (single / repeated blast)\": {\"substantial construction\": \"4 / 2\", \"relatively new residential, sound\": \"2 / 1\", \"old residential, poor condition\": \"1 / 0.5\", \"old residential, very poor\": \"0.5 / -\"}, \"Swiss (Wiss 1981), 10-30 Hz (continuous / single event)\": {\"I steel or reinforced concrete\": \"0.5 / 1.2\", \"II concrete foundation walls and floors, concrete or masonry walls\": \"0.3 / 0.7\", \"III as II with wooden ceilings and masonry walls\": \"0.2 / 0.5\", \"IV very sensitive, historic\": \"0.12 / 0.3\"}, \"Konan 1985 historic and sensitive (transient / steady)\": {\"1-10 Hz\": \"0.25 / 0.12\", \"10-40 Hz\": \"0.25-0.5 / 0.12-0.25\", \"40-100 Hz\": \"0.5 / 0.25\"}, \"Dowding 1996\": {\"historic and some old\": \"0.5\", \"residential\": \"0.5\", \"new residential\": \"1.0\", \"industrial\": \"2.0\", \"bridges\": \"2.0\"}, \"AASHTO 1990\": {\"historic sites\": \"0.1\", \"residential, plastered walls\": \"0.2-0.3\", \"residential in good repair, gypsum board\": \"0.4-0.5\", \"engineered structures without plaster\": \"1.0-1.5\"}}",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "notes": "Caltrans 2020 Tables 9-15 (pp. 23-26). Caltrans on the Swiss table: 'Assuming that the frequency range of interest for construction and traffic sources is 10-30 Hz, Table 10 shows criteria for 10-30 Hz.' Konan 'recommended that criteria for continuous vibration be about half the amplitude of criteria for transient sources.' Original documents not opened. Context only; the page should not need these individually.",
   "who_when": "Various, via Caltrans 2020"
  },
  {
   "key": "thr_everyday_household_equivalents",
   "category": "thresholds",
   "label": "Everyday household events expressed as equivalent PPV (Stagg et al. 1980)",
   "status": "verified",
   "value_si": 0.000762,
   "unit_si": "m/s",
   "low_si": 0.000762,
   "high_si": 0.0762,
   "display": "Walking on the floor 0.03 in/s (0.8 mm/s); normal family activity 0.1-0.5 in/s (2.5-13 mm/s); jumping on the floor 0.3 (7.6); door slam 0.5 (12.7); nail driving 0.9 (23); daily environmental changes 1.2-3.0 in/s (30-76 mm/s)",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "notes": "Caltrans 2020 Table 22 'Effect of Blasting Vibration on Materials and Structures' (pp. 76-77), rows credited to Stagg et al. 1980: 'Residential structure: Equivalent to walking on floor 0.03; Equivalent to jumping on floor 0.3; Equivalent to door slam 0.5; Equates to normal daily family activity 0.1-0.5; Equivalent to nail driving 0.9; Equates to daily environmental changes 1.2-3.0' (in/s). Caltrans: 'In some instances equivalent velocity levels were derived from strain measurements' and the table 'is not intended to be used to establish specific limits.' These are ground-vibration PPVs that would strain a house as much as the household event does, not floor vibration levels. Useful for plain comparisons on the page ('about as hard on the house as a slammed door').",
   "who_when": "Stagg et al. 1980 via Caltrans 2020"
  },
  {
   "key": "thr_measurement_point_conventions",
   "category": "thresholds",
   "label": "Where each threshold is measured: building base for damage, the person's position for people",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "Damage values: ground or building foundation, peak component PPV; human values: where the person is (inside, often on an amplifying floor)",
   "sources": [
    {
     "title": "BS 5228-2:2009 Code of practice for noise and vibration control on construction and open sites, Part 2: Vibration (licensed copy posted by Nottinghamshire County Council), Annex B",
     "url": "https://www.nottinghamshire.gov.uk/media/110052/british-standard-bs5228-2009.pdf"
    },
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    },
    {
     "title": "MetroLink EIAR Vol. 5 Appendix A14.1 'Relevant guidance and standards' (Jacobs IDOM), hosted by An Bord Pleanala (Irish planning board); reproduces BS 5228-2:2009+A1:2014, BS 7385-2, DIN 4150-3:2016, HS2 tables",
     "url": "https://www.pleanala.ie/publicaccess/EIAR-NIS/314724/5_EIAR/Volume%205%20Appendices/Chapter%2014%20Ground-borne%20Noise%20and%20Vibration/A14.1%20Relevant%20guidance%20and%20standards.pdf"
    }
   ],
   "notes": "BS 5228-2 Table B.2 Note 1: 'Values referred to are at the base of the building'; values are 'peak component particle velocity' (largest of three components, not the vector sum). Whiffin & Leonard footnote (Caltrans TA): 'Where human reactions are concerned, the value is at the point at which the person is situated. For buildings, the value refers to the ground motion. No allowance is included for the amplifying effect, if any, of structural components.' BS 5228-2:2009+A1:2014 Table B.1 footnotes (via An Bord Pleanala): values apply at 'the point of entry into the recipient' and 'A transfer function ... needs to be applied if only external measurements are available.' FTA criteria are indoor rms levels. The Walk tab predicts free-field ground PPV, which matches the damage criteria and an outdoor listener; for indoor listeners, floors and walls can amplify (RI 8507: up to about 4 times for midwalls at 10-25 Hz).",
   "who_when": "BSI; Caltrans; FTA"
  },
  {
   "key": "thr_blast_event_duration",
   "category": "thresholds",
   "label": "Blasting events, behind most damage criteria, last about 1-2 seconds",
   "status": "verified",
   "value_si": null,
   "unit_si": "s",
   "low_si": 1,
   "high_si": 2,
   "display": "Millisecond-delayed blasts: 1-2 s; longer and higher-frequency events bother people more",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    }
   ],
   "notes": "Caltrans 2020 section 11.4.1 (p. 74): 'The duration of the event has an effect on human response, as does the frequency. Events are of short duration, 1-2 seconds, for millisecond-delayed blasts. Typically, the longer the event and the higher the frequency, the more adverse the effect on human response.' Relevance: USBM, BS 7385-2 'transient' and Caltrans 'transient' criteria come from events of this length; a single footstep is probably shorter, and a walk is a train of such pulses.",
   "who_when": "Caltrans 2020"
  },
  {
   "key": "thr_footing_ems98",
   "category": "thresholds",
   "label": "EMS-98: when people lose their balance or find it hard to stand",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "VI: 'A few persons lose their balance'; VII: 'Many find it difficult to stand, especially on upper floors'; VIII: 'Many people find it difficult to stand, even outdoors'; IX: 'People may be forcibly thrown to the ground'",
   "sources": [
    {
     "title": "Grunthal (ed.) (1998) European Macroseismic Scale 1998 (EMS-98), Cahiers du Centre Europeen de Geodynamique et de Seismologie vol. 15 (doi:10.2312/EMS-98); copy hosted by Masaryk University",
     "url": "https://sid.ipe.muni.cz/ems-98_eng.pdf"
    }
   ],
   "notes": "EMS-98 core scale (PDF pp. 19-20): 'VI. Slightly damaging: a) Felt by most indoors and by many outdoors. A few persons lose their balance. Many people are frightened and run outdoors.' 'VII. Damaging: a) Most people are frightened and try to run outdoors. Many find it difficult to stand, especially on upper floors.' 'VIII. Heavily damaging: a) Many people find it difficult to stand, even outdoors.' 'IX. Destructive: a) General panic. People may be forcibly thrown to the ground.' Descriptive only; no ground-motion values in EMS-98.",
   "who_when": "Grunthal (ed.) 1998"
  },
  {
   "key": "thr_footing_earthquake_pgv",
   "category": "thresholds",
   "label": "Ground velocity at which earthquake shaking makes standing hard (EMS-98 wording on Wald 1999 MMI bands)",
   "status": "estimate",
   "value_si": 0.31,
   "unit_si": "m/s",
   "low_si": 0.081,
   "high_si": 0.6,
   "display": "A few lose balance (VI): 81-160 mm/s; many find standing hard indoors (VII): 160-310 mm/s; even outdoors (VIII): 310-600 mm/s",
   "sources": [
    {
     "title": "Grunthal (ed.) (1998) European Macroseismic Scale 1998 (EMS-98), Cahiers du Centre Europeen de Geodynamique et de Seismologie vol. 15 (doi:10.2312/EMS-98); copy hosted by Masaryk University",
     "url": "https://sid.ipe.muni.cz/ems-98_eng.pdf"
    },
    {
     "title": "Wald et al., ShakeMap Manual, USGS Techniques and Methods 12-A1 (version 1.0, 2006), section 2.5 and Figure 2.5 (reproduces Wald, Quitoriano, Heaton & Kanamori 1999, Earthquake Spectra 15(3):557-564)",
     "url": "https://pubs.usgs.gov/tm/2005/12A01/pdf/508TM12-A1.pdf"
    }
   ],
   "notes": "Joins EMS-98's balance wording (thr_footing_ems98) to the Wald et al. (1999) PGV bands for the same Roman numerals (thr_wald1999_shakemap_intensity_table). Assumption, not checked: EMS-98 and California MMI are about equal at VI-VIII. The JMA scale (6 Lower: 'difficult to remain standing') gives no PGV. Conditions: earthquake ground motion of about 1-6 Hz lasting many seconds, mostly horizontal, displacements of centimetres. value_si = 310 mm/s, the VII/VIII boundary (standing hard even outdoors).",
   "who_when": "Derived here from EMS-98 (1998) and Wald et al. 1999"
  },
  {
   "key": "thr_footing_takahashi2004_shake_table",
   "category": "thresholds",
   "label": "Shake-table test: standing people start losing balance at about 0.3 m/s (0.3-2.5 Hz); none at 5 Hz up to 0.48 m/s",
   "status": "verified",
   "value_si": 0.3,
   "unit_si": "m/s",
   "low_si": 0.26,
   "high_si": 0.31,
   "display": "Standing subjects first judged unbalanced at about 0.26-0.31 m/s sine shaking (0.3-2.5 Hz); at 5 Hz nobody was, up to 0.48 m/s",
   "values_json": "{\"input velocities m/s by frequency (Table 1)\": {\"0.3 Hz\": \"0.265-0.796\", \"0.6 Hz\": \"0.265-0.796\", \"1.0 Hz\": \"0.159-0.796\", \"2.5 Hz\": \"0.064-0.624\", \"5.0 Hz\": \"0.032-0.477\"}, \"read from Figure 8 (standing)\": \"unbalanced ratio 0 up to about 0.16 m/s at all frequencies; first non-zero values at about 0.26-0.31 m/s (0.3-2.5 Hz); 5.0 Hz points stay at 0 up to 0.477 m/s\", \"subjects\": \"15 in 2000 and 15 in 2002 (7 female in total), with head, elbow and knee protectors\"}",
   "sources": [
    {
     "title": "Takahashi, Saito, Azuhata & Ohtomo (2004) Shaking table test on indoor human response and evacuation action limit in strong ground motion, 13th World Conference on Earthquake Engineering, Paper 1320",
     "url": "https://www.iitk.ac.in/nicee/wcee/article/13_1320.pdf"
    }
   ],
   "notes": "Takahashi et al. 2004, Table 1 (input sine waves) and Figure 8 'Unbalanced ratio in standing' (front-rear and right-left horizontal shaking), read from a 300 dpi page image, so the onset is approximate (about +-0.05 m/s). Text: 'Figure 4 shows that in high frequency motion, i.e., 5.0 Hz, they felt more anxiousness than low frequency motion, in the same velocity.' 'high frequency motion causes strong anxiousness and low frequency motion causes stagger even if anxiousness is small.' Conclusion: 'Low frequency floor response cause stagger for indoor people, but additional tests might be need to clarify its limit value.' and 'The authors have not find clear limit value for evacuation limit ... because of limitation of number of subjects.' Walking (Figure 10) became unbalanced at lower velocity, from about 0.16-0.2 m/s side to side. At 5 Hz no standing subject was unbalanced at any tested velocity up to 0.477 m/s. Small sample, young adults, horizontal sinusoids lasting several seconds. Conference paper.",
   "who_when": "Takahashi, Saito, Azuhata & Ohtomo 2004"
  },
  {
   "key": "thr_rec_feel",
   "category": "thresholds",
   "label": "Recommended page value: people feel it",
   "status": "estimate",
   "value_si": 0.0003,
   "unit_si": "m/s",
   "low_si": 0.00014,
   "high_si": 0.001,
   "display": "0.3 mm/s PPV (range 0.14-1 mm/s)",
   "sources": [
    {
     "title": "BS 5228-2:2009 Code of practice for noise and vibration control on construction and open sites, Part 2: Vibration (licensed copy posted by Nottinghamshire County Council), Annex B",
     "url": "https://www.nottinghamshire.gov.uk/media/110052/british-standard-bs5228-2009.pdf"
    },
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    },
    {
     "title": "Siskind, Stagg, Kopp & Dowding (1980) US Bureau of Mines Report of Investigations 8507 (Pennsylvania DEP copy)",
     "url": "https://files.dep.state.pa.us/Mining/BureauOfMiningPrograms/BMPPortalFiles/Blasting_Research_Papers/1980%20Siskind%20RI%208507%20Structure%20Response%20and%20Damage%20Produced%20by%20Ground%20Vibration%20from%20Surface%20Mine%20Blasting%20(No.%2018).pdf"
    },
    {
     "title": "FTA (2018) Transit Noise and Vibration Impact Assessment Manual, FTA Report No. 0123 (Volpe Center), ROSA P copy of the official PDF",
     "url": "https://rosap.ntl.bts.gov/view/dot/37056/dot_37056_DS1.pdf"
    }
   ],
   "notes": "Set by BS 5228-2 Table B.1 ('might be just perceptible in residential environments', 0.3 mm/s), for construction vibration of roughly 8-80 Hz felt by people in buildings. Agrees with Whiffin & Leonard (0.15-0.3 mm/s, continuous), Caltrans Table 20 continuous (0.25 mm/s), ISO 2631 (1989) residential (about 0.3 mm/s peak) and FTA's 65 VdB (about 0.2 mm/s PPV). Low end 0.14 mm/s: most sensitive people, quiet room. High end 1.0 mm/s: Caltrans 'barely perceptible' for a single isolated transient event; RI 8507 Table 15 shows the average person needs 2.4-3.3 mm/s to notice a 0.5-1 s event. For a walk past (a train of steps) use 0.3 mm/s; for one isolated step, say people sitting still may notice from about 0.3 mm/s, most from about 1 mm/s. Below about 8 Hz people respond to acceleration, so a higher PPV is needed.",
   "who_when": "Recommendation, this research"
  },
  {
   "key": "thr_rec_rattle",
   "category": "thresholds",
   "label": "Recommended page value: ornaments, crockery and windows rattle",
   "status": "estimate",
   "value_si": 0.001,
   "unit_si": "m/s",
   "low_si": 0.0003,
   "high_si": 0.003,
   "display": "About 1 mm/s PPV (range 0.3-3 mm/s); no standard sets this",
   "sources": [
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    },
    {
     "title": "FTA (2018) Transit Noise and Vibration Impact Assessment Manual, FTA Report No. 0123 (Volpe Center), ROSA P copy of the official PDF",
     "url": "https://rosap.ntl.bts.gov/view/dot/37056/dot_37056_DS1.pdf"
    },
    {
     "title": "Siskind, Stagg, Kopp & Dowding (1980) US Bureau of Mines Report of Investigations 8507 (Pennsylvania DEP copy)",
     "url": "https://files.dep.state.pa.us/Mining/BureauOfMiningPrograms/BMPPortalFiles/Blasting_Research_Papers/1980%20Siskind%20RI%208507%20Structure%20Response%20and%20Damage%20Produced%20by%20Ground%20Vibration%20from%20Surface%20Mine%20Blasting%20(No.%2018).pdf"
    },
    {
     "title": "Grunthal (ed.) (1998) European Macroseismic Scale 1998 (EMS-98); copy hosted by Masaryk University",
     "url": "https://sid.ipe.muni.cz/ems-98_eng.pdf"
    },
    {
     "title": "Wald et al., ShakeMap Manual, USGS Techniques and Methods 12-A1 (2006), reproducing Wald et al. 1999",
     "url": "https://pubs.usgs.gov/tm/2005/12A01/pdf/508TM12-A1.pdf"
    }
   ],
   "notes": "No construction or vibration standard gives a rattling threshold. Caltrans and FTA say rattling of dishes, windows and doors can happen at or below the perception level (lower bound 0.3 mm/s). Earthquake scales put 'china, glasses, windows and doors rattle' at intensity IV (EMS-98, USGS MMI, JMA 3-4); Wald et al. (1999) tie IV to PGA 1.4-3.9 %g, which equals 1.1-3.0 mm/s PPV at 20 Hz (thr_rattle_mmi4_accel_at_footstep_frequency). Central value 1 mm/s is the lower edge of that band, rounded; it is also where BS 5228-2 expects complaints in homes. If the engine knows the dominant frequency f of a step, compute instead v_rattle = 0.137 m/s^2 / (2 pi f), clamped to at least 0.3 mm/s. Indoors, midwall amplification (up to 4 times, RI 8507) means rattling starts at lower ground PPV.",
   "who_when": "Recommendation, this research"
  },
  {
   "key": "thr_rec_cosmetic_damage",
   "category": "thresholds",
   "label": "Recommended page value: cosmetic damage to buildings starts",
   "status": "estimate",
   "value_si": 0.0127,
   "unit_si": "m/s",
   "low_si": 0.005,
   "high_si": 0.05,
   "display": "One step or stomp: 12.7 mm/s (0.5 in/s) at the house; a walk past (repeated steps): 7.6 mm/s (0.3 in/s); range 5-50 mm/s by building and frequency",
   "sources": [
    {
     "title": "Siskind, Stagg, Kopp & Dowding (1980) US Bureau of Mines Report of Investigations 8507 (Pennsylvania DEP copy)",
     "url": "https://files.dep.state.pa.us/Mining/BureauOfMiningPrograms/BMPPortalFiles/Blasting_Research_Papers/1980%20Siskind%20RI%208507%20Structure%20Response%20and%20Damage%20Produced%20by%20Ground%20Vibration%20from%20Surface%20Mine%20Blasting%20(No.%2018).pdf"
    },
    {
     "title": "BS 5228-2:2009 Code of practice for noise and vibration control on construction and open sites, Part 2: Vibration (licensed copy posted by Nottinghamshire County Council), Annex B",
     "url": "https://www.nottinghamshire.gov.uk/media/110052/british-standard-bs5228-2009.pdf"
    },
    {
     "title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
     "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"
    },
    {
     "title": "FTA (2018) Transit Noise and Vibration Impact Assessment Manual, FTA Report No. 0123 (Volpe Center), ROSA P copy of the official PDF",
     "url": "https://rosap.ntl.bts.gov/view/dot/37056/dot_37056_DS1.pdf"
    },
    {
     "title": "Watercare Services (Auckland) evidence, P. Millar, Appendix B 'Review of vibration standards' (reproduces DIN 4150-3:1999 Table 1)",
     "url": "https://assets.watercare.co.nz/media/peter_millar_appendix_b_9d042ff732.pdf"
    }
   ],
   "notes": "Single step (transient): 12.7 mm/s, set by USBM RI 8507 (plaster-on-lath houses, below 40 Hz) and Caltrans Table 19 (older homes, transient); BS 7385-2 says damage probability 'tends towards zero at 12.5 mm/s' and gives 15-20 mm/s for homes at 4-15 Hz. Repeated steps: 7.6 mm/s, Caltrans Table 19 older homes, continuous/frequent intermittent (impact pile drivers are in that class); matches BS 7385-2's 'reduce by up to 50%' and the Caltrans TA's 7.5 mm/s for pile driving near dwellings. Range: 5 mm/s (DIN 4150-3 dwellings below 10 Hz; FTA wood-frame; Whiffin & Leonard continuous) to 50 mm/s (BS 7385-2 at 40 Hz and above; USBM above 40 Hz). Frequency option: BS 7385-2 line 2 (15 mm/s at 4 Hz, 20 at 15 Hz, 50 at 40 Hz). These are minimal-risk guide values for low-rise homes, not the point where cracks are certain. For damage presets: minor damage above 2 times and major above 4 times the BS 7385-2 values; Siskind: 50% chance of cosmetic cracks at 64 mm/s.",
   "who_when": "Recommendation, this research"
  },
  {
   "key": "thr_rec_footing",
   "category": "thresholds",
   "label": "Recommended page value: people lose their footing",
   "status": "estimate",
   "value_si": 0.3,
   "unit_si": "m/s",
   "low_si": 0.08,
   "high_si": 0.6,
   "display": "About 300 mm/s PPV (range 80-600 mm/s), from earthquake shaking and one shake-table study; likely cautious for footsteps",
   "sources": [
    {
     "title": "Grunthal (ed.) (1998) European Macroseismic Scale 1998 (EMS-98); copy hosted by Masaryk University",
     "url": "https://sid.ipe.muni.cz/ems-98_eng.pdf"
    },
    {
     "title": "Wald et al., ShakeMap Manual, USGS Techniques and Methods 12-A1 (2006), reproducing Wald et al. 1999",
     "url": "https://pubs.usgs.gov/tm/2005/12A01/pdf/508TM12-A1.pdf"
    },
    {
     "title": "Takahashi, Saito, Azuhata & Ohtomo (2004) Shaking table test on indoor human response and evacuation action limit in strong ground motion, 13th WCEE Paper 1320",
     "url": "https://www.iitk.ac.in/nicee/wcee/article/13_1320.pdf"
    }
   ],
   "notes": "No standard covers losing footing from ground vibration. 300 mm/s is where (a) EMS-98 VIII, 'Many people find it difficult to stand, even outdoors', begins on the Wald 1999 PGV scale (310 mm/s) and (b) standing subjects on a shake table first lost balance (about 0.26-0.31 m/s at 0.3-2.5 Hz; Takahashi et al. 2004). Low end 80 mm/s: EMS-98 VI 'a few persons lose their balance' (indoors, Wald VI from 81 mm/s). High end 600 mm/s: top of VIII. Conditions differ from footsteps: earthquakes shake at about 1-6 Hz for many seconds with centimetre displacements; a step is one short, higher-frequency pulse with sub-millimetre displacement. Takahashi found no loss of balance at 5 Hz up to 0.48 m/s, so for footsteps 300 mm/s probably overstates the hazard. Label as an estimate from the earthquake analogy.",
   "who_when": "Recommendation, this research"
  }
 ]
}
```

</details>


### Workflow `rex-presence-research` · 2026-10-11 18:05:08 UTC

- `Workflow` rex-presence-research: Research verified facts for the Rex lab presence brief (step forces, ground vibration, elephants, thresholds, the water-glass ripple, comic switches, growth physics), then adversarially verify each topic
  - run `wf_01258728-142`: 4 subagents, listed below

**Subagent `research:comic`** · rex-presence-research · started 2026-10-11 18:05:09 UTC

- facts: 30 (21 verified, 5 derived, 4 estimate).
- Research for the comic switches. All 30 facts are new and use the category "comic"; status counts are given below.

<details>
<summary>Prompt, verbatim (6,164 characters)</summary>

Workflow run `wf_01258728-142`, phase `Research`, agent `a3a1db24e4f4d05c3`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a3a1db24e4f4d05c3.txt](prompts/a3a1db24e4f4d05c3.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

TOPIC "comic": the physics behind the comic switches (see the brief, "Selective comic physics").
(1) Gentle hold (tactile telekinesis): show, with a citable source, that a body driven by a force spread through it in proportion to its mass (a uniform body force, like gravity) accelerates with no internal stress: Cauchy's equation of motion (div sigma + rho b = rho a, so sigma = 0 when b = a everywhere), and the equivalence principle (a freely falling body in a uniform field feels no internal stress; only tidal gradients stress it). Find a textbook, lecture-notes or NASA/agency statement that can be quoted (e.g. continuum-mechanics notes from a university, NASA's microgravity explainer). St … [1,844 more characters on this line; the full prompt is in prompts/a3a1db24e4f4d05c3.txt]
```

</details>

**Subagent `research:growth`** · rex-presence-research · started 2026-10-11 18:05:09 UTC

- facts: 36 (16 verified, 16 derived, 3 estimate, 1 disputed).
- Growth-mode physics for BRIEF-presence.md, checked against fetched sources and recomputed from the canon figures (3,007 kg, 3.048 m, 1,060 kg/m³, 2.84 m³, equivalent ball radius 0.878 m). (1) Worked examples.

<details>
<summary>Prompt, verbatim (7,331 characters)</summary>

Workflow run `wf_01258728-142`, phase `Research`, agent `aa3e2b5ce2b774005`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/aa3e2b5ce2b774005.txt](prompts/aa3e2b5ce2b774005.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

TOPIC "growth": the physics the growth modes need (brief, "What happens to absorbed energy").
(1) Check the brief's worked examples: Krakatoa 8.4e17 J, Chicxulub 4.2e23 J, the Sun's luminosity 3.828e26 W (IAU 2015 Resolution B3 nominal value): find primary or authoritative sources for each energy (existing facts energy_krakatoa_1883 is status claimed from Wikipedia: try to do better, e.g. a volcanology paper or USGS; energy_chicxulub_impact and energy_sun_luminosity exist: check them), c = 299,792,458 m/s exact (BIPM/CODATA). Recompute the mass added (E / c^2) and, from 3,007 kg and 3.048 m at 1,060 kg/m^3, the new height and density for the three growth forms: mix (volume and density  … [3,014 more characters on this line; the full prompt is in prompts/aa3e2b5ce2b774005.txt]
```

</details>

**Subagent `verify:comic`** · rex-presence-research · started 2026-10-11 18:30:06 UTC

- checks: 30 (21 ok, 9 not ok).
- Not OK: comic_gloc_not_before_5s; comic_layperson_centrifuge_tolerance; comic_eiband_voluntary_limits (+6 more).
- The sourcing is strong. Every quote I re-fetched matched its source, the ASTM chart readings agree with my own renders, and every derived number recomputes.

<details>
<summary>Prompt, verbatim (73,313 characters)</summary>

Workflow run `wf_01258728-142`, phase `Verify`, agent `ad58ad9e1874819fc`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/ad58ad9e1874819fc.txt](prompts/ad58ad9e1874819fc.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

You are a skeptical fact-checker for the topic "comic". Below are the researcher's facts and model recommendation. Re-fetch the cited URLs for every fact the page is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, unit conversion, quotation and status against what the source actually says; recompute every derived number with your own script. Mark ok=false with a correction for anything wrong, mislabelled (a secondary summary presented as the primary paper, an estimate or a fan source marked verified, a sample maximum called a limit, the wrong units or wrong peak/RMS basis), or unsupported. Judge the model recommendation: wrong physics, wrong formula, constants used outside the range they were fitted to, overstated certainty? List important missing items.

RESEARCH:
{
 "summary": "Research for the comic switches. All 30 facts are new and use the category \"comic\"; status counts are given below. Existing keys I rely on are named in the notes and in the recommendation: human_us_adult_male_mass, human_us_adult_female_mass, human_global_adult_mean_mass, human_projected_area, cd_bluff_body_tumbling_subsonic, earth_gm, earth_standard_gravity, collide_earth_inertia_rotation, toyota_corolla_curb_mass, atm_isa_sea_level_density, walking_running_peak_vertical_force, catch_breakup_ram_pressure, blast_window_breakage, blast_eardrum_rupture_threshold and blast_sonic_bo … [2,424 more characters on this line; the full prompt is in prompts/ad58ad9e1874819fc.txt]
 "facts": [
  {
   "key": "comic_cauchy_equation_of_motion",
   "category": "comic",
   "label": "Cauchy's equation of motion for a solid (Newton's second law for every bit of a body)",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "∇·σ + ρb = ρa (σ stress, ρ density, b body force per unit mass, a acceleration)",
   "sources": [
    {
     "title": "A. F. Bower, Applied Mechanics of Solids, §2.3.1 Linear momentum balance in terms of Cauchy stress (online text)",
     "url": "https://www.solidmechanics.org/text/Chapter2_3/Chapter2_3.htm"
    },
    {
     "title": "Equation image for §2.3.1 (eq0006), from the page above",
     "url": "https://www.solidmechanics.org/text/Chapter2_3/Chapter2_3_files/eq0006M.gif"
    },
    {
     "title": "A. F. Bower, Applied Mechanics of Solids, §2.2.1 Surface traction and internal body force",
     "url": "https://www.solidmechanics.org/text/Chapter2_2/Chapter2_2.htm"
    }
   ],
   "notes": "§2.3.1: 'Newton's third [sic] law of motion (F=ma) can be expressed as' ∇y·σ + ρb = ρa, or ∂σij/∂yi + ρbj = ρaj (equation shown as an image, which I downloaded and read). §2.2.1 separates the two ways forces reach a solid: '(i) A force can be applied to its boundary: examples include fluid pressure, wind loading, or forces arising from contact with another solid. (ii) The solid can be subjected to body forces, which act on the interior of the solid. Examples include gravitational loading, or electromagnetic forces.' Why it matters here: a grip, the ground and air pressure are boundary forces (tractions), and they are what stress a body. Gentle hold turns his push into a body force.",
   "who_when": "Bower, Applied Mechanics of Solids (CRC Press 2009; online edition)"
  },
  {
   "key": "comic_uniform_body_force_no_stress",
   "category": "comic",
   "label": "A push spread through a body in proportion to its mass accelerates it with no internal stress",
   "status": "derived",
   "value_si": 0,
   "unit_si": "Pa",
   "display": "If every kilogram gets the same push (b = a everywhere) and nothing touches the surface, stress = 0",
   "sources": [
    {
     "title": "Bower, Applied Mechanics of Solids §2.3.1 (equation of motion)",
     "url": "https://www.solidmechanics.org/text/Chapter2_3/Chapter2_3.htm"
    },
    {
     "title": "NASA EG-1997-08-110-HQ, Microgravity: A Teacher's Guide (apparent weight in free fall)",
     "url": "https://ntrs.nasa.gov/api/citations/19980007787/downloads/19980007787.pdf"
    }
   ],
   "notes": "Derivation from comic_cauchy_equation_of_motion. Let the total body force per unit mass be gravity plus his spread push: b = g + f/m, the same at every point (his push is in proportion to mass). The whole body then has the uniform acceleration a = b. Put σ = 0 into ∇·σ + ρb = ρa and you get ρb = ρa, which holds everywhere. The surface condition σ·n = t is also met, because no grip or support acts on the surface (t = 0). For a linear elastic body this solution is the only one (Kirchhoff's uniqueness theorem). That theorem is standard but I did not fetch a source for it. Gentle hold therefore adds no stress, and it removes the stress of the body's own weight too: held this way, a car does not sag, just as in orbit. What stays: (a) stresses already locked inside it that balance themselves, such as tyre pressure, bolt preload and residual stress; (b) loose contents not covered by the push, which would slide or slosh; (c) every surface force once it acts, such as air pressure on the front in flight, the ground at landing, or his hands if he grips normally. This is the same physics as free fall (comic_free_fall_apparent_weight). Eiband's finding that spreading the arresting force over the whole skeleton raises tolerance is the real-world direction of the same idea (comic_eiband_restraint_spreads_force).",
   "who_when": "This research, 2026"
  },
  {
   "key": "comic_free_fall_apparent_weight",
   "category": "comic",
   "label": "In free fall nothing feels its own weight: apparent weight P = m(a − g)",
   "status": "verified",
   "value_si": 0,
   "unit_si": "N",
   "display": "Apparent weight P = m(a_e − g); falling freely (a_e = g), P = 0: 'you are weightless'",
   "sources": [
    {
     "title": "NASA EG-1997-08-110-HQ, Microgravity: A Teacher's Guide with Activities in Science, Mathematics, and Technology (Rogers, Vogt & Wargo 1997), PDF pp. 14 and 17",
     "url": "https://ntrs.nasa.gov/api/citations/19980007787/downloads/19980007787.pdf"
    }
   ],
   "notes": "Elevator example (PDF p. 14): 'Your apparent weight P=m(ae-g)=(60 kg)(-9.8 m/s2-(-9.8 m/s2)) = 0 kg m/s2; you are weightless. The elevator car, the scale, and you would all be accelerating downward at the same rate, which is due to gravity alone.' PDF p. 17: 'the effects of gravity (apparent weight) can be removed quite easily by putting anything (a person, an object, an experiment) into a state of freefall.' The guide also quotes Einstein: 'If a person falls freely, he will not feel his own weight.' Use P = m(a − g) as the passenger's felt load: standing still gives 1 g, ballistic flight gives 0 g (plus drag), and his spread push gives 0 g while it acts.",
   "who_when": "NASA, 1997"
  },
  {
   "key": "comic_tidal_effects_from_gradients",
   "category": "comic",
   "label": "Only differences in the field (tides) stretch a freely falling body",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "Tidal acceleration along the line to a mass M at distance R: a_z = 2 z G M / R³ (z = offset from the centre of mass)",
   "sources": [
    {
     "title": "Benedetto (2026), Tidal forces and centrifugal gradients: a pedagogical clarification on the role of free fall and curvature, Revista Brasileira de Ensino de Física 48, doi:10.1590/1806-9126-RBEF-2026-0148",
     "url": "https://scielo.br/j/rbef/a/ynX4q9MB3HrTrVByNLW38HD/?lang=en"
    }
   ],
   "notes": "Quotes: 'tidal effects arise from spatial variations of the gravitational field rather than from the field itself'; in a uniform field 'neighboring freely falling particles experience no relative acceleration, and therefore no tidal effects are present'. Eq. 1: a_x = −xGM/R³, a_y = −yGM/R³, a_z = 2zGM/R³. This is the equivalence-principle half of the gentle-hold argument: a uniform push (or field) cannot stress a body, only its gradient can. RBEF is a peer-reviewed physics-teaching journal; this is a 2026 paper. Read through WebFetch.",
   "who_when": "Benedetto, RBEF 2026"
  },
  {
   "key": "comic_tidal_stress_car",
   "category": "comic",
   "label": "Tidal stretch on a 4 m car: Earth's tide versus his spread push",
   "status": "derived",
   "value_si": 0.0021,
   "unit_si": "N",
   "display": "Earth's tide: about 2 mN through the middle of a 1,340 kg, 4 m car standing on end (1 part in 6 million of its weight). His push spread through it at 10 g: zero",
   "sources": [
    {
     "title": "Benedetto 2026 (tidal formula)",
     "url": "https://scielo.br/j/rbef/a/ynX4q9MB3HrTrVByNLW38HD/?lang=en"
    },
    {
     "title": "Existing keys earth_gm, collide_earth_inertia_rotation (radius), toyota_corolla_curb_mass, earth_standard_gravity (research/final-*.json)",
     "url": "https://www.kbb.com/toyota/corolla/2026/specs"
    }
   ],
   "notes": "Inputs: GM = 3.986004e14 m³/s² (earth_gm), R = 6.371e6 m (collide_earth_inertia_rotation), m = 1,340.4 kg (toyota_corolla_curb_mass), L = 4 m. The gradient 2GM/R³ is 3.08e-6 s⁻². End to end, the tidal acceleration difference is 1.2e-5 m/s² (1.3e-6 g). For a uniform rod along the vertical, the tension at its middle is m L GM/(4R³) = 2.1e-3 N, against a weight of 13,145 N (ratio 1.6e-7). His push, spread in proportion to mass, gives the same acceleration to every kilogram, so its gradient is zero and so is the stress it adds, whatever the acceleration (10 g or 10⁶ g). For contrast, 10 g delivered through a grip puts m × 10 g = 131 kN through his hands, plus the 13 kN weight. The 4 m length is the task's round figure; the Corolla is 4.63 m. Script: scratchpad research/comic/scripts/derive.py.",
   "who_when": "This research, 2026"
  },
  {
   "key": "comic_eiband_restraint_spreads_force",
   "category": "comic",
   "label": "Spreading the force over the whole body is what raises tolerance (Eiband 1959)",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "'Survival of impact forces increases with increased distribution of the arresting force to the entire skeleton'; people cannot move against more than 2–3 g",
   "sources": [
    {
     "title": "Eiband (1959), Human Tolerance to Rapidly Applied Accelerations: A Summary of the Literature, NASA Memorandum 5-19-59E (NTRS 19980228043)",
     "url": "https://ntrs.nasa.gov/api/citations/19980228043/downloads/19980228043.pdf"
    }
   ],
   "notes": "Conclusions: 'complete torso and extremity support is the primary variable in increasing survival of rapidly applied accelerations. Therefore, survival of impact forces increases with increased distribution of the arresting force to the entire skeleton, for blows from all directions.' 'Voluntary muscular restraint demonstrated in live experiments': 'muscular effort is inadequate for resisting anything but the mildest of impacts' and 'human beings unable to move their bodies against forces exceeding 2 or 3 times normal body weight (2 or 3 G's).' Real-world support for gentle hold and safe passenger: a perfectly spread push is the limiting case. It also warns that a person held only by hands, with no seat or harness, is far worse off than the harnessed volunteers behind the tolerance numbers.",
   "who_when": "Eiband, NASA Lewis, 1959"
  },
  {
   "key": "comic_astm_f2291_ride_limits",
   "category": "comic",
   "label": "Amusement-ride acceleration limits for the general public (ASTM F2291-06a)",
   "status": "verified",
   "value_si": 58.84,
   "low_si": 19.61,
   "high_si": 58.84,
   "unit_si": "m/s^2",
   "display": "Head-to-foot (+Gz) or pressed into the seat back (+Gx): 6 g for 0.2–1 s, 4 g for 2–4 s, 3 g for 5–11.8 s, then 2 g (+Gz) or 2.5 g (+Gx). Sideways 3 g → 2 g. Eyes-front 1.5 g. Eyes-up 1.5 g → 1.1 g",
   "values_json": "{\"edition\":\"ASTM F2291-06a (2006), Figs. 6-10, base case unless stated\",\"units\":\"G (9.81 m/s^2), total net acceleration including Earth's gravity; duration in s; points read from the charts and joined by straight lines\",\"+Gz eyes down, all restraints (Fig. 10)\":[[0.2,6],[1,6],[2,4],[4,4],[5,3],[11.8,3],[12,2],[\"steady\",2]],\"+Gx eyes back, base case with headrest (Fig. 6)\":[[0.2,6],[1,6],[2,4],[4,4],[5,3],[11.8,3],[12,2.5],[\"steady\",2.5]],\"+-Gy eyes left or right (Fig. 8)\":[[0.2,3],[1,3],[2,2],[\"steady\",2]],\"-Gx eyes front, base case (Fig. 7)\":[[0.2,-2],[0.5,-1.5],[\"steady\",-1.5]],\"-Gx over-the-shoulder restraint (Fig. 7)\":[[\"all\",-2]],\"-Gx prone restraint (Fig. 7)\":[[0.2,-3.5],[2,-3.5],[3,-2.5],[4,-2.5],[5,-2],[\"steady\",-2]],\"-Gz eyes up, base case (Fig. 9)\":[[0.2,-2],[0.5,-1.5],[4,-1.5],[7,-1.1],[\"steady\",-1.1]],\"-Gz extended, special restraints (Fig. 9)\":[[0.2,-2.8],[1,-2.2],[3,-1.5]]}",
   "sources": [
    {
     "title": "ASTM F2291-06a Standard Practice for Design of Amusement Rides and Devices, as incorporated by reference (Indiana 685 IAC 1-2-9) and posted by Public.Resource.Org",
     "url": "https://ia800607.us.archive.org/34/items/gov.law.astm.f2291.2006/astm.f2291.2006.pdf"
    }
   ],
   "notes": "Text, §3.1.1–3.1.2: impact means 'accelerations with duration of less than 200 ms'; sustained means 'greater than or equal to 200 ms'. §7.1.4.2: 'Impacts of less than 200 ms duration are not addressed by this practice.' §7.1.4.3: limits are 'for patrons 48 in. in height and above'. §7.1.4.4: 'do not address patrons with specific physical limitations.' §7.1.4.5: 'The limits specified for all axes are for total net acceleration, inclusive of earth's gravity. A motionless body would therefore have a magnitude of 1 G measured in the axis perpendicular to the earth's surface'. §7.1.4.6 … [1,155 more characters on this line; the full prompt is in prompts/ad58ad9e1874819fc.txt]
   "who_when": "ASTM International, F2291-06a (2006)"
  },
  {
   "key": "comic_nasa_std3001_seated_limits",
   "category": "comic",
   "label": "NASA sustained acceleration limits for seated, restrained astronauts (upper bound, not for ordinary people)",
   "status": "verified",
   "value_si": 81.4,
   "low_si": 39.2,
   "high_si": 186,
   "unit_si": "m/s^2",
   "display": "Non-deconditioned seated crew: head-to-foot (+Az) 81.4 m/s² (8.3 g) at 0.5 s, 62.8 (6.4 g) at 5 s, 39.2 (4.0 g) at 1,200 s. Chest-to-back (+Ax) 186 (19 g) at 0.5 s, 157 (16 g) at 5 s, 73.5 (7.5 g) at 300 s",
   "values_json": "{\"source\":\"NASA-STD-3001 Vol 2 Rev F, Tables 6.5-1 to 6.5-3 (seated)\",\"units\":\"duration s : acceleration m/s^2\",\"Ax non-deconditioned upper\":{\"0.5\":186,\"5\":157,\"300\":73.5},\"Ax non-deconditioned lower\":{\"0.5\":-216,\"5\":-147,\"120\":-58.8,\"400\":-39.2},\"Ax emergency upper\":{\"0.5\":373,\"120\":86.3,\"300\":73.5,\"1200\":49.0},\"Az non-deconditioned upper\":{\"0.5\":81.4,\"5\":62.8,\"1200\":39.2},\"Az non-deconditioned lower\":{\"0.5\":-58.8,\"5\":-37.3,\"60\":-21.6,\"1200\":-9.81},\"Az emergency upper\":{\"0.5\":167,\"120\":58.8,\"1200\":37.3},\"Ay non-deconditioned (both signs)\":{\"0.5\":29.4,\"1000\":19.6}}",
   "sources": [
    {
     "title": "NASA-STD-3001 Volume 2 Revision F (approved 2026-07-14), §6.5.1 [V2 6064], Tables 6.5-1 to 6.5-3",
     "url": "https://standards.nasa.gov/system/files/tmp/NASA-STD-3001%20Vol%202%20Rev%20F.pdf"
    },
    {
     "title": "NASA OCHMO Technical Brief OCHMO-TB-024 Occupant Protection (sustained >0.5 s; transient ≤0.5 s)",
     "url": "https://www.nasa.gov/sites/default/files/atoms/files/acceleration_technical_brief_ochmo.pdf"
    }
   ],
   "notes": "[V2 6064]: 'The system shall limit the magnitude, direction, and duration of crew exposure to sustained (> 0.5 seconds) translational acceleration by staying below the limits in Figures 6.5-(2-7) and Tables 6.5-(1-6) for seated and standing postures.' Rationale: 'The limits in these figures represent safe levels of sustained translational acceleration'; 'All limits further assume adequate restraint(s)'; 'Unless stated otherwise, all limits also assume the crew is wearing a lower body compression garment'. Axes: '+X: Body accelerations forward/Eyes back'; '+Z: Body accelerations up/Eyes down'. Use only as context: these are for trained, screened, strapped-in astronauts in compression garments. An ordinary person held by Rex has none of that. The Rev D PDF link on nasa.gov returned 404; Rev F (whose history says §6.5.1 [V2 6064] changed) is the copy I fetched. The standards site's path ('system/files/tmp') is odd, but the document is NASA's own and signed off as approved.",
   "who_when": "NASA OCHMO, Rev F 2026"
  },
  {
   "key": "comic_nasa_standing_vs_seated_gz",
   "category": "comic",
   "label": "Relaxed head-to-foot tolerance: 2–5 g standing, 7–9 g seated",
   "status": "verified",
   "value_si": 19.62,
   "low_si": 19.62,
   "high_si": 49.05,
   "unit_si": "m/s^2",
   "display": "Non-straining standing +Gz tolerance 19.6–49.1 m/s² (2–5 g); seated 68.7–88.3 m/s² (7–9 g)",
   "sources": [
    {
     "title": "Pattarini et al. (2020), Artemis Sustained Translational Acceleration Limits: Human Tolerance Evidence from Apollo to International Space Station, NASA/TM-20205008196, pp. 1–2",
     "url": "https://www.nasa.gov/wp-content/uploads/2023/03/tm-20205008196.pdf"
    }
   ],
   "notes": "Quote: 'The range of non-straining, standing +Gz (head-to-foot) tolerance ranges from 19.62-49.05 m/s2 for healthy subjects, contrasted with 68.67-88.29 m/s2 for seated subjects of both sexes (33, 13, 5, 3, 4, 7).' Also: 'Humans experience a 10% to 20% decrease in cardiac output with a shift from seated to standing posture'. Use: a passenger carried upright (standing or dangling) tolerates far less head-to-foot g than a seated rider. The seated figures are higher than Cochran's relaxed unconsciousness mean of 5.4 g (comic_relaxed_gz_thresholds_cochran), probably because of different end points; the TM does not define its tolerance end point. Use the range for direction and posture, not as an injury limit.",
   "who_when": "NASA JSC, 2020"
  },
  {
   "key": "comic_gz_symptoms_fraser",
   "category": "comic",
   "label": "What steady g feels like, by direction (Fraser 1966 compilation)",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "+Gz: 2 g heavier; 2.5 g hard to get up; 3–4 g vision dims after 3–4 s; 4.5–6 g blackout after about 5 s, then unconsciousness. +Gx: 2 g tolerable for at least 24 h, 4 g for at least 60 min",
   "values_json": "{\"+Gz (head-to-foot)\":{\"1 G\":\"Equivalent to the erect or seated terrestrial posture\",\"2 G\":\"Increase in weight, increased pressure on buttocks, drooping of face and soft body tissues\",\"2.5 G\":\"Difficult to raise oneself\",\"3-4 G\":\"Impossible to raise oneself ... progressive dimming of vision after 3 to 4 seconds, progressing to tunneling of vision\",\"4.5-6 G\":\"Diminution of vision, progressive to blackout after about 5 seconds; hearing and then consciousness lost if exposure continued\"},\"-Gz (foot-to-head)\":{\"-1 G\":\"Unpleasant but tolerable facial suffusion and congestion\",\"-2 to -3 G\":\"Severe facial congestion, throbbing headache ... after 5 seconds\",\"-5 G\":\"Five seconds, limit of tolerance, rarely reached by most subjects\"},\"+Gx (chest-to-back)\":{\"2-3 G\":\"2 Gx tolerable at least to 24 hours, 4 Gx up to at least 60 minutes\",\"3-6 G\":\"Progressive tightness in chest (6 Gx, 5 minutes), chest pain, loss of peripheral vision, difficulty in breathing and speaking\",\"6-9 G\":\"Increased chest pain and pressure; breathing difficult\",\"15 G\":\"Extreme difficulty in breathing and speaking; severe vise-like chest pain\"},\"+Gy (lateral)\":{\"3 G\":\"Discomfort after 10 seconds ... petechiae and bruising\",\"5 G (14.5 s)\":\"External hemorrhage, severe postrun headache\"}}",
   "sources": [
    {
     "title": "Parker & West (eds.), Bioastronautics Data Book, 2nd ed., NASA SP-3006 (1973), ch. 4 Sustained Linear Acceleration, pp. 150–152 (PDF pp. 160–162)",
     "url": "https://ntrs.nasa.gov/api/citations/19730006364/downloads/19730006364.pdf"
    }
   ],
   "notes": "'The following compilation is derived from the study by Fraser (1966).' The quotes are in values_json. Subjects were centrifuge volunteers, mostly seated and restrained; the onset rates are not given. Use for page wording, such as 'feels twice as heavy' or 'vision dims after a few seconds', not as limits.",
   "who_when": "Fraser 1966, in NASA SP-3006, 1973"
  },
  {
   "key": "comic_relaxed_gz_thresholds_cochran",
   "category": "comic",
   "label": "Relaxed head-to-foot g at which vision and consciousness fail (means of a large group)",
   "status": "verified",
   "value_si": 52.96,
   "low_si": 40.21,
   "high_si": 52.96,
   "unit_si": "m/s^2",
   "display": "Loss of peripheral vision 4.1 ± 0.7 g (range 2.2–7.1); blackout 4.7 ± 0.8 g (2.7–7.8); unconsciousness 5.4 ± 0.9 g (3.0–8.4)",
   "values_json": "{\"units\":\"G, +Gz (head-to-foot), mean / standard deviation / range\",\"Loss of peripheral vision\":[4.1,0.7,\"2.2-7.1\"],\"Blackout\":[4.7,0.8,\"2.7-7.8\"],\"Unconsciousness\":[5.4,0.9,\"3.0-8.4\"]}",
   "sources": [
    {
     "title": "Bioastronautics Data Book, NASA SP-3006 (1973), Table 4-4 'Range of Visual Thresholds in Relation to Unconsciousness' (after Cochran et al., 1954), p. 157 (PDF p. 167)",
     "url": "https://ntrs.nasa.gov/api/citations/19730006364/downloads/19730006364.pdf"
    }
   ],
   "notes": "Checked on the rendered page image: 'Loss of peripheral vision 4.1 ±0.7 2.2 – 7.1; Blackout 4.7 ±0.8 2.7 – 7.8; Unconsciousness 5.4 ±0.9 3.0 – 8.4 (After Cochran et al., 1954)'. The table does not state onset rate, posture or exposure time. Cochran et al. tested relaxed seated subjects on a centrifuge, but I did not fetch that paper. These thresholds apply only to head-to-foot g held for several seconds (blood drains from the head). They do not apply to brief pulses (comic_gloc_not_before_5s), to chest-to-back g, or to a passenger under his spread push (no felt g, so no blood shift).",
   "who_when": "Cochran et al. 1954, in NASA SP-3006, 1973"
  },
  {
   "key": "comic_gloc_not_before_5s",
   "category": "comic",
   "label": "Blacking out from g takes at least 5 seconds",
   "status": "verified",
   "value_si": 5,
   "unit_si": "s",
   "display": "In 888 centrifuge G-LOC episodes, no one lost consciousness in under 5 s (mean about 9 s for onset ≥1 g/s); lowest threshold level +4.7 g",
   "sources": [
    {
     "title": "Whinnery & Forster (2013), The +Gz-induced loss of consciousness curve, Extreme Physiology & Medicine 2:19, doi:10.1186/2046-7648-2-19 (full text via Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC3710154/fullTextXML"
    }
   ],
   "notes": "Abstract: 'for onset rates ≥ 1.0 G/s, G-LOC will occur in a mean time of 9.10 s and is independent of the onset rate'; 'The minimum +Gz-level threshold tolerance was defined as +4.7 Gz'; 'When +Gz onset rates are gradual, ≤ 0.2 G/s, G-LOC occurs in a mean time of 74.41 s. G-LOC did not occur earlier than 5 s for any acceleration exposure.' Caveat from the paper: the episodes were 'mostly in experienced military fighter pilots', and 'There was no separation of relaxed subjects, subjects performing an anti-G straining maneuver (AGSM), subjects wearing or without anti-G suits'. Across the whole set, +Gz at G-LOC ranged from +2.5 to +11.7. Use: a throw or catch lasting under 5 s cannot knock a passenger out through blood loss to the head, even at high head-to-foot g; injury from force is the limit there.",
   "who_when": "Whinnery & Forster 2013"
  },
  {
   "key": "comic_layperson_centrifuge_tolerance",
   "category": "comic",
   "label": "Ordinary people (would-be space tourists) on a centrifuge: up to +6 Gx and +4 Gz tolerated",
   "status": "verified",
   "value_si": 58.84,
   "low_si": 34.32,
   "high_si": 58.84,
   "unit_si": "m/s^2",
   "display": "Screened, seated, restrained laypeople aged 20–88: peaks +3.5 to +4.0 Gz and +6.0 Gx (combined peaks about 5 s) tolerated; grey-out common (69–88%), one G-LOC in 24",
   "sources": [
    {
     "title": "Blue et al. (2012), Commercial spaceflight participant G-force tolerance during centrifuge-simulated suborbital flight, Aviat Space Environ Med 83:929, doi:10.3357/asem.3351.2012 (abstract, Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:23066613%20AND%20SRC:MED&format=json&resultType=core"
    },
    {
     "title": "Blue et al. (2014), Tolerance of centrifuge-simulated suborbital spaceflight by medical condition, Aviat Space Environ Med 85:721, doi:10.3357/asem.3956.2014 (abstract, Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:25022160%20AND%20SRC:MED&format=json&resultType=core"
    },
    {
     "title": "Suresh et al. (2017), Dysrhythmias in laypersons during centrifuge-simulated suborbital spaceflight, Aerosp Med Hum Perform 88:1008, doi:10.3357/amhp.4910.2017 (abstract, Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:29046176%20AND%20SRC:MED&format=json&resultType=core"
    },
    {
     "title": "Smith et al. (2022), Physiological effects of centrifuge-simulated suborbital spaceflight, Aerosp Med Hum Perform 93:830, doi:10.3357/amhp.6153.2022 (abstract, Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:36757241%20AND%20SRC:MED&format=json&resultType=core"
    }
   ],
   "notes": "Blue 2012: '77 individuals (65 men, 12 women), 22-88 yr old ... two +Gz runs (peak = 3.5+Gz, run 2) and two +Gx runs (peak = 6.0+Gx, run 4)'; 'most individuals with well-controlled medical conditions can withstand acceleration forces involved in launch/landing profiles'. Blue 2014: '86 (63 men, 23 women, age 20-78 yr)'; combined profiles 'peak = +6.0 G(x)/+4.0 G(z)'; complaints 'grayout (69%), nausea (20%), and chest discomfort (6%)'; 'no subject experienced significant adverse physiological responses'. Suresh 2017: 148 subjects; 'peak +4.0 Gz, +6.0 Gx, duration 5 s'; dysrhythmias were seen but 'None were associated with subjective symptoms or objective signs of acceleration intolerance'. Smith 2022: 24 healthy subjects aged 18–80; '88% of subjects reporting greyout and 29% reporting blackout. There was one episode of G-LOC'. These are abstracts only. Everyone was medically screened, briefed, seated in a centrifuge seat and strapped in: a best case for an untrained person, not a person held in someone's arms. value_si is the +6 Gx peak; low_si is +3.5 Gz.",
   "who_when": "UTMB / NASTAR and UK centrifuge groups, 2012–2022"
  },
  {
   "key": "comic_eiband_voluntary_limits",
   "category": "comic",
   "label": "Brief jolts volunteers took uninjured in a full harness (Eiband 1959)",
   "status": "verified",
   "value_si": 392.3,
   "low_si": 98.07,
   "high_si": 441.3,
   "unit_si": "m/s^2",
   "display": "Spineward, full harness: 45 g for 0.044 s, 40 g for 0.1 s, 25 g for 0.2 s, 13 g for 0.6 s, 10 g for 1.6 s. Animals survived with moderate injury up to 56 g for 0.037 s and 43 g for 0.11 s (chimpanzees), 160 g for 0.004 s (hog)",
   "values_json": "{\"units\":\"G and seconds; trapezoidal pulses; onset about 500 G/s unless stated\",\"spineward, voluntary uninjured (lap, shoulder, thigh straps; the longer ones also chest, arm, leg, helmet straps)\":{\"0.044\":45,\"0.1\":40,\"0.2\":25,\"0.6\":13,\"1.6\":10},\"sternumward, voluntary\":{\"0.12\":30,\"0.19\":21},\"headward (ejection seat)\":\"20 G for 0.005-0.5 s assumed tolerable (from cadaver vertebra strength); 16 G for up to 0.04 s endured with lap, shoulder straps and face curtain\",\"moderate injury, animals (spineward)\":{\"chimpanzee\":\"56 G for 0.037 s; 43 G for 0.110 s\",\"hog\":\"160 G for about 0.004 s (upper limit of moderate injury)\"},\"moderate injury, human\":\"25 G for 0.93 s (Stapp): debilitated, normal duty in five days\"}",
   "sources": [
    {
     "title": "Eiband (1959), NASA Memorandum 5-19-59E, pp. 6–7 and 'Survival of Headward Accelerations' (NTRS 19980228043)",
     "url": "https://ntrs.nasa.gov/api/citations/19980228043/downloads/19980228043.pdf"
    }
   ],
   "notes": "Memo p. 6: 'subjects have endured maximum uniform accelerations of 45 G's for 0.044 second with no injurious or debilitating (weakening) effects'; 'the upper limit of voluntary tolerance decreases to a magnitude of 40 G's for intervals of 0.1-second duration and to 25 G's when the interval is increased to 0.2 second'; 'When the subject was restrained by chest, arm, leg, and helmet straps in addition to the experimental lap, shoulder, and thigh straps, exposures of 13 G's for 0.6 second and 10 G's for 1.6 seconds could be tolerated'; 'all straps were drawn up tighter than a person usually would wear them'. Memo p. 7, checked on the page image: 'chimpanzee subjects have endured plateau accelerations of 56 G's for 0.037 second and 43 G's for 0.110 second'; hog 160 G for about 0.004 s. Headward: 'a 20-G acceleration of 0.005- to 0.5-second duration would be tolerable'. 'Tolerable' is defined as 'one in which the subject is not debilitated or traumatically injured'. Every number assumes a full harness on a rigid seat, which is the opposite of a person held by hand.",
   "who_when": "Eiband, NASA Lewis, 1959"
  },
  {
   "key": "comic_impact_survived_with_injury",
   "category": "comic",
   "label": "Impacts people survived with injury: 25 g for 0.93 s; 83 g for 0.04 s",
   "status": "verified",
   "value_si": 814,
   "low_si": 245.2,
   "high_si": 814,
   "unit_si": "m/s^2",
   "display": "25 g for 0.93 s: debilitated, back on duty in 5 days (Eiband). 83 g chest acceleration for 0.04 s: survived 'with reversible injuries' (Beeding & Mosely 1960). Air Force design limit about 45 g for 0.1 s, 25 g for 0.2 s",
   "sources": [
    {
     "title": "Eiband (1959), NASA Memorandum 5-19-59E, p. 7",
     "url": "https://ntrs.nasa.gov/api/citations/19980228043/downloads/19980228043.pdf"
    },
    {
     "title": "Bioastronautics Data Book, NASA SP-3006 (1973), ch. 6 Impact, p. 229 (PDF p. 239)",
     "url": "https://ntrs.nasa.gov/api/citations/19730006364/downloads/19730006364.pdf"
    }
   ],
   "notes": "Eiband p. 7 (from the page image): 'The single human exposure to 25 G's for 0.93 second (fig. 2) completes the limit of the moderate-injury area ... the subject was debilitated but conscious ... he could neither see nor maintain a standing posture. The subject returned to normal duty in five days.' SP-3006 p. 229: 'Humans have survived impact, with reversible injuries, at a level of 83 G (chest acceleration, not actual input) at 3800 G/sec for 0.04 second's duration (Beeding & Mosely, 1960).' Also: 'Air Force design recommendations are approximately 45 G for a duration of 0.1 second and 25 G for a duration of 0.2 second (U.S. Air Force, 1969). Restraint in the experiments establishing these limits was by means of a double harness with 3 inch wide shoulder straps, a seat belt with thigh straps, and a chest belt. With a less adequate restraint system, some debilitation and injury may occur at these levels'. All harnessed; nothing comparable exists for a person held in hands.",
   "who_when": "Eiband 1959; Parker & West (NASA SP-3006) 1973"
  },
  {
   "key": "comic_passenger_felt_g",
   "category": "comic",
   "label": "The g a passenger feels: the push from what holds them, net of gravity",
   "status": "derived",
   "value_si": 9.80665,
   "unit_si": "m/s^2",
   "display": "n = |a − g| / g (vectors). Standing still: 1 g. Lifted at 1 g: 2 g. Thrown (ballistic): 0 g plus drag. Under his spread push: 0 g",
   "sources": [
    {
     "title": "ASTM F2291-06a §7.1.4.5 (limits are total net acceleration including gravity)",
     "url": "https://ia800607.us.archive.org/34/items/gov.law.astm.f2291.2006/astm.f2291.2006.pdf"
    },
    {
     "title": "NASA EG-1997-08-110-HQ (apparent weight P = m(a − g))",
     "url": "https://ntrs.nasa.gov/api/citations/19980007787/downloads/19980007787.pdf"
    }
   ],
   "notes": "Formula: felt acceleration = (sum of contact forces)/m = a − g, with g pointing down. A horizontal push of a gives n = √(a² + g²)/g, so a felt 2, 4 or 6 g needs a horizontal acceleration of 1.73, 3.87 or 5.92 g. A vertical launch at a gives n = a/g + 1. Air drag in flight is a contact force on the front, so it is felt: n_drag = ½ρv²C_dA/(m g) (comic_passenger_drag_g). Compare this n with the ASTM, NASA, Cochran and Eiband limits, all of which are net g.",
   "who_when": "This research, 2026"
  },
  {
   "key": "comic_passenger_no_harm_limit",
   "category": "comic",
   "label": "Recommended 'no harm' limit for a passenger (safe passenger switch off)",
   "status": "estimate",
   "value_si": 58.84,
   "low_si": 19.61,
   "high_si": 58.84,
   "unit_si": "m/s^2",
   "display": "Supported on back or seat, pushed from behind or below: 6 g net for up to 1 s, 4 g at 2–4 s, 3 g at 5–11.8 s, 2 g after. Sideways 3 g → 2 g. Eyes-front 1.5 g. Eyes-up 1.1 g sustained. Pulses under 0.2 s: keep 6 g (conservative)",
   "values_json": "{\"basis\":\"ASTM F2291-06a base case (comic_astm_f2291_ride_limits)\",\"units\":\"G net (including gravity), duration s, linear between points\",\"default: supported back or seat (+Gz / +Gx)\":[[0,6],[1,6],[2,4],[4,4],[5,3],[11.8,3],[12,2],[90,2]],\"sideways (Gy)\":[[0,3],[1,3],[2,2],[90,2]],\"eyes front (-Gx)\":[[0,2],[0.2,2],[0.5,1.5],[90,1.5]],\"eyes up (-Gz)\":[[0,2],[0.2,2],[0.5,1.5],[4,1.5],[7,1.1],[90,1.1]],\"no head support\":\"above 1.5 G for at most 4 s (ASTM Fig. 6 note)\"}",
   "sources": [
    {
     "title": "ASTM F2291-06a Figs. 6–10",
     "url": "https://ia800607.us.archive.org/34/items/gov.law.astm.f2291.2006/astm.f2291.2006.pdf"
    },
    {
     "title": "Eiband 1959 (shorter pulses are tolerated at higher g)",
     "url": "https://ntrs.nasa.gov/api/citations/19980228043/downloads/19980228043.pdf"
    }
   ],
   "notes": "Recommendation, built from verified sources. Why ASTM: it is the only published design limit for the general public (any healthy rider 48 in or taller, with no training), and it sits well inside the layperson centrifuge results (comic_layperson_centrifuge_tolerance) and the NASA crew limits. Choices I made, each an estimate: (1) ASTM does not cover pulses under 200 ms. I keep the 0.2 s value (6 g) for them, which is conservative, because Eiband shows tolerance rises as pulses get shorter. (2) +Gz takes 2 g from 12 s and +Gx takes 2.5 g; the default uses 2 g. (3) ASTM assumes a seat, restraint and headrest. If Rex cradles the passenger, his arms and chest stand in for them, but a grip on soft tissue is not a seat. Treat the envelope as best case and say so on the page. ASTM's own note for riders with no headrest is 'max duration of above 1.5 g is 4 seconds'. (4) Children under 48 in are not covered.",
   "who_when": "This research, 2026"
  },
  {
   "key": "comic_passenger_injury_level",
   "category": "comic",
   "label": "Recommended 'survivable but injurious' level for a passenger",
   "status": "estimate",
   "value_si": 392.3,
   "low_si": 98.07,
   "high_si": 814,
   "unit_si": "m/s^2",
   "display": "Injury likely above Eiband's voluntary line even in a full harness: 45 g at 0.044 s, 40 g at 0.1 s, 25 g at 0.2 s, 13 g at 0.6 s, 10 g at 1.6 s. People have survived, injured, 25 g for 0.93 s and 83 g for 0.04 s. Held by hands, with no harness: unknown, and far lower",
   "values_json": "{\"units\":\"G net, duration s\",\"injury-likely line (harnessed volunteers' limit)\":[[0.044,45],[0.1,40],[0.2,25],[0.6,13],[1.6,10]],\"survived with injury (humans, harnessed)\":[[0.04,83,\"reversible injuries, chest acceleration\"],[0.93,25,\"debilitated, back on duty in 5 days\"]],\"head-to-foot held over 5 s\":\"grey-out from about 4.1 G, unconsciousness about 5.4 G (means)\"}",
   "sources": [
    {
     "title": "Eiband 1959, NASA Memo 5-19-59E",
     "url": "https://ntrs.nasa.gov/api/citations/19980228043/downloads/19980228043.pdf"
    },
    {
     "title": "Bioastronautics Data Book, NASA SP-3006 (1973), p. 229 and Table 4-4",
     "url": "https://ntrs.nasa.gov/api/citations/19730006364/downloads/19730006364.pdf"
    }
   ],
   "notes": "Recommendation. Page bands, in order: (a) under comic_passenger_no_harm_limit means 'no harm'. (b) Between that and Eiband's voluntary line means 'beyond what rides allow; bruising or worse for anyone not strapped into a proper seat'. Nothing is sourced for an unrestrained person in this band, so call it unknown. (c) Above Eiband's line means 'injury likely; survivable only with full support' (25 g for 0.93 s and 83 g for 0.04 s are the human survived-with-injury points). (d) Head-to-foot g held for more than 5 s: also flag grey-out, blackout and unconsciousness (comic_relaxed_gz_thresholds_cochran, comic_gloc_not_before_5s). I found no source for where death begins for an unrestrained person, so the page should not claim one. Interpolate on log-log axes between points.",
   "who_when": "This research, 2026"
  },
  {
   "key": "comic_passenger_gentlest_throw",
   "category": "comic",
   "label": "Fastest throw of a person that stays inside the no-harm limit (switch off)",
   "status": "estimate",
   "value_si": 16.8,
   "low_si": 9.1,
   "high_si": 16.8,
   "unit_si": "m/s",
   "display": "Over Rex's 2.4 m throwing stroke at 6 g felt: release at about 17 m/s in 0.3 s, which carries about 29 m on flat ground (no drag). At 4 g: 14 m/s, 19 m. At 2 g: 9 m/s, 8 m",
   "sources": [
    {
     "title": "Engine body.strokes.throw = 1.6 × (H/2 m) (rex-strength-lab/src/engine.js makeBody), with comic_passenger_no_harm_limit",
     "url": "https://ia800607.us.archive.org/34/items/gov.law.astm.f2291.2006/astm.f2291.2006.pdf"
    }
   ],
   "notes": "Formula: for a horizontal push, a = g√(n² − 1); v = √(2 a d); push time t = 2d/v; flat-ground range at 45° with no drag is v²/g (release height ignored). Here d = 1.6 × 3.048/2 = 2.44 m, the engine's throw stroke for a 10 ft body, itself an estimate. At n = 6: a = 5.92 g, v = 16.8 m/s, t = 0.29 s, range 29 m. At n = 4: 13.6 m/s, 0.36 s, 19 m. At n = 2: 9.1 m/s, 0.54 s, 8 m. Catching them back at the same limit needs the same stroke (a catch is the throw in reverse); a landing on the ground is a separate impact. Status is estimate because the stroke and the 6 g rule are estimates. Script: scratchpad research/comic/scripts/derive.py.",
   "who_when": "This research, 2026"
  },
  {
   "key": "comic_passenger_drag_g",
   "category": "comic",
   "label": "Air drag felt by a flying person, by speed (not removed by safe passenger once released)",
   "status": "estimate",
   "value_si": 108,
   "low_si": 44,
   "high_si": 108,
   "unit_si": "m/s",
   "display": "For a 90 kg adult tumbling (area 0.67 m², C_d 1.1): drag decelerates them at 1 g at 44 m/s, 2 g at 63 m/s, 4 g at 89 m/s, 6 g at 108 m/s",
   "sources": [
    {
     "title": "Existing keys human_us_adult_male_mass (CDC), human_projected_area (estimate), cd_bluff_body_tumbling_subsonic (estimate), atm_isa_sea_level_density",
     "url": "https://www.cdc.gov/nchs/fastats/body-measurements.htm"
    }
   ],
   "notes": "Formula: v = √(2 n g m / (ρ C_d A)), with m = 90.26 kg, A = 0.67 m² (orientation mean, an estimate), C_d = 1.1 (estimate), ρ = 1.225 kg/m³. The deceleration scales as A·C_d/m: falling head first (0.11 m² box face), 6 g comes only at about 270 m/s; broadside (0.79 m²), at about 100 m/s. The 1 g speed (44 m/s) is the tumbling terminal velocity. Drag acts on the front surface, so it is felt; safe passenger stops when he lets go. Wind-blast injury to an unprotected person at high dynamic pressure was not researched (see gaps). Status is estimate because A and C_d are estimates.",
   "who_when": "This research, 2026"
  },
  {
   "key": "comic_airblast_rattle_onset",
   "category": "comic",
   "label": "Airblast at which people start to notice rattling: about 120 dB (20 Pa)",
   "status": "verified",
   "value_si": 20,
   "low_si": 20,
   "high_si": 100,
   "unit_si": "Pa",
   "display": "Rattling complaints above about 120 dB (20 Pa, 0.003 psi); at 134 dB (100 Pa) 5–10% of homes show rattling or fright disturbances",
   "sources": [
    {
     "title": "Siskind, Stachura, Stagg & Kopp (1980), Structure Response and Damage Produced by Airblast from Surface Mining, US Bureau of Mines RI 8485, pp. 56 and 66–67 (PDF pp. 64, 72); copy hosted in the Resolution Copper EIS reference library",
     "url": "https://www.resolutionmineeis.us/sites/default/files/references/siskind-et-al-1980.pdf"
    }
   ],
   "notes": "'complaints about rattling occur at airblast levels exceeding about 120 dB (6Hz), roughly corresponding to wall acceleration of 0.1 to 0.2 g'. Also: 'Accelerations that cause something to rattle, move, and tilt, vary from 0.1 to 1.0 g ... A wall acceleration of 0.5 g is sufficient to shake most items'. Conclusions: 'Levels exceeding 120 dB will produce some annoyance from rattling and fright, with as much as 5 to 10 pct of homes exhibiting such disturbances at the maximum level of 134 dBL (0.1-Hz high-pass).' Midwall motions 'are primarily responsible for window sashes rattling, picture frames tilting, dishes jiggling, and knick-knacks falling.' Conversion: p = 20 µPa × 10^(dB/20), so 120 dB = 20 Pa and 134 dB = 100 Pa. The same formula reproduces RI 8485's own pairs (0.10 psi = 151 dB). Caveat: these are mine and quarry blasts, which are low frequency and long. A short, sharp pulse such as a clap needs a higher peak to rattle a house (comic_airblast_sash_rattle_small_shots).",
   "who_when": "US Bureau of Mines, 1980"
  },
  {
   "key": "comic_airblast_safe_max",
   "category": "comic",
   "label": "Airblast safe for houses (US mining regulation): 134 dB peak, about 100 Pa",
   "status": "verified",
   "value_si": 100.2,
   "low_si": 56.4,
   "high_si": 100.2,
   "unit_si": "Pa",
   "display": "134 dB (0.1 Hz system) = 100 Pa; 133 dB (2 Hz) = 89 Pa; 129 dB (6 Hz) = 56 Pa; 105 dBC (C-weighted, slow)",
   "values_json": "{\"units\":\"lower frequency limit of measuring system : maximum peak level\",\"0.1 Hz or lower, flat\":\"134 dB peak (100 Pa)\",\"2 Hz or lower, flat\":\"133 dB peak (89 Pa)\",\"6 Hz or lower, flat\":\"129 dB peak (56 Pa)\",\"C-weighted, slow\":\"105 dBC peak\"}",
   "sources": [
    {
     "title": "30 CFR 816.67(b)(1) Use of explosives: control of adverse effects, Airblast limits (govinfo, CFR 2024 edition)",
     "url": "https://www.govinfo.gov/content/pkg/CFR-2024-title30-vol3/xml/CFR-2024-title30-vol3-sec816-67.xml"
    },
    {
     "title": "USBM RI 8485 (1980), Conclusions, pp. 66–67",
     "url": "https://www.resolutionmineeis.us/sites/default/files/references/siskind-et-al-1980.pdf"
    }
   ],
   "notes": "30 CFR 816.67(b)(1)(i): 'Airblast shall not exceed the maximum limits listed below at the location of any dwelling, public building, school, church, or community or institutional building outside the permit area': '0.1 Hz or lower—flat response 134 peak. 2 Hz or lower—flat response 133 peak. 6 Hz or lower—flat response 129 peak. C-weighted—slow response 105 peak dBC.' RI 8485 is the basis: 'Based on a minimal probability of the most superficial type of damage in residential-type structures, any of the following represent safe maximum airblast levels', with the same four numbers. Also: 'These criteria could be lowered at locations with many large plate glass windows.' NASA's sonic-boom sheet agrees: 'At one pound overpressure [48 Pa], no damage to structures would be expected' and 'Rare minor damage may occur with 2 to 5 pounds' (96–239 Pa). The second is already in blast_sonic_boom_concorde.",
   "who_when": "OSMRE regulation (current); USBM 1980"
  },
  {
   "key": "comic_airblast_sash_rattle_small_shots",
   "category": "comic",
   "label": "Window sashes rattle at 0.03–0.05 psi (207–345 Pa) for small, sharp blasts",
   "status": "verified",
   "value_si": 207,
   "low_si": 207,
   "high_si": 345,
   "unit_si": "Pa",
   "display": "0.03–0.05 psi (141–145 dB): rattling of window sashes, in tests with small charges",
   "sources": [
    {
     "title": "USBM RI 8485 (1980), Appendix G 'Other airblast damage research', p. 93 (PDF p. 101), reproducing Perkins & Jackson",
     "url": "https://www.resolutionmineeis.us/sites/default/files/references/siskind-et-al-1980.pdf"
    }
   ],
   "notes": "As reproduced in RI 8485, App. G: 'Perkins and Jackson (36) conducted extensive tests on glass panes mounted in frames ... They also noted that rattling of window sashes occurred at 0.03 to 0.05 lb/in2 (141 to 145 dB).' RI 8485 adds: 'these levels are too high for continuous use in urban areas ... The likely reasons for their high damage thresholds are the small high-frequency shots and small panes studied.' Use: a punch or clap airblast is a small, high-frequency source, so this is the better rattle target for Rex's moves. comic_airblast_rattle_onset (20 Pa) is the conservative onset for long, low-frequency blasts. 0.03 psi = 207 Pa; 0.05 psi = 345 Pa. Primary report (Perkins & Jackson, Ballistic Research Laboratories) not fetched.",
   "who_when": "Perkins & Jackson (BRL), as reproduced in USBM RI 8485, 1980"
  },
  {
   "key": "comic_glass_breakage_low_end",
   "category": "comic",
   "label": "Lowest airblast that breaks flawed glass: about 360–690 Pa",
   "status": "verified",
   "value_si": 689,
   "low_si": 364,
   "high_si": 5171,
   "unit_si": "Pa",
   "display": "Precracked windows from 7.6 psf (364 Pa); glass under strain from 0.10 psi (690 Pa); good 3 × 3 ft panes none below 20 psf (958 Pa); properly mounted glass 0.75 psi (5.2 kPa)",
   "values_json": "{\"units\":\"original units (Pa)\",\"precracked windows, sonic boom (Sutherland)\":\"7.6 lb/ft2 (364 Pa, 145 dB)\",\"poorly mounted glass under stress (Windes; Perkins & Jackson)\":\"0.10 lb/in2 (689 Pa, 151 dB)\",\"3 ft x 3 ft x 1/8 in windows, no failures below (Sutherland)\":\"20 lb/ft2 (958 Pa, 154 dB)\",\"properly mounted glass, damage threshold (Perkins & Jackson)\":\"0.75 lb/in2 (5,171 Pa, 168 dB)\",\"small open-air shots: damage / none (Windes)\":\"0.88-1.10 lb/in2 damage (6.1-7.6 kPa); none at 0.62-0.72 lb/in2 (4.3-5.0 kPa)\"}",
   "sources": [
    {
     "title": "USBM RI 8485 (1980), Appendix G (PDF p. 101) and Appendix H 'Sonic boom damage' (PDF p. 104)",
     "url": "https://www.resolutionmineeis.us/sites/default/files/references/siskind-et-al-1980.pdf"
    }
   ],
   "notes": "App. G: 'Damage occurred at overpressures of 0.88 to 1.10 lb/in2 (170 to 172 dB); none was observed at 0.62 to 0.72 lb/in2 (167 to 168 dB). These levels apply to properly mounted glass; however, glass under strain could fail at overpressures as low as 0.10 lb/in2 (151 dB).' Perkins & Jackson 'defined damage threshold for properly mounted glass of 0.75 lb/in2 (168 dB), and for poorly mounted glass under stress of 0.10 lb/in2 (151 dB)'. App. H (Sutherland): 'In a study of 24 windows 3 ft x 3 ft x 1/8 in, no failures were observed below 20 lb/ft2 (0.139 lb/in2, 154 dB). However, precracked windows failed at levels as low as 7.6 lb/ft2 (0.053 lb/in2, 145 dB).' This fills the gap noted in blast_window_breakage ('Occasional breakage occurs at lower pressures, but no figure was verified'). It agrees with that key's Glasstone 0.5–1.0 psi 'shattering usually', which I re-fetched and confirmed in Table 5.145.",
   "who_when": "Windes; Perkins & Jackson; Sutherland, as reproduced in USBM RI 8485, 1980"
  },
  {
   "key": "comic_sonic_boom_house_effects",
   "category": "comic",
   "label": "What sonic booms do to houses (White Sands tests)",
   "status": "verified",
   "value_si": 287,
   "low_si": 120,
   "high_si": 527,
   "unit_si": "Pa",
   "display": "2.5 psf (120 Pa) precludes damage; bric-a-brac falls and dishes rattle at 6–11 psf (290–530 Pa); plaster cracks 6.5–10 psf (310–480 Pa); nails pop 10.3 psf (490 Pa)",
   "values_json": "{\"units\":\"lb/ft2 (Pa)\",\"precludes damage (theory)\":\"2.5 (120)\",\"falling bric-a-brac and rattling dishes\":\"6-11 (287-527)\",\"cracks in plaster on wood lath\":\"6.5-10 (311-479)\",\"nail popping, 1/2-inch gypsum board\":\"10.3 (493)\"}",
   "sources": [
    {
     "title": "USBM RI 8485 (1980), Appendix H 'Sonic boom damage', p. 96 (PDF p. 104), reproducing Sutherland",
     "url": "https://www.resolutionmineeis.us/sites/default/files/references/siskind-et-al-1980.pdf"
    }
   ],
   "notes": "As reproduced in RI 8485: 'Sutherland (63) ... notes that a sonic boom overpressure of 2.5 lb/ft2 (0.0174 lb/in2, 136 dB) would preclude damage'. 'The results of experimental sonic boom tolerance tests at White Sands were-- Cracks in plaster on wood lath 6.5-10 lb/ft2 ... Nail popping--1/2-inch gypsum board 10.3 lb/ft2 ... Falling bric-a-brac and rattling dishes 6-11 lb/ft2 (0.0417-0.0764 lb/in2, 143-148 dB).' Left out: a 'paint flaking' row whose psf and psi disagree in the scan (4.0 psf against 0.0625 psi). Sonic booms are long-wavelength N-waves, so these thresholds suit booms and big blasts, not a hand clap. Primary (Sutherland 1968) not fetched.",
   "who_when": "Sutherland, as reproduced in USBM RI 8485, 1980"
  },
  {
   "key": "comic_sonic_boom_public_reaction",
   "category": "comic",
   "label": "Sonic booms people object to: 1.5–2 psf (72–96 Pa)",
   "status": "verified",
   "value_si": 72,
   "low_si": 72,
   "high_si": 96,
   "unit_si": "Pa",
   "display": "1 psf (48 Pa): no damage expected; 1.5–2 psf (72–96 Pa): some public reaction",
   "sources": [
    {
     "title": "NASA Dryden Fact Sheet FS-2003-11-016, Sonic Booms",
     "url": "https://www.nasa.gov/wp-content/uploads/2021/09/120274main_fs-016-dfrc.pdf"
    }
   ],
   "notes": "Quotes: 'At one pound overpressure, no damage to structures would be expected.' 'Overpressures of 1 to 2 pounds are produced by supersonic aircraft flying at normal operating altitudes. Some public reaction could be expected between 1.5 and 2 pounds.' The rest of the sheet is already in blast_sonic_boom_concorde: rare minor damage at 2–5 psf, sound structures undamaged up to 11 psf, and 20–144 psf experienced without injury. Re-fetched; the figures there match. 1 psf = 47.88 Pa.",
   "who_when": "NASA DFRC, 2003"
  },
  {
   "key": "comic_impulse_noise_limit",
   "category": "comic",
   "label": "Hearing-safety limit for impulse noise: 140 dB peak (200 Pa)",
   "status": "verified",
   "value_si": 200,
   "unit_si": "Pa",
   "display": "140 dB peak sound pressure (200 Pa, 0.03 psi): US workplace limit for impulsive or impact noise",
   "sources": [
    {
     "title": "OSHA 29 CFR 1910.95(b), Occupational noise exposure",
     "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.95"
    }
   ],
   "notes": "After Table G-16: 'Exposure to impulsive or impact noise should not exceed 140 dB peak sound pressure level.' 140 dB = 20 µPa × 10^7 = 200 Pa. That is about 170 times below the existing eardrum-rupture threshold (34.5 kPa, blast_eardrum_rupture_threshold), so it is the right 'people nearby come to no harm' line for a clap or punch blast. Secondary sources say NIOSH (1998) and ISO/EU documents use the same 140 dB ceiling (not fetched). The OSHA wording is 'should', a guideline. Read through WebFetch.",
   "who_when": "OSHA, current regulation"
  },
  {
   "key": "comic_impulse_momentum_theorem",
   "category": "comic",
   "label": "Impulse–momentum: the same momentum change over a longer time needs less force",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "J = Δp; F_ave = Δp / Δt",
   "sources": [
    {
     "title": "OpenStax University Physics Volume 1, §9.2 Impulse and Collisions",
     "url": "https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions"
    }
   ],
   "notes": "Quotes: 'An impulse applied to a system changes the system's momentum, and that change of momentum is exactly equal to the impulse that was applied'; 'the average force applied to an object is equal to the change of the momentum that the force causes, divided by the time interval over which this change of momentum occurs'; 'The change of momentum in a crash is the same, with or without an airbag; the force, however, is vastly different.' Read through WebFetch.",
   "who_when": "OpenStax, University Physics Vol. 1"
  },
  {
   "key": "comic_soft_landing_force",
   "category": "comic",
   "label": "Soft landing: the momentum the ground must still take, and the gentlest force allowed",
   "status": "derived",
   "value_si": null,
   "unit_si": "N",
   "display": "Ground impulse J = m v. Mean ground force F = J/T + W. A constant-force stop needs travel d = vT/2, so F ≥ m v²/(2d) + W. At 10 ft, a 0.76 m knee bend from 20 m/s gives 820 kN (28 × his weight)",
   "values_json": "{\"units\":\"Rex 3,007 kg; W = 29.5 kN; leg stroke 0.76 m (engine strokes.leg)\",\"5 m/s\":{\"J (N s)\":15035,\"F over 0.1 s (kN)\":180,\"F over 0.5 s (kN)\":60,\"F over 2 s (kN)\":37,\"travel for 2 s stop (m)\":5,\"F within leg stroke (kN)\":79},\"20 m/s\":{\"J (N s)\":60140,\"F over 0.1 s (kN)\":631,\"F over 0.5 s (kN)\":150,\"F over 2 s (kN)\":60,\"travel for 2 s stop (m)\":20,\"F within leg stroke (kN)\":819},\"100 m/s\":{\"J (N s)\":300700,\"F over 0.1 s (kN)\":3036,\"F over 2 s (kN)\":180,\"travel for 2 s stop (m)\":100,\"F within leg stroke (kN)\":19760}}",
   "sources": [
    {
     "title": "OpenStax University Physics Vol. 1 §9.2 (J = Δp, F_ave = Δp/Δt)",
     "url": "https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions"
    },
    {
     "title": "Existing keys walking_running_peak_vertical_force (1.2 × body weight), collide_earth_inertia_rotation (Earth mass), earth_standard_gravity",
     "url": "https://pubmed.ncbi.nlm.nih.gov/2782094/"
    }
   ],
   "notes": "Formulas: J = m v (add any caught object's m v); F = J/T + W over stop time T; for a constant force the travel is d = vT/2, so T can be no longer than 2d/v. Absorbing energy removes the crater and the quake, but not this limit: with his feet on the ground he can only stop over the distance his legs bend (engine strokes.leg = 0.5 × H/2 = 0.76 m at 10 ft) or the ground gives. So F ≥ m v²/(2d) + W. On two paw soles (0.62 m²) that is 1.3 MPa at 20 m/s and 32 MPa at 100 m/s; on Ollie's boot soles (0.30 m²), 2.7 and 66 MPa. Above the surface's bearing capacity he still sinks, unless comic ground is on. Holding the force to the walking load (1.2 W) needs T = v/(0.2 g): 2.5 s from 5 m/s and 10 s from 20 m/s, which a landing on his feet cannot give. Earth's recoil energy J²/(2M_E) is 2e-17 to 8e-15 J, so absorbing the energy while passing the momentum is consistent. Script: scratchpad research/comic/scripts/derive.py.",
   "who_when": "This research, 2026"
  },
  {
   "key": "comic_absorb_residual_energy",
   "category": "comic",
   "label": "Momentum cannot be passed on with zero energy: at least p²/(2M) stays in whatever takes it",
   "status": "derived",
   "value_si": null,
   "unit_si": "J",
   "display": "Passing momentum p to a body of mass M leaves at least p²/(2M) in that body. For the Earth this is effectively nothing; for a small mass of air it is not",
   "sources": [
    {
     "title": "OpenStax University Physics Vol. 1 §9.2 (impulse and momentum)",
     "url": "https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions"
    }
   ],
   "notes": "Derivation: a body of mass M at rest given momentum p moves at p/M and carries kinetic energy p²/(2M). That is the least energy any receiver can end up with, so an absorbed switch can absorb everything except this. Examples: a 3,007 kg Rex landing at 100 m/s passes p = 3.0e5 N s to the Earth (5.97e24 kg), which keeps 7.6e-15 J. That is why soft landing can absorb the energy and still pass on the momentum. For cool flight, where the momentum goes into the air, the remainder depends on how much air takes it. Silent strike is clean, because the fist's momentum returns through his arm and feet to the Earth, not to the air.",
   "who_when": "This research, 2026"
  }
 ],
 "model_recommendation": "GENERAL. Every switch changes only its own named results and shows what it suspended or how many joules it absorbed. Momentum is always conserved: whatever a switch does, the impulse still reaches his feet and the ground. Test that every non-named number is identical with the switch on and off.\n\nGENTLE HOLD (material limit suspended)\n- Physics: his push becomes a body force, the same per kilogram everywhere in the held object, including its contents (passengers, fuel, cargo), and it also carries the object's weight. By ∇·σ + ρb = ρa with no surface traction, the ob … [7,057 more characters on this line; the full prompt is in prompts/ad58ad9e1874819fc.txt]
 "gaps": "Could not find or verify:\n- The current ASTM F2291 edition (F2291-26). It is paywalled; I used the 2006 edition (F2291-06a) posted by Public.Resource.Org. I also did not fetch EN 13814:2019. Say \"ASTM F2291-06a (later editions may differ)\".\n- Any measured tolerance for an unrestrained person held or carried by hand, or for soft tissue squeezed by a grip. Every limit found (ASTM, NASA, Eiband, the centrifuge studies) assumes a seat or harness. On the page: \"for someone held in his hands, nobody has measured it; these limits are a best case\".\n- Accelerations shorter than 200 ms  … [2,063 more characters on this line; the full prompt is in prompts/ad58ad9e1874819fc.txt]
}
```

</details>

**Subagent `verify:growth`** · rex-presence-research · started 2026-10-11 19:07:44 UTC

- checks: 36 (29 ok, 7 not ok).
- Not OK: growth_krakatoa_energy_spread; growth_chicxulub_energy_morgan2022; growth_worked_krakatoa (+4 more).
- Sources and arithmetic are sound. I re-fetched every cited source (NIST c and G, Harkrider & Press record and full PDF, Lobanovsky, Morgan 2022, IAU 2015, Rienstra & Hirschberg, USBM RI 8485, OSHA, Bohannon, both PMC reviews, NASA normal shock, Collins, Baker 1977, Lattimer & Prakash, the Courant & ...

<details>
<summary>Prompt, verbatim (77,410 characters)</summary>

Workflow run `wf_01258728-142`, phase `Verify`, agent `abe8faaaa1e7e546b`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/abe8faaaa1e7e546b.txt](prompts/abe8faaaa1e7e546b.txt).

```text
Project: the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a single-page physics simulator for Rex and Ollie (canon in CLAUDE.md, already loaded: each is 3.048 m tall and 3,007 kg in all; Rex's paw sole is 0.31 m^2 per foot, Ollie's boot sole 0.15 m^2 per foot; density 1,060 kg/m^3, 2.84 m^3). We are building /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first (10 minutes). It adds effort and restraint, a new Walk tab about ground vibration from their footsteps ("presence"), comic-physics switches, and what happens to energy they absorb (growth modes). This is the RESEARCH stage for one topic.
The engine (/home/user/rex-strength-lab/rex-strength-lab/src/engine.js) already has: Kinney-Graham blast overpressure, Gutenberg-Richter magnitude with seismic efficiency 1e-4, Collins et al. craters, Poncelet penetration, bearing capacities for nine surfaces (loose sand, dense sand and gravel, soft clay, stiff clay, asphalt, a 10 cm concrete slab, lake ice, steel deck, granite), W8.WALK_LOAD = 1.2 x body weight per step, stagnation heating, and the Weight tab's self-gravity physics. Existing verified facts live in /home/user/rex-strength-lab/rex-strength-lab/research/final-*.json (humans, fiction, objects, environment, density, duo): read the keys and labels of the ones near your topic before you start, do NOT re-research a fact that already exists unless the brief needs a number it lacks, and say when you rely on an existing key.
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent. A number is "verified" only if you fetched the page or PDF yourself and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher or agency PDFs, standards bodies). Many standards (BS, DIN, ISO) are paywalled: then cite the government or agency document that reproduces the table (e.g. Caltrans, FTA, HS2, Transport Scotland, US Bureau of Mines) with its URL and say "as reproduced in". Prefer primary or authoritative sources; use fan sites, magazines or Wikipedia only when nothing better exists, and label them "reported". Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". For PDFs, curl them into /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ and extract text with python (pypdf may need pip install --user pypdf) or pdftotext if present. Write raw downloads and any scripts under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
Fact fields (the Rex lab's research format): key (snake_case, prefix with the topic, e.g. vib_mayne1984_ppv_law), category (the topic), label, status (verified = number seen in a fetched primary or authoritative source | derived = computed by you from verified inputs, with the formula in notes | estimate = a reasoned assumption | reported = secondary or weak source | disputed), value_si (number, SI), unit_si, low_si and high_si when there is a range, display (short human text with original units), sources (title + exact URL fetched), notes (exact quote, sample, conditions, caveats, how good the evidence is, and for derived numbers the formula and inputs), who_when (author and year). Put any multi-number table (e.g. a threshold table) in values_json as a JSON object string, with each row's original units. Prefer several small facts to one big one.

You are a skeptical fact-checker for the topic "growth". Below are the researcher's facts and model recommendation. Re-fetch the cited URLs for every fact the page is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, unit conversion, quotation and status against what the source actually says; recompute every derived number with your own script. Mark ok=false with a correction for anything wrong, mislabelled (a secondary summary presented as the primary paper, an estimate or a fan source marked verified, a sample maximum called a limit, the wrong units or wrong peak/RMS basis), or unsupported. Judge the model recommendation: wrong physics, wrong formula, constants used outside the range they were fitted to, overstated certainty? List important missing items.

RESEARCH:
{
 "summary": "Growth-mode physics for BRIEF-presence.md, checked against fetched sources and recomputed from the canon figures (3,007 kg, 3.048 m, 1,060 kg/m³, 2.84 m³, equivalent ball radius 0.878 m).\n\n(1) Worked examples. The speed of light is exact (NIST CODATA 2022). The IAU 2015 solar luminosity of 3.828e26 W is confirmed from the PDF. For Chicxulub, Morgan et al. 2022 (Nat. Rev. Earth Environ.; NSF PAR copy) gives \"about 10^23 J\" in the abstract and \"about 5 × 10^23 J\" from the transient crater, so the brief's 4.2e23 J lies inside that range. For Krakatoa, the best primary figure is … [3,625 more characters on this line; the full prompt is in prompts/abe8faaaa1e7e546b.txt]
 "model_recommendation": "MASS AND FORM. Δm = E/c², with c = 299,792,458 m/s exact. k = 1 + Δm/3007. Volume V = V0·k^a, with V0 = 2.8368 m³ and a = 1 for pure size, 0.5 for mix (the default), 0 for pure density. A slider for a between 0 and 1 is fine. Height H = 3.048·(V/V0)^(1/3). Equivalent radius R = 0.8782·(V/V0)^(1/3). Density ρ = 3007k/V. Feed m = 3007k into the Weight tab. That gravitational mass rises by exactly E/c²; never add the loop's extra rest mass to it. Endless ocean: show the energy absorbed, with zero mass change. Label it canon.\n\nGRADUAL GROWTH. Profile: fraction of mass a … [3,334 more characters on this line; the full prompt is in prompts/abe8faaaa1e7e546b.txt]
 "gaps": "Could not read, or only partly verified:\n1. **Taylor (1946) itself.** The publisher page sits behind a bot check and PubMed has no abstract. What it says comes from Courant & Friedrichs 1948 (text and Fig. 12, seen in the archive.org scan) plus our own similarity solution, checked with an independent hydro code. Our sphere-speed curve sits 0.04–0.05 c0 below the printed figure; the gas-speed curve matches it exactly. Page: \"Taylor's result as reproduced by Courant & Friedrichs; surface pressures from our own calculation.\"\n2. **Kinsler et al. and Pierce.** Not opened (Springer blo … [2,646 more characters on this line; the full prompt is in prompts/abe8faaaa1e7e546b.txt]
 "facts": [
  {
   "key": "growth_c_exact",
   "label": "Speed of light in vacuum (exact by definition)",
   "status": "verified",
   "value_si": 299792458,
   "unit_si": "m/s",
   "display": "299,792,458 m/s, exact (c² = 8.988 × 10¹⁶ m²/s²)",
   "sources": [
    {
     "title": "NIST CODATA 2022: speed of light in vacuum",
     "url": "https://physics.nist.gov/cgi-bin/cuu/Value?c"
    }
   ],
   "notes": "NIST page: \"Numerical value 299 792 458 m s-1\", \"Standard uncertainty (exact)\", \"Source: 2022 CODATA\". Exact because the metre is defined from it. The engine already uses K.c = 299792458. Mass added = E / c² = E / 8.987551787e16 kg per joule.",
   "who_when": "CODATA 2022 (NIST)",
   "category": "growth"
  },
  {
   "key": "growth_krakatoa_airwave_harkrider_press",
   "label": "Krakatoa 1883: explosion needed to reproduce its air pressure wave",
   "status": "verified",
   "value_si": 523000000000000000,
   "low_si": 418400000000000000,
   "high_si": 627600000000000000,
   "unit_si": "J",
   "display": "100–150 Mt TNT (4.2–6.3 × 10¹⁷ J); adds 4.7–7.0 kg as mass",
   "sources": [
    {
     "title": "Harkrider & Press (1967) The Krakatoa air-sea waves: an example of pulse propagation in coupled systems, Geophys. J. R. astr. Soc. 13:149-159; Caltech Authors record with abstract",
     "url": "https://authors.library.caltech.edu/records/r42n3-t2639"
    },
    {
     "title": "DOI landing page (not opened)",
     "url": "https://doi.org/10.1111/j.1365-246X.1967.tb02150.x"
    }
   ],
   "notes": "Abstract (Caltech repository record): \"An explosion of 100–150 megatons is required to produce the equivalent of the Krakatoa pressure disturbance.\" This is a blast (air-wave) equivalent fitted to the barograph records, not the eruption's total thermal energy. Converted at 4.184e15 J per Mt (existing key energy_tnt_equivalent_per_tonne). It is a better primary source than the existing energy_krakatoa_1883 (status claimed: 200 Mt via Wikipedia and a popular book), which sits above this range. Value_si is the midpoint (125 Mt).",
   "who_when": "Harkrider & Press 1967",
   "category": "growth"
  },
  {
   "key": "growth_krakatoa_energy_spread",
   "label": "Krakatoa 1883: spread of published energy estimates",
   "status": "disputed",
   "value_si": null,
   "low_si": 100000000000000000,
   "high_si": 4600000000000000000,
   "unit_si": "J",
   "display": "About 10¹⁷ J (24 Mt) to 4.6 × 10¹⁸ J (1.1 Gt); the popular 200 Mt (8.4 × 10¹⁷ J) is inside. Mass added: 1–50 kg",
   "sources": [
    {
     "title": "Lobanovsky (2013) Acoustic Methods for Evaluation of High Energy Explosions, arXiv:1311.6565, Annex IV",
     "url": "https://arxiv.org/pdf/1311.6565"
    }
   ],
   "notes": "Lobanovsky's annex: Wikipedia \"said that the explosion energy of volcano Krakatoa was, ostensibly, 200 Mt (0.2 Gt)\"; \"another encyclopedic resource argues that the energy explosion of Krakatoa was 1.5 Gt\"; an American Geological Institute book: \"estimated to be 10^24 erg [38], that is 10^17 joules, or 24 Mt\"; his own acoustic estimate \"Ee = 1.09 ± 0.05 Gt\"; he notes extreme estimates \"differ by almost 500 times\". Preprint by an aerospace engineer, not peer reviewed: reported quality for his own number; the quoted spread is the useful part. Whatever the true value, the growth is unnoticeable: 1e17 J adds 1.1 kg, 8.4e17 J adds 9.3 kg, 4.6e18 J adds 51 kg (1.7% of his mass; pure size would add 1.7 cm of height).",
   "who_when": "compiled by Lobanovsky 2013",
   "category": "growth"
  },
  {
   "key": "growth_chicxulub_energy_morgan2022",
   "label": "Chicxulub impact energy (2022 review)",
   "status": "verified",
   "value_si": 5e+23,
   "low_si": 1e+23,
   "high_si": 5e+23,
   "unit_si": "J",
   "display": "About 10²³ J (abstract); about 5 × 10²³ J from the 80–100 km transient crater",
   "sources": [
    {
     "title": "Morgan, Bralower, Brugger & Wünnemann (2022) The Chicxulub impact and its environmental consequences, Nature Reviews Earth & Environment 3:338; accepted manuscript at NSF PAR",
     "url": "https://par.nsf.gov/servlets/purl/10349743"
    },
    {
     "title": "DOI landing page (not opened)",
     "url": "https://doi.org/10.1038/s43017-022-00283-y"
    }
   ],
   "notes": "Abstract: \"The Chicxulub crater's asymmetric shape and size suggest an oblique impact and an impact energy of about 10^23 joules\". Main text: \"the apparent diameter of the transient crater ... is estimated to be between 80 km and 100 km ... and the impact energy is estimated to be about 5 × 10^23 J\"; \"For an asteroid speed of around 18 km s–1 and impact angles of between 45° and 60°, impactor diameters of around 12.2–14.4 km are required\". The brief's 4.2 × 10^23 J (100 teratonnes of TNT) lies inside this range. Suggest the existing energy_chicxulub_impact (disputed, via Wikipedia, up to 5.8e25 J from a 2014 preprint) cite this peer-reviewed review for its main range.",
   "who_when": "Morgan et al. 2022",
   "category": "growth"
  },
  {
   "key": "growth_sun_luminosity_check",
   "label": "Nominal solar luminosity (check of the existing fact)",
   "status": "verified",
   "value_si": 3.828e+26,
   "unit_si": "W",
   "display": "3.828 × 10²⁶ W (IAU 2015 nominal); best estimate 3.8275 ± 0.0014 × 10²⁶ W",
   "sources": [
    {
     "title": "Prša et al. (2016) Nominal values for selected solar and planetary quantities: IAU 2015 Resolution B2 and B3, arXiv:1510.07674 (PDF)",
     "url": "https://arxiv.org/pdf/1510.07674"
    }
   ],
   "notes": "PDF: \"1 L N⊙ = 3.828 × 10^26 W\"; and \"Sun's mean radiative luminosity of L⊙ = 4π(1 au)² S⊙ = 3.8275 (± 0.0014) × 10^26 W\". Confirms the existing key energy_sun_luminosity unchanged; rely on it. One second of output, 3.828e26 J, is 4.259e9 kg as mass.",
   "who_when": "IAU 2015 Resolution B3",
   "category": "growth"
  },
  {
   "key": "growth_body_baseline",
   "label": "Canon body used for growth: volume and equivalent ball radius",
   "status": "derived",
   "value_si": 2.8368,
   "unit_si": "m^3",
   "display": "2.84 m³; a ball of that volume has radius 0.878 m (0.288 of his 3.048 m height)",
   "sources": [
    {
     "title": "Project canon: CLAUDE.md in this repository (3,007 kg, 3.048 m, 1,060 kg/m^3)",
     "url": "CLAUDE.md"
    }
   ],
   "notes": "V0 = 3,007 / 1,060 = 2.8368 m^3. Equivalent radius R = (3V/4π)^(1/3) = 0.8782 m, the same convention as the engine's eqRadius(). R/H = 0.2881. Growth forms with mass ratio k = m/m0: volume V = V0·k^a with a = 1 (pure size), 1/2 (mix), 0 (pure density); height and R scale as (V/V0)^(1/3), i.e. k^(1/3), k^(1/6), 1; density = 1,060·k^(1-a).",
   "who_when": "derived from canon",
   "category": "growth"
  },
  {
   "key": "growth_worked_krakatoa",
   "label": "Worked example: absorbing Krakatoa's energy as growth",
   "status": "derived",
   "value_si": 9.346,
   "unit_si": "kg",
   "low_si": 4.66,
   "high_si": 9.35,
   "display": "Adds about 9 kg (5–7 kg on the air-wave estimate): +0.3%. Height +1.6 mm (mix) or +3.2 mm (pure size); density 1,063 kg/m³ if pure density",
   "sources": [
    {
     "title": "NIST CODATA 2022: speed of light in vacuum",
     "url": "https://physics.nist.gov/cgi-bin/cuu/Value?c"
    },
    {
     "title": "Project canon: CLAUDE.md in this repository (3,007 kg, 3.048 m, 1,060 kg/m^3)",
     "url": "CLAUDE.md"
    },
    {
     "title": "rex-strength-lab/BRIEF-presence.md (worked examples being checked)",
     "url": "rex-strength-lab/BRIEF-presence.md"
    }
   ],
   "notes": "Δm = E/c². E = 8.4e17 J (brief; existing claimed key energy_krakatoa_1883): Δm = 9.346 kg, k = 1.00311. Mix: H = 3.048·k^(1/6) = 3.0496 m (+1.6 mm), ρ = 1,060·k^(1/2) = 1,061.6. Pure size: H = 3.048·k^(1/3) (+3.2 mm). Pure density: 1,063.3 kg/m^3. With the verified 100–150 Mt air-wave figure: 4.7–7.0 kg. Brief's \"about 9 kg: unnoticeable in any form\" is correct, and stays true across the whole published spread (1–51 kg).",
   "values_json": "{\"E_J\": {\"8.4e17 (brief)\": {\"dm_kg\": 9.35, \"k\": 1.0031, \"mix_H_m\": 3.0496, \"mix_rho\": 1061.6, \"size_H_m\": 3.0512, \"density_rho\": 1063.3}, \"4.18e17-6.28e17 (Harkrider & Press)\": {\"dm_kg\": \"4.7-7.0\"}}}",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_worked_chicxulub",
   "label": "Worked example: absorbing Chicxulub's energy as growth",
   "status": "derived",
   "value_si": 4673000,
   "unit_si": "kg",
   "low_si": 1113000,
   "high_si": 5563000,
   "display": "4.2 × 10²³ J adds 4,700 t (×1,600 his mass): mix 10 m and 42,000 kg/m³; pure size 35 m; pure density 1.6 × 10⁶ kg/m³ (the brief says 1.7 × 10⁶: a rounding slip)",
   "sources": [
    {
     "title": "NIST CODATA 2022: speed of light in vacuum",
     "url": "https://physics.nist.gov/cgi-bin/cuu/Value?c"
    },
    {
     "title": "Project canon: CLAUDE.md in this repository (3,007 kg, 3.048 m, 1,060 kg/m^3)",
     "url": "CLAUDE.md"
    },
    {
     "title": "rex-strength-lab/BRIEF-presence.md (worked examples being checked)",
     "url": "rex-strength-lab/BRIEF-presence.md"
    },
    {
     "title": "Morgan et al. 2022 (energy range)",
     "url": "https://par.nsf.gov/servlets/purl/10349743"
    }
   ],
   "notes": "E = 4.2e23 J: Δm = 4.673e6 kg, k = 1,555.3. Mix: H = 3.048·k^(1/6) = 10.38 m, ρ = 1,060·k^(1/2) = 41,800 kg/m^3, R_eq = 2.99 m. Pure size: H = 3.048·k^(1/3) = 35.3 m, R_eq = 10.2 m. Pure density: 1,060·k = 1.649e6 kg/m^3, which rounds to 1.6e6 at 2 significant figures (brief: 1.7e6). Brief's \"about 4,700 t (×1,560)\" is right (k = 1,555.3, which is 1,560 to 3 figures and 1,600 to 2). Over Morgan 2022's range (1e23 to 5e23 J): Δm 1,110–5,560 t; mix 8.2–10.7 m and 20,000–46,000 kg/m^3; pure size 22–37 m; pure density 3.9e5–2.0e6 kg/m^3.",
   "values_json": "{\"1e23 J\": {\"dm_t\": 1113, \"k\": 371, \"mix_H_m\": 8.17, \"mix_rho\": 20400, \"size_H_m\": 21.9, \"density_rho\": 393000.0}, \"4.2e23 J (brief)\": {\"dm_t\": 4673, \"k\": 1555, \"mix_H_m\": 10.4, \"mix_rho\": 41800, \"size_H_m\": 35.3, \"density_rho\": 1650000.0}, \"5e23 J\": {\"dm_t\": 5563, \"k\": 1851, \"mix_H_m\": 10.7, \"mix_rho\": 45600, \"size_H_m\": 37.4, \"density_rho\": 1960000.0}}",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_worked_sun_second",
   "label": "Worked example: absorbing one second of the Sun's output as growth",
   "status": "derived",
   "value_si": 4259000000,
   "unit_si": "kg",
   "display": "Adds 4.3 × 10⁶ t (×1.4 × 10⁶): mix 32 m and 1.3 × 10⁶ kg/m³; pure size 340 m; pure density 1.5 × 10⁹ kg/m³ (about half Sirius B's average)",
   "sources": [
    {
     "title": "NIST CODATA 2022: speed of light in vacuum",
     "url": "https://physics.nist.gov/cgi-bin/cuu/Value?c"
    },
    {
     "title": "Project canon: CLAUDE.md in this repository (3,007 kg, 3.048 m, 1,060 kg/m^3)",
     "url": "CLAUDE.md"
    },
    {
     "title": "rex-strength-lab/BRIEF-presence.md (worked examples being checked)",
     "url": "rex-strength-lab/BRIEF-presence.md"
    },
    {
     "title": "IAU 2015 B3 (via existing key energy_sun_luminosity)",
     "url": "https://arxiv.org/pdf/1510.07674"
    }
   ],
   "notes": "E = 3.828e26 J: Δm = 4.259e9 kg, k = 1.416e6. Mix: H = 32.3 m, ρ = 1.26e6 kg/m^3, R_eq = 9.31 m. Pure size: H = 342 m, R_eq = 98.6 m. Pure density: 1.50e9 kg/m^3. All brief figures check out. \"White-dwarf matter\" is fair: the existing estimate density_white_dwarf_sirius_b_mean is 2.8e9 kg/m^3, so this is about half Sirius B's average density.",
   "values_json": "{\"dm_kg\": 4259000000.0, \"k\": 1416000.0, \"mix_H_m\": 32.3, \"mix_rho\": 1260000.0, \"size_H_m\": 342, \"density_rho\": 1500000000.0}",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_brief_number_check",
   "label": "Check of every growth number in the brief",
   "status": "derived",
   "value_si": null,
   "unit_si": "",
   "display": "All correct to 2 figures except Chicxulub pure density: 1.6 × 10⁶ kg/m³, not 1.7 × 10⁶. Krakatoa's 8.4 × 10¹⁷ J is weakly sourced; the conclusion holds anyway",
   "sources": [
    {
     "title": "rex-strength-lab/BRIEF-presence.md (worked examples being checked)",
     "url": "rex-strength-lab/BRIEF-presence.md"
    },
    {
     "title": "Our scripts (scratchpad): growth_calc.py, taylor_sphere.py, piston_hydro.py, hydro_check.py, kg.py",
     "url": "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/growth/scripts/"
    }
   ],
   "notes": "Recomputed with c exact, 3,007 kg, 1,060 kg/m^3, 3.048 m (growth_calc.py). Krakatoa 9 kg OK. Chicxulub: 4,700 t OK, ×1,560 OK (1,555), mix ≈10 m OK (10.4), ≈42,000 OK (41,800), pure size ≈35 m OK (35.3), pure density 1.65e6 → 1.6e6 at 2 s.f. (brief 1.7e6: wrong in the second figure). Sun: 4.3e6 t OK, ×1.4e6 OK, mix 32 m OK, 1.3e6 OK (1.26e6), 340 m OK (342), 1.5e9 OK. Runaway claims: \"about 10^-15\" for shoving the surroundings is right for pure size (1.06e-15 slow, 3–5e-15 instant) but smaller for mix (1e-16 to 1e-18) and zero for pure density; \"a real runaway needs their own gravity near black-hole density\" is right, and more exactly the loop reaches 1 only at the event horizon (see growth_loop_gravity_gr).",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_monopole_compact_body",
   "label": "Sound from a body whose volume changes (acoustic monopole)",
   "status": "verified",
   "value_si": null,
   "unit_si": "Pa",
   "display": "p(r, t) = ρ₀ V̈(t − r/c₀) / (4πr): the pressure set by the second time-derivative of the body's volume; steady expansion makes no sound in this approximation",
   "sources": [
    {
     "title": "Rienstra & Hirschberg, An Introduction to Acoustics (Eindhoven University of Technology lecture text, PDF version dated 6 Sep 2026)",
     "url": "https://www.win.tue.nl/~sjoerdr/papers/boek.pdf"
    }
   ],
   "notes": "Rienstra & Hirschberg eq. (2.61) and p. 24: \"mass injection is a source of sound, primarily because of the displacement of a volume fraction β of the original fluid\". Section 6.2, p. 150 (PDF p. 159), pulsating sphere: \"If (∂a/∂t)/c0 ≪ 1, we can use linear acoustics\"; \"For a compact sphere the first term is dominating (a(∂²a/∂t²)/c0² ≪ 1). We find exactly the result which we could anticipate from (2.61), the second derivative to time of the volume of the sphere is the source of sound. A steady expansion of the sphere (∂a/∂t = constant) does not (in this approximation) generate sound. The second term of (6.9) is dominating for large sphere radii (a(∂²a/∂t²)/c0² ≫ 1). In such a case the action of the wall movement is that of a piston which generates plane waves.\" Curle's theorem (6.85), p. 170 (PDF p. 179): the surface term −(1/4πc0²) ∂/∂t ∬[ρ v_i n_i / r] dσ \"is important when the body is pulsating. For a compact body we have then a simple volume source term\"; with the free-field Green's function G0 = δ(t − τ − r/c0)/(4π r c0²) (6.37) this gives p' = c0² ρ' = ρ0 V̈(t − r/c0)/(4πr) for any compact body shape. Valid when the body is small compared with c0 × (growth time) and its surface moves much slower than sound. Kinsler et al. and Pierce were not opened (Springer blocked).",
   "who_when": "Rienstra & Hirschberg (TU Eindhoven), after Lighthill and Curle",
   "category": "growth"
  },
  {
   "key": "growth_monopole_ground_doubling",
   "label": "A volume source on the ground: pressure doubled",
   "status": "verified",
   "value_si": 2,
   "unit_si": "1",
   "display": "Next to a rigid wall or ground a monopole's pressure is 2× its free-field value: p = ρ₀ V̈ / (2πr)",
   "sources": [
    {
     "title": "Rienstra & Hirschberg, An Introduction to Acoustics (Eindhoven University of Technology lecture text, PDF version dated 6 Sep 2026)",
     "url": "https://www.win.tue.nl/~sjoerdr/papers/boek.pdf"
    }
   ],
   "notes": "Rienstra & Hirschberg, exercises to chapter 6, p. 172 (PDF p. 181), item f: \"The acoustic pressure p′ generated by a monopole close to a wall increases by a factor 2 in comparison with free field conditions.\" Applied to Rex standing on the ground. Real ground is not perfectly rigid, so 2 is the conservative (upper) factor.",
   "who_when": "Rienstra & Hirschberg",
   "category": "growth"
  },
  {
   "key": "growth_slow_pressure_peak",
   "label": "Gradual growth: peak air pressure at a bystander, and the shortest duration that keeps it harmless",
   "status": "derived",
   "value_si": null,
   "unit_si": "Pa",
   "display": "p_peak = ρ₀ k_V ΔV / (2π r T²); for pure size with a smooth start and stop, p_peak = ρ₀ ΔV / (r T²), so T_min = √(ρ₀ ΔV / (r p_safe))",
   "sources": [
    {
     "title": "Rienstra & Hirschberg, An Introduction to Acoustics (Eindhoven University of Technology lecture text, PDF version dated 6 Sep 2026)",
     "url": "https://www.win.tue.nl/~sjoerdr/papers/boek.pdf"
    },
    {
     "title": "Our scripts (scratchpad): growth_calc.py, taylor_sphere.py, piston_hydro.py, hydro_check.py, kg.py",
     "url": "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/growth/scripts/"
    }
   ],
   "notes": "Inputs: monopole on rigid ground p = ρ0 V̈/(2πr) (growth_monopole_compact_body, growth_monopole_ground_doubling); ρ0 = 1.225 kg/m^3 (existing atm_isa_sea_level_density). Growth profile chosen: the fraction of the absorbed mass added by time t is s(t) = t/T − sin(2πt/T)/(2π), so the rate ∝ 1 − cos(2πt/T) starts and ends at zero with zero acceleration (no jolt). Pure size: V = V0 + ΔV·s, V̈max = 2πΔV/T² (k_V = 2π = 6.28). Mix: V = V0·(1 + (k−1)s)^(1/2) grows fastest early, so k_V is larger: 14.3 (k = 371), 17.9 (k = 1,555), 54.7 (k = 1.4e6), found numerically. Pure density: ΔV = 0, no pulse. A half-sine rate profile gives k_V = π²/2 = 4.93 but a pressure step at the start. r is measured from the body's centre; take r = R_eq(final) + d for a bystander d from the final surface (conservative for a tall body). Valid while c0·T is much larger than his height and the surface speed is far below 340 m/s; the Bernoulli near-field term −½ρ0u² is then negligible. Ignores wind, temperature layers, terrain and buildings. For T longer than about 0.05 s the pulse is infrasound: felt as a pressure change, not heard as a bang.",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_airblast_usbm_ri8485",
   "label": "Airblast levels that rattle houses but do no damage (US Bureau of Mines)",
   "status": "verified",
   "value_si": 100,
   "low_si": 20,
   "high_si": 100,
   "unit_si": "Pa",
   "display": "Safe limit for houses: 134 dB (0.1 Hz system) = 0.0145 psi ≈ 100 Pa. Rattling complaints start above about 120 dB (≈20 Pa)",
   "sources": [
    {
     "title": "Siskind, Stachura, Stagg & Kopp (1980) Structure Response and Damage Produced by Airblast from Surface Mining, US Bureau of Mines Report of Investigations 8485 (copy hosted by the Resolution Copper Mine EIS)",
     "url": "https://www.resolutionmineeis.us/sites/default/files/references/siskind-et-al-1980.pdf"
    }
   ],
   "notes": "Abstract: \"Safe levels of airblast were found to be 134 dBL (0.1 Hz), 133 dBL (2Hz), 129 dBL (6Hz), and 105 dB C-slow.\" \"The human response and annoyance problem from airblast is probably caused primarily by wall rattling and the resulting secondary noises. Although these will not entirely be precluded by the recommended levels, they are low enough to preclude damage to residential structures and any possible human injury over the long term.\" p. 66: \"Levels exceeding 120 dB will produce some annoyance from rattling and fright, with as much as 5 to 10 pct of homes exhibiting such disturbances at the maximum level of 134 dBL (0.1-Hz high-pass).\" Text: \"complaints about rattling occur at airblast levels exceeding about 120 dB (6Hz)\". A table lists 0.0145 psi beside 134 dBL. Conversion p = 20 µPa × 10^(L/20): 134 dB = 100 Pa, 120 dB = 20 Pa. These are for blast pulses lasting under about 2 s; a growth pulse is smoother and longer, so these limits are conservative for it. Higher thresholds already in the data: blast_window_breakage (3.4–6.9 kPa), blast_eardrum_rupture_threshold (34.5 kPa), and NASA sonic-boom figures in blast_sonic_boom_concorde (rare minor damage at 96–239 Pa).",
   "values_json": "{\"134 dBL (0.1 Hz high-pass)\": \"safe maximum for houses; 0.0145 psi = 100 Pa\", \"133 dBL (2 Hz)\": \"equivalent safe level\", \"129 dBL (5-6 Hz)\": \"equivalent safe level\", \"105 dB C-slow\": \"equivalent safe level (events ≤ 2 s)\", \"above ~120 dB (6 Hz)\": \"rattling complaints begin; ≈ 20 Pa\", \"at 134 dBL\": \"5-10% of homes rattle\"}",
   "who_when": "Siskind et al. 1980 (USBM RI 8485)",
   "category": "growth"
  },
  {
   "key": "growth_contact_speed_osha",
   "label": "A harmless pushing speed: robot speed slow enough for a person to avoid hazardous contact",
   "status": "verified",
   "value_si": 0.25,
   "unit_si": "m/s",
   "display": "250 mm/s (10 in/s)",
   "sources": [
    {
     "title": "OSHA Technical Manual, Section IV Chapter 4: Industrial Robot Systems and Industrial Robot System Safety",
     "url": "https://www.osha.gov/otm/section-4-safety-hazards/chapter-4"
    }
   ],
   "notes": "OSHA Technical Manual IV-4, section VIII.1: \"In this mode, the robot system operates at a reduced speed, slow enough for a person to avoid hazardous contact,\" ... \"but not greater than 10 inches/second (250mm/second)\". Section VI.4: \"robot speeds should be placed at a reduced speed of 10 inches per second (250 mm/second) or less on any part\" of the application. The page does not name the consensus standard behind the sentence (ANSI/RIA R15.06 and ISO 10218 are paywalled and were not opened). Used here as the speed at which his growing surface may push someone: they can simply step away, since walking pace is about 5 times faster. Not covered: someone pinned between his growing body and a wall is crushed at any speed; growth must stop or go around them.",
   "who_when": "OSHA (US Dept of Labor), current web edition",
   "category": "growth"
  },
  {
   "key": "growth_walking_speed_bohannon1997",
   "label": "Comfortable walking speed of adults",
   "status": "verified",
   "value_si": 1.4,
   "low_si": 1.272,
   "high_si": 1.462,
   "unit_si": "m/s",
   "display": "Comfortable 1.27–1.46 m/s (group means, ages 20–79); fastest 1.75–2.53 m/s",
   "sources": [
    {
     "title": "Bohannon (1997) Comfortable and maximum walking speed of adults aged 20-79 years: reference values and determinants, Age and Ageing 26:15-19 (abstract read through the Europe PMC API)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:9143432%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "PubMed 9143432",
     "url": "https://pubmed.ncbi.nlm.nih.gov/9143432/"
    }
   ],
   "notes": "Abstract: 230 healthy volunteers timed over 7.62 m. \"mean comfortable gait speed ranged from 127.2 cm/s for women in their seventies to 146.2 cm/s for men in their forties. Mean maximum gait speed ranged from 174.9 cm/s for women in their seventies to 253.3 cm/s for men in their twenties.\" Used as a second, less cautious shove speed (being pushed at walking pace), and to show that at 0.25 m/s anyone can step away.",
   "who_when": "Bohannon 1997",
   "category": "growth"
  },
  {
   "key": "growth_slow_tmin_shove",
   "label": "Gradual growth: shortest duration so his surface never pushes faster than a safe speed",
   "status": "derived",
   "value_si": null,
   "unit_si": "s",
   "display": "T_min = k_H ΔL / u_safe, with ΔL the growth of his height (top of head) or of his half-width (beside him); k_H = 2 for small growth, about 1.9 for large pure-size growth, 2.6–7 for mix",
   "sources": [
    {
     "title": "OSHA Technical Manual, Section IV Chapter 4: Industrial Robot Systems and Industrial Robot System Safety",
     "url": "https://www.osha.gov/otm/section-4-safety-hazards/chapter-4"
    },
    {
     "title": "Our scripts (scratchpad): growth_calc.py, taylor_sphere.py, piston_hydro.py, hydro_check.py, kg.py",
     "url": "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/growth/scripts/"
    }
   ],
   "notes": "Same profile s(t) as growth_slow_pressure_peak. Height H(t) = H0·(V(t)/V0)^(1/3); peak dH/dt = k_H·ΔH/T, with k_H computed numerically: pure size 2.00 (k ≈ 1), 1.94 (k = 371), 1.93 (k = 1,555), 1.88 (k = 1.4e6); mix 2.57 (k = 371), 2.94 (k = 1,555), 7.22 (k = 1.4e6), because with V ∝ m^(1/2) the height grows fastest early. Assumes his soles stay put and he grows upward and outward, so the top of his head is the fastest point; someone beside him meets his side, which moves about 0.29 times as fast (equivalent-ball radius). Engine: compute k_V and k_H once per form and mass ratio by sampling the profile (they do not depend on T).",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_slow_tmin_examples",
   "label": "Gradual growth: shortest harmless durations for the worked examples",
   "status": "derived",
   "value_si": null,
   "unit_si": "s",
   "display": "The shove sets the limit, not the air: Chicxulub about 1½ min (mix) or 4 min (pure size); one second of sunlight about 14 min (mix) or 43 min (pure size); Krakatoa a few hundredths of a second; pure density has no air or shove limit",
   "sources": [
    {
     "title": "Our scripts (scratchpad): growth_calc.py, taylor_sphere.py, piston_hydro.py, hydro_check.py, kg.py",
     "url": "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/growth/scripts/"
    },
    {
     "title": "Siskind, Stachura, Stagg & Kopp (1980) Structure Response and Damage Produced by Airblast from Surface Mining, US Bureau of Mines Report of Investigations 8485 (copy hosted by the Resolution Copper Mine EIS)",
     "url": "https://www.resolutionmineeis.us/sites/default/files/references/siskind-et-al-1980.pdf"
    },
    {
     "title": "OSHA Technical Manual, Section IV Chapter 4: Industrial Robot Systems and Industrial Robot System Safety",
     "url": "https://www.osha.gov/otm/section-4-safety-hazards/chapter-4"
    }
   ],
   "notes": "Bystander 5 m from his final surface, on rigid ground; p_safe 100 Pa (USBM safe) or 20 Pa (rattle onset); u_safe 0.25 m/s (OSHA) or 1.4 m/s (walking); top-of-head speed unless marked side. At the shove-limited duration the air pulse is tiny: e.g. Chicxulub pure size at 250 s gives 100 Pa × (1.9/250)² ≈ 0.006 Pa, far below hearing. Pure density changes no volume, so neither limit applies; its hazards are the Weight tab ones (ground load, sinking, own gravity).",
   "values_json": "{\"columns\": \"T_pressure at 100 Pa / 20 Pa; T_shove at 0.25 m/s (head / side); T_shove at 1.4 m/s (head); all seconds\", \"Krakatoa 8.4e17 J, mix\": [0.003, 0.0068, 0.013, 0.0036, 0.0023], \"Krakatoa 8.4e17 J, pure size\": [0.0043, 0.0096, 0.025, 0.0073, 0.0045], \"Chicxulub 1e23 J, mix\": [0.44, 0.99, 53, 15, 9.4], \"Chicxulub 1e23 J, pure size\": [1.1, 2.4, 146, 42, 26], \"Chicxulub 4.2e23 J, mix\": [0.69, 1.5, 86, 25, 15], \"Chicxulub 4.2e23 J, pure size\": [1.9, 4.2, 250, 72, 44], \"Sun 1 s (3.8e26 J), mix\": [5.0, 11, 850, 240, 150], \"Sun 1 s (3.8e26 J), pure size\": [22, 49, 2600, 740, 460], \"any, pure density\": \"no volume change: no pressure pulse, no shove\"}",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_tissue_sound_speed",
   "label": "Speed of sound in soft tissue",
   "status": "verified",
   "value_si": 1540,
   "low_si": 1450,
   "high_si": 1585,
   "unit_si": "m/s",
   "display": "1,540 m/s (the soft-tissue value ultrasound scanners assume); muscle 1,585 m/s; fat 1,450–1,465 m/s",
   "sources": [
    {
     "title": "Lieu (2025) Ultrasound fundamentals and their clinical implications for interventional cytopathologists, Cytopathology (PMC12150002; full text read through the Europe PMC API)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12150002/fullTextXML"
    },
    {
     "title": "Moyano, Paraiso & González-Lezcano (2022) Possible Effects on Health of Ultrasound Exposure..., Healthcare 10:423, Table 3 (PMC8954895; full text read through the Europe PMC API)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC8954895/fullTextXML"
    }
   ],
   "notes": "Lieu 2025: \"sound travels about 330 m/s through air, 1540 m/s through human soft tissue and 4500 m/s through bone\"; \"Ultrasound machines assume that sound transmitted in the human body travels 1540 m/s through soft tissue\". Moyano 2022 Table 3 \"Speed of sound in different substances or organs\": Human soft tissue 1540; Muscle 1585; Fat 1450/1465; Blood 1570/1584; Cortical bone 3635. Both are review-level secondary sources; the IEC/ICRU documents behind the 1,540 convention were not fetched (paywalled). Canon does not say what Rex is made of inside; a muscular body at 1,060 kg/m^3 sits between soft tissue and muscle, so 1,540 is used (muscle would shorten the time by 3%).",
   "who_when": "Lieu 2025; Moyano et al. 2022",
   "category": "growth"
  },
  {
   "key": "growth_instant_timescale",
   "label": "Instant growth: the time it takes (sound crossing his final body)",
   "status": "estimate",
   "value_si": 0.0229,
   "unit_si": "s",
   "low_si": 0.00198,
   "high_si": 0.222,
   "display": "t = final height ÷ 1,540 m/s: 2 ms (Krakatoa), 7 ms (Chicxulub, mix), 23 ms (Chicxulub, pure size), 0.22 s (one solar second, pure size)",
   "sources": [
    {
     "title": "Speed of sound in soft tissue (growth_tissue_sound_speed)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12150002/fullTextXML"
    },
    {
     "title": "Our scripts (scratchpad): growth_calc.py, taylor_sphere.py, piston_hydro.py, hydro_check.py, kg.py",
     "url": "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/growth/scripts/"
    }
   ],
   "notes": "Our choice, per the brief's suggestion. Reason: no part of a body can respond before a stress wave reaches it, and the far end of the final body is H_final away; using the starting height would need parts to move faster than sound in his own body. Consequences: the top of his head moves at ΔH/t = 1,540·(1 − H0/H1) m/s, approaching 1,540 m/s (Mach 4.5 in air) for large growth; his sides (equivalent ball radius) move at 0.288·1,540·(1 − H0/H1), at most 444 m/s (Mach 1.3). Examples (side speed, Mach): Krakatoa 0.46 m/s; Chicxulub mix 313 m/s (0.92); Chicxulub pure size 405 m/s (1.19); Sun-second mix 402 m/s (1.18); Sun-second pure size 440 m/s (1.29). So big instant growth is supersonic and drives a shock. Speeds are constant through the growth (sudden start and stop).",
   "values_json": "{\"Krakatoa 8.4e17, pure size\": {\"t_ms\": 2.0, \"head_m_s\": 1.6, \"side_m_s\": 0.46}, \"Chicxulub 4.2e23, mix\": {\"t_ms\": 6.7, \"head_m_s\": 1090, \"side_m_s\": 313, \"side_Mach\": 0.92}, \"Chicxulub 4.2e23, pure size\": {\"t_ms\": 22.9, \"head_m_s\": 1410, \"side_m_s\": 405, \"side_Mach\": 1.19}, \"Sun 1 s, mix\": {\"t_ms\": 21, \"head_m_s\": 1395, \"side_m_s\": 402, \"side_Mach\": 1.18}, \"Sun 1 s, pure size\": {\"t_ms\": 222, \"head_m_s\": 1530, \"side_m_s\": 440, \"side_Mach\": 1.29}}",
   "who_when": "estimate (our choice)",
   "category": "growth"
  },
  {
   "key": "growth_normal_shock_nasa",
   "label": "Normal-shock pressure and density jumps (Rankine–Hugoniot)",
   "status": "verified",
   "value_si": null,
   "unit_si": "1",
   "display": "p₂/p₁ = [2γM² − (γ − 1)]/(γ + 1);  ρ₂/ρ₁ = (γ + 1)M²/[(γ − 1)M² + 2]",
   "sources": [
    {
     "title": "NASA Glenn Research Center, Beginner's Guide to Aeronautics: Normal Shock Wave",
     "url": "https://www.grc.nasa.gov/www/k-12/airplane/normal.html"
    }
   ],
   "notes": "NASA page: \"p1 / p0 = [2* gam * M^2 - (gam - 1)] / (gam + 1)\" and \"r1 / r0 = [(gam + 1) * M^2 ] / [(gam -1 ) * M^2 + 2]\" (M = upstream Mach number in the shock frame). γ = 1.4 (existing atm_ratio_specific_heats_air).",
   "who_when": "NASA GRC",
   "category": "growth"
  },
  {
   "key": "growth_piston_shock_planar",
   "label": "Air pressure in front of a flat surface pushed suddenly at speed u (piston shock)",
   "status": "derived",
   "value_si": null,
   "unit_si": "Pa",
   "display": "Δp = p₀·(2γ/(γ+1))·(M² − 1), M = (γ+1)u/(4c₀) + √[((γ+1)u/(4c₀))² + 1]. Slow: Δp ≈ ρ₀c₀u. Fast: Δp ≈ 1.2 ρ₀u². At 405 m/s: 330 kPa",
   "sources": [
    {
     "title": "NASA Glenn Research Center, Beginner's Guide to Aeronautics: Normal Shock Wave",
     "url": "https://www.grc.nasa.gov/www/k-12/airplane/normal.html"
    },
    {
     "title": "Collins et al. 2005 Eq. 59* (existing key blast_collins_peak_wind_speed), the same relation written for γ = 1.4",
     "url": "https://impact.ese.ic.ac.uk/static/effects.pdf"
    }
   ],
   "notes": "From the normal-shock relations: gas behind a shock moving at M·c0 into still air moves at u = M·c0·(1 − ρ1/ρ2) = (2c0/(γ+1))(M − 1/M); invert for M and use the pressure jump. Weak limit (u ≪ c0): Δp → ρ0 c0 u (the acoustic piston). Strong limit: Δp → ((γ+1)/2) ρ0 u² = 1.2 ρ0 u² (the brief's strong-shock form). Cross-check: for γ = 1.4 this is algebraically identical to the existing verified Collins/Glasstone wind relation u = (5p/7P0)c0/√(1 + 6p/7P0). Table (ISA air): u = 10 m/s → 4.2 kPa; 100 → 50 kPa; 340 → 250 kPa; 405 → 330 kPa; 1,000 → 1.58 MPa; 1,540 → 3.6 MPa. Use: the pressure on a large body's surface just after it suddenly starts moving (Rienstra & Hirschberg: a large, fast-accelerated sphere acts as a plane piston), and an upper bound afterwards, because a sphere lets the air escape sideways.",
   "values_json": "{\"u_m_s\": [1, 10, 100, 340.3, 405, 1000, 1540], \"shock_Mach\": [1.002, 1.018, 1.192, 1.766, 1.943, 3.79, 5.61], \"dp_kPa\": [0.42, 4.2, 50, 250, 330, 1580, 3600]}",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_taylor1946_courant_friedrichs",
   "label": "Taylor's expanding sphere (1946), as described by Courant & Friedrichs",
   "status": "verified",
   "value_si": null,
   "unit_si": "",
   "display": "A sphere expanding at constant speed drives a constant-speed shock; the air behind it keeps compressing up to the surface; the shock is much weaker than a flat piston's at the same speed",
   "sources": [
    {
     "title": "Courant & Friedrichs (1948) Supersonic Flow and Shock Waves, Interscience; scan at the Internet Archive (dli.ernet.177550), sections 158 and 162, pp. 416-428, Fig. 12",
     "url": "https://archive.org/download/dli.ernet.177550/177550-Supersonic%20Flow%20And%20Shock%20Waves.pdf"
    },
    {
     "title": "Taylor, G. I. (1946) The air wave surrounding an expanding sphere, Proc. R. Soc. A 186:273-292 (bibliographic record only; full text not readable)",
     "url": "https://doi.org/10.1098/rspa.1946.0044"
    }
   ],
   "notes": "Courant & Friedrichs p. 417: \"The simplest model is that of a 'spherical piston' pushing at constant velocity into an infinite surrounding medium ... in three-dimensional space an energy supply at an increasing rate is required to maintain constant speed of the piston.\" Section 162, p. 427: \"the shock speed Ξ can be determined as function of the prescribed velocity ξ0 of the surface of the sphere. The solution of the problem, first worked out by G. I. Taylor, is thus established.\" \"the gas particles ... are further accelerated during their motion and attain asymptotically the … [972 more characters on this line; the full prompt is in prompts/abe8faaaa1e7e546b.txt]
   "who_when": "Taylor 1946 via Courant & Friedrichs 1948",
   "category": "growth"
  },
  {
   "key": "growth_taylor_sphere_surface_pressure",
   "label": "Surface pressure on a sphere expanding at constant speed (our solution of Taylor's problem)",
   "status": "derived",
   "value_si": null,
   "unit_si": "Pa",
   "display": "Δp at the surface ≈ ρ₀u² (within 2% from 0.8 to 9 times the speed of sound; 1.16 ρ₀u² at 0.3 c₀). At u = c₀: 1.4 atm, against 2.5 atm for a flat piston",
   "sources": [
    {
     "title": "Courant & Friedrichs (1948) Supersonic Flow and Shock Waves, Interscience; scan at the Internet Archive (dli.ernet.177550), sections 158 and 162, pp. 416-428, Fig. 12",
     "url": "https://archive.org/download/dli.ernet.177550/177550-Supersonic%20Flow%20And%20Shock%20Waves.pdf"
    },
    {
     "title": "Our scripts (scratchpad): growth_calc.py, taylor_sphere.py, piston_hydro.py, hydro_check.py, kg.py",
     "url": "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/growth/scripts/"
    },
    {
     "title": "NASA Glenn Research Center, Beginner's Guide to Aeronautics: Normal Shock Wave",
     "url": "https://www.grc.nasa.gov/www/k-12/airplane/normal.html"
    }
   ],
   "notes": "We integrated the self-similar equations for isentropic flow behind a constant-speed shock (η = r/t): u' = 2c²u/[η((u−η)² − c²)], c' = −(γ−1)(u−η)u'/(2c), from the Rankine–Hugoniot state at η = Ξ inward until u = η (the sphere surface); surface pressure from the isentrope p ∝ c^(2γ/(γ−1)) (taylor_sphere.py). Independent check: a 1-D spherical Lagrangian hydro code with artificial viscosity, piston started from 0.05 and run 20-fold (piston_hydro.py): u = 0.6 c0 → shock 1.053 c0, Δp 0.526 p0 (similarity 1.050, 0.522); u = c0 → 1.328 c0, 1.412 p0 (1.329, 1.417); u = 2c0 → 2.263 c0, 5.60 p0 (2.264, 5.66); u = 0.3 c0 → Δp 0.146 p0 (0.149). The gas-speed curve we compute overlays the printed Fig. 12 exactly; our sphere-speed curve lies 0.04–0.05 c0 below the printed one (about 5% near Mach 1). We could not see Taylor's tables to tell whether the gap is in his 1946 integration or in the drawing; our two methods agree within 1%. Surface pressure / (ρ0 u²): 1.16 (u = 0.3 c0), 1.08 (0.45), 1.04 (0.6), 1.02 (0.8), 1.01 (1.0), 1.005 (1.2), 1.00 (1.5 and above). Limits: starts from zero size (self-similar); a body of finite size started suddenly sees the flat-piston pressure first (growth_piston_shock_planar), relaxing toward this within roughly R/c0; ideal gas γ = 1.4 (fine below about Mach 3).",
   "values_json": "{\"u_over_c0\": [0.3, 0.45, 0.6, 0.8, 0.98, 1.22, 1.45, 1.95, 2.73, 3.7, 5.61, 9.4], \"shock_Mach\": [null, 1.005, 1.05, 1.17, 1.31, 1.52, 1.73, 2.21, 3.0, 4.0, 6.0, 10.0], \"surface_dp_over_p0\": [0.146, 0.307, 0.522, 0.914, 1.36, 2.1, 2.95, 5.33, 10.4, 19.1, 44.0, 124], \"flat_piston_dp_over_p0\": [0.5, 0.82, 1.19, 1.78, 2.4, 3.37, 4.45, 7.4, 13.6, 24.1, 54.0, 150]}",
   "who_when": "derived (this research, 2026)",
   "category": "growth"
  },
  {
   "key": "growth_vessel_burst_he_equivalence",
   "label": "A pressure-driven blast is no worse, far out, than high explosive of the same energy",
   "status": "verified",
   "value_si": 2,
   "unit_si": "1",
   "display": "Beyond a Sachs-scaled distance R̄ = R·(p_a/E)^(1/3) of about 2, the high-explosive (pentolite) curve for the same energy is an upper limit for a gas-vessel burst",
   "sources": [
    {
     "title": "Baker, Kulesz, Ricker, Bessey, Westine, Parr & Oldham (1977) Workbook for Predicting Pressure Wave and Fragment Effects of Exploding Propellant Tanks and Gas Storage Vessels, NASA CR-134906 (Southwest Research Institute)",
     "url": "https://ntrs.nasa.gov/api/citations/19760012208/downloads/19760012208.pdf"
    }
   ],
   "notes": "Baker et al. 1977, p. 58 (PDF p. 71): \"For R greater than about 2, Figure 2-19, Ps versus R for pentolite (a high explosive) can be used as an upper limit for Ps.\" Appendix 2A (PDF p. 82): nondimensional distance R̄ = r·p_a^(1/3)/E^(1/3) (eq. 2A-3). PDF p. 86: for impulse, \"For R greater than about 0.5, all of the curves lie within about 25% of the high explosive (pentolite) curve.\" Their burst curves came from a 1-D spherical Lagrangian finite-difference code with artificial viscosity (the same method we used to check growth_taylor_sphere_surface_pressure). Use: turn the energy his growth pushes into the air into a TNT mass (existing key energy_tnt_equivalent_per_tonne) and feed the engine's Kinney–Graham curve, as an upper limit beyond R̄ ≈ 2; nearer, use the surface pressure.",
   "who_when": "Baker et al. 1977 (NASA CR-134906)",
   "category": "growth"
  },
  {
   "key": "growth_ground_reflection_2E",
   "label": "Blast source on the ground: double the energy for free-air curves",
   "status": "verified",
   "value_si": 2,
   "unit_si": "1",
   "low_si": 1,
   "high_si": 2,
   "display": "On perfectly rigid ground the equivalent free-air energy is 2E; on a perfect absorber, E",
   "sources": [
    {
     "title": "Baker, Kulesz, Ricker, Bessey, Westine, Parr & Oldham (1977) Workbook for Predicting Pressure Wave and Fragment Effects of Exploding Propellant Tanks and Gas Storage Vessels, NASA CR-134906 (Southwest Research Institute)",
     "url": "https://ntrs.nasa.gov/api/citations/19760012208/downloads/19760012208.pdf"
    }
   ],
   "notes": "Baker et al. 1977, section 1-1.2, pp. 8-9 (PDF p. 21): \"If the ground were a perfectly rigid surface, then the equivalent free-air energy driving the air blast wave would be E' = 2E. The other extreme case is that of a perfect absorber, for which E' = E. All actual tests will have equivalent free-air energies lying between these limits.\" Section 2A.6 (PDF p. 86): for a vessel burst on the ground \"assume that twice as much energy is released\". This fills the gap noted in the existing blast_kinney_graham_peak_overpressure (\"NOT verified: the usual surface-burst reflection factor\"). His growth all happens above the ground, so the factor 2 applies in full when the ground is hard.",
   "who_when": "Baker et al. 1977",
   "category": "growth"
  },
  {
   "key": "growth_instant_blast_examples",
   "label": "Instant growth: the blast from shoving the air aside",
   "status": "estimate",
   "value_si": 893000000,
   "low_si": 893000000,
   "high_si": 1450000000,
   "unit_si": "J",
   "display": "Chicxulub, pure size: 2–3 atm at his surface; 0.9–1.5 × 10⁹ J into the air, like 210–350 kg of TNT on the ground; windows shatter out to about 100–120 m. Mix: about 3–6 kg TNT, windows to about 30 m",
   "sources": [
    {
     "title": "Our scripts (scratchpad): growth_calc.py, taylor_sphere.py, piston_hydro.py, hydro_check.py, kg.py",
     "url": "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/growth/scripts/"
    },
    {
     "title": "Baker, Kulesz, Ricker, Bessey, Westine, Parr & Oldham (1977) Workbook for Predicting Pressure Wave and Fragment Effects of Exploding Propellant Tanks and Gas Storage Vessels, NASA CR-134906 (Southwest Research Institute)",
     "url": "https://ntrs.nasa.gov/api/citations/19760012208/downloads/19760012208.pdf"
    },
    {
     "title": "Courant & Friedrichs (1948) Supersonic Flow and Shock Waves, Interscience; scan at the Internet Archive (dli.ernet.177550), sections 158 and 162, pp. 416-428, Fig. 12",
     "url": "https://archive.org/download/dli.ernet.177550/177550-Supersonic%20Flow%20And%20Shock%20Waves.pdf"
    }
   ],
   "notes": "Method: equivalent ball expanding at constant side speed u = ΔR/t (growth_instant_timescale). Surface overpressure between Taylor's sphere value ≈ ρ0u² (growth_taylor_sphere_surface_pressure) and the flat-piston value (growth_piston_shock_planar, upper bound). Energy sent into the air beyond the quasi-static push: E_x = ∫(p_s − p0) dV ≈ Δp_s·ΔV. The extra p0·ΔV only pushes the atmosphere back (it ends up lifting it slightly), not into the blast. TNT mass W = E_x / 4.184e6 J/kg; ground doubling W_free = 2W (growth_ground_reflection_2E); then the engine's Kinney–Graham curve, valid as an upper limit beyond R̄ = 2. Reaches below are for W_free (low to high). Truly zero duration would need infinite energy because Δp grows as u²; the stated timescale is what keeps it finite. The top of his head moves faster (Mach 3–4.5) but sweeps little volume. Assumes he is anchored at the soles; ignores turbulence, real-gas effects and the head's own shock.",
   "values_json": "{\"Krakatoa 8.4e17 J, pure size\": {\"surface_dp_kPa\": \"≤ 0.19 (≈ ρ0 c0 u)\", \"E_x_J\": \"< 2\", \"p0_dV_J\": 890, \"note\": \"a thump, no blast\"}, \"Chicxulub 4.2e23 J, mix\": {\"surface_dp_kPa\": \"120-220\", \"E_x_J\": \"1.3e7-2.4e7\", \"TNT_kg\": \"3.2-5.8\", \"W_free_kg\": \"6.4-12\", \"windows_6.9kPa_m\": \"25-30\", \"windows_3.4kPa_m\": \"46-57\"}, \"Chicxulub 1e23 J, pure size\": {\"surface_dp_kPa\": \"180-300\", \"E_x_J\": \"1.9e8-3.1e8\", \"TNT_kg\": \"45-75\", \"W_free_kg\": \"90-150\", \"windows_6.9kPa_m\": \"60-72\", \"windows_3.4kPa_m\": \"110-130\"}, \"Chicxulub 4.2e23 J, pure size\": {\"surface_dp_kPa\": \"200-330\", \"E_x_J\": \"8.9e8-1.45e9\", \"TNT_kg\": \"210-350\", \"W_free_kg\": \"430-690\", \"windows_6.9kPa_m\": \"100-120\", \"windows_3.4kPa_m\": \"190-220\"}, \"Sun 1 s, mix\": {\"surface_dp_kPa\": \"200-320\", \"E_x_J\": \"6.7e8-1.1e9\", \"TNT_kg\": \"160-260\", \"W_free_kg\": \"320-520\", \"windows_6.9kPa_m\": \"90-110\", \"windows_3.4kPa_m\": \"170-200\"}, \"Sun 1 s, pure size\": {\"surface_dp_kPa\": \"240-370\", \"E_x_J\": \"9.6e11-1.5e12\", \"TNT_t\": \"230-360\", \"W_free_t\": \"460-720\", \"windows_6.9kPa_m\": \"1000-1200\", \"windows_3.4kPa_m\": \"1900-2200\"}, \"any, pure density\": \"no volume change, no air blast\"}",
   "who_when": "estimate (this research)",
   "category": "growth"
  },
  {
   "key": "growth_ground_push_estimate",
   "label": "Ground pushed aside by feet that grow into it",
   "status": "estimate",
   "value_si": 4.3e-11,
   "unit_si": "1",
   "display": "Anchored at the soles (recommended), his feet spread along the surface and nothing is driven into the ground. If he grew about his middle, the work on the ground would be at most about 4 × 10⁻¹¹ of the absorbed energy (pure size)",
   "sources": [
    {
     "title": "Existing key deep_rock_strength_assumption (rock strength 0.1–4.1 GPa) in research/final-density.json",
     "url": "rex-strength-lab/research/final-density.json"
    }
   ],
   "notes": "Work to push ground of strength q aside by volume V_g: W ≈ q·V_g. Pure size, centred growth: about half the added volume goes below ground, so W/E ≈ q/(2ρ_body c²) ≤ 4.1e9/(2 × 1,060 × 8.99e16) ≈ 2e-11 (static, strongest rock); dynamic, instant (ρ_rock u² with 2,700 kg/m^3 and 1,540 m/s = 6.4 GPa): ≈ 3e-11. The display uses the larger whole-volume form q/(ρ c²) = 4.3e-11 as a round upper value. Feet growing into soil also raise the bearing load; the Weight tab already handles sinking. Choosing the soles as the fixed point avoids the question and is the least disruptive reading.",
   "who_when": "estimate",
   "category": "growth"
  },
  {
   "key": "growth_loop_air_ratio",
   "label": "Runaway loop, surroundings: energy pushed into the air per energy absorbed",
   "status": "derived",
   "value_si": 1.06e-15,
   "low_si": 0,
   "high_si": 5e-15,
   "unit_si": "1",
   "display": "Pure size: 1 × 10⁻¹⁵ slow, 3–5 × 10⁻¹⁵ instant. Mix: 10⁻¹⁶ to 10⁻¹⁸. Pure density: 0. Even pushing rock: below 10⁻¹⁰",
   "sources": [
    {
     "title": "Our scripts (scratchpad): growth_calc.py, taylor_sphere.py, piston_hydro.py, hydro_check.py, kg.py",
     "url": "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/growth/scripts/"
    },
    {
     "title": "Existing key collide_sound_speed_upper_bound (36.1 km/s) in research/final-duo.json",
     "url": "https://arxiv.org/abs/2004.04818"
    }
   ],
   "notes": "Ratio = (p0 + Δp_s)·ΔV / (Δm c²). Pure size: ΔV = Δm/ρ_body, so ratio = (p0 + Δp_s)/(ρ_body c²); slow growth (Δp_s ≈ 0): 101,325/(1,060 × 8.99e16) = 1.06e-15; instant: (p0 + 2–3.5e5 Pa)/(ρ c²) = 3–5e-15 (max with surface speed 444 m/s). Mix: ΔV/Δm = 1/(ρ0(√k + 1)), so the ratio falls as growth proceeds: Chicxulub 2.6e-17 slow, 5.8–8.4e-17 instant; Sun-second 9e-19 slow, 2.6–3.8e-18 instant. Pure density: no volume change, 0. The brief's \"about 10^-15\" is right for pure size and generous for the others. Bound for any ordinary matter: pushing matter aside takes at most about its stiffness ρ c_s², and c_s ≤ 36.1 km/s (existing key), so the ratio is at most about (36.1 km/s / c)² = 1.5e-8 even for matter as dense as he is. Whether the loop multiplies energy at all depends on canon: if the shove is paid from the absorbed energy, re-absorbing it only returns what was spent (net growth still E/c²); if the shove is powered from the endless store, the loop adds a factor 1/(1 − ratio), i.e. 1 + 10^-15.",
   "values_json": "{\"Krakatoa, pure size\": {\"slow\": 1.06e-15, \"instant\": 1.06e-15}, \"Chicxulub 4.2e23, mix\": {\"slow\": 2.6e-17, \"instant\": \"5.8e-17 to 8.4e-17\"}, \"Chicxulub 4.2e23, pure size\": {\"slow\": 1.06e-15, \"instant\": \"3.2e-15 to 4.5e-15\"}, \"Sun 1 s, mix\": {\"slow\": 8.9e-19, \"instant\": \"2.6e-18 to 3.8e-18\"}, \"Sun 1 s, pure size\": {\"slow\": 1.06e-15, \"instant\": \"3.6e-15 to 5.0e-15\"}, \"pure density\": 0, \"rock, upper bound\": 4.3e-11, \"any ordinary matter, bound\": 1.5e-08}",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_binding_energy_uniform_sphere",
   "label": "Gravitational binding energy of a uniform ball (Newtonian and general-relativistic)",
   "status": "verified",
   "value_si": null,
   "unit_si": "J",
   "display": "Newtonian: 3GM²/(5R). Exact for a uniform ball in general relativity: BE/M = (3/4β)[sin⁻¹√(2β)/√(2β) − √(1 − 2β)] − 1 ≈ 3β/5 + 9β²/14 + …, β = GM/(Rc²)",
   "sources": [
    {
     "title": "Lattimer & Prakash (2001) Neutron Star Structure and the Equation of State, ApJ 550:426; arXiv:astro-ph/0002232, section 6, eqs. (33)-(35)",
     "url": "https://arxiv.org/pdf/astro-ph/0002232"
    }
   ],
   "notes": "Lattimer & Prakash section 6 (arXiv text p. 29-30): \"The binding energy formally represents the energy gained by assembling N baryons ... BE = N m_b − M in mass units.\" \"In the cases of the incompressible fluid and the Buchdahl solution, analytic results for the binding energy can be found\", eq. (34): BE_Inc/M = (3/4β)[sin⁻¹√(2β)/√(2β) − √(1 − 2β)] − 1 ≈ 3β/5 + 9β²/14 + 5β³/6 + ···, with β ≡ GM/Rc² (defined on PDF p. 17). Its leading term 3β/5 times Mc² is the Newtonian uniform-sphere 3GM²/(5R); we checked the series numerically (β = 0.01 gives 0.0060651). The existing key energy_earth_gravitational_binding uses the same 3/5 formula via Wikipedia; this is a primary citation for it. For Rex at canon: 3GM²/(5R) = 4.1e-4 J; β = 2.5e-24.",
   "who_when": "Lattimer & Prakash 2001",
   "category": "growth"
  },
  {
   "key": "growth_binding_energy_fit_lp2001",
   "label": "Binding energy of real neutron stars (fit)",
   "status": "verified",
   "value_si": null,
   "unit_si": "1",
   "display": "BE/M ≈ 0.6β/(1 − 0.5β)",
   "sources": [
    {
     "title": "Lattimer & Prakash (2001) Neutron Star Structure and the Equation of State, ApJ 550:426; arXiv:astro-ph/0002232, section 6, eqs. (33)-(35)",
     "url": "https://arxiv.org/pdf/astro-ph/0002232"
    }
   ],
   "notes": "Eq. (33): \"Here, we propose a more accurate representation of the binding energy: BE/M ≃ 0.6β/(1 − 0.5β)\". Fitted to neutron-star models with realistic equations of state; the older Lattimer & Yahil form \"BE ≈ 1.5·10^51 (M/M⊙)² ergs\" is \"accurate at best to about ±20%\". Context only: shows that real compact stars release 10-20% of their mass as binding energy, the regime where the gravitational loop stops being negligible.",
   "who_when": "Lattimer & Prakash 2001",
   "category": "growth"
  },
  {
   "key": "growth_loop_gravity_newtonian",
   "label": "Runaway loop, own gravity (Newtonian): binding energy released per energy absorbed",
   "status": "derived",
   "value_si": 3.05e-24,
   "unit_si": "1",
   "display": "d(3GM²/5R)/d(Mc²) = 0.6 r_s/R (pure density), 0.55 r_s/R (mix), 0.5 r_s/R (pure size). It reaches 1 only at R = 0.6, 0.55 or 0.5 r_s: inside the event horizon. At canon it is about 3 × 10⁻²⁴",
   "sources": [
    {
     "title": "Lattimer & Prakash (2001) Neutron Star Structure and the Equation of State, ApJ 550:426; arXiv:astro-ph/0002232, section 6, eqs. (33)-(35)",
     "url": "https://arxiv.org/pdf/astro-ph/0002232"
    },
    {
     "title": "Existing key schwarzschild_radius (r_s = 2GM/c²)",
     "url": "https://en.wikipedia.org/wiki/Schwarzschild_radius"
    }
   ],
   "notes": "U = 3GM²/(5R) with R ∝ M^α (α = 0 pure density, 1/6 mix, 1/3 pure size, from V ∝ M^a). U ∝ M^(2−α), so dU/dM = (2−α)U/M = (2−α)(3/5)GM/R. Divide by c² and use r_s = 2GM/c²: ratio = (3/10)(2−α)·r_s/R = 0.6 r_s/R (α = 0), 0.55 r_s/R (α = 1/6), 0.5 r_s/R (α = 1/3). Ratio = 1 at R = 0.6 r_s, 0.55 r_s, 0.5 r_s, all inside r_s; at R = r_s the ratio is only 0.6, 0.55, 0.5; at Buchdahl's 9/8 r_s (existing key buchdahl_bound) 0.53, 0.49, 0.44. At canon (β = GM/Rc² = 2.54e-24): 3.05e-24, 2.79e-24, 2.54e-24. After a Chicxulub in pure density: 4.7e-21; after a Sun-second in pure density (white-dwarf matter): 4.3e-18. Newtonian gravity fails near r_s; see growth_loop_gravity_gr.",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_loop_gravity_gr",
   "label": "Runaway loop, own gravity (general relativity, uniform ball): reaches 1 exactly at the event horizon",
   "status": "derived",
   "value_si": null,
   "unit_si": "1",
   "display": "Share of each absorbed joule released again by deeper binding: 1% at R = 50 r_s, 12% at 5 r_s, 73% at Buchdahl's limit (1.125 r_s), and 1 only as R → r_s",
   "sources": [
    {
     "title": "Lattimer & Prakash (2001) Neutron Star Structure and the Equation of State, ApJ 550:426; arXiv:astro-ph/0002232, section 6, eqs. (33)-(35)",
     "url": "https://arxiv.org/pdf/astro-ph/0002232"
    },
    {
     "title": "Our scripts (scratchpad): growth_calc.py, taylor_sphere.py, piston_hydro.py, hydro_check.py, kg.py",
     "url": "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/growth/scripts/"
    }
   ],
   "notes": "Rest (proper) mass M_p = M(1 + g(β)) with g from Lattimer & Prakash eq. (34). Adding rest mass dM_p raises the gravitational mass by dM; the rest is released: loop ratio f = 1 − dM/dM_p, dM_p/dM = 1 + g + (1−α)βg'(β). g'(β) diverges only as β → 1/2 (R → r_s), because of the √(1 − 2β) term, so f → 1 exactly at the horizon for every growth form. Values (pure density / mix / pure size): β = 0.01 (R = 50 r_s) 0.012/0.011/0.010; β = 0.1 (5 r_s) 0.125/0.116/0.106; β = 0.3 (1.67 r_s) 0.42/0.40/0.37; β = 4/9 (Buchdahl) 0.73/0.70/0.67; β = 0.49 (1.02 r_s) 0.90/0.88/0.86; β = 0.4999 0.991/0.989/0.986. Small β matches the Newtonian 1.2β, 1.1β, β. Caveat: a static uniform perfect fluid cannot exist beyond β = 4/9; an indestructible body with arbitrary internal stresses can go further (Andréasson, existing key buchdahl_bound). Energy books: seen from outside, absorbing E always raises his gravitational mass by exactly E/c²; the loop only turns released binding energy into more rest mass, which is why it can diverge only at the horizon.",
   "values_json": "{\"beta\": [0.01, 0.1, 0.2, 0.3, 0.4444, 0.49, 0.499, 0.4999], \"R_over_rs\": [50, 5, 2.5, 1.667, 1.125, 1.02, 1.002, 1.0002], \"f_density\": [0.012, 0.125, 0.264, 0.423, 0.728, 0.896, 0.969, 0.991], \"f_mix\": [0.011, 0.116, 0.245, 0.396, 0.701, 0.88, 0.964, 0.989], \"f_size\": [0.01, 0.106, 0.225, 0.368, 0.667, 0.859, 0.955, 0.986], \"BE_over_M\": [0.0061, 0.067, 0.155, 0.279, 0.641, 0.993, 1.229, 1.314]}",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_black_hole_thresholds",
   "label": "How much absorbed energy would make him a black hole, for each growth form",
   "status": "derived",
   "value_si": 5.31e+43,
   "unit_si": "J",
   "display": "Pure density: 5.9 × 10²⁶ kg at 2.1 × 10²⁶ kg/m³, needing 5.3 × 10⁴³ J (the Sun's output for 4.4 billion years). Mix: 2.7 × 10³¹ kg (14 Suns), 139 km tall. Pure size: 1.3 × 10⁸ Suns, 2.6 au in radius",
   "sources": [
    {
     "title": "NIST CODATA 2022: speed of light in vacuum",
     "url": "https://physics.nist.gov/cgi-bin/cuu/Value?c"
    },
    {
     "title": "NIST CODATA G (existing key gravitational_constant)",
     "url": "https://physics.nist.gov/cgi-bin/cuu/Value?bg"
    },
    {
     "title": "Project canon: CLAUDE.md in this repository (3,007 kg, 3.048 m, 1,060 kg/m^3)",
     "url": "CLAUDE.md"
    }
   ],
   "notes": "Horizon when r_s = 2GM/c² equals R. Pure density (R = 0.8782 m): M = Rc²/(2G) = 5.91e26 kg, ρ = 2.08e26 kg/m^3; energy (M − m0)c² = 5.31e43 J = 1.39e17 s of solar output = 4.4e9 years. Mix: R = R0(M/m0)^(1/6) = 2GM/c² gives M = 2.69e31 kg, R = 40 km, H = 139 km, ρ = 1.0e17 kg/m^3; E = 2.4e48 J (2e14 years of sunlight). Pure size at 1,060 kg/m^3: M = √(3c⁶/(32πG³ρ)) = 2.62e38 kg (1.3e8 solar masses), R = 3.9e11 m. Flag: the existing estimate density_black_hole_rex_2m says 2.24e26 kg/m^3 and 5.7e26 kg for the default 10 ft Rex; that matches the old 2.54 m^3 front-only volume. With the canon 2.84 m^3 it is 2.08e26 kg/m^3 and 5.9e26 kg.",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_bondi_infall_loop",
   "label": "Runaway loop, air falling onto a dense body",
   "status": "derived",
   "value_si": null,
   "unit_si": "1",
   "display": "Each kilogram of infalling air releases GM/R = (r_s/2R)c² (Newtonian; 1 − √(1 − r_s/R) of c² in relativity): below 1 outside the horizon. Infall only starts when the Bondi radius exceeds his size, at about 5 × 10¹⁴ kg/m³, and is capped by the atmosphere's mass",
   "sources": [
    {
     "title": "Existing key bondi_radius_and_rate (Edgar 2004, arXiv:astro-ph/0406166)",
     "url": "https://arxiv.org/abs/astro-ph/0406166"
    },
    {
     "title": "Lattimer & Prakash (2001) Neutron Star Structure and the Equation of State, ApJ 550:426; arXiv:astro-ph/0002232, section 6, eqs. (33)-(35)",
     "url": "https://arxiv.org/pdf/astro-ph/0002232"
    },
    {
     "title": "Our scripts (scratchpad): growth_calc.py, taylor_sphere.py, piston_hydro.py, hydro_check.py, kg.py",
     "url": "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/growth/scripts/"
    }
   ],
   "notes": "Engine: heatPerKg = GM/R, Bondi rate Ṁ = 4πλG²M²ρ/c_s³ with λ = 0.625, only when r_B = GM/c_s² > R. Converting infall energy to mass gives dM/dt = Ṁ·GM/(Rc²) = Ṁ·β. Onset for R = 0.878 m: M = R c_s²/G = 1.5e15 kg (ρ = 5.4e14 kg/m^3); there Ṁ = 2.5e3 kg/s, infall power 2.9e8 W, mass growth from it 3e-9 kg/s, e-folding time 5e23 s: negligible. Near the horizon (pure density, half the black-hole mass) Ṁ ≈ 1e26 kg/s would swallow the whole atmosphere (5.1e18 kg, existing atm_total_mass) in about 5e-8 s, so the total infall energy is capped at about M_atm·βc² < 5e35 J (adds < 5e18 kg). The GR form 1 − √(1 − 2β) is the standard redshifted energy release for matter at rest on a static surface (same factor as Lattimer & Prakash eq. 1), not separately sourced.",
   "who_when": "derived",
   "category": "growth"
  },
  {
   "key": "growth_runaway_verdict",
   "label": "Can the growth loop run away outside a black hole?",
   "status": "derived",
   "value_si": null,
   "unit_si": "",
   "display": "No. Shoving the air returns about 10⁻¹⁵ of the energy, pushing rock at most about 10⁻¹¹, any ordinary matter at most about 10⁻⁸; their own gravity returns a share that reaches 1 only at the event horizon. The half-life only matters once he is already a black hole",
   "sources": [
    {
     "title": "Our scripts (scratchpad): growth_calc.py, taylor_sphere.py, piston_hydro.py, hydro_check.py, kg.py",
     "url": "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/research/growth/scripts/"
    },
    {
     "title": "Lattimer & Prakash (2001) Neutron Star Structure and the Equation of State, ApJ 550:426; arXiv:astro-ph/0002232, section 6, eqs. (33)-(35)",
     "url": "https://arxiv.org/pdf/astro-ph/0002232"
    }
   ],
   "notes": "Summary of growth_loop_air_ratio, growth_ground_push_estimate, growth_loop_gravity_newtonian, growth_loop_gravity_gr and growth_bondi_infall_loop. With a constant ratio f < 1 the loop is a geometric series: total = E/(1 − f), i.e. 1 + 10^-15 for any everyday case. The gravitational ratio is ≥ 1 only when R ≤ r_s (relativistic) or R ≤ 0.5–0.6 r_s (Newtonian), i.e. after the Weight tab has already declared a black hole. Energy conservation: seen from outside, his gravitational mass rises by exactly E/c²; the loop can only add rest mass bound ever more tightly.",
   "who_when": "derived",
   "category": "growth"
  }
 ]
}
```

</details>

**Claude · 2026-10-11 18:05:11 UTC**

Research is running (three workflows, seven topics, each with a verifier). Meanwhile I'm reading the page code to plan the build.


- `Bash` Read the page's HTML skeleton and controls: `cd /home/user/rex-strength-lab/rex-strength-lab && sed -n 230,400p src/app.html`
- `Bash` Read the page state, controls, tabs and the Lift bay: `sed -n 530,1012p src/app.html`
- `Read` /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/tool-results/bkwyw90te.txt
- `Bash` Read the Throw bay: `sed -n 1013,1160p src/app.html`
- `Bash` Read the Jump, Stomp, Punch, Clap and Sprint bays: `sed -n 1160,1365p src/app.html`
- `Bash` Read the Pull bay, renderBay, the ladder and init: `sed -n 2544,2864p src/app.html`

**Claude · 2026-10-11 18:05:57 UTC**

Finished reading the page. Now checking the data tables (overpressure levels) and the tests before designing the engine additions.


- `Bash` Find overpressure, energy and speed tables in build-data.py: `sed -n 150,386p build-data.py | grep -n "overpressure\|energyRefs\|speeds\|densities\|dict(id='windows\|def \|^[a-z_]* = \[" | head -40; grep -n "overpressur...`
- `Bash` Read energy refs, output section of build-data, and test harnesses: `sed -n 190,214p build-data.py && sed -n 225,250p build-data.py && sed -n 330,386p build-data.py && cat test/shots.js && sed -n 1,60p test/calibration.js`
- `Bash` Find every use of the strength in move code: `grep -n "ctx.F\b\|ctx\.F[^a-zA-Z]" src/engine.js | head -60; grep -n "cA.F\|cB.F\|c.F\b" src/engine.js | head -40`
- `Bash` Add effort (strength used for the drive) to the engine moves: `python3 - <<'EOF'` (+34 lines)
- `Bash` Check all-out effort reproduces the old engine exactly: `python3 - <<'EOF'` (+35 lines)
- `ToolSearch` select:TaskCreate,TaskUpdate,TaskList

**Claude · 2026-10-11 18:10:12 UTC**

Effort is in the engine and all-out reproduces the old results exactly (144 cases). Setting up a task list, then building the restraint solver.


- `TaskCreate` Research: verified facts (3 workflows, 7 topics)
- `TaskCreate` Walk tab: presence engine + page
- `TaskCreate` Effort, courtesy ceiling, presets on solo and duo tabs
- `TaskCreate` Comic switches
- `TaskCreate` Growth modes and forms
- `TaskCreate` Tests, review rounds, fixes, publish, PR, history
- `TaskUpdate` #1 status=in_progress
- `Bash` Check research workflow progress: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ && for d in wf_*; do echo "== $d"; ls $d | he...`

**Claude · 2026-10-11 18:12:01 UTC**

Research still running. Writing the growth physics now (it needs only formulas; research will check the constants).


- `Bash` Locate the insertion point before threshold(): `cd /home/user/rex-strength-lab/rex-strength-lab && grep -n "^  function threshold" src/engine.js && sed -n 2775,2790p src/engine.js`
- `Bash` Add growth physics to the engine and check worked examples: `python3 - <<'EOF'` (+104 lines)
- `Bash` Time each move function per call: `node -e "` (+7 lines)

**Claude · 2026-10-11 18:13:47 UTC**

Throw takes about 9 ms per call, so the effort solver must run in time slices like the strength ladder does. Checking research progress before writing it.


- `Bash` Check research workflow progress and downloads: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ && for d in wf_*; do echo "== $d $(wc -l < $d...`

**Claude · 2026-10-11 18:13:58 UTC**

Writing the restraint solver (goals, hazards, ceiling, presets) with hooks for the vibration model that research will pin down.


- `Bash` Add the restraint solver and run it on each solo move: `cd /home/user/rex-strength-lab/rex-strength-lab && python3 - <<'EOF'` (+218 lines)

**Claude · 2026-10-11 18:15:07 UTC**

The solver works (throw 36 move runs, about 0.2 s). Restructuring it so the page can finish the one search it needs at once and the rest in the background.


- `Bash` Restructure the plan into resumable jobs and re-test: `python3 - <<'EOF'` (+83 lines)
- `Bash` Switch searches to a shared log grid and re-test all moves: `python3 - <<'EOF'` (+48 lines)

**Claude · 2026-10-11 18:16:30 UTC**

The grid search finds first onsets correctly now, including at unlimited strength. Next: the page's effort controls. Adding state first.


- `Bash` Look at the DOM helpers and CSS class names: `grep -n "const el = \|function el(\|const sv = \|function sv(" src/app.html | head; sed -n 400,422p src/app.html; grep -n "^  \.[a-z-]* {\|^\.[a-z-]*" src/ap...`
- `Bash` Read the CSS tokens and responsive rules: `sed -n 1,45p src/app.html && sed -n 130,228p src/app.html`

**Claude · 2026-10-11 18:17:04 UTC**

Writing the page side: state, plan cache with background stepping, the effort controls and readout.


- `Bash` Record the most harmless effort (below) in each search: `python3 - <<'EOF'` (+55 lines)
- `Bash` Add effort state, presets and validation to the page: `python3 - <<'EOF'` (+45 lines)
- `Bash` Add the effort controls and readout to the page; build and screenshot: `python3 - <<'EOF'` (+193 lines)
- `Read` /home/user/rex-strength-lab/rex-strength-lab/shots/throw-1280.png

**Claude · 2026-10-11 18:19:11 UTC**

Effort works on the page (screenshot: least-disruptive throw of the car to 30 m uses 29% of Hulk-level strength; the ceiling and hazard onsets appear). Checking research.


- `Bash` Check research workflow journals: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ && for d in wf_*; do echo "== $d $(wc -l < $d...`

**Claude · 2026-10-11 18:19:16 UTC**

Research agents are all still in their first stage. Committing the work in progress, then building the comic switches in the engine.


- `Bash` Commit and push the work in progress: `git add -A rex-strength-lab/src rex-strength-lab/dist/index.html && git status --short | head && git commit -q -m "Rex lab: effort in the engine (strength us...` (+3 lines)


> **Commit** `64a56d2` · 2026-10-11 18:19:19 UTC · Rex lab: effort in the engine (strength used for each move's push), restraint solver (goals, hazards, courtesy ceiling, presets), growth physics, effort controls on the solo tabs (work in progress; vibration constants are placeholders until research lands)  [rex-strength-lab]


- `Bash` Find grip, crush, sag, break-up and heating code paths: `cd /home/user/rex-strength-lab/rex-strength-lab && grep -n "crush\|sag\|bursts\|breakup\|heatVerdict\|fireball" src/engine.js | sed -n 1,80p`
- `Bash` Read catchIt and the catch-leg outcome logic: `sed -n 2405,2500p src/engine.js && sed -n 2655,2700p src/engine.js`

**Claude · 2026-10-11 18:20:00 UTC**

Comic switches next. Checking what the flight integrator already reports about drag energy and heating.


- `Bash` Inspect fly() outputs for drag energy and heating: `sed -n 446,470p src/engine.js && grep -n "dragE\|heatLoad\|maxStagT\|qDynMax" src/engine.js | head -30 && sed -n 560,590p src/engine.js`

**Claude · 2026-10-11 18:20:24 UTC**

Writing the switches into the engine: gentle hold (grip and launch crushing), cool flight (drag heat absorbed), and passenger launch g.


- `Bash` Add gentle hold, launch g and drag loss to lift and throw: `python3 - <<'EOF'` (+32 lines)
- `Bash` Apply gentle hold and cool flight in the game of catch: `python3 - <<'EOF'` (+29 lines)

**Claude · 2026-10-11 18:20:58 UTC**

Adding the jump's landing to the engine (he lands on bent legs over the same stroke he pushed off with), which soft landing will absorb.


- `Bash` Add jump landing physics and check it: `python3 - <<'EOF'` (+39 lines)

**Claude · 2026-10-11 18:21:39 UTC**

Engine side of the switches is in. Now the page: a "Comic switches" panel in the left column and an absorbed-energy block that follows the chosen absorption mode.


- `Bash` Check human mass facts and object list structure: `python3 -c "` (+6 lines)
- `Bash` Add the person object, comic switches panel and switch state: `python3 - <<'EOF'` (+74 lines)
- `Bash` Wire the switch controls and include them in the plan key: `python3 - <<'EOF'` (+34 lines)
- `Bash` Read the number formatting helpers: `sed -n 434,520p src/app.html`
- `Bash` Add the absorbed-energy and growth report helpers: `python3 - <<'EOF'` (+61 lines)
- `Bash` Apply silent strike to the Punch and Clap bays: `python3 - <<'EOF'` (+28 lines)

**Claude · 2026-10-11 18:23:30 UTC**

Silent strike is wired into Punch and Clap. Next: soft landing on Jump, and gentle hold, cool flight and the passenger on Throw and Lift.


- `Bash` Check which research agents have finished: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ && for d in wf_*; do echo "== $d $(wc -l < $d...`
  - result: Exit code 1
  - result: == wf_01258728-142 3 lines
  - result: "label":"research:comic","phase":"Research"
- `Bash` Locate the Jump, Throw and Lift lines to change: `grep -n "up && f.landed ? tile('Comes back down at'\|Indestructible, so the landing is the ground’s problem\|if (f.maxStagT > 1200 && !f.relativistic) items....`
- `Bash` Read the Jump bay's landing text: `sed -n 1336,1352p src/app.html`
- `Bash` Show the jump's landing load and soft landing: `python3 - <<'EOF'` (+20 lines)
- `Bash` Wire gentle hold, cool flight and passenger into Throw and Lift; build and test: `python3 - <<'EOF'` (+56 lines)

**Claude · 2026-10-11 18:24:48 UTC**

Builds clean. Writing a quick scratch harness that drives the page with switches on and dumps each bay's text, to catch broken sentences early.


- `Bash` Create a page-text harness and check Punch and Jump with switches on: `mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/dev && cat > /tmp/claude-0/-home-user-rex-strength-lab/ba0...` (+30 lines)

**Claude · 2026-10-11 18:25:13 UTC**

Switches render correctly. Adding the growth what-if to the Weight tab (energy presets with the three growth forms side by side), which also covers the brief's worked examples.


- `Bash` Find the end of the Weight bay: `cd /home/user/rex-strength-lab/rex-strength-lab && grep -n "function bayWeight" src/app.html && awk 'NR>=1560 && NR<=1720 && /return out;|out.push\(math/ {pr...`
- `Bash` Find the Weight bay's return statement: `awk 'NR>=1603 && NR<=1760 && (/return out;/ || /out.push\(math/ || /^  }$/) {print NR": "$0}' src/app.html | head; sed -n 1603,1612p src/app.html`
- `Bash` Add the growth what-if section to the Weight tab: `python3 - <<'EOF'` (+37 lines)
- `Bash` Fix the chip row call and check the Weight what-if text: `python3 - <<'EOF'` (+9 lines)
- `Bash` Check the growth what-if with instant and runaway modes: `cd /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/dev && python3 - <<'EOF'` (+14 lines)
- `Bash` Show raw harness output for the Weight what-if: `cd /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/dev && node bays.js '{}' weight '#grow-what-chicxulub,select:abs...`

**Claude · 2026-10-11 18:28:06 UTC**

Testing the growth what-if; fixing my harness to set closed-panel controls directly.


- `Bash` Set selects via script and re-check the what-if: `cd /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/dev && sed -i "s|if (sel.startsWith('select:')) { const \[, id, ...`

**Claude · 2026-10-11 18:28:24 UTC**

Growth what-if works (Chicxulub: 4,670 t added; mix 10.4 m, pure size 35.3 m, pure density 1.6 × 10⁶ kg/m³). Checking research again.


- `Bash` Check research progress; show densities to 3 figures: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ && for d in wf_*; do echo "== $d $(wc -l < $d...`
- `Bash` Peek at the finished research result's shape: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/wf_83090d59-a30 && python3 -c "` (+9 lines)
- `Bash` Read the ripple research result: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/wf_83090d59-a30 && python3 -c "` (+9 lines)
- `Bash` Add a provisional walking step and presence model to the engine: `cd /home/user/rex-strength-lab/rex-strength-lab && python3 - <<'EOF'` (+81 lines)

**Claude · 2026-10-11 18:29:45 UTC**

Provisional numbers look plausible (an ordinary step is felt about 3 m away; a stamp about 18 m). Now the Walk tab itself.


- `Bash` Add the Walk tab (controls, verdict, chart, canon target): `python3 - <<'EOF'` (+125 lines)
- `Read` /home/user/rex-strength-lab/rex-strength-lab/shots/walk-1280.png

**Claude · 2026-10-11 18:30:52 UTC**

The Walk tab renders (soft-footed by default; the canon-target line computes which step effort makes glasses ripple 3 m away). Chart labels need tidying later. Committing, then checking research.


- `Bash` Commit, push and check research progress: `cd /home/user/rex-strength-lab && git add -A rex-strength-lab/src rex-strength-lab/build-data.py rex-strength-lab/dist/index.html && git commit -q -m "Rex la...` (+3 lines)


> **Commit** `0ef1d54` · 2026-10-11 18:30:56 UTC · Rex lab: comic switches (gentle hold, safe passenger, silent strike, soft landing, cool flight), absorption modes and growth what-if, jump landing, Walk tab with a provisional step model (work in progress)  [rex-strength-lab]


- `Bash` Read the newly finished research results: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ && python3 - <<'EOF'` (+12 lines)
- `Read` /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/tool-results/bjsp25yqw.txt
- `Bash` Replace the provisional step model with the researched one: `cd /home/user/rex-strength-lab/rex-strength-lab && python3 - <<'EOF'` (+98 lines)

**Claude · 2026-10-11 18:32:41 UTC**

Footprints must use the sustained weight-bearing load, not the 30 ms stamp peak (a stamp in soft clay came out 26 m deep). Fixing that.


- `Bash` Use the sustained load for footprints and the ground check: `python3 - <<'EOF'` (+21 lines)
- `Bash` Summarise which research and verify stages are done: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ && for d in wf_*; do echo "== $d $(wc -l < $d...` (+8 lines)

**Claude · 2026-10-11 18:32:57 UTC**

Waiting on four research topics. Meanwhile: shared effort for the two-player tabs. Reading how those tests use strength.


- `Bash` Read arm wrestling and the wrestling push code: `cd /home/user/rex-strength-lab/rex-strength-lab && sed -n 1478,1530p src/engine.js && sed -n 1560,1700p src/engine.js | grep -n "F\b\|\.F" | head -40`
- `Bash` Find the hazard fields the two-player bays show: `grep -n "tableBreaks\|slamRatio\|r.quake\|\.crater\b\|windows\|blastRadius\|sonic\|K.a0" src/app.html | awk -F: '$1>1780 && $1<2800' | head -60`
- `Bash` List the engine calls each two-player bay makes: `grep -n "P\.armWrestle\|P\.pushMatch\|P\.shove\|P\.shoveBoth\|P\.liftPartner\|P\.throwPartner\|P\.catchGame\|P\.collide\|P\.catchLeg\|P\.tossPartner\|functio...`
- `Bash` Check research progress again: `sleep 1; cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ && for d in wf_*; do python3 -c "` (+8 lines)

**Claude · 2026-10-11 18:33:57 UTC**

Implementing the shared effort for the two-player tabs while the rest of the research runs. Reading the Collide bay's outputs first.


- `Bash` Read the Collide bay controls and hazard chips: `cd /home/user/rex-strength-lab/rex-strength-lab && sed -n 2524,2545p src/app.html && sed -n 2640,2700p src/app.html`

**Claude · 2026-10-11 18:34:19 UTC**

Writing the shared effort for the two-player tabs: one cap on both, the least-disruptive setting being the hardest they can go with nothing breaking, and Ollie can have his own as a what-if.


- `Bash` Add the shared effort for the two-player tabs: `python3 - <<'EOF'` (+174 lines)
- `Bash` Find the collide result's head-on fields: `sed -n 2600,2615p src/app.html; grep -n "function collide(cA, cB, o)" -A 5 src/engine.js | head; grep -n "return Object.assign(out\|out.h = \| h: h\|, h,\|{ ...`
- `Bash` Build, screenshot, and check the two-player effort text: `python3 - <<'EOF'` (+16 lines)

**Claude · 2026-10-11 18:35:53 UTC**

Two-player effort works (arm wrestling: the table tears past 6.8% of Hulk-level strength, so least disruptive stops there). Committing and checking research.


- `Bash` Commit, push, check research: `git add -A rex-strength-lab/src rex-strength-lab/dist/index.html && git commit -q -m "Rex lab: researched step model (gait by Froude scaling, heel strike, dr...` (+11 lines)


> **Commit** `80983a4` · 2026-10-11 18:35:59 UTC · Rex lab: researched step model (gait by Froude scaling, heel strike, drill stamp, footprints), shared effort in the two-player tests (work in progress)  [rex-strength-lab]


- `Bash` Read the ripple verifier's corrections: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/wf_83090d59-a30 && python3 -c "` (+9 lines)
- `Bash` Generate the all-out baseline fixture from main's engine: `cd /home/user/rex-strength-lab/rex-strength-lab && mkdir -p test/fixtures && git show main:rex-strength-lab/src/engine.js > /tmp/claude-0/-home-user-rex-stre...` (+36 lines)

**Claude · 2026-10-11 18:36:55 UTC**

Baseline written from `main`'s engine (432 setting combinations). Now the test file for the brief's checks.


- `Bash` Write test/presence.js and run it: `cat > test/presence.js <<'EOF'` (+111 lines)

**Claude · 2026-10-11 18:38:06 UTC**

All 143 new checks pass. Running the existing calibration suite to make sure nothing regressed.


- `Bash` Run the existing calibration and physics checks: `timeout 300 node test/calibration.js 2>&1 | tail -5`
- `Bash` Upgrade the screenshot test to four views, all tabs and text checks: `python3 - <<'EOF'` (+40 lines)

**Claude · 2026-10-11 18:41:21 UTC**

Screenshot test passes in all four views across 14 tabs. Adding the new test to CI, then checking research.


- `Bash` Add the presence test to CI and check research: `cd /home/user/rex-strength-lab && python3 - <<'EOF'` (+20 lines)

**Claude · 2026-10-11 18:41:28 UTC**

Thresholds research is in, and the comic verifier finished. Reading both.


- `Bash` Extract the thresholds research and the comic verification: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ && python3 - <<'EOF' > /tmp/claude-0/-home-us...` (+18 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/thresholds_comicverify.txt
- `Bash` Apply the verified thresholds and passenger limits in the engine: `cd /home/user/rex-strength-lab/rex-strength-lab && python3 - <<'EOF'` (+58 lines)
- `Bash` Update the page and tests for the new thresholds: `python3 - <<'EOF'` (+69 lines)

**Claude · 2026-10-11 18:44:04 UTC**

Tests still pass (fewer ceiling checks run because the stricter 100 Pa harm line now sits below more goals). Checking research.


- `Bash` Check research progress: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ && for d in wf_*; do python3 -c "` (+8 lines)

**Claude · 2026-10-11 18:44:15 UTC**

While the last research finishes, updating the Walk tab to the new step fields (footprint, impact peak, stance) and saving the raw research results for the history record.


- `Bash` Locate Walk bay lines that use old step fields: `cd /home/user/rex-strength-lab/rex-strength-lab && grep -n "st.ratio > 1 ? status('warn', 'Footprints\|tile('Load on each step'\|tile('Ground under each step...`
- `Bash` Show footprints and the researched step model on the Walk tab: `python3 - <<'EOF'` (+35 lines)
- `Bash` Save research and verify results to scratch files: `cat > /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/dev/dump_research.py <<'EOF'` (+23 lines)
- `Bash` Read the fighter card function: `sed -n "$(grep -n 'function fighterCard' src/app.html | cut -d: -f1),+12p" src/app.html`
- `Bash` Show full strength plus effort on fighter cards; compact the controls: `python3 - <<'EOF'` (+26 lines)
- `Bash` Read the catch outcome and heat chips: `sed -n "$(grep -n 'function catchOutcomeChip' src/app.html | cut -d: -f1),+40p" src/app.html`

**Claude · 2026-10-11 18:45:34 UTC**

Adding switch labels to the game of catch: gentle hold and cool flight change its outcomes, so the page must say so where it happens.


- `Bash` Find where the catch chips are called: `grep -n "heatChip(\|heatItem(\|catchOutcomeChip(" src/app.html | head`
- `Bash` Read the catch bay's chip and item assembly: `sed -n 2350,2420p src/app.html`
- `Bash` Label gentle hold and cool flight in the game of catch: `python3 - <<'EOF'` (+19 lines)
- `Bash` Check catch labels at all-out with high strength: `cd /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/dev && node bays.js '{"gentleHold":true,"coolFlight":true,"cObj"...`
- `Bash` Check research progress: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ && for d in wf_*; do python3 -c "` (+8 lines)

**Claude · 2026-10-11 18:46:42 UTC**

Three research topics still running (attenuation, elephants, growth). Preparing the review-round workflow script now so it's ready to launch as soon as the build is complete.


- `Bash` Draft the review workflow script: `mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/dev && cat > /tmp/claude-0/-home-user-rex-strength-lab/ba0...` (+43 lines)
- `TaskUpdate` #2 status=in_progress
- `TaskUpdate` #3 status=in_progress
- `TaskUpdate` #4 status=in_progress
- `TaskUpdate` #5 status=in_progress

**Claude · 2026-10-11 18:47:33 UTC**

Writing the "How the sim works" cards for the new features while the last research runs.


- `Bash` Add assumption cards for effort, walking, switches and growth: `cd /home/user/rex-strength-lab/rex-strength-lab && python3 - <<'EOF'` (+17 lines)
- `Bash` Wait a minute and check research progress: `sleep 60; cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ && for d in wf_*; do python3 -c "` (+8 lines)
  - result: &lt;tool_use_error&gt;Blocked: sleep 60 followed by: cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/ for d in wf_*; do python3 -c "
  - result: import json,sys
  - result: for line in open('$d/journal.jsonl'):
- `Bash` Put the effort readout after the verdict; add the Lift note: `python3 - <<'EOF'` (+20 lines)
- `Read` /home/user/rex-strength-lab/rex-strength-lab/shots/throw-390-dark.png
- `Bash` Count energy as an air blast only past Mach 1; re-check plans: `python3 - <<'EOF'` (+32 lines)
- `Bash` Use the feet-and-shanks impact for the jump landing's shaking: `python3 - <<'EOF'` (+22 lines)

**Claude · 2026-10-11 18:51:01 UTC**

Committing these fixes; three research topics are still running and will notify on completion.


- `Bash` Rebuild, commit and push: `python3 build-data.py >/dev/null && node build.js >/dev/null && cd .. && git add -A rex-strength-lab/src rex-strength-lab/test rex-strength-lab/dist/index.ht...` (+3 lines)


> **Commit** `1240906` · 2026-10-11 18:51:06 UTC · Rex lab: verified thresholds (feel, glass, rattle, cosmetic damage, footing; air blast 100 Pa), passenger limits, catch switch labels, assumption cards, test/presence.js with the all-out fixture from main, shots in four views (work in progress)  [rex-strength-lab]

**Claude · 2026-10-11 18:51:11 UTC**

Running the existing 5-minute setting sweep in the background to catch NaN or negative outputs from the engine changes.


- `Bash` Run the solo-move sweep over 7,776 setting combinations: `cd /home/user/rex-strength-lab/rex-strength-lab && node test/sweep.js > /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratc...`

**Claude · 2026-10-11 18:51:21 UTC**

While research finishes, preparing the history builder for this session, adapted from the previous session's script.


- `Bash` Read the step-1 history builder: `cd /home/user/rex-strength-lab/history/tools && wc -l build_history.py build_history_step1.py && sed -n 1,200p build_history_step1.py`
- `Bash` Locate this session's raw logs and workflow scripts: `ls -la /root/.claude/projects/-home-user-rex-strength-lab/ | head; ls /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575...`

**Claude · 2026-10-11 18:51:34 UTC**

Writing the compile workflow: one agent per topic applies its verifier's corrections and writes final facts in the lab's research format.


- `Bash` Write the compile workflow script: `cat > /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/dev/compile-wf.js <<'EOF'` (+21 lines)

**Claude · 2026-10-11 18:51:50 UTC**

Ripple and comic are fully verified, so compiling those two now.

