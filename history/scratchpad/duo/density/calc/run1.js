const X = require('./weight.js'); const { W, P, K } = X;
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
console.log('PREM mass', X.PREM_MTOT.toExponential(5), 'gR', X.premG(K.R_E).toFixed(4), 'g CMB', X.premG(3480e3).toFixed(4), 'g ICB', X.premG(1221.5e3).toFixed(4), 'Phi(0)', X.premPhi(0).toExponential(5), 'vmax', Math.sqrt(-2*X.premPhi(0)).toFixed(1));
// binding energy from PREM: U = int G M(r) dm / r
{ let U=0; const n=200000; for(let i=0;i<n;i++){const r=(i+0.5)*K.R_E/n; const dm=4*Math.PI*r*r*X.premRho(r)*K.R_E/n; U+= W.G*X.premMassFrac(r)*X.PREM_MTOT*dm/r;} console.log('PREM binding energy J', U.toExponential(4)); }
const H = 2, V = P.bodyVolume(H), Req = X.eqRadius(V);
console.log('V', V, 'Req', Req.toFixed(5), 'rhoBH', X.blackHoleDensity(H).toExponential(4), 'mBH', (X.blackHoleDensity(H)*V).toExponential(4), 'mBH/ME', (X.blackHoleDensity(H)*V/W.M_E).toFixed(2), 'Buchdahl m', (8/9*X.blackHoleDensity(H)*V).toExponential(4));
const sirB = 1.017*1.9884e30 / (4/3*Math.PI*Math.pow(0.00803*6.957e8,3));
const ns = 1.5*1.9884e30/(4/3*Math.PI*Math.pow(12e3,3));
console.log('Sirius B mean density', sirB.toExponential(4), ' ESA numbers', (0.98*1.9884e30/(4/3*Math.PI*Math.pow(6e6,3))).toExponential(3), ' NS(1.5Msun,12km)', ns.toExponential(4), ' n0*m_n', (0.16e45*1.67492750e-27).toExponential(4));
const presets = [['plush',30],['water',1000],['human',1060],['steel',7850],['osmium',22587],['whiteDwarf',2.77e9],['neutronStar',4.12e17],['blackHole',X.blackHoleDensity(H)]];
const surfaces = D.surfaces;
for (const [id, rho] of presets) {
  const body = P.makeBody({ H, m: rho*V });
  const sg = X.selfGravity(body);
  const gr = surfaces.map((s)=>{const g=X.groundUnderWeight(body,s,false); return s.id+':'+g.regime+(g.sink?'('+g.sink.toPrecision(3)+'m)':'')+' r'+g.standRatio.toPrecision(3);}).join(' ');
  console.log('\n==', id, 'rho', rho.toExponential(4), 'm', body.m.toExponential(4), 'W N', (body.m*K.g).toExponential(4), 'foot p', (body.m*K.g/(2*body.footArea)).toExponential(4));
  console.log('  GM', sg.GM.toExponential(4), 'gSurf', sg.gSurf.toExponential(4), '(', (sg.gSurf/K.g).toExponential(3), 'g) vEsc', sg.vEsc.toExponential(4), 'dBeat', sg.dBeat.toExponential(4), 'rB', sg.rBondi.toExponential(4), 'bondi kg/s', sg.bondiRate.toExponential(3), 'heat J/kg', sg.heatPerKg.toExponential(3), 'P W', sg.infallPower.toExponential(3), 'T', sg.infallT.toFixed(0), 'holdsAir', sg.holdsAir, 'rCrush', sg.rCrush.toExponential(3), 'rCrushUnconf', sg.rCrushUnconfined.toExponential(3), 'rs', sg.rs.toExponential(4), 'BH', sg.blackHole, 'Buchdahl', sg.buchdahl);
  console.log('  tidal1g (1.8 m person)', sg.tidal1g.toExponential(3), 'tidal at 10 m', (sg.tidal(10,1.8)/K.g).toExponential(3), 'g; at 1 km', (sg.tidal(1000,1.8)/K.g).toExponential(3),'g', 'decompJ', sg.decompJ.toExponential(3));
  console.log('  ground:', gr);
  const mv = X.moveCheck(90718.474*K.g, body.m); console.log('  moves at default dial (100 short tons):', mv.stand, mv.walk, mv.run, 'need kg stand/walk/run', mv.standNeedKg.toExponential(3), mv.walkNeedKg.toExponential(3), mv.runNeedKg.toExponential(3));
  if (sg.beatsOutside) { const f10 = X.infall(sg.GM, sg.R, 10), f100 = X.infall(sg.GM, sg.R, 100); console.log('  object from 10 m: t', f10.t.toExponential(3), 'v', f10.v.toExponential(3), ' from 100 m: t', f100.t.toExponential(3), 'v', f100.v.toExponential(3)); }
}
console.log('\nthresholds at 2 m:');
const q = (s) => P.qultFor(s, P.makeBody({H}).footB);
for (const s of surfaces) console.log('  stands on', s.id, 'until m =', (q(s)*0.09/K.g).toExponential(3), 'kg, rho =', (q(s)*0.09/K.g/V).toExponential(3));
console.log('  falls through when m >', (W.SIGMA_ROCK*0.3/K.g).toExponential(4), 'rho >', (W.SIGMA_ROCK*0.3/K.g/V).toExponential(4));
console.log('  gSurf = g when m =', (K.g*Req*Req/W.G).toExponential(4), 'rho', (K.g*Req*Req/W.G/V).toExponential(4));
console.log('  dBeat = Req when same; holds air when m >', (Math.pow(6*W.V_RMS_AIR,2)*Req/(2*W.G)).toExponential(4), 'rho', (Math.pow(6*W.V_RMS_AIR,2)*Req/(2*W.G)/V).toExponential(4), 'vrms air', W.V_RMS_AIR.toFixed(1));
console.log('  rBondi = Req when m =', (K.a0*K.a0*Req/W.G).toExponential(4), 'rho', (K.a0*K.a0*Req/W.G/V).toExponential(4));
console.log('  vEsc = 11.186 km/s when m =', (11186*11186*Req/(2*W.G)).toExponential(4));
console.log('  reshape (1e-3 ME)', (1e-3*W.M_E).toExponential(3), 'rho', (1e-3*W.M_E/V).toExponential(3), '; m = ME rho', (W.M_E/V).toExponential(4));
console.log('  rCrush = RE when m =', (W.SIGMA_ROCK*K.R_E/(W.RHO_ROCK*W.G)).toExponential(4));
console.log('  E per kg neutron matter', W.E_NEUTRON_MATTER.toExponential(4), 'P range', W.P_NEUTRON_MATTER.map(x=>x.toExponential(3)));
