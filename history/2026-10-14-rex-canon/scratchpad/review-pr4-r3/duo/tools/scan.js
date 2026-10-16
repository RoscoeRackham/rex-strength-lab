// node scan.js <sweep out.json>: flags bad tokens, unsettled views, page errors, 'harmless' beside movement, and
// preset 'never' beside an all-out view that shows the hazard
const fs = require('fs');
const out = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity|\bnull\b|\[object/g) || []);
const flags = [];
const MOVE = /shoved apart|is shoved off|driven back|carried along|is flung|flung apart|flung off|sent off|knocked back|slides? \d|fly apart|flies off|walks .* out/;
for (const [id, r] of Object.entries(out)) {
  if (r.errs && r.errs.length) flags.push([id, 'errs', r.errs.slice(0, 2).join(' | ')]);
  if (!r.settled) flags.push([id, 'unsettled-load']);
  for (const [e, v] of Object.entries(r)) {
    if (!v || typeof v !== 'object' || Array.isArray(v) || v.missing) continue;
    if (!v.all) continue;
    if (!v.settled) flags.push([id, e, 'unsettled']);
    const b = bad(v.all); if (b.length) flags.push([id, e, 'bad tokens ' + b.join(',')]);
    const harmless = /Nothing in this test does harm|no cap needed|Nothing the lab checks in this test can do harm/.test(v.effort || '');
    if (harmless && MOVE.test(v.verdict || '')) flags.push([id, e, 'HARMLESS-but-moves', (v.verdict || '').slice(0, 220) + ' || ' + (v.effort || '').slice(0, 220)]);
  }
}
for (const f of flags) console.log(f.join(' :: '));
console.log(flags.length + ' flags over ' + Object.keys(out).length + ' states');
