const { P, g, ctx, obj } = require('./common.js');
const bis = (f, lo, hi, target) => { for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) < target) lo = m; else hi = m; } return (lo + hi) / 2; };
const vm = bis((v) => { P.MUSCLE.throwWhip.vmax = v; return P.throwObject(ctx(511, 'real'), obj('baseball'), 0).v; }, 40, 200, 47.3);
console.log('throwWhip vmax needed for 47.3 m/s pitch (forceFrac 0.3):', vm.toFixed(1));
P.MUSCLE.throwWhip.vmax = 55;
const ff = bis((f) => { P.MUSCLE.throwPush.forceFrac = f; return P.throwObject(ctx(511, 'real'), obj('shot'), 37).flight.range; }, 0.2, 0.6, 23.56);
console.log('throwPush forceFrac needed for 23.56 m (vmax 55):', ff.toFixed(3));
