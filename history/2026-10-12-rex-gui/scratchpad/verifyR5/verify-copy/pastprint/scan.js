global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const sid of ['sand','gravel','softclay']) {
  const surface = D.surfaces.find(s => s.id === sid);
  console.log(sid, 'keptPrint', P.keptPrint(surface, body));
  let prev = null;
  for (let L = 3; L <= 14; L += 0.01) {
    const ctx = { F: Math.pow(10, L) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
    const r = P.stomp(ctx);
    const st = `hole=${r.holeDepth.toFixed(4)} realCrater>0=${r.realCrater>0} realHole=${(r.realHole||0).toFixed(3)} vFoot=${r.vFoot.toFixed(0)}`;
    const key = `${r.holeDepth.toFixed(4)}|${r.realCrater>0}`;
    if (key !== prev) { console.log('  L=' + L.toFixed(2), st); prev = key; }
  }
}
