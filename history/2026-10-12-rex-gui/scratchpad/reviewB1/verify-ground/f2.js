const { P, D, g, ON, OFF, ctx } = require('./h.js');
const M = P.RESTRAINT.MOVES.throw;
const bus = D.objects.find(o => o.id === 'bus');
function run(surf, pw, anchor, dial, use) {
  const c = Object.assign(ctx(dial, { surf, pw }), { anchor });
  const opt = Object.assign({ obj: bus, angle: 45, near: 5, body: c.body, surface: c.surface, anchor }, pw);
  const r = M.run(Object.assign({}, c, { use: use * g }), opt);
  const s = M.shake(r, opt), land = M.landShake(r, opt);
  return { v: r.v, sink: r.sinkRatio, ppv5: P.ppvAt(s, 5) * 1000, land5: P.ppvAt(land, 5) * 1000, tg: r.toGround && r.toGround.J, T: r.toGround && r.toGround.T };
}
// (a) granite, 0% air, own recoil off, keepForm off; unbreakable on vs off; friction
const A0 = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const A1 = Object.assign({}, A0, { unbreakable: true });
console.log('(a) off', run('granite', A0, 'friction', 1e9, 9.38e6));
console.log('(a) on ', run('granite', A1, 'friction', 1e9, 9.38e6));
// (b) bolted concrete own recoil off vs on
const B1 = Object.assign({}, A0, { ownRecoil: true });
console.log('(b) bolted off', run('concrete', A0, 'bolted', 1e7, 1e7));
console.log('(b) bolted rec', run('concrete', B1, 'bolted', 1e7, 1e7));
// presets
function pre(surf, pw, anchor, dial) {
  const c = Object.assign(ctx(dial, { surf, pw }), { anchor });
  const p = P.RESTRAINT.planNow('throw', c, { obj: bus, angle: 45 });
  const o = {}; for (const id of ['rattle', 'plaster']) { const x = p.ensure('preset:' + id); o[id] = x.never ? 'never' : (x.use / g).toPrecision(3); } return o;
}
console.log('granite friction 1e9 unb off', pre('granite', A0, 'friction', 1e9), 'unb on', pre('granite', A1, 'friction', 1e9));
console.log('concrete bolted 1e7 rec off', pre('concrete', A0, 'bolted', 1e7), 'rec on', pre('concrete', B1, 'bolted', 1e7));
console.log('granite bolted 1e9 rec off', pre('granite', A0, 'bolted', 1e9), 'rec on', pre('granite', B1, 'bolted', 1e9));
