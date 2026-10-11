// Broad grid of page states.
const fs = require('fs');
const V = (H) => 0.18 * Math.pow(H / 2, 3);
const rhos = [30, 1000, 22587, 2.77e9, 4.12e17, 1e22, 1.3e27];
const Hs = [0.1, 2, 500];
const logs = [1, 2.7, 4.96, 8, 14, 22, 34];
const cases = [];
const add = (name, s) => cases.push([name, s]);
const solo = ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
for (const a of solo) for (const lg of logs.concat(['inf'])) for (const H of [0.1, 2, 500]) for (const rho of [30, 1000, 4.12e17]) for (const mode of ['comic', 'real']) {
  const s = { group: 'solo', action: a, mode, H, m: rho * V(H) };
  if (lg === 'inf') s.inf = true; else s.logKg = lg;
  add(`solo ${a} ${lg} H${H} rho${rho} ${mode}`, s);
}
fs.writeFileSync(process.argv[2], JSON.stringify(cases));
console.log(cases.length);
