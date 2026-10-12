global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const bad = [], neg = new Map();
const scan = (label, v, path, d) => {
  if (d > 6) return;
  if (typeof v === 'number') { if (Number.isNaN(v)) bad.push(label + path + ' NaN'); else if (v < 0) neg.set(path, (neg.get(path) || 0) + 1); return; }
  if (v && typeof v === 'object' && !Array.isArray(v)) for (const k of Object.keys(v)) if (typeof v[k] !== 'function' && k !== 'path' && k !== 'gLoad') scan(label, v[k], path + '.' + k, d + 1);
};
let n = 0;
for (const F of [1e3 * g, 90718 * g, 1e15 * g, Infinity]) for (const use of [1e-3, 1e2 * g, 1e6 * g, 1e20 * g, Infinity]) for (const mode of ['comic', 'real']) for (const sid of ['concrete', 'sand', 'softclay', 'ice']) {
  const c = { F, use, mode, body: rex, surface: D.surfaces.find((s) => s.id === sid), groundHolds: false, anchor: 'friction', gentleHold: false, safePassenger: false };
  for (const id of ['baseball', 'car', 'person', 'bus', 'liberty']) { const o = D.objects.find((x) => x.id === id); scan('throw ' + id + ' ' + F + ' ' + use + ' ' + mode + ' ' + sid, P.throwObject(c, o, 45), '', 0); scan('pull', P.pull(c, o), '.pull', 0); scan('lift', P.lift(c, o), '.lift', 0); n += 3; }
  for (const [mv, run] of [['jump', () => P.jump(c)], ['stomp', () => P.stomp(c)], ['punch', () => P.punch(c)], ['clap', () => P.clap(c)], ['sprint', () => P.sprint(c)]]) { scan(mv, run(), '.' + mv, 0); n++; }
}
console.log('runs', n, 'NaN', bad.length, bad.slice(0, 5));
console.log('negative values by path (not flagged by presence.js unless the key is F|E|v|ppv|depth|ratio|pressure|T|t|m|H|rho):');
for (const [k, v] of [...neg.entries()].sort()) console.log(' ', v, k);
