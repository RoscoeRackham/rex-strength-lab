global.window = {};
const P = require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewA4/verify-copy/branch/rex-strength-lab/src/engine.js');
require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewA4/verify-copy/branch/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const soft = D.surfaces.find(s => s.id === 'softclay');
console.log('softclay shear', soft.shear, 'qult', soft.qult);
const rex = P.makeBody({ H: 3.048, m: 3007, build: 'rex' });
const p = 140e3;
for (const su of [20e3, 10e3]) {
  const s = Object.assign({}, soft, { shear: su });
  console.log('su', su, 'footprint', JSON.stringify(P.footprint(rex, s, p, false)), 'standDepth', JSON.stringify(P.standDepth(s, p, rex.footB, rex.H)));
}
