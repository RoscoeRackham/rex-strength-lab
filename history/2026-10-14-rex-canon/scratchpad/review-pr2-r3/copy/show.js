const fs = require('fs');
const [, , file, ...ids] = process.argv;
const B = JSON.parse(fs.readFileSync(file));
for (const id of (ids.length ? ids : Object.keys(B))) { const r = B[id]; if (!r) { console.log('MISSING', id); continue; } console.log('########', id); console.log('V:', r.verdict.join(' / ')); console.log('S:', r.status.join(' / ')); console.log('T:', r.tiles.join(' | ')); console.log('E:', r.effort.join(' / ')); r.happens.forEach((h) => console.log('  *', h)); r.math.forEach((m) => console.log('  m:', m)); if (r.dropped.length) console.log('DROPPED', r.dropped); if (r.errs.length) console.log('ERRS', r.errs); }
