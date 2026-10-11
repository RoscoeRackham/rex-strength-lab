const {P,D,g,ctx,obj}=require('./h.js');
for (const [mode, surf, oid, lg, anchor] of [['real','concrete','baseball',4.9577,'friction'],['real','concrete','shot',4.9577,'friction'],['comic','concrete','baseball',4.9577,'friction'],['real','granite','baseball',34,'braced'],['real','concrete','baseball',3,'friction'],['real','sand','shot',2.708,'friction'],['comic','sand','shot',2.708,'friction'],['real','concrete','car',4.9577,'friction']]) {
  const c = ctx({mode, surface: surf, logKg: lg, anchor});
  const r = P.throwObject(c, obj(oid), 45);
  const p = r.push;
  // peak actual force in the push ~ ? estimate impulse: pB = momentum; duration t
  console.log(mode, surf, oid, 'lg', lg, 'v', r.v.toFixed(2), 'sinkRatio', r.sinkRatio.toExponential(3), 'Nmax', r.anchor.Nmax.toExponential(3), 'F', r.F.toExponential(3), 'push t', p.t.toExponential(3), 'avgF=pB/t', (p.pB/p.t).toExponential(3), 'heldBack', r.heldBack, 'basis', r.basis);
}
