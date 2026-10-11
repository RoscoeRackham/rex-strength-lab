# The request, research and the measuring tool

2026-10-11 03:06:48 UTC to 2026-10-11 04:55:47 UTC. 27 assistant events, 7 commit events, 18 subagent events, 212 tool call events, 1 user events.

The owner asked for Step 1 of the Build Comparison and went to bed. A research workflow (six topics, each checked by a skeptic) and a design workflow (three proposals, two judges, one synthesis) were launched, and while they ran the data derivations (ANSUR II outline template, skull-top heights, turnaround traces), the measuring tool and its duo.jpg validation, the score model, the first page and the functional limits were built and committed.

Events are in the order they happened in the session; each workflow’s subagents are listed under the call that launched it, with their own start times.

## Owner · 2026-10-11 03:06:48 UTC

```text
Read CLAUDE.md, then build-comparison/BRIEF.md. Build Step 1 of the Build Comparison project it describes: research with verified facts first, then design, build, adversarial review rounds with fixes, and publish. Use workflows for the research and review rounds, modelled on history/scratchpad/workflows/.

Rex and Ollie's A-pose turnarounds are in build-comparison/assets/. Use them as the style key and for their outlines only; their mass stays as is until Step 2.

Work on a claude/ branch. Update STATUS.md as you go, push regularly, and open a pull request when it's ready for review. Don't merge it yourself. If you need an art asset, describe exactly what you need and keep going without it until I reply. Finish with a history/ entry for this session, like the existing one.

I'm going to bed, so get as far as you can.
```


- `Bash` Show repo state, status file, and brief: `git status && git branch -a && git log --oneline | head -20 && ls -la && cat STATUS.md && cat build-comparison/BRIEF.md && ls -R build-comparison | head -50`
- `Bash` List repository files and CI config: `cat README.md && cat .github/workflows/test.yml && cat .gitattributes && find . -path ./.git -prune -o -type f -print | grep -v ansur2 | sort | head -200 && ...`
- `Bash` Look at history folder and workflow scripts: `ls -la history history/* && ls history/scratchpad/workflows && wc -c history/scratchpad/workflows/* | tail -30`
- `Bash` Read history README and transcript index: `cat history/README.md && cat history/transcript.md && cat history/.gitignore && head -c 3000 history/prompts.md`
- `Bash` Read prior research and audit workflow scripts: `cat history/scratchpad/workflows/build-calc-research-wf_16409832-67f.js && cat history/scratchpad/workflows/rex-page-audit-wf_9deb3ae2-a54.js`
- `Bash` Read Build Calculator README, build script and model: `cd /home/user/rex-strength-lab/build-calculator && cat README.md && cat build.js && cat .gitignore && cat src/calc.js`
- `Bash` Read Build Calculator data notes and builds.json shape: `cd /home/user/rex-strength-lab/build-calculator && cat data/NOTES.md | head -300 && python3 -c "` (+4 lines)
- `Read` /root/.claude/projects/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/tool-results/bsxu49t0h.txt

**Claude · 2026-10-11 03:07:05 UTC**

Reading the repo first: brief, Build Calculator model and data, prior workflows. Then I'll set up the branch and start the research workflow.


- `Read` /root/.claude/projects/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/tool-results/bjlekp6tf.txt
- `Bash` List all builds with height, weight, fat and templates: `sed -n 300,400p data/NOTES.md && python3 -c "` (+7 lines)
- `Bash` Show full records for Coleman and Rex: `python3 -c "` (+7 lines)
- `Bash` Show Ollie record and list rex lab research and mass scripts: `cd /home/user/rex-strength-lab && python3 -c "` (+6 lines)
- `Bash` Read the picture-based body estimate record: `python3 -c "` (+4 lines)
- `Bash` Check tool versions and Playwright setup: `node --version; python3 --version; python3 -c "import PIL, numpy; print('PIL', PIL.__version__, 'numpy', numpy.__version__)"; python3 -c "import scipy; print...`

**Claude · 2026-10-11 03:09:05 UTC**

Still surveying: next the Build Calculator's tests and page shell, the old mass-measurement scripts, and the two turnarounds.


- `Bash` Read Build Calculator test harness: `cat build-calculator/test/shots.js && head -80 build-calculator/test/test.js && grep -n "^check\|^test\|function check\|ok(" build-calculator/test/test.js | ...`
- `Bash` Read old mass-measurement final and checker results: `cd /home/user/rex-strength-lab/history/scratchpad/mass && python3 -c "` (+8 lines)
- `Bash` Read the old reconciliation script: `wc -l checker/*.py *.py method_b/*.py method_c/*.py && cat checker/reconcile.py`
- `Bash` Read old region polygons, segmentation, and checker volume code: `cat regions.py seg.py && cat checker/check_vol.py && head -c 1500 region_px.json`
- `Bash` Extract volumes from old methods B, C and A: `python3 -c "` (+11 lines)
- `Bash` Check image sizes of the art assets: `cd /home/user/rex-strength-lab && python3 -c "` (+4 lines)
- `Read` /home/user/rex-strength-lab/build-comparison/assets/rex-turnaround.png
- `Read` /home/user/rex-strength-lab/build-comparison/assets/ollie-turnaround.png
- `Read` /home/user/rex-strength-lab/rex-strength-lab/assets/duo.jpg
- `Bash` List all fact keys in builds.json: `python3 -c "` (+5 lines)
- `ToolSearch` select:TaskCreate,TaskUpdate,TaskList
- `TaskCreate` Claim folders in STATUS.md and push branch
- `TaskCreate` Research workflow: verified facts for anchors, index, fat ranges, comics, functional limits, outlines
- `TaskCreate` Data derivations: ANSUR outline template, duo skull-top heights, turnaround tracing
- `TaskCreate` Design workflow: chart styles, layout, axis, limit definitions
- `TaskCreate` Build model, measuring tool, page, tests
- `TaskCreate` Adversarial review rounds with fixes
- `TaskCreate` Publish artifact, README, root README, PR, history entry
- `Bash` Fetch main and compare with branch: `git fetch origin main 2>&1 | tail -2; git log --oneline -1 origin/main; git log --oneline -1 HEAD; git config user.name; git config user.email`
- `Bash` Claim folders in STATUS.md, commit and push: `python3 - <<'EOF'` (+12 lines)


> **Commit** `a438307` · 2026-10-11 03:12:18 UTC · STATUS: claim Build Comparison Step 1 on claude/hopeful-keller-vly1s9  [rex-strength-lab]

**Claude · 2026-10-11 03:12:22 UTC**

Branch claimed and pushed. Now computing rough scores for all men's builds, then launching the research workflow.


- `Bash` Compute rough rescaled FFMI for all male builds: `node -e "` (+12 lines)
- `Bash` List ANSUR CSV columns: `mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research && ls build-calculator/data/ansur2/ 2>/dev/null; ...`


### Workflow `build-comparison-research` · 2026-10-11 03:13:42 UTC

- `Workflow` build-comparison-research: Research sourced facts for the Build Comparison chart (size-independent index, natural limit, body-fat ranges, comic non-muscle mass, functional limits, body outlines), then adversarially verify each topic
  - run `wf_94de1f40-a68`: 12 subagents, listed below

**Subagent `research:index`** · build-comparison-research · started 2026-10-11 03:13:42 UTC

- facts: 18 (8 derived, 7 reported, 2 measured, 1 disputed).
- Topic: a muscle index that does not depend on size. I fetched 20 sources: Europe PMC abstract records, full texts of Heymsfield 2007, Peterson 2017 and Burton 2018 from PMC, Haldane's essay, Galileo via a UVa lecture page, plus Harper's archive metadata.

<details>
<summary>Prompt, verbatim (4,169 characters)</summary>

Workflow run `wf_94de1f40-a68`, phase `Research`, agent `a77dc90a69ef4b501`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a77dc90a69ef4b501.txt](prompts/a77dc90a69ef4b501.txt).

```text
Project: "Build Comparison", a chart that ranks male body builds by "muscle level" irrespective of height, from ordinary men through the limits of human possibility to the monstrous (comic characters, and two original 3 m characters, Rex and Ollie). Read /home/user/rex-strength-lab/build-comparison/BRIEF.md first (10 minutes): it states the decisions already made and the problems to solve.
The working score is FFMI after rescaling the body to 1.80 m at the same shape: S = 1.8 * FFM / H^3 (FFM = fat-free mass in kg, H = height in m), shown beside plain FFMI = FFM / H^2. A rough first pass gives: US Army median man about 24, Ronnie Coleman about 35-39, Eddie Hall about 38, the heaviest comic characters 57-81, Rex about 141 (tail excluded, height to crest). A solid ball of muscle as tall as the figure scores about 924.
The sister project /home/user/rex-strength-lab/build-calculator/ already holds 55 builds and 139 verified facts in data/builds.json (read its "facts" keys and labels before you start; do NOT re-research a fact that already exists there unless the brief needs a number it lacks, and say so when you rely on an existing key). ANSUR II CSVs are in /home/user/rex-strength-lab/build-calculator/data/ansur2/ (ANSUR_II_MALE_Public.csv, 4,082 men; values in mm and kg x10? check: weightkg is in tenths of kg, lengths in mm).
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent; a number is "sourced" only if you fetched the page or PDF and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher PDFs). Prefer primary or authoritative sources (journals, textbooks, government surveys, standards bodies, publisher handbooks); use fan sites or magazines only when nothing better exists, and label them so. Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". Write raw downloads and scripts under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
For each fact give: key (snake_case), label, status (measured | official | reported | derived | estimate | disputed), values (a JSON object as a string, SI units plus the original units), sources (title + URL actually fetched), and notes (what exactly the source says, its sample, caveats, how good the evidence is).

TOPIC: a size-independent muscle index. (1) Confirm the definition of FFMI (VanItallie et al. 1990, Am J Clin Nutr) and Kouri et al. 1995's normalisation to 1.80 m (exact formula and constant as printed). (2) Sources for geometric similarity: at the same shape, mass scales with length cubed (isometric scaling; e.g. Schmidt-Nielsen 1984 "Scaling: why is animal size so important?", McMahon 1973 Science, Haldane "On being the right size", Galileo square-cube law); find a fetched, citable statement. (3) Indices that divide by height cubed: Rohrer's index / ponderal index (Rohrer 1921) and any publ … [1,070 more characters on this line; the full prompt is in prompts/a77dc90a69ef4b501.txt]
```

</details>

**Subagent `research:natural`** · build-comparison-research · started 2026-10-11 03:13:43 UTC

- facts: 19 (8 measured, 6 reported, 3 estimate, 2 derived).
- Natural-limit anchors for the Build Comparison chart. The main finding is that the Kouri et al.

<details>
<summary>Prompt, verbatim (4,354 characters)</summary>

Workflow run `wf_94de1f40-a68`, phase `Research`, agent `a1d6edb3ef9a3e139`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a1d6edb3ef9a3e139.txt](prompts/a1d6edb3ef9a3e139.txt).

```text
Project: "Build Comparison", a chart that ranks male body builds by "muscle level" irrespective of height, from ordinary men through the limits of human possibility to the monstrous (comic characters, and two original 3 m characters, Rex and Ollie). Read /home/user/rex-strength-lab/build-comparison/BRIEF.md first (10 minutes): it states the decisions already made and the problems to solve.
The working score is FFMI after rescaling the body to 1.80 m at the same shape: S = 1.8 * FFM / H^3 (FFM = fat-free mass in kg, H = height in m), shown beside plain FFMI = FFM / H^2. A rough first pass gives: US Army median man about 24, Ronnie Coleman about 35-39, Eddie Hall about 38, the heaviest comic characters 57-81, Rex about 141 (tail excluded, height to crest). A solid ball of muscle as tall as the figure scores about 924.
The sister project /home/user/rex-strength-lab/build-calculator/ already holds 55 builds and 139 verified facts in data/builds.json (read its "facts" keys and labels before you start; do NOT re-research a fact that already exists there unless the brief needs a number it lacks, and say so when you rely on an existing key). ANSUR II CSVs are in /home/user/rex-strength-lab/build-calculator/data/ansur2/ (ANSUR_II_MALE_Public.csv, 4,082 men; values in mm and kg x10? check: weightkg is in tenths of kg, lengths in mm).
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent; a number is "sourced" only if you fetched the page or PDF and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher PDFs). Prefer primary or authoritative sources (journals, textbooks, government surveys, standards bodies, publisher handbooks); use fan sites or magazines only when nothing better exists, and label them so. Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". Write raw downloads and scripts under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
For each fact give: key (snake_case), label, status (measured | official | reported | derived | estimate | disputed), values (a JSON object as a string, SI units plus the original units), sources (title + URL actually fetched), and notes (what exactly the source says, its sample, caveats, how good the evidence is).

TOPIC: anchors for the natural (drug-free) limit. (1) Kouri et al. 1995 (Clin J Sport Med 5:223-228): what the abstract and full text say about FFMI 25 (sample of 74 non-users, how non-use was established, the highest value, the users' values, the pre-1959 Mr America winners' mean); the builds.json facts kouri1995_* exist: check them, add only what is missing. (2) Frame-based predictions of maximum muscular bodyweight: Casey Butt (weightrainer.net, "Your Muscular Potential" and the online calculator: the formula from height, wrist and ankle girths, what data it was fitted to, whether it was ev … [1,255 more characters on this line; the full prompt is in prompts/a1d6edb3ef9a3e139.txt]
```

</details>

**Subagent `research:fat`** · build-comparison-research · started 2026-10-11 03:23:46 UTC

- facts: 33 (19 measured, 9 estimate, 2 official, 2 reported, 1 derived).
- Body-fat ranges for each chart group and measured FFMI in steroid users, researched from primary sources (Europe PMC / NCBI full texts, CDC/NCHS PDF, an official Army fact sheet). Main findings: (1) Everyday men.

<details>
<summary>Prompt, verbatim (4,167 characters)</summary>

Workflow run `wf_94de1f40-a68`, phase `Research`, agent `a7fd325eb8bae7fb3`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a7fd325eb8bae7fb3.txt](prompts/a7fd325eb8bae7fb3.txt).

```text
Project: "Build Comparison", a chart that ranks male body builds by "muscle level" irrespective of height, from ordinary men through the limits of human possibility to the monstrous (comic characters, and two original 3 m characters, Rex and Ollie). Read /home/user/rex-strength-lab/build-comparison/BRIEF.md first (10 minutes): it states the decisions already made and the problems to solve.
The working score is FFMI after rescaling the body to 1.80 m at the same shape: S = 1.8 * FFM / H^3 (FFM = fat-free mass in kg, H = height in m), shown beside plain FFMI = FFM / H^2. A rough first pass gives: US Army median man about 24, Ronnie Coleman about 35-39, Eddie Hall about 38, the heaviest comic characters 57-81, Rex about 141 (tail excluded, height to crest). A solid ball of muscle as tall as the figure scores about 924.
The sister project /home/user/rex-strength-lab/build-calculator/ already holds 55 builds and 139 verified facts in data/builds.json (read its "facts" keys and labels before you start; do NOT re-research a fact that already exists there unless the brief needs a number it lacks, and say so when you rely on an existing key). ANSUR II CSVs are in /home/user/rex-strength-lab/build-calculator/data/ansur2/ (ANSUR_II_MALE_Public.csv, 4,082 men; values in mm and kg x10? check: weightkg is in tenths of kg, lengths in mm).
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent; a number is "sourced" only if you fetched the page or PDF and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher PDFs). Prefer primary or authoritative sources (journals, textbooks, government surveys, standards bodies, publisher handbooks); use fan sites or magazines only when nothing better exists, and label them so. Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". Write raw downloads and scripts under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
For each fact give: key (snake_case), label, status (measured | official | reported | derived | estimate | disputed), values (a JSON object as a string, SI units plus the original units), sources (title + URL actually fetched), and notes (what exactly the source says, its sample, caveats, how good the evidence is).

TOPIC: body-fat ranges for each group on the chart, and FFMI measured in enhanced athletes. Only 7 of 55 builds have a body-fat value; the chart will show each score as a range across plausible body fat, so each group needs a sourced plausible range. Find, with the measurement method (DXA, hydrostatic, 4C, skinfold): (1) US adult men (NHANES DXA body-fat percentiles by age, e.g. Kelly, Wilson & Heymsfield 2009 PLoS ONE; CDC data briefs) and US soldiers (Army body-fat studies, e.g. Friedl et al.; ANSUR II has no body fat: say what can be said). (2) Natural bodybuilders on contest day (Rossow 20 … [1,068 more characters on this line; the full prompt is in prompts/a7fd325eb8bae7fb3.txt]
```

</details>

**Subagent `research:comics`** · build-comparison-research · started 2026-10-11 03:36:57 UTC

- facts: 16 (12 official, 2 reported, 1 derived, 1 estimate).
- Official Marvel sources describe the body makeup of several characters, and the chart can use some of it. Nothing gives a body-fat percentage or a tissue density in kg/m3.

<details>
<summary>Prompt, verbatim (3,893 characters)</summary>

Workflow run `wf_94de1f40-a68`, phase `Research`, agent `a6ac31adccacd50fa`.

```text
Project: "Build Comparison", a chart that ranks male body builds by "muscle level" irrespective of height, from ordinary men through the limits of human possibility to the monstrous (comic characters, and two original 3 m characters, Rex and Ollie). Read /home/user/rex-strength-lab/build-comparison/BRIEF.md first (10 minutes): it states the decisions already made and the problems to solve.
The working score is FFMI after rescaling the body to 1.80 m at the same shape: S = 1.8 * FFM / H^3 (FFM = fat-free mass in kg, H = height in m), shown beside plain FFMI = FFM / H^2. A rough first pass gives: US Army median man about 24, Ronnie Coleman about 35-39, Eddie Hall about 38, the heaviest comic characters 57-81, Rex about 141 (tail excluded, height to crest). A solid ball of muscle as tall as the figure scores about 924.
The sister project /home/user/rex-strength-lab/build-calculator/ already holds 55 builds and 139 verified facts in data/builds.json (read its "facts" keys and labels before you start; do NOT re-research a fact that already exists there unless the brief needs a number it lacks, and say so when you rely on an existing key). ANSUR II CSVs are in /home/user/rex-strength-lab/build-calculator/data/ansur2/ (ANSUR_II_MALE_Public.csv, 4,082 men; values in mm and kg x10? check: weightkg is in tenths of kg, lengths in mm).
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent; a number is "sourced" only if you fetched the page or PDF and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher PDFs). Prefer primary or authoritative sources (journals, textbooks, government surveys, standards bodies, publisher handbooks); use fan sites or magazines only when nothing better exists, and label them so. Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". Write raw downloads and scripts under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
For each fact give: key (snake_case), label, status (measured | official | reported | derived | estimate | disputed), values (a JSON object as a string, SI units plus the original units), sources (title + URL actually fetched), and notes (what exactly the source says, its sample, caveats, how good the evidence is).

TOPIC: comic characters' mass that is not muscle, and anything official about their body composition. builds.json already has their official heights and weights (facts superman ... abomination). For each of: Thor (and Asgardians in general), the Thing, Colossus (armoured), Wolverine (adamantium; with and without), Hulk (savage, grey, merged), Juggernaut, Darkseid, Doomsday, Abomination, Luke Cage, Kingpin, Bane, Superman, Black Panther, Captain America, Batman, find official publisher statements (Official Handbook of the Marvel Universe editions, Marvel.com, DC Who's Who, DK licensed guides) about: tissue density (e.g. the often-quoted claim that Asgardian flesh and bone are about three times as dense as human tissue: find the exact handbook wording and edition, or say it cannot be verified), skin or body made of rock or metal, implants (adamantium mass: is there an official figure such as about 100 lb?), and anything said about body fat or physique. Mark fan-wiki-only claims as reported, not official. Then, for each character, recommend how the chart should treat its score: comparable (mass is mostly ordinary tissue), overstated (part of the mass is not muscle or tissue is denser; say by how much if a figure exists), or not comparable (e.g. a body of rock or steel). Also check whether any Marvel or DC source gives a body-fat percentage for any character (expected: none).
```

</details>

**Subagent `research:function`** · build-comparison-research · started 2026-10-11 03:38:51 UTC

- facts: 25 (13 measured, 5 estimate, 4 official, 3 reported).
- I found sources for all three functional limits, but no source gives the limits themselves. Each threshold below is my own estimate, built from sourced pieces.

<details>
<summary>Prompt, verbatim (4,488 characters)</summary>

Workflow run `wf_94de1f40-a68`, phase `Research`, agent `ad163df63d5a995ca`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/ad163df63d5a995ca.txt](prompts/ad163df63d5a995ca.txt).

```text
Project: "Build Comparison", a chart that ranks male body builds by "muscle level" irrespective of height, from ordinary men through the limits of human possibility to the monstrous (comic characters, and two original 3 m characters, Rex and Ollie). Read /home/user/rex-strength-lab/build-comparison/BRIEF.md first (10 minutes): it states the decisions already made and the problems to solve.
The working score is FFMI after rescaling the body to 1.80 m at the same shape: S = 1.8 * FFM / H^3 (FFM = fat-free mass in kg, H = height in m), shown beside plain FFMI = FFM / H^2. A rough first pass gives: US Army median man about 24, Ronnie Coleman about 35-39, Eddie Hall about 38, the heaviest comic characters 57-81, Rex about 141 (tail excluded, height to crest). A solid ball of muscle as tall as the figure scores about 924.
The sister project /home/user/rex-strength-lab/build-calculator/ already holds 55 builds and 139 verified facts in data/builds.json (read its "facts" keys and labels before you start; do NOT re-research a fact that already exists there unless the brief needs a number it lacks, and say so when you rely on an existing key). ANSUR II CSVs are in /home/user/rex-strength-lab/build-calculator/data/ansur2/ (ANSUR_II_MALE_Public.csv, 4,082 men; values in mm and kg x10? check: weightkg is in tenths of kg, lengths in mm).
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent; a number is "sourced" only if you fetched the page or PDF and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher PDFs). Prefer primary or authoritative sources (journals, textbooks, government surveys, standards bodies, publisher handbooks); use fan sites or magazines only when nothing better exists, and label them so. Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". Write raw downloads and scripts under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
For each fact give: key (snake_case), label, status (measured | official | reported | derived | estimate | disputed), values (a JSON object as a string, SI units plus the original units), sources (title + URL actually fetched), and notes (what exactly the source says, its sample, caveats, how good the evidence is).

TOPIC: where extreme muscle stops a body working. The chart will mark, by 2D geometry on drawn front-view silhouettes whose widths are scaled up at fixed height, three functional limits: (a) the arms can no longer hang down by the sides, (b) the thighs touch all the way to the knee, (c) the hands can no longer reach the face. Find sources that make these definitions defensible: (1) soft-tissue approximation as the end-feel limiting elbow flexion and knee flexion (Norkin & White "Measurement of Joint Motion", Kapandji, Magee "Orthopedic Physical Assessment", AAOS norms); normal active elbow fle … [1,389 more characters on this line; the full prompt is in prompts/ad163df63d5a995ca.txt]
```

</details>

**Subagent `research:outline`** · build-comparison-research · started 2026-10-11 04:06:49 UTC

- facts: 21 (9 derived, 5 measured, 3 official, 3 reported, 1 estimate).
- I covered all five parts of the outline topic. (1) Measurement definitions.

<details>
<summary>Prompt, verbatim (4,864 characters)</summary>

Workflow run `wf_94de1f40-a68`, phase `Research`, agent `abad1a06a99e3c482`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/abad1a06a99e3c482.txt](prompts/abad1a06a99e3c482.txt).

```text
Project: "Build Comparison", a chart that ranks male body builds by "muscle level" irrespective of height, from ordinary men through the limits of human possibility to the monstrous (comic characters, and two original 3 m characters, Rex and Ollie). Read /home/user/rex-strength-lab/build-comparison/BRIEF.md first (10 minutes): it states the decisions already made and the problems to solve.
The working score is FFMI after rescaling the body to 1.80 m at the same shape: S = 1.8 * FFM / H^3 (FFM = fat-free mass in kg, H = height in m), shown beside plain FFMI = FFM / H^2. A rough first pass gives: US Army median man about 24, Ronnie Coleman about 35-39, Eddie Hall about 38, the heaviest comic characters 57-81, Rex about 141 (tail excluded, height to crest). A solid ball of muscle as tall as the figure scores about 924.
The sister project /home/user/rex-strength-lab/build-calculator/ already holds 55 builds and 139 verified facts in data/builds.json (read its "facts" keys and labels before you start; do NOT re-research a fact that already exists there unless the brief needs a number it lacks, and say so when you rely on an existing key). ANSUR II CSVs are in /home/user/rex-strength-lab/build-calculator/data/ansur2/ (ANSUR_II_MALE_Public.csv, 4,082 men; values in mm and kg x10? check: weightkg is in tenths of kg, lengths in mm).
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent; a number is "sourced" only if you fetched the page or PDF and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher PDFs). Prefer primary or authoritative sources (journals, textbooks, government surveys, standards bodies, publisher handbooks); use fan sites or magazines only when nothing better exists, and label them so. Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". Write raw downloads and scripts under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
For each fact give: key (snake_case), label, status (measured | official | reported | derived | estimate | disputed), values (a JSON object as a string, SI units plus the original units), sources (title + URL actually fetched), and notes (what exactly the source says, its sample, caveats, how good the evidence is).

TOPIC: drawing a human body outline (front and side view) from anthropometric data, at any height and build. The plan: landmark heights as fractions of stature from ANSUR II (stature, cervicale, suprasternale, acromial, axilla, chest, waist at omphalion, buttock, trochanterion, crotch, knee mid-patella, lateral malleolus, wrist height), front widths from breadths (biacromial, bideltoid, chest, waist, hip, head, hand, foot) and side depths (chest, waist, buttock, head length, foot length), and limb widths from girths. Find and verify: (1) the ANSUR II measurement definitions for those variables … [1,765 more characters on this line; the full prompt is in prompts/abad1a06a99e3c482.txt]
```

</details>

**Subagent `verify:index`** · build-comparison-research · started 2026-10-11 04:23:47 UTC

- checks: 18 (10 ok, 8 not ok).
- Not OK: geometric_similarity_mass_cubed; ffm_over_height_cubed_literature; tall_men_not_scaled_copies (+5 more).
- The core holds. I re-fetched 23 sources: - 19 Europe PMC records, including 4 new ones.

<details>
<summary>Prompt, verbatim (49,966 characters)</summary>

Workflow run `wf_94de1f40-a68`, phase `Verify`, agent `a9a85a0f815e9d613`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a9a85a0f815e9d613.txt](prompts/a9a85a0f815e9d613.txt).

```text
Project: "Build Comparison", a chart that ranks male body builds by "muscle level" irrespective of height, from ordinary men through the limits of human possibility to the monstrous (comic characters, and two original 3 m characters, Rex and Ollie). Read /home/user/rex-strength-lab/build-comparison/BRIEF.md first (10 minutes): it states the decisions already made and the problems to solve.
The working score is FFMI after rescaling the body to 1.80 m at the same shape: S = 1.8 * FFM / H^3 (FFM = fat-free mass in kg, H = height in m), shown beside plain FFMI = FFM / H^2. A rough first pass gives: US Army median man about 24, Ronnie Coleman about 35-39, Eddie Hall about 38, the heaviest comic characters 57-81, Rex about 141 (tail excluded, height to crest). A solid ball of muscle as tall as the figure scores about 924.
The sister project /home/user/rex-strength-lab/build-calculator/ already holds 55 builds and 139 verified facts in data/builds.json (read its "facts" keys and labels before you start; do NOT re-research a fact that already exists there unless the brief needs a number it lacks, and say so when you rely on an existing key). ANSUR II CSVs are in /home/user/rex-strength-lab/build-calculator/data/ansur2/ (ANSUR_II_MALE_Public.csv, 4,082 men; values in mm and kg x10? check: weightkg is in tenths of kg, lengths in mm).
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent; a number is "sourced" only if you fetched the page or PDF and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher PDFs). Prefer primary or authoritative sources (journals, textbooks, government surveys, standards bodies, publisher handbooks); use fan sites or magazines only when nothing better exists, and label them so. Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". Write raw downloads and scripts under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
For each fact give: key (snake_case), label, status (measured | official | reported | derived | estimate | disputed), values (a JSON object as a string, SI units plus the original units), sources (title + URL actually fetched), and notes (what exactly the source says, its sample, caveats, how good the evidence is).

You are a skeptical fact-checker for the topic "index". Below are the researcher's facts and recommendations. Re-fetch the cited URLs for every fact the chart is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, quotation and status against what the source actually says; recompute every derived number you can (re-run computations on the ANSUR II CSV where relevant). Mark ok=false with a correction for anything wrong, mislabelled (for example a fan wiki or a magazine marked official or measured; a sample maximum called a limit; a secondary summary presented as the primary paper), or unsupported. Also judge the recommendations: anything that overstates the evidence? List important missing items.

RESEARCH:
{
 "summary": "Topic: a muscle index that does not depend on size. I fetched 20 sources: Europe PMC abstract records, full texts of Heymsfield 2007, Peterson 2017 and Burton 2018 from PMC, Haldane's essay, Galileo via a UVa lecture page, plus Harper's archive metadata. I also ran derived checks on the ANSUR II men's CSV.\n\nWhat the sources say:\n- **FFMI.** VanItallie 1990 defines FFMI as FFM (kg) / height (m)^2.\n- **Kouri.** The Kouri 1995 abstract, re-fetched today, prints \"6.3 x (1.80 m - height) to normalize these values to the height of a 1.8-m man\". The 6.3 vs 6.1 question is already r … [2,397 more characters on this line; the full prompt is in prompts/a9a85a0f815e9d613.txt]
 "facts": [
  {
   "key": "ffmi_definition_vanitallie1990",
   "label": "FFMI definition: fat-free mass over height squared (VanItallie et al. 1990)",
   "status": "reported",
   "values": "{\"formula\": \"FFMI = FFM_kg / H_m^2\", \"units\": \"kg/m^2\", \"companion_index\": \"BFMI = body fat mass_kg / H_m^2\", \"reference_sample_men_n\": 124, \"minnesota_semistarvation_men_n\": 32, \"pem_detected_after_12wk\": \"27 of 32\"}",
   "sources": [
    {
     "title": "VanItallie TB, Yang MU, Heymsfield SB, Funk RC, Boileau RA. Height-normalized indices of the body's fat-free mass and fat mass: potentially useful indicators of nutritional status. Am J Clin Nutr 1990;52:953-959. doi:10.1093/ajcn/52.6.953 (Europe PMC abstract record, PMID 2239792)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:2239792%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract, verbatim: 'we propose use of height-normalized indices, namely, a FFM index [FFM (kg)/height (m)2, or FFMI] and a BFM index [BFM (kg)/height (m)2, or BFMI]. We calculated these indices in a reference population of 124 healthy young men and in 32 nonobese young men (from the Minnesota Study)'. The stated purpose is clinical: telling malnourished tall patients from well-nourished short ones. The abstract gives no reason for choosing height^2 over another power. The full text (OUP/Elsevier) was not reachable; only the abstract was read. Heymsfield 2007 later wrote that its results 'provide support for the suggestion of Van Itallie et al to normalize fat and FFM for height 2' (see heymsfield2007_ffm_height_power_fulltext). Existing builds.json key ffmi_definition_kouri_limit already has FFMI = FFM/H^2 from Kouri; this adds the original source."
  },
  {
   "key": "kouri1995_normalisation_reference",
   "label": "Kouri 1995 normalises FFMI to the height of a 1.80 m man (formula as printed in the abstract)",
   "status": "reported",
   "values": "{\"ffmi_formula\": \"FFM_kg x H_m^-2\", \"normalised_formula\": \"FFMI + 6.3 x (1.80 - H_m)\", \"c_printed_in_abstract\": 6.3, \"c_common_use\": 6.1, \"reference_height_m\": 1.8, \"n_athletes\": 157, \"n_users\": 83, \"n_nonusers\": 74}",
   "sources": [
    {
     "title": "Kouri EM, Pope HG, Katz DL, Oliva P. Fat-free mass index in users and nonusers of anabolic-androgenic steroids. Clin J Sport Med 1995;5:223-228 (Europe PMC abstract record, PMID 7496846), re-fetched 2026-10-11",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:7496846%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract, verbatim: 'FFMI is defined by the formula (fat-free body mass in kg) x (height in meters)-2. We then added a slight correction of 6.3 x (1.80 m - height) to normalize these values to the height of a 1.8-m man.' This relies on and agrees with existing keys kouri1995_normalization_constant and ffmi_height_correction (status disputed: the abstract prints 6.3, while Trexler 2017 and most calculators use 6.1; at most 0.05 FFMI units apart between 1.55 and 2.05 m). The full text is not open access (Europe PMC: no PDF, not OA), so the athletes' height range and how the slope was fitted are unknown. The 1.80 m reference height is the reason the rescaled index uses the constant 1.8: at 1.80 m it then equals both plain and Kouri-normalised FFMI."
  },
  {
   "key": "geometric_similarity_mass_cubed",
   "label": "At the same shape and density, mass (and muscle mass) scales with height cubed and areas with height squared",
   "status": "reported",
   "values": "{\"mass_exponent_same_shape\": 3, \"area_exponent_same_shape\": 2, \"haldane_example\": {\"height_factor\": 10, \"width_factor\": 10, \"thickness_factor\": 10, \"weight_factor\": 1000, \"bone_cross_section_factor\": 100, \"giant_height_ft\": 60, \"giant_height_m\": 18.3, \"giant_weight_tons\": [80, 90]}, \"fowler_examples\": {\"double_all_dimensions_weight_factor\": 8, \"rope_strength_factor\": 4, \"flea_100x_muscle_factor\": 1000000}}",
   "sources": [
    {
     "title": "Burton RF. Human allometry: adult bodies are more nearly geometrically similar than regression analysis has suggested. Med Hypotheses 2010;74:15-17 (Europe PMC abstract, PMID 19726135)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:19726135%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Burton R. The Sitting-Height Index of Build, (Body Mass)/(Sitting Height)^3, as an Improvement on the Body Mass Index for Children, Adolescents and Young Adults. Children (Basel) 2018;5(2):30 (PMC full text, CC BY)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5835999/"
    },
    {
     "title": "Haldane JBS. On Being the Right Size (transcription from 'On Being the Right Size and Other Essays', OUP 1985; marxists.org)",
     "url": "https://www.marxists.org/archive/haldane/works/1920s/right-size.htm"
    },
    {
     "title": "Harper's Magazine archive page: 'On being the right size', J.B.S. Haldane, March 1926 (publication date only; text not on the fetched page)",
     "url": "https://harpers.org/archive/1926/03/on-being-the-right-size/"
    },
    {
     "title": "Fowler M. Scaling: Why Giants Don't Exist. University of Virginia lecture notes (teaching source)",
     "url": "https://galileoandeinstein.phys.virginia.edu/lectures/scaling.html"
    }
   ],
   "notes": "Quotes:\n- Burton 2010 abstract: 'As he [Quetelet] realised, perfect isometry or geometric similarity requires that body mass varies with height cubed'.\n- Burton 2018 full text: 'consider first a hypothetical set of individuals of different sizes but identical density and bodily proportions. Their masses must vary in proportion to both (sitting height)3 and height3 ... The BMIs of these isometric individuals would inevitably increase with height.'\n- Haldane: 'These monsters were not only ten times as high as Christian, but ten times as wide and ten times as thick, so that their  … [934 more characters on this line; the full prompt is in prompts/a9a85a0f815e9d613.txt]
  },
  {
   "key": "size_change_changes_form",
   "label": "Real bodies are not scaled copies across large size changes (Galileo, Haldane, McMahon, Biewener)",
   "status": "reported",
   "values": "{\"mcmahon1973_elastic_similarity\": \"length proportional to diameter^(2/3)\", \"biewener2005_skeletal_scaling_mammals_birds\": \"l proportional to d^0.89 (isometry d^1.0; elastic similarity d^0.67; stress similarity d^0.5)\", \"biewener2005_size_range_constant_stress_kg\": [0.04, 300], \"galileo_giant_height_factor\": 10}",
   "sources": [
    {
     "title": "Galileo, Two New Sciences, First Day (Crew & de Salvio translation), reproduced by M. Fowler, University of Virginia",
     "url": "https://galileoandeinstein.phys.virginia.edu/tns1.htm"
    },
    {
     "title": "Haldane JBS. On Being the Right Size (marxists.org transcription)",
     "url": "https://www.marxists.org/archive/haldane/works/1920s/right-size.htm"
    },
    {
     "title": "McMahon T. Size and shape in biology. Science 1973;179:1201-1204 (Europe PMC abstract, PMID 4689015)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:4689015%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Biewener AA. Biomechanical consequences of scaling. J Exp Biol 2005;208:1665-1676 (Europe PMC abstract, PMID 15855398)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:15855398%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Quotes:\n- Galileo (Salviati): 'nature cannot produce a horse as large as twenty ordinary horses or a giant ten times taller than an ordinary man unless by miracle or by greatly altering the proportions of his limbs and especially of his bones'.\n- Haldane: 'For every type of animal there is a most convenient size, and a large change in size inevitably carries with it a change of form.'\n- McMahon abstract: elastic-stability arguments 'require that living organisms adopt forms whereby lengths increase as the (2/3) power of diameter'. It adds that Hill 'was forced to use an oversim … [901 more characters on this line; the full prompt is in prompts/a9a85a0f815e9d613.txt]
  },
  {
   "key": "rohrer_tri_ponderal_index",
   "label": "Rohrer / ponderal / tri-ponderal mass index: body mass over height cubed (kg/m^3)",
   "status": "reported",
   "values": "{\"formula\": \"W_kg / H_m^3\", \"units\": \"kg/m^3\", \"rohrer_year_reported\": 1921, \"peterson2017_n\": 2285, \"peterson2017_ages_y\": [8, 29], \"peterson2017_R2_pctfat_boys_TMI_vs_BMI\": [0.64, 0.38], \"peterson2017_R2_pctfat_girls_TMI_vs_BMI\": [0.72, 0.66], \"peterson2017_misclassification_TMI_pct\": 8.4, \"peterson2017_misclassification_BMIz_pct\": 19.4}",
   "sources": [
    {
     "title": "Peterson CM et al. Tri-Ponderal Mass Index vs Body Mass Index in Estimating Body Fat During Adolescence. JAMA Pediatr 2017;171:629-636 (PMC full text)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5710345/"
    },
    {
     "title": "Peterson 2017 (Europe PMC abstract, PMID 28505241)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:28505241%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Burton R. Children (Basel) 2018;5(2):30 (PMC full text; defines the Rohrer index)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5835999/"
    },
    {
     "title": "Burton RF. Why is the body mass index calculated as mass/height2, not as mass/height3? Ann Hum Biol 2007;34:656-663 (Europe PMC abstract, PMID 18092209)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:18092209%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Wikipedia: Corpulence index (wikitext; tertiary source, used only for the Rohrer 1921 citation)",
     "url": "https://en.wikipedia.org/w/index.php?title=Corpulence_index&action=raw"
    }
   ],
   "notes": "Quotes:\n- Peterson 2017 full text: 'the tri-ponderal mass index (TMI = mass divided by height cubed [kilograms divided by meters cubed]), which is based on the ponderal index and the Rohrer Index (see eAppendix 1 in the Supplement for a historical overview)'.\n- Peterson abstract: 'percent body fat scales to height with an exponent closer to 3'.\n- Burton 2018: 'the Rohrer index, (body mass)/height 3'.\n- Burton 2007 abstract: 'Mass/height(3) is an index of body build that is independent of scale and statistics.'\nThe Rohrer 1921 citation (Rohrer F. Der Index der Körperfülle als Maß des Ernährungszustandes. Münch Med Wochenschr 1921;68:580-582) comes only from Wikipedia. The primary was not fetched, and the Peterson supplement with the history was blocked by a PMC download challenge. Treat the year as reported, not verified. The name 'ponderal index' is also used for H / W^(1/3) (Wikipedia notes this), so the page should give the formula, not just the name.\nThese indices use total mass and were validated for fatness in children and adolescents, not for muscularity in adults. They are precedent for dividing by height cubed, not validation of a fat-free version."
  },
  {
   "key": "ffm_over_height_cubed_literature",
   "label": "Published fat-free mass over height cubed index: none found; in children FFM is best adjusted by height squared",
   "status": "reported",
   "values": "{\"published_ffm_over_h3_index_found\": false, \"wells_cole2002_n\": 69, \"wells_cole2002_age_y\": 8, \"wells_cole2002_optimal_FFM_power\": 2, \"wells_cole2002_optimal_FM_power\": 6, \"ramirez_velez2018_fat_mass_over_h3_used\": true, \"ramirez_velez2018_n\": 4673}",
   "sources": [
    {
     "title": "Wells JC, Cole TJ, ALSPAC study team. Adjustment of fat-free mass and fat mass for height in children aged 8 y. Int J Obes 2002;26:947-952 (Europe PMC abstract, PMID 12080448)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:12080448%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Ramírez-Vélez R et al. Tri-Ponderal Mass Index vs. Fat Mass/Height^3 as a Screening Tool for Metabolic Syndrome Prediction in Colombian Children and Young People. Nutrients 2018;10:412 (Europe PMC abstract, PMID 29584641)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:29584641%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Wells & Cole 2002 abstract: 'FFM was optimally adjusted for height by calculating FFM/HT(2). FM was optimally adjusted by calculating FM/HT(6).' The method used deuterium dilution, and the power p was chosen to remove the index's correlation with height. Ramírez-Vélez 2018 used 'fat mass (kg)/height (m³)', which is fat, not fat-free mass, and is a metabolic-syndrome screen.\nSearch done: Europe PMC abstract searches for 'fat-free mass' with 'height3' or 'height cubed', 'lean mass' with 'height cubed', 'FFM/height3' and 'lean mass index' with 'height3' returned 0 hits. 'fat-free mass' with 'height(3)' returned 6 hits, none defining an FFM/H^3 index.\nConclusion: 1.8 x FFM/H^3 is a derived construct of this project (the fat-free analogue of the Rohrer index, scaled to Kouri's 1.80 m). It must not be presented as a published index. The task brief's guess that Wells & Cole support a height-cubed FFM index is wrong: they found height squared for FFM."
  },
  {
   "key": "heymsfield2007_ffm_height_power_fulltext",
   "label": "Adult FFM and skeletal muscle scale with height to a power of about 2, not 3 (Heymsfield 2007, full-text numbers)",
   "status": "measured",
   "values": "{\"FFM_power_men_NY2\": 1.86, \"FFM_power_men_NY2_see\": 0.1, \"n_men_NY2\": 581, \"FFM_power_women_NY2\": 2.05, \"FFM_power_women_NY2_see\": 0.09, \"n_women_NY2\": 765, \"SM_power_men_NY1\": 1.98, \"SM_power_men_NY1_see\": 0.27, \"n_men_NY1\": 178, \"ATFM_power_men_NY1\": 2.09, \"ATFM_power_men_NY1_see\": 0.19, \"weight_power_men_NY1_NY2\": [1.78, 1.86], \"bone_mineral_power_men_NY2\": 2.31, \"BMI_inclusion_kg_m2\": [18.5, 35], \"mean_age_men_NY2_y\": 44.8}",
   "sources": [
    {
     "title": "Heymsfield SB, Gallagher D, Mayer L, Beetsch J, Pietrobelli A. Scaling of human body composition to stature: new insights into body mass index. Am J Clin Nutr 2007;86:82-91 (PMC author manuscript, full text)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2729090/"
    },
    {
     "title": "Same paper, Europe PMC abstract (PMID 17616766)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:17616766%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Full text, verbatim:\n- 'The similar compartment, FFM, scaled to height with respective powers of 1.86 ± 0.10 and 2.05 ± 0.09 in the NY-2 men and women. ... none of the β values differed significantly from 2.0.'\n- 'Skeletal muscle mass scaled to height with powers of 1.98 ± 0.27 and 2.08 ± 0.20 in the NY-1 men and women'.\n- Conclusions: 'weight, skeletal muscle, adipose tissue, ATFM, and FFM all scale to height with powers of 2 as the nearest whole integer. These observations indicate that corresponding height-normalized indexes are also independent of height'.\nTable 1: NY-1 has 178 men and 233 women (MRI plus DXA); NY-2 has 581 men and 765 women (DXA only).\nThis extends existing key heymsfield_2007_scaling, which has the abstract only, with the men's numbers. Caveats: general-population adults with BMI 18.5-35 and mean age about 45-50, not athletes; log-log least-squares regression (see height_exponent_regression_vs_isometry for why that may understate a structural exponent).\nThis is why plain FFMI is roughly height-independent among ordinary adults. FFM/H^1.86 vs FFM/H^2 differ by only (H/1.8)^0.14, under 2% across 1.65-1.95 m."
  },
  {
   "key": "tall_men_not_scaled_copies",
   "label": "Taller adults are relatively slimmer: girths and leg cross-sections grow less than in proportion to height",
   "status": "measured",
   "values": "{\"burton2012_n_men\": 155, \"burton2012_n_women\": 162, \"burton2012_leg_CSA_vs_leg_length\": \"negative, P = 0.00006-0.027 (after allowing for upper-body mass)\", \"heymsfield2011_waist_power_men\": 0.76, \"heymsfield2011_hip_power_men\": 0.45, \"same_shape_girth_power\": 1}",
   "sources": [
    {
     "title": "Burton RF, Nevill AM, Stewart AD, Daniell N, Olds T. A negative relationship between leg length and leg cross-sectional areas in adults. Am J Hum Biol 2012;24:562-564 (Europe PMC abstract, PMID 22411043)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:22411043%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Heymsfield SB, Heo M, Pietrobelli A. Are adult body circumferences associated with height? Am J Clin Nutr 2011;93:302-7 (existing builds.json key heymsfield_2011_circumferences)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:21123461%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Burton 2012 abstract: 'volumes and leg CSAs were obtained by 3D scanning for 155 men and 162 women. ... With allowance made for positive correlations with upper body mass, leg CSAs showed a negative correlation with leg length (P = 0.00006-0.027).' The waist and hip powers come from existing key heymsfield_2011_circumferences (NHANES III; adjusted for age and race, not for weight). That key was not re-fetched; I rely on it. A scaled copy would have girth power 1. Consequence: real tall men are not scaled-up short men, so any height-cubed index will rate ordinary tall men as less bulky than ordinary short men (quantified in ansur_height_cubed_index_vs_height)."
  },
  {
   "key": "height_exponent_regression_vs_isometry",
   "label": "Is the human mass-height exponent really about 2, or nearer 3? (regression vs Burton's isometry hypothesis)",
   "status": "disputed",
   "values": "{\"regression_b_whole_body_published_range\": [1.0, 2.5], \"benn_p_adult_range\": [1.1, 2.5], \"burton_hypothesised_true_exponent\": 3, \"heymsfield2007_FFM_power_men\": 1.86, \"ansur2_men_ols_p\": 1.999, \"ansur2_men_rma_p\": 4.24}",
   "sources": [
    {
     "title": "Burton RF. Human allometry: adult bodies are more nearly geometrically similar than regression analysis has suggested. Med Hypotheses 2010;74:15-17 (Europe PMC abstract, PMID 19726135)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:19726135%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Burton RF. Ann Hum Biol 2007;34:656-663 (Europe PMC abstract, PMID 18092209)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:18092209%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Heymsfield 2007 full text (PMC2729090)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2729090/"
    }
   ],
   "notes": "Burton 2010 abstract:\n- 'Values of b estimated by regression must usually underestimate the true functional values, doing so especially when mass and height are poorly correlated.'\n- Published b 'for the whole body (which range between 1.0 and 2.5)'.\n- 'Monte Carlo modelling has shown that the results obtained for total body mass are compatible with a true height exponent of three.'\nBurton 2007 abstract: 'In adult populations mass must vary more nearly with height(3) than with height(2), although ... conventional statistical techniques suggest otherwise'.\nAgainst this, Heymsfield 2007 finds FFM powers near 2 in large samples, and Burton 2012 (tall_men_not_scaled_copies) itself finds legs relatively thinner in long-legged people.\nThe ANSUR OLS (2.0) vs RMA (4.24) exponents come from existing key ansur_mass_height_exponent; that key already says neither should be used as the exponent for 'the same build at another height'. Burton 2010 is a Medical Hypotheses paper: argument plus modelling, no new measurements.\nStatus disputed: the structural exponent for real humans is unsettled. This matters only for how the index treats ordinary tall vs short men. It does not affect the exact statement that a true scaled copy has mass proportional to H^3."
  },
  {
   "key": "allometric_normalisation_practice",
   "label": "Sport science normalises for body size with theoretical geometric-similarity exponents (allometric scaling)",
   "status": "reported",
   "values": "{\"jaric2002_force_exponent_on_mass\": 0.67, \"jaric2002_torque_exponent_on_mass\": 1.0, \"nevill1992_vo2max_power_ratio_units\": \"ml kg^-2/3 min^-1\", \"geometric_similarity_area_vs_mass\": \"m^(2/3)\"}",
   "sources": [
    {
     "title": "Jaric S, Mirkov D, Markovic G. Normalizing physical performance tests for body size: a proposal for standardization. J Strength Cond Res 2005;19:467-474 (Europe PMC abstract, PMID 15903392)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:15903392%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Jaric S. Muscle strength testing: use of normalisation for body size. Sports Med 2002;32:615-631 (Europe PMC abstract, PMID 12141882)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:12141882%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Nevill AM, Ramsbottom R, Williams C. Scaling physiological measurements for individuals of different body size. Eur J Appl Physiol 1992;65:110-117 (Europe PMC abstract, PMID 1396632)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:1396632%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Jaric 2005 abstract: 'we propose (a) using an allometric normalization based on theoretical models that presume geometric similarity'. Jaric 2002 abstract: 'The allometric parameter should be either b = 0.67 for muscle force ... or b = 1 for muscle torque'. Nevill 1992 abstract: 'the best method of scaling maximum oxygen uptake, peak and mean power output, required these variables to be divided by body mass, recorded in the units kg 2/3'.\nThe exponent 0.67 = 2/3 is the geometric-similarity exponent (area over volume). That derivation is mine; the Jaric 2002 abstract does not spell it out.\nRelevance: when bodies differ in size, the field's recommended practice is to divide by the size power implied by geometric similarity, not by a ratio picked for convenience. For mass against height that power is 3. These papers normalise performance, not body composition, and cover human ranges only."
  },
  {
   "key": "ansur_height_cubed_index_vs_height",
   "label": "ANSUR II men: BMI is flat with height, but weight over height cubed (x1.8) falls as 1/height",
   "status": "derived",
   "values": "{\"n\": 4082, \"stature_range_m\": [1.491, 1.993], \"loglog_slope_BMI_vs_H\": -0.001, \"loglog_slope_1p8W_over_H3_vs_H\": -1.001, \"r_1p8W_over_H3_vs_lnH\": -0.259, \"shortest_decile\": {\"median_H_m\": 1.647, \"median_BMI\": 27.25, \"median_1p8W_over_H3\": 29.92}, \"middle_decile\": {\"median_H_m\": 1.755, \"median_BMI\": 27.4, \"median_1p8W_over_H3\": 28.07}, \"tallest_decile\": {\"median_H_m\": 1.87, \"median_BMI\": 27.28, \"median_1p8W_over_H3\": 26.18}, \"tallest_vs_shortest_ratio\": 0.875}",
   "sources": [
    {
     "title": "ANSUR II male public data (local copy build-calculator/data/ansur2/ANSUR_II_MALE_Public.csv; published at the Penn State OpenLab mirror cited by existing key ansur_mass_height_exponent)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "Script: scratchpad/research/size_index/scripts/ansur_index_vs_height.py. Inputs: stature in mm / 1000, and weightkg in tenths of kg / 10. Deciles are by stature (sorted, bands 0-10%, 45-55% and 90-100%). I used the repo's local CSV and did not re-download it; existing key ansur_mass_height_exponent records the download and the same OLS exponent of 1.999.\nANSUR has no body-fat measurement, so this uses total weight, not FFM. It shows the direction and size of the bias, not FFM values. With Heymsfield's FFM power of 1.86 (± 0.10), the expected ratio of S between a 1.95 m and a 1.65 m man of typical build is (1.95/1.65)^(1.86-3), about 0.83 (0.81-0.84).\nReading: among ordinary soldiers of the same BMI, the tallest tenth score about 12% lower on a height-cubed index than the shortest tenth. That is a known bias of the rescaled index for real humans, and the page should state it. US Army sample, 2010-12; not representative of the population."
  },
  {
   "key": "rescaled_ffmi_identity_at_180",
   "label": "Rescaled FFMI S = 1.8 x FFM / H^3 equals plain FFMI at exactly 1.80 m",
   "status": "derived",
   "values": "{\"formula_S\": \"S = 1.8 x FFM_kg / H_m^3\", \"equivalent\": \"S = FFMI x (1.8 / H_m)\", \"units\": \"kg/m^2 (1.8 m x kg/m^3)\", \"check_H_m\": 1.8, \"check_FFM_kg\": [61.2, 81.0, 120.0], \"check_FFMI\": [18.89, 25.0, 37.04], \"check_S\": [18.89, 25.0, 37.04], \"max_abs_difference\": 7e-15}",
   "sources": [
    {
     "title": "Kouri 1995 abstract (reference height 1.80 m)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:7496846%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "VanItallie 1990 abstract (FFMI definition)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:2239792%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Algebra: at H = 1.8, S = 1.8 x FFM / 1.8^3 = FFM / 1.8^2 = FFMI. Script check: scratchpad/research/size_index/scripts/derived.py (the difference is floating-point rounding only).\nMeaning: S is the plain FFMI the same body would have if all its lengths were scaled to 1.80 m, keeping its shape and density. At 1.80 m it also equals Kouri's normalised FFMI, since Kouri's correction is zero there. So Kouri's 25.0 non-user maximum (existing key kouri1995_ffmi_natural_limit) can be drawn on the S axis at 25 without conversion, as a line from a human sample, not a ceiling. Equivalently, S = 1.8 m x (fat-free Rohrer index in kg/m^3)."
  },
  {
   "key": "same_shape_scaled_to_3048",
   "label": "The same shape scaled from 1.80 m to 3.048 m: plain FFMI rises 1.69 times, the rescaled index does not change",
   "status": "derived",
   "values": "{\"height_ratio_k\": 1.6933, \"FFM_multiplier_k3\": 4.855, \"plain_FFMI_multiplier_k\": 1.6933, \"S_multiplier\": 1.0, \"example_FFMI25_at_1p80\": {\"FFM_kg\": 81.0, \"FFM_kg_at_3p048\": 393.3, \"plain_FFMI_at_3p048\": 42.3, \"S\": 25.0}, \"rex_plain_FFMI_at_3p048_from_brief\": 269, \"rex_S_tail_included\": 158.9}",
   "sources": [
    {
     "title": "Burton 2018 (isometric individuals: mass proportional to height^3; BMI rises with height)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5835999/"
    },
    {
     "title": "Burton 2010 (geometric similarity requires mass proportional to height cubed)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:19726135%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "k = 3.048 / 1.8 = 1.6933. A scaled copy has FFM multiplied by k^3 = 4.855, so plain FFMI = FFM/H^2 is multiplied by k^3 / k^2 = k = 1.693, while S = 1.8 x FFM/H^3 is multiplied by k^3 / k^3 = 1. The 269 plain FFMI for Rex at 7.5% fat (tail included, height to crest 3.048 m) comes from the brief, not recomputed here. 269 / 1.6933 = 158.9, matching the brief's 'about 159'. General rule: for any body, plain FFMI = S x H / 1.8."
  },
  {
   "key": "kouri_correction_beyond_human_heights",
   "label": "Kouri's linear height correction fails far outside human heights (Rex: 261 vs 159)",
   "status": "derived",
   "values": "{\"kouri_correction_at_3p048_c6p1\": -7.61, \"kouri_correction_at_3p048_c6p3\": -7.86, \"rex_kouri_normalised_c6p1\": 261.4, \"rex_kouri_normalised_c6p3\": 261.1, \"rex_S\": 158.9, \"same_shape_slope_per_m_at_FFMI\": {\"20\": 11.1, \"25\": 13.9, \"30\": 16.7}, \"kouri_6p3_as_fraction_of_same_shape_slope\": {\"20\": 0.57, \"25\": 0.45, \"30\": 0.38}, \"implied_FFM_height_power\": {\"FFMI20\": 2.57, \"FFMI25\": 2.45, \"FFMI30\": 2.38}, \"calc_js_norm_range_m\": [1.55, 2.05]}",
   "sources": [
    {
     "title": "Kouri 1995 abstract (correction 6.3 x (1.80 - height))",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:7496846%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Arithmetic in scratchpad/research/size_index/scripts/derived.py.\n- Kouri adds a fixed c x (1.80 - H). At 3.048 m that is -7.6 (c = 6.1) or -7.9 (c = 6.3), so Rex's plain 269 becomes about 261. The same-shape rescaling gives 159.\n- For a same-shape body, FFMI(H) = S x H / 1.8, so near 1.80 m the exact same-shape correction has slope FFMI/1.8 per metre: 13.9 at FFMI 25.\n- Kouri's 6.3 is about 45% of that slope at FFMI 25. This is equivalent to assuming FFM proportional to H^2.45 (agrees with existing key ffmi_height_correction).\n- Because the correction is a constant slope, not a ratio, it cannot scale with the size of the body. It was fitted on human athletes only (height range not in the abstract; full text unavailable).\nThe Build Calculator's calc.js already applies Kouri only between 1.55 and 2.05 m (FFMI_NORM_RANGE) with c = 6.1. The chart should not use Kouri for comic characters beyond that range, nor for Rex or Ollie."
  },
  {
   "key": "rescaled_vs_kouri_human_heights",
   "label": "Within human heights, the rescaled index and Kouri's normalised FFMI differ by up to about 2.5 units (at plain FFMI 25)",
   "status": "derived",
   "values": "{\"plain_FFMI\": 25, \"rows\": [{\"H_m\": 1.55, \"kouri_c6p1\": 26.52, \"S\": 29.03}, {\"H_m\": 1.6, \"kouri_c6p1\": 26.22, \"S\": 28.12}, {\"H_m\": 1.7, \"kouri_c6p1\": 25.61, \"S\": 26.47}, {\"H_m\": 1.8, \"kouri_c6p1\": 25.0, \"S\": 25.0}, {\"H_m\": 1.9, \"kouri_c6p1\": 24.39, \"S\": 23.68}, {\"H_m\": 2.0, \"kouri_c6p1\": 23.78, \"S\": 22.5}, {\"H_m\": 2.05, \"kouri_c6p1\": 23.48, \"S\": 21.95}], \"max_gap_1p70_to_1p90\": 0.86, \"gap_at_1p55\": 2.51, \"gap_at_2p05\": -1.53}",
   "sources": [
    {
     "title": "Kouri 1995 abstract (correction formula)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:7496846%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Computed for a man with plain FFMI 25 at each height (scripts/derived.py). Kouri values with c = 6.3 differ from c = 6.1 by 0.05 or less. Within 1.70-1.90 m the two agree within 0.9 units. At 1.55 m S is 2.5 units higher, and at 2.05 m it is 1.5 units lower.\nThe direction matches the ANSUR finding: S favours short men and penalises tall men relative to the human-fitted correction. This is because Kouri's correction implies FFM proportional to H^2.45 and S assumes H^3.\nExample with existing builds: a 1.91 m strongman or a 1.73 m bodybuilder will sit about 1 unit apart on the two scales. Show both for human builds so readers can see the gap."
  },
  {
   "key": "rescaled_index_height_sensitivity",
   "label": "The rescaled index falls with height cubed: each 1% of height is about 3% of score",
   "status": "derived",
   "values": "{\"S_factor_if_H_plus_1pct\": 0.9706, \"S_factor_if_H_minus_1pct\": 1.0306, \"approx_rule\": \"dS/S = -3 dH/H\"}",
   "sources": [
    {
     "title": "Burton 2010 (mass proportional to height cubed at the same shape)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:19726135%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "S proportional to H^-3 at fixed FFM: 1/1.01^3 = 0.9706 and 1/0.99^3 = 1.0306. This is why the brief requires height to the top of the skull, not to Rex's crest or Ollie's horn tips. Example from existing key rex_ollie_picture_mass: Ollie is 3.063 m to his horn tips and 2.982 m to his skull top. That is a 2.7% height difference, so his S is 8.3% higher with the skull-top height ((3.063/2.982)^3 = 1.083). For real people, a 1 cm error in a reported height at 1.80 m (0.56%) moves S by about 1.7%."
  },
  {
   "key": "meatball_score_check",
   "label": "Upper bound: a solid ball of tissue as tall as the figure scores about 924 at 7.5% fat (899-949 for 5-10%)",
   "status": "derived",
   "values": "{\"formula\": \"S = 1.8 x rho x (pi/6) x (1 - f)\", \"rho_kg_m3\": 1060, \"f\": 0.075, \"S\": 924.1, \"S_f0p05\": 949.1, \"S_f0p10\": 899.1, \"S_if_rho_1081_no_lung_gas\": 942.4, \"plain_FFMI_meatball_at_1p8\": 924.1, \"plain_FFMI_meatball_at_3p048\": 1564.8}",
   "sources": [
    {
     "title": "Existing builds.json key rex_ollie_picture_mass (whole-body density 1,060 kg/m^3 = 1,081 x 0.98 lung gas)",
     "url": "https://www.bisp-surf.de/Record/PU198802031700"
    },
    {
     "title": "Existing builds.json key muscle_tissue_density (Ward & Lieber 2005: conventional 1,059.7 kg/m^3)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:16154420%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "A ball of diameter H has volume (pi/6) H^3, so FFM = rho x (pi/6) H^3 x (1 - f) and S = 1.8 x rho x (pi/6) x (1 - f), whatever H is. 1.8 x 1060 x 0.5236 x 0.925 = 924.1, matching the brief.\nThe 1,060 kg/m^3 is the whole-body density used for Rex and Ollie, including about 2% lung gas (existing key rex_ollie_picture_mass; I did not re-fetch its sources). With lung-free tissue at 1,081 kg/m^3, S would be about 942. Use the same density as the duo so the top of the scale and the duo stay comparable.\nAt 3.048 m the same ball has plain FFMI 1,565. That is the plain-FFMI ceiling the page must not mix with S. This is geometry with an assumed density, not a physiological limit."
  },
  {
   "key": "recommended_size_independent_index",
   "label": "Recommendation: keep S = 1.8 x FFM / H^3 ('FFMI at 1.80 m, same shape'); no better-sourced alternative found",
   "status": "derived",
   "values": "{\"recommended\": \"S = 1.8 x FFM_kg / H_m^3\", \"name_on_page\": \"FFMI rescaled to 1.80 m (same shape)\", \"show_beside\": [\"plain FFMI at real height\", \"Kouri-normalised FFMI (humans 1.55-2.05 m only)\"], \"rejected\": {\"plain_FFMI\": \"rises with height for a scaled copy (x1.69 at 3.048 m)\", \"kouri_normalised\": \"linear, fitted to human athletes; 261 vs 159 for Rex\", \"benn_type_fitted_p\": \"p depends on population and statistics (1.1-2.5 adults; ANSUR OLS 2.0 vs RMA 4.2); undefined for non-humans\"}, \"known_bias_humans\": \"tall men score lower: tallest ANSUR decile about 12% below shortest at equal BMI\"}",
   "sources": [
    {
     "title": "Burton 2007 (mass/height^3 independent of scale)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:18092209%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Burton 2018 full text (isometric individuals)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5835999/"
    },
    {
     "title": "Jaric 2005 (allometric normalisation based on geometric similarity)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:15903392%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Kouri 1995 abstract (1.80 m reference)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:7496846%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Heymsfield 2007 full text (FFM ~ H^1.86 in men)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2729090/"
    }
   ],
   "notes": "Why this index:\n- The height-cubed exponent is the only one that follows from geometry: constant for a scaled copy (Burton 2007, 2010, 2018; Haldane; Fowler).\n- Allometric normalisation based on geometric similarity is the recommended practice when sizes differ (Jaric 2005).\n- Weight/H^3 is an established index (Rohrer, tri-ponderal; Peterson 2017).\n- The constant 1.8 m is Kouri's reference height, so S equals plain and Kouri-normalised FFMI at 1.80 m. That lets readers use the familiar FFMI landmarks (Schutz median 18.9, Kouri 25) on the S axis.\nWhere S stops being valid, or misleads:\n1. Real tall men are not scaled copies. FFM goes roughly with H^1.86 to 2 (Heymsfield 2007), so S rates ordinary tall men lower and short men higher (ANSUR: about 12% between the tallest and shortest tenths). Kouri-normalised FFMI is the better human comparison between 1.55 and 2.05 m.\n2. S is not a published FFM index (none found). Kouri's 25 is a sample maximum in normalised FFMI, which equals S only at 1.80 m. At other human heights the two differ by up to about 2.5 units.\n3. S measures bulk for height (shape), not strength or physiology. It says nothing about whether a 3 m body of that shape could stand or move (Galileo, Haldane, Biewener).\n4. S is very sensitive to the height used (3% per 1%) and to the assumed density and body fat.\n5. Every S above the human data (about 40) is an extrapolation of geometry, not of any fitted human relation."
  }
 ],
 "recommendations": "1. **Main axis.** Use S = 1.8 × FFM / H³ (H to the skull top) and label it \"FFMI rescaled to 1.80 m (same shape)\". Show the formula and one sentence of explanation: it is the plain FFMI the same body would have if shrunk or enlarged to 1.80 m at the same shape. Do not call it a published index (no FFM/H³ index was found). Call it this project's fat-free version of the Rohrer / tri-ponderal index (weight/height³), scaled to Kouri's 1.80 m. Cite Burton 2007, 2010 and 2018, Peterson 2017, Jaric 2005 and Kouri 1995.\n\n2. **Beside it, show plain FFMI at the real height**, an … [2,205 more characters on this line; the full prompt is in prompts/a9a85a0f815e9d613.txt]
 "gaps": "- **Kouri 1995 full text** is not open access. The 6.3 vs 6.1 constant is unresolved (already marked disputed in builds.json). I also could not find how the slope was fitted or the athletes' height range.\n- **VanItallie 1990 full text** was not reachable (DOI redirects to Elsevier). I used the abstract only, which gives the definition but no reason for choosing height squared.\n- **Rohrer 1921 primary** was not fetched. The citation (Münch Med Wochenschr 68:580-582) comes from Wikipedia only. The Peterson 2017 supplement with the history was blocked by a PMC download challenge.\n- * … [1,606 more characters on this line; the full prompt is in prompts/a9a85a0f815e9d613.txt]
}
```

</details>

**Subagent `verify:natural`** · build-comparison-research · started 2026-10-11 04:32:08 UTC

- checks: 19 (17 ok, 2 not ok).
- Not OK: todd2008_mr_america_reanalysis; santos2014_drug_tested_athletes_ffmi.
- The research holds up, with a few corrections. The central claims hold: - I fetched the Kouri 1995 PDF from Ovid myself; it is the same file as the researcher's.

<details>
<summary>Prompt, verbatim (71,471 characters)</summary>

Workflow run `wf_94de1f40-a68`, phase `Verify`, agent `ac4b723cde2bc025b`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/ac4b723cde2bc025b.txt](prompts/ac4b723cde2bc025b.txt).

```text
Project: "Build Comparison", a chart that ranks male body builds by "muscle level" irrespective of height, from ordinary men through the limits of human possibility to the monstrous (comic characters, and two original 3 m characters, Rex and Ollie). Read /home/user/rex-strength-lab/build-comparison/BRIEF.md first (10 minutes): it states the decisions already made and the problems to solve.
The working score is FFMI after rescaling the body to 1.80 m at the same shape: S = 1.8 * FFM / H^3 (FFM = fat-free mass in kg, H = height in m), shown beside plain FFMI = FFM / H^2. A rough first pass gives: US Army median man about 24, Ronnie Coleman about 35-39, Eddie Hall about 38, the heaviest comic characters 57-81, Rex about 141 (tail excluded, height to crest). A solid ball of muscle as tall as the figure scores about 924.
The sister project /home/user/rex-strength-lab/build-calculator/ already holds 55 builds and 139 verified facts in data/builds.json (read its "facts" keys and labels before you start; do NOT re-research a fact that already exists there unless the brief needs a number it lacks, and say so when you rely on an existing key). ANSUR II CSVs are in /home/user/rex-strength-lab/build-calculator/data/ansur2/ (ANSUR_II_MALE_Public.csv, 4,082 men; values in mm and kg x10? check: weightkg is in tenths of kg, lengths in mm).
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent; a number is "sourced" only if you fetched the page or PDF and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher PDFs). Prefer primary or authoritative sources (journals, textbooks, government surveys, standards bodies, publisher handbooks); use fan sites or magazines only when nothing better exists, and label them so. Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". Write raw downloads and scripts under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
For each fact give: key (snake_case), label, status (measured | official | reported | derived | estimate | disputed), values (a JSON object as a string, SI units plus the original units), sources (title + URL actually fetched), and notes (what exactly the source says, its sample, caveats, how good the evidence is).

You are a skeptical fact-checker for the topic "natural". Below are the researcher's facts and recommendations. Re-fetch the cited URLs for every fact the chart is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, quotation and status against what the source actually says; recompute every derived number you can (re-run computations on the ANSUR II CSV where relevant). Mark ok=false with a correction for anything wrong, mislabelled (for example a fan wiki or a magazine marked official or measured; a sample maximum called a limit; a secondary summary presented as the primary paper), or unsupported. Also judge the recommendations: anything that overstates the evidence? List important missing items.

RESEARCH:
{
 "summary": "Natural-limit anchors for the Build Comparison chart. The main finding is that the Kouri et al. 1995 full text is free as a scanned PDF from the publisher (Ovid, reached through the DOI). I read every page, and it corrects three things in builds.json.\n\n(1) The height slope is 6.1 kg/m³ in the methods. The abstract prints 6.3. This settles the two keys marked \"disputed\".\n\n(2) The pre-steroid Mr America winners were not given an assumed 5% fat. Pope estimated each man's fat blind from magazine photographs, and later recalled estimates of about 6–16%. The 5% assumption applied  … [2,948 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
 "facts": [
  {
   "key": "kouri1995_fulltext_methods",
   "label": "Kouri et al. 1995, full text: sample, how non-use was checked, body-fat method, group values, and the 6.1 height slope",
   "status": "measured",
   "values": "{\"n_total\":157,\"n_users\":83,\"n_nonusers\":74,\"gym_study_recruited\":156,\"gym_study_evaluable\":134,\"testosterone_study_added\":23,\"testosterone_study_nonusers\":18,\"testosterone_study_former_users\":5,\"users_used_in_past_year\":52,\"users_height_m\":1.79,\"users_height_sd_m\":0.075,\"users_weight_kg\":91.69,\"users_weight_sd_kg\":11.8,\"users_bodyfat_pct\":12.8,\"users_bodyfat_sd_pct\":4.8,\"users_ffmi_kg_m2\":24.8,\"users_ffmi_sd_kg_m2\":2.2,\"nonusers_height_m\":1.80,\"nonusers_height_sd_m\":0.074,\"nonusers_weight_kg\":82.06,\"nonusers_weight_sd_kg\":13.0,\"nonusers_bodyfat_pct\":12.5,\"nonusers_bodyfat_sd_pct\":5.5,\"nonusers_ffmi_kg_m2\":21.8,\"nonusers_ffmi_sd_kg_m2\":1.8,\"height_slope_methods_kg_m3\":6.1,\"height_slope_abstract_kg_m3\":6.3,\"reference_height_m\":1.8,\"users_beyond_top_nonuser\":37,\"users_beyond_top_nonuser_pct\":45,\"nonusers_over_20pct_fat\":6,\"skinfold_equation_se_pct_fat\":3.4,\"shortest_nonuser_height_m\":1.59,\"shortest_nonuser_ffmi_unnormalized_kg_m2\":23.5,\"tall_nonuser_height_m\":1.93,\"tall_nonuser_ffmi_unnormalized_kg_m2\":25.4}",
   "sources": [
    {
     "title": "Kouri EM, Pope HG Jr, Katz DL, Oliva P. Fat-free mass index in users and nonusers of anabolic-androgenic steroids. Clin J Sport Med 1995;5(4):223-228. Publisher's free full-text PDF (Ovid / Wolters Kluwer; scanned, 6 pages; read as page images)",
     "url": "https://www.ovid.com/jnls/cjsportsmed/pdf/00042752-199510000-00003~fat-free-mass-index-in-users-and-nonusers-of"
    },
    {
     "title": "Same article, publisher landing page reached from DOI 10.1097/00042752-199510000-00003 (marked 'Free', 'PDF Only')",
     "url": "https://www.ovid.com/jnls/cjsportsmed/fulltext/00042752-199510000-00003~fat-free-mass-index-in-users-and-nonusers-of"
    },
    {
     "title": "Europe PMC record, PMID 7496846 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:7496846%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Methods, p.223: 'One hundred fifty-six men in a large controlled study of athletes, recruited at gymnasiums in the Boston and Los Angeles areas, were administered physical examinations ... height, body weight, and body fat, the latter computed from the sum of six skinfold measurements using an equation derived from the data of Jackson and Pollock'. The equation is %fat = 0.217x1 - 0.00029x1^2 + 0.133x2 - 5.73, where x1 is the sum of the chest, thigh, ilium, abdomen, triceps and scapula skinfolds and x2 is age. One investigator (H.G.P.) took all the skinfolds.\n\nNon-use, p.223-224 … [2,772 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
  },
  {
   "key": "kouri1995_fig2_distribution",
   "label": "Kouri 1995 Fig. 2: every non-user's and user's normalised FFMI, in 1-unit bins (counted from the figure)",
   "status": "measured",
   "values": "{\"bin_width_kg_m2\":1,\"nonusers_first_bin_low_kg_m2\":17,\"nonusers_bin_counts\":[1,5,4,16,16,13,10,9],\"nonusers_top_bin_low_kg_m2\":24.0,\"nonusers_top_bin_high_kg_m2\":24.9,\"nonusers_in_top_bin\":9,\"users_first_bin_low_kg_m2\":19,\"users_bin_counts\":[1,3,6,6,16,14,15,5,9,3,3,1,1],\"users_at_or_above_25\":37,\"users_below_25\":46,\"users_at_or_above_30\":2,\"users_top_bin_low_kg_m2\":31.0,\"users_top_bin_high_kg_m2\":31.9}",
   "sources": [
    {
     "title": "Kouri et al. 1995, Clin J Sport Med 5:223-228, Fig. 2 (p.225), publisher's free PDF",
     "url": "https://www.ovid.com/jnls/cjsportsmed/pdf/00042752-199510000-00003~fat-free-mass-index-in-users-and-nonusers-of"
    }
   ],
   "notes": "Counted by script (scratchpad scripts/count_dots.py, page rendered at 250 dpi) from Fig. 2, captioned 'FFMI, normalized to the height of a 1.8-m man in 74 nonusers ... and 83 users ... Each circle represents one individual.'\n\nBin counts:\n- Non-users, bins 17-17.9 to 24-24.9: 1, 5, 4, 16, 16, 13, 10, 9 (total 74).\n- Users, bins 19-19.9 to 31-31.9: 1, 3, 6, 6, 16, 14, 15, 5, 9, 3, 3, 1, 1 (total 83).\n\nThe 37 users at or above 25 match the text's '37 (45%)'. Text p.224: 'the nonusers \"stop\" abruptly at a maximum value of 25.0'. p.226: 'athletes who had not used steroids all had values of <25.0'. So the top non-user lies between 24.0 and 24.9, with 9 men in that bin; the paper does not print the exact top value.\n\nThe highest user is in the 31.0-31.9 bin, and 2 users exceed 30. Helms' 'some users reached ~32' rounds up. 46 of the 83 users (55%) were below 25, so an FFMI under 25 is no evidence that a man is natural.\n\nIn Fig. 1 (unnormalised FFMI against height) the top user sits at about 31, near 1.73 m. That is read off the plot, so it is approximate.\n\nThe status is 'measured' because each circle is one measured man, but the counts are read from a printed figure."
  },
  {
   "key": "kouri1995_mr_america_table2",
   "label": "Kouri 1995 Table 2: estimated normalised FFMI of 20 pre-steroid Mr America winners, 1939-1959 (blind photo-based fat estimates, not 5%)",
   "status": "estimate",
   "values": "{\"n_rated\":20,\"n_not_rated\":2,\"year_first\":1939,\"year_last\":1959,\"years_table_order\":[1939,1939,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1953,1954,1955,1957,1958,1959],\"normalized_ffmi_table_order_kg_m2\":[24.3,22.6,24.0,26.9,25.5,23.9,27.3,26.1,25.9,23.0,27.7,28.0,26.5,26.0,25.8,25.4,23.5,25.2,26.8,24.6],\"mean_kg_m2\":25.4,\"sd_kg_m2\":1.5,\"recomputed_mean_kg_m2\":25.45,\"recomputed_sd_kg_m2\":1.55,\"max_kg_m2\":28.0,\"min_kg_m2\":22.6,\"n_above_27\":3,\"n_above_25\":13,\"n_at_or_above_26\":8,\"mean_1939_1944_kg_m2\":24.9,\"max_1939_1944_kg_m2\":27.3,\"mean_1939_1953_kg_m2\":25.6,\"max_1939_1953_kg_m2\":28.0,\"trend_slope_per_year\":0.044,\"trend_p\":0.44,\"pope_recalled_bodyfat_low_pct\":6,\"pope_recalled_bodyfat_high_pct\":16,\"rescaled_S_mean_using_todd_heights\":25.8,\"rescaled_S_max_using_todd_heights\":29.2}",
   "sources": [
    {
     "title": "Kouri et al. 1995, Clin J Sport Med 5:223-228, pp.224-226 and Table 2, publisher's free PDF",
     "url": "https://www.ovid.com/jnls/cjsportsmed/pdf/00042752-199510000-00003~fat-free-mass-index-in-users-and-nonusers-of"
    },
    {
     "title": "Todd J. Size Matters: Reflections on Muscle, Drugs, and Sport. Iron Game History 10(3), Aug 2008 (source of the heights used for S, and of Pope's recalled fat range)",
     "url": "https://starkcenter.org/igh/igh-v10/igh-v10-n3/igh1003p03.pdf"
    },
    {
     "title": "Helms E. 'What can be achieved as a natural bodybuilder?', Alan Aragon's Research Review, Aug 2014 (history of early testosterone use; skepticism subsets)",
     "url": "https://www.alanaragon.com/wp-content/uploads/2016/08/Helms-Aug-2014-AARR.pdf"
    }
   ],
   "notes": "Method, pp.224-226: 'we obtained the heights, weights, and ages, at the time of competition, of all Mr. America winners from 1939 to 1959 (21)'. Ref 21 is Willoughby DP, The Super Athletes, 1970. 'The second author (H.G.P.) estimated the body fat of each athlete from contemporaneous photographs in bodybuilding magazines of the era ..., averaging the estimates from several photographs of each athlete'. Faces and names were obscured 'to render all estimates blind'. 'Adequate photographs could not be found for two of the Mr. America winners (Park, 1952; and Schaefer, 1956).'\n\nTable … [2,116 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
  },
  {
   "key": "kouri1995_modern_bodybuilders",
   "label": "Kouri 1995 Fig. 3: estimated normalised FFMI of 33 modern magazine bodybuilders, 1989-1994 (assumed 5% fat; not drug-tested)",
   "status": "estimate",
   "values": "{\"n\":33,\"magazine_issues_approx\":60,\"year_first\":1989,\"year_last\":1994,\"assumed_bodyfat_pct\":5,\"first_bin_low_kg_m2\":26,\"bin_counts\":[1,2,3,2,7,5,6,4,0,0,1,0,1,1],\"approx_mean_from_bin_midpoints_kg_m2\":31.5,\"top_bin_low_kg_m2\":39.0,\"top_bin_high_kg_m2\":39.9}",
   "sources": [
    {
     "title": "Kouri et al. 1995, Clin J Sport Med 5:223-228, p.226 and Fig. 3 (p.227), publisher's free PDF",
     "url": "https://www.ovid.com/jnls/cjsportsmed/pdf/00042752-199510000-00003~fat-free-mass-index-in-users-and-nonusers-of"
    }
   ],
   "notes": "Method, p.226: 'we obtained the heights and weights of 33 modern competitive bodybuilders from ~60 monthly issues of various popular bodybuilding magazines that had appeared between 1989 and 1994'. Light-weight classes were excluded. 'A recent article in one bodybuilding magazine specified that modern high-ranking competitive bodybuilders displayed body fat levels of 4-6% (20); therefore, we used 5% in our calculations.' Also: 'many of the modern bodybuilders had not even won a national contest'.\n\nBins counted from Fig. 3 (26-26.9 up to 39-39.9): 1, 2, 3, 2, 7, 5, 6, 4, 0, 0, 1, 0, 1, 1 (total 33). The mean from bin midpoints is about 31.5. The highest bodybuilder is in 39.0-39.9.\n\nThese are the paper's contrast group. Drug use was not tested but is implied. The numbers suit the chart's 'enhanced' region, not the natural limit. The heights and weights are magazine claims."
  },
  {
   "key": "todd2008_mr_america_reanalysis",
   "label": "Jan Todd 2008: re-estimate of the same pre-steroid Mr America winners with Pope's formula, mean 26.4, top 32.0 (subjective fat estimates)",
   "status": "estimate",
   "values": "{\"n\":22,\"heights_m\":[1.79,1.8,1.73,1.73,1.8,1.7,1.82,1.75,1.8,1.85,1.7,1.68,1.75,1.68,1.77,1.77,1.85,1.77,1.78,1.73,1.8,1.75],\"weights_kg\":[88.5,82,87.5,100.5,94.8,76.2,101.25,87.09,93,87,88,88,88,81,84,91.17,98,83.9,95.25,84,96.25,84.5],\"bodyfat_fraction\":[0.11,0.10,0.07,0.07,0.09,0.07,0.09,0.09,0.09,0.08,0.09,0.09,0.10,0.07,0.08,0.08,0.08,0.09,0.08,0.09,0.08,0.09],\"normalized_ffmi_kg_m2\":[24.64,22.78,27.62,31.99,26.63,25.13,27.69,26.18,26.12,23.08,28.32,29.11,26.17,27.42,24.85,26.96,26.04,24.55,27.78,26.07,27.33,25.41],\"stated_mean_kg_m2\":26.44,\"stated_n_above_26\":15,\"stated_n_above_25\":18,\"recount_n_above_25\":17,\"stated_mean_excl_park_schaeffer_kg_m2\":26.54,\"recomputed_mean_excl_park_schaeffer_kg_m2\":26.46,\"max_kg_m2\":31.99,\"max_height_m\":1.73,\"max_weight_kg\":100.5,\"max_weight_lb\":221,\"rescaled_S_mean\":26.8,\"rescaled_S_max\":32.5}",
   "sources": [
    {
     "title": "Todd J. Size Matters: Reflections on Muscle, Drugs, and Sport. Iron Game History 10(3):13-15, Aug 2008 (Seward Staley Honor Lecture, NASSH 2008)",
     "url": "https://starkcenter.org/igh/igh-v10/igh-v10-n3/igh1003p03.pdf"
    },
    {
     "title": "McDonald L. Another Look at the Fat-Free Mass Index (FFMI), BodyRecomposition (secondary summary quoting Todd's 26.4 and 15 above 26)",
     "url": "https://bodyrecomposition.com/muscle-gain/another-look-at-the-ffmi"
    }
   ],
   "notes": "Order of men (heights in metres, weights in kg, fat as a fraction, normalised FFMI): 1939 Goodrich, 1939 Essmaker, 1940 Grimek, 1941 Grimek, 1942 Leight, 1943 Bacon, 1944 Stanko, 1945 Ross, 1946 Stephan, 1947 Reeves, 1948 Eiferman, 1949 Delinger, 1950 Farbotnik, 1951 Hilligenn, 1952 Park, 1953 Pearl, 1954 Dubois, 1955 Klisanin, 1956 Schaeffer, 1957 Lacy, 1958 Sansone, 1959 Johnson.\n\nTodd (p.14): Pope 'told [her] he'd never published the specific body fat estimates'. He remembered 'that the estimates ranged from about 6% to a maximum of about 16%'. Jan and Terry Todd re-estimated … [1,456 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
  },
  {
   "key": "butt_frame_model_max_lbm",
   "label": "Casey Butt's frame-based prediction of maximum drug-free lean mass from height, wrist and ankle (self-published; not peer-reviewed)",
   "status": "reported",
   "values": "{\"height_exponent\":1.5,\"wrist_divisor_in\":22.6670,\"ankle_divisor_in\":17.0104,\"wrist_divisor_cm_kg\":322.4,\"ankle_divisor_cm_kg\":241.9,\"bodyfat_divisor\":224,\"check_5ft8_lbm_lb\":170,\"check_5ft10_lbm_lb\":178,\"check_6ft0_lbm_lb\":185,\"check_wrist_in\":7,\"check_ankle_in\":8.75,\"check_bodyfat_pct\":10,\"ansur_175_185cm_median_wrist_cm\":17.8,\"ansur_175_185cm_median_ankle_cm\":23.2,\"ansur_175_185cm_n\":1814,\"pred_lbm_180cm_median_frame_5pct_kg\":81.5,\"pred_lbm_180cm_median_frame_10pct_kg\":83.2,\"pred_ffmi_180cm_median_frame_5pct_kg_m2\":25.1,\"pred_ffmi_180cm_median_frame_10pct_kg_m2\":25.7,\"pred_ffmi_180cm_p5_frame_5pct_kg_m2\":24.1,\"pred_ffmi_180cm_p95_frame_10pct_kg_m2\":26.9,\"ansur_all_pred_ffmi_median_5pct_kg_m2\":25.3,\"ansur_all_pred_ffmi_median_10pct_kg_m2\":25.8,\"ansur_all_pred_ffmi_p5_5pct_kg_m2\":24.3,\"ansur_all_pred_ffmi_p95_10pct_kg_m2\":27.0,\"ansur_pred_S_median_155_160cm_10pct\":29.7,\"ansur_pred_S_median_190_195cm_10pct\":23.8,\"reported_sample_size_secondary\":300,\"reported_sample_year_first_secondary\":1947,\"reported_sample_year_last_secondary\":2010}",
   "sources": [
    {
     "title": "WeightTraining.nz, 'Casey Butt Calculator' (secondary; gives the imperial formula with 22.667/17.01 and the metric form with 322.4/241.9)",
     "url": "https://weighttraining.nz/cb_calculator.php"
    },
    {
     "title": "Fitmatic, 'Maximum Muscular Potential Calculator by Casey Butt' (secondary; constants 22.6670/17.0104, measuring sites, '~300 natural bodybuilding champions spanning from 1947 to 2010')",
     "url": "https://www.fitmatic.com/body/calculators/maximum-muscular-potential"
    },
    {
     "title": "McDonald L. 'Four Models for Genetic Muscular Potential', BodyRecomposition, 2009, updated 2020 (Butt-calculator outputs table, image)",
     "url": "https://bodyrecomposition.com/muscle-gain/whats-my-genetic-muscular-potential"
    },
    {
     "title": "McDonald's Butt-model table image (5'8\"/5'10\"/6'0\": 189/198/206 lb at 10% fat; LBM 170/178/185 lb)",
     "url": "https://bodyrecomposition.com/wp-content/uploads/2009/06/Screen-Shot-2020-03-29-at-8.40.51-PM.png"
    },
    {
     "title": "Bony to Beastly, 'Natural Muscular Potential Calculator' (secondary; says it uses the 4th edition of Butt's book 'Your Muscular Potential')",
     "url": "https://bonytobeastly.com/maximum-muscular-potential-calculator/"
    },
    {
     "title": "Butt's original site (fetched; now redirects to a domain-parking service, router.parklogic.com)",
     "url": "http://www.weightrainer.net/potential.html"
    },
    {
     "title": "ANSUR II Measurer's Handbook (Hotzman et al. 2011, NATICK/TR-11/017), sec. 6.4.5 Ankle Circumference and 6.4.93 Wrist Circumference",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR11-017.pdf"
    },
    {
     "title": "ANSUR II male CSV (repo copy at build-calculator/data/ansur2/; see builds.json ansur2_dataset)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "The formula, as the two secondary calculators give it (the primary pages could not be reached): M = H^1.5 x (sqrt(W)/22.6670 + sqrt(A)/17.0104) x (F/224 + 1). M is maximum lean body mass in lb; H is height, W wrist and A ankle, all in inches; F is the body-fat % at which the mass is wanted. weighttraining.nz rounds the constants to 22.667 and 17.01, and gives a metric form (cm, kg) with 322.4 and 241.9.\n\nCheck: the formula reproduces to the pound the three outputs of Butt's own calculator that McDonald published (7 in wrist, 8.75 in ankle, 10% fat: LBM 170, 178 and 185 lb at 5'8 … [2,435 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
  },
  {
   "key": "butt_max_girth_equations",
   "label": "Casey Butt's 'maximum muscular measurements' equations (chest, arm, forearm, neck, thigh, calf at about 10% fat): a per-body-part maximum, not one physique",
   "status": "reported",
   "values": "{\"chest_wrist_coef\":1.625,\"chest_ankle_coef\":1.3682,\"chest_height_coef\":0.3562,\"biceps_wrist_coef\":1.1709,\"biceps_height_coef\":0.1350,\"forearm_wrist_coef\":0.950,\"forearm_height_coef\":0.1041,\"neck_wrist_coef\":1.1875,\"neck_height_coef\":0.1301,\"thigh_ankle_coef\":1.4737,\"thigh_height_coef\":0.1918,\"calf_ankle_coef\":0.9812,\"calf_height_coef\":0.1250,\"bodyfat_pct_approx\":10,\"example_180cm_chest_cm\":124.8,\"example_180cm_biceps_cm\":45.1,\"example_180cm_forearm_cm\":35.6,\"example_180cm_neck_cm\":44.6,\"example_180cm_thigh_cm\":68.7,\"example_180cm_calf_cm\":45.3,\"example_wrist_cm\":17.8,\"example_ankle_cm\":23.2,\"largest_natural_arm_to_wrist_ratio\":2.53,\"largest_natural_arm_to_height_ratio\":0.27}",
   "sources": [
    {
     "title": "Butt C. 'Maximum Drug-Free Bodybuilding Potential, ed. 1.0' (The WeighTrainer), full-text repost on Canadian Brawn forum, 21 Nov 2018 (original site offline)",
     "url": "https://canadianbrawn.com/threads/maximum-drug-free-bodybuilding-potential-ed-1-0-by-casey-butt-ph-d.1377/"
    }
   ],
   "notes": "Read as a full-text forum repost (header 'The WeighTrainer ... by Casey Butt, Ph.D.') because the original site is offline. Treat it as reported.\n\n'Maximum Muscular Measurements (at approx. 10% body fat)', in inches:\n- chest = 1.625W + 1.3682A + 0.3562H\n- biceps = 1.1709W + 0.1350H\n- forearms = 0.950W + 0.1041H\n- neck = 1.1875W + 0.1301H\n- thighs = 1.4737A + 0.1918H\n- calves = 0.9812A + 0.1250H\nW is the wrist 'measured on the hand side of the styloid process', A the ankle 'at the smallest point', H the height. Measuring sites: chest relaxed, tape under the armpits; biceps … [1,394 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
  },
  {
   "key": "berkhan_height_minus_100",
   "label": "Martin Berkhan's rule: height in cm minus 100 = stage weight in kg at 5-6% fat (a coach's rule from about four men)",
   "status": "reported",
   "values": "{\"offset_at_180cm\":100,\"offset_at_160cm\":98,\"offset_at_170cm\":99,\"offset_at_190cm\":101,\"bodyfat_pct_low\":5,\"bodyfat_pct_high\":6,\"example_height_cm\":180,\"example_weight_kg\":80,\"example_weight_lb\":176,\"ffm_180cm_kg_low\":75.2,\"ffm_180cm_kg_high\":76.0,\"ffmi_180cm_kg_m2_low\":23.2,\"ffmi_180cm_kg_m2_high\":23.5,\"S_160cm_low\":25.6,\"S_160cm_high\":25.9,\"S_190cm_low\":22.0,\"S_190cm_high\":22.2,\"own_data_points\":4,\"own_data_ffmi_low_kg_m2\":23.0,\"own_data_ffmi_high_kg_m2\":23.5,\"stage_water_drop_pct\":2,\"valid_height_low_cm\":170,\"valid_height_high_cm\":190}",
   "sources": [
    {
     "title": "Berkhan M. 'Maximum Muscular Potential of Drug-Free Athletes (Updated Dec 31st)', Leangains, 28 Dec 2010",
     "url": "https://leangains.com/maximum-muscular-potential-of-drug-free-athletes/"
    },
    {
     "title": "McDonald L. 'Four Models for Genetic Muscular Potential' (Berkhan model table, image)",
     "url": "https://bodyrecomposition.com/wp-content/uploads/2009/06/Screen-Shot-2020-03-29-at-8.46.20-PM.png"
    }
   ],
   "notes": "Berkhan: '(Height in centimeters - 100) = Body weight in kilo (\"shredded\", i.e. 5-6% body fat). Example: If your height is 180 cm (5'11), subtract 100 and you get 80. 80 kg (176 lbs) is your maximum muscular potential when you are in peak condition'. His basis: 'a formula based on the heights and body weights of natural bodybuilders on competition day' and 'I've only known a handful of guys who I was 100% sure of being natural. They all abide by this rule.'\n\nHis data points, with body fat 'estimated':\n- Marcus: 181 cm, 79 kg, 4-4.5%.\n- Andreaz: 169 cm, 69-71 kg, 5-6%.\n- Rob … [1,096 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
  },
  {
   "key": "mcdonald_rate_of_gain_model",
   "label": "Lyle McDonald's rate-of-gain model (a rate, not a ceiling; based on experience)",
   "status": "reported",
   "values": "{\"year1_gain_lb_low\":20,\"year1_gain_lb_high\":25,\"year1_gain_kg_low\":9.1,\"year1_gain_kg_high\":11.3,\"year2_gain_lb_low\":10,\"year2_gain_lb_high\":12,\"year3_gain_lb_low\":5,\"year3_gain_lb_high\":6,\"year4_gain_lb_low\":2,\"year4_gain_lb_high\":3,\"career_total_lb_low\":40,\"career_total_lb_high\":50,\"career_total_kg_low\":18,\"career_total_kg_high\":23,\"example_start_lbm_lb\":130,\"example_end_lbm_lb_low\":170,\"example_end_lbm_lb_high\":180}",
   "sources": [
    {
     "title": "McDonald L. 'Four Models for Genetic Muscular Potential', BodyRecomposition, posted 19 Jun 2009, updated 7 Jun 2020",
     "url": "https://bodyrecomposition.com/muscle-gain/whats-my-genetic-muscular-potential"
    },
    {
     "title": "McDonald's 'Rates of Muscular Gain in Males' table (image)",
     "url": "https://bodyrecomposition.com/wp-content/uploads/2009/06/Screen-Shot-2020-03-29-at-8.25.48-PM.png"
    }
   ],
   "notes": "His table: year 1 '1.5-2 lbs' a month and '20-25 lbs' a year; year 2 '1 lb' and '10-12 lbs'; year 3 '0.5 lb' and '5-6 lbs'; year 4 'Irrelevant' and '2-3 lbs'.\n\nText: 'if you total up those values, you get a gain of roughly 40-50 pounds of total muscle mass over a lifting career'. His example goes from 130 lb of lean mass to '170-180 pounds of lean body mass after 4-5 years of proper training'.\n\nBasis: 'I'm not sure if I came up with this idea on my own or stole it from somewhere else'; 'Mine and Alan's are based on years of experience in the field.'\n\nIt has no height or frame term, so it cannot be placed on the chart without assuming a starting mass and a height. Evidence quality: very low (expert opinion). Not a chart anchor."
  },
  {
   "key": "aragon_helms_rate_of_gain_model",
   "label": "Aragon/Helms rate-of-gain guidance (percent of body weight per month by training age; a rate, not a ceiling)",
   "status": "reported",
   "values": "{\"beginner_pct_bw_per_month_low\":1.0,\"beginner_pct_bw_per_month_high\":1.5,\"intermediate_pct_bw_per_month_low\":0.5,\"intermediate_pct_bw_per_month_high\":1.0,\"advanced_pct_bw_per_month_low\":0.25,\"advanced_pct_bw_per_month_high\":0.5,\"aragon_novice_lb_per_year_low\":15,\"aragon_novice_lb_per_year_high\":20,\"aragon_novice_kg_per_year_low\":6.8,\"aragon_novice_kg_per_year_high\":9.1,\"aragon_novice_years\":3,\"aragon_advanced_after_years\":4,\"aragon_lb_per_month_low\":1,\"aragon_lb_per_month_high\":2}",
   "sources": [
    {
     "title": "McDonald L. 'Four Models for Genetic Muscular Potential' (Aragon/Helms table, image)",
     "url": "https://bodyrecomposition.com/wp-content/uploads/2009/06/Screen-Shot-2020-03-29-at-8.32.30-PM.png"
    },
    {
     "title": "Aragon A. 'Interviewed by Wisconsin's Polytechnic University', alanaragonblog.com, 14 Dec 2011",
     "url": "https://www.alanaragonblog.com/2011/12/14/interviewed-by-wisconsins-polytechnic-university/"
    }
   ],
   "notes": "McDonald's 'Aragon/Helms Model': beginner '1-1.5% bodyweight/month', intermediate '0.5-1%', advanced '0.25-0.5%'. He says it 'was developed by Alan Aragon, Eric Helms or both'. I did not find the percentage table in a primary Aragon or Helms source.\n\nAragon in his own words (2011): 'For a 19 year-old who's just starting out, putting on 15-20 pounds of muscle per year in the first 2-3 years of consistent training is a very respectable accomplishment. Gains in the advanced stages (more than about 4 years of consistent progressive training as an adult) will typically slow down to half of that rate, at best'; and 'For muscle gain, roughly 1-2 pounds a month is plenty.'\n\nThis is rate guidance based on experience and not peer-reviewed. It has no height or frame term and is not a chart anchor."
  },
  {
   "key": "kondo1994_sumo_ffm_upper_limit",
   "label": "Kondo et al. 1994: largest measured fat-free mass, 121.3 kg in a 1.86 m sumo wrestler at 33% fat; proposed limit 0.7 kg of FFM per cm of height",
   "status": "measured",
   "values": "{\"n_sumo\":37,\"n_bodybuilders\":14,\"n_untrained\":26,\"sumo_mean_fat_pct\":26.1,\"bodybuilders_mean_fat_pct\":10.9,\"untrained_mean_fat_pct\":12.1,\"sumo_over_100kg_ffm\":6,\"max_ffm_kg\":121.3,\"max_ffm_height_m\":1.86,\"max_ffm_mass_kg\":181,\"max_ffm_fat_pct\":33.0,\"elite_ffm_per_height_mean_kg_per_cm\":0.61,\"elite_ffm_per_height_max_kg_per_cm\":0.66,\"proposed_limit_kg_per_cm\":0.70,\"max_case_ffmi_kg_m2\":35.1,\"max_case_S\":33.9,\"max_case_kouri_normalized\":34.7,\"limit_at_180cm_ffm_kg\":126.0,\"limit_at_180cm_ffmi_kg_m2\":38.9,\"limit_at_175cm_S\":41.1,\"limit_at_185cm_S\":36.8,\"kanehisa1998_sumo_ffm_min_kg\":59.1,\"kanehisa1998_sumo_ffm_max_kg\":107.6}",
   "sources": [
    {
     "title": "Kondo M, Abe T, Ikegawa S, Kawakami Y, Fukunaga T. Upper limit of fat-free mass in humans: A study on Japanese Sumo wrestlers. Am J Hum Biol 1994;6(5):613-618, doi:10.1002/ajhb.1310060509 (Europe PMC abstract, PMID 28548340)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:28548340%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Kanehisa H et al. Body composition and isokinetic strength of professional Sumo wrestlers. Eur J Appl Physiol 1998;77:352-359 (Europe PMC abstract, PMID 9562364)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:9562364%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Midorikawa T et al. High REE in Sumo wrestlers attributed to large organ-tissue mass. Med Sci Sports Exerc 2007;39:688-693 (Europe PMC abstract, PMID 17414807)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:17414807%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "The journal is Am J Hum Biol 6(5):613-618, not J Am Coll Nutr as the task named it; Europe PMC and the DOI agree. I read the abstract only (Wiley paywall; Semantic Scholar lists no open copy).\n\nAbstract: '37 professional Japanese Sumo wrestlers, 14 highly trained bodybuilders, and 26 untrained men were investigated for body composition (fat mass and FFM) and cross-sectional areas (CSA) of limb muscles, by hydrodensitometry and ultrasound'. 'Six of the wrestlers had more than 100 kg of FFM, including the largest one of 121.3 kg (stature: 186 cm, mass: 181 kg, %fat: 33.0%). The FF … [1,031 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
  },
  {
   "key": "hattori1999_sumo_ffmi",
   "label": "Hattori et al. 1999: sumo FFMI cut-off near 30 separating top-division (Sekitori) wrestlers; mean 26.6 and maximum about 37 as cited by Trexler",
   "status": "measured",
   "values": "{\"n_sumo\":36,\"n_students\":39,\"sumo_mean_mass_kg\":117.1,\"sumo_mean_bmi\":36.5,\"sumo_mean_fat_pct\":26.2,\"sekitori_ffmi_cutoff_kg_m2\":30,\"mean_ffmi_cited_by_trexler_kg_m2\":26.6,\"max_ffmi_cited_by_trexler_kg_m2\":37,\"cutoff_S_at_175cm\":30.9,\"cutoff_S_at_180cm\":30.0,\"cutoff_S_at_185cm\":29.2,\"cutoff_S_at_190cm\":28.4}",
   "sources": [
    {
     "title": "Hattori K, Kondo M, Abe T, Tanaka S, Fukunaga T. Hierarchical differences in body composition of professional Sumo wrestlers. Ann Hum Biol 1999;26(2):179-184 (Europe PMC abstract, PMID 10195655)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:10195655%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Trexler ET et al. 2017, J Strength Cond Res, PMC full text (cites Hattori's mean and maximum)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5438288/"
    }
   ],
   "notes": "Abstract: 'The body composition of 36 professional Sumo wrestlers and 39 collegiate male students were assessed densitometrically. The means of body weight, BMI and %fat for Sumo wrestlers were 117.1 kg, 36.5 and 26.2%'; 'The cut-off point of fat-free mass index which divided Sekitori wrestlers from other wrestlers is approximately 30'.\n\nTrexler 2017 cites this paper: 'research in Sumo wrestlers (11) has documented a mean FFMI Raw value of 26.6 kg·m−2, with individual values as high as 37'. That is secondary; I did not see Hattori's full text.\n\nThe index is plain FFM/height^2. Heights are not in the abstract, and drug testing is not mentioned. S for FFMI 30: 30.9 at 1.75 m, 30.0 at 1.80 m, 29.2 at 1.85 m. These are high-fat men, so the obesity caveat applies."
  },
  {
   "key": "abe2018_skeletal_muscle_upper_limit",
   "label": "Abe et al. 2018: 95 large athletes; largest FFM 120.2 kg; FFMI levels off above about 90 kg body mass; skeletal-muscle index plateau about 17 kg/m2",
   "status": "measured",
   "values": "{\"n_athletes\":95,\"n_controls\":48,\"ultrasound_sites\":9,\"athletes_over_100kg_ffm\":10,\"max_ffm_kg\":120.2,\"athletes_over_50kg_sm\":7,\"max_sm_kg\":59.3,\"ffmi_pct_above_controls\":44,\"smi_pct_above_controls\":56,\"ffmi_plateau_body_mass_kg\":90,\"smi_plateau_kg_m2\":17,\"smi_plateau_body_mass_kg\":120,\"moreno2024_bodybuilder_max_smi_kg_m2\":17.9}",
   "sources": [
    {
     "title": "Abe T, Buckner SL, Dankel SJ, Jessee MB, Mattocks KT, Mouser JG, Loenneke JP. Skeletal muscle mass in human athletes: What is the upper limit? Am J Hum Biol 2018;30(3):e23102 (Europe PMC abstract, PMID 29356191)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:29356191%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Moreno EN, Hammert WB, Montgomery TR, Abe T, Loenneke JP, Buckner SL. Skeletal muscle mass in competitive physique-based athletes: a case series. Am J Hum Biol 2024;36(1):e23978 (Europe PMC abstract, PMID 37563889)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:37563889%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract only (Wiley paywall; ResearchGate returned 403; Semantic Scholar lists it as closed).\n\nAbstract: 'Ninety-five large-sized male athletes and 48 recreationally active males (control) had muscle thickness measured by ultrasound at nine sites ... SM was estimated from an ultrasound-derived prediction equation. Body density was estimated by hydrostatic weighing technique'. 'Ten of the athletes had more than 100 kg of FFM, including the largest who had 120.2 kg, while seven of the athletes had more than 50 kg of SM, including the largest who had 59.3 kg.' 'The FFM index incre … [933 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
  },
  {
   "key": "abe2020_ffm_plateau_review",
   "label": "Abe et al. 2020 review: in 2,249 elite male athletes (DXA), FFM levels off above about 120 kg body mass; under 10% fat is rare above 100 kg",
   "status": "reported",
   "values": "{\"n_studies\":18,\"n_athletes\":2249,\"n_data_points\":72,\"ffm_plateau_body_mass_kg\":120,\"low_fat_rare_above_body_mass_kg\":100,\"low_fat_threshold_pct\":10}",
   "sources": [
    {
     "title": "Abe T, Bell ZW, Wong V, Spitz RW, Loenneke JP. Why is low body fat rarely seen in large-sized male athletes? Am J Hum Biol 2020;32(6):e23399 (Europe PMC abstract, PMID 32022361)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:32022361%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'Eighteen studies estimated body composition in elite athletes by dual-energy X-ray absorptiometry, totaling 2249 elite male athletes and 72 data points.' 'low body fat (eg, less than 10% body fat) was rarely seen in large-sized male athletes over 100 kg body mass. The larger the body mass, the higher the fat-free mass, with fat-free mass leveling off when body mass exceeds approximately 120 kg.'\n\nThe review works on group means (data points), not individuals. Drug status is not discussed in the abstract. It supports describing the measured upper tail as a soft plateau that comes with rising body fat."
  },
  {
   "key": "trexler2017_ffmi_fulltext_check",
   "label": "Trexler et al. 2017 (checks builds.json ffmi_athletes): NCAA football, DXA, 97.5th percentile 28.1, max 31.7; random NCAA testing but none by the study",
   "status": "measured",
   "values": "{\"n\":235,\"height_cm\":184.7,\"height_sd_cm\":6.9,\"mass_kg\":103.6,\"mass_sd_kg\":20.1,\"bodyfat_pct\":19.8,\"bodyfat_sd_pct\":7.4,\"ffmi_adj_mean_kg_m2\":23.7,\"ffmi_adj_sd_kg_m2\":2.1,\"ffmi_adj_p97_5_kg_m2\":28.1,\"ffmi_adj_max_kg_m2\":31.7,\"ffmi_adj_min_kg_m2\":19.0,\"n_over_25\":62,\"pct_over_25\":26.4,\"n_over_p97_5\":6,\"height_slope_kg_m3\":2.943,\"slope_r\":0.13,\"slope_p\":0.16,\"mean_abs_adjustment_kg_m2\":0.20,\"max_adjustment_kg_m2\":0.62,\"OL_mean_kg_m2\":25.1,\"DL_mean_kg_m2\":25.2,\"max_S_if_180cm\":31.7,\"max_S_if_195cm\":29.7,\"p97_5_S_at_mean_height\":27.5}",
   "sources": [
    {
     "title": "Trexler ET, Smith-Ryan AE, Blue MNM, et al. Fat-Free Mass Index in NCAA Division I and II Collegiate American Football Players. J Strength Cond Res 2017;31(10):2719-2727, PMC5438288 full text",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5438288/"
    },
    {
     "title": "Europe PMC abstract, PMID 27930454",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:27930454%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Every Trexler number already in builds.json ffmi_athletes is confirmed in the full text. New here:\n- Drug testing: 'Although NCAA athletes are subject to random, year-round drug testing, independent drug testing was not conducted in this study.'\n- FFMI = (LM + BMC)/Height^2 from DXA (Lunar iDXA and Hologic).\n- Height adjustment: 'Raw FFMI was regressed against height, using only cases in which FFMI values were above the median ... FFMIAdj = FFMI + (Slope)·(1.8 - Subject Height)'. The slope was 2.943, 'not significantly different from zero (r = 0.13; p = 0.16)'. The adjustment c … [933 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
  },
  {
   "key": "currier2019_ffmi_check",
   "label": "Currier et al. 2019 (checks builds.json ffmi_athletes): 209 male college athletes, DXA, 97.5th-percentile 'natural upper limit' 28.3 (all) and 29.1 (rugby); drug status not stated",
   "status": "measured",
   "values": "{\"n\":209,\"n_sports\":10,\"height_cm\":182.9,\"height_sd_cm\":6.7,\"mass_kg\":90.8,\"mass_sd_kg\":16.8,\"bodyfat_pct\":15.6,\"bodyfat_sd_pct\":5.3,\"ffmi_adj_mean_kg_m2\":22.8,\"ffmi_adj_sd_kg_m2\":2.8,\"football_mean_kg_m2\":24.28,\"football_sd_kg_m2\":2.39,\"water_polo_mean_kg_m2\":20.68,\"p97_5_all_kg_m2\":28.32,\"p97_5_rugby_kg_m2\":29.1,\"p97_5_baseball_kg_m2\":25.5,\"p97_5_all_S_at_mean_height_approx\":28.0,\"p97_5_rugby_S_at_mean_height_approx\":28.7}",
   "sources": [
    {
     "title": "Currier BS, Harty PS, Zabriskie HA, et al. Fat-Free Mass Index in a Diverse Sample of Male Collegiate Athletes. J Strength Cond Res 2019;33(6):1474-1479 (Europe PMC abstract, PMID 30985525)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:30985525%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Same article, publisher abstract page (Ovid; full text paywalled)",
     "url": "https://www.ovid.com/jnls/nsca-jscr/abstract/10.1519/jsc.0000000000003158~fat-free-mass-index-in-a-diverse-sample-of-male-collegiate"
    }
   ],
   "notes": "Abstract: '209 male collegiate athletes from 10 sports (baseball, cross country, football, golf, ice hockey, weightlifting, rugby, swimming, track and field, and water polo)'; 'measured using dual-energy x-ray absorptiometry. Linear regression was used to adjust for height, and the FFMIAdj natural upper limit was determined by calculating the 97.5th percentile of all values.' 'The FFMIAdj upper limit was calculated for all athletes (28.32 kg·m−2), rugby (29.1 kg·m−2), and baseball (25.5 kg·m−2).'\n\nThe 'upper limit' is the authors' name for a 97.5th percentile. It is not a ceiling; 2.5% of their own men exceed it.\n\nNot in the abstract: the regression slope, the reference height (presumably 1.8 m), the maximum value and any drug testing.\n\nS at the mean height of 1.829 m: 27.9-28.1 for all athletes and 28.6-28.8 for rugby, depending on the unknown slope (0 to 6.1). This is approximate."
  },
  {
   "key": "santos2014_drug_tested_athletes_ffmi",
   "label": "Santos et al. 2014: DXA FFMI percentiles in athletes who had to test negative for performance-enhancing drugs; highest 95th percentile 25.8 (rugby)",
   "status": "measured",
   "values": "{\"n_men_dxa\":339,\"men_mean_ffmi_kg_m2\":19.78,\"men_mean_ffmi_ci_low\":19.56,\"men_mean_ffmi_ci_high\":20.00,\"men_mean_height_cm\":179.3,\"rugby_n_dxa\":39,\"rugby_mean_ffmi_kg_m2\":21.33,\"rugby_p95_ffmi_kg_m2\":25.79,\"rugby_p95_ci_low\":23.54,\"rugby_p95_ci_high\":28.71,\"rugby_mean_height_cm\":182.8,\"wrestling_judo_p95_ffmi_kg_m2\":24.60,\"handball_p95_ffmi_kg_m2\":23.64,\"rugby_p95_S_at_mean_height\":25.4}",
   "sources": [
    {
     "title": "Santos DA, Dawson JA, Matias CN, et al. Reference values for body composition and anthropometric measurements in athletes. PLoS One 2014;9(5):e97846 (Europe PMC full text, PMC4022746)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4022746/fullTextXML"
    },
    {
     "title": "Same, supplementary file S2, Table 7 'Whole-body fat-free mass index (kg/m2) percentiles by sport and sex'",
     "url": "https://journals.plos.org/plosone/article/file?type=supplementary&id=10.1371/journal.pone.0097846.s002"
    }
   ],
   "notes": "Inclusion criteria (methods): '1) in at least Tanner stage V ..., 2) 10 or more hours of training per week, 3) negative test outcomes for performance-enhancing drugs, and 4) not taking any medications.' DXA was done in season, at the Faculty of Human Kinetics in Lisbon with the Portuguese Institute of Sport.\n\nTable 5: the mean FFMI of all 339 men was 19.78 (95% CI 19.56-20.00); rugby 21.33 (n = 39).\n\nSupplementary Table 7 gives Bayesian-smoothed percentiles. The male 95th percentiles are: rugby 25.79 (CI 23.54-28.71), wrestling/judo 24.60, handball 23.64, soccer 23.47, volleyball 23.31.\n\nThe index is plain FFM/height^2, not height-normalised. The rugby 95th percentile at the rugby mean height of 1.828 m is S of about 25.4.\n\nThis is the only paper I found whose inclusion criteria required a negative drug test. Its upper tail (95th percentile about 26) sits right at Kouri's 25. These are sport athletes, not physique athletes."
  },
  {
   "key": "natural_limit_anchor_conversions",
   "label": "Natural-limit anchors converted to the rescaled index S = 1.8*FFM/H^3, with the conversion rules",
   "status": "derived",
   "values": "{\"rule_reference_height_m\":1.8,\"kouri_k_kg_m3\":6.1,\"trexler_k_kg_m3\":2.943,\"kouri_limit_S_at_160cm\":26.8,\"kouri_limit_S_at_165cm\":26.3,\"kouri_limit_S_at_170cm\":25.8,\"kouri_limit_S_at_175cm\":25.4,\"kouri_limit_S_at_180cm\":25.0,\"kouri_limit_S_at_185cm\":24.6,\"kouri_limit_S_at_190cm\":24.3,\"kouri_limit_S_at_195cm\":23.9,\"kouri_limit_S_at_200cm\":23.6,\"kouri_shortest_nonuser_S\":26.6,\"kouri_tall_nonuser_S\":23.7,\"kouri_mr_america_mean_S\":25.8,\"kouri_mr_america_max_S\":29.2,\"todd_mr_america_mean_S\":26.8,\"todd_mr_america_max_S\":32.5,\"butt_180cm_median_frame_S_5pct\":25.1,\"butt_180cm_median_frame_S_10pct\":25.7,\"butt_180cm_frame_range_S_low\":24.1,\"butt_180cm_frame_range_S_high\":26.9,\"berkhan_180cm_S_low\":23.2,\"berkhan_180cm_S_high\":23.5,\"chappell_natural_pros_S\":25.4,\"rossow_case_S_if_180cm\":24.9,\"santos_rugby_p95_S\":25.4,\"trexler_p97_5_S_at_180cm\":28.1,\"trexler_p97_5_S_at_mean_height\":27.5,\"trexler_max_S_at_180cm\":31.7,\"trexler_max_S_at_195cm\":29.7,\"currier_p97_5_all_S\":28.0,\"currier_p97_5_rugby_S\":28.7,\"hattori_sekitori_cutoff_S_at_180cm\":30.0,\"kondo_max_S\":33.9,\"kondo_max_plain_ffmi\":35.1,\"kondo_proposed_limit_S_at_180cm\":38.9,\"kouri_modern_bb_mean_S_at_180cm_approx\":31.5,\"kouri_modern_bb_max_S_at_180cm_approx\":39.5}",
   "sources": [
    {
     "title": "Kouri et al. 1995 full text (k = 6.1; reference height 1.8 m)",
     "url": "https://www.ovid.com/jnls/cjsportsmed/pdf/00042752-199510000-00003~fat-free-mass-index-in-users-and-nonusers-of"
    },
    {
     "title": "Trexler et al. 2017 full text (k = 2.943)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5438288/"
    },
    {
     "title": "Todd 2008 (heights used for the Mr America conversion)",
     "url": "https://starkcenter.org/igh/igh-v10/igh-v10-n3/igh1003p03.pdf"
    },
    {
     "title": "Chappell, Simper & Helms 2019, Table 1 (builds.json chappell2019_natural_pro_bodybuilders)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6704518/fullTextXML"
    }
   ],
   "notes": "Rules:\n- Plain FFMI F = FFM/H^2. S = 1.8*FFM/H^3 = 1.8F/H.\n- A height-normalised index N = F + k(1.8 - H), with k = 6.1 (Kouri) or 2.943 (Trexler).\n- At exactly H = 1.80 m, F = N = S. A value 'normalised to 1.8 m' is therefore already on the chart's basis for a 1.80 m man.\n- For a real person at another height: F = N - k(1.8 - H), then S = 1.8F/H.\n- A sample statistic (mean, percentile, maximum) without individual heights can be converted only roughly, at the sample's mean height; I flag those as approximate.\nScripts: scratchpad scripts/anchor_conversions.py, kouri_t2_S.py, todd_table.py, frame_models.py, butt_ansur.py.\n\nScaling mismatch: S assumes FFM grows as H^3 (same shape). Kouri's elite non-users implied about H^2.44, and Butt's formula about H^1.5 x frame. So on S, short naturals score higher and tall ones lower. Kouri's 1.59 m non-user (FFMI 23.5) is S 26.6, while his 1.93 m non-user (25.4) is S 23.7. The Kouri 25 line runs from S 26.3 at 1.65 m to 23.9 at 1.95 m.\n\nItems from existing keys:\n- Chappell 2019 PROs: 1.77 m, 82.3 kg end of prep (self-reported), 5% fat assumed; FFMI 25.0, S 25.4.\n- Rossow 2013: FFMI 24.9, height unknown, so S is 24.9 only if 1.80 m (23.6 at 1.90 m, 26.4 at 1.70 m).\n- Kouri's modern bodybuilders: S given at the 1.80 m basis from the normalised values; heights not printed."
  },
  {
   "key": "builds_json_kouri_corrections",
   "label": "Corrections to existing builds.json keys found by reading the Kouri 1995 full text",
   "status": "derived",
   "values": "{\"kouri_k_methods_kg_m3\":6.1,\"kouri_k_abstract_kg_m3\":6.3,\"nonusers_bodyfat_pct\":12.5,\"nonusers_bodyfat_sd_pct\":5.5,\"users_bodyfat_pct\":12.8,\"users_bodyfat_sd_pct\":4.8,\"users_ffmi_table1_kg_m2\":24.8,\"nonusers_ffmi_table1_kg_m2\":21.8,\"users_top_bin_low_kg_m2\":31.0,\"users_top_bin_high_kg_m2\":31.9,\"mr_america_pope_fat_low_pct\":6,\"mr_america_pope_fat_high_pct\":16,\"modern_bb_assumed_fat_pct\":5}",
   "sources": [
    {
     "title": "Kouri et al. 1995 full text, publisher's free PDF",
     "url": "https://www.ovid.com/jnls/cjsportsmed/pdf/00042752-199510000-00003~fat-free-mass-index-in-users-and-nonusers-of"
    },
    {
     "title": "Todd 2008, Iron Game History 10(3) (Pope's recalled fat range)",
     "url": "https://starkcenter.org/igh/igh-v10/igh-v10-n3/igh1003p03.pdf"
    }
   ],
   "notes": "1. kouri1995_normalization_constant and ffmi_height_correction are both marked 'disputed'. The paper's methods give 'a slope of 6.1 kg/m3' and 'Normalized FFMI = FFMI + 6.1 x (1.8 - h)'; only the abstract prints 6.3. Change to resolved: 6.1, with a footnote that the abstract misprints 6.3. The practical effect is at most 0.05 units.\n\n2. human_ref_kouri_ffmi and kouri1995_ffmi_natural_limit give the normalisation as '6.3*(1.80 - h)'. Change to 6.1.\n\n3. kouri1995_ffmi_natural_limit.value_status and kouri1995_group_means say the Mr America FFMIs used an assumed 5% fat. Wrong: Pop … [1,027 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
  }
 ],
 "recommendations": "1. Don't draw a single \"natural limit\" line. Draw one soft band labelled \"Natural limit: no hard line\". Mark each anchor inside it by type, using these words: \"sample maximum\", \"estimate from photos\", \"prediction (formula)\", \"measured upper tail\". Never use \"ceiling\", or \"limit\" on its own. Values below are on the S scale. For a 1.80 m man, S equals plain FFMI and Kouri-normalised FFMI.\n\n2. Anchors to plot, in order of evidence quality:\n   a) Sample maximum (measured): 25, as a solid tick. Label: \"Kouri 1995: highest of 74 drug-free lifters (interview + … [3,472 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
 "gaps": "Kouri 1995:\n- The exact top non-user value is not printed. Fig. 2 places it between 24.0 and 24.9, and the text says \"<25.0\".\n- Individual non-user heights and FFMIs are not given.\n- Kouri's per-man heights, weights and body-fat estimates for the Mr Americas were never published (Todd 2008 says Pope confirmed this). Converting them to S used Todd's heights, which is an estimate.\n\nCasey Butt:\n- The primary pages (weightrainer.net) are dead: the domain is parked.\n- The Wayback Machine was blocked by the egress policy, and archive.ph reset the connection. The formula comes from … [2,218 more characters on this line; the full prompt is in prompts/ac4b723cde2bc025b.txt]
}
```

</details>

**Subagent `verify:fat`** · build-comparison-research · started 2026-10-11 04:35:54 UTC

- checks: 34 (22 ok, 12 not ok).
- Not OK: ansur2_men_bodyfat_from_army_equation; barakat2022_natural_pro_peak_week_dxa; robinson2015_natural_bb_skinfold (+9 more).
- Transcription is accurate. I re-fetched 16 full texts or PDFs (NCHS sr11250, the Army IG PDF, Liu, Taylor, Barakat, Robinson, Rosaci, Giakoni, Baggish, Hudson, Bulut, Buhl, Kaufman, Yu, Bosch, Martinez-Mireles) and 17 abstracts, plus the Army.mil article.

<details>
<summary>Prompt, verbatim (65,998 characters)</summary>

Workflow run `wf_94de1f40-a68`, phase `Verify`, agent `afa0192d0490b0d9e`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/afa0192d0490b0d9e.txt](prompts/afa0192d0490b0d9e.txt).

```text
Project: "Build Comparison", a chart that ranks male body builds by "muscle level" irrespective of height, from ordinary men through the limits of human possibility to the monstrous (comic characters, and two original 3 m characters, Rex and Ollie). Read /home/user/rex-strength-lab/build-comparison/BRIEF.md first (10 minutes): it states the decisions already made and the problems to solve.
The working score is FFMI after rescaling the body to 1.80 m at the same shape: S = 1.8 * FFM / H^3 (FFM = fat-free mass in kg, H = height in m), shown beside plain FFMI = FFM / H^2. A rough first pass gives: US Army median man about 24, Ronnie Coleman about 35-39, Eddie Hall about 38, the heaviest comic characters 57-81, Rex about 141 (tail excluded, height to crest). A solid ball of muscle as tall as the figure scores about 924.
The sister project /home/user/rex-strength-lab/build-calculator/ already holds 55 builds and 139 verified facts in data/builds.json (read its "facts" keys and labels before you start; do NOT re-research a fact that already exists there unless the brief needs a number it lacks, and say so when you rely on an existing key). ANSUR II CSVs are in /home/user/rex-strength-lab/build-calculator/data/ansur2/ (ANSUR_II_MALE_Public.csv, 4,082 men; values in mm and kg x10? check: weightkg is in tenths of kg, lengths in mm).
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent; a number is "sourced" only if you fetched the page or PDF and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher PDFs). Prefer primary or authoritative sources (journals, textbooks, government surveys, standards bodies, publisher handbooks); use fan sites or magazines only when nothing better exists, and label them so. Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". Write raw downloads and scripts under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
For each fact give: key (snake_case), label, status (measured | official | reported | derived | estimate | disputed), values (a JSON object as a string, SI units plus the original units), sources (title + URL actually fetched), and notes (what exactly the source says, its sample, caveats, how good the evidence is).

You are a skeptical fact-checker for the topic "fat". Below are the researcher's facts and recommendations. Re-fetch the cited URLs for every fact the chart is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, quotation and status against what the source actually says; recompute every derived number you can (re-run computations on the ANSUR II CSV where relevant). Mark ok=false with a correction for anything wrong, mislabelled (for example a fan wiki or a magazine marked official or measured; a sample maximum called a limit; a secondary summary presented as the primary paper), or unsupported. Also judge the recommendations: anything that overstates the evidence? List important missing items.

RESEARCH:
{
 "summary": "Body-fat ranges for each chart group and measured FFMI in steroid users, researched from primary sources (Europe PMC / NCBI full texts, CDC/NCHS PDF, an official Army fact sheet). Main findings:\n\n(1) Everyday men. NHANES 1999-2004 DXA, men aged 20+: median 28.0%, 5th-95th 17.4-38.0%. Ages 20-39: median 26.1%, 5th-95th 15.5-37.2%. NHANES 2011-18 means for men aged 20-59 are 25-29% depending on race and ethnicity. US soldiers: Taylor et al. 2024 (USARIEM) measured 1,261 representatively sampled active-duty men by DXA in 2021-22: 24.3 ± 6.3%. ANSUR II has no body fat, but the Army' … [2,290 more characters on this line; the full prompt is in prompts/afa0192d0490b0d9e.txt]
 "facts": [
  {
   "key": "nhanes_dxa_bodyfat_men_1999_2004",
   "label": "US men: DXA percent body fat percentiles by age (NHANES 1999-2004, NCHS Vital Health Stat 11(250))",
   "status": "measured",
   "values": "{\"method\":\"DXA, Hologic QDR 4500A fan-beam, Discovery software v12.1\",\"men_20plus_crude\":{\"n\":6559,\"mean\":28.0,\"se\":0.1,\"p5\":17.4,\"p10\":19.5,\"p15\":21.4,\"p25\":24.1,\"p50\":28.0,\"p75\":32.1,\"p85\":34.3,\"p90\":35.9,\"p95\":38.0},\"men_20plus_age_adjusted_mean\":28.1,\"men_20_39\":{\"n\":2183,\"mean\":26.1,\"p5\":15.5,\"p10\":17.4,\"p15\":18.9,\"p25\":21.2,\"p50\":26.1,\"p75\":30.4,\"p85\":32.8,\"p90\":34.6,\"p95\":37.2},\"men_40_59\":{\"n\":2024,\"mean\":28.6,\"p5\":19.3,\"p25\":25.2,\"p50\":28.5,\"p75\":32.2,\"p95\":37.7},\"men_60_79\":{\"n\":1851,\"mean\":30.8,\"p5\":22.0,\"p50\":30.7,\"p95\":39.6},\"unit\":\"percent of body mass\"}",
   "sources": [
    {
     "title": "Borrud LG, Flegal KM, Looker AC, Everhart JE, et al. Body composition data for individuals 8 years of age and older: U.S. population, 1999-2004. NCHS Vital Health Stat 11(250), 2010. Table 3 (PDF sha256 686bf1c5c0b3d4fb...)",
     "url": "https://www.cdc.gov/nchs/data/series/sr_11/sr11_250.pdf"
    }
   ],
   "notes": "Table 3, 'Total percentage body fat ... Male, All race and ethnicity': 'Age 20 years and older, crude ... 6,559 28.0 0.1 17.4 19.5 21.4 24.1 28.0 32.1 34.3 35.9 38.0'; '20-39 years ... 2,183 26.1 0.1 15.5 17.4 18.9 21.2 26.1 30.4 32.8 34.6 37.2'. Methods: people over 300 lb or taller than 6'5\" were not scanned ('physical limitations of the DXA table'). Missing or invalid scans were multiply imputed. 'Participant lean mass was decreased by 5% and an equivalent kilogram weight added to the fat mass', because the QDR 4500A was shown to underestimate fat (Schoeller et al.). The published %fat therefore already includes that correction. Weighted, nationally representative. Best primary source for 'everyday men'. Kelly, Wilson & Heymsfield 2009 (PLoS ONE, PMC2737140) uses the same NHANES DXA data. I fetched it, but its percentiles are in supplementary LMS files, so I used the NCHS tables instead."
  },
  {
   "key": "nhanes_dxa_bodyfat_men_2011_2018",
   "label": "US men aged 20-59: age-adjusted mean DXA body fat by race and ethnicity, NHANES 2011-18 (Liu et al. 2021, BMJ)",
   "status": "measured",
   "values": "{\"method\":\"DXA (NHANES 2011-18), ages 20-59 only\",\"n_both_sexes\":10864,\"men_age_adjusted_mean_pct\":{\"hispanic\":[27.8,28.6],\"nh_white\":[26.8,27.9],\"nh_black\":[24.9,25.5],\"nh_asian\":[25.5,28.2],\"other\":[26.4,28.3]},\"overall_both_sexes_pct\":[32.6,33.1],\"cycles\":\"2011-12, 2013-14, 2015-16, 2017-18 (ranges span the four cycles)\"}",
   "sources": [
    {
     "title": "Liu B, Du Y, Wu Y, Snetselaar LG, Wallace RB, Bao W. Trends in obesity and adiposity measures by race or ethnicity among adults in the United States 2011-18: population based study. BMJ 2021;372:n365, Table 3 (Europe PMC full text PMC7961695)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7961695/fullTextXML"
    }
   ],
   "notes": "Table 3 'Trends in age adjusted mean body fat percentage ... (n=10 864)', Men: Hispanic 27.8, 28.0, 28.4, 28.6; Non-Hispanic white 27.1, 27.9, 26.8, 27.2; Non-Hispanic black 25.0, 25.0, 24.9, 25.5; Non-Hispanic Asian 25.5, 26.7, 26.8, 28.2. 'Body fat percentage was available among adults aged 20-59 years.' Overall body fat was stable over 2011-18. The paper also says values were 'much higher' than 1999-2004. The DXA-ineligible share was small (0.1%). Table 3 has no all-race men figure, and I did not fetch the appendix. This confirms that the 1999-2004 NCHS percentiles are not out of date for men (about 25-29% means)."
  },
  {
   "key": "taylor2024_army_dxa_bodyfat",
   "label": "US Army active-duty men: DXA body fat in a representative sample (Taylor et al. 2024, USARIEM)",
   "status": "measured",
   "values": "{\"method\":\"DXA, GE Lunar iDXA\",\"cohort1_men_n\":1261,\"cohort1_height_cm\":176.3,\"height_sd\":7.1,\"cohort1_weight_kg\":85.9,\"weight_sd\":13.8,\"cohort1_BMI\":27.6,\"cohort1_bodyfat_dxa_pct\":24.3,\"bodyfat_dxa_sd\":6.3,\"cohort1_bodyfat_old_AR_tape_pct\":19.5,\"cohort1_fat_mass_kg\":21.5,\"cohort1_ffm_kg_as_tabled\":61.7,\"cohort2_men_n_from_race_counts\":753,\"cohort2_bodyfat_dxa_pct\":24.4,\"cohort2_sd\":6.9,\"male_1site_manual_equation_lb_in\":\"-27.05 + 2.06*abdomen_in - 0.12*weight_lb\",\"male_1site_manual_RMSE_pct_points\":3.35,\"male_old_AR_RMSE\":5.89,\"male_old_AR_bias\":-4.79,\"collection\":\"Oct 2021 - Dec 2022, four Army installations\"}",
   "sources": [
    {
     "title": "Taylor KM, Castellani MP, Bartlett PM, Oliver TE, McClung HL. Development and cross-validation of a circumference-based predictive equation to estimate body fat in an active population. Obes Sci Pract 2024;10(2):e747, Tables 1-4 (Europe PMC full text PMC11026907)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11026907/fullTextXML"
    }
   ],
   "notes": "Abstract: 'Body size and composition were evaluated in a representatively sampled cohort of 1904 active-duty Soldiers (1261 Males, 643 Females), using dual-energy X-ray absorptiometry'. Table 1, Men, Cohort 1: '% Body fatDXA 24.3 ± 6.3'; '% Body fatCIRC 19.5 ± 6.3' (the old AR 600-9 tape equation). Sampling was 'similar to those utilized in NHANES', with minorities oversampled. Cadets were excluded. The tabled FFM of 61.7 kg plus 21.5 kg fat is 83.2 kg, against a mean weight of 85.9 kg, so the 'fat-free mass' column probably excludes bone mineral (about 3 kg); treat it with care. Table 2 lists the male one-site manual equation (no height) as intercept -27.05, abdomen 2.06, weight -0.12, in inches and pounds judging by its closeness to the official equation. In the RMSE and bias tables the female column comes before the male one, which I inferred: the second column's old-AR bias of -4.79 matches the men's Table 1 difference of 19.5 - 24.3 = -4.8. This is the best measured body-fat value for US soldiers."
  },
  {
   "key": "army_one_site_tape_equation_2023",
   "label": "US Army one-site (navel waist) body-fat equation, Army Directive 2023-11 (as published in an official Army installation summary)",
   "status": "official",
   "values": "{\"men\":\"%BF = -26.97 - 0.12*weight_lb + 1.99*abdomen_in\",\"women\":\"%BF = -9.15 - 0.015*weight_lb + 1.27*abdomen_in\",\"site\":\"abdomen at the navel\",\"worked_example_men\":{\"abdomen_in\":35,\"weight_lb\":210,\"result_pct\":17.48},\"sole_authorized_tape_method_from\":\"2024-06-08\",\"SI_form_men\":\"%BF = -26.97 - 0.2646*weight_kg + 0.7835*abdomen_cm\"}",
   "sources": [
    {
     "title": "US Army Training Center & Fort Jackson Inspector General, 'IG Update 23-4: Guidance on Changes to Army Directive 2023-11 (Army Body Fat Assessment for the Army Body Composition Program)', FY23 Q4 (PDF sha256 236b7ad9...)",
     "url": "https://home.army.mil/jackson/download_file/view/84278f84-10a3-4177-a3bc-6d2f08ae7866/1016"
    },
    {
     "title": "Army.mil, 'Evolving body composition standards in the U.S. Army: a science-informed approach' (background; 2021 USARIEM study of 2,690 soldiers)",
     "url": "https://www.army.mil/article/273959/evolving_body_composition_standards_in_the_u_s_army_a_science_informed_approach"
    }
   ],
   "notes": "The PDF reads: 'The equation for men is: % body fat = -26.97 - (0.12 x body weight in pounds) + (1.99 x abdomen circumference in inches)', with the worked example 'Abdomen = 35 inches; Weight = 210 pounds ... = -52.17 + 69.65 = 17 % (actual number is 17.48%...)'. It also says 'Beginning 8 June 2024, one-site tape test method is the only authorized method.' I did not fetch AD 2023-11 itself. This is an official Army installation summary of it. The Army.mil article says the change came from a 2021 USARIEM study of 2,690 soldiers compared against DXA. Taylor 2024 (separate key) gives a nearly identical one-site equation with an RMSE of about 3.4 percentage points in men."
  },
  {
   "key": "ansur2_men_bodyfat_from_army_equation",
   "label": "ANSUR II men (n = 4,082): body fat estimated with the Army one-site equation from measured navel waist and weight, with the resulting FFMI and height-independent score",
   "status": "estimate",
   "values": "{\"n\":4082,\"equation\":\"AD 2023-11 men\",\"bodyfat_pct\":{\"mean\":24.1,\"sd\":5.7,\"p1\":13.1,\"p5\":15.2,\"p10\":16.6,\"p25\":19.7,\"p50\":24.0,\"p75\":28.1,\"p90\":31.4,\"p95\":33.5,\"p99\":37.5,\"min\":8.2,\"max\":48.6},\"bodyfat_pct_with_Taylor2024_1site\":{\"mean\":26.6,\"p5\":17.3,\"p50\":26.6,\"p95\":36.5},\"FFMI_kg_m2\":{\"p5\":17.5,\"p50\":20.8,\"p95\":24.3,\"p99\":25.8,\"max\":28.6},\"S_1p8FFM_over_H3\":{\"p5\":17.8,\"p50\":21.4,\"p95\":25.2,\"p99\":26.9,\"max\":30.4},\"inputs\":\"weightkg/10 -> lb; waistcircumference (mm, at omphalion) -> in; stature mm\"}",
   "sources": [
    {
     "title": "ANSUR II male public working database (repo copy, build-calculator/data/ansur2/ANSUR_II_MALE_Public.csv; provenance in existing key ansur2_dataset)",
     "url": "file:///home/user/rex-strength-lab/build-calculator/data/ansur2/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "Fort Jackson IG Update 23-4 (AD 2023-11 one-site equation)",
     "url": "https://home.army.mil/jackson/download_file/view/84278f84-10a3-4177-a3bc-6d2f08ae7866/1016"
    },
    {
     "title": "Taylor et al. 2024 Obes Sci Pract (PMC11026907)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11026907/fullTextXML"
    }
   ],
   "notes": "ANSUR II has no body-composition data (existing builds say 'unknown'). I computed these with the official equation, using ANSUR II's navel-level waist (same site as the Army abdomen tape) and scale weight. Script: scratchpad research/bodyfat/scripts/ansur_bf.py. Check: the equation's ANSUR II mean (24.1%) matches the measured DXA mean of 2021-22 soldiers (24.3%, Taylor 2024), though the equation was fitted to soldiers, so this is consistency, not proof. Taylor's own one-site coefficients give about 2.5 points more (mean 26.6%), so the method is uncertain by about that much. Individual error is about 3.4-4 points RMSE. The regression narrows the spread a little (predicted SD 5.7 vs measured 6.3). ANSUR II was measured in 2010-12 and the equation was fitted to 2021-22 soldiers. For the chart, the median ANSUR II man scores S ≈ 21 at these body fats. The brief's rough 'Army median about 24' implies about 15% fat, which is lower than measured soldiers."
  },
  {
   "key": "barakat2022_natural_pro_peak_week_dxa",
   "label": "Barakat et al. 2022: self-described professional natural bodybuilder, DXA each day of peak week to competition morning",
   "status": "measured",
   "values": "{\"n\":1,\"age_y\":29,\"method\":\"DXA (also 7-site ultrasound skinfold JP-7)\",\"bodyfat_dxa_pct\":{\"8_days_out\":5.5,\"6_days_out\":6.0,\"3_days_out\":6.2,\"2_days_out\":5.6,\"1_day_out\":5.4,\"competition_day\":6.3},\"competition_day_mass_kg\":73.55,\"competition_day_ffm_kg\":68.91,\"competition_day_fat_kg\":4.63,\"ultrasound_jp7_bodyfat_competition_day_pct\":3.6,\"height\":\"measured but not found in the text I parsed (unknown)\"}",
   "sources": [
    {
     "title": "Barakat C, Escalante G, Stevenson SW, Bradshaw JT, Barsuhn A, Tinsley GM, Walters J. Can Bodybuilding Peak Week Manipulations Favorably Affect Muscle Size, Subcutaneous Thickness, and Related Body Composition Variables? A Case Study. Sports 2022;10(7):106, Table 2 (Europe PMC full text PMC9321665)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC9321665/fullTextXML"
    }
   ],
   "notes": "Table 2 'Body Composition', DEXA: 'Competition Day | 73.55 | 6.3 | 4.63 | 68.91 | 2.591 | 66.32 | 3.6'. The subject is the first author: 'a Middle Eastern-American (29 years old ...) professional natural bodybuilder'. He placed first in Open Middleweight Bodybuilding and Classic Physique A (October 2021). Drug-free status is self-described, and the text I read does not say whether the show was tested. Daily DXA %fat moved by up to 0.9 points within 8 days as glycogen and water changed, which shows DXA noise at stage leanness. Ultrasound skinfolds (JP-7) read about 2-3 points lower than DXA."
  },
  {
   "key": "kistler2014_natural_bb_dxa",
   "label": "Kistler et al. 2014: natural bodybuilder, 26-week prep for a pro-qualifier, DXA monthly",
   "status": "measured",
   "values": "{\"n\":1,\"method\":\"DXA\",\"bodyfat_start_pct\":17.5,\"bodyfat_end_pct\":7.4,\"mass_start_kg\":88.6,\"mass_end_kg\":73.3,\"weeks\":26}",
   "sources": [
    {
     "title": "Kistler BM, Fitschen PJ, Ranadive SM, Fernhall B, Wilund KR. Case study: Natural bodybuilding contest preparation. Int J Sport Nutr Exerc Metab 2014;24(6):694-700 (PMID 24901578, abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:24901578%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'body composition was measured monthly by DXA ... Body weight (88.6 to 73.3 Kg ...) and percent body fat (17.5 to 7.4%) were reduced during preparation.' The 7.4% is the last monthly scan of prep, not necessarily contest day. The 17.5% start value is a useful natural off-season figure. Abstract only; height not given."
  },
  {
   "key": "schoenfeld2020_natural_bb_case",
   "label": "Schoenfeld et al. 2020: high-level amateur natural bodybuilder over 4 competitions, about 5% fat just before competing",
   "status": "measured",
   "values": "{\"n\":1,\"bodyfat_precontest_pct_approx\":5,\"methods\":\"multifrequency BIA and skinfolds (the abstract does not say which gave ~5%)\"}",
   "sources": [
    {
     "title": "Schoenfeld BJ, Alto A, Grgic J, et al. Alterations in body composition, resting metabolic rate, muscular strength, and eating behavior in response to natural bodybuilding competition preparation: a case study. J Strength Cond Res 2020;34(11):3124-3138 (PMID 33105363, abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:33105363%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'Body fat was reduced to very low levels (~5%) immediately before competition, but this corresponded with a loss of lean mass.' A 'high-level amateur natural male bodybuilder'. Field methods (BIA, skinfolds) tend to read low at this leanness. Abstract only."
  },
  {
   "key": "robinson2015_natural_bb_skinfold",
   "label": "Robinson et al. 2015: 21-year-old natural amateur bodybuilder, 14-week prep, skinfolds",
   "status": "measured",
   "values": "{\"n\":1,\"height_m\":1.785,\"start_mass_kg\":86.0,\"start_bodyfat_pct\":14,\"start_fat_kg\":11.7,\"start_ffm_kg\":74.3,\"mass_loss_kg\":11.7,\"fat_loss_kg\":6.7,\"ffm_loss_kg\":5.0,\"bodyfat_drop_points\":6.8,\"end_bodyfat_pct_derived\":7.2,\"start_FFMI_derived\":23.3,\"end_FFMI_derived\":21.7}",
   "sources": [
    {
     "title": "Robinson SL, Lambeth-Mansell A, Gillibrand G, Smith-Ryan A, Bannock L. A nutrition and conditioning intervention for natural bodybuilding contest preparation: case study. JISSN 2015;12:20, Table 2 and text (Europe PMC full text PMC4422265)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4422265/fullTextXML"
    }
   ],
   "notes": "Table 2 baseline: 'Height (cm) 178.5; Body mass (kg) 86.0; Body fat (%) 14; Fat mass (kg) 11.7; Fat-free mass (kg) 74.3'. Text: 'a reduction of 6.7 kg's (or 6.8% body fat or 33 mm using sum of 8 skinfolds) and 5.0 kg's, in fat mass and FFM'. Body fat came from skinfolds with sex- and race-specific equations (ISAK protocol). End %fat (about 7.2%) and the FFMIs are my derivations. Skinfold method, lower quality than DXA or 4C."
  },
  {
   "key": "mitchell2018_bodyfat_pct_derived",
   "label": "Mitchell et al. 2018: percent fat of 9 natural bodybuilders derived from their DXA fat and lean masses (relies on existing key mitchell2018_natural_bodybuilders)",
   "status": "derived",
   "values": "{\"PRE16_fat_over_fat_plus_lean_pct\":10.9,\"PRE1_fat_over_fat_plus_lean_pct\":7.0,\"PRE16_with_assumed_BMC_3p5kg_pct\":10.5,\"PRE1_with_assumed_BMC_3p5kg_pct\":6.6,\"inputs\":{\"fat_PRE16_kg\":8.8,\"fat_PRE1_kg\":5.3,\"lean_PRE8_kg\":71.8,\"lean_PRE1_kg\":70.9}}",
   "sources": [
    {
     "title": "Mitchell L et al. Physiological implications of preparing for a natural male bodybuilding competition. Eur J Sport Sci 2018;18(5):619-629 (PMID 29490578, abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:29490578%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'Fat mass (FM) was significantly reduced from PRE16 to PRE1 (8.8 ± 3.1 vs. 5.3 ± 2.4 kg ...). There was a small decrease in lean mass (LM) from PRE8 to PRE1 (71.8 ± 9.1 vs. 70.9 ± 9.1 kg'. Total mass and BMC are not in the abstract, so %fat is approximate. Fat over fat plus lean is an upper bound; adding an assumed 3.5 kg of bone mineral gives the lower figure. Ratio of group means, not mean of ratios. Result: about 7% one week out and about 10-11% 16 weeks out."
  },
  {
   "key": "rosaci2026_ifbb_pro_case",
   "label": "Rosaci, Biban & Bartolomei 2026: IFBB Pro League ('Mr. Olympia competitor') bodybuilder, off-season and 10 days pre-contest, skinfold body fat",
   "status": "measured",
   "values": "{\"n\":1,\"age_y\":38,\"height_m\":1.76,\"bulking_mass_kg\":128.7,\"bulking_bodyfat_pct\":6.1,\"bulking_ffm_kg\":120.8,\"cutting_mass_kg\":122.3,\"cutting_bodyfat_pct\":5.9,\"cutting_ffm_kg\":115.1,\"sum_3_skinfolds_mm\":[13.9,13.2],\"flexed_arm_cm\":[52.0,51.8],\"thigh_cm\":[75.5,73.4],\"calf_cm\":[44.5,44.4],\"method\":\"3-site skinfold, Evans et al. 2005 athlete equation (4C-derived)\",\"FFMI_derived\":{\"bulking\":39.0,\"cutting\":37.2},\"S_derived\":{\"bulking\":39.9,\"cutting\":38.0}}",
   "sources": [
    {
     "title": "Rosaci G, Biban S, Bartolomei S. Beyond the Limits of Human Muscle Hypertrophy: A Case Study of a Mr. Olympia Competitor Bodybuilder. J Strength Cond Res 2026;40(10):1253-1258, Table 3 and methods (Europe PMC full text PMC13592830)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC13592830/fullTextXML"
    }
   ],
   "notes": "Table 3: 'Body mass (kg) 128.7 | 122.3 ... % Body fat (%) 6.1 | 5.9; Fat-free mass (kg) 120.8 | 115.1' (BP = bulking/off-season, CT = cutting). Cutting measurement: 'June 11th, 2025 ... 10 days before the 2025 IFBB Huanji China Pro League competition'. Drug status: 'The eventual use of performance enhancing drugs by the athlete, competing in IFBB Pro League contests, in which antidoping tests are not performed, was not considered'. Equation: '% body fat = 8.997 + 0.24658 x (SUM 3 SKF) - 6.343 x (sex) - 1.998 x (race)'. For a white man it cannot go below 2.65% even at zero skinfold. A 6.1% off-season reading at 128.7 kg is implausibly low for this method and probably an underestimate. I treat the FFM, and so the FFMI of about 37-39, as upper bounds. Single subject. Best published body composition of a current top-level (presumably enhanced) pro that I found. The authors also cite Moreno et al. 2024 (Am J Hum Biol, PMID 37563889) for an Open bodybuilder of 131.4 kg at 12.2% fat. I fetched only Moreno's abstract, which gives ultrasound-estimated skeletal muscle (60.4 kg at most) and neither number, so the 12.2% is second-hand."
  },
  {
   "key": "giakoni2025_mr_universe_bia",
   "label": "Giakoni-Ramirez et al. 2025: 18 male bodybuilders measured at the IFBB Mr. Universe (Santiago, Chile) after official weigh-in, BIA",
   "status": "measured",
   "values": "{\"n_men\":18,\"age_y\":32.1,\"method\":\"multifrequency BIA, InBody 970\",\"mass_kg\":78.0,\"mass_sd\":6.5,\"height_cm\":171.3,\"height_sd\":3.7,\"BMI\":26.5,\"fat_mass_pct\":8.9,\"fat_mass_pct_sd\":1.8,\"fat_mass_kg\":7.0,\"ffm_kg\":70.8,\"ffm_sd\":5.8,\"FFMI_derived_from_means\":24.1}",
   "sources": [
    {
     "title": "Giakoni-Ramirez F, Munoz-Strale C, de Souza-Lima J, et al. Hydration Strategies and Body Composition Differences in Male and Female Elite Bodybuilders During Competition. Nutrients 2025;17(9):1554, Table 2 (Europe PMC full text PMC12073694)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12073694/fullTextXML"
    }
   ],
   "notes": "Table 2, Males (n = 18): 'Weight (kg) 78.0 6.5; Height (cm) 171.3 3.7; Fat Mass (%) 8.9 1.8; Fat Free Mass (kg) 70.8 5.8'. Measured 'during the Mr. Universe Championship held in Santiago, Chile' after athletes had 'successfully passed the official weigh-in'. This is an IFBB amateur event. Drug status and testing are not stated. Hand-to-foot BIA in dehydrated, glycogen-loaded, very lean athletes is not reliable (see Raymond 2018: multifrequency BIA underestimated DXA %fat by 3.0 ± 3.8 points in football players). Use as a soft upper reference for stage leanness."
  },
  {
   "key": "baggish2017_aas_users_ffmi",
   "label": "Baggish et al. 2017 (Pope group): normalized FFMI of 86 long-term AAS-using weightlifters vs 54 non-using weightlifters",
   "status": "measured",
   "values": "{\"users_n\":86,\"users_on_drug_n\":58,\"users_off_drug_n\":28,\"nonusers_n\":54,\"users_FFMI_median\":26,\"users_FFMI_IQR\":[24,28],\"nonusers_FFMI_median\":23,\"nonusers_FFMI_IQR\":[21,25],\"users_BMI_median\":31,\"users_BMI_IQR\":[29,33],\"nonusers_BMI_median\":29,\"height_m_median\":1.8,\"FFMI_formula\":\"W(1-BF)/H^2 + 6.1(1.8-H)\",\"min_lifetime_AAS_years\":2}",
   "sources": [
    {
     "title": "Baggish AL, Weiner RB, Kanayama G, Hudson JI, Lu MT, Hoffmann U, Pope HG. Cardiovascular Toxicity of Illicit Anabolic-Androgenic Steroid Use. Circulation 2017;135(21):1991-2002, Table 1 (NCBI PMC XML, PMC5614517)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=5614517"
    }
   ],
   "notes": "Table 1 (medians, IQR): 'Body mass index 31 (29-33) 29 (27-31); Fat-free mass index 26 (24-28) 23 (21-25)'. Footnote: 'The fat-free mass index is calculated as: (W(1-BF)/H^2) + 6.1(1.8-H)', so it is height-normalized with the 6.1 constant (see existing key ffmi_height_correction). Users had at least 2 years of cumulative AAS use; drug-test and hair-test screening was used. I did not find the body-fat method in the fetched text; the group has used skinfolds before, but that is not confirmed here. Medians, not maxima: a quarter of long-term users are below FFMI 24, so many enhanced lifters are not visibly beyond natural levels. Exclusion rule from the same paper: 'We also excluded men denying AAS use, but exhibiting a fat-free mass index greater than 26 kg/m2 together with body fat below 10%'."
  },
  {
   "key": "hudson2020_aas_users_ffmi",
   "label": "Hudson et al. 2020 (Pope group, same cohort): normalized FFMI of current vs past AAS users vs non-users",
   "status": "measured",
   "values": "{\"all_users_n\":85,\"current_users_n\":57,\"past_users_n\":28,\"nonusers_n\":52,\"FFMI_median_IQR\":{\"all_users\":[26,24,28],\"current_users\":[27,25,29],\"past_users_as_printed\":[24,25,28],\"nonusers\":[23,21,25]},\"weight_kg_median\":{\"all_users\":97,\"current\":95,\"past\":98,\"nonusers\":91},\"age_y_median_users\":42}",
   "sources": [
    {
     "title": "Hudson JI, Kanayama G, Pope HG, et al. Glomerular Filtration Rate and Supraphysiologic-Dose Anabolic-Androgenic Steroid Use: A Cross-sectional Cohort Study. Am J Kidney Dis 2020;76(2):296-299, Table 1 (NCBI PMC XML, PMC7744117)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=7744117"
    }
   ],
   "notes": "Table 1: 'Fat-free mass index 26 (24-28) 27 (25-29) 24 (25-28) 23 (21-25)' for all users (N = 85), current (N = 57), former (N = 28) and non-users (N = 52). The past-user cell '24 (25-28)' has a median outside its IQR, a typo in the source, so do not use it. Same FFMI formula (6.1 normalization). Current users' middle half spans 25-29, which overlaps the natural tail (Trexler 2017 football P97.5 = 28.1, existing key ffmi_athletes)."
  },
  {
   "key": "bulut2024_aas_users_lean_mass_index",
   "label": "Bulut et al. 2024 (Copenhagen): lean mass index and body fat in current and former AAS users vs strength-training controls",
   "status": "measured",
   "values": "{\"controls_n\":27,\"current_n\":32,\"former_n\":31,\"lean_mass_index_kg_m2\":{\"controls\":[20,2],\"current\":[23,2],\"former\":[21,2]},\"bodyfat_pct\":{\"controls\":[22,4],\"current\":[19,3],\"former\":[24,4]},\"format\":\"mean, SD\",\"age_y\":{\"controls\":31.2,\"current\":38.3,\"former\":35.3}}",
   "sources": [
    {
     "title": "Bulut Y, Rasmussen JJ, Brandt-Jacobsen N, et al. Coronary Microvascular Dysfunction Years After Cessation of Anabolic Androgenic Steroid Use. JAMA Netw Open 2024;7(12):e2451013, Table 1 (Europe PMC full text PMC11650407)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11650407/fullTextXML"
    }
   ],
   "notes": "Table 1: 'Lean mass index, mean (SD), kg/m2 20 (2) 23 (2) 21 (2)'; 'Body fat, mean (SD), % 22 (4) 19 (3) 24 (4)'. Text: 'Individuals with current use (mean [SD], 19% [3%]) demonstrated lower body fat compared with controls (22% [4%])'. Men in recreational strength training, AAS status self-reported, with blinded urine analysis (Cologne). The main text does not name the body-composition method. The same group used DXA in Rasmussen 2017 (PMID 28500659), but I could not confirm DXA for this paper. 'Lean mass index' is probably lean soft tissue over height squared, excluding bone, so it reads about 1 below FFMI. Rounded to whole numbers in the source."
  },
  {
   "key": "buhl2025_aas_users_bia",
   "label": "Buhl et al. 2025 (Denmark): body fat and BMI of current, previous and non-using male gym-goers, BIA",
   "status": "measured",
   "values": "{\"method\":\"bioimpedance (SOZO)\",\"men_total_n\":121,\"current_men_n_approx\":61,\"men_bodyfat_pct_median_IQR\":{\"current\":[13.1,10.4,16.5],\"previous\":[17.8,12.3,21.2],\"nonusers\":[20.0,16.3,22.5]},\"men_BMI_median_IQR\":{\"current\":[29.4,27.7,32.2],\"previous\":[27.4,25.6,29.9],\"nonusers\":[26.5,24.0,28.3]},\"men_height_m_median\":{\"current\":1.81,\"previous\":1.79,\"nonusers\":1.83},\"current_men_FFMI_approx_from_medians\":25.5}",
   "sources": [
    {
     "title": "Buhl LF, Christensen LL, Hjortebjerg R, et al. Illicit Anabolic Steroid Use and Cardiovascular Status in Men and Women. JAMA Netw Open 2025;8(8):e2526636, Table 1 (Europe PMC full text PMC12397887)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12397887/fullTextXML"
    }
   ],
   "notes": "Table 1, Men: 'Body fat percentage ... 13.1 (10.4-16.5) | 17.8 (12.3-21.2) | 20.0 (16.3-22.5)' (current, previous, non-users, median (IQR)); 'BMI ... 29.4 (27.7-32.2) ...'. Methods: 'body composition by bioimpedance (SOZO Digital Health Platform)'. Recruited from fitness centres March-December 2022. The current-user count of about 61 is inferred from a percentage row (15 = 24.6%). The FFMI of about 25.5 is a rough derivation from medians (29.4 x (1 - 0.131)), not a measured median. These are community users, not competitive bodybuilders."
  },
  {
   "key": "bhasin_testosterone_ffm_gains",
   "label": "Bhasin et al. 1996 and 2001: fat-free mass gained on supraphysiologic testosterone (randomized trials)",
   "status": "measured",
   "values": "{\"bhasin1996\":{\"n\":43,\"dose_mg_per_week\":600,\"weeks\":10,\"ffm_gain_testosterone_plus_exercise_kg\":6.1,\"se\":0.6,\"ffm_method\":\"underwater weighing\"},\"bhasin2001\":{\"n\":61,\"age_y\":\"18-35\",\"weeks\":20,\"design\":\"GnRH agonist + testosterone enanthate; no training\",\"ffm_change_kg\":{\"125mg\":3.4,\"300mg\":5.2,\"600mg\":7.9},\"nadir_testosterone_ng_dl\":{\"25mg\":253,\"50mg\":306,\"125mg\":542,\"300mg\":1345,\"600mg\":2370},\"ffm_method\":\"DXA (per full paper; abstract says fat-free mass)\"},\"600mg_20wk_as_FFMI_at_1p80m_derived\":2.4}",
   "sources": [
    {
     "title": "Bhasin S, Storer TW, Berman N, et al. The effects of supraphysiologic doses of testosterone on muscle size and strength in normal men. N Engl J Med 1996;335(1):1-7 (PMID 8637535, abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:8637535%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Bhasin S, Woodhouse L, Casaburi R, et al. Testosterone dose-response relationships in healthy young men. Am J Physiol Endocrinol Metab 2001;281(6):E1172-81 (PMID 11701431, abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:11701431%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "1996 abstract: 'The men received injections of 600 mg of testosterone enanthate or placebo weekly for 10 weeks ... fat-free mass was determined by underwater weighing ... The men assigned to testosterone and exercise had greater increases in fat-free mass (6.1 +/- 0.6 kg)'. 2001 abstract: 'Fat-free mass increased dose dependently in men receiving 125, 300, or 600 mg of testosterone weekly (change +3.4, 5.2, and 7.9 kg, respectively)'. I did not fetch the 2001 full text, so 'DXA' for that FFM is from memory of the paper and should be confirmed or dropped. These are short trials in men new to drugs; they show the size of early gains, not the long-term ceiling. The +2.4 FFMI is my conversion of 7.9 kg at 1.80 m."
  },
  {
   "key": "nandrolone_bodybuilders_trials",
   "label": "Hartgens 2001 / van Marken Lichtenbelt 2004: 8 weeks of nandrolone decanoate 200 mg/week in experienced bodybuilders (randomized, placebo-controlled)",
   "status": "measured",
   "values": "{\"n\":16,\"dose_mg_per_week\":200,\"weeks\":8,\"ffm_gain_4C_kg\":2.6,\"body_mass_gain_kg\":2.2,\"dxa_bone_free_lean_kg\":{\"before\":59.54,\"after\":63.06},\"dxa_total_mass_kg\":{\"before\":76.16,\"after\":78.73},\"fat_mass_change\":\"no significant change\"}",
   "sources": [
    {
     "title": "van Marken Lichtenbelt WD, Hartgens F, Vollaard NB, Ebbing S, Kuipers H. Bodybuilders' body composition: effect of nandrolone decanoate. Med Sci Sports Exerc 2004;36(3):484-489 (PMID 15076791, abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:15076791%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Hartgens F, van Marken Lichtenbelt WD, Ebbing S, et al. Body composition and anthropometry in bodybuilders: regional changes due to nandrolone decanoate administration. Int J Sports Med 2001;22(3):235-241 (PMID 11354529, abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:11354529%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "2004 abstract: '16 experienced male bodybuilders ... received ND (200 mg.wk-1 ...) or placebo for 8 wk. Body composition was assessed using the four-component model ... ND administration resulted in significant increments of body mass (+2.2 kg), fat-free mass (FFM: +2.6 kg)'. 2001 abstract (DXA): 'bone-free lean mass (from 59.54 +/- 2.36 to 63.06 +/- 2.99 kg ...)'. 'Total fat mass and total percentage fat remained unaffected'. The 200 mg/week dose is low compared with real use (see kaufman2024_aas_doses)."
  },
  {
   "key": "kaufman2024_aas_doses",
   "label": "Kaufman et al. 2024 (Pope group): self-reported AAS doses of long-term users",
   "status": "reported",
   "values": "{\"users_n\":51,\"current_n\":32,\"past_n\":19,\"age_y\":47.5,\"avg_weekly_AAS_dose_mg\":973,\"avg_dose_sd\":627,\"max_weekly_AAS_dose_mg\":1978,\"max_dose_sd\":2130,\"cumulative_years\":10.0,\"years_sd\":6.0}",
   "sources": [
    {
     "title": "Kaufman MJ, Hudson JI, Kanayama G, et al. A study of long-term supraphysiologic-dose anabolic-androgenic steroid use on cognitive function in middle-aged men. Am J Drug Alcohol Abuse 2024 (NCBI PMC XML, PMC11974399)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=11974399"
    }
   ],
   "notes": "Table 1 (mean (SD)): 'Average weekly AAS dose, mg 973 (627); Maximum weekly AAS dose, mg 1978 (2130); Cumulative lifetime AAS use, yrs 10.0 (6.0)'. Self-reported. The same paper excluded a claimed non-user who 'displayed a fat-free mass index of 27.7 kg/m2 with a body fat of 7.5% - figures not plausibly attainable without use of performance-enhancing drugs'. That is the group's working natural boundary. Table 1 gives no FFMI."
  },
  {
   "key": "yu2014_doped_vs_clean_powerlifters",
   "label": "Yu et al. 2014: lean body mass of long-term AAS-using vs clean strength athletes",
   "status": "measured",
   "values": "{\"doped_n\":10,\"clean_n\":7,\"years_of_use\":\"5-15\",\"body_weight_kg\":{\"doped\":[108,17],\"clean\":[110,13]},\"lean_body_mass_kg\":{\"doped\":[89.8,8.2],\"clean\":[74.6,6.8]},\"lean_leg_mass_kg\":{\"doped\":[28.6,2.5],\"clean\":[25.5,1.4]},\"height\":\"not in table (unknown)\"}",
   "sources": [
    {
     "title": "Yu JG, Bonnerud P, Eriksson A, Stal PS, Tegner Y, Malm C. Effects of long term supplementation of anabolic androgen steroids on human skeletal muscle. PLoS One 2014;9(9):e105330, Table 2 (Europe PMC full text PMC4160183)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4160183/fullTextXML"
    }
   ],
   "notes": "Table 2: 'Body weight (kg) 108±17 | 110±13; Lean body mass (kg) 89.8±8.2 | 74.6±6.8 (p = 0.06)'. Doping status was self-reported at interview. Same body weight, about 15 kg more lean mass in users, so users carried much less fat. Without heights no FFMI can be computed. Small sample. I did not confirm the scan method in the text I parsed."
  },
  {
   "key": "kondo1994_sumo_ffm_limit",
   "label": "Kondo et al. 1994: professional sumo wrestlers, hydrodensitometry; largest FFM 121.3 kg",
   "status": "measured",
   "values": "{\"sumo_n\":37,\"bodybuilders_n\":14,\"untrained_n\":26,\"method\":\"hydrodensitometry\",\"mean_bodyfat_pct\":{\"sumo\":26.1,\"bodybuilders\":10.9,\"untrained\":12.1},\"largest_wrestler\":{\"ffm_kg\":121.3,\"height_m\":1.86,\"mass_kg\":181,\"bodyfat_pct\":33.0},\"elite_ffm_per_stature_kg_cm\":0.61,\"highest_ffm_per_stature\":0.66,\"proposed_limit_ffm_per_stature\":0.7,\"largest_wrestler_FFMI_derived\":35.1,\"largest_wrestler_S_derived\":33.9}",
   "sources": [
    {
     "title": "Kondo M, Abe T, Ikegawa S, Kawakami Y, Fukunaga T. Upper limit of fat-free mass in humans: A study on Japanese Sumo wrestlers. Am J Hum Biol 1994;6(5):613-618 (PMID 28548340, abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:28548340%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'Mean % fat of Sumo wrestlers, bodybuilders, and untrained subjects were, respectively, 26.1%, 10.9%, and 12.1% ... the largest one of 121.3 kg (stature: 186 cm, mass: 181 kg, %fat: 33.0%) ... It is suggested that a FFM/stature ratio of 0.7 kg/cm may be an upper limit in humans.' Two-compartment densitometry assumes a fixed FFM density, which is less accurate in very large or very muscular men (see existing key ffm_density_variation). Drug status of the 14 bodybuilders is not stated. Derived FFMI and S are mine. Abstract only."
  },
  {
   "key": "hattori1999_sumo_divisions",
   "label": "Hattori et al. 1999: 36 professional sumo wrestlers, densitometry; FFMI about 30 separates top-division (sekitori) wrestlers",
   "status": "measured",
   "values": "{\"n\":36,\"method\":\"densitometry\",\"mean_mass_kg\":117.1,\"mean_BMI\":36.5,\"mean_bodyfat_pct\":26.2,\"sekitori_FFMI_cutoff_approx\":30,\"mean_FFMI_derived_from_means\":26.9}",
   "sources": [
    {
     "title": "Hattori K, Kondo M, Abe T, Tanaka S, Fukunaga T. Hierarchical differences in body composition of professional Sumo wrestlers. Ann Hum Biol 1999;26(2):179-184 (PMID 10195655, abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1080/030144699282886&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'The means of body weight, BMI and %fat for Sumo wrestlers were 117.1 kg, 36.5 and 26.2% ... The cut-off point of fat-free mass index which divided Sekitori wrestlers from other wrestlers is approximately 30'. The mean FFMI of 26.9 is my rough figure from group means (also listed in Martinez-Mireles 2025). Sumo wrestlers are not on the brief's group list, but they are the best-measured very heavy athletes and a useful 'strong and fat' reference."
  },
  {
   "key": "bosch2019_d1_football_linemen_dxa",
   "label": "Bosch et al. 2019: DXA body composition by position, 467 NCAA Division I football players (C-CAR)",
   "status": "measured",
   "values": "{\"method\":\"DXA, GE Lunar iDXA/Prodigy, central reanalysis enCore 16.2\",\"offensive_line\":{\"n\":83,\"height_cm\":192.9,\"mass_kg\":135.5,\"bodyfat_pct\":30.8,\"sd\":4.2,\"range_pct\":[19,41],\"lean_kg\":89.5},\"defensive_line\":{\"n\":53,\"height_cm\":189.1,\"mass_kg\":120.4,\"bodyfat_pct\":23.5,\"sd\":7.0,\"range_pct\":[12,37],\"lean_kg\":87.6},\"linebackers_bodyfat_pct\":18.8,\"defensive_backs_bodyfat_pct\":13.3,\"OL_lean_only_FFMI_derived\":24.1,\"DL_lean_only_FFMI_derived\":24.5}",
   "sources": [
    {
     "title": "Bosch TA, Carbuhn AF, Stanforth PR, Oliver JM, Keller KA, Dengel DR. Body Composition and Bone Mineral Density of Division 1 Collegiate Football Players: A Consortium of College Athlete Research Study. J Strength Cond Res 2019;33(5):1339-1346, Tables 1-4 (NCBI PMC XML, PMC5591058)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=5591058"
    }
   ],
   "notes": "'Positional Body Composition Characteristics': 'Percent Fat (%) | 30.8a (4.2) | 23.5b (7.0) ...' for OL (n = 83) and DL (n = 53). Ranges table: OL 19-41%, DL 12-37%. 'All players were scanned on GE Healthcare Lunar systems'. Preseason (June-August) scans. 'Lean mass' excludes bone mineral, so lean-only FFMI reads about 1 low. NFL professionals by DXA appear only in a secondary review (martinezmireles2025_review_strength_sports): OL 28.8%, DL 25.2%. The NFL primary (Dengel et al. 2014, PMID 24149760) abstract gives no position %fat. Drug status of college players is not verified."
  },
  {
   "key": "martinezmireles2025_review_strength_sports",
   "label": "Martinez-Mireles et al. 2025 scoping review: tabulated body fat of NFL linemen and heavyweight powerlifters (secondary)",
   "status": "reported",
   "values": "{\"NFL_OL_DXA\":{\"n\":65,\"height_m\":1.928,\"BMI\":37.9,\"bodyfat_pct\":28.8,\"FFMI\":27.0,\"primary\":\"Anding & Oliver 2015, GSSI Sports Science Exchange (Spanish)\"},\"NFL_DL_DXA\":{\"n\":58,\"height_m\":1.909,\"BMI\":36.5,\"bodyfat_pct\":25.2,\"FFMI\":27.3},\"NFL_OL_ADP\":{\"n\":11,\"bodyfat_pct\":25.1,\"primary\":\"Kraemer et al. 2005\"},\"NFL_DL_ADP\":{\"n\":7,\"bodyfat_pct\":18.5},\"NZ_heavyweight_powerlifters_anthropometry\":{\"n\":15,\"height_m\":1.747,\"BMI\":39.9,\"bodyfat_pct\":26.4,\"FFMI\":29.4,\"primary\":\"Keogh et al. 2007 (review mislabels as weightlifting)\"}}",
   "sources": [
    {
     "title": "Martinez-Mireles X, et al. Defining Elite Zones: A Scoping Review of Body Physique and Body Fat in Elite Athletes. J Funct Morphol Kinesiol 2025;11(1):13, table 'Body composition in elite male athletes with indirect methods' (Europe PMC full text PMC12821704)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12821704/fullTextXML"
    },
    {
     "title": "Keogh JW, Hume PA, Pearson SN, Mellow P. Anthropometric dimensions of male powerlifters of varying body mass. J Sports Sci 2007;25(12):1365-76 (PMID 17786689, abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1080/02640410601059630&resultType=core&format=json"
    },
    {
     "title": "Kraemer WJ et al. Body size and composition of National Football League players. J Strength Cond Res 2005;19(3):485-9 (PMID 16095394, abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1519/18175.1&resultType=core&format=json"
    }
   ],
   "notes": "Secondary compilation. Footnote: 'When BF% was not reported, values were estimated from the fat mass or lean mass ... using proportional calculations'. The row 'Weightlifting, national from New Zealand Category: heavy weight' cites Keogh 2007, whose abstract says 'Fifty-four male Oceania competitive powerlifters (9 lightweight, 30 middleweight, and 15 heavyweight)'. The 26.4% is therefore heavyweight powerlifters, measured by anthropometric fractionation rather than a lab method; the review's label is wrong. Its 'age 33.00' for NFL rows matches Kraemer 2020's strongman age and may be a copy error. The NFL DXA primary is a Gatorade SSE trade article. Use these only as context, not as chart anchors."
  },
  {
   "key": "weightlifting_superheavy_bodyfat",
   "label": "Olympic weightlifting super-heavyweights: measured body fat",
   "status": "estimate",
   "values": "{\"measured_values_found\":0,\"nearest_measured\":{\"strongmen_DXA_pct\":[18.7,6.2],\"sumo_densitometry_pct\":26.2,\"heavyweight_powerlifters_anthropometry_pct\":26.4},\"suggested_range_pct\":[15,30],\"working_pct\":20}",
   "sources": [
    {
     "title": "Search record: Europe PMC query for weightlifter body composition by weight class (no super-heavyweight lab measurement found)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=(weightlifters%20OR%20weightlifting)%20AND%20(%22body%20composition%22%20OR%20%22body%20fat%22)%20AND%20(%22heavyweight%22%20OR%20%22super-heavyweight%22)&resultType=core&format=json"
    },
    {
     "title": "Kraemer et al. 2020 (existing key kraemer2020_elite_strongmen_dxa)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:33235016%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Unknown. I found no DXA, densitometry or 4C body fat for elite super-heavyweight weightlifters (for example Talakhadze, 1.95-1.97 m, 157-178 kg at weigh-ins; existing key lasha_talakhadze_height_weight). A web summary of old Soviet data (Breaking Muscle) says fat rises with class (about 15% at 110 kg) and super-heavies run higher. That is not peer-reviewed and I did not use it. The suggested 15-30% is my estimate, between strongmen (DXA 18.7 ± 6.2%) and sumo or heavyweight powerlifters (about 26%)."
  },
  {
   "key": "bodyfat_range_everyday_men",
   "label": "Recommended body-fat range: everyday men (ANSUR II soldiers, NHANES adults)",
   "status": "estimate",
   "values": "{\"ansur2_builds\":{\"method\":\"per build: Army AD 2023-11 equation on the build's navel waist and weight; range central +/- 4 points\",\"group_range_pct\":[15,34],\"median_man_working_pct\":24},\"nhanes_builds\":{\"group_range_pct\":[17,38],\"median_man_working_pct\":28,\"basis\":\"NHANES 1999-2004 DXA men 20+, 5th-95th and median\"},\"effect_on_score\":\"S is proportional to (1 - fat): 15% vs 34% changes S by about 22% end to end\"}",
   "sources": [
    {
     "title": "NCHS Vital Health Stat 11(250), Table 3",
     "url": "https://www.cdc.gov/nchs/data/series/sr_11/sr11_250.pdf"
    },
    {
     "title": "Taylor et al. 2024 (PMC11026907)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11026907/fullTextXML"
    },
    {
     "title": "Fort Jackson IG Update 23-4 (AD 2023-11 equation)",
     "url": "https://home.army.mil/jackson/download_file/view/84278f84-10a3-4177-a3bc-6d2f08ae7866/1016"
    }
   ],
   "notes": "ANSUR II percentile builds are percentiles of size, not of fatness, so give each build its own centre from the equation on its own waist and weight, with about ±4 points (Taylor's male one-site RMSE about 3.4; the official and Taylor coefficients differ by about 2.5 points on ANSUR II). Label it 'estimated from waist and weight (Army 2023 equation)'. For the NHANES median build use the DXA percentiles directly. Measured soldiers average 24.3% by DXA. US men average 28% by DXA."
  },
  {
   "key": "bodyfat_range_natural_stage",
   "label": "Recommended body-fat range: natural (drug-tested) bodybuilders on stage",
   "status": "estimate",
   "values": "{\"range_pct\":[4,10],\"working_pct\":6,\"measured_points\":{\"Rossow2013_DXA\":4.5,\"Barakat2022_DXA_comp_day\":6.3,\"Barakat2022_DXA_last8days\":[5.4,6.3],\"Schoenfeld2020_BIA_or_skinfold\":5,\"Mitchell2018_DXA_1wk_out_derived\":[6.6,7.0],\"Kistler2014_DXA_end_prep\":7.4,\"Robinson2015_skinfold_end_derived\":7.2,\"Bauer2023_near_competition_all_methods\":[5.8,10.7]}}",
   "sources": [
    {
     "title": "Barakat et al. 2022 (PMC9321665)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC9321665/fullTextXML"
    },
    {
     "title": "Kistler et al. 2014 (PMID 24901578)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:24901578%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Rossow 2013, Mitchell 2018, Bauer 2023 (existing keys rossow2013_natural_pro_case, mitchell2018_natural_bodybuilders, bauer2023_bodyfat_ranges_review)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:36727905%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Lab-grade (DXA) contest-day values cluster at 4.5-6.3%. Field methods (BIA, skinfolds, ultrasound) read lower, down to 3.6%. Bauer's 5.8-10.7% mixes methods and timing ('close to competition'). 4-10% covers all of them; 6% is the DXA centre. Drug-free status rests on federation testing or self-report (Rossow: IFPA pro; Barakat: self-described; Chappell's PROs: polygraph). At 4-10%, S varies by about ±3% around the 6% value."
  },
  {
   "key": "bodyfat_range_natural_offstage",
   "label": "Recommended body-fat range: natural athletes off stage (off-season bodybuilders, gym non-users)",
   "status": "estimate",
   "values": "{\"range_pct\":[10,18],\"working_pct\":13,\"measured_points\":{\"Kouri1995_nonusers_skinfold_approx\":13,\"Graybeal2020_4C\":[11.8,4.4],\"Rossow2013_DXA_start_and_6mo_after\":[14.8,14.6],\"Kistler2014_DXA_26wk_out\":17.5,\"Robinson2015_skinfold_start\":14,\"Mitchell2018_DXA_16wk_out_derived\":[10.5,10.9],\"Bauer2023_general_prep\":[9.6,16.3],\"Kondo1994_bodybuilders_densitometry\":10.9}}",
   "sources": [
    {
     "title": "Graybeal et al. 2020, Kouri 1995 group means, Rossow 2013, Bauer 2023 (existing keys graybeal2020_bodybuilders_4C, kouri1995_group_means, rossow2013_natural_pro_case, bauer2023_bodyfat_ranges_review)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:30161092%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Kistler et al. 2014 (PMID 24901578)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:24901578%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Robinson et al. 2015 (PMC4422265)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4422265/fullTextXML"
    }
   ],
   "notes": "Kouri's FFMI 25 limit was set at about 13% fat (skinfolds), so 13% is the natural working value for the natural-limit line. Graybeal and Kondo do not state drug status. Use this range for the Kouri non-user anchor, Mr America winners and off-season natural pros (Malcolm Cooper, Chappell's PROs at end-of-prep weight are 'stage' instead)."
  },
  {
   "key": "bodyfat_range_enhanced_stage",
   "label": "Recommended body-fat range: enhanced pro bodybuilders on stage (Coleman, Yates, Cutler, Heath, Ramy, Arnold, Oliva)",
   "status": "estimate",
   "values": "{\"range_pct\":[4,8],\"working_pct\":5,\"basis\":{\"Withers1997_4C_5d_out\":5.0,\"Rosaci2026_skinfold_10d_out\":5.9,\"natural_DXA_contest_day\":[4.5,6.3],\"Giakoni2025_BIA_IFBB_amateur\":[8.9,1.8],\"existing_derived_ffmi_pros_assumption\":5},\"Coleman_2004_134p3kg_1p803m_S\":{\"at_4pct\":39.6,\"at_5pct\":39.2,\"at_8pct\":37.9}}",
   "sources": [
    {
     "title": "Rosaci et al. 2026 (PMC13592830)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC13592830/fullTextXML"
    },
    {
     "title": "Withers et al. 1997 (existing key withers1997_elite_bb_4C)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:9127683%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Giakoni-Ramirez et al. 2025 (PMC12073694)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12073694/fullTextXML"
    }
   ],
   "notes": "No DXA or 4C measurement of a Mr. Olympia-level competitor on stage was found, so this is an estimate. Basis: the only 4C contest-week value (Withers, 3 elite men, probably enhanced, 5.0% five days out); a skinfold value for a current IFBB pro 10 days out (5.9%); and natural competitors reaching 4.5-6.3% by DXA. There is no measured evidence that enhanced pros get leaner than that. Enhanced pros' extra weight is lean mass, and stage diuretics lower FFM water rather than fat. The 5% working value matches the existing derived_ffmi_pros assumption. The band moves S by only about ±2%."
  },
  {
   "key": "bodyfat_range_enhanced_offseason",
   "label": "Recommended body-fat range: enhanced bodybuilders off-season, and community AAS users",
   "status": "estimate",
   "values": "{\"pro_offseason_range_pct\":[8,15],\"pro_offseason_working_pct\":11,\"community_users_range_pct\":[10,20],\"basis\":{\"Rosaci2026_offseason_skinfold\":6.1,\"Moreno2024_open_bb_via_Rosaci\":12.2,\"Coleman_offseason_if_stage_FFM_kept_derived\":[11,15],\"Buhl2025_current_men_BIA_median_IQR\":[13.1,10.4,16.5],\"Bulut2024_current_users\":[19,3],\"Kouri1995_users_skinfold_approx\":13}}",
   "sources": [
    {
     "title": "Buhl et al. 2025 (PMC12397887)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12397887/fullTextXML"
    },
    {
     "title": "Bulut et al. 2024 (PMC11650407)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11650407/fullTextXML"
    },
    {
     "title": "Rosaci et al. 2026 (PMC13592830)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC13592830/fullTextXML"
    }
   ],
   "notes": "The Coleman figure is my derivation from existing key ronnie_coleman_height_weight: stage 134.3 kg at about 5% gives FFM ≈ 127.6 kg; off-season 143-150 kg with the same FFM gives 11-15% fat. It is an upper bound on fat if he also gained lean tissue and water. Rosaci's 6.1% off-season reading is probably low because the skinfold equation floors near 2.7%. Moreno's 12.2% is second-hand. Community users (Buhl, Bulut, Kouri) sit at 13-19%. Only needed if the chart shows off-season weights (for example Coleman's 330 lb)."
  },
  {
   "key": "bodyfat_range_strongmen_lifters",
   "label": "Recommended body-fat range: strongmen and heavy lifters (Shaw, Hall, Bjornsson, Talakhadze, Kraemer group)",
   "status": "estimate",
   "values": "{\"range_pct\":[12,28],\"working_pct\":19,\"basis\":{\"Kraemer2020_DXA_mean_sd\":[18.7,6.2],\"Shaw_2024_hydrostatic\":17.6,\"weightlifting_superheavy\":\"not measured; use same range\",\"heavyweight_powerlifters_anthropometry\":26.4,\"sumo_densitometry\":26.2,\"D1_offensive_line_DXA\":[30.8,4.2]},\"effect_on_score\":\"S at 12% vs 28% differs by about 18%\"}",
   "sources": [
    {
     "title": "Kraemer et al. 2020 (existing key kraemer2020_elite_strongmen_dxa)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:33235016%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Brian Shaw hydrostatic test (existing key brian_shaw_height_weight)",
     "url": "https://fitnessvolt.com/brian-shaws-body-fat-percentage-hydrostatic-testing/"
    },
    {
     "title": "Bosch et al. 2019 (PMC5591058)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=5591058"
    }
   ],
   "notes": "12-28% is Kraemer's mean ± about 1.5 SD, clipped at the upper end by the sumo and powerlifter values (about 26%). Use measured values where they exist (Shaw 17.6%, a self-filmed test, 'reported'). Hall and Bjornsson have no measured body fat (unknown), so use the group range. Talakhadze has no measured value either, so use the group range and label it an estimate. If linemen or sumo are added, use 20-35%."
  },
  {
   "key": "bodyfat_range_comic_characters",
   "label": "Recommended body-fat assumption: comic characters (no source exists)",
   "status": "estimate",
   "values": "{\"lean_heroes\":{\"who\":\"Superman, Batman, Captain America, Thor, Black Panther, Luke Cage, Wolverine (after removing adamantium), human Colossus\",\"range_pct\":[5,12],\"working_pct\":8,\"drawn_like\":\"enhanced bodybuilder, stage to near-stage\"},\"brutes\":{\"who\":\"Hulk (all forms), Juggernaut, Abomination, Doomsday, Bane, Darkseid\",\"range_pct\":[8,20],\"working_pct\":12,\"drawn_like\":\"off-season pro bodybuilder to strongman\"},\"heavy\":{\"who\":\"Kingpin\",\"range_pct\":[15,35],\"working_pct\":25,\"drawn_like\":\"strongman to sumo\"},\"everyday\":{\"who\":\"Bruce Banner\",\"range_pct\":[15,34],\"working_pct\":24},\"not_tissue\":{\"who\":\"The Thing, armoured Colossus\",\"rule\":\"body fat not meaningful; mass is rock or steel, score is not muscle; show as 'mass, not muscle'\"}}",
   "sources": [
    {
     "title": "No source: assumption built on the human ranges in this research (see bodyfat_range_* keys); existing keys hulk_savage, kingpin, thing, colossus, wolverine for official stats",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:36727905%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "No publisher gives body fat for any of these characters (existing builds: all 'unknown'). This is a labelled assumption: each character gets the measured range of the human group they are drawn like, judged from typical art (visible abdominal definition and vascularity, or a heavy midsection). Show it on the page as 'assumed: drawn like ...'. The owner may prefer one comic-wide band (5-20%, working 10%) to avoid judging each character's art; that is simpler and still honest. Kingpin's wide band reflects art that shows a large midsection. Thing and armoured Colossus should not get a muscle score from body fat at all."
  },
  {
   "key": "bodyfat_range_rex_ollie",
   "label": "Body fat for Rex and Ollie (owner's canon)",
   "status": "official",
   "values": "{\"range_pct\":[5,10],\"working_pct\":7.5}",
   "sources": [
    {
     "title": "Owner's canon: build-comparison/BRIEF.md ('Decisions already made') and CLAUDE.md ('Canon')",
     "url": "file:///home/user/rex-strength-lab/build-comparison/BRIEF.md"
    }
   ],
   "notes": "'Rex and Ollie are 7.5% body fat (canon: 5-10%, from their definition and occasional vascularity). Use 7.5% with 5-10% as the range.' This is set by the owner, not measured. 5-10% moves S by about ±3% around 7.5%. Tails are excluded from the score, and height is to the skull top, per the brief."
  }
 ],
 "recommendations": "1. Draw each build's score as a bar across its body-fat range with a dot at the working value. S = 1.8·FFM/H³ is proportional to (1 − fat), so bars are short for lean groups (natural or enhanced stage: about ±2–3%) and long for everyday men and strongmen (about 18–22% end to end). Label every range with its basis: measured (DXA, 4C, densitometry), equation-estimated, or assumed.\n2. Everyday men: give each ANSUR II build its own body fat from the official Army 2023 one-site equation on that build's navel waist and weight (±4 points). Label it \"estimated from waist and wei … [2,304 more characters on this line; the full prompt is in prompts/afa0192d0490b0d9e.txt]
 "gaps": "- No DXA or 4C body-fat measurement of a Mr. Olympia-level pro on stage or in the off-season. The only current-pro data (Rosaci 2026) are skinfold-based. Moreno 2024's 12.2% is second-hand (only Moreno's abstract fetched).\n- No measured body fat for elite super-heavyweight Olympic weightlifters. The 15–30% is an estimate.\n- NFL linemen by DXA come only from a secondary review citing a Gatorade SSE article. The NFL primary (Dengel 2014) abstract has no position values. I used college Division I DXA (Bosch 2019) as the primary.\n- Kouri 1995 full text still not fetched (existing seco … [1,548 more characters on this line; the full prompt is in prompts/afa0192d0490b0d9e.txt]
}
```

</details>

**Subagent `verify:function`** · build-comparison-research · started 2026-10-11 04:44:36 UTC

- checks: 28 (21 ok, 7 not ok).
- Not OK: lifters_rom_chang1988_and_later; arm_hang_model_ansur_median; hand_to_mouth_reach_geometry (+4 more).
- The sourced facts hold up. I re-fetched about 40 sources: 25 PubMed abstracts via E-utilities, the CDC page and its DS1 PDF, both 38 CFR plate GIFs, the 4.71 and 4.71a text, the Zwerus PMC page, the Hara XML, the ANSUR II handbook and CSV, Islam 2020, the Murphy XML, and the McAdams and Reed PDFs.

<details>
<summary>Prompt, verbatim (64,433 characters)</summary>

Workflow run `wf_94de1f40-a68`, phase `Verify`, agent `a1d2252031e7aa4aa`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a1d2252031e7aa4aa.txt](prompts/a1d2252031e7aa4aa.txt).

```text
Project: "Build Comparison", a chart that ranks male body builds by "muscle level" irrespective of height, from ordinary men through the limits of human possibility to the monstrous (comic characters, and two original 3 m characters, Rex and Ollie). Read /home/user/rex-strength-lab/build-comparison/BRIEF.md first (10 minutes): it states the decisions already made and the problems to solve.
The working score is FFMI after rescaling the body to 1.80 m at the same shape: S = 1.8 * FFM / H^3 (FFM = fat-free mass in kg, H = height in m), shown beside plain FFMI = FFM / H^2. A rough first pass gives: US Army median man about 24, Ronnie Coleman about 35-39, Eddie Hall about 38, the heaviest comic characters 57-81, Rex about 141 (tail excluded, height to crest). A solid ball of muscle as tall as the figure scores about 924.
The sister project /home/user/rex-strength-lab/build-calculator/ already holds 55 builds and 139 verified facts in data/builds.json (read its "facts" keys and labels before you start; do NOT re-research a fact that already exists there unless the brief needs a number it lacks, and say so when you rely on an existing key). ANSUR II CSVs are in /home/user/rex-strength-lab/build-calculator/data/ansur2/ (ANSUR_II_MALE_Public.csv, 4,082 men; values in mm and kg x10? check: weightkg is in tenths of kg, lengths in mm).
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent; a number is "sourced" only if you fetched the page or PDF and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher PDFs). Prefer primary or authoritative sources (journals, textbooks, government surveys, standards bodies, publisher handbooks); use fan sites or magazines only when nothing better exists, and label them so. Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". Write raw downloads and scripts under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
For each fact give: key (snake_case), label, status (measured | official | reported | derived | estimate | disputed), values (a JSON object as a string, SI units plus the original units), sources (title + URL actually fetched), and notes (what exactly the source says, its sample, caveats, how good the evidence is).

You are a skeptical fact-checker for the topic "function". Below are the researcher's facts and recommendations. Re-fetch the cited URLs for every fact the chart is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, quotation and status against what the source actually says; recompute every derived number you can (re-run computations on the ANSUR II CSV where relevant). Mark ok=false with a correction for anything wrong, mislabelled (for example a fan wiki or a magazine marked official or measured; a sample maximum called a limit; a secondary summary presented as the primary paper), or unsupported. Also judge the recommendations: anything that overstates the evidence? List important missing items.

RESEARCH:
{
 "summary": "I found sources for all three functional limits, but no source gives the limits themselves. Each threshold below is my own estimate, built from sourced pieces.\n\n(1) Soft-tissue contact limits flexion. CDC's goniometry protocol says elbow flexion ends \"usually when the muscle bulk of the anterior forearm contacts the muscle bulk of the anterior upper arm\", and knee flexion ends when calf meets thigh. Normal passive elbow flexion in men aged 20-44 is 144.6 deg (CDC); the VA standard is 0-145 deg (38 CFR 4.71). Zwerus et al. measured active flexion in men falling with BMI: 151, 1 … [2,788 more characters on this line; the full prompt is in prompts/a1d2252031e7aa4aa.txt]
 "facts": [
  {
   "key": "elbow_knee_flexion_norms_cdc",
   "label": "Normal passive elbow and knee flexion in healthy people (CDC Normal Joint Range of Motion Study, 674 people aged 2-69)",
   "status": "measured",
   "values": "{\"elbow_flexion_men_20_44_deg\":144.6,\"elbow_flexion_men_20_44_ci95_deg\":[143.6,145.6],\"elbow_flexion_men_20_44_rad\":2.524,\"elbow_flexion_men_45_69_deg\":143.5,\"elbow_flexion_women_20_44_deg\":150.0,\"knee_flexion_men_20_44_deg\":137.7,\"knee_flexion_men_20_44_ci95_deg\":[136.5,138.9],\"knee_flexion_men_45_69_deg\":132.9,\"elbow_flexion_all_ages_both_sexes_mean_deg\":148.0,\"elbow_flexion_all_sd_deg\":6.2,\"elbow_flexion_all_min_max_deg\":[120,166],\"n_total\":674}",
   "sources": [
    {
     "title": "CDC Joint Range of Motion Study (archived page with reference-value tables)",
     "url": "https://archive.cdc.gov/www_cdc_gov/ncbddd/jointrom/index.html"
    },
    {
     "title": "CDC Public Use Dataset for Normal Joint Range of Motion: Data Description and Sample Data Tables (10/27/2010)",
     "url": "https://stacks.cdc.gov/view/cdc/153156/cdc_153156_DS1.pdf"
    },
    {
     "title": "Soucie et al. 2011, Haemophilia 17:500-507, PMID 21070485 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=21070485&rettype=abstract&retmode=text"
    }
   ],
   "notes": "CDC table 'Reference Values for Normal Joint Range of Motion- ages 20 - 44': 'Elbow flexion 150.0 (149.1 - 150.9) [females] 144.6 (143.6 - 145.6) [males]'; 'Knee flexion 141.9 (140.9 - 142.9) 137.7 (136.5 - 138.9)'. Ages 45-69 males: elbow 143.5 (142.3-144.7), knee 132.9 (131.6-134.2). Soucie abstract: 'Nine licensed physical therapists used universal goniometers to determine passive joint motion'; collected Nov 2003 - Jul 2006; 'Female subjects had greater joint mobility'; values 'in most cases, were significantly different than most commonly used normative values'. The DS1 PDF (p.5) gives whole-sample statistics, both sexes and all ages: right elbow flexion mean 148.00, SD 6.43, range 120-166; left 148.00, SD 6.17, range 125-165. These are passive values, a few degrees above active ones. The public dataset includes weight and height, so it could test BMI against flexion directly, but its download link is now dead (404) and the Wayback copy was unreachable from this sandbox. The CDC page shows 95% confidence intervals and calls the values 'reference values'."
  },
  {
   "key": "rom_end_point_soft_tissue_contact",
   "label": "What ends elbow, knee and hip flexion in a standard goniometry protocol: muscle bulk meeting muscle bulk",
   "status": "official",
   "values": "{\"elbow_flexion_sample_mean_deg\":148.0,\"knee_flexion_sample_mean_deg\":140.3,\"orig\":\"CDC protocol: elbow flexion stops when anterior forearm bulk meets anterior upper-arm bulk; knee flexion when calf and thigh meet; hip flexion when anterior thigh meets lower abdomen\"}",
   "sources": [
    {
     "title": "CDC Public Use Dataset for Normal Joint Range of Motion: Data Description and Sample Data Tables",
     "url": "https://stacks.cdc.gov/view/cdc/153156/cdc_153156_DS1.pdf"
    },
    {
     "title": "Zwerus et al., Normative values and affecting factors for the elbow range of motion, Shoulder Elbow 2019;11(3):215-224, doi 10.1177/1758573217728711 (PMC full text)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6555111/"
    }
   ],
   "notes": "CDC DS1 p.2, Elbow flexion (supine, arm at side, forearm supinated): 'ROM is recorded when the elbow can bend no further, usually when the muscle bulk of the anterior forearm contacts the muscle bulk of the anterior upper arm.' Knee flexion: 'ROM is recorded when the knee can bend no further, usually when the muscle bulk of the calf and thigh contact each other.' Hip flexion: 'ROM is recorded when contact is made between the muscle bulk of the anterior thigh and lower abdomen or when the pelvis begins to tilt posteriorly.' Zwerus et al., Introduction: 'Flexion is usually restricted by anterior soft tissues such as the biceps muscle, resulting in an elastic end-feeling.' Together these support 'soft-tissue approximation' as the normal end-feel of elbow and knee flexion. The textbooks named in the brief (Norkin & White, Kapandji, Magee, the AAOS booklet) were NOT fetched; only flashcards and secondary pages quoted them, so they are not cited here."
  },
  {
   "key": "cfr_standard_joint_ranges",
   "label": "US VA standard ranges of motion (38 CFR 4.71, Plates I and II): elbow flexion 0-145 deg, wrist flexion 0-80 deg, knee flexion 0-140 deg",
   "status": "official",
   "values": "{\"elbow_flexion_deg\":145,\"wrist_palmar_flexion_deg\":80,\"wrist_dorsiflexion_deg\":70,\"forearm_pronation_deg\":80,\"forearm_supination_deg\":85,\"shoulder_abduction_deg\":180,\"knee_flexion_deg\":140,\"hip_flexion_deg\":125,\"hip_abduction_deg\":45}",
   "sources": [
    {
     "title": "38 CFR 4.71 Measurement of ankylosis and joint motion (LII)",
     "url": "https://www.law.cornell.edu/cfr/text/38/4.71"
    },
    {
     "title": "38 CFR 4.71 Plate I (image)",
     "url": "https://www.law.cornell.edu/images/ecfr/ec04no91.001.gif"
    },
    {
     "title": "38 CFR 4.71 Plate II (image)",
     "url": "https://www.law.cornell.edu/images/ecfr/ec04no91.002.gif"
    }
   ],
   "notes": "Text: 'Plates I and II provide a standardized description of ankylosis and joint motion measurement. The anatomical position is considered as 0°, with two major exceptions'. The degree values are printed on the plate images; I read them from the GIFs: 'The Elbow Flexion' 0-145°; wrist 'Palmar Flexion' 80° and 'Dorsiflexion (Extension)' 70°; 'The Knee Flexion and Extension' 0-140°; 'The Hip Flexion' 125°; 'The Hip Abduction' 45°. These are regulatory reference ranges for disability rating, not a measured sample. Use the 80° wrist flexion as the wrist limit in the hand-to-mouth geometry."
  },
  {
   "key": "va_rating_limited_elbow_knee_flexion",
   "label": "VA disability ratings for limited elbow flexion (38 CFR 4.71a, DC 5206) and limited knee flexion (DC 5260)",
   "status": "official",
   "values": "{\"elbow_flexion_limited_to_deg_rating_0pct\":110,\"elbow_flexion_limited_to_deg_rating_10pct\":100,\"elbow_flexion_limited_to_deg_rating_20pct\":90,\"elbow_flexion_limited_to_deg_rating_30pct_major_arm\":70,\"elbow_flexion_limited_to_deg_rating_40pct_major_arm\":55,\"elbow_flexion_limited_to_deg_rating_50pct_major_arm\":45,\"knee_flexion_limited_to_deg_rating_0pct\":60,\"knee_flexion_limited_to_deg_rating_10pct\":45,\"knee_flexion_limited_to_deg_rating_20pct\":30,\"knee_flexion_limited_to_deg_rating_30pct\":15}",
   "sources": [
    {
     "title": "38 CFR 4.71a Schedule of ratings, musculoskeletal system (LII)",
     "url": "https://www.law.cornell.edu/cfr/text/38/4.71a"
    }
   ],
   "notes": "Text as extracted: '5206 Forearm, limitation of flexion of: | Flexion limited to 45° | 50 | 40 | Flexion limited to 55° | 40 | 30 | Flexion limited to 70° | 30 | 20 | Flexion limited to 90° | 20 | 20 | Flexion limited to 100° | 10 | 10 | Flexion limited to 110° | 0 | 0' (major | minor arm, percent). '5260 Leg, limitation of flexion of: Flexion limited to 15° 30; 30° 20; 45° 10; 60° 0'. This is a compensation schedule, not a study of function. Still, it is an official judgement that elbow flexion down to 110° carries no rated impairment and that rated impairment starts at 100°. That supports putting a 'can't reach the face' threshold near 100° rather than at the ~130° that natural eating uses."
  },
  {
   "key": "elbow_flexion_vs_bmi_zwerus",
   "label": "Elbow flexion falls as BMI rises: 352 healthy adults (166 men), goniometer, active and passive",
   "status": "measured",
   "values": "{\"n_total\":352,\"n_men\":166,\"age_range_yr\":[18,79],\"men_active_flexion_deg\":143,\"men_passive_flexion_deg\":147,\"men_active_flexion_by_bmi_deg\":{\"bmi_lt_18_5\":151,\"bmi_18_5_25\":145,\"bmi_25_30\":140,\"bmi_ge_30\":136},\"men_passive_flexion_by_bmi_deg\":{\"bmi_lt_18_5\":155,\"bmi_18_5_25\":149,\"bmi_25_30\":144,\"bmi_ge_30\":140},\"men_n_by_bmi\":{\"bmi_lt_18_5\":6,\"bmi_18_5_25\":105,\"bmi_25_30\":40,\"bmi_ge_30\":15},\"r_bmi_vs_active_flexion\":[-0.57,-0.59],\"r_bmi_vs_passive_flexion\":[-0.59,-0.59],\"men_active_flexion_by_age_deg\":{\"18_29\":146,\"30_39\":145,\"40_49\":143,\"50_59\":143,\"60_69\":141,\"70_79\":139}}",
   "sources": [
    {
     "title": "Zwerus et al., Shoulder Elbow 2019;11(3):215-224, doi 10.1177/1758573217728711 (PMC full text)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6555111/"
    },
    {
     "title": "Europe PMC REST record (abstract) for PMC6555111",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=PMCID:PMC6555111&resultType=core&format=json"
    }
   ],
   "notes": "Results, Correlations: 'BMI correlated moderately negative on flexion, both active (-0.57; -0.59) and passive (-0.59; -0.59).' The pairs are probably dominant and non-dominant sides; the page does not say whether r is pooled across sexes. Discussion: 'A higher BMI correlated with a lower ROM for active and passive flexion.' Table 4, men, dominant side, mean (95% CI): BMI <18.5 (n=6) active 151 (148-155), passive 155 (152-159); 18.5-24.99 (n=105) active 145 (144-146), passive 149 (148-150); 25-29.99 (n=40) active 140 (139-142), passive 144 (143-'1456' sic, probably 146); >=30 (n=15) active 136 (134-138), passive 140 (138-143). The authors note 'the underweight and obese groups are relatively small.' Methods: universal goniometer, '0° shoulder anteflexion and 0° abduction and a maximally supinated forearm'. The abstract (Europe PMC) confirms: 'Elbow ROM is influenced by age, sex and BMI.' I read the table through the PMC page with a fetch tool; direct curl was blocked by a CAPTCHA. Caveats: the extra tissue in these groups is mostly fat, not muscle; the BMI groups may differ in age (about -1° per decade in men); Dutch adults, not soldiers. It is the best quantitative evidence I found that soft-tissue volume reduces elbow flexion."
  },
  {
   "key": "elbow_flexion_bodybuilders_review_statement",
   "label": "Review statement: bodybuilders may flex the elbow only to about 130 deg because of muscle bulk (no measured sample)",
   "status": "reported",
   "values": "{\"normal_flexion_max_deg\":145,\"bodybuilder_flexion_max_deg\":130,\"hyperlax_hyperextension_deg\":10,\"functional_arc_deg\":[30,130]}",
   "sources": [
    {
     "title": "Islam et al., The Anatomy and Biomechanics of the Elbow, Open Orthop J 2020;14:95, doi 10.2174/1874325002014010095",
     "url": "https://openorthopaedicsjournal.com/VOLUME/14/PAGE/95/FULLTEXT/"
    }
   ],
   "notes": "Section 6.1: 'The normal arc of elbow flexion is 0 [full extension] to 145 degrees. However, there is considerable variation between individualS: hyperlax individuals may hyperextend by 10 degrees or more and bodybuilders may flex only up to 130 degrees due to their muscle bulk [1].' Reference [1] is DeLee, Drez & Miller, Orthopaedic Sports Medicine: Principles and Practice, chapter 'Biomechanics of the elbow and forearm', 2003. I did not fetch that textbook. The statement gives no sample, method or bodybuilder size, so treat it as expert opinion. It is the only source found that names muscle bulk as limiting elbow flexion in bodybuilders. An open-access, peer-reviewed journal, but a narrative review."
  },
  {
   "key": "ansur2_standing_posture_limb_contact",
   "label": "ANSUR II measuring postures: heels together, elbows lightly touching the sides ('muscular upper arms' may not), thighs apart for thigh girth",
   "status": "official",
   "values": "{\"handbook_section\":\"6.1.1\",\"handbook_page\":73,\"scan_posture_feet_apart_m\":0.30,\"tabletop_measures_feet_apart_m\":0.10}",
   "sources": [
    {
     "title": "Hotzman et al. 2011, NATICK/TR-11/017, ANSUR II Measurer's Handbook",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR11-017.pdf"
    }
   ],
   "notes": "Sec. 6.1.1 (p.73, PDF p.83): 'participants are asked to stand erect, with their weight evenly distributed on both feet, heels together as much as possible, legs and trunk straight without stiffness ... The arms are to hang relaxed with the elbows lightly touching the sides with the palms of the hands beside, but not touching, the thighs. On individuals with muscular upper arms, the elbows may not touch the sides.' Sec. 6.4.79 Thigh Circumference: 'The legs are spread apart just enough so that the thighs do not touch'. This implies the thighs often touch at the top in the standard stance. Sec. 6.4.28 Crotch Height: the participant spreads the legs to place the blade, 'then brings the heels back together'. Sec. 6.1.2 Anthropometric Sitting: 'the upper arms are hanging loosely at the sides ... flex the elbows 90° with the hands straight, palms facing inward' (the posture for forearm-forearm breadth, sec. 6.4.40). Body scans used 'feet are 30 cm apart ... arms straight, and held away from the body'. These sentences anchor the definitions: an ordinary man's arms hang with the elbows lightly touching, and muscle bulk pushing the elbows off the sides is already seen inside the human range. sha256 of the PDF begins d31d6333."
  },
  {
   "key": "elbow_rom_daily_tasks_morrey1981",
   "label": "Morrey, Askew & Chao 1981: elbow motion needed for 15 daily tasks (33 normal adults, electrogoniometer)",
   "status": "measured",
   "values": "{\"n\":33,\"n_men\":15,\"most_adl_flexion_deg\":[30,130],\"reach_occiput_flexion_deg\":140,\"tie_shoe_flexion_deg\":15,\"forearm_pronation_deg\":50,\"forearm_supination_deg\":50}",
   "sources": [
    {
     "title": "Morrey BF, Askew LJ, Chao EY. J Bone Joint Surg Am 1981;63(6):872-7, PMID 7240327 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=7240327&rettype=abstract&retmode=text"
    }
   ],
   "notes": "Abstract: 'Activities of dressing and hygiene require elbow positioning from about 140 degrees of flexion needed to reach the occiput to 15 degrees of flexion required to tie a shoe ... Other activities of daily living (such as eating, using a telephone, or opening a door) are accomplished with arcs of motion of varying magnitudes. Most of the activities of daily living that were studied in this project can be accomplished with 100 degrees of elbow flexion (from 30 to 130 degrees)'. The full text is paywalled (JBJS returned 402). The per-task values widely quoted second-hand (e.g. drinking 72-129°) were not seen in a primary source and are not used. Electrogoniometer measurements of natural, unconstrained movement; 'most' tasks, not all."
  },
  {
   "key": "elbow_rom_feeding_safaee_rad1990",
   "label": "Safaee-Rad et al. 1990: elbow flexion 70-130 deg for three feeding tasks (10 men)",
   "status": "measured",
   "values": "{\"n_men\":10,\"feeding_elbow_flexion_deg\":[70,130],\"shoulder_flexion_deg\":[5,45],\"shoulder_abduction_deg\":[5,35],\"wrist_flexion_to_extension_deg\":[-10,25]}",
   "sources": [
    {
     "title": "Safaee-Rad R et al. Arch Phys Med Rehabil 1990;71(7):505-9, PMID 2350221 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=2350221&rettype=abstract&retmode=text"
    }
   ],
   "notes": "Abstract: 'Ten able-bodied men were studied as they performed three feeding tasks--eating with a spoon, eating with a fork, and drinking from a handled cup ... the required ranges of motion for the feeding tasks were 5 degrees to 45 degrees shoulder flexion, 5 degrees to 35 degrees shoulder abduction ... 70 degrees to 130 degrees elbow flexion'. 3D measurement system, natural movement. Small sample (10)."
  },
  {
   "key": "elbow_rom_contemporary_sardelli2011",
   "label": "Sardelli et al. 2011: positional tasks reach 149 deg flexion; functional tasks max 142 deg (cell phone); 25 people, optical tracking",
   "status": "measured",
   "values": "{\"n\":25,\"positional_flexion_min_deg\":27,\"positional_flexion_max_deg\":149,\"positional_flexion_max_sd_deg\":5,\"functional_flexion_min_deg\":23,\"functional_flexion_max_deg\":142,\"functional_flexion_max_sd_deg\":3,\"max_functional_arc_deg\":130}",
   "sources": [
    {
     "title": "Sardelli M, Tashjian RZ, MacWilliams BA. J Bone Joint Surg Am 2011;93(5):471-7, PMID 21368079 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=21368079&rettype=abstract&retmode=text"
    }
   ],
   "notes": "Abstract: 'Positional tasks required a minimum (mean and standard deviation) of 27° ± 7° of flexion and a maximum of 149° ± 5° of flexion ... For functional tasks, the maximum flexion arc was 130° ± 7°, with a minimum value recorded as 23° ± 6° and a maximum value recorded as 142° ± 3°. All of these were for the cellular telephone task.' Conclusion: functional ROM 'may be greater than previously reported'. The abstract does not say which positional task needed 149°."
  },
  {
   "key": "elbow_rom_adl_raiss2007",
   "label": "Raiss et al. 2007: 10 daily tasks needed elbow 0-36-146 deg (7 people, 3D motion analysis)",
   "status": "measured",
   "values": "{\"n\":7,\"elbow_flexion_min_deg\":36,\"elbow_flexion_max_deg\":146,\"elbow_arc_deg\":110}",
   "sources": [
    {
     "title": "Raiss P et al. Z Orthop Unfall 2007;145(4):493-8, PMID 17912671 (English abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=17912671&rettype=abstract&retmode=text"
    }
   ],
   "notes": "Abstract: tasks included 'eating with a spoon, combing hair, genital hygiene, using a telephone, typing on a keyboard, drinking from a glass ...'; 'To perform the ADL, an elbow extension/flexion of 0 - 36 - 146 degrees (total 110 degrees) ... was needed.' Article in German; only the English abstract was read. Very small sample (7)."
  },
  {
   "key": "elbow_flexion_drinking_murphy2006",
   "label": "Murphy et al. 2006: peak elbow flexion while drinking from a glass 136.4 deg (20 adults)",
   "status": "measured",
   "values": "{\"n\":20,\"n_men\":9,\"mean_age_yr\":48.2,\"drinking_max_elbow_flexion_deg\":136.4,\"sd_deg\":3.8,\"ci95_deg\":[134.6,138.1]}",
   "sources": [
    {
     "title": "Murphy MA, Sunnerhagen KS, Johnels B, Willen C. J NeuroEng Rehabil 2006;3:18, doi 10.1186/1743-0003-3-18 (PMC1562432 full text via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=1562432&rettype=xml"
    }
   ],
   "notes": "Table 2: 'Elbow ... Drinking (maximal flexion) 136.4 3.8 134.6-138.1' (mean, SD, 95% CI). 'The maximal elbow flexion occurred during the drinking phase.' Subjects: '20 control subjects (9 male and 11 female). The mean age was 48.2 years (range 31-64).' The elbow angle comes from skin markers ('the angle between the vectors joining elbow and wrist markers and the elbow and shoulder markers'), so it is not identical to a goniometer reading. Optoelectronic motion capture; pilot study."
  },
  {
   "key": "elbow_rom_adl_review_oosterwijk2018",
   "label": "Systematic review (36 studies, 66 daily tasks): unimpaired people used up to full elbow flexion (150 deg) in personal care, eating and drinking",
   "status": "reported",
   "values": "{\"n_studies\":36,\"n_tasks\":66,\"max_elbow_flexion_used_deg\":150,\"shoulder_flexion_abduction_needed_deg\":130}",
   "sources": [
    {
     "title": "Oosterwijk AM et al. Physiother Theory Pract 2018;34(7):505-528, PMID 29377745 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=29377745&rettype=abstract&retmode=text"
    },
    {
     "title": "Hanze University research portal record (no full text)",
     "url": "https://research.hanze.nl/en/publications/shoulder-and-elbow-range-of-motion-for-the-performance-of-activit/"
    }
   ],
   "notes": "Abstract: 'Thirty-six studies involving a total of 66 ADL tasks were included. Results demonstrated that unimpaired participants used up to full elbow flexion (150°) in personal care, eating, and drinking tasks. For shoulder flexion and abduction approximately 130° was necessary.' Full text not available, so the per-task angles were not read. 'Used' is not 'required': people use their full range when it is available."
  },
  {
   "key": "elbow_rom_compensated_vasen1995",
   "label": "Vasen et al. 1995: with flexion braced at 120 deg, 49 of 50 adults still did all 12 daily tasks (using other joints to compensate)",
   "status": "measured",
   "values": "{\"n_subjects\":50,\"n_limbs\":100,\"n_tasks\":12,\"brace_step_deg\":15,\"flexion_limit_all_tasks_deg\":120,\"extension_limit_all_tasks_deg\":75,\"subjects_completing_all_tasks\":49}",
   "sources": [
    {
     "title": "Vasen AP, Lacey SH, Keith MW, Shaffer JW. J Hand Surg Am 1995;20(2):288-92, PMID 7775772 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=7775772&rettype=abstract&retmode=text"
    }
   ],
   "notes": "Abstract: 'One hundred normal upper extremities in 50 adults were sequentially studied in a Bledsoe brace, which limited elbow motion. The amount of flexion and extension of the elbow was serially limited by 15 degree increments ... Overall, 49 of the subjects performed all of the tasks with extension limited at 75 degrees and flexion limited at 120 degrees. By isolating the allowable range of motion of the elbow and allowing for compensatory motions and strategies of the normal adjacent joints, the functional elbow range of motion is established as 75 degrees-120 degrees flexion.' The abstract does not list the 12 tasks or say how many people failed at the next step (105°). Full text not fetched (paywalled). This is the best source that compensation lowers the flexion needed below the ~130° of natural movement."
  },
  {
   "key": "obesity_reduces_rom_park2010_jeong2018",
   "label": "Extra soft tissue reduces joint range: obese men lose shoulder adduction (up to 39%) and knee flexion; pre-obese and obese people lose elbow and knee flexion",
   "status": "measured",
   "values": "{\"park2010_n_obese_men\":20,\"park2010_n_nonobese_men\":20,\"park2010_motions_tested\":30,\"park2010_motions_reduced\":9,\"park2010_max_reduction_pct_left_shoulder_adduction\":38.9,\"park2010_min_sig_reduction_pct_right_knee_flexion\":11.1,\"escalante1999_n\":687}",
   "sources": [
    {
     "title": "Park W, Ramachandran J, Weisman P, Jung ES. Obesity effect on male active joint range of motion. Ergonomics 2010;53(1):102-8, PMID 20069486 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=20069486&rettype=abstract&retmode=text"
    },
    {
     "title": "Jeong Y, Heo S, Lee G, Park W. Pre-obesity and obesity impacts on passive joint range of motion. Ergonomics 2018;61(9):1223-1231, PMID 29775425 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=29775425&rettype=abstract&retmode=text"
    },
    {
     "title": "Escalante A et al. Determinants of hip and knee flexion range. Arthritis Care Res 1999;12(1):8-18, PMID 10513485 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=10513485&rettype=abstract&retmode=text"
    }
   ],
   "notes": "Park 2010: 'Obesity significantly reduced RoM for nine of the 30 motions: shoulder extensions and adductions, lumbar spine extension and lateral flexions and knee flexions. The largest significant RoM reduction was 38.9% for the left shoulder adduction. The smallest was 11.1% for the right knee flexion. The obesity-associated RoM reductions appear to be mainly due to the mechanical interposition and obstruction of inter-segmental motions caused by excess fat in the obese body.' Elbow flexion was NOT among the significant motions in this small active-ROM study (Zwerus, with more men, did find a BMI effect). The full text with per-motion values and the adduction method was not fetched (paywalled). Jeong 2018 (passive, 'A publicly available passive RoM dataset was analysed', probably the CDC set, unconfirmed): 'The pre-obese and obese groups were found to have significantly smaller RoM means than the normal-weight for elbow flexion and supination, hip extension and flexion, knee flexion and ankle plantar flexion.' Escalante 1999 (687 people aged 65-79): 'rising BMI ... with reduced FR of both hips and knees'. All three concern fat, not muscle; the mechanism they name (tissue interposition) is the one the chart's limits model."
  },
  {
   "key": "lifters_rom_chang1988_and_later",
   "label": "Joint range in power lifters and bodybuilders: shoulder range lower than in controls; training alone is not the cause (Chang 1988 abstract has no joint detail)",
   "status": "measured",
   "values": "{\"chang1988_n_lifters\":10,\"chang1988_n_controls\":10,\"barlow2002_n_bodybuilders\":29,\"barlow2002_n_controls\":25,\"barlow2002_total_shoulder_rotation_bb_deg\":166,\"barlow2002_total_shoulder_rotation_ctrl_deg\":180,\"barlow2002_internal_rotation_loss_deg\":11,\"gadomski2018_n_powerlifters\":15,\"gadomski2018_n_controls\":15,\"afonso2021_n_rcts\":11,\"afonso2021_n_participants\":452,\"afonso2021_effect_size\":-0.22,\"afonso2021_es_ci95\":[-0.55,0.12]}",
   "sources": [
    {
     "title": "Chang DE, Buschbacher LP, Edlich RF. Limited joint mobility in power lifters. Am J Sports Med 1988;16(3):280-4, PMID 3381987 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=3381987&rettype=abstract&retmode=text"
    },
    {
     "title": "Barlow JC et al. Shoulder strength and range-of-motion characteristics in bodybuilders. J Strength Cond Res 2002;16(3):367-72, PMID 12173950 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=12173950&rettype=abstract&retmode=text"
    },
    {
     "title": "Gadomski SJ, Ratamess NA, Cutrufello PT. Range of motion adaptations in powerlifters. J Strength Cond Res 2018;32(11):3020-3028, PMID 30204657 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=30204657&rettype=abstract&retmode=text"
    },
    {
     "title": "Spence AJ et al. Range of motion predicts performance in national-level New Zealand male powerlifters. J Strength Cond Res 2023;37(1):123-128, PMID 36515597 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=36515597&rettype=abstract&retmode=text"
    },
    {
     "title": "Afonso J et al. Strength training versus stretching for improving range of motion: systematic review and meta-analysis. Healthcare 2021;9(4):427, PMID 33917036 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=33917036&rettype=abstract&retmode=text"
    }
   ],
   "notes": "Chang 1988 abstract (whole text): 'In this study we compared the flexibility of 10 power lifters with 10 age-matched nonpower lifters as controls. To do this, we used goniometric measurements, the behind the back reach test, and the sit and reach test. The sit and reach test was the only measurement that showed the flexibility of the power lifters to be greater than that of the nonpower lifters.' The full text (SAGE) returned 403, so which joints were limited, and by how much, is UNKNOWN; two letters by Herrick (PMIDs 3239626, 2633753) comment on it. Barlow 2002: 'Bodybuilders sho … [1,082 more characters on this line; the full prompt is in prompts/a1d2252031e7aa4aa.txt]
  },
  {
   "key": "thigh_calf_contact_zelle",
   "label": "Thigh-calf contact starts beyond about 130 deg of knee flexion; bigger thigh and calf girths give more contact (10 healthy adults, pressure mats)",
   "status": "measured",
   "values": "{\"n\":10,\"contact_onset_min_knee_flexion_deg\":130,\"max_knee_flexion_squat_deg\":151.8,\"max_knee_flexion_kneel_deg\":156.4,\"max_contact_force_squat_pct_bodyweight\":34.2,\"max_contact_force_kneel_pct_bodyweight\":30.9,\"r_girth_vs_force_reduction\":0.89,\"hemmerich2006_squat_heels_up_knee_flexion_deg\":157,\"hemmerich2006_sd_deg\":6}",
   "sources": [
    {
     "title": "Zelle J et al. Thigh-calf contact force measurements in deep knee flexion. Clin Biomech 2007;22(7):821-6, PMID 17512647 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=17512647&rettype=abstract&retmode=text"
    },
    {
     "title": "Zelle J et al. Thigh-calf contact: does it affect the loading of the knee in the high-flexion range? J Biomech 2009;42(5):587-93, PMID 19200996 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=19200996&rettype=abstract&retmode=text"
    },
    {
     "title": "Hemmerich A et al. Hip, knee, and ankle kinematics of high range of motion activities of daily living. J Orthop Res 2006;24(4):770-81, PMID 16514664 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=16514664&rettype=abstract&retmode=text"
    }
   ],
   "notes": "Zelle 2007: 'In general, thigh-calf contact did not take place below 130 degrees knee flexion. The average maximal contact forces for each leg were 34.2% bodyweight during squatting and 30.9% bodyweight during kneeling. Corresponding average maximal knee flexion angles were 151.8 degrees during squatting and 156.4 degrees during kneeling. Thigh and calf circumferences were correlated with the contact force measurements.' Zelle 2009: 'there was a clear correlation between a subject's thigh and calf circumference and the force reduction at maximal flexion due to thigh-calf contact (R=0.89)'. Hemmerich 2006 (30 Indian adults): 'A mean maximum flexion of 157 degrees +/- 6 degrees at the knee joint was required for squatting with heels up.' Useful as a compression allowance: under about a third of body weight, soft tissue lets the knee bend some 20-25° past first contact. This is the only quantitative contact-onset vs end-of-range data found; it is for the knee, not the elbow."
  },
  {
   "key": "obese_gait_step_width",
   "label": "Thigh tissue widens gait: obese men walk with 0.16 m step width vs 0.08 m in non-obese men",
   "status": "measured",
   "values": "{\"spyropoulos1991_n_obese_men\":12,\"step_width_obese_m\":0.16,\"step_width_nonobese_m\":0.08,\"stride_obese_m\":1.25,\"stride_nonobese_m\":1.67,\"speed_obese_m_s\":1.09,\"speed_nonobese_m_s\":1.64,\"scataglini2025_n_studies\":14}",
   "sources": [
    {
     "title": "Spyropoulos P et al. Biomechanical gait analysis in obese men. Arch Phys Med Rehabil 1991;72(13):1065-70, PMID 1741658 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=1741658&rettype=abstract&retmode=text"
    },
    {
     "title": "Browning RC, Kram R. Effects of obesity on the biomechanics of walking at different speeds. Med Sci Sports Exerc 2007;39(9):1632-41, PMID 17805097 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=17805097&rettype=abstract&retmode=text"
    },
    {
     "title": "Scataglini S et al. Gait in adults with obesity vs normal weight: systematic review and meta-analysis. Int J Obes 2025;49(4):541-553, PMID 39562690 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=39562690&rettype=abstract&retmode=text"
    }
   ],
   "notes": "Spyropoulos 1991 (12 obese men, 70-99% above ideal weight, cinematography): 'obese persons take significantly (p less than .001) shorter strides (1.25m vs 1.67m) and exhibit step widths (.16m) twice those of nonobese persons (.08m)'; conclusion: gait differs 'mainly because of the excessive adipose tissue inside their thighs.' Browning & Kram 2007: obese adults had 'much greater ... step width (m)'. Scataglini 2025 meta-analysis of 14 case-control studies: 'an increase in step width'. Note that 0.16 m is close to the ~0.17 m hip-joint spacing derived below, which links 'thighs touch to the knee with the legs vertical' to an obese-type wide gait. Old, small sample; the cause is the authors' interpretation."
  },
  {
   "key": "hip_joint_centre_regression_hara2016",
   "label": "Hip joint centre lateral offset = 8 mm + 0.086 x leg length (Hara et al. 2016, imaging-based regression)",
   "status": "measured",
   "values": "{\"hjc_ml_intercept_mm\":8,\"hjc_ml_slope_per_mm_leg_length\":0.086,\"ml_accuracy_mm\":4.4,\"leg_length_definition\":\"ASIS to medial malleolus through the medial femoral epicondyle\"}",
   "sources": [
    {
     "title": "Hara R, McGinley J, Briggs C, Baker R, Sangeux M. Predicting the location of the hip joint centres, impact of age group and sex. Sci Rep 2016;6:37707, doi 10.1038/srep37707 (PMC page)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5121588/"
    },
    {
     "title": "Same article, PMC full-text XML via NCBI E-utilities",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=5121588&rettype=xml"
    },
    {
     "title": "Harrington ME et al. Prediction of the hip joint centre ... based on MRI. J Biomech 2007;40(3):595-602, PMID 16584737 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=16584737&rettype=abstract&retmode=text"
    }
   ],
   "notes": "Hara et al.: 'We propose the equations with leg length as single predictor'; read via the PMC page: HJC_X = 11 - 0.063 LL, HJC_Y (medial-lateral) = 8 + 0.086 LL, HJC_Z = -9 - 0.078 LL (mm; units implied by mm errors). Leg length = 'Distance from ASIS to medial malleolus through the medial epicondyle of the femur'. 'Using leg length as the single predictor, the accuracy of the regression equations to locate the HJC was 5.2 mm, 4.4 mm, and 3.8 mm in the posterior-anterior, medial-lateral and inferior-superior directions'; 'our analysis did not support the use of additional ... (age, sex) predictors'. The formulas are images in the XML, so I read them through the rendered page. Harrington 2007 (8 adults, MRI) found pelvic width and depth best for the medial-lateral direction. Its exact equation (reported second-hand as ML = 0.33 x inter-ASIS + 7.3 mm) was NOT verified in the primary source. Used to fix the leg axes for the thigh-contact test."
  },
  {
   "key": "ansur_thigh_gap_legs_vertical",
   "label": "Gap between the thighs just above the knee with legs vertical: ANSUR II men (estimate from girths and a hip-joint regression)",
   "status": "estimate",
   "values": "{\"inter_hjc_p50_m\":0.174,\"inter_hjc_p5_p95_m\":[0.160,0.189],\"gap_above_knee_p50_m\":0.044,\"gap_above_knee_p5_p95_m\":[0.024,0.063],\"men_with_no_gap\":1,\"n_men\":4082,\"lower_thigh_width_factor_to_close_p50\":1.34,\"lower_thigh_width_factor_to_close_p5_p95\":[1.17,1.53],\"factor_if_feet_shoulder_width_apart_p50\":2.17}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab), same file as build-calculator/data/ansur2/ANSUR_II_MALE_Public.csv",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "Hara et al. 2016 Sci Rep 6:37707 (hip joint centre regression)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5121588/"
    }
   ],
   "notes": "Script: scratchpad/research/functional-limits/scripts/ansur_thighgap.py. Per man: leg length LL is estimated as iliocristale height - 0.06 m - (lateral malleolus height + 0.01 m), an assumption because ANSUR II has no ASIS height. HJC offset = 8 + 0.086 LL (mm). Legs vertical means ankle centres directly under the hip joint centres (0° hip abduction). Lower-thigh half-width = ANSUR lower thigh circumference (suprapatellar site) / 2π, assuming a circular cross-section centred on the leg axis. Result: the median man has about 4.4 cm between his thighs just above the knee; only 1 of 4,082 men has zero gap; the median man's lower-thigh width must grow about 1.34x about the leg axis to close it. For comparison, with ankle centres one biacromial breadth apart ('feet shoulder-width'), the factor is about 2.2. With heels together (ANSUR standing), most men's knees nearly meet, so the stance choice moves this limit by a large amount. Ignores: non-circular thighs, medial bulk (vastus medialis, adductors) off the axis, compression, knee valgus or varus. Relies on existing builds.json keys ansur2_dataset and ansur2_thigh."
  },
  {
   "key": "ansur_seated_arm_angle",
   "label": "How far ANSUR II men's upper arms angle out when hanging at the sides (seated, elbows 90 deg), from forearm-forearm breadth (estimate)",
   "status": "estimate",
   "values": "{\"n_men\":4082,\"angle_p5_deg\":3.6,\"angle_p50_deg\":10.0,\"angle_p95_deg\":16.5,\"angle_p99_deg\":19.2,\"angle_max_deg\":26.2,\"angle_range_over_assumptions_p50_deg\":[9.0,11.9],\"angle_range_over_assumptions_max_deg\":[25.1,28.5],\"corr_with_bmi\":0.69,\"corr_with_flexed_biceps\":0.57,\"median_by_bmi_deg\":{\"lt25\":6.4,\"25_30\":9.9,\"30_35\":13.2,\"ge35\":15.5}}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II Measurer's Handbook, sec. 6.1.2 sitting posture and 6.4.40 forearm-forearm breadth",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR11-017.pdf"
    }
   ],
   "notes": "Script: scratchpad/research/functional-limits/scripts/ansur_armangle.py. Posture: 'the upper arms are hanging loosely at the sides ... flex the elbows 90° ... palms facing inward'. Forearm-forearm breadth is the maximum distance across the outsides of the forearms. Angle = asin((FFB/2 - flexed forearm girth/2π - (biacromial/2 - 0.02)) / (acromion-radiale - 0.03)). The shoulder-joint offset (0.015-0.03 m tried) and upper-arm length are assumptions. Result: men's hanging arms angle out about 10° (median), 19° at the 99th percentile and 26° at most (a short man, BMI 35.5). The angle rises with BMI (r 0.69). The highest values belong to high-BMI men, not to the men with the biggest arms. A rough but data-based spread of the human range for the arm-hang limit; seated, not standing."
  },
  {
   "key": "arm_hang_model_ansur_median",
   "label": "Front-view arm rest angle vs width factor, ANSUR II median man (simple 2D model, estimate)",
   "status": "estimate",
   "values": "{\"standing_rest_angle_k1_deg\":[4,6],\"test_below_chest_height_deg_by_k\":{\"1.0\":6,\"1.1\":15,\"1.2\":23,\"1.3\":29,\"1.4\":35,\"1.5\":39,\"1.6\":43,\"1.8\":50,\"2.0\":56,\"2.5\":64,\"3.0\":70},\"test_elbow_and_below_deg_by_k\":{\"1.0\":4,\"1.1\":8,\"1.2\":12,\"1.3\":16,\"1.4\":20,\"1.5\":24,\"1.6\":28,\"1.8\":36,\"2.0\":43,\"2.5\":60,\"3.0\":76},\"k_at_30deg\":[1.3,1.65]}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II Measurer's Handbook (standing posture, elbows lightly touching)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR11-017.pdf"
    }
   ],
   "notes": "Script: scratchpad/research/functional-limits/scripts/arm_hang.py. Uses ANSUR medians: shoulder joint 2 cm medial and 4 cm below the acromion (estimate); torso half-widths from chest, waist and hip breadth at their landmark heights; arm half-widths from flexed biceps x 0.93, flexed forearm and wrist girths over 2π. The arm is straight and rotates about the fixed shoulder joint. Widths scale by k about each segment's own axis; the skeleton stays fixed. At k=1 the arm rests 4-6° out, matching ANSUR's 'elbows lightly touching the sides', which checks the model. Testing from the armpit itself is meaningless: arm and torso are joined there by the axillary folds, and the contact would force about 10° even at k=1, so the test region must start below the folds. The choice of test region moves the 30° crossing between k = 1.3 and 1.65. The torso scaled about the midline overstates torso growth (the ribcage does not grow), so real muscular builds with small waists reach the limit later through the waist and sooner through the lats."
  },
  {
   "key": "hand_to_mouth_reach_geometry",
   "label": "Elbow flexion needed for the hand to touch the mouth, from arm and head geometry (ANSUR II median proportions, estimate)",
   "status": "estimate",
   "values": "{\"shoulder_to_mouth_distance_m\":0.278,\"flexion_needed_wrist_straight_deg\":123,\"flexion_needed_wrist_flexed_80deg_deg\":99,\"chin_wrist_straight_deg\":127,\"chin_wrist_flexed_deg\":102,\"nose_tip_wrist_flexed_deg\":94,\"opposite_cheek_wrist_flexed_deg\":91,\"same_side_cheek_wrist_flexed_deg\":107,\"sensitivity_upper_arm_length_0_29_to_0_33_m_deg\":[98,100],\"chin_forward_3cm_wrist_flexed_deg\":96}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "38 CFR 4.71 Plate I (wrist palmar flexion 80 deg)",
     "url": "https://www.law.cornell.edu/images/ecfr/ec04no91.001.gif"
    }
   ],
   "notes": "Script: scratchpad/research/functional-limits/scripts/reach.py. With the shoulder free, a hand point can touch the mouth only if its distance from the shoulder joint can equal the shoulder-to-mouth distance. Elbow flexion sets the closest the hand can come, so the needed flexion is where that closest distance equals the mouth distance. Inputs (ANSUR medians, with estimates): shoulder joint to elbow axis 0.31 m (acromion-radiale 0.335 minus offsets), elbow to wrist 0.265 m, hand 0.193 m. Mouth relative to shoulder joint: 0.19 m medial, 0.17 m up, 0.11 m forward (from stature, tragion-to-top-of-head and menton-sellion length; estimate). Straight wrist: about 123° (chin 127°), close to the ~130° the daily-task studies measured for eating and drinking (Morrey, Safaee-Rad), which supports the geometry. Wrist flexed to its 80° limit (38 CFR): about 99° for the mouth, 91-107° across the face. The planar model ignores neck movement, shoulder-girdle movement, and bulk on the chest and deltoid that can block the arm from crossing in front of the body."
  },
  {
   "key": "elbow_flexion_vs_girth_wedge_model",
   "label": "Maximum elbow flexion vs arm girth: wedge contact model calibrated to 145 deg and checked against the BMI data (estimate)",
   "status": "estimate",
   "values": "{\"model\":\"tan((180-phi_max)/2) = c * k^p; k = (flexed biceps + flexed forearm girth) / 0.614 m\",\"c_active\":0.3153,\"reference_girth_sum_m\":0.614,\"ansur_overall_median_k\":1.086,\"p_pure_geometry\":1.0,\"p_fitted_to_bmi_groups_active\":1.69,\"p_fitted_passive\":1.86,\"phi_max_deg_p1\":{\"k1.25\":137,\"k1.5\":129,\"k1.75\":122,\"k2.0\":116,\"k2.5\":104,\"k3.0\":93},\"phi_max_deg_p1_69\":{\"k1.25\":131,\"k1.5\":116,\"k1.75\":102,\"k2.0\":89},\"k_at_130deg\":[1.26,1.48],\"k_at_120deg\":[1.43,1.83],\"k_at_110deg\":[1.60,2.22],\"k_at_100deg\":[1.79,2.66]}",
   "sources": [
    {
     "title": "Zwerus et al. 2019 Shoulder Elbow (flexion by BMI group, men)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6555111/"
    },
    {
     "title": "ANSUR II male CSV (girths by BMI group)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "Scripts: scratchpad/research/functional-limits/scripts/elbow_fit.py and ansur_limits.py. Model: the upper arm and forearm close like a wedge until their front tissue fills it. If tissue thickness grows by k at a fixed contact distance, tan(half the remaining angle) grows by k (p=1). c is set so k=1 gives 145° (Zwerus normal-BMI men, active; CDC men 20-44 passive 144.6°; 38 CFR 145°). Check against data: ANSUR II median flexed biceps + forearm girth by BMI group is 555, 614, 666 and 718 mm (k = 0.90, 1, 1.085, 1.17). Zwerus's 151/145/140/136° then implies p = 1.6-2.0, a steeper loss than pure geometry. But p≈1.7 would put elite bodybuilder arms (girth about 1.7x the reference, e.g. a reported 0.61 m flexed arm) near 100°, far below the ~130° the Islam review states for bodybuilders. p=1 gives about 122-129° there. Possible reasons: much of a bodybuilder's arm girth is triceps behind the elbow, which does not block flexion; the BMI groups differ in age and fat; and mapping Dutch BMI groups onto ANSUR girths is approximate. Recommend p=1 as the main model with p≈1.7 as the pessimistic bound. Nothing measured above about k=1.2, so every value beyond is an extrapolation."
  },
  {
   "key": "soft_tissue_contact_models_survey",
   "label": "No published model found that predicts maximum joint flexion from limb girth or cross-section; the nearest are contact-force models and animation tissue simulation",
   "status": "reported",
   "values": "{\"wu2019_pf_force_reduction_pct\":42,\"wu2019_tf_force_reduction_pct\":57,\"singh2013_abdomen_thigh_contact_pct_bodyweight\":10.17,\"singh2013_n\":10,\"singh2013_mean_bmi\":39.04}",
   "sources": [
    {
     "title": "McAdams A et al. Efficient elasticity for character skinning with contact and collisions. ACM SIGGRAPH 2011 / ACM TOG 30(4)",
     "url": "https://media.disneyanimation.com/uploads/production/publication_asset/18/asset/elasticSkinning.pdf"
    },
    {
     "title": "Reed MP et al. Developing and implementing parametric human body shape models in ergonomics software (Jack)",
     "url": "https://mreed.umtri.umich.edu/mreed/pubs/Reed_2014_DHM_Jack.pdf"
    },
    {
     "title": "Wu JZ et al. Biomechanical modeling of deep squatting: effects of the interface contact between posterior thigh and shank. J Biomech 2019;96:109333, PMID 31558308 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=31558308&rettype=abstract&retmode=text"
    },
    {
     "title": "Singh B et al. Abdomen-thigh contact during forward reaching tasks in obese individuals. J Appl Biomech 2013;29(5):517-24, PMID 23183157 (abstract via NCBI E-utilities)",
     "url": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=23183157&rettype=abstract&retmode=text"
    }
   ],
   "notes": "McAdams 2011: 'a new algorithm for near-interactive simulation of skeleton driven, high resolution elasticity models ... Since body collisions, self collisions and soft-constraints are necessary for real-world examples, we present a simple framework for enforcing them.' Joint angles are inputs; tissue deforms to avoid passing through itself; the model does not output a range limit. Reed 2014 (Jack): figures 'can be scaled by inputting standard anthropometric dimensions ... However, the shapes of these scaled figures are often unrealistic, particularly for extreme body types'. The paper covers body shape, not joint range. Wu 2019 (AnyBody): 'in a deep squatting posture (knee flexion 120+ degrees), the posterior thigh/shank contact helps reduce the patellofemoral (PF) and tibiofemoral (TF) normal contact forces by 42% and 57%'. Singh 2013: 'This soft tissue apposition acts as a mechanical restriction'; mean contact force '10.17 ± 5.18% of body weight'. I found no RAMSIS or Jack documentation computing range limits from soft-tissue collision, and no paper predicting elbow flexion from arm cross-section. The wedge model in this set is our own derivation."
  }
 ],
 "recommendations": "Label every threshold below as an estimate on the page. All three use 2D outline contact, which the sources support as the real mechanism (CDC protocol; Zwerus; Park 2010).\n\n0. Implementation rule (essential). If the whole picture is stretched sideways about the body's midline, every gap (arm to torso, thigh to thigh) stretches too and never closes, so no limit can ever trip. Keep the skeleton fixed: shoulder joint centres, hip joint centres, elbow axes and leg axes scale with height only. Widen each segment's outline about its own axis: torso about the midline, each arm … [5,368 more characters on this line; the full prompt is in prompts/a1d2252031e7aa4aa.txt]
 "gaps": "Not fetched or not verified:\n- Norkin & White 'Measurement of Joint Motion', Kapandji, Magee and the AAOS 'Joint Motion' booklet. No primary text was accessible: Google Books API quota exhausted, publisher pages only. Their exact end-feel wording and the AAOS 150° norm are not cited. The soft-tissue end point rests on the CDC protocol, Zwerus 2019 and Islam 2020 instead.\n- Morrey 1981 full text (JBJS paywall, HTTP 402). Per-task angles (e.g. drinking 72-129°) are quoted second-hand everywhere and were not used; only the abstract (30-130°, occiput 140°) is.\n- Chang, Buschbacher & E … [2,500 more characters on this line; the full prompt is in prompts/a1d2252031e7aa4aa.txt]
}
```

</details>

**Subagent `verify:comics`** · build-comparison-research · started 2026-10-11 04:44:40 UTC

- checks: 16 (10 ok, 6 not ok).
- Not OK: thing_rocky_hide; kingpin_bulk_not_fat; juggernaut_composition (+3 more).
- The quotes and numbers hold up; the problems are in how some claims are labelled. I re-fetched more than 40 sources: 12 Marvel.com pages, three DK OCR texts, about 25 archive.org full-text queries, 11 fan-wiki pages and archive.org metadata.

<details>
<summary>Prompt, verbatim (54,550 characters)</summary>

Workflow run `wf_94de1f40-a68`, phase `Verify`, agent `a1ec50486b4dcb677`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a1ec50486b4dcb677.txt](prompts/a1ec50486b4dcb677.txt).

```text
Project: "Build Comparison", a chart that ranks male body builds by "muscle level" irrespective of height, from ordinary men through the limits of human possibility to the monstrous (comic characters, and two original 3 m characters, Rex and Ollie). Read /home/user/rex-strength-lab/build-comparison/BRIEF.md first (10 minutes): it states the decisions already made and the problems to solve.
The working score is FFMI after rescaling the body to 1.80 m at the same shape: S = 1.8 * FFM / H^3 (FFM = fat-free mass in kg, H = height in m), shown beside plain FFMI = FFM / H^2. A rough first pass gives: US Army median man about 24, Ronnie Coleman about 35-39, Eddie Hall about 38, the heaviest comic characters 57-81, Rex about 141 (tail excluded, height to crest). A solid ball of muscle as tall as the figure scores about 924.
The sister project /home/user/rex-strength-lab/build-calculator/ already holds 55 builds and 139 verified facts in data/builds.json (read its "facts" keys and labels before you start; do NOT re-research a fact that already exists there unless the brief needs a number it lacks, and say so when you rely on an existing key). ANSUR II CSVs are in /home/user/rex-strength-lab/build-calculator/data/ansur2/ (ANSUR_II_MALE_Public.csv, 4,082 men; values in mm and kg x10? check: weightkg is in tenths of kg, lengths in mm).
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent; a number is "sourced" only if you fetched the page or PDF and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher PDFs). Prefer primary or authoritative sources (journals, textbooks, government surveys, standards bodies, publisher handbooks); use fan sites or magazines only when nothing better exists, and label them so. Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". Write raw downloads and scripts under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
For each fact give: key (snake_case), label, status (measured | official | reported | derived | estimate | disputed), values (a JSON object as a string, SI units plus the original units), sources (title + URL actually fetched), and notes (what exactly the source says, its sample, caveats, how good the evidence is).

You are a skeptical fact-checker for the topic "comics". Below are the researcher's facts and recommendations. Re-fetch the cited URLs for every fact the chart is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, quotation and status against what the source actually says; recompute every derived number you can (re-run computations on the ANSUR II CSV where relevant). Mark ok=false with a correction for anything wrong, mislabelled (for example a fan wiki or a magazine marked official or measured; a sample maximum called a limit; a secondary summary presented as the primary paper), or unsupported. Also judge the recommendations: anything that overstates the evidence? List important missing items.

RESEARCH:
{
 "summary": "Official Marvel sources describe the body makeup of several characters, and the chart can use some of it. Nothing gives a body-fat percentage or a tissue density in kg/m3. Key findings:\n\n(1) Asgardian density is official. The Official Handbook of the Marvel Universe, Deluxe Edition (1985-86), as reprinted in the 2006 Essential volume 1, says: \"Asgardian flesh and bone is about three times denser than similar human tissue, contributing to the gods' superhuman strength and weight.\" The 1987 trade paperback vol 4 and The Definitive Thor (Panini, 2011) have the same wording. DK's  … [2,088 more characters on this line; the full prompt is in prompts/a1ec50486b4dcb677.txt]
 "facts": [
  {
   "key": "asgardian_tissue_density_ohotmu",
   "label": "Asgardian gods: flesh and bone about three times as dense as human tissue (Official Handbook of the Marvel Universe)",
   "status": "official",
   "values": "{\"density_ratio_vs_human_tissue\": 3, \"qualifier\": \"about\", \"tissues_named\": \"flesh and bone\", \"density_kg_m3\": null, \"editions_seen\": [\"OHOTMU Deluxe Edition #1-7 (1985-86) as reprinted in Essential OHOTMU Deluxe Edition vol 1 (Marvel 2006, ISBN 0785119345)\", \"OHOTMU trade paperback vol 4 (Marvel 1987, ISBN 0871352117)\", \"The Definitive Thor (Panini UK 2011, ISBN 9781846534812)\", \"The Definitive Thor Reloaded (Panini UK 2013)\"]}",
   "sources": [
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1 (2006): 'Asgardian flesh' phrases",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22Asgardian+flesh%22+OR+%22male+Asgardian%22+OR+%22average+Asgardian%22+OR+%22Asgardian+female%22+OR+%22lift+about+30+tons%22+OR+%22Asgardian+god%22%29"
    },
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1 (2006): 'denser than similar human tissue'",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22denser+than+similar+human+tissue%22+OR+%22superhuman+weight%22+OR+%22superhuman+strength+and+weight%22%29"
    },
    {
     "title": "Archive.org full-text search, OHOTMU 1987 TPB vol 4: same phrases",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook04grue+AND+%28%22denser+than+similar+human+tissue%22+OR+%22superhuman+weight%22+OR+%22superhuman+strength+and+weight%22%29"
    },
    {
     "title": "Archive.org full-text search, all texts: 'denser than similar human tissue' (finds 2006 vol 1, 1987 vol 4, Definitive Thor 2011)",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=%22denser+than+similar+human+tissue%22"
    },
    {
     "title": "Archive.org full-text search, all texts: 'times the density' AND Asgardian (Definitive Thor Reloaded 2013)",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=%22times+the+density%22+AND+Asgardian"
    },
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: dense/denser/density (Asgard matter)",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22denser%22+OR+%22dense%22+OR+%22density%22%29"
    },
    {
     "title": "Archive.org metadata: Essential OHOTMU Deluxe vol 1 (2006), 'Collects OHOTMU Deluxe (First 3rd)' #1-7",
     "url": "https://archive.org/metadata/officialhandbook0001unse/metadata"
    },
    {
     "title": "Archive.org metadata: OHOTMU vol 4 (1987, Gruenwald)",
     "url": "https://archive.org/metadata/officialhandbook04grue/metadata"
    },
    {
     "title": "Marvel Database (fan wiki) Asgardians wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Asgardians&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "Exact OCR snippets from archive.org full-text search; these are lending-library scans, so only about 100 characters around each hit can be seen. Essential OHOTMU Deluxe vol 1 (2006): 'immortal like the Olympian gods), aging at an extraordinarily slow. rate upon reaching adult- hood. Asgardian flesh and bone is about three times denser than similar human...'. Same volume: 'times denser than similar human tissue, contributing to the gods' superhuman Strength and weight. An male'. Other entries in the same volume: '(Asgardian flesh and bone is about three times denser than similar hu … [1,455 more characters on this line; the full prompt is in prompts/a1ec50486b4dcb677.txt]
  },
  {
   "key": "asgardian_tissue_density_dk",
   "label": "DK Marvel Encyclopedia: Asgardians' skin and bones three times as dense as a human's",
   "status": "official",
   "values": "{\"density_ratio_vs_human\": 3, \"tissues_named\": \"skin and bones\", \"editions\": [\"DK Marvel Encyclopedia New Edition (2019)\", \"DK Marvel Encyclopedia (2014)\"]}",
   "sources": [
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "Archive.org full-text search: 'flesh and bone' AND Asgardian AND 'dense' (finds DK 2014 and DK 2019 copies)",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=%22flesh+and+bone%22+AND+Asgardian+AND+%22dense%22"
    },
    {
     "title": "Marvel.com Thor (Thor Odinson) In Comics (no density statement)",
     "url": "https://www.marvel.com/characters/thor-thor-odinson/in-comics"
    }
   ],
   "notes": "DK 2019 OCR, 'THE ASGARDIANS' feature (around line 27252): 'Their skin and bones are three times as dense as those of a human and they are almost invulnerable to physical attack. They possess great strength (most are able to lift 30 tons) and, due to their density, weigh far more than humans of comparable size.' A caption in the Enchantress entry reads: 'Asgardian body three times denser and heavier than that of a normal human being.' DK 2014 (snippet, marvelencycloped0000unse_v4p7): 'Their skin and bones are three times as dense as that of a human and are invulnerable, to a degree'. DK names skin and bones only; OHOTMU says flesh and bone. DK's Thor factfile has no density statement: 'HEIGHT 6ft6 in WEIGHT 640 lbs ... Enhanced strength, near invulnerability, longevity, and vast magical abilities provided by the Odinforce'. Marvel.com's Thor page (fetched 2026-10-11) has none either; it gives only 'Thor: 640 lbs., Donald Blake: 150 lbs.' The OCR has page-layout noise; the quoted sentences are contiguous in the OCR."
  },
  {
   "key": "thor_density_adjusted_mass",
   "label": "Thor: official weight converted to human-tissue-equivalent mass (official weight divided by 3)",
   "status": "derived",
   "values": "{\"height_m\": 1.981, \"listed_mass_kg\": 290.3, \"listed_lb\": 640, \"density_factor\": 3, \"human_equiv_mass_kg\": 96.8, \"human_equiv_lb\": 213, \"S_listed_fat0\": 67.2, \"S_listed_fat10\": 60.5, \"S_listed_fat15\": 57.1, \"S_equiv_fat0\": 22.4, \"S_equiv_fat10\": 20.2, \"S_equiv_fat15\": 19.0, \"FFMI_equiv_fat0\": 24.7, \"FFMI_equiv_fat10\": 22.2, \"blake_isometric_6ft6_lb\": 217}",
   "sources": [
    {
     "title": "Marvel.com Thor (Thor Odinson) In Comics (640 lb, 6 ft 6 in)",
     "url": "https://www.marvel.com/characters/thor-thor-odinson/in-comics"
    },
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: 'denser than similar human tissue'",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22denser+than+similar+human+tissue%22+OR+%22superhuman+weight%22+OR+%22superhuman+strength+and+weight%22%29"
    }
   ],
   "notes": "Method: a body of the same size and shape made of ordinary tissue would weigh the listed mass divided by the density ratio: 290.3 / 3 = 96.8 kg (213 lb). S = 1.8 x FFM / H^3 and FFMI = FFM / H^2 at assumed fat of 0, 10 and 15% (body fat is unknown). Assumes all tissue is 3x as dense, following OHOTMU's 'flesh and bone'. If only skin and bone are denser (DK's wording), the correction is smaller. I have not computed that case, because it needs tissue mass fractions not researched here. A numerical observation only, which Marvel does not state: 213 lb is close to Donald Blake's 150 lb scaled isometrically to 6 ft 6 in (217 lb, existing key plausibility_metrics). Relies on existing builds.json keys thor (height and weight) and plausibility_metrics. Rounded to what the inputs support: 'about three times' carries perhaps one significant figure, so the 97 kg value is about plus or minus a third."
  },
  {
   "key": "thing_rocky_hide",
   "label": "The Thing: official sources describe a rock-like hide or exterior, not a body of rock; no mass split given",
   "status": "official",
   "values": "{\"hide_mass_kg\": null, \"hide_density_kg_m3\": null, \"listed_height_m\": 1.829, \"listed_mass_kg\": 226.8, \"S_listed_fat0\": 66.7, \"S_listed_fat10\": 60.1, \"S_listed_fat15\": 56.7}",
   "sources": [
    {
     "title": "Marvel.com The Thing (Benjamin Grimm) In Comics",
     "url": "https://www.marvel.com/characters/the-thing-benjamin-grimm/in-comics"
    },
    {
     "title": "Marvel.com guide: The Thing's Transformations",
     "url": "https://www.marvel.com/comics/guides/2507/the_things_transformations"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "Marvel Database (fan wiki) Benjamin Grimm (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Benjamin_Grimm_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "Marvel.com: 'his rock-like skin has only been known to be pierced by extraterrestrial weaponry or sorcerous means, and while uncomfortable-looking is actually supple and allows him a wealth of movement.' Also: 'Grimm's outward form mutates over his years as the Thing, changing from a lumpy hide to what appears to be individual rocks linked together'. The Marvel.com guide: 'From his original human form to his rocky exterior and beyond'. DK 2019: 'Ben's skin turned orange and rocky, and his strength grew'; powers 'Superhuman strength, endurance, and durability. He can lift 85 tons'. Official wording therefore names the skin, hide or exterior. Fan wiki (reported; these sentences cite no source): 'Body is covered with an orange, flexible, rock-like hide'; 'The mutagenic process caused his overall musculature, bone structure, internal organ composition, soft tissue structure, and skin to also greatly increase in toughness and density'; 'The rock-like composition of the Thing's body renders him highly resistant to physical injury.' I could not reach the OHOTMU Thing entry text: the Deluxe Thing entry is not in the searchable volumes, and full-text search for 'rocklike hide' found only Sanderson's Marvel Universe (1998), 'enormous strength and a nearly impenetrable, rocklike hide'. No source gives the hide's thickness, density or mass. Listed weight and height come from the existing key thing."
  },
  {
   "key": "colossus_armored_composition",
   "label": "Colossus, armoured: whole body converted to an organic steel-like substance; the extra mass comes from an 'unknown, perhaps extradimensional source'",
   "status": "official",
   "values": "{\"human_height_m\": 1.981, \"human_mass_kg\": 113.4, \"armored_height_m\": 2.261, \"armored_mass_kg\": 226.8, \"added_mass_kg\": 113.4, \"added_mass_lb\": 250, \"stated_analogues\": [\"osmium\", \"carbon steel\"], \"S_human_fat10\": 23.6, \"S_armored_fat10_if_tissue\": 31.8}",
   "sources": [
    {
     "title": "Marvel.com Colossus (Piotr Rasputin)",
     "url": "https://www.marvel.com/characters/colossus-piotr-rasputin"
    },
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: Colossus armored form",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22to+armored+form+and+back%22+OR+%22converts+his+body%22+OR+%22organic+steel%22+OR+%22armored+form%22+OR+%22steel-like%22%29"
    },
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: Colossus composition and added mass",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22unknown+composition%22+OR+%22osmium%22+OR+%22carbon+steel%22+OR+%22remains+unknown%22+OR+%22additional+mass+from%22%29"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    }
   ],
   "notes": "Marvel.com (re-fetched 2026-10-11): 'Colossus can convert the tissue of his entire body into an organic, steel-like substance analogous to osmium and to carbon steel...'. Also: 'Colossus cannot become partially or selectively armored; his body is either entirely converted, or not at all. Even his eyes become steel-like'. OHOTMU Deluxe (Essential vol 1, OCR snippets): 'convert the tissue of his entire body into an organic steel-like substance, granting him superhuman strength'; 'steel\" is of unknown composition but appears to be analogous to osmium and to carbon steel'; 'by which Colossus trans- forms himself to armored form and back (in- cluding his gain of additional mass from an unknown, perhaps _ extradimensional source) remains unknown.' The opening words of the last sentence are cut off in the snippet. DK 2019: 'Mutant ability to change his body's tissue into an organic, steel-like material.' The existing key colossus_density_check (estimate) shows the problem: at an isometrically scaled volume, the stated 500 lb implies a mean density of only about 1,350-1,480 kg/m3, far from steel, so the official mass and the official material do not fit together. The human form (6 ft 6 in, 250 lb) is ordinary tissue. Relies on existing keys colossus and colossus_density_check. The S values are derived from the official figures at an assumed 10% fat."
  },
  {
   "key": "wolverine_adamantium_mass",
   "label": "Wolverine: adamantium adds 105 lb (47.6 kg); 300 lb with it, 195 lb without (Marvel.com)",
   "status": "official",
   "values": "{\"height_m\": 1.6, \"adamantium_added_kg\": 47.6, \"adamantium_added_lb\": 105, \"with_kg\": 136.1, \"without_kg\": 88.5, \"adamantium_share_of_300lb\": 0.35, \"overstatement_factor_if_300lb_used\": 1.54, \"S_without_fat0\": 38.9, \"S_without_fat10\": 35.0, \"S_without_fat15\": 33.0, \"S_with_fat10\": 53.8, \"fan_story_figure_lb\": \"nearly 100 (reported)\"}",
   "sources": [
    {
     "title": "Marvel.com Wolverine (Logan/James Howlett) In Comics",
     "url": "https://www.marvel.com/characters/wolverine-james-howlett/in-comics"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "Marvel Database (fan wiki) James Howlett (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=James_Howlett_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "Marvel.com (re-fetched 2026-10-11): 'his skeleton is coated in the near-indestructible steel alloy known as adamantium. This alloy adds an extra 105 pounds to his frame—or 47.6 kilograms in Wolverine's native metric system.' Stats read 'HEIGHT 5'3\" WEIGHT 300 lbs., Without Adamantium skeleton: 195 lbs.' (300 - 195 = 105, consistent). The adamantium coats the bone rather than replacing it, so the 195 lb still contains his skeleton. DK 2019: 'HEIGHT 5 ft3in WEIGHT 195 lbs', with 'His skeleton has been laced with the unbreakable metal Adamantium' and no qualifier. Fan wiki: '195 lbs (without Adamantium skeleton); 300 lbs (with Adamantium skeleton)', and 'the addition of nearly 100 pounds of Adamantium to his body reduced his buoyancy', citing Wolverine: Weapon X #5 (story text, not seen; reported). Full-text search found no OHOTMU adamantium mass ('pounds of adamantium' returned only fan fiction). Relies on existing key wolverine. S values are derived at assumed fat levels."
  },
  {
   "key": "hulk_added_mass_composition",
   "label": "Hulk: handbook says gamma radiation added 'over 800 pounds of bone marrow and tissue' from an unknown source",
   "status": "official",
   "values": "{\"added_mass_lb_stated\": \"over 800\", \"banner_lb\": 128, \"hulk_lb_dk2019\": 1040, \"hulk_lb_marvelcom\": 1150, \"difference_lb_dk2019\": 912, \"difference_lb_marvelcom\": 1022, \"density_factor\": null}",
   "sources": [
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: 'fortified his cellular' / 'bone marrow and tissue'",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22mass+fortifies%22+OR+%22fortifies+all%22+OR+%22bone+marrow+and+tissue%22+OR+%22Previously%2C+this%22+OR+%22fortified+his+cellular%22%29"
    },
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: 'mutation was not a stable'",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22requires+the+rapid%22+OR+%22involves+the+rapid%22+OR+%22necessitates+the+rapid%22+OR+%22mutation+was+not+a+stable%22+OR+%22not+a+stable%22+OR+%227+feet%22+OR+%22Hulk%27s+height%22%29"
    },
    {
     "title": "Marvel.com Hulk (Bruce Banner) In Comics",
     "url": "https://www.marvel.com/characters/hulk-bruce-banner/in-comics"
    },
    {
     "title": "Marvel Database (fan wiki) Bruce Banner (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Bruce_Banner_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "OHOTMU Deluxe as reprinted in Essential vol 1 (2006), OCR snippets: 'radiation that mutated the Hulk's body fortified his cellular structure and added, from some as yet un-' ... 'source, over 800 pounds of bone marrow and tissue to his body. Previously, this mutation was not a stable one. The Hulk would periodically revert'. Another snippet: 'o the human form of Bruce Banner, losing the extra mass and energy to the same as yet unknown source'. The fan wiki cites 'Official Handbook of the Marvel Universe Vol 2 5' (Deluxe #5) and paraphrases it as 'bone marrow and muscle tissue'; the Hulk wording I saw is 'bone marrow and tissue'. The separate snippet 'requires the rapid acquisition of bodily mass to maintain his proportionate shape ... presumably derives from an extra-dimensional source' belongs to a growth-power entry (probably Giant-Man), not the Hulk, and is not used here. Marvel.com: 'nearly impenetrable skin'. DK 2019 Hulk factfile has no composition statement. No source gives a density factor, and no source gives a separate composition for the grey (Joe Fixit) or merged forms. Those forms' stats come from the existing keys hulk_grey_joe_fixit (fan-wiki only) and hulk_merged_marvelcom. 'Fortified cellular structure' could imply denser tissue, but nothing quantifies it."
  },
  {
   "key": "abomination_added_mass_composition",
   "label": "Abomination: handbook says gamma radiation added 'over 800 pounds of bone marrow and muscle tissue'",
   "status": "official",
   "values": "{\"added_mass_lb_stated\": \"over 800\", \"blonsky_lb\": 180, \"abomination_lb\": 980, \"difference_lb\": 800, \"density_factor\": null, \"S_listed_fat10\": 85.8}",
   "sources": [
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: Abomination added tissue",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22bone+marrow+and+muscle%22+OR+%22pounds+of+bone+marrow%22+OR+%22Abomination%27s+trans%22+OR+%22Abomination%E2%80%99s+trans%22+OR+%22Abomination%27s+body%22%29"
    },
    {
     "title": "Marvel.com Abomination",
     "url": "https://www.marvel.com/characters/abomination"
    },
    {
     "title": "Marvel Database (fan wiki) Emil Blonsky (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Emil_Blonsky_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "OHOTMU Deluxe as reprinted in Essential vol 1 (2006), OCR snippets: 'The gamma radiation that mutated the Abomination's body fortified his cellular structure and added' ... 'as yet un- known source, over 800 pounds of bone marrow and muscle tissue to his body. Un- like the Hulk's, the Abomination's trans- formation has proved stable'. Marvel.com: 'Abomination: 980 lbs., Blonsky: 180 lbs.' (difference 800 lb, consistent). DK 2019 mentions 'tough skin'. No density factor anywhere. Relies on existing key abomination for height and weight. The S value is derived at an assumed 10% fat."
  },
  {
   "key": "luke_cage_dense_tissue",
   "label": "Luke Cage: official sources say 'very dense muscle and bone tissue' and 'Superdense Body Mass', with no factor",
   "status": "official",
   "values": "{\"density_factor\": null, \"height_m\": 1.981, \"listed_mass_kg\": 192.8, \"S_listed_fat0\": 44.6, \"S_listed_fat10\": 40.2}",
   "sources": [
    {
     "title": "Marvel.com Luke Cage In Comics",
     "url": "https://www.marvel.com/characters/luke-cage/in-comics"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "Archive.org full-text search: 'steel-hard skin' (DK 2014 and 2019 copies)",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=%22steel-hard+skin%22"
    },
    {
     "title": "Marvel Database (fan wiki) Lucas Cage (Carl_Lucas_(Earth-616)) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Carl_Lucas_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "Marvel.com powers list: 'Bulletproof Skin, ... Superdense Body Mass'. Text: 'His skin also proved to be impervious to bullets, thanks to the incredibly dense muscle tissues created by the experiment.' DK 2019 (OCR, layout-garbled, reassembled): 'Cage possesses superhuman strength, very dense muscle and bone tissue, and steel-hard skin. He recovers three times faster from injury than a normal person'. A clean copy of the same DK text appears in the full-text search snippet. Fan wiki (reported): 'Luke Cage's body is as hard as titanium steel' (citing Hero for Hire #1) and 'His muscles and bones tissue are super-dense' (citing OHOTMU A to Z vol 2; not seen). No source gives how much denser."
  },
  {
   "key": "kingpin_bulk_not_fat",
   "label": "Kingpin: official sources say his bulk is muscle, not fat; the '9 pounds of fat' figure is fan-wiki only",
   "status": "official",
   "values": "{\"height_m\": 2.007, \"listed_mass_kg\": 204.1, \"fan_fat_lb\": 9, \"fan_fat_pct_of_450lb\": 2.0, \"ffm_kg_if_9lb_fat\": 200.0, \"FFMI_if_9lb_fat\": 49.7, \"S_if_9lb_fat\": 44.6, \"S_fat15\": 38.7, \"press_lb_ohotmu\": 650}",
   "sources": [
    {
     "title": "Marvel.com Kingpin (Wilson Fisk) In Comics",
     "url": "https://www.marvel.com/characters/kingpin/in-comics"
    },
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: Kingpin bulk",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22great+bulk%22+OR+%22does+not+consist%22+OR+%22developed+to+enormous%22+OR+%22sumo%22%29"
    },
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: fat phrases",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22body+fat%22+OR+%22not+fat%22+OR+%22of+fat%22+OR+%22is+fat%22+OR+%22fatty%22%29"
    },
    {
     "title": "Marvel Database (fan wiki) Wilson Fisk (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Wilson_Fisk_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "Marvel.com: 'Most of Fisk's bulk is actually muscle, not fat; his enormous size is comparable to that of a sumo wrestler.' OHOTMU Deluxe (Essential vol 1), two overlapping OCR snippets: 'powers. His great bulk does not consist of fat but of muscles that have been developed to enormous size, as' and 'as in a sumo wrestler. The Kingpin can lift (press) approximately 650 pounds.' Fan wiki: 'Fisk is composed almost entirely of muscle that has been developed to enormous size, much like a sumo wrestler, and he possesses peak human strength with only the bare 9 pounds actually being fat.' That sentence carries no citation; the existing key kingpin records it as attributed to OHOTMU: Daredevil 2004. Full-text search for Kingpin with '9 pounds' found nothing, so status reported. Derived: 9 lb is 2.0% of 450 lb, below the 5.8-10.7% near-contest range for male bodybuilders in the existing key bauer2023_bodyfat_ranges_review. 'Most of the bulk is muscle' only bounds fat below about 50% (existing key kingpin). Relies on existing keys kingpin and bauer2023_bodyfat_ranges_review."
  },
  {
   "key": "juggernaut_composition",
   "label": "Juggernaut: mystical, not material; helmet and skullcap of 'unknown mystical metal'; no source says whether the listed weight includes them",
   "status": "official",
   "values": "{\"armor_or_helmet_mass_kg\": null, \"weight_includes_armor\": \"not stated\", \"listed_ohotmu_lb\": 900, \"listed_ohotmu_kg\": 408.2, \"density_factor\": null}",
   "sources": [
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: Juggernaut helmet, skullcap, Cyttorak",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22Juggernaut%27s+helmet%22+OR+%22Juggernaut%E2%80%99s+helmet%22+OR+%22Juggernaut%27s+armor%22+OR+%22Juggernaut%E2%80%99s+armor%22+OR+%22Juggernaut%27s+body%22+OR+%22Juggernaut%E2%80%99s+body%22+OR+%22skullcap%22+OR+%22Cyttorak%22%29"
    },
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: Juggernaut height/weight",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22Juggernaut+wears%22+OR+%22wears+armor%22+OR+%22his+armor%22+AND+%22Juggernaut%22+OR+%22%28with+armor%29%22+OR+%22without+armor%22+OR+%22Weight%3A+900%22%29"
    },
    {
     "title": "Marvel.com Juggernaut (Cain Marko)",
     "url": "https://www.marvel.com/characters/juggernaut-cain-marko"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "Marvel Database (fan wiki) Cain Marko (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Cain_Marko_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "OHOTMU Deluxe (Essential vol 1), OCR snippets: 'the mystical energy of Cyttorak gives the Juggernaut an extraordinary de- gree of resistance to all forms of injury'; 'Without his helmet and skullcap, both con- structed of an unknown mystical metal'; 'constructed a skullcap from scraps of the metal he used to construct the helmet'; 'Height: 6 10 Weight: 900 lbs.' (OCR read 6' 10\" as '6° 10°'). The weight line also confirms that the 900 lb in the existing key juggernaut is a handbook value, not only DK's. DK 2019: 'Virtually invulnerable, with impenetrable force-field. His helmet'. Marvel.com's crowd-sourced page (9'5\", 1,900 lbs) says nothing about composition. No source says whether the listed weight includes the helmet or armour, and none gives a density. Fan wiki (reported): his current armour 'is actually stored inside of his body' (citing X-Men Unlimited Infinity Comic #18)."
  },
  {
   "key": "bane_venom_weight",
   "label": "Bane: Venom, a 'super-steroid', adds weight (350 lb, 425 lb with Venom); no composition given",
   "status": "official",
   "values": "{\"height_m\": 2.032, \"base_kg\": 158.8, \"with_venom_kg\": 192.8, \"venom_added_lb\": 75, \"venom_added_kg\": 34.0}",
   "sources": [
    {
     "title": "DK DC Comics Encyclopedia New Edition (2021), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-encyclopedia-new-edition/DC%20Comics%20Encyclopedia%2C%20New%20Edition_djvu.txt"
    }
   ],
   "notes": "DK 2021 OCR: 'HEIGHT 6ft 8in WEIGHT 350 lbs (425 lbs with Venom)'; 'POWERS/ABILITIES Enhanced strength, weight, durability, and endurance due to use of a super-steroid called Venom'; 'The super-steroid Venom is fed into Bane's bloodstream via tubes. The Venom temporarily gives the villain superhuman strength, speed, and endurance.' Nothing says what the added 75 lb is made of. Relies on existing key bane."
  },
  {
   "key": "dc_density_claims_fan_only",
   "label": "DC (Superman, Batman, Darkseid, Doomsday, Bane): no official density or composition statements found; density claims are fan-wiki only",
   "status": "reported",
   "values": "{\"official_density_statements_found\": 0, \"dk_books_searched\": [\"DK DC Comics Encyclopedia New Edition 2021\", \"DK DC Comics Ultimate Character Guide New Edition 2019\"], \"fan_claims\": {\"superman\": \"dense cellular/molecular structure\", \"darkseid\": \"can manipulate his size, density and mass\", \"doomsday\": \"extremely dense muscles; bone protrusions\"}}",
   "sources": [
    {
     "title": "DK DC Comics Encyclopedia New Edition (2021), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-encyclopedia-new-edition/DC%20Comics%20Encyclopedia%2C%20New%20Edition_djvu.txt"
    },
    {
     "title": "DK DC Comics Ultimate Character Guide New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-ultimate-character-guide-new-edition/DC%20Comics%20Ultimate%20Character%20Guide%2C%20New%20Edition_djvu.txt"
    },
    {
     "title": "DC Database (fan wiki) Kal-El (New Earth) wikitext via API",
     "url": "https://dc.fandom.com/api.php?action=parse&page=Kal-El_(New_Earth)&prop=wikitext&format=json&redirects=1"
    },
    {
     "title": "DC Database (fan wiki) Kal-El (Prime Earth) wikitext via API",
     "url": "https://dc.fandom.com/api.php?action=parse&page=Kal-El_(Prime_Earth)&prop=wikitext&format=json&redirects=1"
    },
    {
     "title": "DC Database (fan wiki) Uxas (New Earth) wikitext via API",
     "url": "https://dc.fandom.com/api.php?action=parse&page=Uxas_(New_Earth)&prop=wikitext&format=json&redirects=1"
    },
    {
     "title": "DC Database (fan wiki) Doomsday (New Earth) wikitext via API",
     "url": "https://dc.fandom.com/api.php?action=parse&page=Doomsday_(New_Earth)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "Grep of both DK DC OCR texts for dense/denser/density/'body fat' found hits only for other characters (Atom Smasher, Thunder, a cold villain's 'super-dense blocks of ice'). DK factfile powers: Superman 'Super-strength; super-speed; flight; invulnerability; numerous sense-based abilities; accelerated healing ... all fueled by exposure to solar energy from a yellow sun'. Darkseid: 'Formidable intellect, godlike strength and endurance; eyes fire target-seeking Omega Beams'. Doomsday: 'Overwhelming strength, regeneration, invulnerability, able to learn and adapt after its own death.' DC.com gives no stats (existing key dc_com_no_stats). Fan-wiki claims (reported, mostly uncited): Superman (New Earth) 'Superman's cellular structure is much more dense, resilient and biologically more effective than human tissue'; Prime Earth 'Due to the interaction of his dense molecular structure and supercharged bio-electric aura'. Darkseid (New Earth): 'Darkseid can easily manipulate his size, density and mass just by thinking'. Doomsday (New Earth): 'Due to his extremely dense muscles and strength in his legs, Doomsday can leaps miles at a time' and 'Doomsday possesses extremely sharp bone protrusions'. DC's own Who's Who (1985-87, 1990-92) was not found on archive.org."
  },
  {
   "key": "peak_human_characters_composition",
   "label": "Captain America, Black Panther, Batman: described as peak human; the only density claim (Black Panther) is fan-wiki-reported",
   "status": "reported",
   "values": "{\"official_density_statements_found\": 0, \"fan_claim_black_panther\": \"skin, muscle, and bone tissues much denser and harder than normal humans (no factor)\"}",
   "sources": [
    {
     "title": "Marvel.com Captain America (Steve Rogers) In Comics",
     "url": "https://www.marvel.com/characters/captain-america-steve-rogers/in-comics"
    },
    {
     "title": "Marvel.com Black Panther (T'Challa) In Comics",
     "url": "https://www.marvel.com/characters/black-panther-t-challa/in-comics"
    },
    {
     "title": "Marvel Database (fan wiki) T'Challa (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=T%27Challa_(Earth-616)&prop=wikitext&format=json&redirects=1"
    },
    {
     "title": "DK DC Comics Encyclopedia New Edition (2021), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-encyclopedia-new-edition/DC%20Comics%20Encyclopedia%2C%20New%20Edition_djvu.txt"
    }
   ],
   "notes": "Marvel.com, Captain America: 'Professor Abraham Erskine ... whisked him into Project Rebirth, the professor's bold experiment in enhancing the human body to its peak powers' and 'Now muscular and tall ... the former ninety-eight-pound weakling'. Marvel.com, Black Panther: no composition statement (weight 200 lbs). DK 2019: no density statement for either; the DK density grep hit only Arkon, Atalanta, Luke Cage, the Asgardians, Enchantress and Penance. Fan wiki, Black Panther (reported, not verified): 'T'Challa's skin, muscle, and bone tissues are augmented to levels that are much denser and harder than normal humans', citing OHOTMU Master Edition #9, which I could not see; no factor given. Batman: DK lists no powers implying non-human tissue. Weights come from the existing keys captain_america (disputed, 220-240 lb), black_panther and batman."
  },
  {
   "key": "comic_body_fat_official",
   "label": "Body fat of comic characters: no Marvel or DC source gives a percentage; official statements are qualitative only",
   "status": "official",
   "values": "{\"official_bodyfat_percent_found\": null, \"qualitative_statements\": {\"kingpin\": \"bulk does not consist of fat (OHOTMU); most bulk is muscle, not fat (Marvel.com)\", \"angel_warren_worthington\": \"body is virtually devoid of fat (OHOTMU), not on the chart\"}, \"fan_only_figure\": \"Kingpin 9 lb fat (about 2.0% of 450 lb, derived)\"}",
   "sources": [
    {
     "title": "Archive.org full-text search: 'body is virtually devoid of fat'",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=%22body+is+virtually+devoid+of+fat%22"
    },
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: fat phrases",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22body+fat%22+OR+%22not+fat%22+OR+%22of+fat%22+OR+%22is+fat%22+OR+%22fatty%22%29"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "DK DC Comics Encyclopedia New Edition (2021), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-encyclopedia-new-edition/DC%20Comics%20Encyclopedia%2C%20New%20Edition_djvu.txt"
    },
    {
     "title": "Marvel.com Kingpin (Wilson Fisk) In Comics",
     "url": "https://www.marvel.com/characters/kingpin/in-comics"
    }
   ],
   "notes": "Searched for 'body fat', '% fat', 'fat' and 'percent' in: DK Marvel 2019, DK DC 2021 and DK DC guide 2019 OCR texts; the 11 Marvel.com character pages fetched on 2026-10-11; and the Essential OHOTMU Deluxe vol 1 (2006) via full-text search. No percentage anywhere. Qualitative hits in OHOTMU Deluxe vol 1: Kingpin, 'His great bulk does not consist of fat but of muscles'; Angel, 'are hollow like those of a bird; his body is virtually devoid of fat; he possesses greater proportionate muscle mass' (the bird-bones wording identifies Angel; the snippet does not name him); a winged horse, 'normal horse of his size would. His body is virtually devoid of fat'; and the Blob, 'imbed themselves in his layers of fat tissue'. Of the chart's characters, only the Kingpin has an official fat statement. 'None found' covers only the sources listed; the 2004-2010 handbooks were not searchable."
  },
  {
   "key": "comic_score_treatment",
   "label": "Recommended treatment of each comic character's muscle score (comparable, overstated, or not comparable)",
   "status": "estimate",
   "values": "{\"thor\": {\"class\": \"overstated\", \"factor\": 3, \"basis\": \"official OHOTMU and DK density statements\", \"plot_mass_kg\": 96.8}, \"asgardians_general\": {\"class\": \"overstated\", \"factor\": 3}, \"thing\": {\"class\": \"overstated\", \"factor\": null, \"basis\": \"rock-like hide, no mass split\"}, \"colossus_armored\": {\"class\": \"not_comparable\", \"basis\": \"body converted to steel-like substance; extra mass from unknown source\"}, \"colossus_human\": {\"class\": \"comparable\"}, \"wolverine\": {\"class\": \"comparable_after_subtraction\", \"subtract_kg\": 47.6, \" … [1,123 more characters on this line; the full prompt is in prompts/a1ec50486b4dcb677.txt]
   "sources": [
    {
     "title": "Marvel.com Thor (Thor Odinson) In Comics",
     "url": "https://www.marvel.com/characters/thor-thor-odinson/in-comics"
    },
    {
     "title": "Marvel.com Wolverine (Logan/James Howlett) In Comics",
     "url": "https://www.marvel.com/characters/wolverine-james-howlett/in-comics"
    },
    {
     "title": "Marvel.com Colossus (Piotr Rasputin)",
     "url": "https://www.marvel.com/characters/colossus-piotr-rasputin"
    },
    {
     "title": "Archive.org full-text search, Essential OHOTMU Deluxe vol 1: 'denser than similar human tissue'",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Aofficialhandbook0001unse+AND+%28%22denser+than+similar+human+tissue%22+OR+%22superhuman+weight%22+OR+%22superhuman+strength+and+weight%22%29"
    }
   ],
   "notes": "These are my recommendations, built on the facts above; they are not official.\n- Comparable means the listed mass is described as ordinary tissue, or nothing official says otherwise.\n- Overstated means official text says part of the mass is not ordinary tissue, or the tissue is denser, so the score built from listed mass is too high. A factor is given only where a source gives a figure.\n- Not comparable means the body is not tissue at all.\nBy character:\n- Thor and Asgardians: divide by about 3.\n- Wolverine: subtract the official 105 lb.\n- Colossus, armoured: steel-like body.\n- The Thing and Luke Cage: overstated by an unknown amount.\n- Hulk and Abomination: the handbook calls the added mass bone marrow and (muscle) tissue.\n- Juggernaut: no source says whether the 900 lb includes his helmet and armour.\n- Darkseid and Doomsday: comparable only because nothing official says otherwise.\n- Superman, Batman, Captain America and Black Panther: human-plausible, and no official density statement exists."
  }
 ],
 "recommendations": "1. Thor and any Asgardian: mark overstated. Plot the main marker at the human-tissue-equivalent mass, 290.3/3 = 96.8 kg (213 lb). That gives S about 20-22 and plain FFMI about 22-25 at 0-10% fat. Show the as-listed point (S about 57-67) as a faint ghost, joined by a line. Label: \"Official handbooks: Asgardian flesh and bone is about three times as dense as human tissue\". Note that DK's wording names only skin and bones, which would mean a smaller correction. Say \"about\": the factor is a round handbook number.\n\n2. Wolverine: score him at 195 lb (88.5 kg): S about 33-3 … [2,242 more characters on this line; the full prompt is in prompts/a1ec50486b4dcb677.txt]
 "gaps": "1. Partial handbook text only. The OHOTMU volumes on archive.org are lending-library scans. I could read only the full-text search snippets (about 100 OCR characters each), and the search-inside page (inside.php) returned 403. So:\n   - issue numbers and pages are unconfirmed (for example, the Asgardians group entry is probably Deluxe #1);\n   - some sentences are joined from overlapping snippets, and their opening words are missing in places (Colossus's \"The means by which\").\n\n2. Entries I could not see at all:\n   - the OHOTMU Thing, Wolverine, Luke Cage and individual Thor ent … [1,851 more characters on this line; the full prompt is in prompts/a1ec50486b4dcb677.txt]
}
```

</details>

**Subagent `verify:outline`** · build-comparison-research · started 2026-10-11 04:55:47 UTC

- checks: 22 (15 ok, 7 not ok).
- Not OK: ansur2_biacromial_vs_bideltoid; ansur2_ellipse_vs_girth_male; ansur2_trunk_width_per_girth_male (+4 more).
- Mostly solid, but the recommendations need fixing before design. I fetched over 40 sources: both ANSUR II PDFs and the CSV (hash matches), the de Leva PDF and its companion abstract, the Hara, Hu and Liu full texts, the Heymsfield, Chiu, Meskers, Campbell, Rab, Harrington, Bell and Jensen records, ...

<details>
<summary>Prompt, verbatim (65,657 characters)</summary>

Workflow run `wf_94de1f40-a68`, phase `Verify`, agent `af0581ed52ccbdef4`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/af0581ed52ccbdef4.txt](prompts/af0581ed52ccbdef4.txt).

```text
Project: "Build Comparison", a chart that ranks male body builds by "muscle level" irrespective of height, from ordinary men through the limits of human possibility to the monstrous (comic characters, and two original 3 m characters, Rex and Ollie). Read /home/user/rex-strength-lab/build-comparison/BRIEF.md first (10 minutes): it states the decisions already made and the problems to solve.
The working score is FFMI after rescaling the body to 1.80 m at the same shape: S = 1.8 * FFM / H^3 (FFM = fat-free mass in kg, H = height in m), shown beside plain FFMI = FFM / H^2. A rough first pass gives: US Army median man about 24, Ronnie Coleman about 35-39, Eddie Hall about 38, the heaviest comic characters 57-81, Rex about 141 (tail excluded, height to crest). A solid ball of muscle as tall as the figure scores about 924.
The sister project /home/user/rex-strength-lab/build-calculator/ already holds 55 builds and 139 verified facts in data/builds.json (read its "facts" keys and labels before you start; do NOT re-research a fact that already exists there unless the brief needs a number it lacks, and say so when you rely on an existing key). ANSUR II CSVs are in /home/user/rex-strength-lab/build-calculator/data/ansur2/ (ANSUR_II_MALE_Public.csv, 4,082 men; values in mm and kg x10? check: weightkg is in tenths of kg, lengths in mm).
The owner is a professional critic: factual accuracy and honest labelling come first. Say "unknown" rather than invent; a number is "sourced" only if you fetched the page or PDF and saw the number there; give the exact URL you fetched (DOI landing pages, PubMed, PMC, publisher PDFs). Prefer primary or authoritative sources (journals, textbooks, government surveys, standards bodies, publisher handbooks); use fan sites or magazines only when nothing better exists, and label them so. Quote the exact sentence or table cell behind each number in notes.
Load web tools with ToolSearch query "select:WebSearch,WebFetch". Write raw downloads and scripts under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/<topic>/ (create it). Do not edit anything under /home/user/rex-strength-lab.
For each fact give: key (snake_case), label, status (measured | official | reported | derived | estimate | disputed), values (a JSON object as a string, SI units plus the original units), sources (title + URL actually fetched), and notes (what exactly the source says, its sample, caveats, how good the evidence is).

You are a skeptical fact-checker for the topic "outline". Below are the researcher's facts and recommendations. Re-fetch the cited URLs for every fact the chart is likely to lean on (at least 12 fetches; all of them if there are fewer) and check each value, quotation and status against what the source actually says; recompute every derived number you can (re-run computations on the ANSUR II CSV where relevant). Mark ok=false with a correction for anything wrong, mislabelled (for example a fan wiki or a magazine marked official or measured; a sample maximum called a limit; a secondary summary presented as the primary paper), or unsupported. Also judge the recommendations: anything that overstates the evidence? List important missing items.

RESEARCH:
{
 "summary": "I covered all five parts of the outline topic.\n\n**(1) Measurement definitions.** I downloaded the ANSUR II measurer's handbook (Hotzman 2011, TR-11/017) and the methods report (Gordon 2014, TR-15/007) and quoted the exact definition and posture for every landmark height and breadth on the list, with printed page numbers.\n- Chest breadth is taken at full inspiration, with the caliper pressed \"firmly to ensure contact with the rib cage\". The handbook never mentions the latissimus. So chest breadth is a squeezed rib-cage width, not a silhouette width.\n- Biacromial breadth runs  … [3,324 more characters on this line; the full prompt is in prompts/af0581ed52ccbdef4.txt]
 "facts": [
  {
   "key": "ansur2_outline_landmark_definitions",
   "label": "ANSUR II landmark heights for the outline: what each marks, and the standing posture",
   "status": "official",
   "values": "{\"crotch_blade_added_m\":0.01,\"crotch_blade_added_cm\":1,\"TR11_017_printed_pages\":{\"standing_posture\":73,\"stature\":152,\"cervicale_landmark\":27,\"suprasternale_height\":153,\"acromion_landmark\":23,\"acromial_height\":78,\"axilla_height\":82,\"scye_landmarks\":56,\"chest_point_landmark\":28,\"chest_height\":103,\"omphalion_landmark\":70,\"waist_height_omphalion\":167,\"buttock_height\":95,\"trochanterion_landmark\":69,\"crotch_height\":104,\"midpatella_landmark\":48,\"knee_height_midpatella\":133,\"lateral_malleolus_landmark\":44,\"lateral_malleolus_height\":136,\"stylion_landmark\":60,\"wrist_height\":170,\"tragion_top_of_head\":159}}",
   "sources": [
    {
     "title": "Hotzman J et al. 2011, Measurer's Handbook: US Army and Marine Corps Anthropometric Surveys 2010-2011, NATICK/TR-11/017 (PDF)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR11-017.pdf"
    },
    {
     "title": "Gordon CC et al. 2014, 2012 Anthropometric Survey of U.S. Army Personnel: Methods and Summary Statistics, NATICK/TR-15/007 (PDF)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "Fetched both PDFs and extracted the text with pdftotext.\n\nStanding posture (6.1.1): \"stand erect, with their weight evenly distributed on both feet, heels together as much as possible, legs and trunk straight without stiffness ... The arms are to hang relaxed with the elbows lightly touching the sides with the palms of the hands beside, but not touching, the thighs. On individuals with muscular upper arms, the elbows may not touch the sides.\" Most heights are taken \"at the maximum point of quiet respiration\".\n\nLandmark definitions:\n- Stature: \"The vertical distance from  … [1,983 more characters on this line; the full prompt is in prompts/af0581ed52ccbdef4.txt]
  },
  {
   "key": "ansur2_outline_breadth_depth_definitions",
   "label": "ANSUR II trunk, head, hand and foot breadths and depths: exact definitions (incl. whether chest breadth includes the lats)",
   "status": "official",
   "values": "{\"TR11_017_printed_pages\":{\"biacromial\":85,\"bideltoid\":88,\"buttock_circumference\":93,\"buttock_depth\":94,\"chest_breadth\":100,\"chest_circumference\":101,\"chest_depth\":102,\"foot_breadth\":112,\"foot_length\":113,\"hand_breadth\":119,\"hand_length\":121,\"head_breadth\":122,\"head_length\":124,\"hip_breadth\":127,\"waist_breadth\":163,\"waist_circumference\":164,\"waist_depth\":165},\"TR15_007_printed_pages\":{\"biacromial\":59,\"bideltoid\":65,\"chest_breadth\":89},\"chest_breadth_state\":\"full inspiration, tissue compressed to rib cage\",\"chest_depth_and_girth_state\":\"quiet respiration, light contact\"}",
   "sources": [
    {
     "title": "Hotzman J et al. 2011, NATICK/TR-11/017 Measurer's Handbook (PDF)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR11-017.pdf"
    },
    {
     "title": "Gordon CC et al. 2014, NATICK/TR-15/007 (PDF)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "Chest breadth (6.4.24): \"The maximum horizontal breadth of the chest at the level of the chest point anterior landmark.\" The participant puts both hands on the hips and takes a deep breath. The measurer is told to \"Compress the tissue firmly to ensure contact with the rib cage, ask the participant to lower the arms, and take the measurement. The measurement is taken at maximum inspiration\". Breast tissue is excluded. TR-15/007 footnote: \"This measurement also differs from ANSUR because the tissue is now compressed and the measurement is taken at maximum inspiration.\"\n\nThe  … [1,678 more characters on this line; the full prompt is in prompts/af0581ed52ccbdef4.txt]
  },
  {
   "key": "ansur2_biacromial_vs_bideltoid",
   "label": "Biacromial vs bideltoid breadth in ANSUR II: bone-to-bone vs widest muscle across the arms",
   "status": "official",
   "values": "{\"biacromial_p50_m\":0.415,\"bideltoid_p50_m\":0.509,\"derived_half_difference_bideltoid_minus_biacromial_m\":{\"p50\":0.047,\"p5\":0.029,\"p95\":0.0675},\"derived_half_difference_bideltoid_minus_chest_breadth_m\":{\"p50\":0.110,\"p5\":0.0935,\"p95\":0.129},\"derived_bideltoid_over_shoulder_circumference\":{\"p50\":0.432,\"p5\":0.417,\"p95\":0.453},\"orig_mm\":\"biacromial p50 415, bideltoid p50 509; half-differences p50 47 mm and 110 mm\"}",
   "sources": [
    {
     "title": "Hotzman J et al. 2011, NATICK/TR-11/017 (sections 6.4.9 and 6.4.12)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR11-017.pdf"
    },
    {
     "title": "Gordon CC et al. 2014, NATICK/TR-15/007 (dimensions 8 and 11)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    },
    {
     "title": "ANSUR II male CSV (OPEN Design Lab), local copy sha256 0547aea0170e5293...",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "Biacromial breadth: \"The distance between the right and left acromion landmarks on the tips of the shoulder.\" It is taken in anthropometric sitting with a beam caliper from behind, \"Use sufficient pressure to maintain firm contact with the skin\". It is a bony width.\n\nBideltoid breadth: \"The maximum horizontal distance between the lateral margins of the upper arms on the deltoid muscles.\" The caliper blades are brushed up and down the arms, \"When the blades lightly touch the skin on both sides, withdraw the instrument\". The handbook adds \"the deltoid landmarks are NOT used for this dimension\" and \"This measurement should never be taken lower than the bottom of the deltoid muscles.\"\n\nTR-15/007 says both are seated: \"The shoulders and upper arms are relaxed, and the forearms and hands are extended forward horizontally with the palms facing each other\". Both are at quiet respiration. Bideltoid therefore includes the soft tissue of both arms; it is the widest front-view width across the shoulders with the arms down.\n\nThe numbers in values are my arithmetic on the 4,082 men (script ansur_outline.py): (bideltoid - biacromial)/2, (bideltoid - chest breadth)/2, and bideltoid / shoulder circumference. Shoulder circumference is taken at the deltoid points. Caveat: both breadths are seated while acromial height is standing."
  },
  {
   "key": "ansur2_outline_height_fractions_male",
   "label": "ANSUR II men: landmark heights as fractions of stature (median, 5th, 95th percentile)",
   "status": "derived",
   "values": "{\"n\":4082,\"stature_p50_m\":1.755,\"order\":\"[p50, p5, p95] of individual height/stature\",\"fraction_of_stature\":{\"cervicale\":[0.864,0.853,0.875],\"suprasternale\":[0.819,0.807,0.831],\"acromion\":[0.821,0.804,0.836],\"axilla_anterior_scye\":[0.757,0.742,0.771],\"chest_point\":[0.735,0.718,0.753],\"tenth_rib\":[0.638,0.619,0.659],\"omphalion_waist\":[0.602,0.580,0.622],\"iliocristale\":[0.604,0.584,0.626],\"buttock_protrusion\":[0.505,0.480,0.533],\"trochanterion\":[0.512,0.489,0.540],\"crotch\":[0.481,0.459,0.506],\"knee_midpatella\":[0.278,0.263,0.294],\"lateral_femoral_epicondyle\":[0.280,0.267,0.293],\"tibiale\":[0.266,0.253,0.280],\"lateral_malleolus\":[0.0415,0.0369,0.0464],\"wrist_stylion\":[0.4825,0.462,0.503],\"fingertip_derived\":[0.373,0.350,0.395],\"tragion\":[0.925,0.918,0.932]},\"p50_mm\":{\"cervicale\":1517,\"suprasternale\":1437,\"acromion\":1439,\"axilla\":1328,\"chest_point\":1289,\"tenth_rib\":1119,\"omphalion\":1055,\"iliocristale\":1061,\"buttock\":885,\"trochanterion\":899,\"crotch\":845,\"knee_midpatella\":487,\"lateral_femoral_epicondyle\":491,\"tibiale\":467.5,\"lateral_malleolus\":73,\"wrist\":847}}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "Gordon CC et al. 2014, NATICK/TR-15/007 (cross-check of medians)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "Computed by /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/outline/scripts/ansur_outline.py; output in ../ansur_outline_out.json. The CSV hash (0547aea0...) matches the one recorded in ansur2_dataset.\n\nThis extends the existing key ansur2_segments_male. Its medians (cervicale 0.864, acromial 0.821, chest 0.735, omphalion 0.602, trochanterion 0.512, crotch 0.481, midpatella 0.278, lateral malleolus 0.042) are reproduced. New here: axilla, tenth rib, iliocristale, buttock, wrist and tragion heights, plus each fraction's spread. SD of the fractions is 0.003 to 0.016, so proportions vary little between men.\n\nTR-15/007 medians match the CSV: axilla height 132.80 cm, buttock height 88.50 cm.\n\nFingertip height is wrist height minus hand length; TR-15/007 defines dactylion height (D12) the same way. Tragion height is stature minus tragion-top of head. That head measure is taken seated, but in the Frankfurt plane it is a head-only distance.\n\nCaveats: US Army soldiers aged 17-58. The fractions describe the relaxed standing posture."
  },
  {
   "key": "ansur2_outline_breadth_fractions_male",
   "label": "ANSUR II men: breadths, depths and hand/foot/head lengths as fractions of stature",
   "status": "derived",
   "values": "{\"n\":4082,\"order\":\"[p50, p5, p95] of dimension/stature\",\"fraction_of_stature\":{\"biacromial\":[0.2365,0.221,0.2535],\"bideltoid\":[0.290,0.262,0.3225],\"chest_breadth\":[0.165,0.149,0.182],\"chest_depth\":[0.1445,0.1205,0.169],\"waist_breadth\":[0.186,0.156,0.2185],\"waist_depth\":[0.1335,0.107,0.170],\"hip_breadth_at_buttock\":[0.196,0.177,0.220],\"buttock_depth\":[0.140,0.116,0.165],\"head_breadth\":[0.088,0.081,0.095],\"head_length\":[0.114,0.106,0.122],\"hand_length\":[0.110,0.103,0.117],\"palm_length\":[0.066,0.062,0.071],\"hand_breadth\":[0.050,0.047,0.054],\"foot_length\":[0.154,0.146,0.163],\"foot_breadth\":[0.058,0.0535,0.063],\"bimalleolar_breadth\":[0.0426,0.039,0.046],\"acromion_radiale\":[0.191,0.181,0.201],\"radiale_stylion\":[0.152,0.143,0.163],\"span\":[1.031,0.991,1.081]},\"p50_m\":{\"biacromial\":0.415,\"bideltoid\":0.509,\"chest_breadth\":0.289,\"chest_depth\":0.253,\"waist_breadth\":0.325,\"waist_depth\":0.234,\"hip_breadth\":0.344,\"buttock_depth\":0.246,\"head_breadth\":0.154,\"head_length\":0.200,\"hand_length\":0.193,\"hand_breadth\":0.088,\"foot_length\":0.271,\"foot_breadth\":0.102}}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "Same script (ansur_outline.py). Medians match ansur2_segments_male where both exist, and TR-15/007 tables (hip breadth 34.40 cm, buttock depth 24.60 cm, chest breadth 28.90 cm).\n\nBreadths vary more than heights. The bideltoid fraction spans 0.26-0.32, and waist depth 0.107-0.170. Use stature fractions only for the median template, and set widths from girths (see ansur2_trunk_width_per_girth_male)."
  },
  {
   "key": "ansur2_ellipse_vs_girth_male",
   "label": "How well an ellipse from breadth and depth reproduces the measured girth (chest, waist, buttock, head), ANSUR II men",
   "status": "derived",
   "values": "{\"n\":4082,\"method\":\"Ramanujan II perimeter of ellipse with axes = breadth, depth; ratio = measured girth / ellipse perimeter\",\"girth_over_ellipse\":{\"chest\":{\"mean\":1.238,\"sd\":0.032,\"p5\":1.188,\"p50\":1.237,\"p95\":1.292,\"share_within_5pct\":0.0},\"waist_omphalion\":{\"mean\":1.054,\"sd\":0.018,\"p5\":1.026,\"p50\":1.054,\"p95\":1.083,\"share_within_5pct\":0.40},\"buttock\":{\"mean\":1.090,\"sd\":0.019,\"p5\":1.059,\"p50\":1.090,\"p95\":1.122,\"share_within_5pct\":0.017},\"head\":{\"mean\":1.029,\"sd\":0.012,\"p5\":1.010,\"p50\":1.029,\"p95\":1.048,\"share_within_5pct\":0.96}},\"BMI_quintile_edges\":[15.4,24.2,26.5,28.5,31.0,43.5],\"mean_ratio_by_BMI_quintile\":{\"chest\":[1.217,1.230,1.238,1.245,1.260],\"waist\":[1.049,1.055,1.056,1.056,1.056],\"buttock\":[1.091,1.094,1.090,1.089,1.084]},\"depth_over_breadth_p50\":{\"chest\":0.876,\"waist\":0.721,\"buttock\":0.710,\"head_length_over_breadth\":1.297}}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "Hotzman J et al. 2011, NATICK/TR-11/017 (why chest breadth is narrow: compressed, full inspiration)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR11-017.pdf"
    }
   ],
   "notes": "Computed by /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/outline/scripts/ansur_outline.py, section 'ellipse_vs_girth'. The ellipse never over-predicts at any site; the smallest individual ratio is 0.9996, at the waist.\n\nChest: the tape is 24% longer than the ellipse, for two reasons. The breadth is taken pressed down to the rib cage at full inspiration, and the tape (quiet respiration) spans the back, lats and hollows. On the chest this reproduces the existing key trunk_cross_section_shape (chest_C_over_ellipse_perimeter 1.238). Its waist d/b of 0.727 differs slightly from my median of 0.721, probably mean vs median.\n\nThe chest ratio rises with BMI by about 0.004 per BMI unit (r^2 0.24). The waist and buttock ratios hardly move (r^2 under 0.03).\n\nButtock: the shape is boxier than an ellipse (two lobes, flat sides), so it is 9% short.\n\nHead: girth is measured above the brow ridges on a tilted plane, which gives the 3% gap. 96% of men fall within 5%.\n\nUse: an ellipse is fine for the head, within about 5-6% for the waist, and needs a site factor (x1.09) for the buttock. It is wrong by about a quarter for the chest when caliper chest breadth is used. A silhouette chest width that includes the lats would give a smaller factor, but ANSUR has no such width to test."
  },
  {
   "key": "ansur2_trunk_width_per_girth_male",
   "label": "Front width and side depth per unit girth at chest, waist and buttock, and how they shift with build (ANSUR II men)",
   "status": "derived",
   "values": "{\"n\":4082,\"p50\":{\"chest\":{\"breadth_over_girth\":0.274,\"depth_over_girth\":0.240,\"effective_ellipse_breadth_over_girth\":0.388},\"waist_omphalion\":{\"breadth_over_girth\":0.348,\"depth_over_girth\":0.252,\"effective_ellipse_breadth_over_girth\":0.379},\"buttock\":{\"breadth_over_girth\":0.339,\"depth_over_girth\":0.241,\"effective_ellipse_breadth_over_girth\":0.387}},\"BMI_quintile_edges\":[15.4,24.2,26.5,28.5,31.0,43.5],\"breadth_over_girth_by_BMI_quintile\":{\"chest\":[0.288,0.279,0.273,0.269,0.261],\"waist\":[0.356,0.351,0.349,0.346,0.341],\"buttock\":[0.347,0.341,0.339,0.337,0.334]},\"depth_over_girth_by_BMI_quintile\":{\"chest\":[0.234,0.238,0.240,0.242,0.244],\"waist\":[0.247,0.249,0.251,0.254,0.260],\"buttock\":[0.231,0.236,0.241,0.244,0.250]},\"effective_chest_breadth_over_caliper_breadth\":{\"p50\":1.414,\"p5\":1.316,\"p95\":1.536}}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "Same script, sections 'width_ratios_by_BMI_quintile' and 'effective_ellipse_breadth'.\n\nThe effective ellipse breadth is the breadth an ellipse needs, keeping the measured depth, for its perimeter to equal the measured girth.\n\nFor the chest, the effective breadth is about 1.4 times the caliper breadth. Its value, 0.39 x girth, is close to the waist and buttock values (0.38-0.39). That gives one consistent rule for a filled outline: width about 0.38-0.39 x girth with the measured depth.\n\nAs build gets heavier, cross-sections get rounder. Breadth per girth falls and depth per girth rises, by about 7-10% from the leanest to the heaviest fifth.\n\nBeyond ANSUR's range (bodybuilders, comic figures) these ratios are extrapolations and must be labelled as template values."
  },
  {
   "key": "aist_limb_cross_sections_male",
   "label": "Thigh, knee, calf and ankle: breadth, depth and girth at the same level (AIST 1991-92, young Japanese men)",
   "status": "derived",
   "values": "{\"population\":\"Japanese men aged 18-29, measured Jul-Aug 1991, right side\",\"n\":216,\"stature_mean_m\":1.714,\"thigh_gluteal_furrow\":{\"breadth_m\":0.1652,\"depth_m\":0.1682,\"girth_m\":0.5357,\"depth_over_breadth\":1.018,\"breadth_over_girth\":0.308,\"depth_over_girth\":0.314,\"girth_over_ellipse\":1.023},\"knee_midpatella\":{\"breadth_m\":0.1076,\"depth_m\":0.1176,\"girth_m\":0.3644,\"depth_over_breadth\":1.093,\"breadth_over_girth\":0.295,\"depth_over_girth\":0.323,\"girth_over_ellipse\":1.030},\"calf_max\":{\"breadth_m\":0.1130,\"depth_m\":0.1109,\"girth_m\":0.3623,\"depth_over_breadth\":0.981,\"breadth_over_girth\":0.312,\"depth_over_girth\":0.306,\"girth_over_ellipse\":1.030},\"ankle_min\":{\"breadth_m\":0.0586,\"depth_m\":0.0735,\"girth_m\":0.2194,\"depth_over_breadth\":1.254,\"breadth_over_girth\":0.267,\"depth_over_girth\":0.335,\"girth_over_ellipse\":1.054},\"orig_mm\":\"means (SD): thigh breadth D15 165.2 (12.44) n216, depth E8 168.2 (15.48) n216, girth F16 535.7 (40.20) n217; knee D16 107.6 (5.89), E9 117.6 (6.26), F19 364.4 (18.32); calf D17 113.0 (7.81), E10 110.9 (7.67), F20 362.3 (23.24); ankle D18 58.6 (4.15), E11 73.5 (4.56), F21 219.4 (12.86)\"}",
   "sources": [
    {
     "title": "Kouchi M, Mochimaru M 2005, AIST Anthropometric Database 1991-92 (AIST H16PRO 287): item list",
     "url": "https://www.airc.aist.go.jp/dhrt/91-92/data/list.html"
    },
    {
     "title": "AIST 1991-92 database overview (sample, dates, citation)",
     "url": "https://www.airc.aist.go.jp/dhrt/91-92/index.html"
    },
    {
     "title": "AIST 1991-92 item statistics images D15, E8, F16, D16, E9, F19, D17, E10, F20, D18, E11, F21, B1 (pattern shown for D15)",
     "url": "https://www.airc.aist.go.jp/dhrt/91-92/data/gif/D15.gif"
    }
   ],
   "notes": "I read each item's statistics table and definition from its image and transcribed them into /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/research/outline/scripts/aist_limbs.py; output in ../aist_limbs_out.json. Images are saved in ../dl/aist/.\n\nDefinitions (translated):\n- Thigh breadth D15: horizontal transverse diameter of the thigh at the height of the lower edge of the gluteal furrow, perpendicular to the knee's flexion plane. Standing, feet slightly apart.\n- Thigh depth E8: horizontal front-to-back diameter at the same height. H … [941 more characters on this line; the full prompt is in prompts/af0581ed52ccbdef4.txt]
  },
  {
   "key": "aist_forearm_neckbase_implied_shape",
   "label": "Forearm and neck base: breadth vs girth, and the depth an ellipse would need (AIST 1991-92, weak)",
   "status": "derived",
   "values": "{\"n\":217,\"forearm\":{\"max_breadth_m\":0.0926,\"max_girth_relaxed_m\":0.2592,\"breadth_over_girth\":0.357,\"breadth_over_circle_diameter\":1.122,\"implied_depth_over_breadth\":0.775},\"neck_base\":{\"neck_root_breadth_m\":0.1442,\"neckbase_girth_m\":0.4336,\"breadth_over_girth\":0.333,\"implied_depth_over_breadth\":0.913},\"neck_girth_below_adams_apple_m\":0.3563,\"upper_arm_girth_relaxed_m\":0.2808,\"orig_mm\":\"D14 forearm breadth 92.6 (SD 5.51); F26 forearm girth 259.2 (15.66, n214); D1 neck root breadth 144.2 (7.76); F3 neckbase girth 433.6 (22.39); F1 neck girth 356.3 (17.84); F25 upper arm girth 280.8 (25.04)\"}",
   "sources": [
    {
     "title": "AIST Anthropometric Database 1991-92, item D14 (pattern; also F26, D1, F3, F1, F25)",
     "url": "https://www.airc.aist.go.jp/dhrt/91-92/data/gif/D14.gif"
    },
    {
     "title": "AIST 1991-92 item list",
     "url": "https://www.airc.aist.go.jp/dhrt/91-92/data/list.html"
    }
   ],
   "notes": "Same script (aist_limbs.py). The implied depth is the ellipse depth that, with the measured breadth, reproduces the measured girth. It is not a measurement.\n\nForearm: D14 is the maximum breadth parallel to the palm, perpendicular to the forearm axis, standing with \"palms facing forward\". F26 is the horizontal girth at the most bulging point a few cm below the elbow, arm hanging, fingers extended, no fist. The two are not at one level, so the implied depth/breadth of about 0.78 is approximate.\n\nIn an A-pose with palms in, the forearm is rotated relative to this palms-forward posture, so its front-view width will be narrower.\n\nNeck base: the girth loop runs through cervicale, the neck-root points and the jugular notch, so it is tilted, not horizontal. No source gave the breadth and depth of the neck at one level. The neck at the Adam's apple (the ANSUR neck girth site) has no shape data.\n\nANSUR's forearm girth is flexed with a clenched fist, a different state from AIST's relaxed one."
  },
  {
   "key": "upper_arm_two_view_ellipse_liu2018",
   "label": "Upper arm: an ellipse from front and side photo widths reproduces mid-upper-arm girth within about 3%; one view alone misses by 17-20%",
   "status": "measured",
   "values": "{\"n\":31,\"n_men\":20,\"age_mean_y\":26.2,\"BMI_range\":[18.0,30.6],\"MUAC_right_mean_m\":0.2941,\"ellipse_front_plus_side\":{\"MAD_m\":0.00935,\"MAD_sd_m\":0.00507,\"MAPD_pct\":3.19},\"circle_front_only_MAPD_pct\":17.47,\"circle_side_only_MAPD_pct\":20.44,\"regression_front_plus_side_MAD_m\":0.00462,\"derived_implied_small_over_large_width\":[0.67,0.69],\"orig\":\"ellipse views 1+3: MAD 9.35 +/- 5.07 mm, MAPD 3.19%; circle view 1 MAPD 17.47%, view 3 20.44% (camera calibration)\"}",
   "sources": [
    {
     "title": "Liu Y, Sowmya A, Khamis H. Single camera multi-view anthropometric measurement of human height and mid-upper arm circumference using linear regression. PLoS One 2018;13:e0195600 (full text via Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5896949/fullTextXML"
    }
   ],
   "notes": "Mid-upper arm is the midpoint between acromion and elbow. The arm hangs relaxed. The tape \"touching the skin without compressing\". View 1 is the front, view 3 the side.\n\nFrom Table 5: \"the ellipse method was found to be the most accurate of the three shape models with a mean MAD i of 9.35 mm ± 5.07 mm SD (optimal view combination {1, 3})\". A circle from the front view alone has MAPD 17.47%, and from the side alone 20.44%. That means the relaxed upper arm is far from round.\n\nThe 0.67-0.69 width ratio is my derivation. It assumes an ellipse and that the two single-view circles err in opposite directions. The paper does not say which view is wider; the front-view and back-view errors also differ (17% vs 25%), which suggests method noise.\n\nCaveats: small mixed-sex sample with normal BMI, relaxed arm, not flexed."
  },
  {
   "key": "arm_cross_section_noncircular_heymsfield1982",
   "label": "CT: treating the mid-arm muscle as a circle overstates its area by 10-15%",
   "status": "measured",
   "values": "{\"circle_assumption_area_overestimate_pct\":[10,15],\"bone_inclusion_overestimate_pct\":[5,10],\"total_overestimate_pct\":[20,25],\"derived_equivalent_ellipse_depth_over_breadth\":[0.54,0.60]}",
   "sources": [
    {
     "title": "Heymsfield SB et al. Anthropometric measurement of muscle mass: revised equations for calculating bone-free arm muscle area. Am J Clin Nutr 1982;36:680-690 (abstract, Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=TITLE%3A%22Anthropometric%20measurement%20of%20muscle%20mass%3A%20revised%20equations%20for%20calculating%20bone-free%20arm%20muscle%20area%22&resultType=core&format=json&pageSize=2"
    }
   ],
   "notes": "Abstract: \"Two correctible error sources were: a 10 to 15% overestimation caused by assuming a circular midarm muscle compartment and a 5 to 10% overestimation due to inclusion of midarm cross-sectional bone area.\" Reference standard: computerized axial tomography.\n\nThe equivalent ellipse depth/breadth of 0.54-0.60 is my arithmetic: the d/b at which an ellipse with the same perimeter as the circle has 1/1.10-1/1.15 of its area. It assumes the compartment is an ellipse; a non-elliptical shape also lowers area, so this is a bound, not a measurement.\n\nIt concerns the muscle compartment inside the fat, not the skin outline, and the abstract gives neither the sample nor which axis is longer. Only the abstract was fetched."
  },
  {
   "key": "deleva1996_joint_centre_offsets",
   "label": "de Leva 1996: joint centres relative to surface bony landmarks (shoulder below acromion, hip above trochanterion, knee above tibiale)",
   "status": "reported",
   "values": "{\"sign\":\"positive = proximal\",\"males_mm\":{\"shoulder_vs_acromion\":-34.5,\"elbow_vs_radiale\":[14.3,16.8],\"wrist_vs_stylion\":[-1.5,-2.4],\"hip_vs_trochanterion\":3.2,\"knee_vs_tibiale\":[33.5,35.0],\"ankle_vs_sphyrion\":-12.6},\"females_mm\":{\"shoulder_vs_acromion\":-33.7,\"hip_vs_trochanterion\":2.8,\"knee_vs_tibiale\":[29.4,35.0]},\"males_m\":{\"shoulder_below_acromion\":0.0345,\"hip_above_trochanterion\":0.0032,\"knee_above_tibiale\":[0.0335,0.035]},\"derived_pct_of_segment_males\":{\"shoulder_pct_of_acromion_radiale_331.8mm\":10.4,\"elbow_pct_of_acromion_radiale\":4.3,\"hip_pct_of_trochanterion_tibiale_453.3mm\":0.71,\"knee_pct_of_trochanterion_tibiale\":7.4,\"knee_pct_of_tibiale_sphyrion_393.4mm\":8.9,\"ankle_pct_of_tibiale_sphyrion\":3.2}}",
   "sources": [
    {
     "title": "de Leva P. Adjustments to Zatsiorsky-Seluyanov's segment inertia parameters. J Biomech 1996;29:1223-1230 (PDF, Table 2)",
     "url": "https://ebm.ufabc.edu.br/wp-content/uploads/2013/12/Leva-1996.pdf"
    },
    {
     "title": "de Leva P. Joint center longitudinal positions computed from a selected subset of Chandler's data. J Biomech 1996;29:1231-1233 (abstract, Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=AUTH%3A%22de%20Leva%20P%22%20AND%20PUB_YEAR%3A1996&resultType=core&format=json&pageSize=5"
    }
   ],
   "notes": "The PDF's server omits its intermediate TLS certificate. I fetched GlobalSign's own intermediate, checked it against the system roots and appended it to the CA bundle; verification stayed on.\n\nTable 2 is headed \"Estimated longitudinal positions of the main joint centers for the Zatsiorsky et al. subjects (the positive sign indicates the proximal direction)\". Rows include: Shoulder -33.7 (F) / -34.5 (M) relative to Acromion, calculated using acromion-radiale, \"Estimated for subjects holding their arm in the standard anatomical position (adducted)\". Hip 2.8 / 3.2 relative to Trochanterion. Knee 29.4/33.5 relative to Tibiale (via trochanterion-tibiale) and 35.0/35.0 (via tibiale-sphyrion). Elbow 13.9/14.3 and 16.6/16.8 relative to Radiale. Wrist -1.5 and -2.2/-2.4 relative to Stylion. Ankle -12.6 relative to Sphyrion.\n\nText: \"Since the HJC is slightly proximal to the trochanterion\". The offsets come from percentages de Leva computed on six cadavers measured by Chandler et al. 1975 (companion paper abstract), scaled to Zatsiorsky's young adults. No SD is given.\n\nThe offsets are longitudinal, along the segment axis. De Leva assumes joint centres lie on the segment long axes, so no medial-lateral offset is given. The percentages in values are my arithmetic, using de Leva's standard adducted acromion-radiale (331.8 mm, males) and trochanterion-tibiale (520.2 - 66.9 = 453.3 mm)."
  },
  {
   "key": "deleva1996_jc_segment_lengths_male",
   "label": "de Leva 1996: segment lengths between joint centres, young men (stature 1.741 m)",
   "status": "reported",
   "values": "{\"stature_m\":1.741,\"mass_kg\":73.0,\"lengths_m\":{\"upper_arm_SJC_EJC\":0.2817,\"forearm_EJC_WJC\":0.2689,\"hand_WJC_MET3\":0.0862,\"thigh_HJC_KJC\":0.4222,\"shank_KJC_LMAL\":0.4340,\"foot_heel_toe\":0.2581,\"head_vertex_midgonion\":0.2033,\"trunk_suprasternale_midhip\":0.5319},\"derived_fraction_of_stature\":{\"upper_arm\":0.162,\"forearm\":0.154,\"hand_to_MET3\":0.050,\"thigh\":0.243,\"shank\":0.249,\"foot\":0.148,\"head_vertex_midgonion\":0.117,\"trunk_suprasternale_midhip\":0.306}}",
   "sources": [
    {
     "title": "de Leva P. Adjustments to Zatsiorsky-Seluyanov's segment inertia parameters. J Biomech 1996;29:1223-1230 (PDF, Table 4)",
     "url": "https://ebm.ufabc.edu.br/wp-content/uploads/2013/12/Leva-1996.pdf"
    }
   ],
   "notes": "Table 4 header: \"Adjusted parameters for females (F; body mass = 61.9 kg ...) and males (M; 73.0 kg, 1.741 m)\". Male longitudinal lengths in mm: Head VERT-MIDG 203.3, Trunk SUPR-MIDH 531.9, Upper arm SJC-EJC 281.7, Forearm EJC-WJC 268.9, Hand WJC-MET3 86.2, Thigh HJC-KJC 422.2, Shank KJC-LMAL 434.0, Foot HEEL-TTIP 258.1.\n\nThe fractions of stature are my arithmetic. The subjects were Zatsiorsky's Russian college-age men; some lengths were themselves estimated from other surveys. Useful for placing elbows, knees and the limb lengths between joint centres."
  },
  {
   "key": "ansur2_joint_centre_heights_estimate",
   "label": "Joint-centre heights for the ANSUR II template, from de Leva's offsets (shoulder, elbow, wrist, hip, knee)",
   "status": "derived",
   "values": "{\"n\":4082,\"fraction_of_stature_p50\":{\"shoulder\":0.801,\"elbow\":0.638,\"wrist\":0.482,\"hip\":0.514,\"knee\":0.2845},\"fraction_p5_p95\":{\"shoulder\":[0.785,0.816],\"elbow\":[0.621,0.653],\"wrist\":[0.461,0.502],\"hip\":[0.491,0.542],\"knee\":[0.271,0.299]},\"shoulder_below_acromion_m\":{\"p50\":0.0348,\"p5\":0.0319,\"p95\":0.0380},\"hip_above_trochanterion_m_p50\":0.0031,\"knee_above_tibiale_m_p50\":0.0319,\"knee_minus_lateral_femoral_epicondyle_m\":{\"p50\":0.0083,\"p5\":-0.0062,\"p95\":0.0245}}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "de Leva P 1996, J Biomech 29:1223 (Table 2 offsets)",
     "url": "https://ebm.ufabc.edu.br/wp-content/uploads/2013/12/Leva-1996.pdf"
    }
   ],
   "notes": "Script ansur_outline.py, section 'joint_centre_heights_deLeva_offsets'. Rules applied to each man:\n- Shoulder = acromial height - 0.104 x acromion-radiale.\n- Elbow = acromial height - acromion-radiale + 0.0431 x acromion-radiale. Radiale height is not in ANSUR II, so it is approximated with the arm hanging.\n- Wrist = wrist height - 0.006 x radiale-stylion.\n- Hip = trochanterion + 0.0071 x (trochanterion - tibiale).\n- Knee = tibiale + 0.0739 x (trochanterion - tibiale).\n\nANSUR's acromion (border of the acromial process meeting the mid-shoulder line) is close to de Leva's (\"most lateral point on the lateral margin of the acromial process\"). ANSUR's median acromion-radiale of 335 mm is close to de Leva's 331.8 mm.\n\nThe knee centre lands 8 mm (median) above the ANSUR lateral femoral epicondyle, so epicondyle height is a usable proxy. Shoulder longitudinal offsets are treated as vertical, which holds only with the arm hanging.\n\nThis is an estimate built from a 6-cadaver source applied to 4,082 soldiers."
  },
  {
   "key": "hip_joint_centre_regression_hara2016",
   "label": "Hip joint centre from pelvic landmarks: CT regression on 157 bodies, accuracy 4-5 mm",
   "status": "measured",
   "values": "{\"n\":157,\"n_skeletally_mature\":120,\"origin\":\"midpoint between the two ASIS; x posterior-anterior, y medial-lateral, z inferior-superior\",\"equations_LL_mm\":{\"x\":\"11 - 0.063*LL\",\"y\":\"8 + 0.086*LL\",\"z\":\"-9 - 0.078*LL\"},\"equations_IA_mm\":{\"x\":\"-4 - 0.178*IA\",\"y\":\"10 + 0.329*IA\",\"z\":\"-15 - 0.280*IA\"},\"LOOCV_mean_abs_error_m\":{\"x\":0.0052,\"y\":0.0044,\"z\":0.0038},\"bell_equations_error_on_this_data_m\":{\"x\":0.0081,\"y\":0.0061,\"z\":0.0109},\"harrington2007_max_abs_error_common_equations_adults_m\":0.031}",
   "sources": [
    {
     "title": "Hara R, McGinley J, Briggs C, Baker R, Sangeux M. Predicting the location of the hip joint centres, impact of age group and sex. Sci Rep 2016;6:37707 (full text via Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5121588/fullTextXML"
    },
    {
     "title": "Harrington ME et al. Prediction of the hip joint centre in adults, children, and patients with cerebral palsy based on MRI. J Biomech 2007;40:595-602 (abstract, Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=TITLE%3A%22Prediction%20of%20the%20hip%20joint%20centre%20in%20adults%2C%20children%2C%20and%20patients%20with%20cerebral%20palsy%22&resultType=core&format=json&pageSize=3"
    },
    {
     "title": "Bell AL, Pedersen DR, Brand RA. A comparison of the accuracy of several hip center location prediction methods. J Biomech 1990;23:617-621 (record only, no abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=TITLE%3A%22comparison%20of%20the%20accuracy%20of%20several%20hip%20center%20location%20prediction%20methods%22&resultType=core&format=json&pageSize=3"
    }
   ],
   "notes": "Hara 2016: CT of 157 deceased individuals (37 children, 120 skeletally mature). HJC = centre of the femoral head. Table 2 and the text: \"HJC X = 11 −0.063 LL, HJC Y = 8 +0.086 LL, and HJC Z = −9 −0.078 LL\", where LL is clinical leg length, ASIS to medial malleolus through the medial femoral epicondyle, and IA is the inter-ASIS distance. Accuracy: \"5.2 mm, 4.4 mm, and 3.8 mm in the posterior-anterior, medial-lateral and inferior-superior directions\". Table 3 gives Bell et al.'s equations applied to the Hara data: 8.1, 6.1, 10.9 mm.\n\nHarrington 2007 abstract: \"Maximum absolute errors of 31 mm were found in adults\" for three common regression equations. Its own equations are not quoted in the abstract.\n\nBell 1990 and Harrington full texts are paywalled, so Bell's coefficients are not verified here. All of these work from bony pelvic landmarks (ASIS), which ANSUR II does not measure. For a silhouette, use the trochanter-level rule plus the inter-HJC estimate."
  },
  {
   "key": "hip_joint_centre_vs_greater_trochanter",
   "label": "Hip joint centre height is about level with the top of the greater trochanter (within about 1 cm)",
   "status": "measured",
   "values": "{\"hu2022_head_centre_to_GT_tip_along_femoral_axis_m\":{\"median\":0.00635,\"iqr\":[0.00433,0.00975]},\"hu2022_n\":33,\"hu2022_age_range_y\":[75,85],\"hu2022_femoral_offset_m\":{\"median\":0.0492,\"iqr\":[0.0465,0.0527]},\"deleva1996_hjc_above_trochanterion_m\":0.0032,\"orig_mm\":\"VD-CFH-TGTAAF non-operative side median 6.35 (IQR 4.33-9.75); FO 49.20 (46.50-52.70)\"}",
   "sources": [
    {
     "title": "Hu H et al. Intraoperative method of femoral head central measurement to prevent leg length discrepancy following hemiarthroplasty. Front Surg 2022;9:1055199 (full text via Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC9859662/fullTextXML"
    },
    {
     "title": "de Leva P 1996, J Biomech 29:1223 (Table 2: hip +3.2 mm vs trochanterion)",
     "url": "https://ebm.ufabc.edu.br/wp-content/uploads/2013/12/Leva-1996.pdf"
    }
   ],
   "notes": "Hu 2022, Table 3: \"the median number of VD-CFH-TGTAAF ... on the nonoperative side were 6.35 mm (IQR, 4.33–9.75 mm)\". VD-CFH-TGTAAF is the vertical distance from the centre of the femoral head to the tip of the greater trochanter, along the femoral anatomical axis, on radiographs.\n\nThe paper does not state the direction of this distance. De Leva places the HJC slightly proximal (3.2 mm) to trochanterion.\n\nCaveats: elderly femoral-neck-fracture patients (sex mix not checked), the uninjured side, n = 33. The skin landmark trochanterion is palpated, and the handbook calls it difficult to locate. Treat this as 'level with trochanterion, within about 1 cm'."
  },
  {
   "key": "inter_hip_joint_centre_distance_estimate",
   "label": "Distance between the two hip joint centres: about 0.10 of stature, about half the ANSUR hip breadth",
   "status": "estimate",
   "values": "{\"inter_HJC_m\":[0.169,0.188],\"fraction_of_stature\":[0.096,0.108],\"fraction_of_ANSUR_hip_breadth_0.344m\":[0.49,0.55],\"inputs\":{\"bispinous_breadth_IA_m\":0.2557,\"assumed_leg_length_LL_m\":0.89}}",
   "sources": [
    {
     "title": "Hara R et al. 2016, Sci Rep 6:37707 (y equations)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5121588/fullTextXML"
    },
    {
     "title": "de Leva P 1996, J Biomech 29:1223 (Table 3: bispinous breadth 255.7 mm scaled, from Clauser 1969 cadavers)",
     "url": "https://ebm.ufabc.edu.br/wp-content/uploads/2013/12/Leva-1996.pdf"
    }
   ],
   "notes": "My arithmetic, not a measured value.\n- Route 1: 2 x (10 + 0.329 x IA), with IA = 255.7 mm, gives 188 mm. IA is the scaled male bispinous breadth in de Leva Table 3, from Clauser et al. 1969's 13 male cadavers, mean age 49. 188 mm is 0.108 of de Leva's 1.741 m stature.\n- Route 2: 2 x (8 + 0.086 x LL), with an assumed LL of 0.89 m (ASIS to medial malleolus for a 1.755 m man; ANSUR II has no iliospinale height), gives 169 mm, or 0.096 of 1.755 m.\n\nBoth estimates are about half of ANSUR median hip breadth (344 mm). Use it only to place the leg pivots for the silhouette and for the 'thighs touch' limit, labelled estimate."
  },
  {
   "key": "glenohumeral_centre_estimation_methods",
   "label": "Shoulder (glenohumeral) joint centre: published estimation methods and their accuracy",
   "status": "reported",
   "values": "{\"meskers1998\":{\"n_cadaver_specimens\":36,\"regression_RMSE_m\":[0.00232,0.00269,0.00304],\"inputs\":\"5 scapular bony landmarks\"},\"campbell2009\":{\"n_subjects\":20,\"new_regression_error_m\":{\"mean\":0.013,\"sd\":0.002},\"inter_tester_error_m\":{\"mean\":0.006,\"sd\":0.004}},\"deleva1996_shoulder_below_acromion_m\":0.0345,\"vicon_shoulder_offset_guideline\":\"(anterior/posterior girth)/2\"}",
   "sources": [
    {
     "title": "Meskers CG et al. In vivo estimation of the glenohumeral joint rotation center from scapular bony landmarks by linear regression. J Biomech 1998;31:93-96 (abstract, Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=TITLE:%22glenohumeral%20joint%20rotation%20center%20from%20scapular%20bony%20landmarks%22&resultType=core&format=json"
    },
    {
     "title": "Campbell AC et al. MRI development and validation of two new predictive methods of glenohumeral joint centre location identification. J Biomech 2009;42:1527-1532 (abstract, Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID%3A19428014%20AND%20SRC%3AMED&resultType=core&format=json&pageSize=1"
    },
    {
     "title": "Vicon FAQ: required subject measurements for Plug-in Gait (shoulder offset)",
     "url": "https://www.vicon.com/support/faqs/what-are-the-required-subject-measurements-for-plug-in-gait/"
    },
    {
     "title": "Tsai CY et al. 2012, Biomed Eng Online 11:87 (describes Rab 2002 constant-offset method; full text)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC3538571/fullTextXML"
    },
    {
     "title": "Rab G, Petuskey K, Bagley A. A method for determination of upper extremity kinematics. Gait Posture 2002;15:113-119 (abstract, Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:11869904%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Meskers 1998 abstract: regression on 36 cadaver specimens predicted the rotation centre with RMSE 2.32, 2.69 and 3.04 mm. It needs scapular landmarks, which a silhouette lacks.\n\nCampbell 2009 abstract: 20 subjects with MRI. Their new regression gave \"an GHJ location error of 13+/-2 mm\"; six established methods were all worse.\n\nVicon FAQ: shoulder offset is \"The vertical distance from the center of the glenohumeral joint to the marker on the acromion clavicular joint\", and \"Some researchers have used the (anterior/posterior girth)/2\". That is an industry rule of thumb, not data.\n\nTsai 2012 describes Rab 2002 as \"a constant offset method which estimates the rotation center using constant distance ratio relative to acromion marker and the mid-point between lateral and medial epicondyle markers\". The ratio itself was not verified; Rab's full text is paywalled and his abstract does not give it.\n\nThe only usable surface-landmark number fetched is de Leva's 34.5 mm below the acromion (see deleva1996_joint_centre_offsets). Expect errors of about 1-2 cm."
  },
  {
   "key": "head_height_fraction_male",
   "label": "Head height (crown to chin) as a fraction of stature: about 0.13 (7.8 heads), with AIST's direct 0.139",
   "status": "derived",
   "values": "{\"aist_young_men\":{\"total_head_height_m\":0.2387,\"stature_m\":1.714,\"head_over_stature\":0.139,\"heads_per_stature\":7.18,\"head_height_over_tragion_vertex\":1.722,\"tragion_vertex_over_stature\":0.0809},\"ansur_scaled\":{\"head_height_m\":{\"p50\":0.2256,\"p5\":0.2084,\"p95\":0.2428},\"head_over_stature\":{\"p50\":0.129,\"p5\":0.117,\"p95\":0.141},\"heads_per_stature_p50\":7.77,\"chin_height_over_stature_p50\":0.871,\"chin_minus_cervicale_m_p50\":0.0129},\"ansur_tragion_top_over_stature_p50\":0.0747,\"ansur_cervicale_over_stature_p50\":0.864,\"orig_mm\":\"AIST A36 238.7 (SD 8.03, n 217); A33 138.6 (5.98); B1 1714.0 (62.55)\"}",
   "sources": [
    {
     "title": "AIST Anthropometric Database 1991-92, item A36 total head height",
     "url": "https://www.airc.aist.go.jp/dhrt/91-92/data/gif/A36.gif"
    },
    {
     "title": "AIST 1991-92 item A33 tragion to vertex height",
     "url": "https://www.airc.aist.go.jp/dhrt/91-92/data/gif/A33.gif"
    },
    {
     "title": "AIST 1991-92 item B1 stature",
     "url": "https://www.airc.aist.go.jp/dhrt/91-92/data/gif/B1.gif"
    },
    {
     "title": "ANSUR II male CSV (tragion-top of head, stature, cervicale)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "ANSUR II has no crown-to-chin measure; only tragion-top of head, 131 mm. AIST A36 definition (translated): distance from the menton/gnathion point to the plane touching the top of the head, perpendicular to the Frankfurt plane. Seated, with a head gauge.\n\nThe ANSUR-scaled value multiplies each soldier's tragion-top by the AIST ratio 238.7/138.6 (script ansur_outline.py, 'head_height_estimate'). That ratio comes from Japanese men, whose tragion-top/stature (0.081) is larger than ANSUR's (0.075). Population and instrument differences both play a part.\n\nRange: about 7.2-7.8 heads per stature (0.13-0.14 of stature). The chin sits about 13 mm above cervicale height in the ANSUR estimate."
  },
  {
   "key": "hand_foot_head_silhouette_fractions_male",
   "label": "Hand, foot and head proportions for silhouettes (fractions of stature)",
   "status": "derived",
   "values": "{\"ANSUR_p50_fraction_of_stature\":{\"hand_length\":0.110,\"palm_length\":0.066,\"hand_breadth_metacarpals\":0.050,\"foot_length\":0.154,\"foot_breadth\":0.058,\"heel_breadth\":0.041,\"bimalleolar_breadth\":0.043,\"lateral_malleolus_height\":0.0415,\"wrist_height\":0.4825,\"fingertip_height\":0.373,\"head_breadth\":0.088,\"head_length\":0.114,\"bizygomatic_breadth\":0.081,\"menton_sellion\":0.070,\"span\":1.031},\"ANSUR_head_length_over_breadth_p50\":1.297,\"AIST_mean_fraction_of_stature\":{\"hand_thickness_at_MC3\":0.016,\"dorsal_arch_height\":0.036,\"neck_root_breadth\":0.084,\"max_body_breadth_arms_hanging\":0.274},\"ANSUR_p50_m\":{\"hand_length\":0.193,\"hand_breadth\":0.088,\"foot_length\":0.271,\"foot_breadth\":0.102,\"head_breadth\":0.154,\"head_length\":0.200},\"AIST_mean_m\":{\"hand_thickness\":0.0275,\"dorsal_arch_height\":0.0619}}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "AIST 1991-92 item L16 hand thickness",
     "url": "https://www.airc.aist.go.jp/dhrt/91-92/data/gif/L16.gif"
    },
    {
     "title": "AIST 1991-92 item M6 dorsal arch height",
     "url": "https://www.airc.aist.go.jp/dhrt/91-92/data/gif/M6.gif"
    }
   ],
   "notes": "ANSUR fractions come from ansur_outline.py. Hand breadth is metacarpale II-V, without the thumb. Fingertip height = wrist height - hand length, as in TR-15/007 D12; arms straight, palms in.\n\nAIST items:\n- L16 hand thickness: maximum thickness at the head of the 3rd metacarpal, 27.5 mm (SD 2.65, n 214).\n- M6 dorsal arch height: floor to the cuneiform point, 61.9 mm (SD 5.43, n 214).\n- D3 maximum body breadth: across the arms at the lateral humeral epicondyle level, arms hanging, 469.9 mm.\nThese are fractions of AIST mean stature (1.714 m), Japanese men.\n\nIn an A-pose with palms facing in, the front view shows the hand's thickness (about 0.016 of stature) and the side view its breadth (about 0.050). The front view of a foot shows breadth and instep height. The side view shows length and the ankle at about 0.04 of stature."
  },
  {
   "key": "ellipse_volume_model_accuracy_recheck",
   "label": "Published accuracy of elliptical-zone and geometric volume models (re-check of existing keys)",
   "status": "measured",
   "values": "{\"chiu2016\":{\"n_men\":17,\"reference\":\"3D photonic scanning\",\"total_volume_relative_TEM_pct\":3,\"large_segments_relative_TEM_pct\":\"<10\",\"poor_segments\":[\"neck\",\"hand\",\"foot\"]},\"williams2013_table1_body_mass_accuracy_pct\":{\"jensen1978_photo_elliptical_zones\":\"<2\",\"yeadon1990\":\"<2.1\",\"gittoes2009\":\"<2.9\",\"hatze1980\":\"<0.05 (unit unclear)\"},\"liu2018_upper_arm_two_view_ellipse_girth_MAPD_pct\":3.19}",
   "sources": [
    {
     "title": "Chiu CY et al. Validation of body volume acquisition by using elliptical zone method. Int J Sports Med 2016;37:1117-1123 (abstract, Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID%3A27676147%20AND%20SRC%3AMED&resultType=core&format=json&pageSize=1"
    },
    {
     "title": "Williams G et al. Accuracy of body mass prediction using segmental inertia parameters modelled from photographic images. ISBS Proceedings 2013 (PDF, Table 1)",
     "url": "https://ojs.ub.uni-konstanz.de/cpa/article/view/5669/5160"
    },
    {
     "title": "Jensen RK 1978, J Biomech 11:349-358 (record only, no abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=AUTH%3A%22Jensen%20RK%22%20AND%20TITLE%3A%22photogrammetric%22%20AND%20PUB_YEAR%3A1978&resultType=core&format=json&pageSize=3"
    }
   ],
   "notes": "This relies on the existing keys ezone_volume_accuracy and inertia_model_mass_accuracy_table; I re-fetched both sources and the numbers hold.\n\nChiu 2016: \"The relative technical error of measurement (TEM) of total body volume estimations was around 3% for E-Zone\". Upper torso, lower torso, thigh, shank, upper arm and lower arm were \"accurately (relative TEM<10%)\"; neck, hand and foot were poor.\n\nWilliams 2013 Table 1 (secondary): \"Jensen (1978) Photo 408 ... <2\", \"Yeadon (1990) Direct 95 ... < 2.1\", \"Gittoes et al. (2009) Photo 95 ... < 2.9\", \"Hatze (1980) Direct 242 ... < 0.05\". The column is \"% accuracy of predicted body mass\".\n\nJensen's original is not accessible. Important: elliptical-zone models are accurate for volume (area integrated along the body), even though a single trunk ellipse from caliper breadths misses the chest girth by about 24% (ansur2_ellipse_vs_girth_male). Volume and girth accuracy are different questions."
  }
 ],
 "recommendations": "**Status labels on the chart**\n- Measurement definitions: \"official\".\n- ANSUR and AIST fractions: \"derived\" (ratios of measured data).\n- Joint centres: \"reported\" or \"derived\".\n- Upper-arm and neck widths, and anything past ANSUR's range: \"estimate\" or \"template\".\n\n**1. Template heights.** Draw every human build on one template from ANSUR II median fractions of stature: crown 1.000, chin about 0.871 (estimate), cervicale 0.864, acromion 0.821, suprasternale 0.819, axilla 0.757, chest point 0.735, waist (omphalion) 0.602, trochanterion 0.512, buttock 0.505 … [3,508 more characters on this line; the full prompt is in prompts/af0581ed52ccbdef4.txt]
 "gaps": "**Paywalled; only abstracts or records fetched**\n- ISB recommendations (Wu 2002 Part I, Wu 2005 Part II): abstracts contain no joint-centre definitions. The \"midpoint of the epicondyles\" rule for elbow and knee is therefore not verified from the ISB text.\n- Bell 1990: record only, so its equations are not verified. Only its errors on Hara's CT data are quoted.\n- Harrington 2007: abstract only, so its equations are not quoted.\n- Meskers 1998 and Campbell 2009: abstracts only. The mean shoulder-centre position relative to the acromion and Campbell's offset values are unknown.\n-  … [1,758 more characters on this line; the full prompt is in prompts/af0581ed52ccbdef4.txt]
}
```

</details>


- `Bash` Make zoomed gridded crops of heads and feet in duo.jpg: `mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo && cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b7...` (+20 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/rexhead.png
- `Bash` Contrast-enhanced crop of Rex's head: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo && python3 - <<'EOF'` (+13 lines)

**Claude · 2026-10-11 03:14:09 UTC**

Research workflow is running in the background. Meanwhile I'm measuring Rex's and Ollie's skull-top heights on duo.jpg.


- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/rexhead2.png
- `TaskUpdate` #1 status=completed
- `TaskUpdate` #2 status=in_progress
- `TaskUpdate` #3 status=in_progress
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/rexfeet.png
- `Bash` Crop Rex's head in the turnaround side and front views: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo && python3 - <<'EOF'` (+17 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/rexside_head.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/rexfront_head.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/olliehead.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/olliefeet.png

**Claude · 2026-10-11 03:15:49 UTC**

Skull-top readings done (Rex ≈ 2.92 m; Ollie ≈ 2.98 m in boots, ≈ 2.91 m barefoot). Now examining turnaround pixel colours to build the figure mask.


- `Bash` Sample background and floor colours in turnarounds: `python3 - <<'EOF'` (+14 lines)
- `Bash` Create project folders and inspect PNG headers: `mkdir -p /home/user/rex-strength-lab/build-comparison/{src,data,tools,test,research/reviews} && cd /home/user/rex-strength-lab/build-comparison && python3 -c "` (+5 lines)
- `Write` /home/user/rex-strength-lab/build-comparison/tools/png.js
- `Bash` Verify the PNG reader/writer against PIL: `node -e "` (+9 lines)
- `Write` /home/user/rex-strength-lab/build-comparison/tools/derive_outline.js
- `Bash` Run ANSUR outline derivation and print results: `node tools/derive_outline.js && node -e "` (+5 lines)

**Claude · 2026-10-11 03:17:58 UTC**

Outline template derived from ANSUR II (4,082 men). Launching the design workflow in parallel with research.


- `Bash` Extract palettes from turnarounds and fonts used: `cd /home/user/rex-strength-lab && python3 - <<'EOF'` (+17 lines)
- `Skill` artifact-design
- `Bash` Read the Build Calculator page head and tokens: `sed -n 1,80p build-calculator/src/app.html && wc -l build-calculator/src/app.html rex-strength-lab/src/app.html`


### Workflow `build-comparison-design` · 2026-10-11 03:19:07 UTC

- `Workflow` build-comparison-design: Design the Build Comparison page: three independent proposals with mockups, two judges, one synthesis with the chosen chart style recorded for review
  - run `wf_ff7816d2-f41`: 6 subagents, listed below

**Subagent `design:instrument`** · build-comparison-design · started 2026-10-11 03:19:07 UTC

- styles: 3; mockup files: 19.
- The mockup is a single page in the Build Calculator's type system (Big Shoulders Display, Public Sans, IBM Plex Mono) and its status-chip vocabulary. The page is a stack of plates, the way an instrument is a stack of panels: 1.

<details>
<summary>Prompt, verbatim (6,213 characters)</summary>

Workflow run `wf_ff7816d2-f41`, phase `Propose`, agent `abf448fb26a0e35ea`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/abf448fb26a0e35ea.txt](prompts/abf448fb26a0e35ea.txt).

```text
You are designing one page: "Build Comparison", a new self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/. Read /home/user/rex-strength-lab/build-comparison/BRIEF.md and /home/user/rex-strength-lab/CLAUDE.md first. Look at the art: /home/user/rex-strength-lab/build-comparison/assets/rex-turnaround.png and ollie-turnaround.png (A-pose turnarounds, the style key), /home/user/rex-strength-lab/rex-strength-lab/assets/duo.jpg. Look at the sister page's design system in /home/user/rex-strength-lab/build-calculator/src/app.html (a tailor's measurement sheet: tokens --paper/--sheet/--ink/--tape/--chalk, fonts Big Shoulders Display, Public Sans, IBM Plex Mono) and the screenshots in /home/user/rex-strength-lab/build-calculator/shots/ if present (run node /home/user/rex-strength-lab/build-calculator/test/shots.js to make them if absent; it writes to /home/user/rex-strength-lab/build-calculator/shots/, which is git-ignored).
What the page does: it ranks MEN's builds by a size-independent "muscle level" score S = 1.8 x fat-free mass / height^3 (FFMI after rescaling the body to 1.80 m at the same shape), shown beside plain FFMI. Scale runs from about 15 to 1,000 (log or broken axis). Builds (about 49 men): ANSUR II soldiers (5th/50th/95th percentile, plus 3 subgroups), NHANES US men, natural athletes (Kouri non-users, Chappell natural pros, Mr America 1938-54 mean, Steve Reeves), 12 bodybuilders (Coleman, Arnold, Yates, Cutler, Heath, Big Ramy, Oliva, 5 study groups), 5 strongmen/lifters (Shaw, Bjornsson, Hall, Tala … [1,338 more characters on this line; the full prompt is in prompts/abf448fb26a0e35ea.txt]
Silhouettes: flat filled shapes for every build, all at the same drawn height by default (option: real heights side by side; option: side view). Builds differ only in their outline marking: measured (solid edge), derived from a template build (dashed edge), measured from art (dotted edge), explained in a key; markings can vary along one figure (e.g. measured chest, template forearm). Human figures are drawn from data (ANSUR II proportions), never from the duo's shapes; Rex and Ollie are traced from their turnarounds (their crest/horns rise above the common skull-top line; their tails are excluded from the score and should read as excluded). Do not use photos or art of real people or Marvel/DC characters. A fill colour per group (everyday, natural athletes, bodybuilders, strongmen and lifters, comic, the duo) is a reasonable default. Propose 2-3 chart styles drawn from the art's palette (the art: warm brown, dark umber, orange-gold crest glints, navy and maroon briefs, cool blue-grey studio background #888898, light floor) and pick one.
The page also holds a measuring tool: upload an A-pose model sheet (front, side, back), type the height and a density, and it reports volume, mass, seven girths, segment lengths, frontal area and the score, with checks (views differ in height by more than 2%, landmarks don't line up) and the uncertainty; it also shows a target outline (any target score) as front and side images. The viewer's sandbox blocks downloads: results are copied (a copy button) and images shown.
Constraints (Artifact page contract): no external scripts or images; Google Fonts only; works at 390 px and 1280 px, light and dark (token-based theming with prefers-color-scheme and [data-theme]); no horizontal page scroll; everything readable at rest; plain, specific copy for a general audience (the owner is a professional critic and reads with ADHD: lead each section with a one-line verdict, short sentences, gloss jargon); every number on the page shows its status (measured, official, reported, derived, estimate). Avoid templated AI looks (cream+serif+terracotta, near-black+acid green, purple gradients, Inter, emoji markers, rounded cards everywhere).
Write scratch files only under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/ (create it). Do not edit anything under /home/user/rex-strength-lab. Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).

ANGLE: a scientific instrument. The chart is the page: one log axis drawn like a calibrated scale, every build a range bar with its figure; strict about uncertainty and status.

Produce a design proposal. Build a static mockup HTML (rough figures are fine: simple shapes standing in for silhouettes, real labels and plausible numbers clearly marked as mock) at /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/mock.html and screenshot it at 390x844 and 1280x900 in light and dark (/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/*.png). Look at your own screenshots and fix what reads badly before you answer. List the files in mockup_files.
```

</details>

**Subagent `design:lineup`** · build-comparison-design · started 2026-10-11 03:19:08 UTC

- styles: 3; mockup files: 15.
- The mockup is built and screenshotted at 390x844 and 1280x900 in light and dark. I checked full-page shots too, fixed what read badly, and re-shot.

<details>
<summary>Prompt, verbatim (6,228 characters)</summary>

Workflow run `wf_ff7816d2-f41`, phase `Propose`, agent `a71d8f74b7ab2e7ac`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a71d8f74b7ab2e7ac.txt](prompts/a71d8f74b7ab2e7ac.txt).

```text
You are designing one page: "Build Comparison", a new self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/. Read /home/user/rex-strength-lab/build-comparison/BRIEF.md and /home/user/rex-strength-lab/CLAUDE.md first. Look at the art: /home/user/rex-strength-lab/build-comparison/assets/rex-turnaround.png and ollie-turnaround.png (A-pose turnarounds, the style key), /home/user/rex-strength-lab/rex-strength-lab/assets/duo.jpg. Look at the sister page's design system in /home/user/rex-strength-lab/build-calculator/src/app.html (a tailor's measurement sheet: tokens --paper/--sheet/--ink/--tape/--chalk, fonts Big Shoulders Display, Public Sans, IBM Plex Mono) and the screenshots in /home/user/rex-strength-lab/build-calculator/shots/ if present (run node /home/user/rex-strength-lab/build-calculator/test/shots.js to make them if absent; it writes to /home/user/rex-strength-lab/build-calculator/shots/, which is git-ignored).
What the page does: it ranks MEN's builds by a size-independent "muscle level" score S = 1.8 x fat-free mass / height^3 (FFMI after rescaling the body to 1.80 m at the same shape), shown beside plain FFMI. Scale runs from about 15 to 1,000 (log or broken axis). Builds (about 49 men): ANSUR II soldiers (5th/50th/95th percentile, plus 3 subgroups), NHANES US men, natural athletes (Kouri non-users, Chappell natural pros, Mr America 1938-54 mean, Steve Reeves), 12 bodybuilders (Coleman, Arnold, Yates, Cutler, Heath, Big Ramy, Oliva, 5 study groups), 5 strongmen/lifters (Shaw, Bjornsson, Hall, Tala … [1,338 more characters on this line; the full prompt is in prompts/a71d8f74b7ab2e7ac.txt]
Silhouettes: flat filled shapes for every build, all at the same drawn height by default (option: real heights side by side; option: side view). Builds differ only in their outline marking: measured (solid edge), derived from a template build (dashed edge), measured from art (dotted edge), explained in a key; markings can vary along one figure (e.g. measured chest, template forearm). Human figures are drawn from data (ANSUR II proportions), never from the duo's shapes; Rex and Ollie are traced from their turnarounds (their crest/horns rise above the common skull-top line; their tails are excluded from the score and should read as excluded). Do not use photos or art of real people or Marvel/DC characters. A fill colour per group (everyday, natural athletes, bodybuilders, strongmen and lifters, comic, the duo) is a reasonable default. Propose 2-3 chart styles drawn from the art's palette (the art: warm brown, dark umber, orange-gold crest glints, navy and maroon briefs, cool blue-grey studio background #888898, light floor) and pick one.
The page also holds a measuring tool: upload an A-pose model sheet (front, side, back), type the height and a density, and it reports volume, mass, seven girths, segment lengths, frontal area and the score, with checks (views differ in height by more than 2%, landmarks don't line up) and the uncertainty; it also shows a target outline (any target score) as front and side images. The viewer's sandbox blocks downloads: results are copied (a copy button) and images shown.
Constraints (Artifact page contract): no external scripts or images; Google Fonts only; works at 390 px and 1280 px, light and dark (token-based theming with prefers-color-scheme and [data-theme]); no horizontal page scroll; everything readable at rest; plain, specific copy for a general audience (the owner is a professional critic and reads with ADHD: lead each section with a one-line verdict, short sentences, gloss jargon); every number on the page shows its status (measured, official, reported, derived, estimate). Avoid templated AI looks (cream+serif+terracotta, near-black+acid green, purple gradients, Inter, emoji markers, rounded cards everywhere).
Write scratch files only under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/ (create it). Do not edit anything under /home/user/rex-strength-lab. Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).

ANGLE: a police-lineup / museum-specimen parade. Figures first: silhouettes standing in a row at the same height, ordered by score, the scale running under their feet; the empty gaps are empty floor.

Produce a design proposal. Build a static mockup HTML (rough figures are fine: simple shapes standing in for silhouettes, real labels and plausible numbers clearly marked as mock) at /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock.html and screenshot it at 390x844 and 1280x900 in light and dark (/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/*.png). Look at your own screenshots and fix what reads badly before you answer. List the files in mockup_files.
```

</details>

**Subagent `design:reader`** · build-comparison-design · started 2026-10-11 03:44:09 UTC

- styles: 3; mockup files: 21.
- Proposal: "the tape you scroll down". On a phone a 46 px sticky rail sits at the left.

<details>
<summary>Prompt, verbatim (6,250 characters)</summary>

Workflow run `wf_ff7816d2-f41`, phase `Propose`, agent `aa07af55531bc4f55`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/aa07af55531bc4f55.txt](prompts/aa07af55531bc4f55.txt).

```text
You are designing one page: "Build Comparison", a new self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/. Read /home/user/rex-strength-lab/build-comparison/BRIEF.md and /home/user/rex-strength-lab/CLAUDE.md first. Look at the art: /home/user/rex-strength-lab/build-comparison/assets/rex-turnaround.png and ollie-turnaround.png (A-pose turnarounds, the style key), /home/user/rex-strength-lab/rex-strength-lab/assets/duo.jpg. Look at the sister page's design system in /home/user/rex-strength-lab/build-calculator/src/app.html (a tailor's measurement sheet: tokens --paper/--sheet/--ink/--tape/--chalk, fonts Big Shoulders Display, Public Sans, IBM Plex Mono) and the screenshots in /home/user/rex-strength-lab/build-calculator/shots/ if present (run node /home/user/rex-strength-lab/build-calculator/test/shots.js to make them if absent; it writes to /home/user/rex-strength-lab/build-calculator/shots/, which is git-ignored).
What the page does: it ranks MEN's builds by a size-independent "muscle level" score S = 1.8 x fat-free mass / height^3 (FFMI after rescaling the body to 1.80 m at the same shape), shown beside plain FFMI. Scale runs from about 15 to 1,000 (log or broken axis). Builds (about 49 men): ANSUR II soldiers (5th/50th/95th percentile, plus 3 subgroups), NHANES US men, natural athletes (Kouri non-users, Chappell natural pros, Mr America 1938-54 mean, Steve Reeves), 12 bodybuilders (Coleman, Arnold, Yates, Cutler, Heath, Big Ramy, Oliva, 5 study groups), 5 strongmen/lifters (Shaw, Bjornsson, Hall, Tala … [1,338 more characters on this line; the full prompt is in prompts/aa07af55531bc4f55.txt]
Silhouettes: flat filled shapes for every build, all at the same drawn height by default (option: real heights side by side; option: side view). Builds differ only in their outline marking: measured (solid edge), derived from a template build (dashed edge), measured from art (dotted edge), explained in a key; markings can vary along one figure (e.g. measured chest, template forearm). Human figures are drawn from data (ANSUR II proportions), never from the duo's shapes; Rex and Ollie are traced from their turnarounds (their crest/horns rise above the common skull-top line; their tails are excluded from the score and should read as excluded). Do not use photos or art of real people or Marvel/DC characters. A fill colour per group (everyday, natural athletes, bodybuilders, strongmen and lifters, comic, the duo) is a reasonable default. Propose 2-3 chart styles drawn from the art's palette (the art: warm brown, dark umber, orange-gold crest glints, navy and maroon briefs, cool blue-grey studio background #888898, light floor) and pick one.
The page also holds a measuring tool: upload an A-pose model sheet (front, side, back), type the height and a density, and it reports volume, mass, seven girths, segment lengths, frontal area and the score, with checks (views differ in height by more than 2%, landmarks don't line up) and the uncertainty; it also shows a target outline (any target score) as front and side images. The viewer's sandbox blocks downloads: results are copied (a copy button) and images shown.
Constraints (Artifact page contract): no external scripts or images; Google Fonts only; works at 390 px and 1280 px, light and dark (token-based theming with prefers-color-scheme and [data-theme]); no horizontal page scroll; everything readable at rest; plain, specific copy for a general audience (the owner is a professional critic and reads with ADHD: lead each section with a one-line verdict, short sentences, gloss jargon); every number on the page shows its status (measured, official, reported, derived, estimate). Avoid templated AI looks (cream+serif+terracotta, near-black+acid green, purple gradients, Inter, emoji markers, rounded cards everywhere).
Write scratch files only under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/ (create it). Do not edit anything under /home/user/rex-strength-lab. Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).

ANGLE: phone-first reading for a general audience with ADHD. A vertical scale you scroll down from ordinary men to the meatball, one verdict line per stop, the figures beside the scale; the desktop layout follows from it.

Produce a design proposal. Build a static mockup HTML (rough figures are fine: simple shapes standing in for silhouettes, real labels and plausible numbers clearly marked as mock) at /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/mock.html and screenshot it at 390x844 and 1280x900 in light and dark (/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/*.png). Look at your own screenshots and fix what reads badly before you answer. List the files in mockup_files.
```

</details>

**Subagent `judge:critic`** · build-comparison-design · started 2026-10-11 04:06:20 UTC

- scores: 3.

<details>
<summary>Prompt, verbatim (94,101 characters)</summary>

Workflow run `wf_ff7816d2-f41`, phase `Judge`, agent `a6bac8b6d3b8521d3`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a6bac8b6d3b8521d3.txt](prompts/a6bac8b6d3b8521d3.txt).

```text
You are designing one page: "Build Comparison", a new self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/. Read /home/user/rex-strength-lab/build-comparison/BRIEF.md and /home/user/rex-strength-lab/CLAUDE.md first. Look at the art: /home/user/rex-strength-lab/build-comparison/assets/rex-turnaround.png and ollie-turnaround.png (A-pose turnarounds, the style key), /home/user/rex-strength-lab/rex-strength-lab/assets/duo.jpg. Look at the sister page's design system in /home/user/rex-strength-lab/build-calculator/src/app.html (a tailor's measurement sheet: tokens --paper/--sheet/--ink/--tape/--chalk, fonts Big Shoulders Display, Public Sans, IBM Plex Mono) and the screenshots in /home/user/rex-strength-lab/build-calculator/shots/ if present (run node /home/user/rex-strength-lab/build-calculator/test/shots.js to make them if absent; it writes to /home/user/rex-strength-lab/build-calculator/shots/, which is git-ignored).
What the page does: it ranks MEN's builds by a size-independent "muscle level" score S = 1.8 x fat-free mass / height^3 (FFMI after rescaling the body to 1.80 m at the same shape), shown beside plain FFMI. Scale runs from about 15 to 1,000 (log or broken axis). Builds (about 49 men): ANSUR II soldiers (5th/50th/95th percentile, plus 3 subgroups), NHANES US men, natural athletes (Kouri non-users, Chappell natural pros, Mr America 1938-54 mean, Steve Reeves), 12 bodybuilders (Coleman, Arnold, Yates, Cutler, Heath, Big Ramy, Oliva, 5 study groups), 5 strongmen/lifters (Shaw, Bjornsson, Hall, Tala … [1,338 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
Silhouettes: flat filled shapes for every build, all at the same drawn height by default (option: real heights side by side; option: side view). Builds differ only in their outline marking: measured (solid edge), derived from a template build (dashed edge), measured from art (dotted edge), explained in a key; markings can vary along one figure (e.g. measured chest, template forearm). Human figures are drawn from data (ANSUR II proportions), never from the duo's shapes; Rex and Ollie are traced from their turnarounds (their crest/horns rise above the common skull-top line; their tails are excluded from the score and should read as excluded). Do not use photos or art of real people or Marvel/DC characters. A fill colour per group (everyday, natural athletes, bodybuilders, strongmen and lifters, comic, the duo) is a reasonable default. Propose 2-3 chart styles drawn from the art's palette (the art: warm brown, dark umber, orange-gold crest glints, navy and maroon briefs, cool blue-grey studio background #888898, light floor) and pick one.
The page also holds a measuring tool: upload an A-pose model sheet (front, side, back), type the height and a density, and it reports volume, mass, seven girths, segment lengths, frontal area and the score, with checks (views differ in height by more than 2%, landmarks don't line up) and the uncertainty; it also shows a target outline (any target score) as front and side images. The viewer's sandbox blocks downloads: results are copied (a copy button) and images shown.
Constraints (Artifact page contract): no external scripts or images; Google Fonts only; works at 390 px and 1280 px, light and dark (token-based theming with prefers-color-scheme and [data-theme]); no horizontal page scroll; everything readable at rest; plain, specific copy for a general audience (the owner is a professional critic and reads with ADHD: lead each section with a one-line verdict, short sentences, gloss jargon); every number on the page shows its status (measured, official, reported, derived, estimate). Avoid templated AI looks (cream+serif+terracotta, near-black+acid green, purple gradients, Inter, emoji markers, rounded cards everywhere).
Write scratch files only under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/ (create it). Do not edit anything under /home/user/rex-strength-lab. Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).

You are a professional critic of data graphics and a stickler for honest labelling: does the chart mislead about uncertainty, extrapolation, status, empty gaps, log scales, or the comparability of comic and art-measured figures? Is every mark to scale?

Score each proposal 1-10 on each axis after looking at its screenshots (Read the PNG files). Name its best ideas worth grafting and its real problems.

PROPOSALS:
[
 {
  "angle": "A scientific instrument. The chart is the page: one log ruler from 15 to 1,000, drawn like a slide rule. Every build is a range bar with its own silhouette hanging off that ruler. Uncertainty and status are always drawn, never left to footnotes: bars are ranges, hatching means \"assumed\", empty stretches are hatched voids, and the extrapolation boundary is a red rule.",
  "summary": "The mockup is a single page in the Build Calculator's type system (Big Shoulders Display, Public Sans, IBM Plex Mono) and its status-chip vocabulary. The page is a stack of plates, the way an instrument is a stack of panels:\n1. Masthead: one verdict sentence carrying the four anchor numbers (20 to 26, 38, 160 and 180, 924).\n2. \"The scale\" plate, which is the hero. A widened template man (ANSUR II proportions, grey, dotted, labelled NOT A BUILD) stands at 24, 48, 96, 192 and 384, then the meatball circle at 924. The T/A/F functional-limit brackets sit between those figures and … [2,584 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "styles": [
   {
    "name": "A. Studio plate (picked)",
    "tokens": "Light: --paper #E4E5EB; --plate #F5F5F8; --ink #16171C; --ink-2 #434855; --ink-3 #5A5F6E; --rule #C2C5D0; --rule-2 #DDDFE6; --grid #E3E4EA; --ruler #FCFBF6; --ruler-edge #A9ACB8; --void #B7BAC6; --tpl #C9CCD6; --chalk #1F4FA6; --alarm #B0321D; --alarm-bg #F6E2DC; --pass #2D6A3E; --pass-bg #E1EEE3; --caution #8A5A00; --caution-bg #F6ECD6; groups --g-every #8A90A6 (studio grey), --g-nat #2F5FB3 (Rex's navy briefs, lifted), --g-bb #C8693C (Ollie's skin / contest tan), --g-str #D9A520 (crest glint), --g-com #A8306A (Ollie's maroon briefs, lifted), --g-duo #5A3D2B (Rex's scales), --duo-edge #B87A14. Dark: --paper #111216; --plate #1A1B22; --ink #E7E8EE; --ink-2 #B5B8C4; --ink-3 #8C909E; --rule #393B46; --rule-2 #292B34; --grid #23242C; --ruler #24252D; --ruler-edge #4A4D5A; --void #4A4D5A; --tpl #565A69; --chalk #94B5FF; --alarm #FF8C75; --alarm-bg #3A1C16; --pass #8FD19E; --pass-bg #18301E; --caution #E8B85A; --caution-bg #33270F; --g-every #A7ACBD; --g-nat #4C79CF; --g-bb #CC5F36; --g-str #D8B444; --g-com #A955A8; --g-duo #7A5438; --duo-edge #E0B040. Fonts as the Build Calculator.",
    "figure_treatment": "Flat group-colour fill. The outline marking is a stroke laid under the fill, with a 1.6 px plate-coloured gap, so only its outer half shows, as a clean drafted edge whatever the fill colour. Ink solid means the build's own girth. Ink dots mean template. A gold dash-dot (the crest glint) means traced from art. Tails are hatched in the group colour with a grey dashed edge. A grey skull-top datum line runs through each figure cell. No interior detail. The template man and the meatball are neutral grey (--tpl), never a group colour.",
    "why": "The plate is the turnarounds' blue-grey studio backdrop and the ruler is ivory. Every group colour is lifted from the art. It sits beside the Build Calculator as a sibling (same fonts and chips) without copying its tape-yellow masthead. Validator results (all pairs, light on #F3F3F6): CVD worst 10.6 (pass) and normal-vision floor 16.0 (pass). Two fails are deliberate: everyday grey is a neutral reference below the chroma floor, and the duo's umber sits below the lightness band; its identity rides on the gold dash-dot edge and the names. Gold and grey are below 3:1 against the plate, so every figure has an ink outline and every row a text label. Dark: CVD 7.4 (WARN, legal with labels), normal floor 15.9 (pass)."
   },
   {
    "name": "B. Semi-log graph paper",
    "tokens": "Light: --paper #FBFAF6; --grid-minor #EAD9C8; --grid-major #C79A78 (printed in Ollie's skin sepia, like K&E 2-cycle paper); --ink #2A1C14 (umber); --fig #5A3D2B for every figure; group shown by a 6 px base tab in navy #2F5FB3, maroon #8E2F4A, crest gold #C98A1E, slate #7A8096, sienna #B8693C, umber. Dark: --paper #17120E; --grid-minor #2A2019; --grid-major #5C4330; --ink #EFE3D6; --fig #C9A27E.",
    "figure_treatment": "Every silhouette is one umber ink fill, like specimens drawn on lab paper, and only the outline marking differs. The full semi-log grid prints behind the whole chart, with 'CYCLE 1 / CYCLE 2' printed in the margin.",
    "why": "It is the most literal instrument, and it fits the brief's \"builds differ only in their outline marking\" best. It loses group identity at a glance. The printed grid also competes with the hatched empty stretches, which must read as empty."
   },
   {
    "name": "C. Brass dial",
    "tokens": "Dark-first, single look: --ground #1C1510 (Rex's umber); --panel #251C15; --engrave #D9A520 (crest gold) for ticks and numerals; --ink #EDE3D2; figure fills are cream #E7DCC8 tinted per group (navy #9FB0D8, maroon #D9A0AE, tan #E3B58F, gold #E8CF8A, slate #BFC3D0, umber-gold #C79A5A). The light variant is parchment #EFE6D6 with umber engraving #4A3322.",
    "figure_treatment": "Backlit specimens: pale fills on a dark umber ground, with the outline marking engraved in gold. Tails get a cross-hatch engraving.",
    "why": "It is dramatic and close to Rex's own palette, but dark-plus-gold drifts toward the templated near-black-with-one-accent look. The pale tints are hard to tell apart and fail CVD separation. It also reads as a dial rather than a measurement sheet, which weakens the honesty-first tone."
   }
  ],
  "picked_style": "A. Studio plate. It is the only one of the three that keeps six groups distinguishable (validated) and keeps the voids readable as voids. It also stays recognisably a sibling of the Build Calculator. Its colours all come from the turnarounds: the backdrop is the plate, Rex's scales and the crest glint mark the duo, and the briefs and skin give the human groups. Things for review to note:\n- The \"measured\" value boxes are solid black pills (the house convention), so they are the heaviest marks in a row.\n- Everyday grey and the duo's umber deliberately fall outside the validator's chroma and lightness bands.",
  "layout_desktop": "Width is capped at 1,240 px, with a 16 px gutter on .wrap. The page is five plates (sheet cards, 1 px rule border, 3 px radius); each plate's sections are ruled off inside. Every section opens with an eyebrow, an uppercase Big Shoulders h2, then a bold one-line verdict, then at most two lines of grey support text.\n- Masthead: eyebrow, the H1 \"BUILD COMPARISON\" at clamp(2.6–4.4rem), a 60ch verdict, then a mono spec line with a MOCK chip.\n- Plate 1, the scale: one SVG at full plate width, about 600 px tall. Template figures are 150 px tall. The ruler is 54 px tall. Six lanes of 32 px each, then notes in three columns (empty stretches, T·A·F, the two scales). The key follows in three columns: silhouette outline, score bar, status of each number.\n- Plate 2, the ranking: the controls row, then a sticky axis header, then rows. Row grid: 72 px figure | 236 px name and meta | 1fr track | 150 px reading. Grid areas are \"fig who track score / fig who track foot / fig note note note\". Rows are about 90–100 px tall. Gap rows are about 40 px. The open detail spans every column (170 px big figure | inputs and girths | what this ignores).\n- Plate 3: how the score works, in two columns.\n- Plate 4: the bench in two columns (1.15fr sheet | 1fr inputs, checks, results), then the target outline (220 px inputs | images capped at 460 px).\n- Plate 5: limits in two columns, then a colophon.\n- Full page at 1280: about 10,100 px.",
  "layout_phone": "At 390 px the order stays the same with one column; the page is about 14,800 px tall, 60% of it the ranking.\n- Hero SVG: only two template figures (24 and 96) plus the meatball, 74 px tall. T/A/F appear as letters with \"?\" brackets; the full wording is in the notes under the SVG. The ruler is 46 px with labels 15/20/30/50/100/200/500/1,000. kg labels sit below the ruler with halos. Lane labels are short names with a plate-coloured halo so the Kouri and extrapolation rules don't strike through them.\n- Ranking rows use grid 52 px figure | 1fr | 70 px score, with areas \"fig who score / fig track track / . foot foot / . note note\". The group name becomes visually hidden (kept for screen readers) and a 9 px swatch before the name carries it. Figures are 52×70. Rows are about 125 px.\n- The sticky axis spans the track columns: phone labels are 20/50/100/200/500/1k, and the \"extrapolated →\" label anchors right when the line passes 60%.\n- Controls wrap. Group chips sit two rows deep.\n- The bench stacks. The sheet SVG keeps a 560 px minimum width inside its own overflow-x box, with the caption \"On a phone, swipe the sheet sideways\". The readout table has one quantity per row so nothing is wider than the screen.\n- No page-level horizontal scroll in any mode (checked with zoom + real heights + side view).",
  "axis": "The axis is log, not broken. A broken axis would cut out exactly the empty stretches (about 40–50, 84–150, 190–924) that the brief wants visibly empty.\n\nHero ruler (slide rule):\n- Ticks every 1 from 15–50, every 5 from 55–100, every 10 from 110–200, and every 50 from 250–1,000.\n- Four tick lengths: 5, 9, 14, 20 px. Decade marks at 100 and 1,000 are tallest, with bold numerals.\n- Desktop labels: 15, 20, 25, 30, 40, 50, 60, 80, 100, 150, 200, 300, 500, 1,000. Phone: 15, 20, 30, 50, 100, 200, 500, 1,000.\n- Axis title: \"SCORE (FFMI AT 1.80 M, KG/M²)\".\n- The bottom edge carries  … [988 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "gaps_and_limits": "Empty stretches:\n- Computed from the data: stretches of the scale that no build's full range covers, when the gap ratio is above 1.2. The top gap always runs to 924.\n- Hero: drawn as diagonal hatching (--void) through the lanes below the ruler, labelled on desktop \"NO BUILD\" and \"NO BUILD · 189–924\", and listed in words in the notes (\"No build lands between 42 and 57, between 90 and 151, or anywhere above 189...\").\n- Sticky axis: shown as the same hatching.\n- Ranking: inserted in score order as gap rows, e.g. \"NOTHING FROM 42 TO 57\", with a bordered hatched bl … [1,676 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "marking_key": "The outline is drawn per body part (head, neck, chest, waist, upper arm, forearm with hand, thigh, calf with foot), so the marking can change along one figure. Coleman, for example, has a solid chest, waist, arm and calf with a dotted forearm, neck and head.\n- Solid ink: the part comes from this build's own girth with status measured, reported or official.\n- Dotted ink (round-cap dots): the template fills the part in, scaled by weight. This covers unknown and derived girths, and the head always.\n- Dash-dot in --duo-edge gold: traced from art.\n\nThis is a deliberate change … [1,476 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "controls": "One controls row above the ranking applies to the ranking only; the hero always shows everything.\n- Figures: [Same height | Real heights]. Real heights scales the figures against 3.1 m, so humans are about 58% of the cell.\n- Scale: [15 to 1,000 | Zoom 15 to 50]. Full scale is the default. Zoom re-maps the track and sticky axis over 15–50 and labels off-scale rows \"off scale: … →\".\n- View: [Front | Side]. Side uses the traced side views for Rex and Ollie and a depth profile for humans.\n- Groups: six toggle chips with colour swatches and short names (Everyday, Natural, Bodybuilders, Strongmen, Comic, Rex and Ollie). Turning one off strikes it through, and the surviving rows keep their colours.\n\nInteraction:\n- Each build's name is a button that toggles an inline detail panel. The mock opens Coleman's: a big figure; inputs with status boxes and sources; girths, each saying whether it gave a solid or dotted outline; and \"What this ignores\".\n- The axis header is sticky.\n- Segmented buttons use aria-pressed, and focus rings are visible.\n- No hover-only information: every value is printed.",
  "tool_ui": "\"Measuring bench\" plate: two columns on desktop, stacked on phone.\n\nLeft: the sheet viewer.\n- An SVG of the uploaded sheet: the mock shows Rex front, a mirrored front standing in as the back, and side, from the traces.\n- One ground line and a dashed \"top of skull\" line.\n- Blue guide lines labelled shoulder, chest, waist, crotch and knee in a left gutter, carried across all views.\n- Red width and depth slice markers at the chest on the front and side views.\n- The tail region outlined in dashed red: \"tail: painted out of the score (dashed)\".\n- Per-view captions \"FRON … [1,667 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "copy": "Mock ribbon: \"Design mockup · every number on this page is a placeholder · not for review of facts\".\n\nMasthead:\n- Eyebrow: \"Men's builds · muscle level, height taken out\"\n- H1: \"Build Comparison\"\n- Verdict: \"Ordinary men score 20 to 26. The most muscular people measured reach about 38. Rex and Ollie score about 160 and 180. No body can score above 924: that is a solid ball of muscle.\"\n- Spec line: \"49 builds · men only · score = 1.8 × fat-free mass ÷ height³ · log scale · [MOCK NUMBERS]\"\n\nThe scale:\n- H2: \"One ruler for every build\"\n- Verdict: \"Equal steps on  … [3,901 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "mockup_files": [
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/mock.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-light-top.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-dark-top.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-light-top.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-dark-top.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-modes.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-modes.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/mock.src.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/gen.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/shots.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/modes.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/trace.py",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/duo-paths.json",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/export.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/mockdata.json"
  ],
  "risks": "1. **Crowding at full scale.** About 40 human and human-sized builds fall in 15–40, the left ~23% of the track. Their bars are 10–20 px, and on a phone they shrink to little more than the diamond and caps. The \"Zoom 15 to 50\" option makes them readable (see 1280-modes.png). The owner should pick the default; the brief favours one honest full scale.\n\n2. **The widened template reads as fat.** Uniform widening grows the waist and hips and looks obese, not muscular. The mock uses a \"waist grows least\" pattern with made-up exponents (WIDEN_E). The build needs a sourced widening ru … [2,569 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
 },
 {
  "angle": "Police lineup / museum-specimen parade. The figures come first. Every build stands at the same drawn height against a studio wall, in score order, on a floor plate that carries its score. Empty stretches of the scale are tiles of bare, hatched floor. The last stretch of empty floor runs out to the meatball at the far end. A to-scale log tape (the Build Calculator's yellow tape, made logarithmic) sits under the lineup and places all 49 builds.",
  "summary": "The mockup is built and screenshotted at 390x844 and 1280x900 in light and dark. I checked full-page shots too, fixed what read badly, and re-shot. scrollWidth equals the viewport in all four, and there are no console errors.\n\nPage order:\n1. A full-bleed log tape band (15 to 1,000).\n2. Masthead: a one-line verdict lede marked \"all estimates\".\n3. Three segmented controls.\n4. THE LINEUP, the hero. A wall ruled at ANSUR median landmark heights (skull top, shoulder 82%, chest 74%, waist 60%, crotch 48%, knee 28%). There is a landmark post at the start, and figures follow in r … [1,872 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "styles": [
   {
    "name": "A. Studio lineup (picked)",
    "tokens": "LIGHT :root { --paper:#ECEDF1; --sheet:#F8F8FA; --wall:#DADCE4; --wall-line:#C2C5D1; --floor:#F1F1F4; --floor-edge:#A9ADBB; --ink:#15181F; --ink-2:#464C5A; --ink-3:#5C6270; --rule:#C4C7D0; --rule-2:#E0E2E8; --tape:#EDBE2E; --tape-ink:#231D07; --chalk:#1F4FA6; --alarm:#B0321D; --alarm-bg:#F6E2DC; --studio:#888898; --g-every:#6F7C99; --g-natural:#CFA23A; --g-bb:#B9592A; --g-strong:#5A3624; --g-comic:#34489A; --g-duo:#8E2440; --g-geom:#9A9CA8; --font-display:'Big Shoulders Display'; --font-body:'Public Sans'; --font-mono:'IBM Plex Mono' }  DARK (prefers-color-scheme guarded by :root:not([data-theme=light]) and :root[data-theme=dark]) { --paper:#14151A; --sheet:#1B1D23; --wall:#262833; --wall-line:#373A49; --floor:#30323D; --floor-edge:#555A6B; --ink:#E8E9EE; --ink-2:#B4B8C3; --ink-3:#8C91A0; --rule:#3A3E4A; --rule-2:#272A33; --tape:#DDB02C; --tape-ink:#1B1604; --chalk:#94B5FF; --alarm:#FF8C75; --alarm-bg:#3A1C16; --g-every:#9AB4D0; --g-natural:#E3B842; --g-bb:#C46A3B; --g-strong:#7A4536; --g-comic:#5A78D0; --g-duo:#BF4D5F; --g-geom:#6E7080; color-scheme:dark }",
    "figure_treatment": "Flat group fills on a cool blue-grey wall lightened from the turnarounds' studio grey (#888898), with faint landmark guide lines and a dashed skull-top line. The floor is lighter, like the art's floor. Each figure's edge is in the ink token, so it is dark on light and light on dark. The edge is drawn under the fill at twice its width, so only the outer half shows and inner seams vanish. Edge style varies by body region: solid, dashed or dotted. The contours are smooth (Catmull-Rom) with no interior detail, and hands and feet are simple mitts, following the turnarounds' simplification. The meatball is a geometry-grey disc with a drafting centre cross.",
    "why": "The wall is the turnarounds' own backdrop, so traced and data-drawn figures sit in one world. The six fills are the art's six colours: studio slate (everyday), crest gold (natural athletes), Ollie's skin rust (bodybuilders), Rex's umber (strongmen and lifters), navy briefs (comic), maroon briefs (the duo). It keeps the Build Calculator's fonts, status chips and yellow tape, so the pages read as one family. I ran the validator on the fills with all pairs. CVD separation passes in both themes: worst ΔE 15.2 in light (rust/slate), 15.5 in dark (umber/rust). The normal-vision floor also passes: 17.6 light, 17.7 dark. The duo against comics is 21+. Two failures are deliberate. The neutral everyday slate and the dark umber fail the chroma and lightness band. Gold sits at 1.7:1 against the wall, which the ink edges and direct-label plates cover."
   },
   {
    "name": "B. Night gallery",
    "tokens": "DARK-FIRST :root { --paper:#1A1310; --wall:#241A15; --floor:#2E231C; --ink:#F1E6D6 (horn cream); --ink-2:#C9B9A4; --rule:#4A3A30; --accent:#E0A63A (crest glint); --g-every:#A9AEC0; --g-natural:#E6C26A; --g-bb:#D98A5C; --g-strong:#B07A5E; --g-comic:#8EA2E8; --g-duo:#E07A8E; color-scheme:dark }  LIGHT (prefers-color-scheme: light) { --paper:#EFE9E1; --wall:#E2D9CC; --floor:#F4EFE8; --ink:#2A1D16; --accent:#9A6410; fills darkened one step }",
    "figure_treatment": "The hall is Rex's dark umber. Each figure stands on a low plinth under a soft spot of light: a flat pale fill with a 1.5 px lighter rim, and gold-leaf mono labels on brass-coloured plates. Marking is shown as rim style (solid, dashed or dotted rim).",
    "why": "Not picked. Dark-first with a lone gold accent drifts toward the near-black plus one-pop template. The warm wall muddies the four warm group fills (natural, bodybuilders, strongmen, duo), which crowd into one hue band. Rim marking on spotlit edges is harder to read than an ink edge. It also breaks the family tie with the Build Calculator's daylight tailor's sheet."
   },
   {
    "name": "C. Cyanotype specimen sheet",
    "tokens": "DARK-FIRST :root { --paper:#1F2A55 (navy briefs); --wall:#243163; --floor:#2B3970; --ink:#EAF0FF; --line:#8FA3D9; --accent:#F2C14E; --g-*: pale tints at 80–90% lightness (slate #DCE3F2, gold #F3E3B0, rust #F2CDB6, umber #D9C2B4, comic #C6D2FA, duo #F2C2CC) }  LIGHT { --paper:#E9EEF8; --wall:#DDE4F3; --ink:#1F2A55; fills as mid navy tints }",
    "figure_treatment": "A drafting or blueprint sheet. Figures are pale flat fills with white construction-line edges. The functional limits and the meatball are drawn in pure construction-line style (centre marks, dimension arrows), and landmark lines are blueprint rules.",
    "why": "Not picked. Pale tints kill group separation: the six tints fail the normal-vision floor. It reads as engineering rather than anatomy and drifts toward a dark ground with one accent. It also severs the family tie with the Build Calculator. Its construction-line language is worth keeping for the limit figures and the meatball, and style A borrows it there."
   }
  ],
  "picked_style": "A. Studio lineup. A blue-grey studio wall from the turnarounds' background, with landmark guide lines like a police-lineup height chart. A light floor carries the score plates. Flat fills in the art's six colours, one per group. Ink edges carry the outline marking. The Build Calculator's fonts (Big Shoulders Display, Public Sans, IBM Plex Mono), status chips and yellow tape are kept, and the tape becomes the log scale. I suggest noting this choice for review.",
  "layout_desktop": "The wrap is max 1280 px with a 16 px gutter. In order:\n\n1. A full-bleed 34 px yellow log tape band at the top, with ticks at true log positions for the page width, labelled 15, 20, 30, 50, 100, 200, 500, 1,000.\n2. Masthead: a purple dashed MOCK flag (mock only); the H1 \"BUILD COMPARISON\" at clamp(2.6rem, 8vw, 4.4rem); a lede verdict at 1.125rem, 60ch, ending in an \"all estimates\" chip; a mono spec line.\n3. Controls row: three segmented controls labelled Heights, View, Builds.\n4. THE LINEUP:\n   - Section head: h2, then a bold one-line verdict, then a short sub-lin … [1,730 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "layout_phone": "At 390 px: 16 px gutter, content 358 px.\n- Log tape band labels drop 15.\n- Masthead: the H1 wraps to about 2.6rem.\n- Controls wrap to two rows.\n- Lineup: H = 92 px. Cells are a minimum of 80 px and grow, so about four figures fit per row. The landmark post is 40 px with only skull, waist and knee labels. The Kouri post label shortens to \"KOURI 25\". Plates use an 18 px score, an 11 px name (overflow-wrap anywhere, nbsp in \"5th %\") and 9.5 px FFMI.\n- Gaps: base width 300 px per decade, at least 104 px, so 39–50 and 81–140 share rows with figures. The 189–924 floor grows to fill its row, and the meatball sits at its end. The key-20 lineup is about 1,350 px tall.\n- The drawer stacks: figure, then facts.\n- Key: one column, with swatches two per row.\n- Strip: lane labels sit above each lane's bars, with a sheet-colour halo. Narrow EMPTY bands (39–50 is about 21 px wide) get rotated labels. The bracket label shortens to \"body limits: somewhere in here\". The tape starts at 20.\n- Limits: 2×2. Cards and tool stack.\n\nThe first frame (844 px) shows the tape, masthead verdict, controls, lineup verdict and the first row of figures. scrollWidth is 390 in both themes.",
  "axis": "Log scale, not a broken axis.\n- **Ticks.** It runs 15 → 1,000, drawn as the sister page's yellow tape. Major ticks with labels at 15, 20, 30, 50, 100, 200, 500, 1,000. Minor ticks at every integer multiple within each decade, plus half-steps from 15 to 100 on the masthead band.\n- **Why log.** It keeps 924 on scale, and the empty stretches stay honest in proportion: 81–140 and 189–924 read as visibly long. A broken axis would hide exactly the emptiness the brief wants shown.\n- **How ranges are drawn.** Each build is a 4 px round-capped bar from low to high plausible body fat, in its group colour, with a 3.6 px dot at the middle value. The dot is filled, or hollow for overstated comics. Overlapping bars within a lane are greedy-packed into 9 px sub-rows.\n- **Lineup spacing.** The lineup itself is rank-ordered and not to scale. The sub-line states it (\"The spacing is not to scale; the tape below is\"), and every figure's numbers sit on its plate.\n- **Real heights option.** Figures scale to their real stature against the tallest, Ollie at 3.06 m to the horn tips. The skull-top line is replaced by a metre scale on the landmark post, and the score axis is unchanged.\n- **Side option.** It swaps the template for a side profile from ANSUR depth ratios, and Rex and Ollie for their side traces.",
  "gaps_and_limits": "**Empty gaps.**\n- In the lineup, each gap is a tile with the same wall and guide lines, no figure, a diagonally hatched floor, and a plate in muted ink: \"39–50 / Empty. No build measured here yet.\" The last plate reads \"189–924 / Empty. Nothing measured between Ollie and the meatball.\"\n- Tile base width is log-proportional (600 px per decade on desktop, 300 on phone) with a 124 or 104 px minimum. Only the last gap grows, so the empty floor visibly runs out to the meatball.\n- On the strip, gaps are hatched vertical bands through every lane, labelled EMPTY (rotated w … [1,738 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "marking_key": "**How figures are built.** Each figure is drawn as region pieces: head, neck, chest, waist/hip, upper arm, forearm+hand, thigh, calf+foot. Strokes go under the fills at twice their width, so only the outer half shows and region seams vanish. Each region gets its own edge style:\n- **Solid:** \"from a tape measure\". A measured, official or reported girth.\n- **Dashed (6/4):** \"filled in from the template\". The Army median's shape scaled to the weight.\n- **Dotted (0.1/4.2 round caps, about 2.9 px):** \"measured from art\". Rex and Ollie, traced from their turnarounds.\n\nTh … [1,431 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "controls": "One controls row above the lineup, as segmented buttons with aria-pressed:\n- **Heights:** [Same height | Real heights].\n- **View:** [Front | Side].\n- **Builds:** [Key 20 | All 49]. \"Key 20\" is one per cluster; the selection rule is stated beside it in the build.\n\nThe strip always shows all 49.\n\nFigure cells are focusable (tabindex 0). Click, tap or Enter selects a figure: the plate gets a 3 px chalk top bar, and the drawer below the lineup fills with the figure at H = 230, its facts and status chips, its sources (exact URLs in the build) and the per-region marking. Hover outlines the cell. Hovering a strip bar shows a tooltip, and clicking it selects the same build and scrolls to the drawer.\n\nChoices are remembered per viewer in localStorage, wrapped in try/catch. There is no theme toggle; the page follows prefers-color-scheme and [data-theme].",
  "tool_ui": "Section \"MEASURE A CHARACTER\" opens with a verdict line and a sub-line saying the results stay on the page, because downloads are blocked.\n\n**Left column**\n- Loader row: \"Sample loaded: rex-turnaround.png (1941 × 810 px)\" and a \"Choose a sheet\" button (file input, plus drag and drop).\n- Sheet preview on the studio-grey token, with a dashed yellow overlay of detected guide lines: skull top, shoulder, waist, crotch, knee, ground.\n- A checks list with PASS (ink chip) or CHECK (alarm chip):\n  - \"Views agree in height within 1.1% (limit 2%).\" A failure past 2% rejects th … [1,176 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "copy": "Masthead (on the yellow log tape band):\nH1: \"BUILD COMPARISON\"\nLede: \"Drawn at one height, an ordinary man scores about 24. The biggest pros reach about 38 and comic giants about 80. Rex and Ollie score about 160 and 180. The scale ends at 924, the score of a solid ball of muscle as tall as the figure.\" [chip: all estimates]\nSpec: \"49 men · score = muscle carried if the body were 1.80 m tall · every number says what it is\"\n\nControls: \"Heights: Same height | Real heights\", \"View: Front | Side\", \"Builds: Key 20 | All 49\".\n\nTHE LINEUP\nVerdict: \"Everyone stands at t … [3,549 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "mockup_files": [
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock.src.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-390-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/full/mock-390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/full/mock-390-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/full/mock-1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/full/mock-1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/trace.py",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/traces-norm.json",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/masks.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/build.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/shot.js"
  ],
  "risks": "1. **Rank order is not to scale.** A ranked lineup shows order, not distance. A critic may read the spacing as distance. Mitigations: the sub-line (\"The spacing is not to scale; the tape below is\"), numbers on every plate, and the to-scale strip directly below. Gap tiles are log-proportional with a minimum width, which is a hint only. It might be cleaner to make all gap tiles equal and let only the strip carry proportion.\n2. **The meatball is not a hard maximum.** It is a chosen end of scale. A body as wide as it is tall (a cylinder) holds π/4 H³ against π/6 H³ for a ball, so it … [2,755 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
 },
 {
  "angle": "Phone-first reading for a general audience with ADHD. The page is one long tape you scroll down, from ordinary men to the meatball. A to-scale log tape (15 to 1,000) stays pinned beside the figures. Each stop opens with a tape-yellow score tag, a display headline and a one-line verdict, then shows its lineup of flat figures. The desktop layout comes from the same structure: the pinned tape widens into a to-scale overview.",
  "summary": "Proposal: \"the tape you scroll down\". On a phone a 46 px sticky rail sits at the left. It is a yellow tailor's tape with log graduations from 15 to 1,000, drawn to scale. It marks every build as a coloured tick, shows the empty gaps hatched, draws Kouri's 25 as a dashed line, puts a chalk-blue dotted bracket over 40 to 200 (where the functional limits fall, position not yet worked out) and a chalk circle at 924. A box shows which stop you are reading, and tapping the tape jumps to a stop.\n\nThe stops scroll on the right, in this order:\n- Ordinary men (up to 25)\n- The natural … [1,333 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "styles": [
   {
    "name": "A. Studio wall (picked)",
    "tokens": "LIGHT :root { --paper:#EEF0EC; --sheet:#FAFAF7; --ink:#15181C; --ink-2:#4A525A; --ink-3:#5F6770; --rule:#C5CAC4; --rule-2:#E0E3DE; --tape:#EDBE2E; --tape-ink:#231D07; --chalk:#1F4FA6; --chalk-bg:#E3E9F5; --alarm:#B0321D; --alarm-bg:#F6E2DC; --wall:#DCDDE6; --floor:#ECECF0; --wall-line:#9C9DB0; --hatch:#B9BACB; --seam:rgba(255,255,255,.55); --g-everyday:#6C6F86; --g-natural:#3B6D7F; --g-enhanced:#7A2434; --g-strong:#232C5C; --g-comic:#A0650C; --g-rex:#4A3324; --g-ollie:#A4532B; fonts: Big Shoulders Display 800 (display), Public Sans (body), IBM Plex Mono (data) }  DARK (prefers-color-scheme guarded :root:not([data-theme=light]) and :root[data-theme=dark]) { --paper:#101215; --sheet:#171A1E; --ink:#E7E9E4; --ink-2:#B2B8BE; --ink-3:#868E96; --rule:#3A4047; --rule-2:#272B31; --tape:#DDB02C; --tape-ink:#1B1604; --chalk:#94B5FF; --chalk-bg:#2A3756; --alarm:#FF8C75; --alarm-bg:#3A1C16; --wall:#20222B; --floor:#2A2C36; --wall-line:#565970; --hatch:#3D4052; --seam:rgba(0,0,0,.45); --g-everyday:#A3A6BC; --g-natural:#6DB2C6; --g-enhanced:#D96A7E; --g-strong:#9198EC; --g-comic:#E3A63C; --g-rex:#A88063; --g-ollie:#E08A58; color-scheme:dark }",
    "figure_treatment": "Flat fills, one per group, taken from the turnarounds: studio slate for everyday men, steel teal for natural athletes, Ollie's maroon briefs for bodybuilders, Rex's navy briefs for strongmen and lifters, crest-glint gold (darkened for contrast) for comic characters, umber for Rex and russet for Ollie. Each figure stands in front of the blue-grey wall band, which has a floor strip and a dashed top-of-skull line. The edge marking is an ink stroke drawn under the fill, so only its outer half (about 1.9 px) shows. Arms and hands get a hairline seam in --seam so they read over the torso, the one interior detail, in keeping with the turnarounds' clean contours. Geometry (the widened template and the meatball) is drawn in chalk blue, outline only with a pale fill.",
    "why": "It keeps the Build Calculator's tailor's-sheet system (same paper, ink, tape, chalk and fonts), so the two pages read as one family, and brings in the art's own studio wall and floor. Group colour lets a skimming reader see that the giants are all comic characters and that Superman sits among ordinary men, while the edge still carries where each outline came from. It has both themes with checked contrast. A navy/maroon/gold/umber set is not one of the templated AI looks."
   },
   {
    "name": "B. Turnaround grey",
    "tokens": "Single look, used in both themes: --wall:#888898; --floor:#B9B9C2; --edge:#F4F4F6; --label:#F4F4F6; --g-everyday:#C9CAD6; --g-natural:#7FB4C4; --g-enhanced:#5E1422; --g-strong:#1A2148; --g-comic:#E6A33A; --g-rex:#3A281C; --g-ollie:#B9673C; the page around it keeps the sister tokens",
    "figure_treatment": "The whole chart sits on the render's #888898 studio grey with a light floor band. Edges are white so the marking shows on the mid-grey, and labels are white.",
    "why": "Closest to the art: the figures look as if they stand in the render. Rejected because white 11 px text on mid-grey is weak (about 3:1), it can't follow the light and dark themes, and the navy and maroon fills sink into the grey."
   },
   {
    "name": "C. Umber print",
    "tokens": "LIGHT: --paper:#EEF0EC; --fig:#3A2A20; --edge:#15181C; floor tiles --tile-everyday:#6C6F86; --tile-enhanced:#7A2434; --tile-strong:#232C5C; --tile-comic:#A0650C; --tile-duo:#E0A030 (crest gold). DARK: --paper:#101215; --fig:#D8C2AE; --edge:#E7E9E4; tiles as light",
    "figure_treatment": "Every figure, human, comic or duo, gets the same umber fill. The edge marking is the only visual difference between builds. Group shows only as a small coloured floor tile under the feet and a swatch by the name.",
    "why": "The strictest reading of 'builds differ only in their outline marking', and the marking is easiest to see because every fill matches. Held as the fallback if the reviewer finds group colours distracting. Rejected as the default because a skimming reader loses group membership at a glance."
   }
  ],
  "picked_style": "A. Studio wall. Family continuity with the Build Calculator (tokens, fonts, tape, status chips), the art's own wall and floor behind every lineup, and one fill per group from the turnaround palette, while the edge marking alone carries provenance. Note the choice for review: C (Umber print) is the fallback if group colour is judged to compete with the marking.",
  "layout_desktop": "At 1280 px (max-width 1240, 16 px gutters):\n- Tape strip across the top, as on the Build Calculator.\n- Masthead in two columns. Left: kicker, BUILD COMPARISON in Big Shoulders 800, and the 4-line verdict at 19 px semibold. Right: a 3-line score explainer, then a 2x3 edge key (Solid, Dashed, Dotted, No edge, Hatched, Top of skull) with drawn samples.\n- Sticky control bar: Height Same/Real, View Front/Side, and a \"Go to\" menu of stops on the right.\n- The scale grid: a 330 px sticky rail and the stops column.\n  - Rail (fills the viewport height): 34 px yellow log tape  … [996 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "layout_phone": "At 390 px (16 px gutters, no horizontal scroll, checked at scrollWidth 390):\n- Tape strip, a 2-line mock banner (mock only), kicker, h1, a 5-line verdict lede, a 3-line score explainer, and the 6-item edge key in two columns.\n- Sticky bar (52 px): \"Height Same | Real\" and \"View Front | Side\" as segmented controls. There is no Go-to menu on phone; the rail is the jump control.\n- Scale grid: a 46 px sticky rail and a content column of about 300 px.\n  - The rail sticks below the bar, height calc(100svh - 76px), min 520 px. It shows the tape with tick labels, a 14 px str … [952 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "axis": "One log axis, 15 to 1,000, drawn to scale only on the rail; the stops scroll in order but not to scale.\n\nOn the tape:\n- Labelled majors at 15, 20, 30, 50, 100, 200, 500 and 1000.\n- Minor ticks at 16 to 19, 25, 35, 40, 45, 60 to 90, 150, and 300 to 900.\n- Each band appears in its stop's tag as 'Score 25 to 32', so position never depends on reading the gaps between stops.\n- On desktop each build is a vertical range bar (low to high body fat) in its group lane; on phone, a tick at the geometric middle of its range.\n\nWhy not a broken axis: a break would hide the empty stretches the brief wants visibly empty. On the log tape the 188 to 924 stretch fills about 38% of the tape, and everything from 15 to 41 (about 45 of the 49 builds) fills about 24%. That proportion is the story. The stops give the crowded low end the room for figures that the to-scale tape can't.\n\nTapping the tape converts the tap's y back to a score and scrolls to that stop. Score ranges use an en dash and whole numbers below 100, rounded to 2 above 100, with no '≈'.",
  "gaps_and_limits": "Empty gaps:\n- They appear twice: as hatched rectangles across the lanes on the rail (labelled EMPTY on desktop), and as their own stops with the tag 'Score 41 to 57', the headline 'EMPTY', a verdict, a hatched box reading 'NO BUILDS HERE' and the line 'Step 2 adds figures drawn to order for this stretch, each labelled \"measured from art\".'\n- The last gap, 'EMPTY TO THE TOP' (188 to 924), gets a taller box.\n- Gap edges must be computed from the builds' range ends, never typed.\n\nNatural limit:\n- An anchor stop with no figures. Value rows read '25 · Kouri and others, … [1,275 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "marking_key": "Every figure is a flat fill; only its edge changes. The edge is an ink stroke 3.8 px wide drawn under the fill, so about 1.9 px shows outside the shape on the wall.\n- Solid (butt caps): the build's own number (measured, official or reported).\n- Dashed 6/3.5: filled in from a template build.\n- Dotted 0.1/4.2 (round caps): traced from art. Used for Rex and Ollie.\n- No edge: head, hands and feet, which use average ANSUR proportions on every human.\n\nMarkings vary along one figure. figure.js bandEdges splits the body outline into neck, shoulders, chest, waist, hips, thigh an … [1,366 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "controls": "One sticky bar at the top of the scale.\n- Height: Same | Real (segmented, aria-pressed). Same scales every figure so the top of the skull sits on the dashed wall line. Real uses one metres scale for the whole page (30 px/m on phone, 52 px/m on desktop) with faint 1 m, 2 m and 3 m lines on the wall, so humans appear about 55 px tall beside 3 m Rex and Ollie.\n- View: Front | Side. Side uses the template's side outline for humans and the traced side views for Rex and Ollie, tails hatched.\n- Go to: a menu of stops at 720 px and wider.\n- On phone: tap the tape to jump.\n\nProposed but not in the mock: tap a figure to open a details sheet with height, weight, body-fat range, each girth with its status and source link, and the figure drawn large so the edge marking reads.\n\nState lives in the page. Only bare #anchors are used, for deep links to stops. localStorage may remember the Height and View choice, wrapped in try/catch.",
  "tool_ui": "Section 'MEASURE A CHARACTER', separated from the scale by a heavy ink rule.\n- Verdict: 'Upload a model sheet. Get volume, mass, seven girths and the score.'\n- A chalk example note: 'Example loaded: Rex from duo.jpg, front view only. This is the tool's own test: it must land within the old methods' 2.52 to 2.60 m³.' The tool opens in a working state on its validation case, never on the turnarounds, which must not be measured in Step 1.\n\nSteps (numbered because they are a real sequence):\n1. The sheet: the image with dashed landmark lines (crest tip 3.048 m, top of skull, shou … [1,593 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "copy": "Masthead\n- Kicker: 'MUSCLE LEVEL, WITH HEIGHT TAKEN OUT'\n- H1: 'BUILD COMPARISON'\n- Lede: 'Ordinary men score about 22. The biggest bodybuilders reach about 40. Rex scores about 160 and Ollie about 180. The scale stops at 924: a solid ball of muscle.'\n- Score line: 'The score is fat-free mass ÷ height³ × 1.8. That is the FFMI (fat-free kg ÷ height in m²) a body would have at 1.80 m tall. Body fat is mostly unknown, so each score is a range.'\n- Edge key:\n  - 'Solid: its own measurement'\n  - 'Dashed: filled in from a template build'\n  - 'Dotted: traced from art'\n  - 'No edge: … [2,817 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
  "mockup_files": [
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/mock.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/390-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/390-light-first.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/390-dark-first.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/1280-light-first.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/1280-dark-first.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/styles.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/styles-1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/styles-1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/styles-390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/z-real.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/z-duo-side-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/z-duo-side-phone.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/z-tool-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/mock.src.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/gen.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/build.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/shots.js"
  ],
  "risks": "1. The meatball claim. The brief says 'a figure can't hold more volume than a ball as tall as itself'. That is false as geometry: a cylinder as tall holds 1.5 times as much and a cube about 1.9 times. The page must call 924 a chosen end point, as the mock does. Owner decision needed.\n\n2. Only the rail is to scale; the stops are not. A reader could take the spacing between stops as distance. The mitigations are a numeric tag on every stop and the current-stop box on the rail.\n\n3. The edge marking is subtle at phone size (86 px figures at 1x pixel density). Solid against dashed r … [2,904 more characters on this line; the full prompt is in prompts/a6bac8b6d3b8521d3.txt]
 }
]
```

</details>

**Subagent `judge:reader`** · build-comparison-design · started 2026-10-11 04:06:21 UTC

- scores: 3.

<details>
<summary>Prompt, verbatim (94,056 characters)</summary>

Workflow run `wf_ff7816d2-f41`, phase `Judge`, agent `a87541ca3584fc5e7`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a87541ca3584fc5e7.txt](prompts/a87541ca3584fc5e7.txt).

```text
You are designing one page: "Build Comparison", a new self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/. Read /home/user/rex-strength-lab/build-comparison/BRIEF.md and /home/user/rex-strength-lab/CLAUDE.md first. Look at the art: /home/user/rex-strength-lab/build-comparison/assets/rex-turnaround.png and ollie-turnaround.png (A-pose turnarounds, the style key), /home/user/rex-strength-lab/rex-strength-lab/assets/duo.jpg. Look at the sister page's design system in /home/user/rex-strength-lab/build-calculator/src/app.html (a tailor's measurement sheet: tokens --paper/--sheet/--ink/--tape/--chalk, fonts Big Shoulders Display, Public Sans, IBM Plex Mono) and the screenshots in /home/user/rex-strength-lab/build-calculator/shots/ if present (run node /home/user/rex-strength-lab/build-calculator/test/shots.js to make them if absent; it writes to /home/user/rex-strength-lab/build-calculator/shots/, which is git-ignored).
What the page does: it ranks MEN's builds by a size-independent "muscle level" score S = 1.8 x fat-free mass / height^3 (FFMI after rescaling the body to 1.80 m at the same shape), shown beside plain FFMI. Scale runs from about 15 to 1,000 (log or broken axis). Builds (about 49 men): ANSUR II soldiers (5th/50th/95th percentile, plus 3 subgroups), NHANES US men, natural athletes (Kouri non-users, Chappell natural pros, Mr America 1938-54 mean, Steve Reeves), 12 bodybuilders (Coleman, Arnold, Yates, Cutler, Heath, Big Ramy, Oliva, 5 study groups), 5 strongmen/lifters (Shaw, Bjornsson, Hall, Tala … [1,338 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
Silhouettes: flat filled shapes for every build, all at the same drawn height by default (option: real heights side by side; option: side view). Builds differ only in their outline marking: measured (solid edge), derived from a template build (dashed edge), measured from art (dotted edge), explained in a key; markings can vary along one figure (e.g. measured chest, template forearm). Human figures are drawn from data (ANSUR II proportions), never from the duo's shapes; Rex and Ollie are traced from their turnarounds (their crest/horns rise above the common skull-top line; their tails are excluded from the score and should read as excluded). Do not use photos or art of real people or Marvel/DC characters. A fill colour per group (everyday, natural athletes, bodybuilders, strongmen and lifters, comic, the duo) is a reasonable default. Propose 2-3 chart styles drawn from the art's palette (the art: warm brown, dark umber, orange-gold crest glints, navy and maroon briefs, cool blue-grey studio background #888898, light floor) and pick one.
The page also holds a measuring tool: upload an A-pose model sheet (front, side, back), type the height and a density, and it reports volume, mass, seven girths, segment lengths, frontal area and the score, with checks (views differ in height by more than 2%, landmarks don't line up) and the uncertainty; it also shows a target outline (any target score) as front and side images. The viewer's sandbox blocks downloads: results are copied (a copy button) and images shown.
Constraints (Artifact page contract): no external scripts or images; Google Fonts only; works at 390 px and 1280 px, light and dark (token-based theming with prefers-color-scheme and [data-theme]); no horizontal page scroll; everything readable at rest; plain, specific copy for a general audience (the owner is a professional critic and reads with ADHD: lead each section with a one-line verdict, short sentences, gloss jargon); every number on the page shows its status (measured, official, reported, derived, estimate). Avoid templated AI looks (cream+serif+terracotta, near-black+acid green, purple gradients, Inter, emoji markers, rounded cards everywhere).
Write scratch files only under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/ (create it). Do not edit anything under /home/user/rex-strength-lab. Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).

You are a general reader with ADHD on a phone: can you tell in five seconds what the page says, what to do first, and where Rex sits? Is any text too small, any control unclear, any layout cramped at 390 px?

Score each proposal 1-10 on each axis after looking at its screenshots (Read the PNG files). Name its best ideas worth grafting and its real problems.

PROPOSALS:
[
 {
  "angle": "A scientific instrument. The chart is the page: one log ruler from 15 to 1,000, drawn like a slide rule. Every build is a range bar with its own silhouette hanging off that ruler. Uncertainty and status are always drawn, never left to footnotes: bars are ranges, hatching means \"assumed\", empty stretches are hatched voids, and the extrapolation boundary is a red rule.",
  "summary": "The mockup is a single page in the Build Calculator's type system (Big Shoulders Display, Public Sans, IBM Plex Mono) and its status-chip vocabulary. The page is a stack of plates, the way an instrument is a stack of panels:\n1. Masthead: one verdict sentence carrying the four anchor numbers (20 to 26, 38, 160 and 180, 924).\n2. \"The scale\" plate, which is the hero. A widened template man (ANSUR II proportions, grey, dotted, labelled NOT A BUILD) stands at 24, 48, 96, 192 and 384, then the meatball circle at 924. The T/A/F functional-limit brackets sit between those figures and … [2,584 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "styles": [
   {
    "name": "A. Studio plate (picked)",
    "tokens": "Light: --paper #E4E5EB; --plate #F5F5F8; --ink #16171C; --ink-2 #434855; --ink-3 #5A5F6E; --rule #C2C5D0; --rule-2 #DDDFE6; --grid #E3E4EA; --ruler #FCFBF6; --ruler-edge #A9ACB8; --void #B7BAC6; --tpl #C9CCD6; --chalk #1F4FA6; --alarm #B0321D; --alarm-bg #F6E2DC; --pass #2D6A3E; --pass-bg #E1EEE3; --caution #8A5A00; --caution-bg #F6ECD6; groups --g-every #8A90A6 (studio grey), --g-nat #2F5FB3 (Rex's navy briefs, lifted), --g-bb #C8693C (Ollie's skin / contest tan), --g-str #D9A520 (crest glint), --g-com #A8306A (Ollie's maroon briefs, lifted), --g-duo #5A3D2B (Rex's scales), --duo-edge #B87A14. Dark: --paper #111216; --plate #1A1B22; --ink #E7E8EE; --ink-2 #B5B8C4; --ink-3 #8C909E; --rule #393B46; --rule-2 #292B34; --grid #23242C; --ruler #24252D; --ruler-edge #4A4D5A; --void #4A4D5A; --tpl #565A69; --chalk #94B5FF; --alarm #FF8C75; --alarm-bg #3A1C16; --pass #8FD19E; --pass-bg #18301E; --caution #E8B85A; --caution-bg #33270F; --g-every #A7ACBD; --g-nat #4C79CF; --g-bb #CC5F36; --g-str #D8B444; --g-com #A955A8; --g-duo #7A5438; --duo-edge #E0B040. Fonts as the Build Calculator.",
    "figure_treatment": "Flat group-colour fill. The outline marking is a stroke laid under the fill, with a 1.6 px plate-coloured gap, so only its outer half shows, as a clean drafted edge whatever the fill colour. Ink solid means the build's own girth. Ink dots mean template. A gold dash-dot (the crest glint) means traced from art. Tails are hatched in the group colour with a grey dashed edge. A grey skull-top datum line runs through each figure cell. No interior detail. The template man and the meatball are neutral grey (--tpl), never a group colour.",
    "why": "The plate is the turnarounds' blue-grey studio backdrop and the ruler is ivory. Every group colour is lifted from the art. It sits beside the Build Calculator as a sibling (same fonts and chips) without copying its tape-yellow masthead. Validator results (all pairs, light on #F3F3F6): CVD worst 10.6 (pass) and normal-vision floor 16.0 (pass). Two fails are deliberate: everyday grey is a neutral reference below the chroma floor, and the duo's umber sits below the lightness band; its identity rides on the gold dash-dot edge and the names. Gold and grey are below 3:1 against the plate, so every figure has an ink outline and every row a text label. Dark: CVD 7.4 (WARN, legal with labels), normal floor 15.9 (pass)."
   },
   {
    "name": "B. Semi-log graph paper",
    "tokens": "Light: --paper #FBFAF6; --grid-minor #EAD9C8; --grid-major #C79A78 (printed in Ollie's skin sepia, like K&E 2-cycle paper); --ink #2A1C14 (umber); --fig #5A3D2B for every figure; group shown by a 6 px base tab in navy #2F5FB3, maroon #8E2F4A, crest gold #C98A1E, slate #7A8096, sienna #B8693C, umber. Dark: --paper #17120E; --grid-minor #2A2019; --grid-major #5C4330; --ink #EFE3D6; --fig #C9A27E.",
    "figure_treatment": "Every silhouette is one umber ink fill, like specimens drawn on lab paper, and only the outline marking differs. The full semi-log grid prints behind the whole chart, with 'CYCLE 1 / CYCLE 2' printed in the margin.",
    "why": "It is the most literal instrument, and it fits the brief's \"builds differ only in their outline marking\" best. It loses group identity at a glance. The printed grid also competes with the hatched empty stretches, which must read as empty."
   },
   {
    "name": "C. Brass dial",
    "tokens": "Dark-first, single look: --ground #1C1510 (Rex's umber); --panel #251C15; --engrave #D9A520 (crest gold) for ticks and numerals; --ink #EDE3D2; figure fills are cream #E7DCC8 tinted per group (navy #9FB0D8, maroon #D9A0AE, tan #E3B58F, gold #E8CF8A, slate #BFC3D0, umber-gold #C79A5A). The light variant is parchment #EFE6D6 with umber engraving #4A3322.",
    "figure_treatment": "Backlit specimens: pale fills on a dark umber ground, with the outline marking engraved in gold. Tails get a cross-hatch engraving.",
    "why": "It is dramatic and close to Rex's own palette, but dark-plus-gold drifts toward the templated near-black-with-one-accent look. The pale tints are hard to tell apart and fail CVD separation. It also reads as a dial rather than a measurement sheet, which weakens the honesty-first tone."
   }
  ],
  "picked_style": "A. Studio plate. It is the only one of the three that keeps six groups distinguishable (validated) and keeps the voids readable as voids. It also stays recognisably a sibling of the Build Calculator. Its colours all come from the turnarounds: the backdrop is the plate, Rex's scales and the crest glint mark the duo, and the briefs and skin give the human groups. Things for review to note:\n- The \"measured\" value boxes are solid black pills (the house convention), so they are the heaviest marks in a row.\n- Everyday grey and the duo's umber deliberately fall outside the validator's chroma and lightness bands.",
  "layout_desktop": "Width is capped at 1,240 px, with a 16 px gutter on .wrap. The page is five plates (sheet cards, 1 px rule border, 3 px radius); each plate's sections are ruled off inside. Every section opens with an eyebrow, an uppercase Big Shoulders h2, then a bold one-line verdict, then at most two lines of grey support text.\n- Masthead: eyebrow, the H1 \"BUILD COMPARISON\" at clamp(2.6–4.4rem), a 60ch verdict, then a mono spec line with a MOCK chip.\n- Plate 1, the scale: one SVG at full plate width, about 600 px tall. Template figures are 150 px tall. The ruler is 54 px tall. Six lanes of 32 px each, then notes in three columns (empty stretches, T·A·F, the two scales). The key follows in three columns: silhouette outline, score bar, status of each number.\n- Plate 2, the ranking: the controls row, then a sticky axis header, then rows. Row grid: 72 px figure | 236 px name and meta | 1fr track | 150 px reading. Grid areas are \"fig who track score / fig who track foot / fig note note note\". Rows are about 90–100 px tall. Gap rows are about 40 px. The open detail spans every column (170 px big figure | inputs and girths | what this ignores).\n- Plate 3: how the score works, in two columns.\n- Plate 4: the bench in two columns (1.15fr sheet | 1fr inputs, checks, results), then the target outline (220 px inputs | images capped at 460 px).\n- Plate 5: limits in two columns, then a colophon.\n- Full page at 1280: about 10,100 px.",
  "layout_phone": "At 390 px the order stays the same with one column; the page is about 14,800 px tall, 60% of it the ranking.\n- Hero SVG: only two template figures (24 and 96) plus the meatball, 74 px tall. T/A/F appear as letters with \"?\" brackets; the full wording is in the notes under the SVG. The ruler is 46 px with labels 15/20/30/50/100/200/500/1,000. kg labels sit below the ruler with halos. Lane labels are short names with a plate-coloured halo so the Kouri and extrapolation rules don't strike through them.\n- Ranking rows use grid 52 px figure | 1fr | 70 px score, with areas \"fig who score / fig track track / . foot foot / . note note\". The group name becomes visually hidden (kept for screen readers) and a 9 px swatch before the name carries it. Figures are 52×70. Rows are about 125 px.\n- The sticky axis spans the track columns: phone labels are 20/50/100/200/500/1k, and the \"extrapolated →\" label anchors right when the line passes 60%.\n- Controls wrap. Group chips sit two rows deep.\n- The bench stacks. The sheet SVG keeps a 560 px minimum width inside its own overflow-x box, with the caption \"On a phone, swipe the sheet sideways\". The readout table has one quantity per row so nothing is wider than the screen.\n- No page-level horizontal scroll in any mode (checked with zoom + real heights + side view).",
  "axis": "The axis is log, not broken. A broken axis would cut out exactly the empty stretches (about 40–50, 84–150, 190–924) that the brief wants visibly empty.\n\nHero ruler (slide rule):\n- Ticks every 1 from 15–50, every 5 from 55–100, every 10 from 110–200, and every 50 from 250–1,000.\n- Four tick lengths: 5, 9, 14, 20 px. Decade marks at 100 and 1,000 are tallest, with bold numerals.\n- Desktop labels: 15, 20, 25, 30, 40, 50, 60, 80, 100, 150, 200, 300, 500, 1,000. Phone: 15, 20, 30, 50, 100, 200, 500, 1,000.\n- Axis title: \"SCORE (FFMI AT 1.80 M, KG/M²)\".\n- The bottom edge carries  … [988 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "gaps_and_limits": "Empty stretches:\n- Computed from the data: stretches of the scale that no build's full range covers, when the gap ratio is above 1.2. The top gap always runs to 924.\n- Hero: drawn as diagonal hatching (--void) through the lanes below the ruler, labelled on desktop \"NO BUILD\" and \"NO BUILD · 189–924\", and listed in words in the notes (\"No build lands between 42 and 57, between 90 and 151, or anywhere above 189...\").\n- Sticky axis: shown as the same hatching.\n- Ranking: inserted in score order as gap rows, e.g. \"NOTHING FROM 42 TO 57\", with a bordered hatched bl … [1,676 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "marking_key": "The outline is drawn per body part (head, neck, chest, waist, upper arm, forearm with hand, thigh, calf with foot), so the marking can change along one figure. Coleman, for example, has a solid chest, waist, arm and calf with a dotted forearm, neck and head.\n- Solid ink: the part comes from this build's own girth with status measured, reported or official.\n- Dotted ink (round-cap dots): the template fills the part in, scaled by weight. This covers unknown and derived girths, and the head always.\n- Dash-dot in --duo-edge gold: traced from art.\n\nThis is a deliberate change … [1,476 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "controls": "One controls row above the ranking applies to the ranking only; the hero always shows everything.\n- Figures: [Same height | Real heights]. Real heights scales the figures against 3.1 m, so humans are about 58% of the cell.\n- Scale: [15 to 1,000 | Zoom 15 to 50]. Full scale is the default. Zoom re-maps the track and sticky axis over 15–50 and labels off-scale rows \"off scale: … →\".\n- View: [Front | Side]. Side uses the traced side views for Rex and Ollie and a depth profile for humans.\n- Groups: six toggle chips with colour swatches and short names (Everyday, Natural, Bodybuilders, Strongmen, Comic, Rex and Ollie). Turning one off strikes it through, and the surviving rows keep their colours.\n\nInteraction:\n- Each build's name is a button that toggles an inline detail panel. The mock opens Coleman's: a big figure; inputs with status boxes and sources; girths, each saying whether it gave a solid or dotted outline; and \"What this ignores\".\n- The axis header is sticky.\n- Segmented buttons use aria-pressed, and focus rings are visible.\n- No hover-only information: every value is printed.",
  "tool_ui": "\"Measuring bench\" plate: two columns on desktop, stacked on phone.\n\nLeft: the sheet viewer.\n- An SVG of the uploaded sheet: the mock shows Rex front, a mirrored front standing in as the back, and side, from the traces.\n- One ground line and a dashed \"top of skull\" line.\n- Blue guide lines labelled shoulder, chest, waist, crotch and knee in a left gutter, carried across all views.\n- Red width and depth slice markers at the chest on the front and side views.\n- The tail region outlined in dashed red: \"tail: painted out of the score (dashed)\".\n- Per-view captions \"FRON … [1,667 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "copy": "Mock ribbon: \"Design mockup · every number on this page is a placeholder · not for review of facts\".\n\nMasthead:\n- Eyebrow: \"Men's builds · muscle level, height taken out\"\n- H1: \"Build Comparison\"\n- Verdict: \"Ordinary men score 20 to 26. The most muscular people measured reach about 38. Rex and Ollie score about 160 and 180. No body can score above 924: that is a solid ball of muscle.\"\n- Spec line: \"49 builds · men only · score = 1.8 × fat-free mass ÷ height³ · log scale · [MOCK NUMBERS]\"\n\nThe scale:\n- H2: \"One ruler for every build\"\n- Verdict: \"Equal steps on  … [3,901 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "mockup_files": [
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/mock.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-light-top.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-dark-top.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-light-top.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-dark-top.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-modes.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-modes.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/mock.src.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/gen.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/shots.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/modes.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/trace.py",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/duo-paths.json",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/export.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/mockdata.json"
  ],
  "risks": "1. **Crowding at full scale.** About 40 human and human-sized builds fall in 15–40, the left ~23% of the track. Their bars are 10–20 px, and on a phone they shrink to little more than the diamond and caps. The \"Zoom 15 to 50\" option makes them readable (see 1280-modes.png). The owner should pick the default; the brief favours one honest full scale.\n\n2. **The widened template reads as fat.** Uniform widening grows the waist and hips and looks obese, not muscular. The mock uses a \"waist grows least\" pattern with made-up exponents (WIDEN_E). The build needs a sourced widening ru … [2,569 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
 },
 {
  "angle": "Police lineup / museum-specimen parade. The figures come first. Every build stands at the same drawn height against a studio wall, in score order, on a floor plate that carries its score. Empty stretches of the scale are tiles of bare, hatched floor. The last stretch of empty floor runs out to the meatball at the far end. A to-scale log tape (the Build Calculator's yellow tape, made logarithmic) sits under the lineup and places all 49 builds.",
  "summary": "The mockup is built and screenshotted at 390x844 and 1280x900 in light and dark. I checked full-page shots too, fixed what read badly, and re-shot. scrollWidth equals the viewport in all four, and there are no console errors.\n\nPage order:\n1. A full-bleed log tape band (15 to 1,000).\n2. Masthead: a one-line verdict lede marked \"all estimates\".\n3. Three segmented controls.\n4. THE LINEUP, the hero. A wall ruled at ANSUR median landmark heights (skull top, shoulder 82%, chest 74%, waist 60%, crotch 48%, knee 28%). There is a landmark post at the start, and figures follow in r … [1,872 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "styles": [
   {
    "name": "A. Studio lineup (picked)",
    "tokens": "LIGHT :root { --paper:#ECEDF1; --sheet:#F8F8FA; --wall:#DADCE4; --wall-line:#C2C5D1; --floor:#F1F1F4; --floor-edge:#A9ADBB; --ink:#15181F; --ink-2:#464C5A; --ink-3:#5C6270; --rule:#C4C7D0; --rule-2:#E0E2E8; --tape:#EDBE2E; --tape-ink:#231D07; --chalk:#1F4FA6; --alarm:#B0321D; --alarm-bg:#F6E2DC; --studio:#888898; --g-every:#6F7C99; --g-natural:#CFA23A; --g-bb:#B9592A; --g-strong:#5A3624; --g-comic:#34489A; --g-duo:#8E2440; --g-geom:#9A9CA8; --font-display:'Big Shoulders Display'; --font-body:'Public Sans'; --font-mono:'IBM Plex Mono' }  DARK (prefers-color-scheme guarded by :root:not([data-theme=light]) and :root[data-theme=dark]) { --paper:#14151A; --sheet:#1B1D23; --wall:#262833; --wall-line:#373A49; --floor:#30323D; --floor-edge:#555A6B; --ink:#E8E9EE; --ink-2:#B4B8C3; --ink-3:#8C91A0; --rule:#3A3E4A; --rule-2:#272A33; --tape:#DDB02C; --tape-ink:#1B1604; --chalk:#94B5FF; --alarm:#FF8C75; --alarm-bg:#3A1C16; --g-every:#9AB4D0; --g-natural:#E3B842; --g-bb:#C46A3B; --g-strong:#7A4536; --g-comic:#5A78D0; --g-duo:#BF4D5F; --g-geom:#6E7080; color-scheme:dark }",
    "figure_treatment": "Flat group fills on a cool blue-grey wall lightened from the turnarounds' studio grey (#888898), with faint landmark guide lines and a dashed skull-top line. The floor is lighter, like the art's floor. Each figure's edge is in the ink token, so it is dark on light and light on dark. The edge is drawn under the fill at twice its width, so only the outer half shows and inner seams vanish. Edge style varies by body region: solid, dashed or dotted. The contours are smooth (Catmull-Rom) with no interior detail, and hands and feet are simple mitts, following the turnarounds' simplification. The meatball is a geometry-grey disc with a drafting centre cross.",
    "why": "The wall is the turnarounds' own backdrop, so traced and data-drawn figures sit in one world. The six fills are the art's six colours: studio slate (everyday), crest gold (natural athletes), Ollie's skin rust (bodybuilders), Rex's umber (strongmen and lifters), navy briefs (comic), maroon briefs (the duo). It keeps the Build Calculator's fonts, status chips and yellow tape, so the pages read as one family. I ran the validator on the fills with all pairs. CVD separation passes in both themes: worst ΔE 15.2 in light (rust/slate), 15.5 in dark (umber/rust). The normal-vision floor also passes: 17.6 light, 17.7 dark. The duo against comics is 21+. Two failures are deliberate. The neutral everyday slate and the dark umber fail the chroma and lightness band. Gold sits at 1.7:1 against the wall, which the ink edges and direct-label plates cover."
   },
   {
    "name": "B. Night gallery",
    "tokens": "DARK-FIRST :root { --paper:#1A1310; --wall:#241A15; --floor:#2E231C; --ink:#F1E6D6 (horn cream); --ink-2:#C9B9A4; --rule:#4A3A30; --accent:#E0A63A (crest glint); --g-every:#A9AEC0; --g-natural:#E6C26A; --g-bb:#D98A5C; --g-strong:#B07A5E; --g-comic:#8EA2E8; --g-duo:#E07A8E; color-scheme:dark }  LIGHT (prefers-color-scheme: light) { --paper:#EFE9E1; --wall:#E2D9CC; --floor:#F4EFE8; --ink:#2A1D16; --accent:#9A6410; fills darkened one step }",
    "figure_treatment": "The hall is Rex's dark umber. Each figure stands on a low plinth under a soft spot of light: a flat pale fill with a 1.5 px lighter rim, and gold-leaf mono labels on brass-coloured plates. Marking is shown as rim style (solid, dashed or dotted rim).",
    "why": "Not picked. Dark-first with a lone gold accent drifts toward the near-black plus one-pop template. The warm wall muddies the four warm group fills (natural, bodybuilders, strongmen, duo), which crowd into one hue band. Rim marking on spotlit edges is harder to read than an ink edge. It also breaks the family tie with the Build Calculator's daylight tailor's sheet."
   },
   {
    "name": "C. Cyanotype specimen sheet",
    "tokens": "DARK-FIRST :root { --paper:#1F2A55 (navy briefs); --wall:#243163; --floor:#2B3970; --ink:#EAF0FF; --line:#8FA3D9; --accent:#F2C14E; --g-*: pale tints at 80–90% lightness (slate #DCE3F2, gold #F3E3B0, rust #F2CDB6, umber #D9C2B4, comic #C6D2FA, duo #F2C2CC) }  LIGHT { --paper:#E9EEF8; --wall:#DDE4F3; --ink:#1F2A55; fills as mid navy tints }",
    "figure_treatment": "A drafting or blueprint sheet. Figures are pale flat fills with white construction-line edges. The functional limits and the meatball are drawn in pure construction-line style (centre marks, dimension arrows), and landmark lines are blueprint rules.",
    "why": "Not picked. Pale tints kill group separation: the six tints fail the normal-vision floor. It reads as engineering rather than anatomy and drifts toward a dark ground with one accent. It also severs the family tie with the Build Calculator. Its construction-line language is worth keeping for the limit figures and the meatball, and style A borrows it there."
   }
  ],
  "picked_style": "A. Studio lineup. A blue-grey studio wall from the turnarounds' background, with landmark guide lines like a police-lineup height chart. A light floor carries the score plates. Flat fills in the art's six colours, one per group. Ink edges carry the outline marking. The Build Calculator's fonts (Big Shoulders Display, Public Sans, IBM Plex Mono), status chips and yellow tape are kept, and the tape becomes the log scale. I suggest noting this choice for review.",
  "layout_desktop": "The wrap is max 1280 px with a 16 px gutter. In order:\n\n1. A full-bleed 34 px yellow log tape band at the top, with ticks at true log positions for the page width, labelled 15, 20, 30, 50, 100, 200, 500, 1,000.\n2. Masthead: a purple dashed MOCK flag (mock only); the H1 \"BUILD COMPARISON\" at clamp(2.6rem, 8vw, 4.4rem); a lede verdict at 1.125rem, 60ch, ending in an \"all estimates\" chip; a mono spec line.\n3. Controls row: three segmented controls labelled Heights, View, Builds.\n4. THE LINEUP:\n   - Section head: h2, then a bold one-line verdict, then a short sub-lin … [1,730 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "layout_phone": "At 390 px: 16 px gutter, content 358 px.\n- Log tape band labels drop 15.\n- Masthead: the H1 wraps to about 2.6rem.\n- Controls wrap to two rows.\n- Lineup: H = 92 px. Cells are a minimum of 80 px and grow, so about four figures fit per row. The landmark post is 40 px with only skull, waist and knee labels. The Kouri post label shortens to \"KOURI 25\". Plates use an 18 px score, an 11 px name (overflow-wrap anywhere, nbsp in \"5th %\") and 9.5 px FFMI.\n- Gaps: base width 300 px per decade, at least 104 px, so 39–50 and 81–140 share rows with figures. The 189–924 floor grows to fill its row, and the meatball sits at its end. The key-20 lineup is about 1,350 px tall.\n- The drawer stacks: figure, then facts.\n- Key: one column, with swatches two per row.\n- Strip: lane labels sit above each lane's bars, with a sheet-colour halo. Narrow EMPTY bands (39–50 is about 21 px wide) get rotated labels. The bracket label shortens to \"body limits: somewhere in here\". The tape starts at 20.\n- Limits: 2×2. Cards and tool stack.\n\nThe first frame (844 px) shows the tape, masthead verdict, controls, lineup verdict and the first row of figures. scrollWidth is 390 in both themes.",
  "axis": "Log scale, not a broken axis.\n- **Ticks.** It runs 15 → 1,000, drawn as the sister page's yellow tape. Major ticks with labels at 15, 20, 30, 50, 100, 200, 500, 1,000. Minor ticks at every integer multiple within each decade, plus half-steps from 15 to 100 on the masthead band.\n- **Why log.** It keeps 924 on scale, and the empty stretches stay honest in proportion: 81–140 and 189–924 read as visibly long. A broken axis would hide exactly the emptiness the brief wants shown.\n- **How ranges are drawn.** Each build is a 4 px round-capped bar from low to high plausible body fat, in its group colour, with a 3.6 px dot at the middle value. The dot is filled, or hollow for overstated comics. Overlapping bars within a lane are greedy-packed into 9 px sub-rows.\n- **Lineup spacing.** The lineup itself is rank-ordered and not to scale. The sub-line states it (\"The spacing is not to scale; the tape below is\"), and every figure's numbers sit on its plate.\n- **Real heights option.** Figures scale to their real stature against the tallest, Ollie at 3.06 m to the horn tips. The skull-top line is replaced by a metre scale on the landmark post, and the score axis is unchanged.\n- **Side option.** It swaps the template for a side profile from ANSUR depth ratios, and Rex and Ollie for their side traces.",
  "gaps_and_limits": "**Empty gaps.**\n- In the lineup, each gap is a tile with the same wall and guide lines, no figure, a diagonally hatched floor, and a plate in muted ink: \"39–50 / Empty. No build measured here yet.\" The last plate reads \"189–924 / Empty. Nothing measured between Ollie and the meatball.\"\n- Tile base width is log-proportional (600 px per decade on desktop, 300 on phone) with a 124 or 104 px minimum. Only the last gap grows, so the empty floor visibly runs out to the meatball.\n- On the strip, gaps are hatched vertical bands through every lane, labelled EMPTY (rotated w … [1,738 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "marking_key": "**How figures are built.** Each figure is drawn as region pieces: head, neck, chest, waist/hip, upper arm, forearm+hand, thigh, calf+foot. Strokes go under the fills at twice their width, so only the outer half shows and region seams vanish. Each region gets its own edge style:\n- **Solid:** \"from a tape measure\". A measured, official or reported girth.\n- **Dashed (6/4):** \"filled in from the template\". The Army median's shape scaled to the weight.\n- **Dotted (0.1/4.2 round caps, about 2.9 px):** \"measured from art\". Rex and Ollie, traced from their turnarounds.\n\nTh … [1,431 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "controls": "One controls row above the lineup, as segmented buttons with aria-pressed:\n- **Heights:** [Same height | Real heights].\n- **View:** [Front | Side].\n- **Builds:** [Key 20 | All 49]. \"Key 20\" is one per cluster; the selection rule is stated beside it in the build.\n\nThe strip always shows all 49.\n\nFigure cells are focusable (tabindex 0). Click, tap or Enter selects a figure: the plate gets a 3 px chalk top bar, and the drawer below the lineup fills with the figure at H = 230, its facts and status chips, its sources (exact URLs in the build) and the per-region marking. Hover outlines the cell. Hovering a strip bar shows a tooltip, and clicking it selects the same build and scrolls to the drawer.\n\nChoices are remembered per viewer in localStorage, wrapped in try/catch. There is no theme toggle; the page follows prefers-color-scheme and [data-theme].",
  "tool_ui": "Section \"MEASURE A CHARACTER\" opens with a verdict line and a sub-line saying the results stay on the page, because downloads are blocked.\n\n**Left column**\n- Loader row: \"Sample loaded: rex-turnaround.png (1941 × 810 px)\" and a \"Choose a sheet\" button (file input, plus drag and drop).\n- Sheet preview on the studio-grey token, with a dashed yellow overlay of detected guide lines: skull top, shoulder, waist, crotch, knee, ground.\n- A checks list with PASS (ink chip) or CHECK (alarm chip):\n  - \"Views agree in height within 1.1% (limit 2%).\" A failure past 2% rejects th … [1,176 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "copy": "Masthead (on the yellow log tape band):\nH1: \"BUILD COMPARISON\"\nLede: \"Drawn at one height, an ordinary man scores about 24. The biggest pros reach about 38 and comic giants about 80. Rex and Ollie score about 160 and 180. The scale ends at 924, the score of a solid ball of muscle as tall as the figure.\" [chip: all estimates]\nSpec: \"49 men · score = muscle carried if the body were 1.80 m tall · every number says what it is\"\n\nControls: \"Heights: Same height | Real heights\", \"View: Front | Side\", \"Builds: Key 20 | All 49\".\n\nTHE LINEUP\nVerdict: \"Everyone stands at t … [3,549 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "mockup_files": [
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock.src.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-390-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/full/mock-390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/full/mock-390-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/full/mock-1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/full/mock-1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/trace.py",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/traces-norm.json",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/masks.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/build.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/shot.js"
  ],
  "risks": "1. **Rank order is not to scale.** A ranked lineup shows order, not distance. A critic may read the spacing as distance. Mitigations: the sub-line (\"The spacing is not to scale; the tape below is\"), numbers on every plate, and the to-scale strip directly below. Gap tiles are log-proportional with a minimum width, which is a hint only. It might be cleaner to make all gap tiles equal and let only the strip carry proportion.\n2. **The meatball is not a hard maximum.** It is a chosen end of scale. A body as wide as it is tall (a cylinder) holds π/4 H³ against π/6 H³ for a ball, so it … [2,755 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
 },
 {
  "angle": "Phone-first reading for a general audience with ADHD. The page is one long tape you scroll down, from ordinary men to the meatball. A to-scale log tape (15 to 1,000) stays pinned beside the figures. Each stop opens with a tape-yellow score tag, a display headline and a one-line verdict, then shows its lineup of flat figures. The desktop layout comes from the same structure: the pinned tape widens into a to-scale overview.",
  "summary": "Proposal: \"the tape you scroll down\". On a phone a 46 px sticky rail sits at the left. It is a yellow tailor's tape with log graduations from 15 to 1,000, drawn to scale. It marks every build as a coloured tick, shows the empty gaps hatched, draws Kouri's 25 as a dashed line, puts a chalk-blue dotted bracket over 40 to 200 (where the functional limits fall, position not yet worked out) and a chalk circle at 924. A box shows which stop you are reading, and tapping the tape jumps to a stop.\n\nThe stops scroll on the right, in this order:\n- Ordinary men (up to 25)\n- The natural … [1,333 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "styles": [
   {
    "name": "A. Studio wall (picked)",
    "tokens": "LIGHT :root { --paper:#EEF0EC; --sheet:#FAFAF7; --ink:#15181C; --ink-2:#4A525A; --ink-3:#5F6770; --rule:#C5CAC4; --rule-2:#E0E3DE; --tape:#EDBE2E; --tape-ink:#231D07; --chalk:#1F4FA6; --chalk-bg:#E3E9F5; --alarm:#B0321D; --alarm-bg:#F6E2DC; --wall:#DCDDE6; --floor:#ECECF0; --wall-line:#9C9DB0; --hatch:#B9BACB; --seam:rgba(255,255,255,.55); --g-everyday:#6C6F86; --g-natural:#3B6D7F; --g-enhanced:#7A2434; --g-strong:#232C5C; --g-comic:#A0650C; --g-rex:#4A3324; --g-ollie:#A4532B; fonts: Big Shoulders Display 800 (display), Public Sans (body), IBM Plex Mono (data) }  DARK (prefers-color-scheme guarded :root:not([data-theme=light]) and :root[data-theme=dark]) { --paper:#101215; --sheet:#171A1E; --ink:#E7E9E4; --ink-2:#B2B8BE; --ink-3:#868E96; --rule:#3A4047; --rule-2:#272B31; --tape:#DDB02C; --tape-ink:#1B1604; --chalk:#94B5FF; --chalk-bg:#2A3756; --alarm:#FF8C75; --alarm-bg:#3A1C16; --wall:#20222B; --floor:#2A2C36; --wall-line:#565970; --hatch:#3D4052; --seam:rgba(0,0,0,.45); --g-everyday:#A3A6BC; --g-natural:#6DB2C6; --g-enhanced:#D96A7E; --g-strong:#9198EC; --g-comic:#E3A63C; --g-rex:#A88063; --g-ollie:#E08A58; color-scheme:dark }",
    "figure_treatment": "Flat fills, one per group, taken from the turnarounds: studio slate for everyday men, steel teal for natural athletes, Ollie's maroon briefs for bodybuilders, Rex's navy briefs for strongmen and lifters, crest-glint gold (darkened for contrast) for comic characters, umber for Rex and russet for Ollie. Each figure stands in front of the blue-grey wall band, which has a floor strip and a dashed top-of-skull line. The edge marking is an ink stroke drawn under the fill, so only its outer half (about 1.9 px) shows. Arms and hands get a hairline seam in --seam so they read over the torso, the one interior detail, in keeping with the turnarounds' clean contours. Geometry (the widened template and the meatball) is drawn in chalk blue, outline only with a pale fill.",
    "why": "It keeps the Build Calculator's tailor's-sheet system (same paper, ink, tape, chalk and fonts), so the two pages read as one family, and brings in the art's own studio wall and floor. Group colour lets a skimming reader see that the giants are all comic characters and that Superman sits among ordinary men, while the edge still carries where each outline came from. It has both themes with checked contrast. A navy/maroon/gold/umber set is not one of the templated AI looks."
   },
   {
    "name": "B. Turnaround grey",
    "tokens": "Single look, used in both themes: --wall:#888898; --floor:#B9B9C2; --edge:#F4F4F6; --label:#F4F4F6; --g-everyday:#C9CAD6; --g-natural:#7FB4C4; --g-enhanced:#5E1422; --g-strong:#1A2148; --g-comic:#E6A33A; --g-rex:#3A281C; --g-ollie:#B9673C; the page around it keeps the sister tokens",
    "figure_treatment": "The whole chart sits on the render's #888898 studio grey with a light floor band. Edges are white so the marking shows on the mid-grey, and labels are white.",
    "why": "Closest to the art: the figures look as if they stand in the render. Rejected because white 11 px text on mid-grey is weak (about 3:1), it can't follow the light and dark themes, and the navy and maroon fills sink into the grey."
   },
   {
    "name": "C. Umber print",
    "tokens": "LIGHT: --paper:#EEF0EC; --fig:#3A2A20; --edge:#15181C; floor tiles --tile-everyday:#6C6F86; --tile-enhanced:#7A2434; --tile-strong:#232C5C; --tile-comic:#A0650C; --tile-duo:#E0A030 (crest gold). DARK: --paper:#101215; --fig:#D8C2AE; --edge:#E7E9E4; tiles as light",
    "figure_treatment": "Every figure, human, comic or duo, gets the same umber fill. The edge marking is the only visual difference between builds. Group shows only as a small coloured floor tile under the feet and a swatch by the name.",
    "why": "The strictest reading of 'builds differ only in their outline marking', and the marking is easiest to see because every fill matches. Held as the fallback if the reviewer finds group colours distracting. Rejected as the default because a skimming reader loses group membership at a glance."
   }
  ],
  "picked_style": "A. Studio wall. Family continuity with the Build Calculator (tokens, fonts, tape, status chips), the art's own wall and floor behind every lineup, and one fill per group from the turnaround palette, while the edge marking alone carries provenance. Note the choice for review: C (Umber print) is the fallback if group colour is judged to compete with the marking.",
  "layout_desktop": "At 1280 px (max-width 1240, 16 px gutters):\n- Tape strip across the top, as on the Build Calculator.\n- Masthead in two columns. Left: kicker, BUILD COMPARISON in Big Shoulders 800, and the 4-line verdict at 19 px semibold. Right: a 3-line score explainer, then a 2x3 edge key (Solid, Dashed, Dotted, No edge, Hatched, Top of skull) with drawn samples.\n- Sticky control bar: Height Same/Real, View Front/Side, and a \"Go to\" menu of stops on the right.\n- The scale grid: a 330 px sticky rail and the stops column.\n  - Rail (fills the viewport height): 34 px yellow log tape  … [996 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "layout_phone": "At 390 px (16 px gutters, no horizontal scroll, checked at scrollWidth 390):\n- Tape strip, a 2-line mock banner (mock only), kicker, h1, a 5-line verdict lede, a 3-line score explainer, and the 6-item edge key in two columns.\n- Sticky bar (52 px): \"Height Same | Real\" and \"View Front | Side\" as segmented controls. There is no Go-to menu on phone; the rail is the jump control.\n- Scale grid: a 46 px sticky rail and a content column of about 300 px.\n  - The rail sticks below the bar, height calc(100svh - 76px), min 520 px. It shows the tape with tick labels, a 14 px str … [952 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "axis": "One log axis, 15 to 1,000, drawn to scale only on the rail; the stops scroll in order but not to scale.\n\nOn the tape:\n- Labelled majors at 15, 20, 30, 50, 100, 200, 500 and 1000.\n- Minor ticks at 16 to 19, 25, 35, 40, 45, 60 to 90, 150, and 300 to 900.\n- Each band appears in its stop's tag as 'Score 25 to 32', so position never depends on reading the gaps between stops.\n- On desktop each build is a vertical range bar (low to high body fat) in its group lane; on phone, a tick at the geometric middle of its range.\n\nWhy not a broken axis: a break would hide the empty stretches the brief wants visibly empty. On the log tape the 188 to 924 stretch fills about 38% of the tape, and everything from 15 to 41 (about 45 of the 49 builds) fills about 24%. That proportion is the story. The stops give the crowded low end the room for figures that the to-scale tape can't.\n\nTapping the tape converts the tap's y back to a score and scrolls to that stop. Score ranges use an en dash and whole numbers below 100, rounded to 2 above 100, with no '≈'.",
  "gaps_and_limits": "Empty gaps:\n- They appear twice: as hatched rectangles across the lanes on the rail (labelled EMPTY on desktop), and as their own stops with the tag 'Score 41 to 57', the headline 'EMPTY', a verdict, a hatched box reading 'NO BUILDS HERE' and the line 'Step 2 adds figures drawn to order for this stretch, each labelled \"measured from art\".'\n- The last gap, 'EMPTY TO THE TOP' (188 to 924), gets a taller box.\n- Gap edges must be computed from the builds' range ends, never typed.\n\nNatural limit:\n- An anchor stop with no figures. Value rows read '25 · Kouri and others, … [1,275 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "marking_key": "Every figure is a flat fill; only its edge changes. The edge is an ink stroke 3.8 px wide drawn under the fill, so about 1.9 px shows outside the shape on the wall.\n- Solid (butt caps): the build's own number (measured, official or reported).\n- Dashed 6/3.5: filled in from a template build.\n- Dotted 0.1/4.2 (round caps): traced from art. Used for Rex and Ollie.\n- No edge: head, hands and feet, which use average ANSUR proportions on every human.\n\nMarkings vary along one figure. figure.js bandEdges splits the body outline into neck, shoulders, chest, waist, hips, thigh an … [1,366 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "controls": "One sticky bar at the top of the scale.\n- Height: Same | Real (segmented, aria-pressed). Same scales every figure so the top of the skull sits on the dashed wall line. Real uses one metres scale for the whole page (30 px/m on phone, 52 px/m on desktop) with faint 1 m, 2 m and 3 m lines on the wall, so humans appear about 55 px tall beside 3 m Rex and Ollie.\n- View: Front | Side. Side uses the template's side outline for humans and the traced side views for Rex and Ollie, tails hatched.\n- Go to: a menu of stops at 720 px and wider.\n- On phone: tap the tape to jump.\n\nProposed but not in the mock: tap a figure to open a details sheet with height, weight, body-fat range, each girth with its status and source link, and the figure drawn large so the edge marking reads.\n\nState lives in the page. Only bare #anchors are used, for deep links to stops. localStorage may remember the Height and View choice, wrapped in try/catch.",
  "tool_ui": "Section 'MEASURE A CHARACTER', separated from the scale by a heavy ink rule.\n- Verdict: 'Upload a model sheet. Get volume, mass, seven girths and the score.'\n- A chalk example note: 'Example loaded: Rex from duo.jpg, front view only. This is the tool's own test: it must land within the old methods' 2.52 to 2.60 m³.' The tool opens in a working state on its validation case, never on the turnarounds, which must not be measured in Step 1.\n\nSteps (numbered because they are a real sequence):\n1. The sheet: the image with dashed landmark lines (crest tip 3.048 m, top of skull, shou … [1,593 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "copy": "Masthead\n- Kicker: 'MUSCLE LEVEL, WITH HEIGHT TAKEN OUT'\n- H1: 'BUILD COMPARISON'\n- Lede: 'Ordinary men score about 22. The biggest bodybuilders reach about 40. Rex scores about 160 and Ollie about 180. The scale stops at 924: a solid ball of muscle.'\n- Score line: 'The score is fat-free mass ÷ height³ × 1.8. That is the FFMI (fat-free kg ÷ height in m²) a body would have at 1.80 m tall. Body fat is mostly unknown, so each score is a range.'\n- Edge key:\n  - 'Solid: its own measurement'\n  - 'Dashed: filled in from a template build'\n  - 'Dotted: traced from art'\n  - 'No edge: … [2,817 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
  "mockup_files": [
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/mock.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/390-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/390-light-first.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/390-dark-first.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/1280-light-first.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/1280-dark-first.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/styles.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/styles-1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/styles-1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/styles-390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/z-real.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/z-duo-side-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/z-duo-side-phone.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/z-tool-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/mock.src.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/gen.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/build.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/shots.js"
  ],
  "risks": "1. The meatball claim. The brief says 'a figure can't hold more volume than a ball as tall as itself'. That is false as geometry: a cylinder as tall holds 1.5 times as much and a cube about 1.9 times. The page must call 924 a chosen end point, as the mock does. Owner decision needed.\n\n2. Only the rail is to scale; the stops are not. A reader could take the spacing between stops as distance. The mitigations are a numeric tag on every stop and the current-stop box on the rail.\n\n3. The edge marking is subtle at phone size (86 px figures at 1x pixel density). Solid against dashed r … [2,904 more characters on this line; the full prompt is in prompts/a87541ca3584fc5e7.txt]
 }
]
```

</details>

**Subagent `design:synthesis`** · build-comparison-design · started 2026-10-11 04:12:46 UTC

- Returned fields: chosen_style, style_alternatives, tokens, fonts, layout, chart_spec, figure_spec, controls, tool_ui, copy.

<details>
<summary>Prompt, verbatim (118,952 characters)</summary>

Workflow run `wf_ff7816d2-f41`, phase `Synthesize`, agent `a61d1ed3f53e3f5da`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a61d1ed3f53e3f5da.txt](prompts/a61d1ed3f53e3f5da.txt).

```text
You are designing one page: "Build Comparison", a new self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/. Read /home/user/rex-strength-lab/build-comparison/BRIEF.md and /home/user/rex-strength-lab/CLAUDE.md first. Look at the art: /home/user/rex-strength-lab/build-comparison/assets/rex-turnaround.png and ollie-turnaround.png (A-pose turnarounds, the style key), /home/user/rex-strength-lab/rex-strength-lab/assets/duo.jpg. Look at the sister page's design system in /home/user/rex-strength-lab/build-calculator/src/app.html (a tailor's measurement sheet: tokens --paper/--sheet/--ink/--tape/--chalk, fonts Big Shoulders Display, Public Sans, IBM Plex Mono) and the screenshots in /home/user/rex-strength-lab/build-calculator/shots/ if present (run node /home/user/rex-strength-lab/build-calculator/test/shots.js to make them if absent; it writes to /home/user/rex-strength-lab/build-calculator/shots/, which is git-ignored).
What the page does: it ranks MEN's builds by a size-independent "muscle level" score S = 1.8 x fat-free mass / height^3 (FFMI after rescaling the body to 1.80 m at the same shape), shown beside plain FFMI. Scale runs from about 15 to 1,000 (log or broken axis). Builds (about 49 men): ANSUR II soldiers (5th/50th/95th percentile, plus 3 subgroups), NHANES US men, natural athletes (Kouri non-users, Chappell natural pros, Mr America 1938-54 mean, Steve Reeves), 12 bodybuilders (Coleman, Arnold, Yates, Cutler, Heath, Big Ramy, Oliva, 5 study groups), 5 strongmen/lifters (Shaw, Bjornsson, Hall, Tala … [1,338 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
Silhouettes: flat filled shapes for every build, all at the same drawn height by default (option: real heights side by side; option: side view). Builds differ only in their outline marking: measured (solid edge), derived from a template build (dashed edge), measured from art (dotted edge), explained in a key; markings can vary along one figure (e.g. measured chest, template forearm). Human figures are drawn from data (ANSUR II proportions), never from the duo's shapes; Rex and Ollie are traced from their turnarounds (their crest/horns rise above the common skull-top line; their tails are excluded from the score and should read as excluded). Do not use photos or art of real people or Marvel/DC characters. A fill colour per group (everyday, natural athletes, bodybuilders, strongmen and lifters, comic, the duo) is a reasonable default. Propose 2-3 chart styles drawn from the art's palette (the art: warm brown, dark umber, orange-gold crest glints, navy and maroon briefs, cool blue-grey studio background #888898, light floor) and pick one.
The page also holds a measuring tool: upload an A-pose model sheet (front, side, back), type the height and a density, and it reports volume, mass, seven girths, segment lengths, frontal area and the score, with checks (views differ in height by more than 2%, landmarks don't line up) and the uncertainty; it also shows a target outline (any target score) as front and side images. The viewer's sandbox blocks downloads: results are copied (a copy button) and images shown.
Constraints (Artifact page contract): no external scripts or images; Google Fonts only; works at 390 px and 1280 px, light and dark (token-based theming with prefers-color-scheme and [data-theme]); no horizontal page scroll; everything readable at rest; plain, specific copy for a general audience (the owner is a professional critic and reads with ADHD: lead each section with a one-line verdict, short sentences, gloss jargon); every number on the page shows its status (measured, official, reported, derived, estimate). Avoid templated AI looks (cream+serif+terracotta, near-black+acid green, purple gradients, Inter, emoji markers, rounded cards everywhere).
Write scratch files only under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/ (create it). Do not edit anything under /home/user/rex-strength-lab. Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).

You are the design lead. Three proposals and two judges' scores follow. Write the final design spec the builder will implement: start from the strongest proposal, graft the best ideas of the others, fix every real problem the judges named, and keep it feasible in plain HTML/CSS/SVG with no libraries. Record the chart styles considered and why the chosen one won. Be exact (sizes, tokens, copy).

PROPOSALS:
[
 {
  "angle": "A scientific instrument. The chart is the page: one log ruler from 15 to 1,000, drawn like a slide rule. Every build is a range bar with its own silhouette hanging off that ruler. Uncertainty and status are always drawn, never left to footnotes: bars are ranges, hatching means \"assumed\", empty stretches are hatched voids, and the extrapolation boundary is a red rule.",
  "summary": "The mockup is a single page in the Build Calculator's type system (Big Shoulders Display, Public Sans, IBM Plex Mono) and its status-chip vocabulary. The page is a stack of plates, the way an instrument is a stack of panels:\n1. Masthead: one verdict sentence carrying the four anchor numbers (20 to 26, 38, 160 and 180, 924).\n2. \"The scale\" plate, which is the hero. A widened template man (ANSUR II proportions, grey, dotted, labelled NOT A BUILD) stands at 24, 48, 96, 192 and 384, then the meatball circle at 924. The T/A/F functional-limit brackets sit between those figures and … [2,584 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "styles": [
   {
    "name": "A. Studio plate (picked)",
    "tokens": "Light: --paper #E4E5EB; --plate #F5F5F8; --ink #16171C; --ink-2 #434855; --ink-3 #5A5F6E; --rule #C2C5D0; --rule-2 #DDDFE6; --grid #E3E4EA; --ruler #FCFBF6; --ruler-edge #A9ACB8; --void #B7BAC6; --tpl #C9CCD6; --chalk #1F4FA6; --alarm #B0321D; --alarm-bg #F6E2DC; --pass #2D6A3E; --pass-bg #E1EEE3; --caution #8A5A00; --caution-bg #F6ECD6; groups --g-every #8A90A6 (studio grey), --g-nat #2F5FB3 (Rex's navy briefs, lifted), --g-bb #C8693C (Ollie's skin / contest tan), --g-str #D9A520 (crest glint), --g-com #A8306A (Ollie's maroon briefs, lifted), --g-duo #5A3D2B (Rex's scales), --duo-edge #B87A14. Dark: --paper #111216; --plate #1A1B22; --ink #E7E8EE; --ink-2 #B5B8C4; --ink-3 #8C909E; --rule #393B46; --rule-2 #292B34; --grid #23242C; --ruler #24252D; --ruler-edge #4A4D5A; --void #4A4D5A; --tpl #565A69; --chalk #94B5FF; --alarm #FF8C75; --alarm-bg #3A1C16; --pass #8FD19E; --pass-bg #18301E; --caution #E8B85A; --caution-bg #33270F; --g-every #A7ACBD; --g-nat #4C79CF; --g-bb #CC5F36; --g-str #D8B444; --g-com #A955A8; --g-duo #7A5438; --duo-edge #E0B040. Fonts as the Build Calculator.",
    "figure_treatment": "Flat group-colour fill. The outline marking is a stroke laid under the fill, with a 1.6 px plate-coloured gap, so only its outer half shows, as a clean drafted edge whatever the fill colour. Ink solid means the build's own girth. Ink dots mean template. A gold dash-dot (the crest glint) means traced from art. Tails are hatched in the group colour with a grey dashed edge. A grey skull-top datum line runs through each figure cell. No interior detail. The template man and the meatball are neutral grey (--tpl), never a group colour.",
    "why": "The plate is the turnarounds' blue-grey studio backdrop and the ruler is ivory. Every group colour is lifted from the art. It sits beside the Build Calculator as a sibling (same fonts and chips) without copying its tape-yellow masthead. Validator results (all pairs, light on #F3F3F6): CVD worst 10.6 (pass) and normal-vision floor 16.0 (pass). Two fails are deliberate: everyday grey is a neutral reference below the chroma floor, and the duo's umber sits below the lightness band; its identity rides on the gold dash-dot edge and the names. Gold and grey are below 3:1 against the plate, so every figure has an ink outline and every row a text label. Dark: CVD 7.4 (WARN, legal with labels), normal floor 15.9 (pass)."
   },
   {
    "name": "B. Semi-log graph paper",
    "tokens": "Light: --paper #FBFAF6; --grid-minor #EAD9C8; --grid-major #C79A78 (printed in Ollie's skin sepia, like K&E 2-cycle paper); --ink #2A1C14 (umber); --fig #5A3D2B for every figure; group shown by a 6 px base tab in navy #2F5FB3, maroon #8E2F4A, crest gold #C98A1E, slate #7A8096, sienna #B8693C, umber. Dark: --paper #17120E; --grid-minor #2A2019; --grid-major #5C4330; --ink #EFE3D6; --fig #C9A27E.",
    "figure_treatment": "Every silhouette is one umber ink fill, like specimens drawn on lab paper, and only the outline marking differs. The full semi-log grid prints behind the whole chart, with 'CYCLE 1 / CYCLE 2' printed in the margin.",
    "why": "It is the most literal instrument, and it fits the brief's \"builds differ only in their outline marking\" best. It loses group identity at a glance. The printed grid also competes with the hatched empty stretches, which must read as empty."
   },
   {
    "name": "C. Brass dial",
    "tokens": "Dark-first, single look: --ground #1C1510 (Rex's umber); --panel #251C15; --engrave #D9A520 (crest gold) for ticks and numerals; --ink #EDE3D2; figure fills are cream #E7DCC8 tinted per group (navy #9FB0D8, maroon #D9A0AE, tan #E3B58F, gold #E8CF8A, slate #BFC3D0, umber-gold #C79A5A). The light variant is parchment #EFE6D6 with umber engraving #4A3322.",
    "figure_treatment": "Backlit specimens: pale fills on a dark umber ground, with the outline marking engraved in gold. Tails get a cross-hatch engraving.",
    "why": "It is dramatic and close to Rex's own palette, but dark-plus-gold drifts toward the templated near-black-with-one-accent look. The pale tints are hard to tell apart and fail CVD separation. It also reads as a dial rather than a measurement sheet, which weakens the honesty-first tone."
   }
  ],
  "picked_style": "A. Studio plate. It is the only one of the three that keeps six groups distinguishable (validated) and keeps the voids readable as voids. It also stays recognisably a sibling of the Build Calculator. Its colours all come from the turnarounds: the backdrop is the plate, Rex's scales and the crest glint mark the duo, and the briefs and skin give the human groups. Things for review to note:\n- The \"measured\" value boxes are solid black pills (the house convention), so they are the heaviest marks in a row.\n- Everyday grey and the duo's umber deliberately fall outside the validator's chroma and lightness bands.",
  "layout_desktop": "Width is capped at 1,240 px, with a 16 px gutter on .wrap. The page is five plates (sheet cards, 1 px rule border, 3 px radius); each plate's sections are ruled off inside. Every section opens with an eyebrow, an uppercase Big Shoulders h2, then a bold one-line verdict, then at most two lines of grey support text.\n- Masthead: eyebrow, the H1 \"BUILD COMPARISON\" at clamp(2.6–4.4rem), a 60ch verdict, then a mono spec line with a MOCK chip.\n- Plate 1, the scale: one SVG at full plate width, about 600 px tall. Template figures are 150 px tall. The ruler is 54 px tall. Six lanes of 32 px each, then notes in three columns (empty stretches, T·A·F, the two scales). The key follows in three columns: silhouette outline, score bar, status of each number.\n- Plate 2, the ranking: the controls row, then a sticky axis header, then rows. Row grid: 72 px figure | 236 px name and meta | 1fr track | 150 px reading. Grid areas are \"fig who track score / fig who track foot / fig note note note\". Rows are about 90–100 px tall. Gap rows are about 40 px. The open detail spans every column (170 px big figure | inputs and girths | what this ignores).\n- Plate 3: how the score works, in two columns.\n- Plate 4: the bench in two columns (1.15fr sheet | 1fr inputs, checks, results), then the target outline (220 px inputs | images capped at 460 px).\n- Plate 5: limits in two columns, then a colophon.\n- Full page at 1280: about 10,100 px.",
  "layout_phone": "At 390 px the order stays the same with one column; the page is about 14,800 px tall, 60% of it the ranking.\n- Hero SVG: only two template figures (24 and 96) plus the meatball, 74 px tall. T/A/F appear as letters with \"?\" brackets; the full wording is in the notes under the SVG. The ruler is 46 px with labels 15/20/30/50/100/200/500/1,000. kg labels sit below the ruler with halos. Lane labels are short names with a plate-coloured halo so the Kouri and extrapolation rules don't strike through them.\n- Ranking rows use grid 52 px figure | 1fr | 70 px score, with areas \"fig who score / fig track track / . foot foot / . note note\". The group name becomes visually hidden (kept for screen readers) and a 9 px swatch before the name carries it. Figures are 52×70. Rows are about 125 px.\n- The sticky axis spans the track columns: phone labels are 20/50/100/200/500/1k, and the \"extrapolated →\" label anchors right when the line passes 60%.\n- Controls wrap. Group chips sit two rows deep.\n- The bench stacks. The sheet SVG keeps a 560 px minimum width inside its own overflow-x box, with the caption \"On a phone, swipe the sheet sideways\". The readout table has one quantity per row so nothing is wider than the screen.\n- No page-level horizontal scroll in any mode (checked with zoom + real heights + side view).",
  "axis": "The axis is log, not broken. A broken axis would cut out exactly the empty stretches (about 40–50, 84–150, 190–924) that the brief wants visibly empty.\n\nHero ruler (slide rule):\n- Ticks every 1 from 15–50, every 5 from 55–100, every 10 from 110–200, and every 50 from 250–1,000.\n- Four tick lengths: 5, 9, 14, 20 px. Decade marks at 100 and 1,000 are tallest, with bold numerals.\n- Desktop labels: 15, 20, 25, 30, 40, 50, 60, 80, 100, 150, 200, 300, 500, 1,000. Phone: 15, 20, 30, 50, 100, 200, 500, 1,000.\n- Axis title: \"SCORE (FFMI AT 1.80 M, KG/M²)\".\n- The bottom edge carries  … [988 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "gaps_and_limits": "Empty stretches:\n- Computed from the data: stretches of the scale that no build's full range covers, when the gap ratio is above 1.2. The top gap always runs to 924.\n- Hero: drawn as diagonal hatching (--void) through the lanes below the ruler, labelled on desktop \"NO BUILD\" and \"NO BUILD · 189–924\", and listed in words in the notes (\"No build lands between 42 and 57, between 90 and 151, or anywhere above 189...\").\n- Sticky axis: shown as the same hatching.\n- Ranking: inserted in score order as gap rows, e.g. \"NOTHING FROM 42 TO 57\", with a bordered hatched bl … [1,676 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "marking_key": "The outline is drawn per body part (head, neck, chest, waist, upper arm, forearm with hand, thigh, calf with foot), so the marking can change along one figure. Coleman, for example, has a solid chest, waist, arm and calf with a dotted forearm, neck and head.\n- Solid ink: the part comes from this build's own girth with status measured, reported or official.\n- Dotted ink (round-cap dots): the template fills the part in, scaled by weight. This covers unknown and derived girths, and the head always.\n- Dash-dot in --duo-edge gold: traced from art.\n\nThis is a deliberate change … [1,476 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "controls": "One controls row above the ranking applies to the ranking only; the hero always shows everything.\n- Figures: [Same height | Real heights]. Real heights scales the figures against 3.1 m, so humans are about 58% of the cell.\n- Scale: [15 to 1,000 | Zoom 15 to 50]. Full scale is the default. Zoom re-maps the track and sticky axis over 15–50 and labels off-scale rows \"off scale: … →\".\n- View: [Front | Side]. Side uses the traced side views for Rex and Ollie and a depth profile for humans.\n- Groups: six toggle chips with colour swatches and short names (Everyday, Natural, Bodybuilders, Strongmen, Comic, Rex and Ollie). Turning one off strikes it through, and the surviving rows keep their colours.\n\nInteraction:\n- Each build's name is a button that toggles an inline detail panel. The mock opens Coleman's: a big figure; inputs with status boxes and sources; girths, each saying whether it gave a solid or dotted outline; and \"What this ignores\".\n- The axis header is sticky.\n- Segmented buttons use aria-pressed, and focus rings are visible.\n- No hover-only information: every value is printed.",
  "tool_ui": "\"Measuring bench\" plate: two columns on desktop, stacked on phone.\n\nLeft: the sheet viewer.\n- An SVG of the uploaded sheet: the mock shows Rex front, a mirrored front standing in as the back, and side, from the traces.\n- One ground line and a dashed \"top of skull\" line.\n- Blue guide lines labelled shoulder, chest, waist, crotch and knee in a left gutter, carried across all views.\n- Red width and depth slice markers at the chest on the front and side views.\n- The tail region outlined in dashed red: \"tail: painted out of the score (dashed)\".\n- Per-view captions \"FRON … [1,667 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "copy": "Mock ribbon: \"Design mockup · every number on this page is a placeholder · not for review of facts\".\n\nMasthead:\n- Eyebrow: \"Men's builds · muscle level, height taken out\"\n- H1: \"Build Comparison\"\n- Verdict: \"Ordinary men score 20 to 26. The most muscular people measured reach about 38. Rex and Ollie score about 160 and 180. No body can score above 924: that is a solid ball of muscle.\"\n- Spec line: \"49 builds · men only · score = 1.8 × fat-free mass ÷ height³ · log scale · [MOCK NUMBERS]\"\n\nThe scale:\n- H2: \"One ruler for every build\"\n- Verdict: \"Equal steps on  … [3,901 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "mockup_files": [
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/mock.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-light-top.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-dark-top.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-light-top.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-dark-top.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/1280-modes.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/390-modes.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/mock.src.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/gen.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/shots.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/modes.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/trace.py",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/duo-paths.json",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/export.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/instrument/work/mockdata.json"
  ],
  "risks": "1. **Crowding at full scale.** About 40 human and human-sized builds fall in 15–40, the left ~23% of the track. Their bars are 10–20 px, and on a phone they shrink to little more than the diamond and caps. The \"Zoom 15 to 50\" option makes them readable (see 1280-modes.png). The owner should pick the default; the brief favours one honest full scale.\n\n2. **The widened template reads as fat.** Uniform widening grows the waist and hips and looks obese, not muscular. The mock uses a \"waist grows least\" pattern with made-up exponents (WIDEN_E). The build needs a sourced widening ru … [2,569 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
 },
 {
  "angle": "Police lineup / museum-specimen parade. The figures come first. Every build stands at the same drawn height against a studio wall, in score order, on a floor plate that carries its score. Empty stretches of the scale are tiles of bare, hatched floor. The last stretch of empty floor runs out to the meatball at the far end. A to-scale log tape (the Build Calculator's yellow tape, made logarithmic) sits under the lineup and places all 49 builds.",
  "summary": "The mockup is built and screenshotted at 390x844 and 1280x900 in light and dark. I checked full-page shots too, fixed what read badly, and re-shot. scrollWidth equals the viewport in all four, and there are no console errors.\n\nPage order:\n1. A full-bleed log tape band (15 to 1,000).\n2. Masthead: a one-line verdict lede marked \"all estimates\".\n3. Three segmented controls.\n4. THE LINEUP, the hero. A wall ruled at ANSUR median landmark heights (skull top, shoulder 82%, chest 74%, waist 60%, crotch 48%, knee 28%). There is a landmark post at the start, and figures follow in r … [1,872 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "styles": [
   {
    "name": "A. Studio lineup (picked)",
    "tokens": "LIGHT :root { --paper:#ECEDF1; --sheet:#F8F8FA; --wall:#DADCE4; --wall-line:#C2C5D1; --floor:#F1F1F4; --floor-edge:#A9ADBB; --ink:#15181F; --ink-2:#464C5A; --ink-3:#5C6270; --rule:#C4C7D0; --rule-2:#E0E2E8; --tape:#EDBE2E; --tape-ink:#231D07; --chalk:#1F4FA6; --alarm:#B0321D; --alarm-bg:#F6E2DC; --studio:#888898; --g-every:#6F7C99; --g-natural:#CFA23A; --g-bb:#B9592A; --g-strong:#5A3624; --g-comic:#34489A; --g-duo:#8E2440; --g-geom:#9A9CA8; --font-display:'Big Shoulders Display'; --font-body:'Public Sans'; --font-mono:'IBM Plex Mono' }  DARK (prefers-color-scheme guarded by :root:not([data-theme=light]) and :root[data-theme=dark]) { --paper:#14151A; --sheet:#1B1D23; --wall:#262833; --wall-line:#373A49; --floor:#30323D; --floor-edge:#555A6B; --ink:#E8E9EE; --ink-2:#B4B8C3; --ink-3:#8C91A0; --rule:#3A3E4A; --rule-2:#272A33; --tape:#DDB02C; --tape-ink:#1B1604; --chalk:#94B5FF; --alarm:#FF8C75; --alarm-bg:#3A1C16; --g-every:#9AB4D0; --g-natural:#E3B842; --g-bb:#C46A3B; --g-strong:#7A4536; --g-comic:#5A78D0; --g-duo:#BF4D5F; --g-geom:#6E7080; color-scheme:dark }",
    "figure_treatment": "Flat group fills on a cool blue-grey wall lightened from the turnarounds' studio grey (#888898), with faint landmark guide lines and a dashed skull-top line. The floor is lighter, like the art's floor. Each figure's edge is in the ink token, so it is dark on light and light on dark. The edge is drawn under the fill at twice its width, so only the outer half shows and inner seams vanish. Edge style varies by body region: solid, dashed or dotted. The contours are smooth (Catmull-Rom) with no interior detail, and hands and feet are simple mitts, following the turnarounds' simplification. The meatball is a geometry-grey disc with a drafting centre cross.",
    "why": "The wall is the turnarounds' own backdrop, so traced and data-drawn figures sit in one world. The six fills are the art's six colours: studio slate (everyday), crest gold (natural athletes), Ollie's skin rust (bodybuilders), Rex's umber (strongmen and lifters), navy briefs (comic), maroon briefs (the duo). It keeps the Build Calculator's fonts, status chips and yellow tape, so the pages read as one family. I ran the validator on the fills with all pairs. CVD separation passes in both themes: worst ΔE 15.2 in light (rust/slate), 15.5 in dark (umber/rust). The normal-vision floor also passes: 17.6 light, 17.7 dark. The duo against comics is 21+. Two failures are deliberate. The neutral everyday slate and the dark umber fail the chroma and lightness band. Gold sits at 1.7:1 against the wall, which the ink edges and direct-label plates cover."
   },
   {
    "name": "B. Night gallery",
    "tokens": "DARK-FIRST :root { --paper:#1A1310; --wall:#241A15; --floor:#2E231C; --ink:#F1E6D6 (horn cream); --ink-2:#C9B9A4; --rule:#4A3A30; --accent:#E0A63A (crest glint); --g-every:#A9AEC0; --g-natural:#E6C26A; --g-bb:#D98A5C; --g-strong:#B07A5E; --g-comic:#8EA2E8; --g-duo:#E07A8E; color-scheme:dark }  LIGHT (prefers-color-scheme: light) { --paper:#EFE9E1; --wall:#E2D9CC; --floor:#F4EFE8; --ink:#2A1D16; --accent:#9A6410; fills darkened one step }",
    "figure_treatment": "The hall is Rex's dark umber. Each figure stands on a low plinth under a soft spot of light: a flat pale fill with a 1.5 px lighter rim, and gold-leaf mono labels on brass-coloured plates. Marking is shown as rim style (solid, dashed or dotted rim).",
    "why": "Not picked. Dark-first with a lone gold accent drifts toward the near-black plus one-pop template. The warm wall muddies the four warm group fills (natural, bodybuilders, strongmen, duo), which crowd into one hue band. Rim marking on spotlit edges is harder to read than an ink edge. It also breaks the family tie with the Build Calculator's daylight tailor's sheet."
   },
   {
    "name": "C. Cyanotype specimen sheet",
    "tokens": "DARK-FIRST :root { --paper:#1F2A55 (navy briefs); --wall:#243163; --floor:#2B3970; --ink:#EAF0FF; --line:#8FA3D9; --accent:#F2C14E; --g-*: pale tints at 80–90% lightness (slate #DCE3F2, gold #F3E3B0, rust #F2CDB6, umber #D9C2B4, comic #C6D2FA, duo #F2C2CC) }  LIGHT { --paper:#E9EEF8; --wall:#DDE4F3; --ink:#1F2A55; fills as mid navy tints }",
    "figure_treatment": "A drafting or blueprint sheet. Figures are pale flat fills with white construction-line edges. The functional limits and the meatball are drawn in pure construction-line style (centre marks, dimension arrows), and landmark lines are blueprint rules.",
    "why": "Not picked. Pale tints kill group separation: the six tints fail the normal-vision floor. It reads as engineering rather than anatomy and drifts toward a dark ground with one accent. It also severs the family tie with the Build Calculator. Its construction-line language is worth keeping for the limit figures and the meatball, and style A borrows it there."
   }
  ],
  "picked_style": "A. Studio lineup. A blue-grey studio wall from the turnarounds' background, with landmark guide lines like a police-lineup height chart. A light floor carries the score plates. Flat fills in the art's six colours, one per group. Ink edges carry the outline marking. The Build Calculator's fonts (Big Shoulders Display, Public Sans, IBM Plex Mono), status chips and yellow tape are kept, and the tape becomes the log scale. I suggest noting this choice for review.",
  "layout_desktop": "The wrap is max 1280 px with a 16 px gutter. In order:\n\n1. A full-bleed 34 px yellow log tape band at the top, with ticks at true log positions for the page width, labelled 15, 20, 30, 50, 100, 200, 500, 1,000.\n2. Masthead: a purple dashed MOCK flag (mock only); the H1 \"BUILD COMPARISON\" at clamp(2.6rem, 8vw, 4.4rem); a lede verdict at 1.125rem, 60ch, ending in an \"all estimates\" chip; a mono spec line.\n3. Controls row: three segmented controls labelled Heights, View, Builds.\n4. THE LINEUP:\n   - Section head: h2, then a bold one-line verdict, then a short sub-lin … [1,730 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "layout_phone": "At 390 px: 16 px gutter, content 358 px.\n- Log tape band labels drop 15.\n- Masthead: the H1 wraps to about 2.6rem.\n- Controls wrap to two rows.\n- Lineup: H = 92 px. Cells are a minimum of 80 px and grow, so about four figures fit per row. The landmark post is 40 px with only skull, waist and knee labels. The Kouri post label shortens to \"KOURI 25\". Plates use an 18 px score, an 11 px name (overflow-wrap anywhere, nbsp in \"5th %\") and 9.5 px FFMI.\n- Gaps: base width 300 px per decade, at least 104 px, so 39–50 and 81–140 share rows with figures. The 189–924 floor grows to fill its row, and the meatball sits at its end. The key-20 lineup is about 1,350 px tall.\n- The drawer stacks: figure, then facts.\n- Key: one column, with swatches two per row.\n- Strip: lane labels sit above each lane's bars, with a sheet-colour halo. Narrow EMPTY bands (39–50 is about 21 px wide) get rotated labels. The bracket label shortens to \"body limits: somewhere in here\". The tape starts at 20.\n- Limits: 2×2. Cards and tool stack.\n\nThe first frame (844 px) shows the tape, masthead verdict, controls, lineup verdict and the first row of figures. scrollWidth is 390 in both themes.",
  "axis": "Log scale, not a broken axis.\n- **Ticks.** It runs 15 → 1,000, drawn as the sister page's yellow tape. Major ticks with labels at 15, 20, 30, 50, 100, 200, 500, 1,000. Minor ticks at every integer multiple within each decade, plus half-steps from 15 to 100 on the masthead band.\n- **Why log.** It keeps 924 on scale, and the empty stretches stay honest in proportion: 81–140 and 189–924 read as visibly long. A broken axis would hide exactly the emptiness the brief wants shown.\n- **How ranges are drawn.** Each build is a 4 px round-capped bar from low to high plausible body fat, in its group colour, with a 3.6 px dot at the middle value. The dot is filled, or hollow for overstated comics. Overlapping bars within a lane are greedy-packed into 9 px sub-rows.\n- **Lineup spacing.** The lineup itself is rank-ordered and not to scale. The sub-line states it (\"The spacing is not to scale; the tape below is\"), and every figure's numbers sit on its plate.\n- **Real heights option.** Figures scale to their real stature against the tallest, Ollie at 3.06 m to the horn tips. The skull-top line is replaced by a metre scale on the landmark post, and the score axis is unchanged.\n- **Side option.** It swaps the template for a side profile from ANSUR depth ratios, and Rex and Ollie for their side traces.",
  "gaps_and_limits": "**Empty gaps.**\n- In the lineup, each gap is a tile with the same wall and guide lines, no figure, a diagonally hatched floor, and a plate in muted ink: \"39–50 / Empty. No build measured here yet.\" The last plate reads \"189–924 / Empty. Nothing measured between Ollie and the meatball.\"\n- Tile base width is log-proportional (600 px per decade on desktop, 300 on phone) with a 124 or 104 px minimum. Only the last gap grows, so the empty floor visibly runs out to the meatball.\n- On the strip, gaps are hatched vertical bands through every lane, labelled EMPTY (rotated w … [1,738 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "marking_key": "**How figures are built.** Each figure is drawn as region pieces: head, neck, chest, waist/hip, upper arm, forearm+hand, thigh, calf+foot. Strokes go under the fills at twice their width, so only the outer half shows and region seams vanish. Each region gets its own edge style:\n- **Solid:** \"from a tape measure\". A measured, official or reported girth.\n- **Dashed (6/4):** \"filled in from the template\". The Army median's shape scaled to the weight.\n- **Dotted (0.1/4.2 round caps, about 2.9 px):** \"measured from art\". Rex and Ollie, traced from their turnarounds.\n\nTh … [1,431 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "controls": "One controls row above the lineup, as segmented buttons with aria-pressed:\n- **Heights:** [Same height | Real heights].\n- **View:** [Front | Side].\n- **Builds:** [Key 20 | All 49]. \"Key 20\" is one per cluster; the selection rule is stated beside it in the build.\n\nThe strip always shows all 49.\n\nFigure cells are focusable (tabindex 0). Click, tap or Enter selects a figure: the plate gets a 3 px chalk top bar, and the drawer below the lineup fills with the figure at H = 230, its facts and status chips, its sources (exact URLs in the build) and the per-region marking. Hover outlines the cell. Hovering a strip bar shows a tooltip, and clicking it selects the same build and scrolls to the drawer.\n\nChoices are remembered per viewer in localStorage, wrapped in try/catch. There is no theme toggle; the page follows prefers-color-scheme and [data-theme].",
  "tool_ui": "Section \"MEASURE A CHARACTER\" opens with a verdict line and a sub-line saying the results stay on the page, because downloads are blocked.\n\n**Left column**\n- Loader row: \"Sample loaded: rex-turnaround.png (1941 × 810 px)\" and a \"Choose a sheet\" button (file input, plus drag and drop).\n- Sheet preview on the studio-grey token, with a dashed yellow overlay of detected guide lines: skull top, shoulder, waist, crotch, knee, ground.\n- A checks list with PASS (ink chip) or CHECK (alarm chip):\n  - \"Views agree in height within 1.1% (limit 2%).\" A failure past 2% rejects th … [1,176 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "copy": "Masthead (on the yellow log tape band):\nH1: \"BUILD COMPARISON\"\nLede: \"Drawn at one height, an ordinary man scores about 24. The biggest pros reach about 38 and comic giants about 80. Rex and Ollie score about 160 and 180. The scale ends at 924, the score of a solid ball of muscle as tall as the figure.\" [chip: all estimates]\nSpec: \"49 men · score = muscle carried if the body were 1.80 m tall · every number says what it is\"\n\nControls: \"Heights: Same height | Real heights\", \"View: Front | Side\", \"Builds: Key 20 | All 49\".\n\nTHE LINEUP\nVerdict: \"Everyone stands at t … [3,549 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "mockup_files": [
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock.src.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-390-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/full/mock-390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/full/mock-390-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/full/mock-1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/full/mock-1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/trace.py",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/traces-norm.json",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/masks.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/build.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/shot.js"
  ],
  "risks": "1. **Rank order is not to scale.** A ranked lineup shows order, not distance. A critic may read the spacing as distance. Mitigations: the sub-line (\"The spacing is not to scale; the tape below is\"), numbers on every plate, and the to-scale strip directly below. Gap tiles are log-proportional with a minimum width, which is a hint only. It might be cleaner to make all gap tiles equal and let only the strip carry proportion.\n2. **The meatball is not a hard maximum.** It is a chosen end of scale. A body as wide as it is tall (a cylinder) holds π/4 H³ against π/6 H³ for a ball, so it … [2,755 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
 },
 {
  "angle": "Phone-first reading for a general audience with ADHD. The page is one long tape you scroll down, from ordinary men to the meatball. A to-scale log tape (15 to 1,000) stays pinned beside the figures. Each stop opens with a tape-yellow score tag, a display headline and a one-line verdict, then shows its lineup of flat figures. The desktop layout comes from the same structure: the pinned tape widens into a to-scale overview.",
  "summary": "Proposal: \"the tape you scroll down\". On a phone a 46 px sticky rail sits at the left. It is a yellow tailor's tape with log graduations from 15 to 1,000, drawn to scale. It marks every build as a coloured tick, shows the empty gaps hatched, draws Kouri's 25 as a dashed line, puts a chalk-blue dotted bracket over 40 to 200 (where the functional limits fall, position not yet worked out) and a chalk circle at 924. A box shows which stop you are reading, and tapping the tape jumps to a stop.\n\nThe stops scroll on the right, in this order:\n- Ordinary men (up to 25)\n- The natural … [1,333 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "styles": [
   {
    "name": "A. Studio wall (picked)",
    "tokens": "LIGHT :root { --paper:#EEF0EC; --sheet:#FAFAF7; --ink:#15181C; --ink-2:#4A525A; --ink-3:#5F6770; --rule:#C5CAC4; --rule-2:#E0E3DE; --tape:#EDBE2E; --tape-ink:#231D07; --chalk:#1F4FA6; --chalk-bg:#E3E9F5; --alarm:#B0321D; --alarm-bg:#F6E2DC; --wall:#DCDDE6; --floor:#ECECF0; --wall-line:#9C9DB0; --hatch:#B9BACB; --seam:rgba(255,255,255,.55); --g-everyday:#6C6F86; --g-natural:#3B6D7F; --g-enhanced:#7A2434; --g-strong:#232C5C; --g-comic:#A0650C; --g-rex:#4A3324; --g-ollie:#A4532B; fonts: Big Shoulders Display 800 (display), Public Sans (body), IBM Plex Mono (data) }  DARK (prefers-color-scheme guarded :root:not([data-theme=light]) and :root[data-theme=dark]) { --paper:#101215; --sheet:#171A1E; --ink:#E7E9E4; --ink-2:#B2B8BE; --ink-3:#868E96; --rule:#3A4047; --rule-2:#272B31; --tape:#DDB02C; --tape-ink:#1B1604; --chalk:#94B5FF; --chalk-bg:#2A3756; --alarm:#FF8C75; --alarm-bg:#3A1C16; --wall:#20222B; --floor:#2A2C36; --wall-line:#565970; --hatch:#3D4052; --seam:rgba(0,0,0,.45); --g-everyday:#A3A6BC; --g-natural:#6DB2C6; --g-enhanced:#D96A7E; --g-strong:#9198EC; --g-comic:#E3A63C; --g-rex:#A88063; --g-ollie:#E08A58; color-scheme:dark }",
    "figure_treatment": "Flat fills, one per group, taken from the turnarounds: studio slate for everyday men, steel teal for natural athletes, Ollie's maroon briefs for bodybuilders, Rex's navy briefs for strongmen and lifters, crest-glint gold (darkened for contrast) for comic characters, umber for Rex and russet for Ollie. Each figure stands in front of the blue-grey wall band, which has a floor strip and a dashed top-of-skull line. The edge marking is an ink stroke drawn under the fill, so only its outer half (about 1.9 px) shows. Arms and hands get a hairline seam in --seam so they read over the torso, the one interior detail, in keeping with the turnarounds' clean contours. Geometry (the widened template and the meatball) is drawn in chalk blue, outline only with a pale fill.",
    "why": "It keeps the Build Calculator's tailor's-sheet system (same paper, ink, tape, chalk and fonts), so the two pages read as one family, and brings in the art's own studio wall and floor. Group colour lets a skimming reader see that the giants are all comic characters and that Superman sits among ordinary men, while the edge still carries where each outline came from. It has both themes with checked contrast. A navy/maroon/gold/umber set is not one of the templated AI looks."
   },
   {
    "name": "B. Turnaround grey",
    "tokens": "Single look, used in both themes: --wall:#888898; --floor:#B9B9C2; --edge:#F4F4F6; --label:#F4F4F6; --g-everyday:#C9CAD6; --g-natural:#7FB4C4; --g-enhanced:#5E1422; --g-strong:#1A2148; --g-comic:#E6A33A; --g-rex:#3A281C; --g-ollie:#B9673C; the page around it keeps the sister tokens",
    "figure_treatment": "The whole chart sits on the render's #888898 studio grey with a light floor band. Edges are white so the marking shows on the mid-grey, and labels are white.",
    "why": "Closest to the art: the figures look as if they stand in the render. Rejected because white 11 px text on mid-grey is weak (about 3:1), it can't follow the light and dark themes, and the navy and maroon fills sink into the grey."
   },
   {
    "name": "C. Umber print",
    "tokens": "LIGHT: --paper:#EEF0EC; --fig:#3A2A20; --edge:#15181C; floor tiles --tile-everyday:#6C6F86; --tile-enhanced:#7A2434; --tile-strong:#232C5C; --tile-comic:#A0650C; --tile-duo:#E0A030 (crest gold). DARK: --paper:#101215; --fig:#D8C2AE; --edge:#E7E9E4; tiles as light",
    "figure_treatment": "Every figure, human, comic or duo, gets the same umber fill. The edge marking is the only visual difference between builds. Group shows only as a small coloured floor tile under the feet and a swatch by the name.",
    "why": "The strictest reading of 'builds differ only in their outline marking', and the marking is easiest to see because every fill matches. Held as the fallback if the reviewer finds group colours distracting. Rejected as the default because a skimming reader loses group membership at a glance."
   }
  ],
  "picked_style": "A. Studio wall. Family continuity with the Build Calculator (tokens, fonts, tape, status chips), the art's own wall and floor behind every lineup, and one fill per group from the turnaround palette, while the edge marking alone carries provenance. Note the choice for review: C (Umber print) is the fallback if group colour is judged to compete with the marking.",
  "layout_desktop": "At 1280 px (max-width 1240, 16 px gutters):\n- Tape strip across the top, as on the Build Calculator.\n- Masthead in two columns. Left: kicker, BUILD COMPARISON in Big Shoulders 800, and the 4-line verdict at 19 px semibold. Right: a 3-line score explainer, then a 2x3 edge key (Solid, Dashed, Dotted, No edge, Hatched, Top of skull) with drawn samples.\n- Sticky control bar: Height Same/Real, View Front/Side, and a \"Go to\" menu of stops on the right.\n- The scale grid: a 330 px sticky rail and the stops column.\n  - Rail (fills the viewport height): 34 px yellow log tape  … [996 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "layout_phone": "At 390 px (16 px gutters, no horizontal scroll, checked at scrollWidth 390):\n- Tape strip, a 2-line mock banner (mock only), kicker, h1, a 5-line verdict lede, a 3-line score explainer, and the 6-item edge key in two columns.\n- Sticky bar (52 px): \"Height Same | Real\" and \"View Front | Side\" as segmented controls. There is no Go-to menu on phone; the rail is the jump control.\n- Scale grid: a 46 px sticky rail and a content column of about 300 px.\n  - The rail sticks below the bar, height calc(100svh - 76px), min 520 px. It shows the tape with tick labels, a 14 px str … [952 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "axis": "One log axis, 15 to 1,000, drawn to scale only on the rail; the stops scroll in order but not to scale.\n\nOn the tape:\n- Labelled majors at 15, 20, 30, 50, 100, 200, 500 and 1000.\n- Minor ticks at 16 to 19, 25, 35, 40, 45, 60 to 90, 150, and 300 to 900.\n- Each band appears in its stop's tag as 'Score 25 to 32', so position never depends on reading the gaps between stops.\n- On desktop each build is a vertical range bar (low to high body fat) in its group lane; on phone, a tick at the geometric middle of its range.\n\nWhy not a broken axis: a break would hide the empty stretches the brief wants visibly empty. On the log tape the 188 to 924 stretch fills about 38% of the tape, and everything from 15 to 41 (about 45 of the 49 builds) fills about 24%. That proportion is the story. The stops give the crowded low end the room for figures that the to-scale tape can't.\n\nTapping the tape converts the tap's y back to a score and scrolls to that stop. Score ranges use an en dash and whole numbers below 100, rounded to 2 above 100, with no '≈'.",
  "gaps_and_limits": "Empty gaps:\n- They appear twice: as hatched rectangles across the lanes on the rail (labelled EMPTY on desktop), and as their own stops with the tag 'Score 41 to 57', the headline 'EMPTY', a verdict, a hatched box reading 'NO BUILDS HERE' and the line 'Step 2 adds figures drawn to order for this stretch, each labelled \"measured from art\".'\n- The last gap, 'EMPTY TO THE TOP' (188 to 924), gets a taller box.\n- Gap edges must be computed from the builds' range ends, never typed.\n\nNatural limit:\n- An anchor stop with no figures. Value rows read '25 · Kouri and others, … [1,275 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "marking_key": "Every figure is a flat fill; only its edge changes. The edge is an ink stroke 3.8 px wide drawn under the fill, so about 1.9 px shows outside the shape on the wall.\n- Solid (butt caps): the build's own number (measured, official or reported).\n- Dashed 6/3.5: filled in from a template build.\n- Dotted 0.1/4.2 (round caps): traced from art. Used for Rex and Ollie.\n- No edge: head, hands and feet, which use average ANSUR proportions on every human.\n\nMarkings vary along one figure. figure.js bandEdges splits the body outline into neck, shoulders, chest, waist, hips, thigh an … [1,366 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "controls": "One sticky bar at the top of the scale.\n- Height: Same | Real (segmented, aria-pressed). Same scales every figure so the top of the skull sits on the dashed wall line. Real uses one metres scale for the whole page (30 px/m on phone, 52 px/m on desktop) with faint 1 m, 2 m and 3 m lines on the wall, so humans appear about 55 px tall beside 3 m Rex and Ollie.\n- View: Front | Side. Side uses the template's side outline for humans and the traced side views for Rex and Ollie, tails hatched.\n- Go to: a menu of stops at 720 px and wider.\n- On phone: tap the tape to jump.\n\nProposed but not in the mock: tap a figure to open a details sheet with height, weight, body-fat range, each girth with its status and source link, and the figure drawn large so the edge marking reads.\n\nState lives in the page. Only bare #anchors are used, for deep links to stops. localStorage may remember the Height and View choice, wrapped in try/catch.",
  "tool_ui": "Section 'MEASURE A CHARACTER', separated from the scale by a heavy ink rule.\n- Verdict: 'Upload a model sheet. Get volume, mass, seven girths and the score.'\n- A chalk example note: 'Example loaded: Rex from duo.jpg, front view only. This is the tool's own test: it must land within the old methods' 2.52 to 2.60 m³.' The tool opens in a working state on its validation case, never on the turnarounds, which must not be measured in Step 1.\n\nSteps (numbered because they are a real sequence):\n1. The sheet: the image with dashed landmark lines (crest tip 3.048 m, top of skull, shou … [1,593 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "copy": "Masthead\n- Kicker: 'MUSCLE LEVEL, WITH HEIGHT TAKEN OUT'\n- H1: 'BUILD COMPARISON'\n- Lede: 'Ordinary men score about 22. The biggest bodybuilders reach about 40. Rex scores about 160 and Ollie about 180. The scale stops at 924: a solid ball of muscle.'\n- Score line: 'The score is fat-free mass ÷ height³ × 1.8. That is the FFMI (fat-free kg ÷ height in m²) a body would have at 1.80 m tall. Body fat is mostly unknown, so each score is a range.'\n- Edge key:\n  - 'Solid: its own measurement'\n  - 'Dashed: filled in from a template build'\n  - 'Dotted: traced from art'\n  - 'No edge: … [2,817 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
  "mockup_files": [
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/mock.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/390-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/390-light-first.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/390-dark-first.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/1280-light-first.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/1280-dark-first.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/styles.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/styles-1280-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/styles-1280-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/styles-390-light.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/z-real.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/z-duo-side-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/z-duo-side-phone.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/z-tool-dark.png",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/mock.src.html",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/gen.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/build.js",
   "/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/reader/shots.js"
  ],
  "risks": "1. The meatball claim. The brief says 'a figure can't hold more volume than a ball as tall as itself'. That is false as geometry: a cylinder as tall holds 1.5 times as much and a cube about 1.9 times. The page must call 924 a chosen end point, as the mock does. Owner decision needed.\n\n2. Only the rail is to scale; the stops are not. A reader could take the spacing between stops as distance. The mitigations are a numeric tag on every stop and the current-stop box on the rail.\n\n3. The edge marking is subtle at phone size (86 px figures at 1x pixel density). Solid against dashed r … [2,904 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
 }
]

JUDGES:
[
 {
  "scores": [
   {
    "angle": "Scientific instrument: slide-rule log ruler hero + forest-plot ranking of all 49 builds (instrument/)",
    "accuracy_honesty": 6.5,
    "readability": 6,
    "phone": 6,
    "distinctiveness": 7,
    "feasibility": 7,
    "best_ideas": "1. The forest-plot ranking is the most honest uncertainty display of the three. Every build gets its own range bar on one shared log track. Hatched means body fat assumed, solid means measured. The copy says \"Bars that overlap can't be ranked against each other\". Graft this as the 'all builds' view whatever layout wins.\n2. A status-bordered box around every number in a row (height, weight, fat range), so status sits on the number itself, not in a footnote.\n3. A red 'measured humans end' rule, plus an EXTRAPOLATED chip on every row beyond it. Only this proposal labels ext … [995 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
    "problems": "1. False claim, repeated in several places. The lede says 'No body can score above 924'. The ruler says 'past 924: impossible' and shades the stretch. The meatball row says 'Nothing can score higher.' A cylinder as tall holds 1.5x a ball's volume and a cube about 1.9x, so all of this is wrong. Proposals 2 and 3 caught it; this one did not.\n2. Hero labels may not match the drawn shapes. The template man is labelled with exact scores 48, 96, 192 and 384, but widen() grows each part by (S/24)^(e/2) with made-up exponents (WIDEN_E). Nothing checks that the drawn volume matches th … [1,345 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
   },
   {
    "angle": "Police lineup / museum specimen parade: figures first in score order on a studio wall, gap tiles of hatched floor, to-scale log strip below (lineup/)",
    "accuracy_honesty": 6,
    "readability": 8,
    "phone": 7,
    "distinctiveness": 8,
    "feasibility": 7,
    "best_ideas": "1. It caught the brief's false meatball claim and words it honestly: 'The scale ends at 924', never 'no body can pass 924'. It also gives the cylinder arithmetic (about 1,390).\n2. The figures-first lineup on the turnarounds' blue-grey wall, with ANSUR landmark guide lines, is the most immediate read of 'only the build differs'. The meatball is a disc as tall as the drawn figure, with a drafting centre cross.\n3. The to-scale strip is honest: per-build range bars greedy-packed in lanes, labelled hatched EMPTY bands, a dashed 'three body limits fall somewhere in 40–200 (not yet worked out)' bracket, and hollow middle dots for overstated comics. It also glosses the log scale in plain words: 'each step to the right multiplies the score'.\n4. The drawer caption states the per-region marking in words ('Solid edge: chest, waist, flexed arm and calf from his reported girths. Dashed: thigh, forearm and neck…'), so the marking doesn't depend on seeing a 2 px dash pattern.\n5. Planned for the build: once computed, each functional limit becomes a construction-line ghost figure (outline only, no fill) at its rank in the lineup.",
    "problems": "1. The spacing mixes two signals. Figures are rank-ordered with no scale, but gap tiles are 'log-proportional with a minimum', and the last gap stretches to fill its row. In the mock the 189–924 floor is about 7x the width of the 81–140 tile, against a true log ratio of about 2.9x. Meanwhile 39–50 and 81–140 render at nearly equal widths. A reader cannot tell which widths carry meaning. Make all tiles equal and let only the strip carry proportion.\n2. A lineup in 'score order' implies a ranking, yet the ranges overlap heavily (Reeves 24–27, Army 95th 26–29, Batman 25–29). No c … [1,406 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
   },
   {
    "angle": "Phone-first scroll: a sticky to-scale log tape rail beside score-band 'stops' with verdict headlines and lineups (reader/)",
    "accuracy_honesty": 7,
    "readability": 8,
    "phone": 8,
    "distinctiveness": 7,
    "feasibility": 6.5,
    "best_ideas": "1. The functional limits are the most honest of the three. A '?' badge stands in place of any score, the stop is tagged 'Score 40 to 200?', and 'Each \"?\" becomes a score once the geometry is run.' The widened template is real geometry: widths x1, x1.5, x2 and x2.6 give 23, 51, 90 and 152 (23 × f²), so the labels and drawings agree.\n2. The tool opens on its own validation case (Rex from duo.jpg, front only, which must land within 2.52 to 2.60 m³), never on the turnarounds.\n   - The height field says 'Height to top of skull' with the hint 'Not crest or horn tips.'\n   - Ch … [1,059 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
    "problems": "1. The page never tells the reader the rail is logarithmic. 'Log' appears only in code and aria-labels; no visible text says so. On the rail, 15–41 takes about 24% of the height and 188–924 about 38%. A general reader will read it as linear and think the empty top is about 750 points of nothing at equal weight. Add a one-line gloss like the instrument's 'equal steps are equal ratios'.\n2. The stop headlines name a group but hold others. 'ORDINARY MEN' (score up to 25) contains Steve Reeves, Chappell's natural pros, the Thai elite bodybuilders, Fry's non-elite bodybuilders and  … [1,698 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
   }
  ],
  "recommendation": "Build on the reader proposal (C, the scroll-down tape), and graft in the instrument's ranking and labelling devices plus the lineup's strip and wording.\n\nWhy C: it is the only proposal whose limits use '?' and whose widened template is geometrically consistent with its labels (score = 23 × f²). Its tool honours the Step 1 rule: it validates on duo.jpg, not the turnarounds, and labels height as skull-top. Its stop-plus-verdict structure suits a general reader with ADHD on a phone. Its outlines are already real geometry.\n\nMust-fix before build, confirmed in the screensho … [2,332 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
 },
 {
  "scores": [
   {
    "angle": "Scientific instrument (slide-rule hero + 49-row forest plot)",
    "accuracy_honesty": 6,
    "readability": 5,
    "phone": 5,
    "distinctiveness": 7,
    "feasibility": 8,
    "best_ideas": "1. Sticky score axis over the ranking. It works at 390 px, and its hatched voids plus the 'EXTRAPOLATED →' mark stay visible while you scroll (checked by scrolling to y=9900).\n2. The 'Zoom 15 to 50' option. On a phone this is the only thing that makes the human bars readable as ranges (390-modes.png). Without it, the bars shrink to a diamond.\n3. Gap rows placed in score order ('NOTHING FROM 90 TO 151' with a hatched block on the track). They make the voids part of the list, not a footnote.\n4. The detail panel lists every girth with the outline it produced ('91 cm · solid outline', 'unknown · dotted: template'), followed by 'What this ignores'. It is the clearest provenance explanation of the three.\n5. Measuring-bench checks and results: PASS/CHECK chips with numbers, a ± column, a bold top three rows (volume, mass, score), and the duo.jpg validation line.\n6. The worked table in 'How the score works' (Army median / Coleman / Rex: plain FFMI next to score), plus 'Every 1% of height moves the score about 3%'.",
    "problems": "1. False claim. The verdict says 'No body can score above 924', and the meatball row says 'Nothing can score higher.' As the other two proposals note, a cylinder of the same height holds 1.5 times the volume of a ball. The owner would fail this.\n2. Small text on the phone. A computed-style pass at 390 px found about 1,350 characters at 9.5 px, 50 at 7 px and the rest of the hero at 9–10 px. That covers the ruler numbers, lane names, Kouri/extrapolation/frame labels, row 'SCORE' and 'estimate' chips, and the bench guide labels (7–7.8 px).\n3. Lines run through labels in the he … [1,136 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
   },
   {
    "angle": "Police lineup / museum-specimen parade",
    "accuracy_honesty": 7,
    "readability": 7,
    "phone": 7,
    "distinctiveness": 8,
    "feasibility": 6,
    "best_ideas": "1. Best five-second test of the three. The first 844 px holds the verdict (with 160/180 and an 'all estimates' chip), the three controls, the lineup verdict and the first row of figures. Rex and Ollie are about 2.4 screens down (y≈2,000), so a phone reader sees the point quickly.\n2. Gap tiles of bare hatched floor inside the lineup, with plates such as '81–140 / Empty. No build measured here yet.' The final '189–924' floor runs out to the meatball disc. This is the most physical way to show the voids.\n3. The drawer at H=230, with a caption that says in words which parts are solid and which are dashed. This is where the per-part marking can actually be read on a phone.\n4. It calls 924 a chosen end ('The scale ends at 924') and gives the cylinder argument. That is honest.\n5. Wall rules at ANSUR landmark heights (skull, waist, knee) behind every figure. With them, same-height figures read as comparable.\n6. The limits strip of four template figures, with the deciding body part outlined in chalk blue. It shows each functional limit as a picture, not a bracket.",
    "problems": "1. The mock's controls do nothing. Clicking 'Real heights', 'All 49' or 'Side' at 390 px leaves the page height (8,075 px) and its markup unchanged. The 49-build phone lineup (their own estimate is about 3,000 px) and the side and real-height modes are unproven.\n2. 'Key 20' is the default, so 29 builds are hidden on arrival. To a critic this reads as cherry-picking unless the selection rule sits right beside the toggle, and the mock does not show that rule.\n3. The full-bleed log tape at the top has no builds on it and sits directly above a lineup that is not to scale. That invites the reader to read figure positions against the tape. The sub-line saying 'not to scale' is 12 px grey text.\n4. Plate type is small on the phone: names 11 px, 'FFMI x–y' 9.5 px, and the overstated flags ('▲ DENSER TISSUE CLAIMED') 9.5 px in red capitals. The status chips are 8.5 px abbreviations (EST/DER/ART), so the reader has to look them up in the key.\n5. Bench sheet guide labels render at 4.1 px, which is unreadable. The tool's 'HEIGHT' field defaults to 3.048 m, which is crest height. That contradicts the canon that scores use height to the top of the skull.\n6. On the phone, the 81–140 gap tile is narrower than one figure cell. It reads as a small gap even though it is as large as everyday-to-Coleman.\n7. The limit figures use '≈ 60 / ≈ 95 / ≈ 150', which look like findings despite their MOCK chips. The widened template looks obese."
   },
   {
    "angle": "Phone-first scroll tape with stops and a pinned to-scale rail",
    "accuracy_honesty": 8,
    "readability": 8,
    "phone": 8,
    "distinctiveness": 7,
    "feasibility": 7,
    "best_ideas": "1. Every stop opens with a yellow score tag ('SCORE 41 TO 57'), a display headline and a one-line verdict ('Nothing measured scores 41 to 57. No human and no comic character.'). That is the right shape for an ADHD reader.\n2. It has the most legible phone type of the three. Plate scores are 17 px, chips use full words (ESTIMATE, DERIVED), and FFMI and the overstated notes are 11–11.5 px. Only the rail numbers (9.5 px) and the bench sheet labels (7.8 px) fall below 11 px.\n3. A sticky to-scale rail with a current-stop box. While scrolling at Rex's stop it shows the box sitting at 150–190 on the log tape (v-reader-dpr2.png). Proportion stays visible while the figures get room.\n4. Gap edges and comparison sentences are computed, not typed ('as big as from an ordinary man to Ronnie Coleman', 'about twice the Hulk').\n5. The meatball stop calls 924 'a chosen end point, not a law of geometry' and shows the formula. The natural-limit stop has status-chipped anchor rows and 'The top of one sample, not a ceiling'.\n6. Real-height mode adds 1 m, 2 m and 3 m wall lines (z-real-top.png). The tool opens on its own validation case (duo.jpg) rather than on the turnarounds.",
    "problems": "1. 'Where does Rex sit?' needs a long scroll. His figures are at y≈7,555 of 11,880 (about 9 screens). On the phone the rail marks are unlabelled ticks in a 14 px strip. There is no Go-to menu below 720 px, and nothing on the page says the tape can be tapped to jump, so that affordance is hidden.\n2. The first phone screen spends about 250 px on a 6-item edge key before the reader has seen a figure. The key swatches use four different group fills, so the fill colour looks as if it carries the edge meaning.\n3. The 46 px rail takes width from 3-up figures at 86 px, where the dashed and dotted edges are hard to tell apart at 1x. Rail labels are 9.5 px.\n4. The page carries about 1.1 MB of inlined figure data. In headless Chromium, a viewport scrolled 1.2 s after load painted blank, and it rendered after about 3 s. That needs Ramer-Douglas-Peucker simplification before shipping, as the proposal itself notes.\n5. The 'GEOMETRY' chip is outside the agreed status vocabulary. Gap stops are equal-height boxes, so their size shows only on the rail.\n6. The sticky rail depends on 100svh inside the claude.ai frame, which is unverified."
   }
  ],
  "recommendation": "Build on the reader proposal (phone-first stops with a pinned to-scale rail). It is the only one where a phone reader with ADHD gets a one-line verdict at every step, readable type (nothing under 11 px except the rail numbers), full-word status chips, and correct copy about 924.\n\nFix its two phone weaknesses first:\n1. Put \"Jump to Rex and Ollie\" in the lede, label the duo's mark on the rail, and add a visible \"tap the tape to jump\" hint or a phone Go-to menu.\n2. Move the 6-item edge key below the first lineup, or shrink it to one line with a \"how to read a figure\ … [1,516 more characters on this line; the full prompt is in prompts/a61d1ed3f53e3f5da.txt]
 }
]
```

</details>


- `TaskUpdate` #4 status=in_progress

**Claude · 2026-10-11 03:20:11 UTC**

While both workflows run, I'm writing the measuring tool's core (segmentation, view split, contours, slicing) in `src/measure.js`.


- `Write` /home/user/rex-strength-lab/build-comparison/src/measure.js
- `Bash` Run segmentation on both turnarounds and save overlays: `cd /home/user/rex-strength-lab/build-comparison && cat > /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/segtest.js...` (+15 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/rex_mask.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/ollie_mask.png
- `Bash` Print luminance map near the feet to see shadows: `node -e "` (+7 lines)
- `Bash` Switch darkness test to a ratio and rerun segmentation: `python3 - <<'EOF'` (+9 lines)
- `Bash` Gridded crops of Rex's tail in front and side views: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad && python3 - <<'EOF'` (+15 lines)

**Claude · 2026-10-11 03:22:09 UTC**

Segmentation works on both turnarounds (view heights agree within 1.4% and 1.6%). Now marking Rex's tail so it can be drawn as excluded.


- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/rex_front_tail.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/rex_side_tail.png
- `Bash` Gridded crops of Ollie's side tail and heads: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad && python3 - <<'EOF'` (+16 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/ollie_side_tail.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/ollie_front_head.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/ollie_side_head.png
- `Write` /home/user/rex-strength-lab/build-comparison/tools/trace_turnarounds.js
- `Bash` Trace turnaround outlines and write overlays: `cd /home/user/rex-strength-lab/build-comparison && time node tools/trace_turnarounds.js --overlay /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56b...`
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/trace/rex-trace.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/trace/ollie-trace.png

**Claude · 2026-10-11 03:23:56 UTC**

Tails traced and marked (Rex front and side, Ollie side). Next: the duo.jpg validation, porting the old checker's front-only method onto the new slicer.


- `Bash` Add front-only volume mode to measure.js: `python3 - <<'EOF'` (+47 lines)
- `Bash` Read old per-part volumes for comparison: `cd /home/user/rex-strength-lab/history/scratchpad/mass && cat checker/A_recheck.json && python3 -c "` (+1 lines)
- `Bash` Write duo validation config from old regions: `cd /home/user/rex-strength-lab/build-comparison && python3 - <<'EOF'` (+50 lines)
- `Bash` Run front-only validation on duo.jpg with several thresholds: `cat > /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/val.js <<'EOF'` (+12 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/ov.png
- `Bash` List enclosed holes in the duo mask: `node -e "` (+9 lines)

**Claude · 2026-10-11 03:25:38 UTC**

The duo mask needs a better local background (grey sheen on Rex's black pants reads as a hole). Adding a push-pull background model like the old method used.


- `Bash` Add push-pull refinement and rerun duo validation: `python3 - <<'EOF'` (+107 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/ov.png
- `Bash` Fill enclosed holes before refinement and rerun: `python3 - <<'EOF'` (+16 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/ov.png
- `Bash` Rewrite refinement to keep real windows, rerun validation: `python3 - <<'EOF'` (+63 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/ov.png
- `Bash` Inspect hole colours against painted background: `node -e "` (+14 lines)
- `Bash` Separate hole-fill threshold and rerun validation: `python3 - <<'EOF'` (+10 lines)
- `Bash` Find how old regions were made exclusive: `cd /home/user/rex-strength-lab/history/scratchpad/mass && grep -n "pkl\|pouch\|order\|assigned\|&~\|& ~" *.py | head -30`
- `Bash` Read old region assignment code: `sed -n 1,55p volume.py`
- `Bash` Support excluded polygons and compare pixel counts with old regions: `cd /home/user/rex-strength-lab/build-comparison && python3 - <<'EOF'` (+25 lines)

**Claude · 2026-10-11 03:27:49 UTC**

Validation reproduces Rex at 2.545 m³ (old methods' spread: 2.52–2.60; checker 2.553). Committing progress, then checking on the workflows.


- `Bash` Commit and push work in progress: `cd /home/user/rex-strength-lab && git add build-comparison && git commit -q -m "Build Comparison: measuring-tool core, ANSUR outline template, turnaround tra...` (+3 lines)


> **Commit** `72782d9` · 2026-10-11 03:27:52 UTC · Build Comparison: measuring-tool core, ANSUR outline template, turnaround tracing, duo.jpg validation config (work in progress)  [rex-strength-lab]


- `Bash` Check workflow progress journals: `ls /root/.claude/projects/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/subagents/workflows/*/ 2>/dev/null | head -30; for d in /root/.cla...`

**Claude · 2026-10-11 03:31:02 UTC**

Now writing the chart model (`src/model.js`): scores and ranges, human silhouettes drawn from ANSUR proportions and each build's girths, and the duo outlines.


- `Bash` Fix unit note on the shoulder-girth fit: `cd /home/user/rex-strength-lab/build-comparison && sed -i "s/form: 'ln(shouldercircumference) = b0 + b1 ln(chestcircumference) + b2 ln(bicepscircumferencefle...`
- `Write` /home/user/rex-strength-lab/build-comparison/src/figure.js
- `Bash` Render a preview of human and duo silhouettes: `python3 - <<'EOF'` (+32 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/fig/p.png
- `Bash` Rebuild the human outline as one smooth body polygon with marked bands: `cd /home/user/rex-strength-lab/build-comparison && python3 - <<'EOF'` (+54 lines)
- `Bash` Rework side view and re-render preview: `python3 - <<'EOF'` (+78 lines)

**Claude · 2026-10-11 03:33:42 UTC**

Iterating on the silhouette geometry — rendering previews and fixing shape problems.


- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/fig/p.png
- `Bash` Inspect inner leg outline points: `node -e "` (+8 lines)
- `Bash` Render side-view preview: `node /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/fig/preview.js ansur2_m_p50,ronnie_coleman,hulk_savage side /t...`
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/fig/side.png

**Claude · 2026-10-11 03:34:20 UTC**

Silhouettes look right now (Rex's side view needs flipping to face the same way as the others; noted). Next: the full model-sheet measurement (front + side + back) in `measure.js`.


- `Bash` List current functions in measure.js: `grep -n "^  function\|^  var\|return {" src/measure.js | head -50`
- `Bash` Add model-sheet measurement with landmarks, checks, volume and girths: `python3 - <<'EOF'` (+313 lines)
- `Bash` Run sheet measurement on both turnarounds: `cat > /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/sheettest.js <<'EOF'` (+22 lines)
- `Bash` Debug crotch detection on Rex front view: `node -e "` (+5 lines)
- `Bash` Fix neck and armpit detection; rerun turnaround sheet test: `python3 - <<'EOF'` (+45 lines)
- `Bash` Locate the old neck block: `grep -n "Neck: the narrowest" -A 6 src/measure.js`
- `Bash` Apply neck/armpit fixes and rerun: `python3 - <<'EOF'` (+37 lines)
- `Bash` Track arm gap upward from the hands; add Ollie back tail; rerun: `python3 - <<'EOF'` (+27 lines)
- `Bash` Detect guide lines, chest by proportion, row overrides: `python3 - <<'EOF'` (+46 lines)
- `Bash` Use guide lines and height bar in measureSheet; rerun: `python3 - <<'EOF'` (+31 lines)
- `Bash` Check workflow progress: `for d in /root/.claude/projects/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/subagents/workflows/*/; do echo $d; wc -l < $d/journal.jsonl...`

**Claude · 2026-10-11 03:39:57 UTC**

Workflows still running (research is into its verify stage). Continuing on the measuring tool: synthetic test sheets drawn from the human template, so the tool can be checked against known shapes.


- `Bash` Stricter guide-line detection; add sheet renderer to figure.js: `python3 - <<'EOF'` (+107 lines)
- `Bash` Measure a synthetic figure with an exact volume: `python3 - <<'EOF'` (+43 lines)
- `Bash` Compare detected landmarks for checks; inspect guide-line rows: `python3 - <<'EOF'` (+18 lines)
- `Bash` Paint guide lines out before refinement; rerun synthetic tests: `python3 - <<'EOF'` (+30 lines)
- `Bash` Check workflows; commit and push progress: `for d in /root/.claude/projects/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/subagents/workflows/*/; do echo $d; wc -l < $d/journal.jsonl...` (+3 lines)


> **Commit** `0a8cfec` · 2026-10-11 03:43:03 UTC · Build Comparison: model-sheet measurement (landmarks, checks, guide lines), silhouettes, sheet renderer (work in progress)  [rex-strength-lab]


- `Bash` Inspect workflow journals for progress: `cd /root/.claude/projects/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/subagents/workflows/ && for f in */journal.jsonl; do echo == $f; p...` (+4 lines)
- `Bash` Check CPU count and load: `nproc; cat /proc/meminfo | head -2; uptime`
- `Bash` Extract finished research results from agent logs: `cd /root/.claude/projects/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/subagents/workflows/wf_94de1f40-a68 && python3 - <<'EOF'` (+15 lines)
- `Bash` Inspect agent meta format: `cd /root/.claude/projects/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/subagents/workflows/wf_94de1f40-a68 && cat agent-a1d6edb3ef9a3e139...` (+14 lines)
- `Bash` Extract and summarize finished research topics: `mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/wfout && cat > /tmp/claude-0/-home-user-rex-strength-lab/9...` (+23 lines)
- `Read` /root/.claude/projects/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/tool-results/bog4071mk.txt
- `Write` /home/user/rex-strength-lab/build-comparison/src/model.js
- `Write` /home/user/rex-strength-lab/build-comparison/build.js
- `Bash` Check which workflow agents have finished: `python3 /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/extract.py; for d in /root/.claude/projects/-home-user-rex-...` (+5 lines)
- `Bash` Read the lineup design proposal: `python3 -c "` (+5 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup/mock-1280-light.png
- `Bash` Find lines to parameterize in figure.js: `cd /home/user/rex-strength-lab/build-comparison && grep -n "var legX = Math.max(hj, hipHalf - d.thighR);\|var sj = \[\|var armDeg\|front.push({ name: s > 0 ?...`
- `Bash` Add functional-limit geometry and probe it on templates: `python3 - <<'EOF'` (+122 lines)
- `Bash` Fix elbow flexion loop, add bone-based arm criterion, rerun: `python3 - <<'EOF'` (+45 lines)
- `Bash` Elbow model with a squash allowance; probe values: `python3 - <<'EOF'` (+45 lines)
- `Bash` Elbow model with a fixed crease length; probe values: `python3 - <<'EOF'` (+16 lines)
- `Bash` Check workflow agents status: `python3 /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/extract.py`

**Claude · 2026-10-11 03:48:39 UTC**

Writing the per-build chart settings (body-fat class per build, score heights and excluded tails for Rex and Ollie) while the last research topics finish.


- `Bash` List male builds with body fat, waist, ranges: `cd /home/user/rex-strength-lab && node -e "` (+3 lines)
- `Bash` Write per-build settings and body-fat classes: `cd /home/user/rex-strength-lab/build-comparison && python3 - <<'EOF'` (+46 lines)
- `Bash` Compute scores and gaps for all builds: `python3 - <<'EOF'` (+23 lines)

**Claude · 2026-10-11 03:49:39 UTC**

Scores compute cleanly (gaps fall at about 42–59, 88–126 and 216–924). Now writing the target-outline exporter for the collaborator's gap-filler figures.


- `Bash` Write and run the target-outline exporter: `python3 - <<'EOF'` (+130 lines)
- `Bash` Add full-size correction; make a thumbnail of the target sheet: `python3 - <<'EOF'` (+15 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/targets/thumb.png
- `Bash` Check workflows; commit and push: `python3 /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/extract.py; cd /home/user/rex-strength-lab && git add -A bu...` (+3 lines)


> **Commit** `51a3abb` · 2026-10-11 03:51:23 UTC · Build Comparison: score model, settings, functional-limit geometry, target-outline exporter (work in progress)  [rex-strength-lab]


- `Bash` Locate outline and side-view station code: `cd /home/user/rex-strength-lab/build-comparison && grep -n "var outer = spline(\[" -A 4 src/figure.js | head -8 && grep -n "var stations = \[" -A 12 src/figu...`
- `Bash` Smooth the trapezius and side-view head; re-render: `python3 - <<'EOF'` (+28 lines)

**Claude · 2026-10-11 03:51:58 UTC**

Refining the human silhouettes' shape (neck, shoulders, side profile) while the workflows run.


- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/fig/f2.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/fig/s2.png
- `Bash` Flip Rex's side view to face right; fix neck top; re-render: `python3 - <<'EOF'` (+20 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/fig/s3.png
- `Write` /home/user/rex-strength-lab/build-comparison/test/duo.js
- `Bash` Run the duo.jpg validation test with Chromium decoding: `time node test/duo.js`
- `Bash` Check workflow agents status: `sleep 1; python3 /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/extract.py`

**Claude · 2026-10-11 03:52:57 UTC**

The duo.jpg validation test passes under Chromium decoding (2.545 m³). Peeking at the still-running functional-limits research for its findings so far.


- `Bash` Read partial notes from the functional-limits researcher: `cd /root/.claude/projects/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/subagents/workflows/wf_94de1f40-a68 && python3 - <<'EOF'` (+11 lines)
- `Bash` Look at the lineup mockup source: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup && ls -la && wc -c mock.src.html build.js && head ...`
- `Bash` Read specific body-fat research facts: `python3 -c "` (+6 lines)
- `Bash` Use the researched everyday range for Bruce Banner: `cd /home/user/rex-strength-lab/build-comparison && python3 - <<'EOF'` (+6 lines)
- `Write` /home/user/rex-strength-lab/build-comparison/test/test.js
- `Bash` Run the model and tool tests: `time node test/test.js 2>&1 | tail -30`

**Claude · 2026-10-11 03:54:49 UTC**

All 18 model and tool tests pass. Committing, then checking the workflows.


- `Bash` Commit tests; check workflow status: `cd /home/user/rex-strength-lab && git add -A build-comparison && git commit -q -m "Build Comparison: tests for the model, figures and measuring tool; duo.jpg...` (+3 lines)


> **Commit** `3bce635` · 2026-10-11 03:54:53 UTC · Build Comparison: tests for the model, figures and measuring tool; duo.jpg validation test (2.545 m^3)  [rex-strength-lab]


- `Bash` Read the instrument design proposal: `python3 -c "` (+6 lines)
- `Bash` Compute arm and thigh limit scores on several templates: `cd /home/user/rex-strength-lab/build-comparison && cat > /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/limits2.js...` (+16 lines)
- `Bash` Tabulate arm clearance angles by score: `cat >> /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/limits2.js <<'EOF'` (+10 lines)
- `Bash` Read the rest of the lineup mock CSS: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/lineup && sed -n '/\.cell.gap.last/,/<\/style>/p' mock.sr...`
- `Bash` Add Build Comparison steps to CI: `python3 - <<'EOF'` (+31 lines)

**Claude · 2026-10-11 03:56:03 UTC**

CI now builds and tests the new project too. Checking the workflows.


- `Bash` Check workflow progress: `python3 /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/extract.py; for d in /root/.claude/projects/-home-user-rex-...`
- `Bash` Read the natural-limit anchor facts in detail: `python3 -c "` (+6 lines)
- `Bash` Look at the calculator's chip conventions: `cd /home/user/rex-strength-lab/build-calculator && grep -n "chip" src/app.html | head -30 && grep -n "function statusChip\|const STATUS\|status_vocabulary" s...`
- `Bash` Read helper functions in the calculator page script: `sed -n 520,600p src/app.html && sed -n 990,1007p src/app.html && sed -n 1036,1075p src/app.html`

**Claude · 2026-10-11 03:57:09 UTC**

Writing the page itself now (`src/app.html`): masthead, lineup, to-scale strip, limits, score explainer, measuring tool, sources.


- `Bash` Add natural-limit and enhanced anchors to settings: `cd /home/user/rex-strength-lab/build-comparison && python3 - <<'EOF'` (+23 lines)
- `Bash` Check workflow agents: `python3 /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/extract.py`
- `Write` /home/user/rex-strength-lab/build-comparison/src/app.html
- `Bash` Stage research results, add page text, compile facts.json: `mkdir -p /home/user/rex-strength-lab/build-comparison/research/round1 && cp /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/sc...` (+110 lines)

**Claude · 2026-10-11 04:03:04 UTC**

Now wiring `build.js` to assemble the page data, then a first build and screenshot.


- `Bash` Build the page and take first screenshots: `python3 - <<'EOF'` (+43 lines)
- `TaskUpdate` #5 status=in_progress
- `Bash` Split the desktop screenshot into views: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page && python3 -c "` (+5 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/c0.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/c1.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/c2.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/c3.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/c4.png

**Claude · 2026-10-11 04:04:13 UTC**

The full page renders with no console errors. Fixing a 22 px horizontal overflow at phone width next.


- `Bash` Find elements overflowing at 390 px: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page && node -e "` (+5 lines)
- `Bash` Fix phone overflow, gap placement, auto target: `cd /home/user/rex-strength-lab/build-comparison && python3 - <<'EOF'` (+15 lines)
- `Bash` View the girth section of measureSheet: `sed -n 800,830p src/measure.js`
- `Bash` Apply ANSUR trunk shape factors to girths; add tests: `python3 - <<'EOF'` (+41 lines)
- `Bash` Add short names; rebuild; phone screenshots: `python3 - <<'EOF'` (+21 lines)
- `Bash` Crop phone screenshot; check workflows: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page && python3 -c "` (+6 lines)

**Claude · 2026-10-11 04:06:06 UTC**

The page now fits phones (no horizontal scroll). Checking the phone layout visually.


- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/m0.png
- `Bash` Commit; probe elbow flexion with larger crease fractions: `git add -A build-comparison .github && git commit -q -m "Build Comparison: first full page (lineup, drawer, key, to-scale strip, score and natural-limit card...` (+14 lines)


> **Commit** `745ba33` · 2026-10-11 04:06:25 UTC · Build Comparison: first full page (lineup, drawer, key, to-scale strip, score and natural-limit cards, measuring tool, sources), facts compile, CI steps  [rex-strength-lab]


- `Write` /home/user/rex-strength-lab/build-comparison/tools/compute_limits.js
- `Bash` Add provisional limit definitions and compute limits: `python3 - <<'EOF'` (+19 lines)
- `Bash` Calibrate the elbow crease once on the median man; recompute: `python3 - <<'EOF'` (+27 lines)
- `Bash` Rebuild with limits; screenshot; check workflows: `node build.js && node /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/shot.js '[[1280,900,"light"]]' && cd /tm...` (+4 lines)

**Claude · 2026-10-11 04:07:59 UTC**

The functional-limits research just finished, and the design judges are scoring now. Reading the limits research to replace my provisional definitions.


- `Bash` Read the functional-limits research: `python3 -c "` (+5 lines)
- `Bash` Add the researched arm rest-angle test; probe it: `cd /home/user/rex-strength-lab/build-comparison && python3 - <<'EOF'` (+45 lines)
- `Bash` Use researched shoulder-joint offsets; re-probe the arm angle: `python3 - <<'EOF'` (+20 lines)
- `Bash` Find uses of the thigh radius in figure.js: `grep -n "d.thighR" src/figure.js | head -30`
- `Bash` Narrow the thigh tops to the hip line; re-probe; run tests: `python3 - <<'EOF'` (+38 lines)
- `Bash` Skip the deltoid zone in the arm test; re-probe: `python3 - <<'EOF'` (+39 lines)
- `Bash` Debug Coleman's arm clearance: `node -e "` (+15 lines)
- `Bash` Measure the deltoid exclusion along the arm axis; re-probe: `python3 - <<'EOF'` (+21 lines)
- `Bash` Apply the researched limit definitions and recompute: `python3 - <<'EOF'` (+36 lines)
- `Bash` Add the pessimistic face bound; recompute; check workflows: `python3 - <<'EOF'` (+23 lines)
- `Bash` Rebuild and screenshot with limits: `node build.js && node /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/shot.js '[[1280,900,"light"]]' && cd /tm...` (+4 lines)

**Claude · 2026-10-11 04:12:13 UTC**

The three limits are now computed from the researched definitions (arms forced out ~42, thighs closed ~49, hands lose the face ~217, each with a band). Checking how they render.


- `Bash` Screenshot the limits section and a gap row: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page && node -e "` (+8 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/limits.png
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/gap.png
- `Bash` Fix the neck top; draw limit figures with rested arms; rebuild: `cd /home/user/rex-strength-lab/build-comparison && grep -n "\[d.neckR, y.chin + 0.02 \* H\], \[d.neckR, y.chin - 0.004 \* H\]" src/figure.js && python3 - <<'...` (+24 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/limits.png


> **Commit** `967144b` · 2026-10-11 04:14:10 UTC · Build Comparison: functional limits from the researched definitions (arm rest angle, thigh contact, elbow flexion), thigh tops held to the hip line, shoulder joint per research  [rex-strength-lab]

