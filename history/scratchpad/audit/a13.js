const { P, D, g, S, O, T, ctx } = require('./common');
const base = ctx(511, { surface: 'concrete' });
const at = (kg) => Object.assign({}, base, { F: kg * g });
// exactly as app.html thresholds(): th = (pred) => P.threshold((F) => pred(F / g), 10^1, 10^34)
const th = (pred) => P.threshold((F) => pred(F / g), 10, 1e34);
const boomPred = (kg) => P.punch(at(kg)).vFist >= P.K.a0;
const appKg = th(boomPred);
const trueKg = P.threshold(boomPred, 10, 1e34);
console.log('boom: app ladder value (labelled kg)', appKg.toPrecision(5), '| true lift kg', trueKg.toPrecision(5), '| ratio', (appKg / trueKg).toFixed(4));
console.log('check: punch at app value', P.punch(at(appKg)).vFist.toFixed(1), 'm/s; at true value', P.punch(at(trueKg)).vFist.toFixed(1), 'm/s; at true/1.01', P.punch(at(trueKg/1.01)).vFist.toFixed(1));
const jp = (kg) => { const j = P.jump(at(kg)); return j.v > 0 && (j.flight.apex >= 93 || j.flight.escaped || j.flight.relativistic); };
console.log('jumpliberty: app ladder value', th(jp).toPrecision(4), '| first strength where engine jump >= 93 m', (() => { for (let lg = 1; lg < 34; lg += 0.001) if (jp(10 ** lg)) return (10 ** lg).toPrecision(4); })());
