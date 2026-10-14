const { P, ctx } = require('./env');
let lo = 1, hi = 1e6;
for (let i = 0; i < 100; i++) { const m = Math.sqrt(lo * hi); if (P.stomp(ctx(m)).E < 431.98) lo = m; else hi = m; }
const a = P.stomp(ctx(lo)), b = P.stomp(ctx(lo, { ownRecoil: false }));
console.log('kg', lo.toFixed(1), 'on: E', a.E.toFixed(2), 'vBody', a.vBody, 'bolted', a.bolted, '| off: E', b.E.toFixed(2), 'vBody', b.vBody, 'footShare', b.footShare);
