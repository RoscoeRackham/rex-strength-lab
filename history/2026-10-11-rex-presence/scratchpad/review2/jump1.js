const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const R = P.RESTRAINT, M = R.MOVES.jump;
const cal = P.makeBody({});
for (const [name, body, Fkg, mode, sid, target] of [['rex', rex, 1e7, 'comic', 'concrete', 3], ['rex', rex, 1e12, 'comic', 'ice', 3], ['cal', cal, 1e7 * 180 / 3007, 'comic', 'softclay', 3], ['rex', rex, 1e7, 'real', 'sand', 0.3]]) {
  const c = { F: Fkg * g, mode, body, surface: surf(sid), groundHolds: false, anchor: 'friction' };
  const p = R.planNow('jump', c, { near: 5, target });
  console.log('===', name, Fkg.toPrecision(3), mode, sid, 'target', target, 'goal', JSON.stringify(p.goal()).slice(0, 90), 'ceiling', JSON.stringify(p.ceiling()));
  console.log('   hazards:', R.HAZARDS.map((h) => { const r = p.result('hazard:' + h.id); return h.id + ':' + (r.never ? 'never' : (r.use / g).toPrecision(3)); }).join(' '));
  const row = [];
  for (let lg = Math.log10(p.lo / g); lg <= Math.log10(Math.min(p.hi, 1e14 * g) / g) + 1e-9; lg += 0.5) {
    const r = p.run(Math.pow(10, lg) * g);
    row.push(lg.toFixed(1) + ':v' + r.v.toPrecision(4) + (r.heldBack ? 'h' : '') + (r.basis === 'real' ? 'R' : '') + ' apex' + (r.flight ? r.flight.apex.toPrecision(3) : '-') + ' [' + R.HAZARDS.filter((h) => h.test(M, r, p.opt)).map((h) => h.id).join(',') + ']');
  }
  console.log('   ' + row.join('\n   '));
}
