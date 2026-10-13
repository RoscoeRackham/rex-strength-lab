global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((x) => x.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const mode of ['comic', 'real']) for (const L of [1, 2, 3, 34]) {
  const c = Object.assign({ F: Math.pow(10, L) * g, mode, body: rex, surface: surf('concrete'), anchor: 'friction' }, ON);
  const pu = P.punch(c), cl = P.clap(c), st = P.stomp(c);
  console.log(mode, L, 'punch', pu.E.toExponential(2), 'clap', cl.E.toExponential(2), 'stomp', st.E.toExponential(2));
}
