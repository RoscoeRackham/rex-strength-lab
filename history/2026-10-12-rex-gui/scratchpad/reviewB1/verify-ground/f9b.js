const { P } = require('./h.js');
const c = P.K.c;
const p = P.pushApart({ F: 1e20 * 9.81, d: 0.5, mA: 1000, mB: 1000, RA: Infinity, RB: 0, mode: 'comic' });
const gam = 1 / Math.sqrt(1 - (p.vB / c) ** 2);
console.log('vB/c', p.vB / c, 'pB', p.pB.toPrecision(4), 'gamma m v', (gam * 1000 * p.vB).toPrecision(4), 'm v', (1000 * p.vB).toPrecision(4));
