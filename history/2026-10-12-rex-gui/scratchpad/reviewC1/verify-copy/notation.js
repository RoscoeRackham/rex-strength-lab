// counts notation styles in sources rows (D.sources) for a data.js
const f = process.argv[2]; global.window = {}; require(f); const D = window.DINO_DATA;
const keys = Object.keys(D); 
const src = D.sources || D.sourceRows || D.srcRows;
if (!src) { console.log('keys', keys.join(',')); process.exit(); }
const rows = src.map((s) => ({ label: s.label || s.what || s[0], value: s.value || s[1] }));
const energy = rows.filter((r) => /^Energy: /.test(r.label)), other = rows.filter((r) => !/^Energy: /.test(r.label));
const cnt = (rs, re) => rs.filter((r) => re.test(String(r.value))).length;
for (const [n, rs] of [['energy', energy], ['other', other]]) console.log(n, rs.length, 'caret', cnt(rs, /\^/), 'ascii x', cnt(rs, /\d x \d|\d x \(/), 'superscript', cnt(rs, /[⁰¹²³⁴⁵⁶⁷⁸⁹]/), '+/-', cnt(rs, /\+\/-/), '~', cnt(rs, /~/), 'erg', cnt(rs, /\berg\b/));
if (process.argv[3]) for (const r of energy.filter((r) => new RegExp(process.argv[3]).test(String(r.value)+r.label))) console.log(' -', r.label, '|', r.value);
