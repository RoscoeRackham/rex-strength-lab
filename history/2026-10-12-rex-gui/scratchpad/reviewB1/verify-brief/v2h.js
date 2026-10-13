const R='/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R+'src/engine.js'); global.window = {}; require(R+'src/data.js'); const D = window.DINO_DATA;
const mk = (kg, sid, pw) => ({ F: kg * P.K.g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: D.surfaces.find(s => s.id === sid), anchor: 'friction', airAbsorb: pw?1:0, keepForm: pw, unbreakable: pw, ownRecoil: pw });
for (const pw of [false, true]) {
  const p = P.RESTRAINT.planNow('stomp', mk(1e10, 'sand', pw));
  const h = p.hazards();
  console.log(pw?'on ':'off', h.map(x => x.id + '=' + (x.never ? 'never' : (x.use / P.K.g).toPrecision(3) + 'kg')).join('  '));
  const rr = p.run(1e8*P.K.g);
  console.log('   at 1e8 kg: realBreaks', rr.realBreaks, 'crater', rr.crater, 'realCrater', rr.realCrater, 'vFoot', rr.vFoot.toFixed(0));
}
