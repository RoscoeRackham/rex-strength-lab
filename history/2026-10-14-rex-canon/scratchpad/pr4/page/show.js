const r = require(require('path').resolve(process.argv[2]));
const only = process.argv[3] ? process.argv[3].split(',') : null;
for (const [k, v] of Object.entries(r)) {
  if (only && !only.includes(k)) continue;
  console.log('=== ' + k, v.error || '', (v.errs || []).join('|'));
  if (!v.verdict && !v.all) continue;
  console.log('V: ' + v.verdict);
  console.log('S: ' + v.status.join(' / '));
  console.log('E: ' + v.effort.join(' / '));
  console.log('T: ' + v.tiles.join(' / '));
  for (const h of v.happens) console.log('H: ' + h);
  if (v.callouts.length) console.log('C: ' + v.callouts.join(' / '));
  if (process.env.MATH) console.log('M: ' + v.math.join(' / '));
}
