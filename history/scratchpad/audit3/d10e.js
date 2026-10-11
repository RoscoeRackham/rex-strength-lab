global.window = {};
const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const P = P0 && P0.throwOnce ? P0 : (window.RexPhysics || Object.values(window).find(v=>v&&v.throwOnce));
const body = P.makeBody({});
console.log('whipEff', body.whipEff, 'releaseHeight', body.releaseHeight, 'digArea', body.digArea, 'Cd', body.Cd, 'front', body.frontArea, 'top', body.topArea);
const surface = { qult: 1e9, mu: 0.8, shear: 1e7, rho: 2400 };
const BALL = { m: 0.1453, area: 0.00427, Cd: 0.35, CdSup: 0.92 };
const SHOT = { m: 7.26, area: 0.0113, Cd: 0.46, CdSup: 0.92 };
for (const kg of [511, 5110]) for (const mode of ['real','comic']) {
  const base = { F: kg*9.80665, body, surface, groundHolds: true, anchor: 'bolted', mode };
  const v1 = P.throwOnce(base, BALL, 0).v;
  const b2 = Object.assign({}, body, { whipEff: body.whipEff*2 });
  const v2 = P.throwOnce(Object.assign({}, base, {body: b2}), BALL, 0).v;
  const r1 = P.throwOnce(base, SHOT, 37).flight.range;
  const b3 = Object.assign({}, body, { releaseHeight: 0 });
  const r3 = P.throwOnce(Object.assign({}, base, {body: b3}), SHOT, 37).flight.range;
  console.log(kg, mode, 'pitch', v1.toFixed(2), 'pitch@2x whipEff', v2.toFixed(2), 'shot range', r1.toFixed(2), 'shot range h0=0', r3.toFixed(2));
}
