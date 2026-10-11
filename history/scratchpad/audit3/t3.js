const {P,D,g,ctx,obj}=require('./h.js');
for (const surf of ['sand','gravel','softclay','stiffclay','asphalt','concrete','ice','steel','granite'])
for (const lg of [3.5, 4.9577, 6, 8, 12]) {
  const c = ctx({mode:'real', surface: surf, logKg: lg});
  const r = P.jump(c);
  const rf = P.jump(Object.assign({}, c, {groundHolds:true}));
  if (r.heldBack || r.groundFails) console.log(surf, lg, 'heldBack', r.heldBack, 'fails', r.groundFails, 'apex', r.flight.apex.toFixed(3), 'rigid', rf.flight.apex.toFixed(3), 'v', r.v.toFixed(3), rf.v.toFixed(3), 'sink', (r.sink*100).toFixed(2)+'cm');
}
