const { P, D, g, surf, obj, V, C } = require('./h.js');
const o = obj(process.argv[2]); const Dd = Number(process.argv[3]);
for (const lg of process.argv[4].split(',').map(Number)) {
  const cR = C({ kg: Math.pow(10, lg) }), cO = C({ kg: Math.pow(10, lg) });
  const L = P.catchLeg(cR, cO, o, Dd, 'hard');
  const ths = [0, 7.5, 15, 22.5, 30, 45, 60, 90];
  const vs = ths.map((th) => { const r = P.throwObject(Object.assign({}, cR, { noFlight: true }), o, th); return (r.canMove ? r.v : 0).toPrecision(4) + (r.basis ? r.basis[0] : ''); });
  console.log('lg', lg, L.result, 'th', L.aim && L.aim.thetaDeg.toFixed(2), 'vL', L.aim && L.aim.vL.toPrecision(4), 'vE', L.aim && L.aim.vE.toPrecision(4), 'vArr', L.vArrive && L.vArrive.toPrecision(4), 'time', L.time && L.time.toPrecision(4), '| vOf', vs.join(' '));
}
