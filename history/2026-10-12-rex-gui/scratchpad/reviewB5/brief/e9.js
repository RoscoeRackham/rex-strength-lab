global.window = {};
const R = __dirname + '/repo/src/';
const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const lg of [3.5, 3.6, 3.65, 3.7, 3.8, 4, 4.5]) {
  const c = { F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf('sand'), anchor: 'friction' };
  const j0 = P.jump(c), j1 = P.jump(Object.assign({ unbreakable: true }, c));
  const s1 = P.stomp(Object.assign({ unbreakable: true }, c));
  console.log(lg, 'off: pushoff sink', (j0.sink*100).toFixed(1), 'cm, landing sink', (j0.landing.sink*100).toFixed(1), 'cm | on: pushoff sink', (j1.sink*100).toFixed(1), 'landing sink', (j1.landing.sink*100).toFixed(1), '| stomp on: hole', (s1.holeDepth*100).toFixed(1), 'cm printCap', (s1.printCap*100).toFixed(1));
}
