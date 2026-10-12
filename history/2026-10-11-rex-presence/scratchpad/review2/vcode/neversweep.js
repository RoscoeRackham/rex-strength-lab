const repo = process.argv[2];
global.window = {};
const P = require(repo + '/rex-strength-lab/src/engine.js');
require(repo + '/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const moves = [['jump', { target: 3 }], ['stomp', {}], ['punch', { target: 10.4 }], ['clap', { target: 6 }], ['sprint', { target: 12.42 }], ['pull', { obj: obj('bus'), target: 10 }]];
let n = 0, bad = [];
for (const mode of ['comic', 'real']) for (const sf of D.surfaces) for (const kg of [90718, 1e7, 1e12, 1e25, Infinity]) for (const [mv, o] of moves) {
  const c = { F: kg * g, mode, body: rex, surface: sf, groundHolds: false, anchor: 'friction' };
  const p = R.planNow(mv, c, Object.assign({ near: 5 }, o)); n++;
  const M = R.MOVES[mv], all = p.run(undefined);
  const w = [];
  if (p.goal().never && M.goal(all, p.opt)) w.push('goal');
  for (const h of R.HAZARDS) { const r = p.result('hazard:' + h.id); if (r.never && h.test(M, all, p.opt)) w.push('hazard:' + h.id); }
  for (const h of R.PRESETS) { const r = p.result('preset:' + h.id); if (r.never && h.test(M, all, p.opt)) w.push('preset:' + h.id); }
  if (w.length) bad.push(mv + ' ' + mode + ' ' + sf.id + ' ' + kg + ': ' + w.join(','));
}
console.log(n, 'plans;', bad.length, 'with never-but-all-out-does');
console.log(bad.slice(0, 30).join('\n'));
