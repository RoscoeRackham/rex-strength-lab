global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(R + '/src/engine.js'); require(R + '/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const human = D.tiers.find((t) => t.id === 'human');
const body = P.makeBody({});
console.log('calibration rows', JSON.stringify(D.calibration));
for (const mode of ['comic', 'real']) for (const [label, pw] of [['off', {}], ['ON (defaults)', { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }], ['ownRecoil only', { ownRecoil: true }], ['air only', { airAbsorb: 1 }]]) {
  const c = Object.assign({ F: human.liftKg * g, mode, body, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction' }, pw);
  const rows = D.calibration.map((k) => { const o = D.objects.find((x) => x.id === k.obj), rr = P.throwObject(c, o, k.angle); return k.label + ': ' + (k.metric === 'range' ? (rr.flight ? rr.flight.range.toFixed(2) + ' m' : '-') : rr.v.toFixed(2) + ' m/s') + ' (rec ' + k.recordText + ')'; });
  console.log(mode, label, '|', rows.join(' | '));
}
