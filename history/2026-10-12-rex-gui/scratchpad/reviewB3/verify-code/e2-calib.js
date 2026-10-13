const R = __dirname + '/repo/rex-strength-lab/';
const P = require(R + 'src/engine.js'); global.window = {}; require(R + 'src/data.js'); const D = window.DINO_DATA;
const human = D.tiers.find((t) => t.id === 'human');
const body = P.makeBody({ build: 'human', H: 2, m: 180 });
const obj = (id) => D.objects.find((o) => o.id === id);
console.log('calibration rows', D.calibration.map(k => k.label + ' ' + k.recordText + ' ' + k.metric));
for (const mode of ['comic', 'real']) for (const [lab, pw] of [['off', { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }], ['default', { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }], ['air0 others on', { airAbsorb: 0, keepForm: true, unbreakable: true, ownRecoil: true }], ['airAbsorb only', { airAbsorb: 1 }]]) {
  const c = Object.assign({ F: human.liftKg * P.K.g, mode, body, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction' }, pw);
  const out = D.calibration.map((k) => { const r = P.throwObject(c, obj(k.obj), k.angle); return k.label + ' ' + (k.metric === 'range' ? r.flight.range.toFixed(3) + ' m' : r.v.toFixed(3) + ' m/s'); });
  console.log(mode.padEnd(6), lab.padEnd(16), out.join(' | '));
}
