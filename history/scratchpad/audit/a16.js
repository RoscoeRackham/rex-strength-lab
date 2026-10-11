const { P, D, g, S, O, T, ctx } = require('./common');
for (const [H, kg] of [[50, 511], [50, 90718], [2, 50]]) {
  const c = ctx(kg, { H, surface: 'concrete' });
  const r = P.sprint(c);
  console.log(`H=${H} lift=${kg}: thrust ${r.thrust.toFixed(0)} N, friction cap ${(0.8 * c.body.m * g).toPrecision(3)} N, limit label '${r.limit}', accelG ${r.accelG.toPrecision(3)} (UI text claims "about 0.8 g"), vTop ${r.vTop.toFixed(2)} ${r.topLimit}`);
}
for (const [sid, q, rho] of [['sand', 150e3, 1600], ['clay', 100e3, 1700], ['asphalt', 2e6, 2300], ['concrete', 10e6, 2400], ['granite', 400e6, 2700]]) console.log('Poncelet crossover v* = sqrt(q/rho)', sid, Math.sqrt(q / rho).toFixed(1), 'm/s');
// stomp at Kaiju on clay vs lift standRatio and sprint claims at Secret Wars
const ck = ctx(1.36e11, { H: 50, surface: 'clay' });
console.log('kaiju clay SecretWars: standRatio', P.lift(ck, O.car).standRatio.toFixed(2), 'sprint accelG', P.sprint(ck).accelG.toFixed(2), 't100', P.sprint(ck).t100.toFixed(2), 'limit', P.sprint(ck).limit);
// pull 747 at record-human strength
const ch = ctx(511, { surface: 'concrete' });
const p = P.pull(ch, O.b747);
console.log('747 pull at 511 kg: resist', p.resist.toFixed(0), 'N, footing', p.anchor.R.toFixed(0), 'N, F', ch.F.toFixed(0), 'canMove', p.canMove, 'limitedBy', p.limitedBy, '| crr implied by 188,830 kg record with 1412 N footing:', (1412.16 / (188830 * g)).toExponential(2));
for (const deg of [0, 20, 30, 40, 45]) { const a = P.anchorCapacity({ body: ch.body, surface: S.concrete, theta: deg * Math.PI / 180 }); console.log('rope angle', deg, 'deg below horizontal -> footing', a.R.toFixed(0), 'N (', (a.R / 1412.16).toFixed(2), 'x )'); }
