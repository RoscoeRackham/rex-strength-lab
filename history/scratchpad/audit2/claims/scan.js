const fs = require('fs');
const { rows } = JSON.parse(fs.readFileSync('all.json'));
const strKey = (c) => c.chip || ('1e' + c.log);
const key = (c) => [strKey(c), c.mode, c.surface + (c.groundHolds ? '+comic' : ''), c.anchor, c.size + 'm', c.tab, c.obj || '', c.angle != null ? '@' + c.angle : ''].join(' ');
const texts = (r) => [['verdict', r.verdict], ...r.chips.map((x) => ['chip', x]), ...r.tiles.map((t) => ['tile', t.join(' / ')]), ...r.happens.map((x) => ['li', x]), ...r.callouts.map((x) => ['callout', x]), ...r.muted.map((x) => ['muted', x]), ...r.svg.map((x) => ['svg', x]), ...r.math.map((x) => ['math', x])].filter((x) => x[1]);
const pats = {
  NaN: /NaN/, undef: /undefined/, Infinity: /Infinity/, null: /\bnull\b/, negzero: /(^|[^\d])[-−]0(?![\d.])/, negnum: /(^|[\s(=])[-−]\d/,
  tinyDist: /0\.0000000/, onePctC: /(^|[^\d.])1% of light speed/, calcFail: /Calculation failed/, emptyParen: /\(\s*\)/, doubleSpace: /  /, spaceDot: / \./,
  zeroNs: /\b0 ns\b/, inf: /∞/, bolted: /bolted down/, pct100rest: /100% of the energy and his body the rest/, magNeg: /magnitude [-−]/,
};
const hits = {};
for (const r of rows) {
  for (const [where, t] of texts(r)) for (const [p, re] of Object.entries(pats)) if (re.test(t)) {
    (hits[p] = hits[p] || []).push(key(r.cfg) + ' [' + where + '] ' + t.slice(0, 220));
  }
}
for (const [p, list] of Object.entries(hits)) {
  console.log('\n=== ' + p + ': ' + list.length);
  const seen = new Set();
  let n = 0;
  for (const l of list) { const sig = l.replace(/^\S+ /, '').replace(/\d/g, '#').slice(0, 160); if (seen.has(sig)) continue; seen.add(sig); console.log('  ' + l); if (++n > 12) break; }
}
