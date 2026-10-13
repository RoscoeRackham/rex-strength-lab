global.window = {};
const root = process.argv[2];
require(root + '/src/data.js');
const P = require(root + '/src/engine.js');
const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surf = D.surfaces.find((x) => x.id === 'concrete');
console.log('exports:', Object.keys(P).slice(0,60).join(' '));
for (const F of [10, 100, 1000, 1e4, 3e4]) {
  const c = { F: F, mode: 'comic', body: rex, surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const out = [];
  for (const name of ['punch', 'clap', 'stomp']) { try { out.push(name + ' ' + P[name](c).E.toExponential(2)); } catch (e) { out.push(name + ' err ' + e.message.slice(0,60)); } }
  console.log('F=' + F + ' N: ' + out.join(', '));
}
