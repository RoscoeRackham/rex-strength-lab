const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const o = D.objects.find(x => x.id === 'pyramid');
const c = (kg) => ({ F: kg * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 0.5, keepForm: true, unbreakable: true, ownRecoil: true });
let lo = 1, hi = 1e40;
for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); const r = P.throwObject(c(mid), o, 90); if (r.v < 15000) lo = mid; else hi = mid; }
console.log('log10 dial', Math.log10(hi).toFixed(5));
