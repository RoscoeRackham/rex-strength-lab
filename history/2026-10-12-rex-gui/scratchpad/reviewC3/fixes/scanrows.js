const load = (p) => { global.window = {}; delete require.cache[require.resolve(p)]; require(p); return window.DINO_DATA; };
const B = load(process.argv[2]), M = load(process.argv[3]);
const PLAIN = /\^|\d x \d|\de\d|\+\/-|~|≈|\berg\b|\bergs\b|\bkpc\b|Bethe|\b[a-z]+_[a-z0-9_]+\b|\bfoe\b|M_o|\bHNe\b|\bd15\b/;
const mainTitles = new Set(M.sourceRows.flatMap((r) => r.sources.map((s) => s.title)));
const mainRowKeys = new Set(M.sourceRows.map((r) => r.label + '|' + r.value));
let n = 0;
for (const r of B.sourceRows) {
  const hits = [];
  if (PLAIN.test(r.label)) hits.push('LABEL: ' + r.label);
  if (PLAIN.test(r.value)) hits.push('VALUE: ' + r.value);
  for (const s of r.sources) if (PLAIN.test(s.title) && !mainTitles.has(s.title)) hits.push('NEW TITLE: ' + s.title);
  if (hits.some((h) => h.startsWith("NEW")) || (hits.length && !mainRowKeys.has(r.label + "|" + r.value))) { n++; console.log('[' + r.status + '] ' + r.label.slice(0, 90) + '\n   ' + hits.map(h=>h.match(PLAIN)[0] + ' :: ' + h.slice(0, 260)).join('\n   ')); }
}
console.log('rows with new raw notation:', n);
