// node prescan.js <presets sweep.json>: preset readouts against the all-out view of the same state
const fs = require('fs');
const out = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity|\bnull\b|\[object/g) || []);
let n = 0;
const say = (...a) => { n++; console.log(a.join(' :: ')); };
const VERB = { rattle: /doesn’t rattle/, plaster: /doesn’t shake the ground enough that plaster/, windows: /doesn’t (?:could )?shatter windows|doesn’t shatter/, houses: /doesn’t flatten/, block: /doesn’t level/, ground: /doesn’t break the ground|doesn’t tear|doesn’t break the rock/ };
for (const [id, r] of Object.entries(out)) {
  if (r.errs && r.errs.length) say(id, 'errs', r.errs.join(' | ').slice(0, 300));
  const A = r.allout;
  if (!A || !A.all) continue;
  const plasterAt = (A.status.match(/plaster may crack out to ([\d.,]+) (k?m)/) || []);
  const plasterKm = plasterAt.length ? Number(plasterAt[1].replace(/,/g, '')) * (plasterAt[2] === 'km' ? 1000 : 1) : 0;
  for (const e of ['rattle', 'plaster', 'windows', 'ground', 'houses', 'block']) {
    const v = r[e]; if (!v || !v.all) continue;
    if (!v.settled) say(id, e, 'unsettled');
    const b = bad(v.all); if (b.length) say(id, e, 'bad tokens', b.join(','));
    const never = /Even all-out, (?:this test|those) doesn’t|Even all-out, those don’t/.test(v.effort);
    if (e === 'plaster' && never && plasterKm >= 5) say(id, e, 'NEVER but all-out chip says plaster out to ' + plasterKm + ' m', v.effort.slice(0, 200));
    if (/They mean it/.test(v.effort) && !/real: he means it|is real for this preset|He means it/.test(v.all)) say(id, e, 'mean text without a meant result');
    if (!never && /^All-out\./.test(v.effort) && !/Everything they have/.test(v.effort)) say(id, e, 'odd head', v.effort.slice(0, 160));
  }
}
console.log(n + ' flags over ' + Object.keys(out).length + ' states');
