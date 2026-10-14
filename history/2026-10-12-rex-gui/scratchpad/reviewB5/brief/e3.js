global.window = {};
const R = __dirname + '/repo/src/';
const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES;
for (const sid of ['sand', 'gravel', 'softclay', 'stiffclay', 'asphalt', 'concrete']) {
  let prev = null; const rows = [];
  for (let lg = 2.5; lg <= 9; lg += 0.02) {
    const c = { F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf(sid), anchor: 'friction', unbreakable: true };
    const s = P.stomp(c), o = { surface: c.surface, body: rex, unbreakable: true };
    const b = M.stomp.blow(s, o), src = M.stomp.shake(s, o), ppv = src ? P.ppvAt(src, 5) : 0;
    const s0 = P.stomp(Object.assign({}, c, { unbreakable: false })), ppv0 = P.ppvAt(M.stomp.shake(s0, { surface: c.surface, body: rex }), 5);
    if (prev && prev.rb !== !!s.realBreaks) rows.push(`${sid} flip at lg ${lg.toFixed(2)}: realBreaks ${prev.rb}->${!!s.realBreaks}; ppv5 ${prev.ppv.toPrecision(3)} -> ${ppv.toPrecision(3)} (off: ${prev.ppv0.toPrecision(3)} -> ${ppv0.toPrecision(3)}); J ${prev.J.toPrecision(3)} -> ${b.J.toPrecision(3)}, T ${prev.T.toPrecision(3)} -> ${b.T.toPrecision(3)}; hole real ${(s.realHole||s.holeDepth).toPrecision(3)}`);
    prev = { rb: !!s.realBreaks, ppv, ppv0, J: b.J, T: b.T };
  }
  console.log(rows.join('\n') || sid + ': no flip');
}
