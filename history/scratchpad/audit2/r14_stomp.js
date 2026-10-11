global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
// Unit check at 20 km/s boundary
for (const rho of [115, 1000, 8000, 3000]) {
  const m = 1000, L = Math.cbrt(6*m/(Math.PI*rho));
  const a = P.craterDiameter({L, v:19999.9, rhoI:rho, rhoT:2400, angleDeg:90, E:0.5*m*19999.9**2}).D;
  const b = P.craterDiameter({L, v:20000.1, rhoI:rho, rhoT:2400, angleDeg:90, E:0.5*m*20000.1**2}).D;
  console.log('rho', rho, a.toFixed(2), b.toFixed(2), ((b/a-1)*100).toFixed(1)+'%');
}
// complex transition
const f = (Dtc) => { const L = Math.pow(Dtc/(1.161*Math.pow(20000,0.44)*Math.pow(g,-0.22)), 1/0.78); return P.craterDiameter({L, v:20000, rhoI:2400, rhoT:2400, angleDeg:90, E:0.5*2400*Math.PI/6*L**3*4e8}).D; };
console.log('Dtc 2559 ->', f(2559).toFixed(0), ' 2561 ->', f(2561).toFixed(0));
// stomp sweep
for (const mode of ['comic','real']) for (const s of D.surfaces) {
  let prev = null, prevLg = null;
  for (let i = 100; i <= 3400; i++) {
    const lg = i/100;
    const r = P.stomp({ F: Math.pow(10, lg)*g, mode, body, surface: s, groundHolds: false, anchor: 'friction' });
    if (prev && r.crater > 0 && prev.crater > 0 && r.crater < prev.crater*0.999) console.log(mode, s.id, 'stomp crater drop at', prevLg, '->', lg, prev.crater.toFixed(0), '->', r.crater.toFixed(0), 'vFoot', prev.vFoot.toFixed(0), r.vFoot.toFixed(0));
    if (prev && prev.vFoot <= 20000 && r.vFoot > 20000) console.log(mode, s.id, 'cross 20km/s at', prevLg, '->', lg, prev.crater.toFixed(1), '->', r.crater.toFixed(1), ((r.crater/prev.crater-1)*100).toFixed(1)+'%');
    prev = r; prevLg = lg;
  }
}
