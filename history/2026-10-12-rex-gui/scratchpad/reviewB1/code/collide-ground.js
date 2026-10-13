global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, surf = D.surfaces.find((s) => s.id === 'concrete');
const lo = P.W8.WALK_LOAD * 3007 * g / P.MUSCLE.jump.forceFrac;
const base = { mode: 'comic', surface: surf, airAbsorb: 1, keepForm: true, ownRecoil: true };
for (const kg of [lo / g, 1000, 3000, 5000, 7860, 9000]) {
  const F = kg * g;
  for (const ub of [true, false]) {
    const cA = Object.assign({ F, body: P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }), anchor: 'friction', unbreakable: ub }, base);
    const cB = Object.assign({ F, body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), anchor: 'bolted', unbreakable: ub }, base);
    const r = P.collide(cA, cB, { source: 'sprint' });
    const rk = r.rock; const ground = !!(rk && !rk.comic && (rk.planet || !isFinite(rk.rT) || rk.rT >= 0.05));
    console.log((kg).toFixed(0), 'kg', ub ? 'unbreakable' : 'real ground', r.outcome, 'rock', rk && (rk.comic ? 'comic' : 'rT=' + rk.rT.toFixed(3) + ' m'), 'ground breaks:', ground, r.toGround ? 'toGround J=' + r.toGround.J.toFixed(0) : '');
  }
}
console.log('lo =', (lo / g).toFixed(0), 'kg');
{
  const brk = (kg) => { const F = kg * g; const cA = Object.assign({ F, body: P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }), anchor: 'friction', unbreakable: false }, base); const cB = Object.assign({ F, body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), anchor: 'bolted', unbreakable: false }, base); const r = P.collide(cA, cB, { source: 'sprint' }); const rk = r.rock; return !!(rk && !rk.comic && (rk.planet || !isFinite(rk.rT) || rk.rT >= 0.05)); };
  let a = 3000, b = 5000; for (let i = 0; i < 40; i++) { const m = Math.sqrt(a * b); if (brk(m)) b = m; else a = m; } console.log('real ground: rock cracks 5 cm round his bolts from about', b.toFixed(0), 'kg (', (100 * b / (100 * 907.18474)).toFixed(1), '% of the default dial)');
}
