global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const base = (lg, extra) => Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction', record: true }, extra || {});
let found = 0;
for (const o of D.objects.filter(x => !x.noThrow && x.m > 1000)) for (let lg = 12; lg <= 26 && found < 6; lg += 0.25) for (const ang of [5, 10, 20]) for (const anchor of ['bolted']) {
  const r = P.throwObject(base(lg, { anchor }), o, ang);
  if (!r.canMove) continue; const f = r.flight; if (!f || f.relativistic) continue;
  if (f.orbit || (f.escaped && !f.leavesHill) || f.leavesHill || f.timedOut) {
    const pm = f.path ? Math.max(...f.path.map(p => p[1])) : null;
    console.log(o.id, lg, ang, anchor, 'orbit', f.orbit, 'esc', f.escaped, 'hill', !!f.leavesHill, 'timedOut', f.timedOut, 'apex km', (f.apex / 1000).toFixed(0), 'path max km', pm && (pm / 1000).toFixed(0), 'pts', f.path && f.path.length);
    found++;
  }
}
