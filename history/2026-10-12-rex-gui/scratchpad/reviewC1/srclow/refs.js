global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA;
const L = require(process.argv[2] + '/src/ladder.js');
const ids = ['apple','airrifle','pitch','rifle','bolt','sugar','carcrash','grenade','food','truck','homeday','foodmonth','lightning','train','tnt','a380','moab','hubble'];
for (const e of D.energyRefs) if (ids.includes(e.id)) console.log(e.id, e.J, e.rough, '|', e.short);
// examples of phrasing
for (const J of [0.9, 1.0, 3, 16, 50, 162, 500, 1700, 7300, 68000, 5e5, 9e5, 8e6, 1.4e7, 1e8, 2.5e8, 5e8, 1e9, 1.8e9, 4e9, 1.8e10, 4.6e10, 1e11]) {
  const r = L.compare(J, D.energyRefs); console.log(J.toExponential(2), r.kind, r.ref && r.ref.id, '|', r.text);
}
