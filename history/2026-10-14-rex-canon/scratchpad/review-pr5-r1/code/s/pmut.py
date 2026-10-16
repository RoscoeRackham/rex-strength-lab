import json, os, shutil, subprocess, sys
BASE = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/code/repo/rex-strength-lab'
WORK = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/code/pmut'
MUT = [
 ('control-no-stomp-tile', "bf.relativistic ? speedTile('He gets launched', r.vBody, '') : tile(r.vBody > 2 ? 'He gets launched' : 'Recoil hop', r.vBody > 0.5 ? (bf.escaped ? 'Escapes Earth' : fmtDist(bf.apex) + ' up') : 'none', r.vBody > 0.5 ? speedOnly(r.vBody) : ''),\n      shimmerTile(tb)));", "bf.relativistic ? speedTile('He gets launched', r.vBody, '') : tile(r.vBody > 2 ? 'He gets launched' : 'Recoil hop', r.vBody > 0.5 ? (bf.escaped ? 'Escapes Earth' : fmtDist(bf.apex) + ' up') : 'none', r.vBody > 0.5 ? speedOnly(r.vBody) : ''),\n      null));"),
 ('throw-effort-allout', "const tb = takenBack('throw', r, Object.assign({}, c, { obj: o, angle: state.angle }));", "const cAll = Object.assign({}, c); delete cAll.use; const tb = takenBack('throw', P.throwObject(cAll, o, state.angle), Object.assign({}, cAll, { obj: o, angle: state.angle }));"),
 ('throw-angle-45', "const tb = takenBack('throw', r, Object.assign({}, c, { obj: o, angle: state.angle }));", "const tb = takenBack('throw', r, Object.assign({}, c, { obj: o, angle: 45 }));"),
 ('wrestle-angle-45', "whoA: nA === 'Rex' ? 'rex' : 'ollie', angle: state.wAngle });", "whoA: nA === 'Rex' ? 'rex' : 'ollie', angle: 45 });"),
 ('backthrow-loose', "const backThrow = a.result === 'caught' && a.catch && !a.catch.carried && !a.bursts && !(a.recoil && a.recoil.outOfRange);", "const backThrow = a.result === 'caught' && a.catch;"),
 ('floor-note-gone', "+ (gl.word === 'too faint to see' ? ' The lab draws no glow below ' + floorRef.short + ' (' + fmtSI(floorRef.J, 'J') + '), its floor: a proposal, not canon.' : '')", "+ ''"),
 ('glow-linear', "s = gl.none ? 0 : gl.strength, a = Math.sqrt(s);", "s = gl.none ? 0 : gl.strength, a = s;"),
]
only = sys.argv[1:]
src = open(BASE + '/src/app.html').read()
for name, a, b in MUT:
    if only and name not in only: continue
    assert src.count(a) == 1, (name, src.count(a))
    d = WORK + '/' + name
    if os.path.exists(d): shutil.rmtree(d)
    shutil.copytree(BASE, d, ignore=shutil.ignore_patterns('shots', 'node_modules'))
    open(d + '/src/app.html', 'w').write(src.replace(a, b))
    subprocess.run(['node', 'build.js'], cwd=d, capture_output=True)
    p = subprocess.run(['node', 'test/shots.js', '--pr5'], cwd=d, capture_output=True, text=True)
    prob = [l[:300] for l in p.stdout.splitlines() if l.startswith('PROBLEM')]
    print(name, 'KILLED' if p.returncode else 'SURVIVED', prob[:1], flush=True)
    shutil.rmtree(d)
