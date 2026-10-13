const R = __dirname + '/copy/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES.jump;
for (const sid of ['sand', 'softclay', 'gravel', 'concrete']) {
  const surface = D.surfaces.find(s => s.id === sid);
  console.log('==', sid);
  for (const lg of [3, 3.3, 3.5, 3.6, 3.65, 3.7, 4]) {
    const c0 = { F: Math.pow(10, lg) * P.K.g, mode: 'comic', body, surface, anchor: 'friction' };
    const c1 = Object.assign({}, c0, { unbreakable: true });
    const j0 = P.jump(c0), j1 = P.jump(c1);
    const o0 = { surface, body, m: body.m }, o1 = Object.assign({ unbreakable: true }, o0);
    // landing only (drop the push-off, which is new with the power on)
    const s0 = M.shake(j0, o0), s1 = M.shake(Object.assign({}, j1, { pushOff: undefined }), o1);
    const L = j1.landing;
    const Jfeet = 2 * body.legEff * L.v, Tf = 2 * 0.026 * Math.sqrt(0.45 * body.H / 0.9);
    console.log(lg, 'off: ratio=' + j0.landing.ratio.toFixed(3) + ' sink=' + j0.landing.sink.toFixed(3) + ' ppv5=' + (P.ppvAt(s0, 5) * 1e3).toFixed(3),
      '| on: landRatioReal=' + (j1.landRatioReal || 0).toFixed(3) + ' landing ppv5=' + (P.ppvAt(s1, 5) * 1e3).toFixed(3) + ' plaster0=' + P.plasterReach(s0).toFixed(3) + ' plaster1=' + P.plasterReach(s1).toFixed(3),
      ' feet J=' + Jfeet.toFixed(0) + ' cap=' + (j1.landBear * Tf).toFixed(0) + ' landBear=' + (j1.landBear/1e3).toFixed(1) + 'kN', 'vLand same?', j0.landing.v.toFixed(4), L.v.toFixed(4));
  }
}
