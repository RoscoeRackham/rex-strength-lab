const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const M = P.RESTRAINT.MOVES.stomp;
for (const F of [90718*g, 1e9*g, Infinity]) {
  const c = ctxOf(F);
  const p = P.RESTRAINT.planNow('stomp', c, {near:5});
  console.log('F', F/g, 'ceiling', JSON.stringify(p.ceiling()), 'ground job', JSON.stringify(p.result('hazard:ground')));
  const row = [];
  for (const kg of [1000, 3000, 5000, 5100, 6000, 1e4, 3e4, 5e4]) { const r = M.run(Object.assign({}, c, {use: kg*g}), p.opt); row.push(kg+':v'+r.vFoot.toPrecision(3)+',h'+r.holeDepth.toPrecision(2)+','+(r.basis||'comic')); }
  console.log('  ', row.join(' '));
}
