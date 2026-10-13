global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(process.argv[2] || R + '/src/engine.js'); require(R + '/src/data.js'); const D = window.DINO_DATA;
const surf = (id) => D.surfaces.find((s) => s.id === id);
for (const H of [3.048, 50]) for (const sid of ['sand', 'gravel', 'softclay']) for (const e of [0, 0.5, 1]) {
  const b = P.makeBody({ build: 'rex', H, m: 1060 * P.bodyVolume(H, 'rex') });
  const a = P.walkStep(b, surf(sid), { effort: e }).footprint, u = P.walkStep(b, surf(sid), { effort: e, unbreakable: true }).footprint;
  console.log(H, sid, e, 'off', a.kind, (a.depth * 1000).toFixed(1), 'mm | on', u.kind, (u.depth * 1000).toFixed(1), 'mm');
}
