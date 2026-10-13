const { P, D, body, surface, ctx, obj, K } = require('./common');
const ollie = P.makeBody({ build: 'ollie', H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m });
const kg = Math.pow(10, 23.2587);
const cR = ctx(kg), cO = ctx(kg, { body: ollie });
const g = P.catchGame(cR, cO, obj('baseball'), 100, 'hard');
const a = g.a, k = a.catch;
console.log('leg a result', a.result, 'fast', a.fast, 'vArrive/c', a.vArrive / K.c);
console.log('catch: carried', k.carried, 'uAfter/c', (k.uAfter / K.c).toFixed(4), 'slide', k.slide, 'Ecatch', k.Ecatch.toExponential(3), 'Ediss', k.Ediss.toExponential(3), 'E1', k.E1.toExponential(3));
console.log('roundTrip', g.round, 'blast fields on leg:', Object.keys(a).filter(x => /blast|air|fire/i.test(x)), 'catch keys with air:', Object.keys(k).filter(x => /air|near|blast/i.test(x)));
// independent: relativistic perfectly inelastic, then pair moves together
const c = K.c, c2 = c * c, m = obj('baseball').m, M = ollie.m;
const E0 = k.pIn ? null : null;
const p = k.pIn; const Eb = Math.sqrt(p * p * c2 + m * m * c2 * c2); // total energy of the ball
const Etot = Eb + M * c2, Mf = Math.sqrt(Etot * Etot - p * p * c2) / c2, u = p * c2 / Etot, gam = Etot / (Mf * c2);
const KEpair = Etot - Mf * c2;
console.log('independent: Mf', Mf.toFixed(0), 'kg; u/c', (u / c).toFixed(4), 'gamma', gam.toFixed(3), 'KE of pair', KEpair.toExponential(3), 'J =', (KEpair / 4.184e18).toFixed(0), 'Gt TNT');
// air along a level ride: column rho0 * Hs / 0.03 per m^2, Ollie's front area
const area = Math.max(ollie.frontArea, obj('baseball').area);
const fa = P.fastAir({ m: Mf, area }, KEpair, 0, 1);
console.log('Ollie front area', area.toFixed(2), 'fastAir: x', fa.x.toFixed(1), 'Eair', fa.Eair.toExponential(3), 'J (', (fa.Eair / 4.184e18).toFixed(0), 'Gt TNT ), dHalf', fa.dHalf.toFixed(0), 'm');
// fireballAt-style Enear over sqrt(2 R Hs)
const Lnear = Math.sqrt(2 * K.R_E * K.Hs), x2 = K.rho0 * area * Lnear / Mf, g1 = KEpair / (Mf * c2);
const Enear = 2 * KEpair * x2 / (Math.sqrt((1 + x2) ** 2 + 2 * g1 * x2) + 1 + x2);
console.log('Enear-style (fireballAt formula) over', (Lnear / 1000).toFixed(0), 'km:', Enear.toExponential(3), 'J');
// compare share 0.9999 -> fireballAt counts Enear
const cR2 = ctx(kg, { airAbsorb: 0.99 });
const g2 = P.catchGame(cR2, cO, obj('baseball'), 100, 'hard');
console.log('share 0.99: result', g2.a.result, 'fireball kind', g2.a.fireball && g2.a.fireball.kind, 'Enear', g2.a.fireball && g2.a.fireball.Enear.toExponential(3), 'Eblast', g2.a.fireball && g2.a.fireball.Eblast.toExponential(3));
