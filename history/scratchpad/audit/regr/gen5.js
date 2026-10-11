const fs = require('fs');
const V = (H) => 0.18 * Math.pow(H / 2, 3);
const cases = [];
const add = (name, s) => cases.push([name, s]);
const pairs = [[1, 34], [34, 1], [4.96, 'inf'], ['inf', 4.96], ['inf', 'inf'], [2.7, 2.7], [20, 8]];
const bodies = [[2, 1000, 2, 1000], [2, 30, 2, 4.12e17], [0.1, 1000, 500, 1000], [500, 30, 0.1, 2.77e9], [2, 1e21, 2, 1e21]];
const anchors = [['friction', 'friction'], ['bolted', 'friction'], ['friction', 'bolted'], ['bolted', 'bolted'], ['braced', 'braced']];
let i = 0;
for (const [a, b] of pairs) for (const [H, rho, oH, orho] of bodies) for (const [an, oan] of anchors) for (const mode of ['comic', 'real']) for (const gh of [false, true]) {
  i++;
  const base = { group: 'duo', mode, groundHolds: gh, H, m: rho * V(H), oH, oM: orho * V(oH), oSame: false, anchor: an, oAnchor: oan, surface: ['concrete', 'sand', 'ice', 'granite', 'steel'][i % 5] };
  if (a === 'inf') base.inf = true; else base.logKg = a;
  if (b === 'inf') base.oInf = true; else base.oLogKg = b;
  const tag = `${a}/${b} R(${H},${rho}) O(${oH},${orho}) ${an}/${oan} ${mode} gh${gh} ${base.surface}`;
  add('arm ' + tag, Object.assign({ duoAction: 'arm' }, base));
  for (const mv of ['push', 'shove', 'lift', 'throw']) add('wrestle ' + mv + ' ' + ['rex', 'ollie', 'both'][i % 3] + ' ' + tag, Object.assign({ duoAction: 'wrestle', wrestleMove: mv, wrestleWho: mv === 'push' ? 'rex' : ['rex', 'ollie', 'both'][i % 3] }, base));
  if (i % 3 === 0) add('catch ' + tag, Object.assign({ duoAction: 'catch', cObj: ['baseball', 'car', 'partner', 'bus'][i % 4], cLogD: [1, 2.5, 4, 6][i % 4], cStyle: i % 2 ? 'easy' : 'hard', cMiss: true }, base));
  add('collide push ' + tag, Object.assign({ duoAction: 'collide', colMode: 'push', colWho: i % 2 ? 'rex' : 'ollie', colImm: i % 4 === 0 }, base));
  add('collide charge ' + tag, Object.assign({ duoAction: 'collide', colMode: 'charge', colWho: i % 2 ? 'rex' : 'ollie', colSrc: ['sprint', 'jump', 'stomp', 'set'][i % 4], colGB: [-8.48, -3, 0, 4][(i >> 2) % 4], colInf: i % 5 === 0, colImm: i % 7 === 0, colBounce: i % 2 ? 'bounce' : 'splat' }, base));
}
fs.writeFileSync(process.argv[2], JSON.stringify(cases));
console.log(cases.length);
