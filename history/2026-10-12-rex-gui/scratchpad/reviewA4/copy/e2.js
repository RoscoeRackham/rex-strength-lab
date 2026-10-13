global.window = {};
const R = __dirname + '/repo/rex-strength-lab/src/';
const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA;
const soft = D.surfaces.find(s => s.id === 'softclay');
const rex = P.makeBody({});
for (const [lbl, su] of [['soft clay su as published (20 kPa)', soft.shear], ['su halved (10 kPa)', soft.shear / 2]]) {
  const s2 = Object.assign({}, soft, { shear: su });
  const out = [140e3, 160e3, 200e3].map(p => p / 1e3 + ' kPa -> ' + JSON.stringify(P.footprint(rex, s2, p, false)));
  console.log(lbl + '\n  ' + out.join('\n  '));
  // the Walk tab's model: presence()
  const pr = P.presence(rex, s2, {});
  console.log('  presence step footprint:', JSON.stringify(pr.step && pr.step.footprint));
}
