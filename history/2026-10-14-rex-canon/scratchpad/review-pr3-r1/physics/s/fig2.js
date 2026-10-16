const { P, D, g, surf, obj, R0, F0, ON, OFF4, M, cOf, oOf, planOf, sig } = require('./common.js');
const person = obj('person');
const show = (label, F, x, sp) => {
  const p = planOf(F, x, sp);
  const gl = p.goal(), ce = p.ceiling();
  const hz = p.hazards().map(h => h.id + ':' + (h.never ? 'never' : h.onlyUnlimited ? 'unl' : sig(Math.sqrt(h.use*h.below) / g, 4)));
  const pr = p.presets().map(h => h.id + ':' + (h.never ? 'never' : h.onlyUnlimited ? 'unl' : sig(Math.sqrt(h.use*h.below) / g, 4)));
  const rAll = p.run(isFinite(F) ? F : Infinity);
  const sh = M.throw.shake(rAll, p.opt);
  console.log(label, 'sp', sp, '| goal', sig(gl.use / g), '| ceiling', ce.by, sig(Math.sqrt(ce.below * ce.use) / g), '\n   hazards', hz.join(' '), '\n   presets', pr.join(' '),
   '\n   all-out v', sig(rAll.v), 'range', rAll.flight && sig(rAll.flight.range), 'vImp', rAll.flight && sig(rAll.flight.vImpact), 'plasterReach', sh ? sig(P.plasterReach(sh)) : null);
};
const tag = process.env.REPO ? 'BASE' : 'PR3';
console.log('=====', tag);
for (const s of [1, 0.5, 0]) for (const sp of [true, false]) show('air ' + s, F0, { airAbsorb: s }, sp);
for (const sp of [true, false]) show('0% others off', F0, OFF4, sp);
for (const sp of [true, false]) show('1e9', 1e9 * g, {}, sp);
