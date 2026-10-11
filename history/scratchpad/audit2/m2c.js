// Snowplow estimate with breakup: rigid until shock crosses body (size/Us), then debris expands laterally at u.
// Swept air M(x); half the KE is heat when M = m. 45 deg path through exponential atmosphere (H = 8.5 km).
const objs = { tank:[6.68e4,28.7,7,0], shuttle:[2.04e6,400,56,0], titanic:[5.31e7,8100,269,0], esb:[3.31e8,18000,443,0], pyramid:[6e9,34700,230,0], car:[1340,8.7,4.5,0], baseball:[0.145,0.00427,0.074,0] };
const vOf = { tank:0.1, shuttle:0.1, titanic:0.88, esb:0.528, pyramid:0.139, car:0.1, baseball:0.1 };
const rho0 = 1.225, H = 8500, th = Math.PI/4, c = 2.998e8;
for (const [id,[m,A,size]] of Object.entries(objs)) {
  const v = Math.min(vOf[id],0.3)*c; // nonrel snowplow, cap v for geometry
  const pram = rho0*v*v; const up = Math.sqrt(pram/(2700*1.3)); const Us = 1.3*up+5000;
  const xs = v*size/Us;
  const res = [];
  for (const u of [3e5, 1e6, 3e6]) {
    let M = 0, x = 0, dx = 1, r0 = Math.sqrt(A/Math.PI), found = null;
    while (x < 3e6) {
      const r = x < xs ? r0 : r0 + u*(x-xs)/v;
      M += rho0*Math.exp(-x*Math.sin(th)/H)*Math.PI*r*r*dx; x += dx; dx = Math.max(1, x*1e-3);
      if (M >= m) { found = x; break; }
    }
    res.push('u=' + u/1e3 + 'km/s: ' + (found ? (found/1e3).toPrecision(3)+' km' : 'exits (M/m=' + (M/m).toPrecision(2) + ')'));
  }
  const Rs = Math.cbrt(3*m/(4*Math.PI*rho0));
  console.log(id.padEnd(9), 'shock-transit dist', (xs/1e3).toPrecision(2),'km', '| sphere lower bound', (Rs/1e3).toPrecision(2),'km |', res.join(' | '), '| m/(rho A)', (m/(rho0*A)/1e3).toPrecision(3), 'km');
}
