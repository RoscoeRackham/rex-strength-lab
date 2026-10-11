const P = require('/home/user/dino-strength-sim/src/engine.js'); const g = P.K.g;
function sf({ L, v, rhoI, rhoT, Y, mu = 0.55, nu = 0.4 }) { const a = L / 2, r = rhoT / rhoI; const G = g * a / v / v * Math.pow(r, (6 * nu - 2 - mu) / (3 * mu)); const S = Math.pow(Y / (rhoT * v * v) * Math.pow(r, (6 * nu - 2) / (3 * mu)), (2 + mu) / 2); return { SG: S / G, f: Math.pow(1 + S / G, -mu / (2 + mu)) }; }
let s = sf({ L: 4.737, v: 2127, rhoI: 1200, rhoT: 2400, Y: 7.6e6 }); console.log('tank @2127 m/s concrete: S/G', s.SG.toFixed(1), 'factor', s.f.toFixed(3), 'D 61.0 ->', (61.0 * s.f).toFixed(1));
s = sf({ L: 4.737, v: 3000, rhoI: 1200, rhoT: 2400, Y: 7.6e6 }); console.log('tank @3000 concrete S/G', s.SG.toFixed(1), 'factor', s.f.toFixed(3));
// lab-scale sanity: 1 cm Al sphere at 5 km/s into granite
const Dg = P.craterDiameter({ L: 0.01, v: 5000, rhoI: 2700, rhoT: 2700, angleDeg: 90 });
s = sf({ L: 0.01, v: 5000, rhoI: 2700, rhoT: 2700, Y: 18e6 });
console.log('lab 1 cm Al @5 km/s granite: engine D', Dg.toFixed(3), 'm (D/L', (Dg / 0.01).toFixed(0) + ')', 'strength-corrected', (Dg * s.f).toFixed(3), 'm (D/L', (Dg * s.f / 0.01).toFixed(1) + ')');
// Everest-scale (gravity regime should dominate)
s = sf({ L: 4837, v: 2624, rhoI: 2700, rhoT: 2400, Y: 7.6e6 }); console.log('everest S/G', s.SG.toFixed(3), 'factor', s.f.toFixed(3));
