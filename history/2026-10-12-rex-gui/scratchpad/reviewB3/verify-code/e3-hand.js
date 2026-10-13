const R = __dirname + '/repo/rex-strength-lab/';
const P = require(R + 'src/engine.js'); global.window = {}; require(R + 'src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const obj = (id) => D.objects.find((o) => o.id === id);
const M = P.RESTRAINT.MOVES.throw, RR = P.RESTRAINT.R;
for (const share of [0, 0.01, 0.5, 1]) {
  const c = { F: 1e8 * P.K.g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
  const o = { near: 5, target: 30, obj: obj('baseball'), angle: 0 };
  const p = P.RESTRAINT.planNow('throw', c, o);
  const r = p.run(p.hi), b = M.blastParts(r, p.opt);
  const win = p.result('preset:windows');
  console.log('share', share, 'v', (r.v/1000).toFixed(2), 'km/s', 'land', (b.land/1e6).toFixed(2), 'MJ path', (b.path/1e6).toFixed(2), 'MJ hand', b.hand != null ? (b.hand/1e6).toFixed(2) : '-', 'R6.9kPa', P.blastRadius ? P.blastRadius(Math.max(b.land,b.path), RR.DP_WINDOWS).toFixed(1) : '?', 'windows preset', win.never ? 'never' : (win.use / P.K.g).toExponential(3) + ' kg');
}
