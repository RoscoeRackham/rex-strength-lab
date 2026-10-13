global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA; const L = require(process.argv[2] + '/src/ladder.js');
const SUPD = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
const parseJ = (t) => { t = (t||'').replace(/ /g, ' ').trim();
  let m = t.match(/^([\d.,]+)? ?(?:× )?10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+) J$/);
  if (m) return (m[1] ? Number(m[1].replace(/,/g, '')) : 1) * Math.pow(10, (m[2][0] === '⁻' ? -1 : 1) * Number(m[2].replace('⁻', '').split('').map((c) => SUPD[c]).join('')));
  m = t.match(/^([\d.,]+) ([kMGTPE]?)J$/); return m ? Number(m[1].replace(/,/g, '')) * ({ '': 1, k: 1e3, M: 1e6, G: 1e9, T: 1e12, P: 1e15, E: 1e18 })[m[2]] : NaN; };
const all = new Map(); let ovf = [];
for (const f of process.argv.slice(3)) {
  const d = JSON.parse(require('fs').readFileSync(f));
  for (const r of d.out) {
    if (r.pageOvf > 0) ovf.push(r.action+r.logKg+r.mode+r.eff+' page '+r.pageOvf);
    for (const t of r.tiles) {
      if (t.ovf > 0 || t.vovf > 0) ovf.push(`${r.action} ${r.logKg} ${r.mode} ${r.eff}: tile ovf ${t.ovf}/${t.vovf}: ${t.v}`);
      const J = parseJ(t.prev); const want = L.compare(J, D.energyRefs).text;
      const key = t.v;
      if (!all.has(key)) all.set(key, []);
      all.get(key).push(`${r.action} ${r.logKg} ${r.mode} ${r.eff} [${t.prevK}=${t.prev}]` + (want !== t.v ? ' MISMATCH want ' + want : ''));
    }
  }
}
console.log('distinct', all.size); console.log('overflow', ovf.length, ovf.slice(0,10));
for (const [k, v] of all) console.log(k, '  <-', v[0], v.length > 1 ? '(+' + (v.length-1) + ')' : '');
