global.window = {};
const R = __dirname + '/repo/src/';
const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES;
for (const sid of ['softclay', 'stiffclay', 'gravel', 'sand']) for (const lg of [2, 2.5, 3, 4, 5, 6, 8, 10]) {
  const row = [sid, lg];
  for (const ub of [false, true]) {
    const c = { F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf(sid), anchor: 'friction', unbreakable: ub, ownRecoil: true };
    const s = P.stomp(c), o = { surface: c.surface, body: rex, unbreakable: ub, ownRecoil: true };
    const src = M.stomp.shake(s, o);
    row.push((ub ? 'ON ' : 'off ') + (P.ppvAt(src, 5) * 1000).toPrecision(3) + ' mm/s' + (ub ? ' rb=' + !!s.realBreaks : ''));
  }
  console.log(row.join('  '));
}
