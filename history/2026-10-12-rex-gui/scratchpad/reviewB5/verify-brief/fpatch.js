const which = process.argv[2] || 'patched';
const R = which === 'patched' ? __dirname + '/patched/' : __dirname + '/copy/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const mv of ['stomp', 'jump']) {
  const M = P.RESTRAINT.MOVES[mv];
  for (const sid of D.surfaces.map(s => s.id)) {
    const surface = D.surfaces.find(s => s.id === sid);
    let prev = null, drops = [], borneDiff = [];
    for (let lg = 2.5; lg <= 9; lg += 0.005) {
      const c = { F: Math.pow(10, lg) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
      const r = M.run(c); const o = Object.assign({}, c, { near: 5, m: body.m });
      const src = mv === 'jump' ? M.shake(Object.assign({}, r, { pushOff: undefined }), o) : M.shake(r, o);
      const v = P.ppvAt(src, 5);
      if (prev && v < prev.v * 0.995) drops.push(prev.lg.toFixed(3) + '->' + lg.toFixed(3) + ': ' + (prev.v * 1e3).toFixed(2) + '->' + (v * 1e3).toFixed(2));
      if (mv === 'jump' && r.landing && r.landing.landed && r.landRatioReal <= 1) { const u = P.ppvAt(M.shake(Object.assign({}, r, { pushOff: undefined }), Object.assign({}, o, { unbreakable: false })), 5); if (Math.abs(u - v) > 1e-12 * u) borneDiff.push(lg.toFixed(3)); }
      prev = { lg, v };
    }
    console.log(which, mv, sid, drops.length ? 'DROPS ' + drops.slice(0, 3).join('; ') : 'monotonic', mv === 'jump' ? (borneDiff.length ? 'borne-landing differs at ' + borneDiff.length + ' efforts, e.g. ' + borneDiff[0] : 'borne landing = uncapped') : '');
  }
}
