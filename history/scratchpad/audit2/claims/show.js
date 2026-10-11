const fs = require('fs');
const [file, filt] = [process.argv[2], JSON.parse(process.argv[3] || '{}')];
const { rows } = JSON.parse(fs.readFileSync(file));
const strKey = (c) => c.chip || ('1e' + c.log);
for (const r of rows) {
  const c = r.cfg;
  if (!Object.entries(filt).every(([k, v]) => c[k] === v)) continue;
  console.log('\n## ' + strKey(c) + ' ' + c.mode + ' ' + c.surface + (c.groundHolds ? '+comic' : '') + ' ' + c.anchor + ' ' + c.size + 'm  ' + c.tab + (c.obj ? ' ' + c.obj : '') + (c.angle != null ? ' @' + c.angle : ''));
  console.log('V: ' + r.verdict);
  console.log('C: ' + r.chips.join(' || '));
  console.log('T: ' + r.tiles.map((t) => t[0] + '=' + t[1] + (t[2] ? ' (' + t[2] + ')' : '')).join(' || '));
  for (const h of r.happens) console.log('  - ' + h);
  for (const h of r.callouts) console.log('  > ' + h);
  for (const h of r.muted) console.log('  m ' + h);
  if (process.env.SVG) for (const h of r.svg) if (h) console.log('  svg ' + h);
  if (process.env.MATH) for (const h of r.math) console.log('  math ' + h.replace(/\n/g, ' / '));
}
