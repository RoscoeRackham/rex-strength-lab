const { P, D, g, surf, obj, rex, ctxOf } = require('./lib.js');
for (const sid of ['sand', 'concrete']) for (const kg of [1e5, 1e6]) for (const soft of [false, true]) {
  const r = P.jump(ctxOf(kg, { surface: surf(sid), softLanding: soft }));
  const L = r.landing;
  console.log(sid, kg, 'soft', soft, 'vLand', L.v.toFixed(2), 'E kJ', (L.E / 1e3).toFixed(1), 'ratio', L.ratio.toFixed(2), 'sink m', L.sink.toFixed(3), 'absorbed kJ', (L.absorbed / 1e3).toFixed(1), 'Eground kJ', (L.Eground / 1e3).toFixed(1), 'Eimpact kJ', (L.Eimpact / 1e3).toFixed(1), 'F kN', (L.F / 1e3).toFixed(0));
}
// work against bearing alone over the sink on sand at 1e5
const r = P.jump(ctxOf(1e5, { surface: surf('sand'), softLanding: true }));
console.log('groundLimitForce RB kN', (r.groundLimitForce / 1e3).toFixed(1), 'RB*sink kJ', (r.groundLimitForce * r.landing.sink / 1e3).toFixed(1));
