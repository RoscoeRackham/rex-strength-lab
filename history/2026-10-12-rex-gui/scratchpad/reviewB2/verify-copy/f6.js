const { P, D, body, surf, ctx } = require('./eng.js');
const o = D.objects.find((x) => x.id === 'car');
for (const kf of [true, false]) { const r = P.lift(ctx(100 * 907.18474, { keepForm: kf }), o); console.log('keepForm', kf, 'plateNeeded', r.plateNeeded, 'gripRatioRaw', r.gripRatioRaw, 'gentle', r.gentle, 'W/crush', r.weight / o.crush); }
