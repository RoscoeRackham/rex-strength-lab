global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, M = P.RESTRAINT.MOVES;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const surf = D.surfaces.find((s) => s.id === 'concrete');
for (let lg = 20; lg <= 34; lg += 1) {
  const c = Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf, anchor: 'friction' }, ON);
  const o = Object.assign({ surface: surf, body: rex, m: rex.m, near: 5 }, ON);
  const st = P.stomp(c), b = M.stomp.blow(st, o);
  const st0 = P.stomp(Object.assign({}, c, { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }));
  console.log(lg, 'vFoot/c', (st.vFoot / P.K.c), 'E', st.E.toExponential(3), 'blowJ', b.J, 'reach on', P.plasterReach(M.stomp.shake(st, o)).toPrecision(3), 'reach off', P.plasterReach(M.stomp.shake(st0, { surface: surf, body: rex })).toPrecision(3));
}
