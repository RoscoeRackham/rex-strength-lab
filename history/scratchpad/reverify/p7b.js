global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
for (const [H,m] of [[3.048,7.06e9],[3.048,1.765e9],[2,4.986e8],[3.048,5e10]]) {
  const b = P.makeBody({H,m});
  const f = P.fallThrough(b, {full:true, tMax:4*86400, record:true});
  const s = f.stuck;
  const last = f.path[f.path.length-1];
  console.log(H,m,'stuck r', s && (s.r/1e3).toFixed(2), 'driftKm', s && s.driftKm.toFixed(1), 'lon(deg)', s && (s.driftKm*1000/s.r*180/Math.PI).toFixed(1), 'firstPass', !!f.firstPass, 'final xy (km)', (last[0]/1e3).toFixed(1), (last[1]/1e3).toFixed(1));
}
