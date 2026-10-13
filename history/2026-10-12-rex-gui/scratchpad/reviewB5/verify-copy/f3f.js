const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const v0 of [564495, 91000, 30000]) {
  const f = P.fly({ v0, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd, CdSup: 1.75, record: true });
  const path = f.path || [];
  // find the point at ~100 km and ~200 km
  const at = (h) => { for (let i = 1; i < path.length; i++) if (path[i].y >= h || path[i][1] >= h) return path[i]; return null; };
  console.log(v0, 'escaped', f.escaped, 'landed', f.landed, 'pathlen', path.length, 'sample', JSON.stringify(path[path.length-1]), JSON.stringify(path[1]));
}
