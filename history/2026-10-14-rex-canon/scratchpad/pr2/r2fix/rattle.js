// The throw's rattle preset at the page's default dial (100 short tons), all four powers on, near 5 m, goal 30 m:
// main's engine vs this branch's, for the heavy throwables on every surface, every degree from 0 to 90.
// Usage: node rattle.js [objs] [surfaces]
global.window = {};
const MAIN = __dirname + '/main/src/', BR = '/home/user/rex-strength-lab/rex-strength-lab/src/';
const load = (dir) => { delete require.cache[require.resolve(dir + 'engine.js')]; delete require.cache[require.resolve(dir + 'data.js')]; global.window = {}; const P = require(dir + 'engine.js'); require(dir + 'data.js'); return { P, D: window.DINO_DATA }; };
const A = load(MAIN), B = load(BR);
const objs = (process.argv[2] || 'car,pickup,bus,semi,tank,loco').split(','), surfs = process.argv[3] ? process.argv[3].split(',') : B.D.surfaces.map((s) => s.id);
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const rattle = (E, oid, sid, ang) => {
  const { P, D } = E, g = P.K.g, body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
  const c = Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === sid), anchor: 'friction' }, ON);
  const p = P.RESTRAINT.plan('throw', c, { obj: D.objects.find((o) => o.id === oid), angle: ang, target: 30, near: 5 });
  const r = p.ensure('preset:rattle');
  return r.never ? 'never' : Math.round(r.use / g);
};
const moved = [];
for (const oid of objs) for (const sid of surfs) {
  if (!B.D.surfaces.find((s) => s.id === sid) || !B.P.groundOf(B.D.surfaces.find((s) => s.id === sid))) continue;
  for (let ang = 0; ang <= 90; ang++) {
    const a = rattle(A, oid, sid, ang), b = rattle(B, oid, sid, ang);
    if (a !== b) moved.push([oid, sid, ang, a, b]);
  }
}
for (const m of moved) console.log(m.join(' '));
console.log('moved', moved.length, 'never', moved.filter((m) => m[4] === 'never').length);
