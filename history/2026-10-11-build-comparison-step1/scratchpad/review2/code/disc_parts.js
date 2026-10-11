const T = process.argv[2];
const { measureTemplate } = require(T + '/build-comparison/tools/export_targets.js');
const png = require(T + '/build-comparison/tools/png.js');
for (const f of [1.7408, 1.75]) {
  const m = measureTemplate('ansur2_m_p50', 1.8, f, 1000), r = m.res, p = r.volume_m3.parts;
  const arms = r.landmarks.arms.map((a) => a ? { armpit: a.armpit, end: a.end, angle: +a.angleDeg.toFixed(1) } : null);
  console.log('f=' + f, 'parts m3: head ' + p.head.toFixed(4) + ' torso ' + p.torso.toFixed(4) + ' legs ' + p.legs.toFixed(4) + ' arms ' + p.arms.toFixed(4), '| armpit row ' + r.landmarks.front.armpit + ' neck ' + r.landmarks.front.neck + ' crotch ' + r.landmarks.front.crotch, '| arms', JSON.stringify(arms), '| warnings:', r.warnings.filter((w) => /Front view/.test(w)).join(' '));
  png.write(process.argv[3] + '/disc-' + f + '.png', m.img);
}
