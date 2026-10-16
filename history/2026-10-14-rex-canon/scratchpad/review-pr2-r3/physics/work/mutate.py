import sys, shutil, os, subprocess
base='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3/physics'
muts = {
 'r2-copy1-bolted-pace': ("    if (ctx.ownRecoil) {\n      usable = driveStrength(ctx);", "    if (ctx.ownRecoil && ctx.anchor !== 'bolted') {\n      usable = driveStrength(ctx);"),
 'r2-copy1-no-walkPush': ("if (ctx.ownRecoil && net > 0) ownLimit.walkPush =", "if (false && ctx.ownRecoil && net > 0) ownLimit.walkPush ="),
 'r2-code2-sinkRaw': ("sinkRatioRaw: (ctxC.ownRecoil ? (M + m) * K.g : anc.N(F))", "sinkRatioRaw: (anc.N(F))"),
 'r2-code5-armT': ("T: limbPulse(bw) };\n", "T: ownPin ? out.pin.t : limbPulse(bw) };\n"),
 'r3-leg-cap': ("aFeet = anc.R / body.m;", "aFeet = Math.min(anc.R, 1.4 * usable) / body.m;"),
}
name=sys.argv[1]
d=os.path.join(base,'mut',name)
if os.path.exists(d): shutil.rmtree(d)
shutil.copytree(os.path.join(base,'repo','rex-strength-lab'), d, ignore=shutil.ignore_patterns('shots','dist','research','history'))
p=os.path.join(d,'src','engine.js'); s=open(p).read(); a,b=muts[name]
assert s.count(a)==1, (name, s.count(a))
open(p,'w').write(s.replace(a,b))
r=subprocess.run(['node','test/powers.js','--skip-off'],cwd=d,capture_output=True,text=True,timeout=900)
out=r.stdout
fails=[l for l in out.splitlines() if l.startswith('FAIL')]
print(name, 'exit', r.returncode, out.strip().splitlines()[-1] if out.strip() else r.stderr[-500:])
for f in fails[:6]: print('   ', f[:300])
