global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
for (const file of ['./engine_cur.js', './engine_patch60.js', './engine_patchclamp.js']) {
  const P = require(file); const g = P.K.g;
  const ctx = (kg, s, a) => ({ F: kg * g, mode: 'real', body: P.makeBody({}), surface: D.surfaces.find((x) => x.id === s), groundHolds: false, anchor: a });
  const pu = P.punch(ctx(1e17, 'steel', 'braced')).vFist, ju = P.jump(ctx(1e20, 'granite', 'friction')).v, pb = P.punch(Object.assign(ctx(1e20, 'concrete', 'bolted'), { groundHolds: true })).vFist;
  const cal = P.punch(ctx(511, 'concrete', 'friction')).vFist;
  console.log(file, 'punch steel braced 1e17:', pu.toFixed(3), '| jump granite 1e20:', ju.toFixed(3), '| punch bolted 1e20:', pb.toFixed(3), '| punch 511:', cal.toFixed(4));
}
