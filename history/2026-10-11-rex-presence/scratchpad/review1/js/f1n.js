const { P, g, ctxOf } = require('./env.js');
// clap: blast vs speed around Mach 1
for (const kg of [7.2e6, 7.26e6, 7.28e6, 7.29e6, 7.3e6]) {
  const r = P.clap(ctxOf(Infinity, { use: kg * g }));
  const rc = P.RESTRAINT.reach('clap', r, { near: 5 });
  console.log(kg, 'vHand', r.vHand.toFixed(2), 'E MJ', (r.E/1e6).toFixed(2), 'air reach', rc.air.toFixed(1), 'boom', rc.boom, 'eardrum-ish blastRadius(35kPa)', P.blastRadius(r.E, 34500).toFixed(2));
}
console.log('a0', P.K.a0);
