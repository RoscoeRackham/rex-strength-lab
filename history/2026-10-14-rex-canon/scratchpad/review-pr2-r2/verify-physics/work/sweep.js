const B='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r2/verify-physics/';
function load(dir) {
  for (const k of Object.keys(require.cache)) delete require.cache[k];
  global.window = {};
  const P = require(dir + '/engine.js'); require(dir + '/data.js'); return { P, D: window.DINO_DATA };
}
const engines = { main: load(B + 'mainsrc'), br: load(B + 'repo/rex-strength-lab/src') };
const objs = (process.env.OBJS || 'baseball,shot,person,bowling,piano,motorcycle,car,pickup,bus,semi,tank,loco').split(',');
const angles = (process.env.ANG || '0,15,30,45,60,75,90').split(',').map(Number);
const surfs = (process.env.SURF || 'sand,gravel,softclay,stiffclay,asphalt,concrete,ice,steel,granite').split(',');
const kgf = (P, u) => u === Infinity ? 'inf' : (u / P.K.g);
const fmt = (P, r) => r == null ? 'null' : r.never ? 'never' : r.onlyUnlimited ? 'unl' : Math.round(r.use / P.K.g);
const out = [];
let nMoved = 0, nNever = 0, otherMoved = [];
for (const sid of surfs) for (const oid of objs) for (const ang of angles) {
  const res = {};
  for (const [name, { P, D }] of Object.entries(engines)) {
    const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
    const surface = D.surfaces.find(s => s.id === sid), obj = D.objects.find(o => o.id === oid);
    const ctx = { F: 90718.474 * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, groundHolds: false };
    const p = P.RESTRAINT.planNow('throw', ctx, { obj, angle: ang, target: 30, near: 5 });
    const pres = {}; for (const r of p.presets()) pres[r.id] = fmt(P, r);
    const c = p.ceiling(); pres.ceiling = c.by ? Math.round(c.use / P.K.g) + ':' + c.by : 'none';
    res[name] = pres;
  }
  const keys = Object.keys(res.main);
  const diffs = keys.filter(k => {
    const a = res.main[k], b = res.br[k];
    if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) > 1e-3 * Math.max(a, b);
    return a !== b;
  });
  if (diffs.length) {
    const line = sid + ' ' + oid + ' ' + ang + ': ' + diffs.map(k => k + ' ' + res.main[k] + ' -> ' + res.br[k]).join('; ');
    console.log(line);
    if (diffs.includes('rattle')) { nMoved++; if (res.br.rattle === 'never') nNever++; }
    if (diffs.some(k => k !== 'rattle')) otherMoved.push(line);
  }
}
console.log('rattle moved', nMoved, 'became never', nNever, 'other presets moved', otherMoved.length);
