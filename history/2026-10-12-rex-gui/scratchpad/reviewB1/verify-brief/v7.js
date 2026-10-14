const R='/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R+'src/engine.js'); global.window = {}; require(R+'src/data.js'); const D = window.DINO_DATA;
const surf = D.surfaces.find(s => s.id === 'concrete');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const mk = (kg, body, pw, x) => Object.assign({ F: kg * P.K.g, mode: 'comic', body, surface: surf, anchor: 'friction', airAbsorb: pw?1:0, keepForm: pw, unbreakable: pw, ownRecoil: pw }, x||{});
for (const pw of [false, true]) {
  const t = P.throwPartner(mk(1e7, rex, pw), mk(1e7, ollie, pw), 45);
  console.log(pw ? 'on ' : 'off', 'sinkRatio', t.r.sinkRatio, 'sinkRatioRaw', t.r.sinkRatioRaw, 'v', t.r.v.toFixed(1));
}
// with unbreakable off only (as the ground preset does)
const t2 = P.throwPartner(mk(1e7, rex, true, { unbreakable: false }), mk(1e7, ollie, true, { unbreakable: false }), 45);
console.log('real ground (others on): sinkRatio', t2.r.sinkRatio);
// catcher bolted, bus lob at 1e8 kg
const bus = D.objects.find(o => o.id === 'bus');
for (const pw of [false, true]) {
  const k = P.catchIt(mk(1e8, ollie, pw, { anchor: 'bolted' }), bus, 60, 10, null);
  console.log('catchIt', pw ? 'on' : 'off', 'sinkRatio', k.sinkRatio, 'raw', k.sinkRatioRaw);
}
{ const c = mk(1e7, rex, true, { unbreakable: false, use: 657e3 * P.K.g }), co = mk(1e7, ollie, true, { unbreakable: false, use: 657e3 * P.K.g });
  const t = P.throwPartner(c, co, 45); console.log('at 657 t real ground sinkRatio', t.r.sinkRatio); }
