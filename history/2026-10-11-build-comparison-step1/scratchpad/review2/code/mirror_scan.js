// Sheets whose back view is the exact mirror of the front: how often does "front and back landmarks line up" fail?
const T = process.argv[2];
const { measureTemplate } = require(T + '/build-comparison/tools/export_targets.js');
const ids = ['ansur2_m_p50', 'ansur2_m_p5', 'ansur2_m_p95', 'steve_reeves_1947', 'ronnie_coleman', 'ansur2_m_largest_arm'];
let n = 0, bad = 0;
for (const id of ids) {
  const row = [];
  for (const f of [0.8, 0.9, 1, 1.1, 1.2]) for (const px of [600, 800, 1000]) {
    const r = measureTemplate(id, 1.8, f, px).res; n++;
    const c = r.checks.find((c) => /front and back/.test(c.name));
    if (!c.ok) { bad++; row.push('f' + f + '@' + px + ' ' + c.detail); }
  }
  console.log(id.padEnd(22), row.length + ' of 15 fail', row.slice(0, 3).join(' | '));
}
console.log('total', bad, 'of', n, 'mirror-image sheets rejected');
