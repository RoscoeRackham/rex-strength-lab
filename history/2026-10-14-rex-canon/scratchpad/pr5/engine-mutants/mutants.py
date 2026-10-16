#!/usr/bin/env python3
"""Mutants for pull request 5's engine stage (the energy taken back, and the shimmer's level).
Each mutant copies the lab's src/, test/ and research/ into its own scratch tree, breaks one thing the new checks guard,
runs the checks that guard it, and records which checks failed. A mutant that fails no check is a gap.
Run: python3 mutants.py [ids...]   (results in results.json, a table in results.md)
"""
import json, os, re, shutil, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

LAB = '/home/user/rex-strength-lab/rex-strength-lab'
HERE = os.path.dirname(os.path.abspath(__file__))
TALLY = ['node', 'test/powers.js', '--skip-off', '--tally-only']
LADDER = ['node', 'test/ladder.js']
PART1 = ['node', 'test/powers.js', '--off-only']
E, L = 'src/engine.js', 'src/ladder.js'

M = [
  # --- the tally (src/engine.js, RESTRAINT.takenBack)
  ('drag-ocean', 'drag from fly()\'s drag-free tally (ocean.E), the brief\'s risk', E,
   "      if (r.dragLoss0 != null) return r.dragLoss0;\n      const f0 = fly({ v0: r.vOut, thetaDeg, h0: body.releaseHeight",
   "      if (r.flight.ocean) return r.flight.ocean.E;\n      const f0 = fly({ v0: r.vOut, thetaDeg, h0: body.releaseHeight", TALLY),
  ('drag-no-share', 'drag without the share absorbed (all of real air\'s take at any share)', E,
   "if (s > 0 && ob && body) add(whoA, 'drag', tbDrag(s * realAirThrow(", "if (s > 0 && ob && body) add(whoA, 'drag', tbDrag(1 * realAirThrow(", TALLY),
  ('drag-twice', 'the drag counted again on top of an arrival taken back (no count-once)', E,
   "x === Infinity ? Infinity : Math.max(0, x - arrive));", "x === Infinity ? Infinity : x);", TALLY),
  ('drag-escape-0', 'a throw real air would not bring down (an escape) gives the drag nothing', E,
   "return f0.landed && !f0.relativistic ? Math.max(0, r.Eobj + tbPE(obj.m, body.releaseHeight) - keFromV(f0.vImpact, obj.m)) : r.Eobj;",
   "return f0.landed && !f0.relativistic ? Math.max(0, r.Eobj + tbPE(obj.m, body.releaseHeight) - keFromV(f0.vImpact, obj.m)) : 0;", TALLY),
  ('drag-rel-0', 'a throw past 1% of light speed gives the drag nothing', E,
   "      if (r.flight.relativistic) return r.Eobj;\n      if (r.dragLoss0", "      if (r.flight.relativistic) return 0;\n      if (r.dragLoss0", TALLY),
  ('drag-no-PE', 'real air\'s take without the release height\'s potential energy', E,
   "Math.max(0, r.Eobj + tbPE(obj.m, body.releaseHeight) - keFromV(f0.vImpact, obj.m)) : r.Eobj;",
   "Math.max(0, r.Eobj - keFromV(f0.vImpact, obj.m)) : r.Eobj;", TALLY),
  ('toss-v-energy', 'the toss past 1% of light speed: its energy from the rounded speed (not unbounded at an unlimited dial)', E,
   "if (t.v >= CATCHGAME.CATCH.V_FIREBALL) return throwObject(Object.assign({}, A, { noFlight: true }), obj, 90).Eobj;",
   "if (t.v >= CATCHGAME.CATCH.V_FIREBALL) return keFromV(t.v, obj.m);", TALLY),
  ('toss-flight-0', 'the toss below 1% of light speed gives the drag nothing', E,
   "return f0.landed && !f0.escaped && !f0.orbit && !f0.timedOut ? Math.max(0, Ev - keFromV(f0.vImpact, obj.m)) : Ev;", "return 0;", TALLY),
  ('leg-fast-0', 'a game-of-catch throw past 1% of light speed (a straight line) gives the drag nothing', E,
   "if (L.fast) return (L.miss ? L.miss.E : 0) + (L.sheath ? L.sheath.E : 0);", "if (L.fast) return 0;", TALLY),
  ('leg-fireball-0', 'a game-of-catch fireball gives the drag nothing', E,
   "if (L.result === 'fireball') return L.fireball ? L.fireball.E : 0;", "if (L.result === 'fireball') return 0;", TALLY),
  ('leg-overshoots-0', 'a game-of-catch throw that overshoots gives the drag nothing', E,
   "        if (!(L.vL > 0)) return 0;\n", "        return 0;\n", TALLY),
  ('leg-flight-swap', 'the game-of-catch flight with the lob\'s and the fastball\'s ends swapped', E,
   "hStop: hard ? 0 : L.hStop, Dend: L.Dfl }, hard ? { xStop: L.Dfl } : {}, full));", "hStop: hard ? L.hStop : 0, Dend: L.Dfl }, hard ? {} : { xStop: L.Dfl }, full));", TALLY),
  ('stomp-E', 'the stomp\'s footing part is its whole energy, whether or not real ground would break', E,
   "if (A.unbreakable) add(whoA, 'footing', r.absorbed);", "if (A.unbreakable) add(whoA, 'footing', r.E);", TALLY),
  ('jump-footing', 'the jump adds a footing part (its landing\'s energy) beside Soft landing\'s', E,
   "if (r.landing && r.landing.landed && r.landing.soft) add(whoA, 'soft', r.landing.absorbed);",
   "if (r.landing && r.landing.landed && r.landing.soft) add(whoA, 'soft', r.landing.absorbed); if (A.unbreakable && r.landing && r.landing.landed) add(whoA, 'footing', r.landing.E);", TALLY),
  ('soft-E', 'Soft landing\'s part is the landing\'s whole energy, not what it takes back', E,
   "add(whoA, 'soft', r.landing.absorbed);", "add(whoA, 'soft', r.landing.E);", TALLY),
  ('silent-mach', 'Silent strike takes back a punch or clap below the speed of sound too', E,
   "if (A.silentStrike && r.mach >= 1) add(whoA, 'silent', r.E);", "if (A.silentStrike) add(whoA, 'silent', r.E);", TALLY),
  ('silent-power', 'Silent strike\'s part without the switch', E,
   "if (A.silentStrike && r.mach >= 1) add(whoA, 'silent', r.E);", "if (r.mach >= 1) add(whoA, 'silent', r.E);", TALLY),
  ('hit-Q', 'the hit\'s part is the splat\'s Q, meant or not', E,
   "if (r.hitAbsorbed) add(whoB, 'hit', r.hitAbsorbed.E);", "if (r.hitAbsorbed) add(whoB, 'hit', r.Q);", TALLY),
  ('hit-charger', 'the hit\'s freed energy goes to the charger, not the one hit', E,
   "if (r.hitAbsorbed) add(whoB, 'hit', r.hitAbsorbed.E);", "if (r.hitAbsorbed) add(whoA, 'hit', r.hitAbsorbed.E);", TALLY),
  ('stop-none', 'the charger\'s own stop left out', E,
   "if (r.carry && r.carry.stop) add(whoA, 'stop', r.carry.stop.E);", "", TALLY),
  ('passenger-power', 'a thrown person\'s landing counted with Safe passenger off', E,
   "const pl = ob ? MOVES.throw.passengerLanding(r, A) : null", "const pl = ob ? MOVES.throw.passengerLanding(r, Object.assign({}, A, { safePassenger: true })) : null", TALLY),
  ('catch-power', 'a catch counted while the catcher doesn\'t take his own recoil', E,
   "} else if (reaches && C.ownRecoil && L.catch) arrive", "} else if (reaches && L.catch) arrive", TALLY),
  ('catch-thrower', 'a catch counted as the thrower\'s', E,
   "arrive = add(whoC, 'catch', L.catch.Ecatch);", "arrive = add(whoT, 'catch', L.catch.Ecatch);", TALLY),
  ('catch-return-leg', 'the return leg (b) of the game of catch left out', E,
   "          leg(r.b, B, A, whoB, whoA);\n", "", TALLY),
  ('fireball-E', 'the fireball\'s hit part is all its energy, not the motion freed at him (knockAbsorbed.E)', E,
   "arrive = add(whoC, 'hit', L.fireball.knockAbsorbed.E);", "arrive = add(whoC, 'hit', L.fireball.E);", TALLY),
  ('ground-hit-none', 'a person\'s ground hit in the game of catch not read from hitsGround', E,
   "const hg = L.hitsGround, own = !(hg.airK > 0) ? hg.E : hg.kept && hg.own ? hg.own.E : 0;", "const hg = L.hitsGround, own = 0;", TALLY),
  ('ground-hit-whole', 'below 100% the ground hit counts all of its energy, the swept air\'s included', E,
   "const hg = L.hitsGround, own = !(hg.airK > 0) ? hg.E : hg.kept && hg.own ? hg.own.E : 0;", "const hg = L.hitsGround, own = hg.E;", TALLY),
  ('miss-ignored', 'the "if he misses" what-if ignored', E,
   "const missed = !!opt.miss && reaches && L.miss && !L.miss.hits;", "const missed = false;", TALLY),
  ('wrestle-footing-power', 'the Wrestle throw\'s landing taken back without the partner\'s Unbreakable footing', E,
   "const arrive = B.unbreakable && f.landed && !f.relativistic && rr.crater > 0 ? add(whoB, 'footing', rr.Eimpact) : 0;",
   "const arrive = f.landed && !f.relativistic && rr.crater > 0 ? add(whoB, 'footing', rr.Eimpact) : 0;", TALLY),
  ('wrestle-footing-thrower', 'the Wrestle throw\'s landing on the partner\'s footing counted as the thrower\'s', E,
   "? add(whoB, 'footing', rr.Eimpact) : 0;", "? add(whoA, 'footing', rr.Eimpact) : 0;", TALLY),
  ('toss-catch-power', 'the partner toss\'s catch counted without his own recoil taken', E,
   "const arrive = A.ownRecoil && k && (t.result === 'caught' || t.result === 'slams')", "const arrive = k && (t.result === 'caught' || t.result === 'slams')", TALLY),
  ('toss-drag-twice', 'the toss\'s drag counted on top of its catch', E,
   "if (s > 0) add(whoA, 'drag', tbDrag(s * realAirToss(t, A), arrive));", "if (s > 0) add(whoA, 'drag', tbDrag(s * realAirToss(t, A), 0));", TALLY),
  ('growth-none', 'the growth what-if left out', E,
   "if (move === 'weight') add(whoA, 'growth', opt.growE);", "", TALLY),
  ('solo-ollie', 'a solo tab\'s parts put on Ollie', E,
   "const whoA = solo ? 'rex' : opt.whoA || 'rex';", "const whoA = solo ? 'ollie' : opt.whoA || 'rex';", TALLY),
  ('nan-guard', 'NaN passes tbJ (one of two guards: add() skips a falsy value too, so NaN still adds nothing: equivalent)', E,
   "const tbJ = (x) => (typeof x === 'number' && x > 0 ? x : 0);", "const tbJ = (x) => (typeof x === 'number' && !(x < 0) && x !== 0 ? x : 0);", TALLY),
  ('nan-guard-both', 'NaN figures pass through (both guards gone)', E,
   "const add = (who, part, x) => { const v = tbJ(x); if (v) by[who].parts[part] += v; return v; };",
   "const add = (who, part, x) => { const v = typeof x === 'number' ? x : 0; by[who].parts[part] += v; return v; };", TALLY),
  ('wrestle-footing-thrower-switch', 'the Wrestle throw\'s landing taken back on the thrower\'s Unbreakable footing, not the thrown one\'s', E,
   "const arrive = B.unbreakable && f.landed && !f.relativistic && rr.crater > 0 ? add(whoB, 'footing', rr.Eimpact) : 0;",
   "const arrive = A.unbreakable && f.landed && !f.relativistic && rr.crater > 0 ? add(whoB, 'footing', rr.Eimpact) : 0;", TALLY),
  ('unbounded-flag', 'an unlimited run not flagged unbounded', E,
   "return { E, unbounded: E === Infinity, parts, by };", "return { E, unbounded: false, parts, by };", TALLY),
  ('mutates-result', 'the tally writes what it works out back into the throw\'s result', E,
   "      if (r.dragLoss0 != null) return r.dragLoss0;\n      const f0 = fly({ v0: r.vOut, thetaDeg, h0: body.releaseHeight",
   "      if (r.dragLoss0 != null) return r.dragLoss0;\n      r.realAirTake = true;\n      const f0 = fly({ v0: r.vOut, thetaDeg, h0: body.releaseHeight", TALLY),
  # --- results gaining a key: test part 1 (the fixture) catches these
  ('key-on-throw', 'throwOnce\'s result gains a key (the tally kept in the result)', E,
   "      recoilV, recoilE,\n      gentle: gripSafe(ctx),", "      recoilV, recoilE, taken: 0,\n      gentle: gripSafe(ctx),", PART1),
  ('key-on-reach', 'reach() gains a key (the glow beside the water-glass ripple)', E,
   "        shimmer: src ? ppvReach(src, VIB.TH.shimmer) : 0,\n", "        shimmer: src ? ppvReach(src, VIB.TH.shimmer) : 0,\n        glow: 0,\n", PART1),
  # --- the level (src/ladder.js, EnergyLadder.glow)
  ('level-linear', 'the level on a linear scale', L,
   "const levelOf = (e) => (Math.log10(e) - L0) / span;", "const levelOf = (e) => (e - fl.J) / (fx.J - fl.J);", LADDER),
  ('anchors-copied', 'the anchors as copied numbers, not the ladder\'s rungs', L,
   "    const fo = rung(GLOW_KEYS.floor), fl = rung(GLOW_KEYS.flicker), fx = rung(GLOW_KEYS.flare);",
   "    rung(GLOW_KEYS.floor); rung(GLOW_KEYS.flicker); rung(GLOW_KEYS.flare);\n    const fo = { J: 7327, key: GLOW_KEYS.floor }, fl = { J: 517100, key: GLOW_KEYS.flicker }, fx = { J: 5e23, key: GLOW_KEYS.flare, rough: true };", LADDER),
  ('anchors-by-position', 'the anchors read by their place in the ladder, not by key', L,
   "      const r = refs.find((x) => x.key === k);",
   "      const r = refs[{ energy_usain_bolt_top_speed: 4, energy_corolla_100kmh_kinetic: 6, energy_chicxulub_impact: 30 }[k]];", LADDER),
  ('no-hold', 'the level not held at the flare', L,
   "    const lv = Math.min(1, level);", "    const lv = level;", LADDER),
  ('no-faint-band', 'below the flicker the nearest step, not the canon\'s faint flicker', L,
   "    if (J < fl.J) return Object.assign(out, { level, strength, word: 'faint flicker', text: 'a faint flicker' });\n", "", LADDER),
  ('no-floor', 'the glow\'s strength from the flicker, not the floor', L,
   "const strength = Math.min(1, Math.max(0, (level - floorLevel) / (1 - floorLevel)));", "const strength = Math.min(1, Math.max(0, level));", LADDER),
  ('no-too-faint', 'below the floor still a faint flicker', L,
   "    if (J < fo.J) return Object.assign(out, { level, strength: 0, word: 'too faint to see', text: 'too faint to see' });\n", "", LADDER),
  ('rough-never', 'no step rough', L,
   "rough: level === 1 ? !!fx.rough : roughAt(Je), phrase };", "rough: false, phrase };", LADDER),
  ('step-below', 'the step at or below the level, not the nearest', L,
   "    for (const s of steps) if (Math.abs(lv - s.level) < Math.abs(lv - best.level)) best = s;", "    for (const s of steps) if (s.level <= lv + 1e-12) best = s;", LADDER),
  ('steps-fifths', 'the steps at fifths of the span', L,
   "const GLOW_STEPS = [['flicker', 0, 'a flicker'], ['faint glow', 0.25, 'a faint glow'], ['glow', 0.5, 'a glow'], ['bright', 0.75, 'bright'],",
   "const GLOW_STEPS = [['flicker', 0, 'a flicker'], ['faint glow', 0.2, 'a faint glow'], ['glow', 0.4, 'a glow'], ['bright', 0.6, 'bright'],", LADDER),
  ('unbounded-nan', 'unbounded energy gets no special case', L,
   "    if (J === Infinity) return Object.assign(out, { unbounded: true, level: 1, strength: 1, word: 'blinding flare', text: 'a blinding flare', held: true });\n", "", LADDER),
  ('no-none', 'no energy still gets a level', L,
   "    if (!(J > 0) || !isFinite(J)) return Object.assign(out, { none: true });\n", "    if (!isFinite(J)) return Object.assign(out, { none: true });\n", LADDER),
]


def run(m):
    mid, what, f, old, new, cmd = m
    tree = os.path.join(HERE, 'tree-' + mid)
    shutil.rmtree(tree, ignore_errors=True)
    for d in ('src', 'test', 'research'):
        shutil.copytree(os.path.join(LAB, d), os.path.join(tree, d))
    p = os.path.join(tree, f)
    s = open(p, encoding='utf-8').read()
    n = s.count(old)
    if n != 1:
        return dict(id=mid, what=what, error='old string found %d times' % n)
    open(p, 'w', encoding='utf-8').write(s.replace(old, new))
    r = subprocess.run(cmd, cwd=tree, capture_output=True, text=True, timeout=1800)
    out = r.stdout + r.stderr
    fails = [re.sub(r'\s+', ' ', l[5:])[:90].replace('|', '/') for l in out.splitlines() if l.startswith('FAIL ')]
    crashed = r.returncode != 0 and not fails
    shutil.rmtree(tree, ignore_errors=True)
    return dict(id=mid, what=what, file=f, cmd=' '.join(cmd), exit=r.returncode, killed=r.returncode != 0, fails=fails,
                crash=(out.strip().splitlines()[-3:] if crashed else None), summary=(out.strip().splitlines() or [''])[-1])


if __name__ == '__main__':
    want = sys.argv[1:]
    todo = [m for m in M if not want or m[0] in want]
    with ThreadPoolExecutor(max_workers=4) as ex:
        res = list(ex.map(run, todo))
    old = {}
    if want and os.path.exists(os.path.join(HERE, 'results.json')):
        old = {x['id']: x for x in json.load(open(os.path.join(HERE, 'results.json')))}
    for x in res:
        old[x['id']] = x
    allres = [old[m[0]] for m in M if m[0] in old]
    json.dump(allres, open(os.path.join(HERE, 'results.json'), 'w'), indent=1)
    lines = ['| Mutant | What it breaks | Command | Killed | Checks that fail |', '|---|---|---|---|---|']
    for x in allres:
        if 'error' in x:
            lines.append('| %s | %s | | ERROR | %s |' % (x['id'], x['what'], x['error'])); continue
        lines.append('| %s | %s | `%s` | %s | %s |' % (x['id'], x['what'], x['cmd'], 'yes' if x['killed'] else 'NO', '; '.join(x['fails']) if x['fails'] else (' '.join(x['crash'] or []) if x['killed'] else 'none')))
    open(os.path.join(HERE, 'results.md'), 'w').write('\n'.join(lines) + '\n')
    for x in res:
        print(x['id'], 'ERROR ' + x['error'] if 'error' in x else ('killed' if x['killed'] else 'SURVIVED'), len(x.get('fails') or []), x.get('summary', ''))
