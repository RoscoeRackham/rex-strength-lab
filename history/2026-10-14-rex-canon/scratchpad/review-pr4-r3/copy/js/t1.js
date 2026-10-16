const { P, D, g, mk, ol } = require('./eng.js');
const gb = 0.001 / Math.sqrt(1 - 1e-6);
const r = P.collide(ol(), mk(), { source: 'set', gb });
const f = (k, x) => typeof x === 'number' ? +x.toPrecision(5) : x;
console.log('carry', JSON.stringify(r.carry, f).slice(0, 2000));
console.log('after', JSON.stringify(r.after, f).slice(0, 1500));
const B = mk().body;
console.log('rex frontArea', B.frontArea, 'Cd', B.Cd, 'm', B.m, 'k', 0.5 * P.K.rho0 * B.Cd * B.frontArea);
const k = 0.5 * P.K.rho0 * B.Cd * B.frontArea, m = B.m, V = r.carry.v, R = 17652;
// energy lost to drag vs distance: m v dv/dx = -(R + k v^2) ; E(x)
const KE0 = 0.5*m*V*V;
let v=V, x=0, Edrag=0, dx=0.5;
const marks = [100,200,300,400,500,1000,2000];
let mi=0;
while (v>0.01 && x<20000) { const dragF = k*v*v; Edrag += dragF*dx; const a = (R+k*v*v)/m; const v2 = v*v - 2*a*dx; v = v2>0?Math.sqrt(v2):0; x+=dx; if (mi<marks.length && x>=marks[mi]) { console.log('by', marks[mi], 'm: air took', (Edrag/KE0*100).toFixed(1)+'%'); mi++; } }
console.log('stop x', x, 'air total', (Edrag/KE0*100).toFixed(2)+'%');
