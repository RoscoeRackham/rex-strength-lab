// page mutants, each checked against node test/shots.js --pr5
const A = 'src/app.html';
const T = 'node test/shots.js --pr5';
const m = (id, find, replace) => ({ id, file: A, find, replace, cmd: T, build: true });
module.exports = [
  m('P00-control-no-stomp-tile', "      shimmerTile(tb)));\n    const footAir = taken", "      null));\n    const footAir = taken"),
  m('P01-throw-angle-45', "const tb = takenBack('throw', r, Object.assign({}, c, { obj: o, angle: state.angle }));", "const tb = takenBack('throw', r, Object.assign({}, c, { obj: o, angle: 45 }));"),
  m('P03-wrestle-whoA-rex', "whoA: nA === 'Rex' ? 'rex' : 'ollie', angle: state.wAngle", "whoA: 'rex', angle: state.wAngle"),
  m('P04-collide-whoA-ollie', "const tb = takenBack('collide', r, { A: cA, B: cB, whoA: X === 'Ollie' ? 'ollie' : 'rex' });", "const tb = takenBack('collide', r, { A: cA, B: cB, whoA: 'ollie' });"),
  m('P05-catch-always-back', "const tb = takenBack('catch', backThrow ? { a, b } : { a }, { A: cR, B: cO, whoA: 'rex', obj: o });", "const tb = takenBack('catch', { a, b }, { A: cR, B: cO, whoA: 'rex', obj: o });"),
  m('P06-level-from-total', 'const gl = lad.glow(tb.by.rex.E, refs);', 'const gl = lad.glow(tb.E, refs);'),
  m('P07-collide-glow-total', 'out.push(unstoppableArt(tb.by.rex.E));', 'out.push(unstoppableArt(tb.E));'),
  m('P08-toss-whoA-ollie', "const tb = takenBack('toss', t, { A: cR, B: cO, whoA: 'rex' });", "const tb = takenBack('toss', t, { A: cR, B: cO, whoA: 'ollie' });"),
  m('P09-glow-linear', 'const gl = window.EnergyLadder.glow(J, D.energyRefs), s = gl.none ? 0 : gl.strength, a = Math.sqrt(s);', 'const gl = window.EnergyLadder.glow(J, D.energyRefs), s = gl.none ? 0 : gl.strength, a = s;'),
  m('P11-wrestle-angle-45', "whoA: nA === 'Rex' ? 'rex' : 'ollie', angle: state.wAngle", "whoA: nA === 'Rex' ? 'rex' : 'ollie', angle: 45"),
  m('P13-duo-tally-allout', "const tb = takenBack('wrestleThrow', t, {", "const tb = takenBack('wrestleThrow', P.throwPartner(Object.assign({}, cA, { F: fullF(cA === cB ? 'R' : (nA === 'Rex' ? 'R' : 'O')) }), cB, state.wAngle), {"),
  m('P14-catch-leg-a-only', "const tb = takenBack('catch', backThrow ? { a, b } : { a }, { A: cR, B: cO, whoA: 'rex', obj: o });", "const tb = takenBack('catch', { a }, { A: cR, B: cO, whoA: 'rex', obj: o });"),
  m('P16-tile-only-rex', 'if (!tb || !(tb.E > 0)) return null;', 'if (!tb || !(tb.by.rex.E > 0)) return null;'),
  m('P20-header-follows-duo', "if (!duo) setGlow($('#hero-glow'), shimmerSeen ? shimmerSeen.by.rex.E : 0);", "setGlow($('#hero-glow'), shimmerSeen ? shimmerSeen.by.rex.E : 0);"),
  m('P21-catch-same-b-dropped', "const tb = takenBack('catch', backThrow ? { a, b } : { a }, { A: cR, B: cO, whoA: 'rex', obj: o });", "const tb = takenBack('catch', backThrow ? { a, b: P.catchLeg(cO, cR, o, Dd, 'hard') } : { a }, { A: cR, B: cO, whoA: 'rex', obj: o });"),
  // engine mutant N25 (a leg's drag to the catcher) survived section 9: does the page block catch it?
  { id: 'N25-on-page', file: 'src/engine.js', find: "if (s > 0) add(whoT, 'drag', tbDrag(s * realAirLeg", replace: "if (s > 0) add(whoC, 'drag', tbDrag(s * realAirLeg", cmd: T, build: true },
];
