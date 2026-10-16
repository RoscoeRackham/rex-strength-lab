# Each round 1 fix reverted on its own in a scratch tree; its covering checks run there.
# python3 revert.py [names...]   (results in ../revert-results.json)
import json, os, shutil, subprocess, sys, concurrent.futures as cf
SRC = '/home/user/rex-strength-lab/rex-strength-lab'
HERE = os.path.dirname(os.path.abspath(__file__)); TREES = os.path.join(HERE, '..', 'trees1')
E, A, S = 'src/engine.js', 'src/app.html', 'src/static-data.js'
R = {}
def rv(name, test, *edits): R[name] = (test, edits)
# ---- engine fixes (sec: powers.js section 8; r1: the page's round 1 checks too)
rv('E1-carry-hold-capped', 'sec+r1', (E, "const footSplat = Hhold > 0 && isFinite(Hhold) ? Hhold : 0,", "const footSplat = !(Hhold > 0) ? 0 : Math.min(Hhold, cf.soft.F),"))
rv('E2-carry-force-without-hold', 'sec+r1', (E, "F: cfx.F + footF, T: cfx.t", "F: cfx.F, T: cfx.t"))
rv('E3-from-above-rock-tears', 'sec+r1', (E, "const rockGives = cB.anchor === 'bolted' && horiz,", "const rockGives = cB.anchor === 'bolted',"), (E, "const Hhold = rockGives ? tear : isFinite(hb.H) ? hb.H : Math.max(0, hb.anc.Nmax - mB * K.g);", "const Hhold = rockGives ? tear : hb.H;"))
rv('E4-arm-loser-pad-unchecked', 'sec+all', (E, "if (Math.max(padLoad, loserPad || 0) > tableLat)", "if (padLoad > tableLat)"))
rv('E5-arm-tear-winners-press', 'sec+r1', (E, "(cA.ownRecoil ? Math.min(AA, AB) : AA) / groundTear(cA)", "(cA.ownRecoil ? AB : AA) / groundTear(cA)"), (E, "(cB.ownRecoil ? Math.min(AA, AB) : AB) / groundTear(cB)", "(cB.ownRecoil ? AA : AB) / groundTear(cB)"))
rv('E6-pm-rock-unchecked-finite', 'sec+r1', (E, "const tears = (c, Pin) => bolt(c) && !holdsGround(c) && Pin > groundTear(c) && !sameForce(Pin, groundTear(c));", "const tears = (c, Pin) => bolt(c) && !holdsGround(c) && !isFinite(Pin);"))
rv('E7-pm-nothing-moves', 'sec+r1', (E, "const moves = heldB ? bBeats : aBeats;", "const moves = false;"))
rv('E8-pm-torn-feet-unbounded', 'sec', (E, "footA: footJ(fAn > 0, HA, DB), footB: footJ(fBn > 0, HB, DA), xA: sA.x(t), xB: sB.x(t) };", "footA: tornA ? Infinity : footJ(fAn > 0, HA, DB), footB: tornB ? Infinity : footJ(fBn > 0, HB, DA), xA: sA.x(t), xB: sB.x(t) };"))
rv('E9-both-nothing-moves', 'sec+r1', (E, "if ((noP && noT) || (noP && rT.stalled) || (noT && rP.stalled)) {", "if (noP || noT) {"))
rv('E10-push-rock-holds', 'sec+r1', (E, "const torn = own && cB.anchor === 'bolted' && !holdsGround(cB) && !cB.immovable && DA > groundTear(cB) && !same(DA, groundTear(cB));", "const torn = false;"))
rv('E11-push-not-followed', 'sec+r1', (E, "if (own && out.outcome === 'forceWins') {\n        const d = Math.min(", "if (false) {\n        const d = Math.min("))
rv('M-E25-recoilA-uses-DB', 'sec+r1', (E, "if (DA > 0) r.recoilAbsorbedA = { J: isFinite(DA) ? DA * t : Infinity,", "if (DA > 0) r.recoilAbsorbedA = { J: isFinite(DB) ? DB * t : Infinity,"))
# ---- page fixes (r1: the round 1 checks; all: the whole pull request 4 block)
rv('P1-hit-force-squash-only', 'r1', (A, "F = cr ? { F: cr.F, t: cr.T } : r.contact ?", "F = r.contact ?"))
rv('P2-from-above-hold-text', 'r1', (A, "'the ground under his feet, which bears ' + fmtN(cr.hold) + ' on ' + cB.surface.short + (cB.anchor === 'bolted' ? ' (from above, his bolts go down into it with him: they could only add to that, and the lab doesn’t count them)' : '')", "'the ground under his feet, which bears ' + fmtN(hb.H) + ' on ' + cB.surface.short"))
rv('P2b-from-above-hold-bar', 'r1', (A, "cr ? { label: 'What holds ' + Y + (cr.rockGives ? ': the rock around his bolts' : !horiz ? ': the ground' : ''), value: cr.hold, highlight: false } :", "cr && cr.rockGives ? { label: 'What holds ' + Y + ': the rock around his bolts', value: cr.tear, highlight: false } :"))
rv('P3-paradox-no-flag', 'r1', (A, "if (r.unbounded && r.outcome === 'paradox') { out.noAnswer = 'the hit';", "if (false) { out.noAnswer = 'the hit';"))
rv('P4-paradox-coexist', 'r1', (A, "so physics has no answer here (the canon’s ruling).');", "so the two settings can’t both hold.');"), (A, "'No answer: one of them has to give, and neither can. (For light speed into a truly immovable body, ∞ ÷ ∞: physics says those two can’t exist together.)']];", "'No answer: one of them has to give, and neither can (at light speed into a truly immovable body, ∞ ÷ ∞). The two can’t exist in the same universe.']];"))
rv('P5-push-drive-not-judged', 'r1', (A, "const dv = r.drive, nY = ollieX ? 'Rex' : 'Ollie';", "const dv = null, nY = ollieX ? 'Rex' : 'Ollie';"))
rv('P6-push-torn-verdict', 'r1', (A, "else if (r.rockGives) v = Y + ' is bolted, but on real rock: '", "else if (false) v = Y + ' is bolted, but on real rock: '"))
rv('P7-push-bar-label', 'r1', (A, "(own ? ' (not needed)' : '')", "(own ? ' (not needed: his push back goes to his source)' : '')"))
rv('P8-pm-noanswer-verdict', 'r1', (A, "if (r.noAnswer) v = W + ' is bolted to ground that their power holds", "if (false) v = W + ' is bolted to ground that their power holds"))
rv('P9-both-noanswer-verdict', 'r1', (A, "if (bothOwn && r.noAnswer) {", "if (false) {"))
rv('P10-ratio-digits', 'r1', (A, "(ratio >= 10 ? big(ratio, 2) : sig(ratio, 2))", "(ratio >= 10 ? Math.round(ratio) : sig(ratio, 2))"))
rv('P11-torn-hold-unlimited', 'r1', (A, "const hTxt = (s) => (tornOf(s) ? 'the rock around his bolts, about ' + fmtSI(tearOf(s), 'N') : fmtN(s === 'A' ? r.HA : r.HB));", "const hTxt = (s) => fmtN(s === 'A' ? r.HA : r.HB);"))
rv('P12-ground-preset-what', 'r1', (A, "          : act === 'wrestle' && state.wrestleMove === 'push' && e === 'ground' && state.ownRecoil && (state.anchor === 'bolted') !== (state.oAnchor === 'bolted') ? 'tears the rock out around ' + (state.anchor === 'bolted' ? 'Rex’s' : 'Ollie’s') + ' bolts'\n", ""))
rv('P13-bolts-not-shaking', 'r1', (A, "if (boltSrc) { out.shake = [boltSrc]; out.sig += fp(wJ); }", ""))
rv('P14-shake-why-old', 'r1', (A, "(state.ownRecoil ? (bR !== bO ? null : bR && bO ?", "(state.ownRecoil ? (false ? null : bR && bO ?"))
rv('P15-both-tile-own-shove', 'r1', (A, "const shown = bothOwn && !movB && movA && r.back ? r.back : r;", "const shown = r;"))
rv('P16-arm-pad-item', 'all', (A, "The loser’s pad still carries what turns his own forearm against the winner’s hand, ' + aboutN(r.loserPadLoad) + ': that is a force on the loser, not anyone’s push back, so no power takes it. ' + (r.tableBreaksBy === 'pin' ? 'That is more than the table carries, so the pin breaks it.' : 'Both are within what the table carries.')", "So with the power on a pin never breaks the table: its pad carries no more than the loser’s press, within what the table carries.'"))
rv('P16b-arm-broke-text', 'all', (A, "const loserPadBreaks = r.tableBreaksBy === 'pin' && r.loserPadLoad > r.padLoad;", "const loserPadBreaks = false;"))
rv('P17-nkb-note', 'all', (A, "and the motion it frees as it stops at him is taken back unless he means it (canon; the heat it made in the air on the way stays real). Off, it moves him as real physics says. In their contests (arm wrestling, every Wrestle move, Collide, the partner toss) they let force move:", "and the energy it frees where he stands is taken back unless he means it (canon). Off, it moves him as real physics says. In their contests, every two-player test here, they let force move:"))
rv('P18a-card-five-powers', 'all', (S, "so six powers are on unless the reader turns them off: Air resistance absorbed, Things keep their form, Unbreakable footing, They take their own recoil, Safe passenger and Never knocked back (one switch each).", "so five powers are on unless the reader turns them off: Air resistance absorbed, Things keep their form, Unbreakable footing, They take their own recoil and Safe passenger."))
rv('P18b-card-energy-contests', 'all', (S, "and the motion it frees as it stops at him is taken back unless he means it (the heat it made in the air on the way stays real); in their contests (arm wrestling, every Wrestle move, Collide, the partner toss) they let force move,", "and the energy it frees where he stands is taken back unless he means it; in their contests (every two-player test here) they let force move,"))
rv('P18c-card-newton-contests', 'all', (S, "In their contests (arm wrestling, every Wrestle move, Collide, the partner toss) force moves:", "In their contests (every two-player test) force moves:"))
rv('P18d-card-no-answer', 'all', (S, " Where a push or hit has no physical answer (canon: one held without limit by their powers, against a charger who can’t slow or an unlimited push), the lab can’t judge its harm, and the page says so rather than calling it harmless.' },", "' },"))
rv('P19-fireball-before-gate', 'r1', (A, "if ((fb.kind !== 'before' || fb.knockAbsorbed) && isFinite(fb.Ehere)) {", "if (fb.kind !== 'before' && isFinite(fb.Ehere)) {"))
rv('P20-both-moves-tile', 'r1', (A, "bothOwn && !movA ? tile(pusher + ' moves', 'not at all', (r.shover === 'A' ? cR : cO).anchor === 'bolted' ? 'bolted' : 'his footing holds') : speedTile(", "speedTile("))
rv('P21-effortbox-harmless', 'r1', (A, "const naT = noCap || (eff.p.s && eff.p.done) ? noAnswerText(naF(factsTop(), '')) : null;", "const naT = null;"), (A, "const fN = naF(fAll, eff.real ? 'real' : ''), na = noAnswerText(fN);", "const fN = naF(fAll, eff.real ? 'real' : ''), na = null;"), (A, "const fC = eff.real ? factsTop('real') : factsTop(), fCn = naF(fC, eff.real ? 'real' : ''), naC = noAnswerText(fCn);", "const fC = eff.real ? factsTop('real') : factsTop(), fCn = naF(fC, eff.real ? 'real' : ''), naC = null;"))
rv('P22-recoil-why-push', 'r1', (A, "if (act === 'wrestle' && state.wrestleMove === 'push') return f.noAnswer ? null :", "if (false) return f.noAnswer ? null :"))
rv('P23-push-why-own', 'r1', (A, "(state.ownRecoil && !state.colImm ? 'In the steady push the pusher’s push back goes", "(false ? 'In the steady push the pusher’s push back goes"))
rv('P24-push-ground-gap-own', 'r1', (A, "(state.ownRecoil ? 'Standing, the one pushed slides long before", "(false ? 'Standing, the one pushed slides long before"))
rv('P25-push-feet-text', 'r1', (A, "dv ? 'Driven back: ' + X + ' pushes from where he stands", "false ? 'Driven back: ' + X + ' pushes from where he stands"), (A, "dv ? (dv.vB >= K.c * (1 - 1e-9) ? tile(Y + ' is driven off at'", "false ? (dv.vB >= K.c * (1 - 1e-9) ? tile(Y + ' is driven off at'"))
rv('P26-push-ground-preset-what', 'r1', (A, "            : act === 'collide' && state.colMode === 'push' && e === 'ground' && state.ownRecoil && !state.colImm && (state.colWho === 'ollie' ? state.anchor : state.oAnchor) === 'bolted' ? 'breaks the rock around ' + (state.colWho === 'ollie' ? 'Rex’s' : 'Ollie’s') + ' bolts'\n", ""))
rv('M-P10-hit-blast-by-default', 'r1', (A, "const Q = r.unbounded ? (r.outcome === 'carried' ? r.Elocal || 0 : 0)", "const Q = r.unbounded ? (r.h ? r.h.Q : r.Elocal || 0)"))
rv('M-P4-duoKey-without-switches', 'r1', (A, ".concat(act === 'catch' ? [state.noKnockback, state.oNoKnockback] : [])", ".concat([])"))
only = sys.argv[1:]
def run(name):
    test, edits = R[name]
    root = os.path.join(TREES, name); d = os.path.join(root, 'rex-strength-lab')
    shutil.rmtree(root, ignore_errors=True); os.makedirs(d)
    for x in ['src', 'test']: shutil.copytree(os.path.join(SRC, x), os.path.join(d, x))
    for x in ['build.js', 'build-data.py']: shutil.copy(os.path.join(SRC, x), d)
    for x in ['research', 'assets']: os.symlink(os.path.join(SRC, x), os.path.join(d, x))
    for f, old, new in edits:
        p = os.path.join(d, f); s = open(p, encoding='utf-8').read()
        if s.count(old) != 1: return name, {'error': 'pattern count %d: %s' % (s.count(old), old[:80])}
        open(p, 'w', encoding='utf-8').write(s.replace(old, new))
    if any(f == S for f, _, _ in edits): subprocess.run(['python3', 'build-data.py'], cwd=d, capture_output=True)
    subprocess.run(['node', 'build.js'], cwd=d, capture_output=True)
    res = {}
    if 'sec' in test:
        p = subprocess.run(['node', os.path.join(HERE, 'sec.js'), os.path.join(d, E), os.path.join(d, 'test/powers.js'), '6', '8'], cwd=d, capture_output=True, text=True)
        res['powers'] = [l[:170] for l in p.stdout.splitlines() if l.startswith('FAIL')] + ([p.stderr[-300:]] if p.returncode and not any(l.startswith('FAIL') for l in p.stdout.splitlines()) else [])
    mode = 'all' if 'all' in test else 'r1' if 'r1' in test else None
    if mode:
        p = subprocess.run(['node', os.path.join(HERE, 'blk.js'), os.path.join(d, 'test/shots.js'), d, mode], cwd=d, capture_output=True, text=True)
        res['page'] = [l[6:190] for l in p.stdout.splitlines() if l.startswith('FAILS')] + ([p.stderr[-300:]] if p.returncode else [])
    shutil.rmtree(os.path.join(d, 'dist'), ignore_errors=True)
    return name, res
names = [n for n in R if not only or n in only]
out = {}
with cf.ThreadPoolExecutor(max_workers=int(os.environ.get('W', '4'))) as ex:
    for name, res in ex.map(run, names):
        out[name] = res
        print(name, json.dumps(res)[:600], flush=True)
prev = {}
rp = os.path.join(HERE, '..', 'revert1-results.json')
if os.path.exists(rp): prev = json.load(open(rp))
prev.update(out); json.dump(prev, open(rp, 'w'), indent=1)
