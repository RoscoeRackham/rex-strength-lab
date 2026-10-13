const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g, conc = D.surfaces.find(s => s.id === 'concrete');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const mk = (b, kg) => Object.assign({ F: kg * g, mode: 'comic', body: b, surface: conc, anchor: 'friction' }, ON);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
let r = P.armWrestle(mk(rex, 1e13), mk(ollie, Math.pow(10, 12.5)));
console.log('default bodies: outcome', r.outcome, 'pin t', r.pin.t, 'v', r.pin.v, 'E', r.pin.E, 'quake', r.quake, 'toGround', r.toGround, 'tableBreaks', r.tableBreaks, 'slamRatio', r.slamRatio);
// heavy bodies: subsonic swing with quake > 2?
for (const m of [1e6, 1e8, 1e10]) {
  const a = P.makeBody({ build: 'rex', H: 3.048, m }), b = P.makeBody({ build: 'ollie', H: 3.06, m });
  // find an effort where swing ~ 100 m/s
  let lo = m * 2, hi = 1e30;
  for (let i = 0; i < 100; i++) { const mid = Math.sqrt(lo * hi); const q = P.armWrestle(mk(a, mid), mk(b, mid * 0.5)); const v = q.pin ? q.pin.v : 0; if (v < 100) lo = mid; else hi = mid; }
  const q = P.armWrestle(mk(a, hi), mk(b, hi * 0.5));
  console.log('m', m, 'eff kg', hi.toExponential(2), 'outcome', q.outcome, 'pin v', q.pin && q.pin.v.toFixed(1), 'E', q.pin && q.pin.E.toExponential(2), 'quake', q.quake && q.quake.toFixed(2), 'toGround', !!q.toGround, 'tableBreaks', q.tableBreaks, 'slamRatio', q.slamRatio);
}
