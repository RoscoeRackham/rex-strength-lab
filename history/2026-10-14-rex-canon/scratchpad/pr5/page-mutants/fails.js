// the pr5 check ids that failed in a shots.js log (node fails.js <log>)
const t = require('fs').readFileSync(process.argv[2], 'utf8');
const all = ['solo-tiles', 'duo-tiles', 'duo-who', 'powers-off', 'weight', 'unbounded', 'a11y', 'follows', 'copy', 'glow-features', 'layout', 'no-scroll', 'motion'];
const i0 = t.indexOf('PROBLEM pull request 5'), line = i0 < 0 ? '' : t.slice(i0);
const failed = all.filter((i) => line.includes('pr5 [' + i + ']'));
const crashed = !/^(ok|PROBLEM)   ?pull request 5/m.test(t) && !line;
console.log(JSON.stringify({ failed, passed: all.filter((i) => !failed.includes(i)), crashed, ok: /^ok   pull request 5/m.test(t) }));
