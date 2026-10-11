const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const P1 = require('./engine_v_bio1_fix.js');
const { refPush } = require('./v_bio1_ref.js');
const g = 9.80665;
const surfaces = { sand: { qult: 150e3, mu: 0.5, shear: 20e3, rho: 1600 }, concrete: { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 }, granite: { qult: 400e6, mu: 0.7, shear: 20e6, rho: 2700 } };
const objs = { baseball: { m: 0.145, area: 0.00434, Cd: 0.35, rho: 683 }, car: { m: 1360, area: 4, Cd: 1.0, crush: 1e6, rho: 300 } };
const MU = P0.MUSCLE;
function refFor(action, c) {
  const { body, surface } = c, P = P0;
  let o, side;
  if (action === 'punch') { const anc = P.anchorCapacity({ body, surface, theta: 0, anchor: c.anchor, groundHolds: c.groundHolds }); o = { F: 0.3 * c.F, d: body.strokes.punch, mA: body.m - body.handEff, mB: body.handEff, RA: anc.R, RB: 0, vmax: 17 * body.s }; side = 'vB'; }
  if (action === 'clap') { o = { F: 0.3 * c.F, d: body.strokes.clap, mA: body.m, mB: body.handEff, RA: Infinity, RB: 0, vmax: 17 * body.s }; side = 'vB'; }
  if (action === 'stomp') { const mB = body.legEff; o = { F: 0.5 * c.F, d: body.strokes.stomp, mA: body.m - mB, mB, RA: (body.m - mB) * g, RB: 0, vmax: 16 * body.s }; side = 'vB'; }
  if (action === 'jump') { const mA = body.m - body.feetMass; o = { F: c.F, d: body.strokes.leg, mA, mB: body.feetMass, RA: mA * g, RB: c.groundHolds ? Infinity : surface.qult * 2 * body.footArea, vmax: 30 * body.s }; side = 'vA'; }
  if (action.startsWith('throw:')) { const ob = objs[action.slice(6)]; const whip = ob.m <= 1; const hands = ob.m > 20 ? 2 : 1; const arm = hands * (whip ? body.whipEff : body.handEff); const th = Math.PI / 4; const anc = P.anchorCapacity({ body, surface, theta: th, anchor: c.anchor, groundHolds: c.groundHolds, extraMass: ob.m }); const mB = ob.m + arm; o = { F: 0.3 * c.F, d: whip ? body.strokes.whip : body.strokes.throw, mA: body.m - arm, mB, RA: anc.R, RB: mB * g * Math.sin(th), vmax: 55 * body.s }; side = 'vB'; }
  const r = refPush(Object.assign({ N: 40000 }, o));
  return action === 'jump' ? r.vA * (body.m - body.feetMass) / body.m : r[side];
}
const eng = (P, action, c) => action === 'punch' ? P.punch(c).vFist : action === 'clap' ? P.clap(c).vHand : action === 'stomp' ? P.stomp(c).vFoot : action === 'jump' ? P.jump(c).v : P.throwObject(c, objs[action.slice(6)], 45).v;
let worstOrig = 0, worstPatch = 0, wp = '', n = 0, zerosOrig = 0, zerosPatch = 0;
for (const H of [0.4, 2, 50]) for (const [sn, surface] of Object.entries(surfaces)) for (const anchor of ['friction', 'bolted']) for (const gh of [false, true]) {
  const body = P0.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  for (let lk = 2; lk <= 16.01; lk += 0.5) {
    const c = { F: Math.pow(10, lk) * g, mode: 'real', body, surface, groundHolds: gh, anchor };
    for (const a of ['punch', 'clap', 'stomp', 'jump', 'throw:baseball', 'throw:car']) {
      const ref = refFor(a, c); const e0 = eng(P0, a, c), e1 = eng(P1, a, c);
      if (ref < 0.05) continue; // stalled cases, skip
      n++;
      const r0 = Math.abs(e0 - ref) / ref, r1 = Math.abs(e1 - ref) / ref;
      if (e0 === 0) zerosOrig++; if (e1 === 0) zerosPatch++;
      worstOrig = Math.max(worstOrig, r0);
      if (r1 > worstPatch) { worstPatch = r1; wp = `H=${H} ${sn} ${anchor} gh=${gh} 1e${lk} ${a}: patched ${e1} ref ${ref}`; }
    }
  }
}
console.log('cases', n, '| original: zero outputs', zerosOrig, 'worst rel err', worstOrig.toExponential(2));
console.log('patched: zero outputs', zerosPatch, 'worst rel err', worstPatch.toExponential(2), '\n  at', wp);
// calibration unchanged?
console.log('comicFrac orig vs patched:', Object.keys(MU).filter((k) => MU[k].comicFrac).map((k) => `${k} ${MU[k].comicFrac.toPrecision(6)}/${P1.MUSCLE[k].comicFrac.toPrecision(6)}`).join(' '));
