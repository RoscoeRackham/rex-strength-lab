import json, os, shutil, subprocess, sys
SRC = '/home/user/rex-strength-lab/rex-strength-lab'
HERE = os.path.dirname(os.path.abspath(__file__))  # round 3 copy: re-run on review round 3's engine
eng = open(os.path.join(SRC, 'src/engine.js'), encoding='utf-8').read()
M = {
 '1-charger-slows': [("el: { vA: v, vT: vBb, pA, pT: pBb } };", "el: { vA: momentumToV(pA - pBb, mA), vT: vBb, pA: pA - pBb, pT: pBb } };"),
                     ("stop: { J: pA, E: KA } };", "stop: { J: Math.max(0, pA - pGain), E: KA } };")],
 '2-one-hit-not-carried': [("const vB = bounce ? vBb : v, pGain = bounce ? pBb : pB;", "const vB = bounce ? vBb : 0, pGain = bounce ? pBb : 0;")],
 '3-source-wrong-momentum': [("supplied: pGain + footJ,", "supplied: pGain,")],
 '4-no-paradox-held': [("const lim = holdsGround(cB) && (cB.anchor === 'bolted' || !horiz) ? hb.why : null;", "const lim = null;")],
 '5-paradox-not-held': [("const lim = holdsGround(cB) && (cB.anchor === 'bolted' || !horiz) ? hb.why : null;", "const lim = (cB.anchor === 'bolted' || !horiz) ? hb.why : null;")],
 '6-shoving-match-deadlocks': [("const own = !!(cA.ownRecoil && cB.ownRecoil);\n    const pushOf", "const own = false;\n    const pushOf")],
 '7-steady-push-capped': [("const DA = own ? (lying ? 0 : cA.F) : Math.min(cA.F, RA);", "const DA = Math.min(cA.F, RA);")],
 '8-fireball-pushes-with-nkb': [("out.push = nkb ? { recoilV: 0, earthRecoilV: 0 } : { recoilV:", "out.push = { recoilV:")],
 '9-hit-energy-real-by-default': [("out.hitAbsorbed = { E: meanIt || bounce ? 0 : Qs };", "out.hitAbsorbed = { E: 0 };"),
                                  ("out.Elocal = (meanIt && !bounce ? Qs : 0) +", "out.Elocal = (!bounce ? Qs : 0) +")],
 # extra: each of this pull request's other changes reverted
 'x1-bounce-overcount-back': [("else if (out.partial && splat) out.toGround", "else if (out.partial) out.toGround")],
 'x2-arm-reading-A': [("padLoad = (aStr ? cA : cB).ownRecoil ? Pl : Pl +", "padLoad = (aStr ? cA : cB).ownRecoil ? 0 : Pl +"),
                      ("let tableBreaks = Math.min(PA, PB) > tableLat,", "let tableBreaks = !(cA.ownRecoil && cB.ownRecoil) && Math.min(PA, PB) > tableLat,")],
 'x3-arm-old-pad': [("padLoad = (aStr ? cA : cB).ownRecoil ? Pl : Pl +", "padLoad = Pl +")],
 'x4-both-at-once-old': [("if (!(cA.ownRecoil && cB.ownRecoil)) return Object.assign(shove(cP, cT), { shover });", "return Object.assign(shove(cP, cT), { shover });")],
 'x5-standing-press-capped': [("const capA = tableBreaks && !cA.ownRecoil, capB = tableBreaks && !cB.ownRecoil;", "const capA = tableBreaks, capB = tableBreaks;")],
 'x6-fireball-energy-all-real': [("const Ereal = nkb ? Egap + (ctxC.meanIt ? Earr : 0) : E;", "const Ereal = E;")],
 'x7-walkout-old-pace': [("a = Math.min(aL, aW);", "a = (Dw - Hl) / (cw.body.m + cl.body.m);")],
 'x8-rock-dipole-kept': [("rockLoad(out.contact, cB, dSep, cA.anchor === 'bolted' && !own);", "rockLoad(out.contact, cB, dSep, cA.anchor === 'bolted');")],
 'x9-immovable-own': [("const own = !!cA.ownRecoil && !cB.immovable;", "const own = !!cA.ownRecoil;")],
}
only = sys.argv[1:]
import concurrent.futures as cf
def one(name):
    reps = M[name]
    s = eng
    for a, b in reps:
        assert s.count(a) == 1, (name, a[:70], s.count(a))
        s = s.replace(a, b)
    d = os.path.join(HERE, name)
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(os.path.join(d, 'src')); os.makedirs(os.path.join(d, 'test'))
    open(os.path.join(d, 'src/engine.js'), 'w', encoding='utf-8').write(s)
    shutil.copy(os.path.join(SRC, 'src/data.js'), os.path.join(d, 'src/data.js'))
    for f in ['powers.js', 'powers-off-cases.js']: shutil.copy(os.path.join(SRC, 'test', f), os.path.join(d, 'test', f))
    p = subprocess.run(['node', 'test/powers.js', '--skip-off'], cwd=d, capture_output=True, text=True)
    fails = [l[:150] for l in p.stdout.splitlines() if l.startswith('FAIL')]
    crash = p.returncode != 0 and not fails
    return name, {'exit': p.returncode, 'fails': fails, 'crash': (p.stderr[-300:] if crash else '')}
res = {}
with cf.ThreadPoolExecutor(max_workers=int(os.environ.get('W', '6'))) as ex:
    for name, r in ex.map(one, [n for n in M if not only or n in only]):
        res[name] = r
        print(name, 'exit', r['exit'], len(r['fails']), 'failing checks', ('CRASH ' + r['crash'][-200:]) if r['crash'] else '', flush=True)
        for l in r['fails']: print('   ', l)
json.dump(res, open(os.path.join(HERE, 'results.json'), 'w'), indent=1)
