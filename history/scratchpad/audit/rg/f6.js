const { P, D, g, ctx, ctxO, obj } = require('./h.js');
function run(name, o, oid, ld, style) {
  const cR = ctx(o), cO = ctxO(o); const ob = obj(oid);
  const Dd = Math.max(P.catchMinD(cR.body, cO.body, ob), Math.pow(10, ld));
  const t0 = process.hrtime.bigint();
  const a = P.catchLeg(cR, cO, ob, Dd, style);
  const b = P.catchLeg(cO, cR, ob, Dd, style);
  console.log(name, a.result, b.result, Number(process.hrtime.bigint() - t0) / 1e6, 'ms');
}
run('b777', { H: 0.1, m: 0.0225, oH: 500, oM: 2.8125e9, logKg: 12 }, 'b777', 4, 'easy');
run('eiffel', { logKg: 12 }, 'eiffel', 5, 'easy');
const t0 = Date.now();
const cR = ctx({ H: 2, m: 1e21, logKg: 34 }), cO = ctxO({ oH: 2, oM: 1e21, logKg: 34, oAnchor: 'bolted' });
const r = P.shoveBoth(cR, cO);
console.log('shoveBoth', Date.now() - t0, 'ms', r.vA, r.vB, r.relativistic);
