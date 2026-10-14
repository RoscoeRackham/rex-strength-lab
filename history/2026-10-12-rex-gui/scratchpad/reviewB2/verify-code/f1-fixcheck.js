global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const F = require(__dirname + '/mut/fix01.js'), M = require(__dirname + '/engine-main.js');
const { canon, hash } = require('/home/user/rex-strength-lab/rex-strength-lab/test/powers-off-cases.js');
const g = 9.80665, c = 299792458;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const leg = (P, oid, style, mO, Fkg, ex, anc) => { const mk = (b, m) => Object.assign({ F: Fkg * g, mode: 'comic', body: P.makeBody({ build: b, H: 3.048, m }), surface: surf('granite'), anchor: anc || 'bolted' }, ex || {}); return P.catchLeg(mk('rex', 3007), mk('ollie', mO), obj(oid), 100, style); };
for (const [oid, st] of [['shot', 'easy'], ['baseball', 'easy']]) { const a = leg(M, oid, st, 2e23, 1e30), b = leg(F, oid, st, 2e23, 1e30, { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }); console.log('powers off', oid, st, 'identical to main:', hash(canon(a)) === hash(canon(b))); }
const PW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const mO of [3007, 1e13, 1e18, 3.16e22]) for (const Fkg of [1e14, 1.81e23]) for (const anc of ['bolted', 'friction']) {
  const L = leg(F, 'baseball', 'hard', mO, Fkg, PW, anc); const k = L.catch; if (!k) { console.log(mO, L.result); continue; }
  const E0 = k.pIn ? (Math.sqrt(k.pIn * k.pIn * c * c + (obj('baseball').m * c * c) ** 2) - obj('baseball').m * c * c) : 0;
  console.log('fixed: mO', mO.toExponential(2), 'dial', Fkg.toExponential(2), anc, 'res', L.result, 'carried', k.carried, 'firstShare', k.firstShare.toFixed(6), 'Ecatch/E0', (k.Ecatch / E0).toFixed(6), 'F', k.F.toExponential(3));
}
