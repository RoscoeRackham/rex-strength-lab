const run = require('./harness.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const cases = [];
for (const tab of ['throw', 'jump', 'stomp', 'lift', 'pull', 'punch']) for (const sf of ['sand', 'gravel', 'ice', 'concrete']) for (const st of [{ logKg: 6 }, { inf: true }, { logKg: 6, m: 30000 }]) for (const pw of [{}, { airAbsorb: 0.5, ownRecoil: false }])
  cases.push({ id: [tab, sf, JSON.stringify(st), JSON.stringify(pw)].join('|'), tab, state: Object.assign({ surface: sf }, st, pw), pick: tab === 'lift' ? undefined : 'allout' });
run(cases).then((o) => { let bad = 0; for (const [k, v] of Object.entries(o)) { const m = v.bay.match(/.{0,120}(NaN|undefined|\bnull\b|Infinity|\[object).{0,80}/); if (m) { bad++; console.log('BAD', k, m[0]); } } console.log('checked', Object.keys(o).length, 'bad', bad); });
