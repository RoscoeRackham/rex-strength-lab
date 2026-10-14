const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
for (const kg of [90718, 1e6, 1e8]) {
  const c = Object.assign(ctx({ F: kg*K.g }), ON);
  const r = P.punch(c);
  const s = P.impulseSource(c.surface, r.toGround.J, r.toGround.T);
  console.log('punch', kg.toExponential(2), 'vFist', r.vFist.toFixed(1), 'push.t', r.push.t.toExponential(2), 'J', r.toGround.J.toExponential(2), 'T', r.toGround.T.toExponential(2), 'ppv5', (P.ppvAt(s,5)*1000).toFixed(2), 'plaster reach', P.plasterReach(s).toFixed(1), 'feel', P.ppvReach(s, P.VIB.TH.feel).toFixed(1));
}
// the punch effort presets with powers on
const R = P.RESTRAINT;
const c = Object.assign(ctx({ F: 1e9*K.g }), ON);
const pl = R.planNow('punch', c, { target: 100 });
console.log('punch presets ON', pl.presets().map(p => p.id + '=' + (p.never ? 'never' : (p.use/K.g).toExponential(2))).join(' '), 'ceiling', JSON.stringify(pl.ceiling()));
const c0 = Object.assign(ctx({ F: 1e9*K.g }));
const pl0 = R.planNow('punch', c0, { target: 100 });
console.log('punch presets OFF', pl0.presets().map(p => p.id + '=' + (p.never ? 'never' : (p.use/K.g).toExponential(2))).join(' '), 'ceiling', JSON.stringify(pl0.ceiling()));
