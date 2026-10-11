const { P, D, g, surf, obj, V, C } = require('./h.js');
const o = obj(process.argv[2]); const Dd = Number(process.argv[3]);
for (const lg of process.argv[4].split(',').map(Number)) {
  const cR = C({ kg: Math.pow(10, lg) }), cO = C({ kg: Math.pow(10, lg) });
  const L = P.catchLeg(cR, cO, o, Dd, process.argv[5] || 'hard');
  const th = L.thetaDeg != null ? L.thetaDeg : L.aim && L.aim.thetaDeg;
  const direct = th != null ? P.throwObject(Object.assign({}, cR, { noFlight: true }), o, th).v : null;
  console.log('lg', lg, L.result, 'theta', th, 'vL(table)', L.vL || (L.aim && L.aim.vL), 'direct v at that angle', direct, L.escaped ? 'escaped' : '', L.orbit ? 'orbit' : '', L.farthest ? 'farthest ' + JSON.stringify(L.farthest) : '');
}
