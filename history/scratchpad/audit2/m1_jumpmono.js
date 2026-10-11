const { P, D, ctx } = require('./common.js');
for (const mode of ['comic', 'real']) for (const H of [0.4, 2, 50]) for (const s of D.surfaces) {
  let prev = 0, prevLg = 0, drops = [];
  for (let lg = 1; lg <= 34; lg += 0.05) {
    const r = P.jump(ctx({ kg: Math.pow(10, lg), mode, surface: s.id, H }));
    const v = r.v;
    if (v < prev * 0.995) drops.push(`${prevLg.toFixed(2)}->${lg.toFixed(2)}: ${prev.toPrecision(4)}->${v.toPrecision(4)}`);
    prev = Math.max(prev, v); prevLg = lg;
  }
  if (drops.length) console.log(mode, 'H=' + H, s.id, drops.length, 'drops; first:', drops.slice(0, 3).join(' | '));
}
