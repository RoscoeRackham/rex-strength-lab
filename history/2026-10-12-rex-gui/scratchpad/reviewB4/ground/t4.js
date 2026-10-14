const { P, D, rex, surf, obj, ctx, ON } = require('./h.js');
const RS = P.RESTRAINT, V = P.VIB;
function run(move, s, kg, use, powers, extra = {}) {
  const c = Object.assign(ctx(Object.assign({ kg, s }, powers)), { use });
  const o = Object.assign({ near: 5, body: rex, surface: surf(s), anchor: 'friction', m: rex.m, obj: obj('car'), angle: 45 }, powers, extra);
  const r = RS.MOVES[move].run(c, o);
  const src = RS.MOVES[move].shake ? RS.MOVES[move].shake(r, o) : null;
  return { r, ppv5: P.ppvAt(src, 5), plaster: P.plasterReach(src), ground: RS.MOVES[move].ground ? RS.MOVES[move].ground(r, o) : null };
}
const OFF = {};
const UNB = { unbreakable: true };
for (const move of ['stomp', 'jump', 'throw']) for (const s of ['sand', 'concrete']) for (const use of [3007 * 9.81 * 2, 1e5 * 9.81, 1e6 * 9.81, 1e8 * 9.81]) {
  const a = run(move, s, 1e9, use, OFF), b = run(move, s, 1e9, use, UNB);
  const sp = (r) => (move === 'stomp' ? r.vFoot : move === 'jump' ? r.v : r.v);
  console.log(move.padEnd(6), s.padEnd(9), (use / 9.81).toExponential(1), 'off: v', sp(a.r).toPrecision(3), 'ppv5', (a.ppv5 * 1e3).toPrecision(3), 'mm/s plaster', a.plaster.toPrecision(3), 'brk', a.ground, '| unb: v', sp(b.r).toPrecision(3), 'ppv5', (b.ppv5 * 1e3).toPrecision(3), 'plaster', b.plaster.toPrecision(3), move==='jump' ? 'pushOff ' + JSON.stringify(b.r.pushOff && {J: +b.r.pushOff.J.toPrecision(3), T: +b.r.pushOff.T.toPrecision(3), s: +b.r.pushOff.supplied.toPrecision(3)}) : '');
}
