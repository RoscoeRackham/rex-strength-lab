global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA;
const keys = Object.keys(D); console.log(keys.join(','));
const rows = D.sources || D.rows || D.sourceRows;
const want = ['apple','air-rifle','pitch','5.56','Bolt','sugar','Corolla at 100','grenade','day’s food','day\'s food','semi-truck','home','month','lightning','High-speed','TNT','A380','MOAB'];
for (const r of rows) if (/^Energy:/.test(r.label) && want.some(w => r.label.toLowerCase().includes(w.toLowerCase()))) {
  console.log('---', r.label, '|', r.status, '\n   ', r.value, '\n   ', r.sources.map(s => s.url).join('\n    '));
}
