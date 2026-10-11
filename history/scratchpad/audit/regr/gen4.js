const fs = require('fs');
const V = (H) => 0.18 * Math.pow(H / 2, 3);
const cases = [];
const add = (name, s) => cases.push([name, s]);
const strengths = [1, 2.7, 4.96, 10, 16, 22, 34, 'inf'];
const bodies = [[2, 1000, 2, 1000], [2, 4.12e17, 2, 1000], [2, 1000, 2, 4.12e17], [0.1, 1000, 500, 1000], [500, 1000, 0.1, 1000], [2, 30, 2, 30], [2, 2.77e9, 2, 2.77e9], [2, 1e21, 2, 1000]];
const S = (lg, s) => { if (lg === 'inf') s.inf = true; else s.logKg = lg; return s; };
let i = 0;
for (const lg of strengths) for (const [H, rho, oH, orho] of bodies) for (const mode of ['comic', 'real']) for (const gh of [false, true]) for (const anchor of ['friction', 'bolted']) {
  const base = { group: 'duo', duoAction: 'collide', mode, groundHolds: gh, H, m: rho * V(H), oH, oM: orho * V(oH), oAnchor: anchor, anchor: i % 3 === 0 ? 'bolted' : 'friction' };
  const tag = `${lg} R(${H},${rho}) O(${oH},${orho}) ${mode} gh${gh} oA${anchor}`;
  add('push ' + tag, S(lg, Object.assign({ colMode: 'push', colInf: i % 4 === 0, colImm: i % 5 === 0 }, base)));
  for (const src of ['sprint', 'jump', 'stomp', 'set']) for (const who of ['ollie', 'rex']) {
    i++;
    const st = Object.assign({ colMode: 'charge', colWho: who, colSrc: src, colBounce: i % 2 ? 'splat' : 'bounce', colImm: i % 7 === 0, colInf: i % 11 === 0, colGB: [-8.48, -4, -2, 0, 2, 4][i % 6] }, base);
    add(`charge ${src} ${who} gb${st.colGB} imm${st.colImm} inf${st.colInf} ` + tag, S(lg, st));
  }
}
fs.writeFileSync(process.argv[2], JSON.stringify(cases));
console.log(cases.length);
