const fs = require('fs');
const V = (H) => 0.18 * Math.pow(H / 2, 3);
const cases = [];
const add = (name, s) => cases.push([name, s]);
const objs = ['baseball', 'shot', 'piano', 'car', 'bus', 'tank', 'b777', 'shuttle', 'eiffel', 'titanic', 'esb', 'pyramid', 'partner'];
const strengths = [1, 2.7, 4.96, 8, 12, 18, 26, 34, 'inf'];
const ds = [0, 0.5, 1, 2, 3, 4, 5, 6, 7, 7.31];
const bodies = [[2, 1000, 2, 1000], [2, 4.12e17, 2, 1000], [2, 1000, 2, 4.12e17], [2, 4.12e17, 2, 4.12e17], [0.1, 1000, 500, 30], [500, 1000, 0.1, 1000], [2, 2.77e9, 2, 2.77e9], [2, 30, 2, 30]];
const S = (lg, s) => { if (lg === 'inf') s.inf = true; else s.logKg = lg; return s; };
for (const lg of strengths) for (const o of objs) for (const d of ds) for (const st of ['easy', 'hard']) for (const [H, rho, oH, orho] of bodies) {
  const mode = (d * 10 + objs.indexOf(o)) % 2 ? 'real' : 'comic';
  add(`catch ${o} lg${lg} d${d} ${st} R(${H},${rho}) O(${oH},${orho}) ${mode}`, S(lg, { group: 'duo', duoAction: 'catch', cObj: o, cLogD: d, cStyle: st, cMiss: d === 3, mode, H, m: rho * V(H), oH, oM: orho * V(oH) }));
}
fs.writeFileSync(process.argv[2], JSON.stringify(cases));
console.log(cases.length);
