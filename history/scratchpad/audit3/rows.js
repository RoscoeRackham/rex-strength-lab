global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const all = JSON.stringify(D.sourceRows) + JSON.stringify(D.assumptions);
for (const pat of ['0.8 m', 'frontal', 'Cd', 'drag coefficient', '0.3%', 'whip', '2.5', 'stance', 'digArea', '0.2 m', 'release', '0.9', 'Poncelet', 'vmax', '84.6', '1.4', '140%']) console.log(pat, all.includes(pat));
console.log(D.sourceRows.length);
for (const r of D.sourceRows) if (/Strength|Deadlift|Log press|Muscle|Hill|Poncelet|Ground resisting|punch|Punch|fist|Air heating|Quake|Blast/i.test(r.label)) console.log('-', r.label, '|', r.value, '|', r.status, '|', r.note || '', '|', r.sources.map(s=>s.title).join(' ; '));
