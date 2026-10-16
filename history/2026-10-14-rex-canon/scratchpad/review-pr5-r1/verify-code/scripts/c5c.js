const { P, g, c9, obj, sig } = require('./common.js');
for (const mR of [1e11, 1e12, 1e13]) for (const id of ['car', 'baseball']) { const body = P.makeBody({ build: 'rex', H: 3.048, m: mR }); let line = [];
  for (let e = 2; e <= 14; e += 0.5) { const r = P.throwObject(c9(Math.pow(10, e) * g, body), obj(id), 45); line.push(e + ':' + (r.canMove ? sig(r.v, 2) + '/' + sig(r.escapeNeeded, 2) + (r.fallsBack ? 'FB' : '') : 'x')); }
  console.log(id, sig(mR, 2), line.join(' ')); }
