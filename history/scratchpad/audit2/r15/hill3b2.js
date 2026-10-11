// Hill's approximation of the Sun-Earth restricted 3-body problem (rotating frame, x toward anti-Sun).
// x'' = 2n y' + 3n^2 x - GM x/r^3 ; y'' = -2n x' - GM y/r^3 ; z'' = -n^2 z - GM z/r^3
const GM = 3.986004418e14, R = 6.371e6, n = 2*Math.PI/(365.25636*86400);
const rH = Math.cbrt(GM/(3*n*n));
console.log('Hill radius km', (rH/1e3).toFixed(0));
function kepApexV(r0, ra) { // radial launch speed from r0 to reach ra
  return Math.sqrt(2*GM*(1/r0 - 1/ra));
}
function run(ra, dirDeg, outOfPlane, inertial) {
  const r0 = R + 150e3;
  const v = kepApexV(r0, ra + R);
  const th = dirDeg*Math.PI/180;
  let ux = Math.cos(th), uy = Math.sin(th), uz = 0;
  if (outOfPlane) { ux = 0; uy = 0; uz = 1; }
  let s = [r0*ux, r0*uy, r0*uz, v*ux, v*uy, v*uz];
  // launch velocity is inertial; in rotating frame subtract omega x r: omega = n z
  if (!inertial) { s[3] += n*s[1]; s[4] -= n*s[0]; }
  const f = (s) => { const [x,y,z,vx,vy,vz]=s; const r=Math.hypot(x,y,z); const k=-GM/(r*r*r);
    return [vx,vy,vz, 2*n*vy+3*n*n*x + k*x, -2*n*vx + k*y, -n*n*z + k*z]; };
  let t=0, rmax=0, tmax=730*86400, landed=false, apexT=0;
  while (t < tmax) {
    const r=Math.hypot(s[0],s[1],s[2]); const v=Math.hypot(s[3],s[4],s[5]);
    if (r>rmax) { rmax=r; apexT=t; }
    if (r < R && t>100) { landed=true; break; }
    let dt = Math.min(0.002*r/Math.max(v,1e-3), 3600);
    const add=(a,b,h)=>a.map((ai,i)=>ai+h*b[i]);
    const k1=f(s), k2=f(add(s,k1,dt/2)), k3=f(add(s,k2,dt/2)), k4=f(add(s,k3,dt));
    s = s.map((si,i)=> si + dt/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]));
    t+=dt;
  }
  return { landed, days: t/86400, apexKm: (rmax-R)/1e3, finalRkm: Math.hypot(s[0],s[1],s[2])/1e3 };
}
for (const ra of [5e8, 7.5e8, 1.3e9, 1.5e9]) {
  // 2-body round trip time for radial orbit from r0 to ra and back
  const r0=R+150e3, a=(r0+ra+R)/2;
  console.log('--- 2-body apex km', ra/1e3, 'Kepler period-ish days', (2*Math.PI*Math.sqrt(a**3/GM)/86400).toFixed(1));
  const res=[];
  for (let d=0; d<360; d+=45) res.push(d+':'+JSON.stringify(run(ra, d, false)));
  res.push('z:'+JSON.stringify(run(ra,0,true)));
  console.log(res.join('\n'));
}
