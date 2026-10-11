global.window = {};
const E = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, K = E.K;
const body = E.makeBody({ H: 2, m: 180 });
function uncapped(surfId, kg) {
  const surface = D.surfaces.find(s => s.id === surfId);
  const ctx = { F: kg * K.g, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' };
  const F = ctx.F * E.MUSCLE.jump.forceFrac;
  const d = body.strokes.leg, mA = body.m - body.feetMass, mB = body.feetMass, RA = mA * K.g, A2 = 2 * body.footArea;
  const RB = E.qultFor(surface, body.footB) * A2, cB = K.PONCELET_K * (surface.rho || 2000) * A2, vmax = E.MUSCLE.jump.vmax * body.s;
  const pu = E.pushApart({ F, d, mA, mB, RA, RB, cB, mode: 'real', vmax });
  const p = Math.max(0, pu.pA - pu.pB), v = E.momentumToV(p, body.m);
  const fl = E.fly({ v0: v, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd, CdSup: 1.75 });
  const r = E.jump(ctx), rf = E.jump(Object.assign({}, ctx, { groundHolds: true }));
  console.log(surfId, kg.toExponential(2), 'uncapped apex', fl.apex.toFixed(4), 'sink', (pu.xB*100).toFixed(2)+'cm', '| held', r.flight.apex.toFixed(4), 'heldBack', r.heldBack, 'sink', (r.sink*1000).toFixed(3)+'mm', '| rigid', rf.flight.apex.toFixed(4));
}
const hulk = 100 * 907.18474;
uncapped('concrete', hulk);
uncapped('asphalt', hulk);
uncapped('ice', 1e6); uncapped('ice', 1e12);
uncapped('steel', 1e9); uncapped('steel', 1e15);
uncapped('stiffclay', 1e6); uncapped('stiffclay', 1e12);
uncapped('gravel', 1e6);
