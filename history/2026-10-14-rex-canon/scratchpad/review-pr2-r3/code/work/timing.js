const path = require('path');
const load = (dir) => { const e = path.join(dir, 'src/engine.js'); delete require.cache[require.resolve(e)]; global.window = {}; const P = require(e); require(path.join(dir, 'src/data.js')); delete require.cache[require.resolve(path.join(dir, 'src/data.js'))]; return { P, D: window.DINO_DATA }; };
const dirs = { main: process.argv[2], branch: process.argv[3] };
const E = {}; for (const k in dirs) E[k] = load(dirs[k]);
const run = ({ P, D }) => {
  const g = P.K.g, rex = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), ollie = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
  const conc = D.surfaces.find((s) => s.id === 'concrete');
  const ctx = (kg, x) => Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: conc, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: false }, x || {});
  let n = 0; const t0 = process.hrtime.bigint();
  for (const lg of [3, 5, 7, 9, 12, 15, 20, 25, 30, 34]) for (const id of ['baseball', 'car', 'bus']) for (const st of ['easy', 'hard']) for (const D0 of [10, 1000]) {
    const cR = ctx(Math.pow(10, lg)), cO = Object.assign({}, cR, { body: ollie });
    P.catchLeg(cR, cO, D.objects.find((o) => o.id === id), D0, st); P.catchLeg(cO, cR, D.objects.find((o) => o.id === id), D0, st); n += 2;
  }
  const t1 = process.hrtime.bigint();
  for (const lg of [3, 5, 7, 9, 12, 15, 20, 25, 30, 34]) for (const st of ['easy', 'hard']) for (const h of [3, 10, 1000]) { P.tossPartner(ctx(Math.pow(10, lg)), ollie, 'Ollie', st, h, 'friction'); n++; }
  const t2 = process.hrtime.bigint();
  for (const lg of [3, 5, 7, 9, 12, 15, 20, 25, 30, 34]) for (const a of ['friction', 'bolted']) for (const id of ['car', 'bus', 'bar511']) { P.pull(ctx(Math.pow(10, lg), { anchor: a }), D.objects.find((o) => o.id === id)); }
  const t3 = process.hrtime.bigint();
  return { catchMs: Number(t1 - t0) / 1e6, tossMs: Number(t2 - t1) / 1e6, pullMs: Number(t3 - t2) / 1e6 };
};
const res = { main: [], branch: [] };
for (let i = 0; i < 3; i++) for (const k of ['main', 'branch']) res[k].push(run(E[k]));
for (const k in res) console.log(k, JSON.stringify(res[k].map((r) => Object.fromEntries(Object.entries(r).map(([a, b]) => [a, Math.round(b)])))));
