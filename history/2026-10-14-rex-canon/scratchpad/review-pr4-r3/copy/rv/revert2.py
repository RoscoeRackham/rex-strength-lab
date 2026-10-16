# Each review round 2 fix reverted on its own in a scratch tree; its covering checks run there.
# python3 revert2.py [names...]   (results in ../revert2-results.json)
import json, os, shutil, subprocess, sys, concurrent.futures as cf
SRC = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r3/copy/repo/rex-strength-lab'
HERE = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr4/r2fix/js'; TREES = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r3/copy/rv/trees'
E, A, S = 'src/engine.js', 'src/app.html', 'src/static-data.js'
R = {}
def rv(name, test, *edits): R[name] = (test, edits)
# ---- engine fixes ('sec': powers.js sections 6 and 8; 'r2' / 'all': the page's round 2 checks / the whole block)
rv('E1-hit-energy-without-hold', 'sec+all', (E, "const Qs = h2.Q + footSplat * cf.s;", "const Qs = h2.Q;"))
rv('E2-arm-elbow-unchecked', 'sec+r2', (E, "      if (tableBreaks && cw.ownRecoil) {\n        const aP = (Aw - Pl) / out.pin.M;", "      if (false) {\n        const aP = (Aw - Pl) / out.pin.M;"))
rv('E3-arm-loser-pad-nan', 'sec+r2', (E, "loserPad = !isFinite(aP) ? Infinity : Math.abs(", "loserPad = Math.abs("))
rv('E4-arm-one-sided-all-paradox', 'sec+r2', (E, "      if (heldA && heldB) Object.assign(out, { clash: 'paradox', oneSided: false });\n      else if (heldA || heldB) Object.assign(out, { clash: 'paradox', oneSided: true, noAnswer: heldA ? 'B' : 'A' }, heldA ? { draggedB: true } : { draggedA: true },\n        heldA && boltB ? { tearB: groundTear(cB) } : {}, heldB && boltA ? { tearA: groundTear(cA) } : {});", "      if (heldA || heldB) Object.assign(out, { clash: 'paradox', oneSided: !(heldA && heldB) });"))
rv('E5-walkout-no-walkpush', 'sec+r2', (E, ", contact: Hl + cl.body.m * a, walkPush: Hl + cl.body.m * a },\n            { ['recoilAbsorbed' + w]: rw }, Dl > 0 ? { ['recoilAbsorbed' + (w === 'A' ? 'B' : 'A')]: { J: Dl * t, T: t, thetaDeg: 0 } } : {});", ", contact: Hl + cl.body.m * a });"))
rv('E6-match-no-push-distance', 'sec+all', (E, ", footB: footJ(fBn > 0, HB, DA), xA: sA.x(t), xB: sB.x(t) };", ", footB: footJ(fBn > 0, HB, DA) };"))
rv('E7-steady-push-lying-pushes', 'sec+r2', (E, "const DA = own ? (lying ? 0 : cA.F) : Math.min(cA.F, RA);", "const DA = own ? cA.F : Math.min(cA.F, RA);"))
rv('E8-steady-push-real-unflagged', 'sec+r2', (E, "        if (cA.mode === 'real') out.drive.realUpper = true;\n", ""))
rv('E9-carried-air-uncounted', 'sec+r2', (E, "      if (horiz && !relativistic && vB > K.a0) {\n        const Rb = rockGives", "      if (false) {\n        const Rb = rockGives"))
rv('E10-both-no-bolts-pulse', 'sec+r2', (E, "    if (!noP && !noT && rP.stalled && !rT.stalled && cT.anchor === 'bolted' && rT.push && isFinite(rP.Fdrive)) out.toGroundB", "    if (false) out.toGroundB"), (E, "    if (!noP && !noT && rT.stalled && !rP.stalled && cP.anchor === 'bolted' && rP.push && isFinite(rT.Fdrive)) out.toGroundA", "    if (false) out.toGroundA"))
# ---- page fixes
rv('P1-hit-frees-motion-only', 'r2', (A, "items.push('The hit frees ' + fmtSI(h.Q, 'J') + ' (' + fmtTNT(h.Q) + '): the force of the hit over the squash (' + fmtDist(r.contact.s) + '). That is ' + Y + '’s motion energy as ' + X + ' sees it, plus the work ' + (crHold ? holdName + ' does holding him back over the squash' : 'his hold does over the squash') + '. Canon:", "items.push('The hit frees ' + fmtSI(h.Q, 'J') + ' (' + fmtTNT(h.Q) + '): ' + Y + '’s motion energy as ' + X + ' sees it. Canon:"))
rv('P2-supply-two-figures', 'r2', (A, "cr ? tile(X + '’s source supplies', isFinite(cr.supplied) ? big(cr.supplied, 3) + ' kg·m/s' : 'unbounded', cr.footJ > 0 ?", "cr ? tile(X + '’s source supplies', pushFig({ J: cr.supplied }), cr.footJ > 0 ?"), (A, "(cr.footJ > 0 ? ': about ' + fig3(cr.supplied) + ' in all' : '')", "(cr.footJ > 0 ? ': about ' + pushFig({ J: cr.supplied }) + ' in all' : '')"), (A, "everything ' + Y + ' gains (' + fig3(cr.pGain) + ')'", "everything ' + Y + ' gains (' + (cr.footJ > 0 ? fig3(cr.pGain) : pushFig({ J: cr.pGain })) + ')'"))
rv('P3-air-item-missing', 'r2', (A, "    if (cr && cr.Eair > 0) { const keY", "    if (false) { const keY"), (A, "cr.Eair > 0 ? (r.meanIt && splat ? 'where they meet (he means it), and ' + Y + '’s motion heating the air as he slides off' : Y + '’s motion, heating the air as he slides off') : 'where they meet (he means it)'", "'where they meet (he means it)'"))
rv('P4-steady-real-unlabelled', 'r2', (A, " + (dv.realUpper ? ' With real muscle the push falls as the hands speed up, so this speed is an upper bound (as in the shoving match).' : '')", ""))
rv('P5-lying-verdict-missing', 'r2', (A, "      else if (r.cantStand) v = X + ' can’t push:", "      else if (false) v = X + ' can’t push:"))
rv('P6-walkout-tile-full-push', 'r2', (A, "walkW === 'A' ? tile('Rex’s push', fmtN(r.walkPush),", "false ? tile('Rex’s push', fmtN(r.walkPush),"), (A, "(walkW === 'A' ? ' · can push ' : ' · pushes ')", "' · pushes '"), (A, "'. ' + W + ' could push with ' + fmtN(Dw) + ', more than what holds ' + L + ' (' + fmtN(Hl) + '), but ' + L + '’s push (' + fmtN(Dl) + ')", "'. ' + W + '’s push (' + fmtN(Dw) + ') beats what holds ' + L + ' (' + fmtN(Hl) + '), but ' + L + '’s (' + fmtN(Dl) + ')"))
rv('P6b-walkout-pushback-item', 'r2', (A, " + '. Its push back goes to his source (They take their own recoil): ' + (rw ? momFig(rw) : 'none') + ' over the walk-out, ' + L + '’s momentum plus what ' + L + '’s feet hand the ground.');", " + '.');"))
rv('P7-stroke-text-old', 'r2', (A, "    if (moved) items.push((r.outcome === 'bothShoved'\n", "    if (moved) items.push((true\n"), (A, "until x_Rex + x_Ollie = d = ", "over the stroke d = "))
rv('P8-bolted-shake-hidden', 'r2', (A, "      boltShake ? groundShakeChip(boltShake, cwB.surface, 'The push through ' + W + '’s bolts') : null,\n", ""), (A, "      if (boltShake) items.push('Bolted, '", "      if (false) items.push('Bolted, '"))
rv('P9-bars-finite-only', 'r2', (A, "    ].filter(Boolean).map((x) => (walkW &&", "    ].filter((x) => x && isFinite(x.value)).map((x) => (walkW &&"))
rv('P10-both-pulse-unread', 'r2', (A, "srcOf(both ? sB : cB, r.toGroundB), both ? srcOf(sA, r.toGroundA) : null]", "srcOf(cB, r.toGroundB)]"))
rv('P11-noanswer-from-top', 'r2', (A, "p.noAnswerIn = (v) => { for (const f of (memos[v || ''] || new Map()).values()) if (f.noAnswer) return f; return null; };", "p.noAnswerIn = () => null;"))
rv('P12-arm-elbow-chip-old', 'r2', (A, "r.outcome === 'pin' && r.winner !== side && r.loserElbow != null ? (isFinite(r.loserElbow)", "false ? (isFinite(r.loserElbow)"))
P13 = json.load(open(os.path.join(HERE, 'p13.json')))
rv('P13-arm-one-sided-verdict-old', 'r2', (A, P13['new'], P13['old']))
rv('P14-catch-switch-text-old', 'r2', (A, "v += ' Thrown back, it reaches Rex as plasma too, but Rex’s Never knocked back is ' + (b.fireball.knockAbsorbed ? 'on' : 'off') + ' (Their powers).' + pushText(b.fireball, 'Rex');", "v += ' Thrown back, it hits Rex the same way.' + pushText(b.fireball, 'Rex');"))
rv('P15-catch-return-blast-missing', 'r2', (A, "      if (fbB && !!fbB.knockAbsorbed !== !!knB &&", "      if (false &&"))
rv('P16-steady-harm-slide-only', 'all', (A, "const endB = dv ? dv.d + dv.slideB : 0;", "const endB = dv ? dv.slideB : 0;"))
rv('P17-match-harm-slide-only', 'all', (A, "const slA = moved && r.vA > 0 ? (r.xA || 0) + r.slideA : 0, slB = moved && r.vB > 0 ? (r.xB || 0) + r.slideB : 0;", "const slA = moved && r.vA > 0 ? r.slideA : 0, slB = moved && r.vB > 0 ? r.slideB : 0;"))
rv('P18-arm-about-unlimited', 'r2', (A, "const aboutN = (F) => (isFinite(F) ? 'about ' + fmtN(F) : 'an unbounded force');", "const aboutN = (F) => 'about ' + fmtN(F);"))
rv('P19-arm-full-unlimited', 'r2', (A, "he presses with ' + (isFinite(Pw) ? 'his full ' + fmtN(Pw) : 'unlimited force')", "he presses with his full ' + fmtN(Pw)"))
rv('P20-collide-harm-ride-air', 'r2', (A, "const rideAir = !!(cr && cr.Eair > 0 && !(r.meanIt && splat));", "const rideAir = false;"))
rv('P21-card-slide-only', 'r2', (S, '; in the shoving match, the steady push and Collide’s charge it counts how far the push or the charge carries him too).', ').'))
# ---- the review's surviving mutants (duo-r2-mutant-survivors): each must now fail a check
rv('M-N9-bothSlide-or', 'r2', (A, "const bothSlide = !!r.both && (r.slideA || 0) > near && (r.slideB || 0) > near;", "const bothSlide = !!r.both && ((r.slideA || 0) > near || (r.slideB || 0) > near);"))
rv('M-N11-mean-unguarded', 'r2', (A, "if (eff.mean && eff.p.factsAt(eff.never || !isFinite(eff.use) ? topU : eff.use, 'mean').meant)", "if (eff.mean)"))
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
    b = subprocess.run(['node', 'build.js'], cwd=d, capture_output=True, text=True)
    res = {}
    if b.returncode: res['build'] = b.stderr[-300:]
    if 'sec' in test:
        p = subprocess.run(['node', os.path.join(HERE, 'sec.js'), os.path.join(d, E), os.path.join(d, 'test/powers.js'), '6', '8'], cwd=d, capture_output=True, text=True)
        res['powers'] = [l[:200] for l in p.stdout.splitlines() if l.startswith('FAIL')] + ([p.stderr[-300:]] if p.returncode and not any(l.startswith('FAIL') for l in p.stdout.splitlines()) else [])
    mode = 'all' if 'all' in test else 'r2' if 'r2' in test else None
    if mode:
        p = subprocess.run(['node', os.path.join(HERE, 'blk.js'), os.path.join(d, 'test/shots.js'), d, mode], cwd=d, capture_output=True, text=True)
        res['page'] = [l[6:230] for l in p.stdout.splitlines() if l.startswith('FAILS')] + ([p.stderr[-300:]] if p.returncode else [])
    shutil.rmtree(os.path.join(d, 'dist'), ignore_errors=True)
    return name, res
names = [n for n in R if not only or n in only]
out = {}
with cf.ThreadPoolExecutor(max_workers=int(os.environ.get('W', '5'))) as ex:
    for name, res in ex.map(run, names):
        out[name] = res
        print(name, json.dumps(res)[:700], flush=True)
prev = {}
rp = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r3/copy/rv/results.json'
if os.path.exists(rp): prev = json.load(open(rp))
prev.update(out); json.dump(prev, open(rp, 'w'), indent=1)
