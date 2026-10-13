global.window = {};
const R = __dirname + '/repo/src/';
const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES;
for (const sid of ['sand', 'gravel', 'softclay', 'concrete']) for (const lg of [3.3, 3.5, 3.6, 3.65]) {
  const c = { F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf(sid), anchor: 'friction' };
  const j0 = P.jump(c), j1 = P.jump(Object.assign({ unbreakable: true }, c));
  const o = { surface: c.surface, body: rex, m: rex.m };
  const a = M.jump.shake(j0, o), b = M.jump.shake(Object.assign({}, j1, { pushOff: undefined }), Object.assign({ unbreakable: true }, o)), bb = M.jump.shake(j1, Object.assign({ unbreakable: true }, o));
  console.log(sid, lg, 'v', j0.v.toPrecision(3), 'landing ratio (real)', (j0.landing.ratio || 0).toPrecision(3), 'sink', j0.landing.sink, '| ppv5 landing off', (P.ppvAt(a, 5)*1000).toPrecision(3), 'on (landing only)', (P.ppvAt(b, 5)*1000).toPrecision(3), 'on (with push-off)', (P.ppvAt(bb, 5)*1000).toPrecision(3), 'landBear', j1.landBear && j1.landBear.toPrecision(3));
}
