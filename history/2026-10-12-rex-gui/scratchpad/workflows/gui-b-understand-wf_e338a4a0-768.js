export const meta = {
  name: 'gui-b-understand',
  description: 'Map engine.js and app.html for the four new powers (BRIEF-gui.md section 5)',
  phases: [
    { title: 'Map', detail: 'one reader per power or subsystem, read-only' },
    { title: 'Critic', detail: 'completeness check of the maps' },
  ],
}

const MAP = {
  type: 'object',
  properties: {
    area: { type: 'string' },
    summary: { type: 'string', description: 'How this area works today, in detail, with the physics and formulas, 300-900 words' },
    sites: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          file: { type: 'string' },
          line: { type: 'integer' },
          symbol: { type: 'string' },
          today: { type: 'string', description: 'what the code does now, precisely' },
          change: { type: 'string', description: 'what section 5 needs here, or "none: why"' },
          risk: { type: 'string', description: 'what could break, including the all-powers-off equivalence' },
        },
        required: ['file', 'line', 'symbol', 'today', 'change', 'risk'],
      },
    },
    questions: { type: 'array', items: { type: 'string' }, description: 'places where the brief is unclear or the code differs from what it describes; give your recommended decision for each' },
    tests: { type: 'array', items: { type: 'string' }, description: 'concrete engine or page checks to add, with the cases and expected outcomes' },
  },
  required: ['area', 'summary', 'sites', 'questions', 'tests'],
}

const COMMON = `You are mapping code for BRIEF-gui.md section 5 (four new powers) in /home/user/rex-strength-lab/rex-strength-lab. Read rex-strength-lab/BRIEF-gui.md section 5 in full first, and CLAUDE.md's canon ("Default powers", "Absorption", "Restraint"). The engine is src/engine.js (window.DinoPhys / module.exports); the page is src/app.html; research data is generated into src/data.js. Tests: test/calibration.js, test/presence.js, test/sweep.js, test/baseline-cases.js with test/fixtures/allout-baseline.json, test/shots.js. READ ONLY: do not edit any file. You may run node snippets in the scratchpad (/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/understand/) to confirm behaviour, e.g. global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA. Be exhaustive and precise: every site with its line number, the exact current behaviour, and the change section 5 needs. A hard rule of the brief: with all four powers off (5a at 0%), every engine result must equal today's exactly, so note for each site how to keep that. Report numbers you computed, not guesses.`

const AREAS = [
  { key: 'air', prompt: `${COMMON}

YOUR AREA: 5a, Air resistance absorbed. Map: the flight code (fly() and every caller: throwObject, the game of catch, Wrestle's throw of a partner, the Collide charge if the hitter was thrown, anything else), how drag force and drag energy loss are computed, shock()/the air blast and the sonic boom (where boom and blast hazards are judged in the effort search / courtesy ceiling for Throw and catch), coolFlight everywhere (engine and page), heating/burn-up/ablation of thrown objects, the thrown-passenger drag g-load (PASSENGER.dragG, the 1.5 g limit), the relativistic branch (fly returns relativistic:true with range 0 past 1% of c) and the Throw tab's fixed real-air story for it in app.html (find the exact text), and the game of catch's and thrown partner's handling of very fast throws. Also find where 'not reachable' preset messages are produced on the Throw tab and in the game of catch in app.html, and how presets/effort search are structured (presetsFor / planFor / ceiling). Work out concretely: how to add a drag factor (1 - share) to the drag force and to the energy the air takes, how to report energy and momentum that went to the ocean, and what the straight-line very-fast throw needs (deflection by gravity, leaving the Earth for level/upward throws, downward throws hitting the ground at a geometric distance, fireball scaled by (1 - share)). Compute the All-Star Superman baseball case (dial 1.8e23 kg, comic, level throw: find how the page sets the dial to a kg value and the baseball object) and what the engine returns today.` },
  { key: 'form', prompt: `${COMMON}

YOUR AREA: 5b, Things keep their form. Map: gentleHold everywhere (engine and page), and every way a held or thrown object can be broken today: grip crush (gripRatio, plateNeeded), launch crush (g-force at launch), sag under its own weight while held, heating/burn-up in flight, air in flight (ram pressure? aerodynamic breakup?), and impacts/landing breakup (which stay real). Find the courtesy ceiling's crush hazard and any other hazard that counts object breakage, the status chips and result text that say an object is crushed / breaks / sags, and what the page shows for 'Gentle hold'. For the brief's test 'Everest thrown hits a bird-sized object intact and breaks on the Moon (pick an engine case each)': find which objects exist in the data (D.objects; is there Everest? the Moon? a bird?), and what engine function models a collision between a thrown object and something else (Collide? impact on landing?). Recommend concrete engine cases for that test and say if the engine cannot model it. Recommend how keepForm should map onto the existing gentleHold code paths so that keepForm=false reproduces today's results exactly with gentleHold=false (and note: saved gentleHold maps to keepForm on).` },
  { key: 'ground', prompt: `${COMMON}

YOUR AREA: 5c, Unbreakable footing, solo tabs. Map EVERY site that tests groundHolds in src/engine.js (65 lines) and src/app.html (47 lines) and classify each: (a) prevents ground breaking/cratering/sinking/punching through, (b) supplies bearing where the ground could not bear the push (their power holds the contact), (c) affects shaking (ppv, plaster reach, rattle, feel reach), (d) other. For each, say whether today with groundHolds the shaking is kept or lost, and what 5c needs (the brief: with Unbreakable footing on, the ground never breaks but the push's momentum still goes in, so it shakes exactly as real physics says; footprints in soil stay; the Weight tab stands at any density with the page saying it is their power; the 'break the ground' preset turns the absorption off for that move). Find how shaking is computed per move (stomp, jump, walk, sprint, lift, throw landing, punch?), the quake/ppv/plaster functions, and what input they use (momentum, energy, force). Find the 'break the ground' preset and how presets are defined (R.PRESETS? hazards list around line 3220-3370 of engine.js). Answer: is Unbreakable footing simply groundHolds renamed, with extra work where groundHolds currently kills shaking? List each place where groundHolds currently kills shaking (e.g. Collide Eground: 0 when cB.groundHolds). Note engine.js line 3555 uses groundHolds:true in a calibration base.` },
  { key: 'duo', prompt: `${COMMON}

YOUR AREA: 5c's two-player gap. The brief: the two-player tests (Arm wrestle, Wrestle, Catch, Collide) never judge ground shaking; their effort search checks only the sound barrier, an air blast and sliding (the harm check above duoPlanFor in app.html); they offer only least disruptive, all-out and custom presets. Section 5c wants: a ground-shaking source for each (the Collide hit and a bolted or held side's push into the ground, from the momentum the ground receives; the wrestling and catch pushes likewise), ground shaking added to their effort search, and the not-so-heroic presets offered there as on the solo tabs, so 'risk cracking the plaster' works in the unstoppable-force test; and replace the Collide held-target quake estimate (today all the hit's energy, an upper bound) with the same source. Map in detail: engine functions armWrestle, wrestle, catchGame, collide (or their real names) and what each returns about forces, impulses, momenta into the ground, quake estimates; app.html's duoPlanFor, harmAt, the duo harm check, duo presets, how the solo tabs' presets and their ground-shaking checks work (which engine function turns a ground push into ppv / plaster reach / feel reach, e.g. a stomp's or a landing's), and what the 'unstoppable force' test is (Collide with an immovable object?). Propose concretely how to compute the momentum the ground receives in each duo test and feed it to the same shaking model the solo tabs use, and how to add presets to the duo effort search. Note cost: duo searches already take 2-3 s.` },
  { key: 'recoil', prompt: `${COMMON}

YOUR AREA: 5d, They take their own recoil. Map: recoil everywhere in the engine (recoilV in throwObject, punch, clap, pull, the game of catch, anything else), how the anchor ('friction'|'braced'|'bolted') and anchorCapacity decide sliding, how bolted today sends recoil into the planet, whether bolted recoil makes ground shaking today and how, the courtesy ceiling's recoil-slide hazard ('his own recoil shoving him past the nearest people') and where it is judged, and the page text for recoil. The brief: with ownRecoil on, the push back from their own moves (throw, punch, clap, pull) goes through their feet into the planet as if bolted (not jumps or sprint starts); momentum is kept (the planet takes it); with 5c the ground doesn't break but shakes from that push; the recoil-slide hazard never triggers while on, and the recoil's ground shaking counts instead. Off: today's physics. Bolted stays for being pushed by someone else (two-player contests, Collide). Work out: is 'ownRecoil' the same as forcing anchor:'bolted' for the mover's own moves only, or are there differences (e.g. bolted also changes the throw's achievable force via anchorCapacity R=Infinity; does ownRecoil also raise what force they can apply, or only stop the slide?). Think carefully: the brief says 'as if bolted: they don't slide or get flung backwards'. Compute today's results for the presence test's bus-on-ice throw case (find it in test/presence.js) and the All-Star Superman baseball (dial 1.8e23 kg, comic, level throw; the brief says it shoves Rex back at about 99.7% of light speed today). Recommend the exact semantics and say how the recoil's ground shaking should be computed (momentum into the ground over the push time, as for a stomp?).` },
  { key: 'state', prompt: `${COMMON}

YOUR AREA: saved state, page controls and tests for section 5. Map: app.html's DEFAULTS, VALID, the load/migration code for 'rex-lab-v1' (what is reset on load, how unknown keys are deleted, the existing migrations for group/braced/wAngle), the Their powers panel markup (#powers; the Gentle hold, Cool flight, Comic ground (#ground-holds) controls and their state keys), how ctx()/ctxOllie() build the engine context from state (which switch keys pass through), the #comic-sum / powers summary line, every status chip that names a retired option ('Ground: comic, never breaks', 'Gentle hold', 'Cool flight'), and how test/shots.js checks the powers panel (IN_POWERS, POWERS_OFF, retired ids). Then the tests: how test/presence.js and test/calibration.js build ctx (do they pass groundHolds/gentleHold/coolFlight?), how test/baseline-cases.js and test/sweep.js pass groundHolds, and what has to change so that with the four powers off (airAbsorb 0, keepForm false, unbreakable false, ownRecoil false) they pass unchanged. Key design question: the engine's ctx today uses groundHolds/gentleHold/coolFlight. Recommend whether the engine should take new keys (airAbsorb, keepForm, unbreakable, ownRecoil) with absent = off (so existing tests pass unchanged with no edits), and whether groundHolds should become an alias of unbreakable in the engine. Recommend how old saves pick up the new defaults (bump the key to rex-lab-v2 reading v1, or migrate in place) and what must happen to saved coolFlight (drop), gentleHold (true maps to keepForm on; what about false? the brief says new defaults apply so old saves don't turn them off), groundHolds (true maps to unbreakable on). Note the README's Known limits and the test counts.` },
]

phase('Map')
const maps = await parallel(AREAS.map((a) => () => agent(a.prompt, { label: 'map:' + a.key, phase: 'Map', schema: MAP })))
const good = maps.filter(Boolean)
log(`${good.length}/${AREAS.length} maps returned`)

phase('Critic')
const critic = await agent(`${COMMON}

You are the completeness critic. Six readers mapped the code for section 5 (air resistance absorbed, things keep their form, unbreakable footing solo, the two-player ground-shaking gap, own recoil, saved state and tests). Their maps follow as JSON. Check them against BRIEF-gui.md section 5 line by line and against the code: what requirement of the brief has no site mapped, which site is mis-described (verify against the code), which groundHolds / gentleHold / coolFlight / recoil / fly site in engine.js or app.html is missing from every map (grep them all), and which test the brief lists has no concrete plan. Return the gaps as sites/questions/tests in the same schema (area 'critic'), with the summary listing the most important gaps first.

MAPS:
${JSON.stringify(good).slice(0, 180000)}`, { label: 'critic', phase: 'Critic', schema: MAP })

return { maps: good, critic }
