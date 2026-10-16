const load = (R) => { const P = require(R + '/rex-strength-lab/src/engine.js'); global.window = {}; require(R + '/rex-strength-lab/src/data.js'); return { P, D: window.DINO_DATA }; };
const B = process.argv[2];
const N = load(B + '/repo'); for (const k of Object.keys(require.cache)) delete require.cache[k];
const O = load(B + '/base');
const run = (E, fn) => { const { P, D } = E, g = P.K.g; const body = (b) => P.makeBody(Object.assign({ build: b }, P.DEFAULT_BODIES[b]));
  const mk = (b, o) => Object.assign({ F: 90718.474 * g, mode: 'comic', body: body(b), surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: false, safePassenger: true }, o || {});
  try { return JSON.stringify(fn(P, D, g, mk), (k, v) => (typeof v === 'number' && !isFinite(v) ? String(v) : v)); } catch (e) { return 'ERR ' + e.message; } };
let n = 0, diff = 0; const ex = [];
const cmp = (lab, fn) => { n++; const a = run(N, fn), b = run(O, fn); if (a !== b) { diff++; if (ex.length < 12) ex.push(lab + '\n  new ' + a.slice(0, 300) + '\n  old ' + b.slice(0, 300)); } };
const powSets = [{}, { airAbsorb: 0, keepForm: false, unbreakable: false, safePassenger: false }, { unbreakable: false }, { keepForm: false }, { mode: 'real' }, { surface: 'ice' }, { surface: 'soil' }];
const Fs = [2570, 90718.474, 1e6, 1e9, 1e20, Infinity];
const ancs = [['friction', 'friction'], ['bolted', 'friction'], ['friction', 'bolted'], ['bolted', 'bolted']];
for (const ps of powSets) for (const kg of Fs) for (const [a1, a2] of ancs) for (const nkb of [false, true]) {
  const mo = (b, anc, extra) => (P, D, g, mk) => mk(b, Object.assign({}, ps, ps.surface ? { surface: D.surfaces.find((s) => s.id === ps.surface) } : {}, { F: kg * g, anchor: anc, noKnockback: nkb }, extra || {}));
  const lab = JSON.stringify([ps, kg, a1, a2, nkb]);
  const R = (P, D, g, mk) => mo('rex', a1)(P, D, g, mk), Ol = (P, D, g, mk) => mo('ollie', a2)(P, D, g, mk);
  cmp('pushMatch ' + lab, (P, D, g, mk) => P.pushMatch(R(P, D, g, mk), Ol(P, D, g, mk)));
  cmp('standoff ' + lab, (P, D, g, mk) => P.COLLIDE ? P.COLLIDE.standoff(Ol(P, D, g, mk), R(P, D, g, mk)) : P.standoff(Ol(P, D, g, mk), R(P, D, g, mk)));
  cmp('shove ' + lab, (P, D, g, mk) => P.shove(R(P, D, g, mk), Ol(P, D, g, mk)));
  cmp('shoveBoth ' + lab, (P, D, g, mk) => P.shoveBoth(R(P, D, g, mk), Ol(P, D, g, mk)));
  cmp('arm ' + lab, (P, D, g, mk) => P.armWrestle(R(P, D, g, mk), Ol(P, D, g, mk)));
  cmp('lift ' + lab, (P, D, g, mk) => P.liftPartner(R(P, D, g, mk), Ol(P, D, g, mk)));
  for (const src of ['sprint', 'jump', 'stomp', 'set']) for (const bounce of [false, true])
    cmp('collide ' + src + bounce + lab, (P, D, g, mk) => { const r = P.collide(Ol(P, D, g, mk), R(P, D, g, mk), { source: src, gb: 1e-6, bounce }); return r; });
}
console.log(n + ' calls, ' + diff + ' differ'); console.log(ex.join('\n'));
