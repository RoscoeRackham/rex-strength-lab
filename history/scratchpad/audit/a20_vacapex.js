const { P, g, ctx } = require('./lib.js');
const GM = P.K.GM, R = P.K.R_E;
for (const lg of [7.5, 8, 9, 10, 11, 12, 13]) {
  const c = ctx({ logKg: lg, surface: 'granite', groundHolds: true });
  const j = P.jump(c);
  const v = j.v;
  const eps = v * v / 2 - GM / R;
  const kepler = eps >= 0 ? Infinity : (1 / (1 / R - v * v / (2 * GM)) - R);
  const vac = P.fly({ v0: v, thetaDeg: 90, h0: 0, m: 1, A: 1, Cd: 0 });
  console.log('lift 1e' + lg, '| v', v.toFixed(0), 'm/s | drag flight', j.flight.relativistic ? 'REL' : j.flight.escaped ? 'ESC' : (j.flight.apex / 1e3).toFixed(1) + ' km', '| UI "no-air answer" v^2/2g', (j.vacuumApex / 1e3).toFixed(0), 'km | inverse-square vacuum apex', isFinite(kepler) ? (kepler / 1e3).toFixed(0) + ' km' : 'escapes', '| engine fly(Cd=0)', vac.escaped ? 'escapes' : (vac.apex / 1e3).toFixed(0) + ' km');
}
