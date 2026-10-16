const { P, g, R3, O3, c3, dial, sig, conc } = require('./h.js');
const ch = (F, o, xR, xO) => P.collide(c3(F, O3, xO), c3(F, R3, xR), o);
const r = ch(dial, { source: 'sprint' });
const k = r.carry;
console.log('outcome', r.outcome, 'v', k.v, 'pGain', k.pGain, 'footJ', k.footJ, 'supplied', k.supplied, 'F', k.F, 'T', k.T, 'hold', k.hold);
console.log('Q', r.Q, 'h2.Q?', P.momentumToKE(k.pGain, R3.m), 's', r.contact.s, 'soft', r.contact.soft, 'during', r.after.splat.during, 'slide', r.after.splat.slide);
// energy balance: source work = F * v * T
const W = k.F * k.v * k.T;
console.log('W src', W, 'KE', P.momentumToKE(k.pGain, R3.m), 'hold*during', k.hold * r.after.splat.during, 'Q', r.Q, 'sum', P.momentumToKE(k.pGain, R3.m) + k.hold * r.after.splat.during + r.Q);
// check alternative: during = v*T - s ; work by hold on ground frame: hold * (Rex displacement during)
// Rex's displacement during squash: Rex accelerates from 0 to v uniformly (constant net force (F - hold)) over T => x = v T / 2
console.log('vT/2', k.v * k.T / 2, 'vT - s', k.v * k.T - r.contact.s);
