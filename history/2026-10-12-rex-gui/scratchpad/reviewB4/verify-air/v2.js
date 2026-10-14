const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const ball = D.objects.find(o => o.id === 'baseball');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (b, kg, share) => ({ F: kg * P.K.g, mode: 'comic', body: b, surface, anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true });
const c = P.K.c;
function run(kg, share, Dd) {
  const L = P.catchLeg(mk(rex, kg, share), mk(ollie, kg, share), ball, Dd, 'hard');
  const fb = L.fireball, ca = L.catch;
  return { share, result: L.result, sheath: L.sheath ? L.sheath.share : null, egapShare: fb ? fb.Egap / fb.E : null, kind: fb ? fb.kind : null,
    Eblast: fb ? fb.Eblast : null, pushV: fb && fb.push ? fb.push.recoilV / c : null,
    Ecatch: ca ? ca.E : null, carriedV: ca ? (ca.vAfter != null ? ca.vAfter / c : ca.carriedV) : null, catchKeys: ca ? Object.keys(ca).join(',') : '' };
}
// find threshold in share at 1e20 kg, D 1 km
let lo = 0.99, hi = 0.99999;
console.log(run(1e20, lo, 1000)); console.log(run(1e20, hi, 1000));
for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; const r = run(1e20, mid, 1000); if (r.result === 'fireball') lo = mid; else hi = mid; }
console.log('threshold share', lo, hi);
const a = run(1e20, lo, 1000), b = run(1e20, hi, 1000);
console.log(JSON.stringify(a, null, 1)); console.log(JSON.stringify(b, null, 1));
