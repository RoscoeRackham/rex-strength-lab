const dir = process.argv[2];
global.window = {};
const P = require(dir + '/src/engine.js'); require(dir + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ctxOf = (F, x) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, x || {});
// the test's helper
const RE = /\b(F|E|v|ppv|depth|ratio|pressure|T|t|m|H|rho)\b/i;
const probe = { stepRate: -1.2, stride: -2, stance: -0.3, Eimp: -5, vFoot: -3, Eground: -2, holeDepth: -0.1, dm: -1, launch: -9, tau: -1, peakPressure: -1, Fpulse: -1, depth: -1, ratio: -1 };
console.log('helper flags:', Object.keys(probe).filter((k) => RE.test(k)).join(','));
// all negatives on HEAD across section 7's inputs, by key
const neg = new Map(), counted = { total: 0, checked: 0 };
const scan = (label, v, path) => {
  if (typeof v === 'number') { const k = path.split('.').pop(); counted.total++; if (RE.test(k)) counted.checked++; if (v < 0) { neg.set(label.split(' ')[0] + ':' + path, (neg.get(label.split(' ')[0] + ':' + path) || 0) + 1); } return; }
  if (v && typeof v === 'object' && !Array.isArray(v)) for (const k of Object.keys(v)) if (typeof v[k] !== 'function') scan(label, v[k], path + '.' + k);
};
for (const F of [1e3 * g, 90718 * g, 1e15 * g, Infinity]) for (const use of [1e-3, 1e2 * g, 1e6 * g, 1e20 * g, Infinity]) {
  const c = ctxOf(F, { use });
  for (const [mv, run] of [['jump', () => P.jump(c)], ['stomp', () => P.stomp(c)], ['punch', () => P.punch(c)], ['clap', () => P.clap(c)], ['sprint', () => P.sprint(c)]]) scan(mv + ' x', run(), '');
}
for (const b of [rex, ollie, P.makeBody({}), P.makeBody({ build: 'rex', H: 50, m: 3007 * Math.pow(50 / 3.048, 3) })]) for (const sf of D.surfaces) for (const pace of ['stroll', 'walk', 'brisk', 'fast']) for (const effort of [0, 0.25, 0.5, 0.75, 1]) scan('walk x', P.presence(b, sf, { pace, effort }).step, 'step');
for (const E of [0, 1, 1e10, 1e20, 4.2e23, 1e30, 1e40, 1e60]) for (const f of [0, 0.5, 1]) { scan('grown x', P.grownBody(rex, E, f), ''); scan('gradual x', P.gradualGrowth(rex, E, f), ''); scan('instant x', P.instantGrowth(rex, E, f), ''); scan('runaway x', P.runawayGrowth(rex, E, f), ''); }
console.log('numeric leaves scanned', counted.total, 'of which key matches regex', counted.checked);
console.log('negative paths on this engine:', [...neg.entries()].map(([k, n]) => k + ' x' + n).join('\n  '));
