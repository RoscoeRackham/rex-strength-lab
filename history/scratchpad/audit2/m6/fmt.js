const fs = require('fs');
const src = fs.readFileSync('/home/user/dino-strength-sim/src/app.html', 'utf8');
const a = src.indexOf('// ---------------------------------------------------------------- formatting');
const b = src.indexOf('// ---------------------------------------------------------------- state');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K || (P.default && P.default.K);
const code = src.slice(a, b);
const f = new Function('K', 'D', code + '; return {sig, sci, big, fmtMass, fmtSI, fmtTNT, compareEnergy, fmtSpeed, fmtDist, fmtTime, fmtRatio};')(K, D);
module.exports = f;
if (require.main === module) {
  for (const J of [4.15e3, 4.165e3, 4.17e3, 4.18e3, 4.184e3, 4.183e6, 4.1825e6, 4.18e9, 4.1835e9]) console.log(J, f.fmtTNT(J));
  console.log(f.sig(5e-30, 2), '|', f.sig(1.234e-5, 2));
  console.log(f.big(62985, 3), f.big(746269, 2), f.sig(62985, 3), f.sig(746269, 2));
}
