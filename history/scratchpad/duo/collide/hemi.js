// Force between two halves of a uniform sphere (G=M=R=1): z-force on upper half from whole sphere's field.
// Field inside uniform sphere: g = -r (G M r / R^3). Force on upper half = integral rho * g_z dV over z>0.
// g_z = -z ; rho = 3/(4pi). F = -(3/4pi) * int_{z>0} z dV = -(3/4pi) * (pi R^4/4) = -3/16.
// Self-force of the upper half on itself is zero, so this is the pull of the lower half. Check by Monte Carlo of pairwise.
let N=400000, s=0; const rnd=()=>{let x,y,z;do{x=2*Math.random()-1;y=2*Math.random()-1;z=2*Math.random()-1}while(x*x+y*y+z*z>1);return [x,y,z]};
let cnt=0;
for(let i=0;i<N;i++){const a=rnd(),b=rnd(); if(a[2]>0&&b[2]<0){const d=[a[0]-b[0],a[1]-b[1],a[2]-b[2]];const r=Math.hypot(...d);s+=d[2]/(r*r*r);} }
// each pair sampled with prob density (1/V)^2 ; F = G * (M/V)^2 * V^2 * E[...] = E[...] with M=1
console.log('MC F/(GM^2/R^2) =', s/N, ' analytic 3/16 =', 3/16);
const G=6.6743e-11,M=5.9722e24,R=6.371e6; console.log('Earth hemispheres', 3*G*M*M/(16*R*R));
