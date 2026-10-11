const {P,D,g,ctx,obj}=require('./h.js');
for (const [mode, anchor, oid, ang, surf] of [['real','friction','car',45,'concrete'],['real','braced','car',45,'concrete'],['real','friction','tank',30,'concrete'],['real','friction','shot',37,'concrete'],['real','friction','baseball',0,'concrete'],['comic','friction','car',45,'concrete'],['real','friction','car',45,'sand'],['real','friction','car',10,'concrete']]) {
  const rows = [];
  for (const lg of [4.9577, 6, 8, 12, 20, 34, 'inf']) {
    const c = ctx({mode, anchor, surface: surf, logKg: lg === 'inf' ? 34 : lg, inf: lg === 'inf'});
    const r = P.throwObject(c, obj(oid), ang);
    rows.push(lg + ':' + (r.canMove ? r.v.toPrecision(4) + 'm/s rec' + r.recoilV.toPrecision(3) + (r.heldBack ? ' HB' : '') + ' R' + (r.flight.range).toPrecision(3) : 'X'));
  }
  console.log(mode, anchor, oid, ang, surf, '|', rows.join(' | '));
}
