global.window = {};
const L = '/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(L + 'src/engine.js'); require(L + 'src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const sid of ['sand', 'softclay', 'stiffclay', 'gravel']) {
  const c = { F: 1e6 * g, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction' };
  const p = P.RESTRAINT.planNow('jump', c, { target: 3, near: 5 });
  const gl = p.goal(), ce = p.ceiling();
  const rg = p.run(gl.use), rc = p.run(ce.below);
  console.log(sid, 'goal use kg', (gl.use / g).toPrecision(3), 'Eground', rg.Eground && rg.Eground.toPrecision(3), 'landing E', rg.landing && rg.landing.Eground && rg.landing.Eground.toPrecision(3), 'groundFails', rg.groundFails, 'sink', rg.sinkDepth || rg.holeDepth || rg.footSink);
  console.log('   ceiling by', ce.by, 'below kg', (ce.below / g).toPrecision(3), 'use kg', (ce.use / g).toPrecision(3), 'onset', (Math.sqrt(ce.below*ce.use)/g).toPrecision(3), 'apex', rc.flight && rc.flight.apex.toFixed(2), 'Eground', rc.Eground && rc.Eground.toPrecision(3), 'groundFails', rc.groundFails);
  const keys = Object.keys(rc).filter(k => /sink|depth|hole|ground|fail/i.test(k));
  console.log('   keys', keys.map(k => k + '=' + (typeof rc[k] === 'number' ? rc[k].toPrecision(3) : rc[k])).join(' '));
}
