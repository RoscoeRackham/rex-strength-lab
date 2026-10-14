const { P, D, body, surf, ctx } = require('./eng.js');
const ob = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const o = D.objects.find((x) => x.id === 'baseball');
const L = P.catchLeg(ctx(1e20), Object.assign(ctx(1e20), { body: ob }), o, 10, 'hard');
const v = L.aim.vL, g = 1 / Math.sqrt(1 - (v / P.K.c) ** 2);
const h = P.handAir(body, o, v, g);
console.log('thrower hand air (Throw-tab rule):', h.E.toPrecision(3), 'J =', (h.E / 4.184e15).toPrecision(3), 'Mt; mAir', h.mAir.toPrecision(3));
const u = L.catch.uAfter, M = ob.m + o.m, gu = 1 / Math.sqrt(1 - (u / P.K.c) ** 2);
const KE = (gu - 1) * M * P.K.c ** 2;
// level path: air column per m^2 along a grazing path ~ rho0*Hs/0.03 (fastAir floor); Ollie's front area
const col = 1.225 * 8400 / 0.03, x = col * ob.frontArea / M;
console.log('Ollie ride KE', KE.toPrecision(3), 'J =', (KE / 4.184e15).toPrecision(3), 'Mt; frontArea', ob.frontArea.toFixed(2), 'air column / his mass x =', x.toFixed(0), '; length to sweep his own mass of air', (M / (1.225 * ob.frontArea)).toFixed(0), 'm');
console.log('blastRadius houses 26.8 kPa for half the KE:', P.blastRadius(KE / 2, 26800).toPrecision(3), 'm');
