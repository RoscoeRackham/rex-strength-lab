const dir = __dirname + '/../repo/rex-strength-lab/src';
const P = require(dir + '/engine.js'); global.window = {}; require(dir + '/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const car = D.objects.find((o) => o.id === 'car'), conc = D.surfaces.find((s) => s.id === 'concrete');
for (const [lab, x] of [['on friction', { anchor: 'friction', ownRecoil: true }], ['on bolted', { anchor: 'bolted', ownRecoil: true }], ['off bolted', { anchor: 'bolted', ownRecoil: false }], ['off friction', { anchor: 'friction', ownRecoil: false }]]) {
  const c = Object.assign({ F: 90718.474 * g, mode: 'comic', body, surface: conc, airAbsorb: 1, keepForm: true, unbreakable: true }, x);
  const r = P.pull(c, car);
  const vEnd = r.vEnd, pBody = body.m * vEnd, pLoad = car.m * vEnd;
  const src = P.impulseSource ? P.impulseSource(conc, pBody, r.t10m) : null;
  const ppv = src && P.ppvAt ? P.ppvAt(src, 5) : null;
  const srcRope = P.impulseSource ? P.impulseSource(conc, (r.recoilAbsorbed||{}).J || 0, r.t10m) : null;
  console.log(lab, 't10m', r.t10m.toFixed(3), 'accel', r.accel && r.accel.toFixed(1), 'vEnd', vEnd.toFixed(2), 'body p', Math.round(pBody), 'avg foot force N', Math.round(pBody / r.t10m), 'load p', Math.round(pLoad), 'recoilAbs', r.recoilAbsorbed && Math.round(r.recoilAbsorbed.J), 'ppv5 steps mm/s', ppv && (ppv*1000).toFixed(3), 'ppv5 rope mm/s', srcRope && P.ppvAt && (P.ppvAt(srcRope,5)*1000).toFixed(3));
}
