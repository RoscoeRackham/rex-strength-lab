const R = __dirname + '/copy/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES.stomp;
for (const sid of ['sand', 'gravel', 'softclay', 'stiffclay', 'concrete']) {
  const surface = D.surfaces.find(s => s.id === sid);
  console.log('==', sid);
  for (const lg of [2, 2.5, 2.9, 2.94, 2.96, 2.97, 2.98, 2.99, 3, 3.5, 4, 6, 8, 10]) {
    const row = [lg];
    for (const ub of [false, true]) {
      const c = { F: Math.pow(10, lg) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: ub ? 1 : 0, keepForm: ub, unbreakable: ub, ownRecoil: ub};
      const r = M.run(c);
      const o = Object.assign({}, c, { near: 5 });
      const b = M.blow(r, o); const s = M.shake(r, o);
      row.push((ub ? 'ON ' : 'OFF ') + 'ppv5=' + (P.ppvAt(s, 5) * 1000).toFixed(2) + 'mm/s J=' + (b ? b.J.toFixed(0) : '-') + ' T=' + (b ? b.T.toFixed(3) : '-') + (ub ? ' realBreaks=' + r.realBreaks + ' realHole=' + (r.realHole||0).toFixed(3) + ' printCap=' + r.printCap + ' hole=' + r.holeDepth.toFixed(3) + ' pl1.5=' + P.plasterOver(s, 1.5) : ''));
    }
    console.log(row.join(' | '));
  }
}
