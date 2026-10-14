const { P, D, ctx } = require('./env');
const car = D.objects.find(o => o.id === 'car');
const a = P.pull(ctx(1e5), car), b = P.pull(ctx(1e5, { anchor: 'bolted', ownRecoil: false }), car), c0 = P.pull(ctx(1e5, { ownRecoil: false }), car);
console.log('ownRecoil t10m', a.t10m, 'footLimited', a.footLimited, '| bolted t10m', b.t10m, '| neither', c0.t10m);
