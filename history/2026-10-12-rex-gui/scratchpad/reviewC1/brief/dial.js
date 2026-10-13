global.window = {};
const repo = __dirname + '/repo/rex-strength-lab';
require(repo + '/src/data.js');
const D = window.DINO_DATA, P = require(repo + '/src/engine.js'), L = require(repo + '/src/ladder.js');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surf = D.surfaces.find((x) => x.id === 'concrete');
for (const mode of ['comic','real']) for (const lk of [0,1,2,3,4,6]) {
  const c = { F: Math.pow(10,lk) * P.K.g, mode, body: rex, surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const out = [];
  for (const [n, f] of [['punch', P.punch], ['clap', P.clap], ['stomp', P.stomp]]) { try { const E = f(c).E; out.push(n + ' ' + E.toExponential(2) + ' -> ' + L.compare(E, D.energyRefs).text); } catch (e) { out.push(n + ' ERR ' + e.message); } }
  console.log(mode, lk, out.join(' || '));
}
