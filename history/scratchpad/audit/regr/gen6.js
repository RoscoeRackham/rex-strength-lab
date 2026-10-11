const fs = require('fs');
const cases = [];
const acts = ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull'];
for (const a of acts) {
  cases.push([a + ' default', { action: a }]);
  for (const lg of [1, 2.7, 3.5, 6, 9, 14, 22, 34]) cases.push([a + ' lg' + lg, { action: a, logKg: lg }]);
  cases.push([a + ' inf', { action: a, inf: true }]);
  cases.push([a + ' real', { action: a, mode: 'real' }]);
  cases.push([a + ' bolted gh', { action: a, anchor: 'bolted', groundHolds: true }]);
  cases.push([a + ' sand braced', { action: a, surface: 'sand', anchor: 'braced' }]);
  cases.push([a + ' H0.1', { action: a, H: 0.1, m: 0.0225 }]);
  cases.push([a + ' H500', { action: a, H: 500, m: 2.8125e9 }]);
  cases.push([a + ' H20 lg12', { action: a, H: 20, m: 180000, logKg: 12 }]);
  for (const o of ['baseball', 'shot', 'pyramid', 'tank', 'moon']) if (a === 'lift' || a === 'throw' || a === 'pull') cases.push([a + ' obj ' + o, { action: a, obj: o }]);
  if (a === 'throw') for (const ang of [0, 10, 89, 90]) cases.push([a + ' angle ' + ang, { action: a, angle: ang, obj: 'pyramid', logKg: 19 }]);
}
fs.writeFileSync(process.argv[2], JSON.stringify(cases));
console.log(cases.length);
