global.window = {};
const P = require('./engine_mired.js');
require('./head/data.js');
const D = window.DINO_DATA;
for (const b of ['rex', 'ollie']) for (const sid of ['softclay', 'stiffclay']) for (const pace of ['stroll', 'walk', 'brisk', 'fast']) for (const e of [0, 0.5, 1]) for (const m of [3007]) {
  const body = P.makeBody({ build: b, H: 3.048, m });
  globalThis.__clay = null;
  const pr = P.presence(body, D.surfaces.find((s) => s.id === sid), { pace, effort: e, groundHolds: false });
  const fp = pr.step.footprint;
  if (fp.kind === 'mired') console.log(b, sid, pace, e, 'mired; computed depth', globalThis.__clay ? globalThis.__clay.depth.toFixed(2) : 'n/a (inf branch)');
}
// mass scan for ollie on softclay
for (let m = 1500; m <= 3007; m += 100) {
  const body = P.makeBody({ build: 'ollie', H: 3.048, m });
  globalThis.__clay = null;
  const pr = P.presence(body, D.surfaces.find((s) => s.id === 'softclay'), { pace: 'walk', effort: 0, groundHolds: false });
  console.log('m', m, pr.step.footprint.kind, globalThis.__clay ? globalThis.__clay.depth.toFixed(3) : '-');
}
