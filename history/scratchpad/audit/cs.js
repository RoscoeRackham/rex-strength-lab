const fs = require('fs');
const src0 = fs.readFileSync('/home/user/dino-strength-sim/src/engine.js', 'utf8');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
function load(cs, lnl) {
  let s = src0.replace(/CS_ROCK: 6000,/, 'CS_ROCK: ' + cs + ',');
  if (lnl) s = s.replace('const DF_LNL = 5;', 'const DF_LNL = ' + lnl + ';');
  const f = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/eng_cs_' + cs + '_' + (lnl||5) + '.js';
  fs.writeFileSync(f, s);
  delete require.cache[f];
  return require(f);
}
for (const [cs, lnl] of [[3000],[6000],[9000],[13000],[6000,3],[6000,10]]) {
  const P = load(cs, lnl);
  const b = P.makeBody({ H: 2, m: 7.416e16, build: 'rex' });
  const s = P.settle(b);
  const b3 = P.makeBody({ H: 3.048, m: 2.6245e17, build: 'rex' });
  const s3 = P.settle(b3);
  console.log('cs', cs, 'lnl', lnl||5, '2m settle yrs', s.years.toFixed(1), ' default-H NS settle yrs', s3.years.toFixed(1));
}
