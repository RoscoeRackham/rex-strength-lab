global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA;
const re = /\^|\d x \d|\+\/-|~|≈|\berg\b|\bkpc\b|Bethe|\d(?:\.\d+)?e\d|existing fact|\bfact [a-z_]+|[a-z]+_[a-z_]+|HNe|d15/;
let n = 0, rows = new Set();
for (const r of D.sourceRows.filter((x) => /^Energy:/.test(x.label))) for (const s of r.sources) if (re.test(s.title)) { n++; rows.add(r.label); console.log(r.label.slice(0, 60), ' :: ', s.title); }
console.log(n, 'titles in', rows.size, 'Energy rows');
