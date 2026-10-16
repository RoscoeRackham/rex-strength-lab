global.window = {};
const P0 = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const P1 = require('./engine-pr2.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const { cases, canon, hash, OFF } = require('/home/user/rex-strength-lab/rex-strength-lab/test/powers-off-cases.js');
const want = /^(arm|push|shove|shoveBoth|liftP|throwP45|throwP0|standoff|standoffImm|collide|collide-set|collide-imm|catch|catch-fast|catch-dense|catch-well|catch-game|toss|toss-fast|throw-car45\||throw-ball30\||throw-person20|throw-bus90|throw-rel|throw-allstar|plan\|throw)/;
const l0 = cases(P0, D).filter((c) => want.test(c.key)), l1 = cases(P1, D).filter((c) => want.test(c.key));
const t0 = Date.now();
let diff = 0, n = 0; const firsts = [];
for (let i = 0; i < l0.length; i++) for (const x of [{}, OFF]) {
  n++;
  const a = hash(canon(l0[i].run(x))), b = hash(canon(l1[i].run(x)));
  if (a !== b) { diff++; if (firsts.length < 5) firsts.push(l0[i].key + ' ' + JSON.stringify(x)); }
}
console.log('cases', n, 'differ', diff, firsts, (Date.now() - t0) + ' ms');
