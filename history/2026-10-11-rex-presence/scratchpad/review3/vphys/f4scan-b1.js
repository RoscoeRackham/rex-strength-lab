global.window = {};
const P = require('./engine-b1.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const objs = ['shot', 'bowling', 'person', 'piano', 'car', 'bus'];
for (const s of D.surfaces) {
  for (const mv of ['jump', 'stomp', ...objs.map((o) => 'throw:' + o)]) {
    const [move, oid] = mv.split(':');
    const obj = oid ? D.objects.find((x) => x.id === oid) : null;
    const o = { near: 5, surface: s, body: rex, m: rex.m, obj, angle: 45 };
    let prev = null, flips = [];
    for (let i = 0; i <= 400; i++) {
      const kg = Math.pow(10, 3 + i * (6 / 400));
      const c = { F: 1e9 * g, use: kg * g, mode: 'comic', body: rex, surface: s, groundHolds: false, anchor: 'friction' };
      const r = P.RESTRAINT.MOVES[move].run(c, o);
      const sh = P.RESTRAINT.MOVES[move].shake(r, o);
      const on = P.plasterOver(sh, 5);
      if (prev !== null && on !== prev) flips.push((on ? 'ON ' : 'OFF ') + kg.toExponential(2));
      prev = on;
    }
    if (flips.length > 1) console.log(s.id, mv, flips.join(', '));
  }
}
