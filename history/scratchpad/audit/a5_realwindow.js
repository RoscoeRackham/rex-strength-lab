const { P, g, ctx, obj, D } = require('./lib.js');
const acts = {
  jump: (c) => P.jump(c), punch: (c) => P.punch(c), clap: (c) => P.clap(c), stomp: (c) => P.stomp(c),
  throwBall: (c) => P.throwObject(c, obj('baseball'), 0), throwShot: (c) => P.throwObject(c, obj('shot'), 37), throwCar: (c) => P.throwObject(c, obj('car'), 45),
};
const speed = { jump: (r) => r.v, punch: (r) => r.vFist, clap: (r) => r.vHand, stomp: (r) => r.vFoot, throwBall: (r) => r.v, throwShot: (r) => r.v, throwCar: (r) => r.v };
for (const [k, f] of Object.entries(acts)) {
  let start = null, end = null;
  for (let lg = 2.7; lg <= 34; lg += 0.01) {
    const r = f(ctx({ logKg: lg, mode: 'real', surface: 'granite', groundHolds: true }));
    const v = speed[k](r);
    if (v === 0 && lg > 4 && start == null) start = lg;
    if (start != null && end == null && v > 0) end = lg;
  }
  console.log(k.padEnd(10), 'real-mode speed == 0 for lift from 10^' + (start && start.toFixed(2)), 'to 10^' + (end && end.toFixed(2)), 'kg');
}
// detail one case: punch at Hulk-ish 1e8 kg real mode, granite
const c = ctx({ logKg: 8, mode: 'real', surface: 'granite', groundHolds: true });
const p = P.punch(c);
console.log('punch 1e8 kg real:', JSON.stringify({ F: p.F, v: p.vFist, E: p.E, stalled: p.push.stalled, sat: p.push.saturated, t: p.push.t }));
const th = P.throwObject(c, obj('shot'), 37);
console.log('shot 1e8 kg real:', JSON.stringify({ v: th.v, canMove: th.canMove, stalled: th.push.stalled }));
// Spider-Man tier & Thing tier in real mode
for (const t of D.tiers.filter(t => isFinite(t.liftKg))) {
  const cc = ctx({ kg: t.liftKg, mode: 'real', surface: 'concrete' });
  console.log(t.id.padEnd(10), 'real: punch v', P.punch(cc).vFist.toFixed(2), 'jump v', P.jump(cc).v.toFixed(2), 'shot v', P.throwObject(cc, obj('shot'), 37).v.toFixed(2), 'canMove', P.throwObject(cc, obj('shot'), 37).canMove);
}
