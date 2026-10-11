const fs = require('fs');
const V = (H) => 0.18 * Math.pow(H / 2, 3);
const cases = [];
const add = (name, s) => cases.push([name, s]);
const rhos = [30, 1000, 2.77e9, 4.12e17, 1e24];
const strengths = [1, 2.7, 4.96, 10, 20, 34, 'inf'];
const bodies = [[2, 1000], [0.1, 1000], [500, 1000], [2, 30], [2, 2.77e9], [2, 4.12e17], [2, 1e24], [0.1, 4.12e17], [500, 30]];
const S = (lg, s) => { if (lg === 'inf') s.inf = true; else s.logKg = lg; return s; };
for (const lg of strengths) for (const [H, rho] of bodies) for (const [oH, orho] of [[2, 1000], [H, rho], [0.5, 4.12e17], [100, 30]]) for (const mode of ['comic', 'real']) for (const gh of [false, true]) {
  const base = { group: 'duo', mode, groundHolds: gh, H, m: rho * V(H), oH, oM: orho * V(oH), oSame: true };
  const tag = `${lg} R(${H},${rho}) O(${oH},${orho}) ${mode} gh${gh}`;
  add('arm ' + tag, S(lg, Object.assign({ duoAction: 'arm' }, base)));
  for (const mv of ['push', 'shove', 'lift', 'throw']) for (const who of ['rex', 'ollie', 'both']) {
    if (mv === 'push' && who !== 'rex') continue;
    add(`wrestle ${mv} ${who} ` + tag, S(lg, Object.assign({ duoAction: 'wrestle', wrestleMove: mv, wrestleWho: who }, base)));
  }
}
fs.writeFileSync(process.argv[2], JSON.stringify(cases));
console.log(cases.length);
