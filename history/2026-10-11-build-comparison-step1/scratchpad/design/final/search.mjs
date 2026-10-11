import { validate } from '/tmp/claude-0/bundled-skills/2.1.296/8b146ad8b18a40e632c2c852723486f6/dataviz/scripts/validate_palette.js';
const mode = process.argv[2] || 'light';
const surface = mode === 'light' ? '#DADCE4' : '#262833';
const L = {
 every: ['#6F7C99','#7D8599','#8A92A8','#5F6B86'],
 nat: ['#CFA23A','#D9A520','#C08A1E','#3B8C7A','#2F7F86','#7C8A3A'],
 bb: ['#B9592A','#C0612E','#A9532A','#C86B3C'],
 strong: ['#5A3624','#6B4A2E','#7A5A3A','#6B6A3A','#3A3530','#2E6B66','#4F6B3A','#47705F'],
 comic: ['#34489A','#2F3F86','#3A55B0','#4A4FA8'],
 duo: ['#8E2440','#7A2434','#A0304E','#7A3E9A','#6E3F8F','#A83A6E','#8A2F6E'],
};
const D = {
 every: ['#9AB4D0','#A3A6BC','#8FA0BC','#B0B8CC'],
 nat: ['#E3B842','#D9A520','#E8C25A','#5FB3A0','#4FA8B0'],
 bb: ['#C46A3B','#D9763F','#CC5F36','#E08A58'],
 strong: ['#9A5E46','#7A4536','#8A6A48','#A0805A','#8B5A3C','#6E4A34','#7E5A44','#94704C'],
 comic: ['#6F8AD8','#5A78D0','#7F95E0','#4C6BD0','#6680E0','#5470C8'],
 duo: ['#C9566A','#C0608A','#B5658F','#C46A9A','#A86AA8','#B85C8C','#C25A80','#A0507A'],
};
const S = mode === 'light' ? L : D;
const num = (s, re) => { const m = s.match(re); return m ? parseFloat(m[1]) : NaN; };
let best = [];
for (const e of S.every) for (const n of S.nat) for (const b of S.bb) for (const st of S.strong) for (const c of S.comic) for (const d of S.duo) {
  const p = [e, n, b, st, c, d];
  const r = validate(p, { mode, surface, pairs: 'all' });
  const cvd = r.report.find(x => x[0] === 'CVD separation');
  const nv = r.report.find(x => x[0] === 'Normal-vision floor');
  const cv = num(cvd[2], /ΔE ([\d.]+)/), nn = num(nv[2], /ΔE ([\d.]+)/);
  if (nn < 15) continue;
  best.push({ p: p.join(','), cv, nn, lb: r.report[0][1], txt: cvd[2] });
}
best.sort((a, b) => b.cv - a.cv);
console.log(best.slice(0, 15).map(x => x.cv.toFixed(1) + ' ' + x.nn.toFixed(1) + ' ' + x.lb + ' ' + x.p + ' | ' + x.txt).join('\n'));
