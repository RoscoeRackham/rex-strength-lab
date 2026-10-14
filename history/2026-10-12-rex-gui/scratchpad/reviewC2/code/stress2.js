global.window = {};
const R0='/home/user/rex-strength-lab/rex-strength-lab/';
require(R0+'src/data.js');
const D = window.DINO_DATA;
const L = require(R0+'src/ladder.js');
const R = D.energyRefs.slice().sort((a,b)=>a.J-b.J);
const bad = [];
function check(J, tag) {
  const c = L.compare(J, R);
  const t = c.text;
  const m = t.match(/^(roughly )?([\d.]+)(×|% of) /);
  let problem = null;
  if (/NaN|undefined|Infinity|e[+-]\d/.test(t)) problem = 'bad token';
  if (m) {
    const v = Number(m[2]);
    if (m[3] === '×') { if (v > 10) problem = 'multiple>10'; if (v === 1 || m[2]==='1') problem = 'multiple 1×'; if (/^10\.0$/.test(m[2])) problem='10.0'; }
    else { if (v < 10) problem = 'share<10'; if (v >= 100) problem = 'share>=100'; if (v===0) problem='0%'; }
    const sig = m[2].replace('.', '').replace(/^0+/, '').replace(/0+$/, '');
    const lim = c.ref.rough ? 1 : 2;
    if (sig.length > lim) problem = 'too many figures';
    // printed number agrees with x?
    const real = m[3] === '×' ? c.x : 100*c.x;
    if (Math.abs(v/real - 1) > (c.ref.rough ? 0.5 : 0.05)) problem = 'printed '+v+' vs real '+real;
  }
  if (problem) bad.push([tag, J.toExponential(4), problem, t]);
  return c;
}
const fs = [10, 0.1, 1.15, 1/1.15, 1.5, 1/1.5, 9.99, 9.95, 9.94, 10.01, 0.0999, 0.1001, 0.0995, 0.0994, 0.995, 1.149999, 1.15000001, 1.4999, 1.5001, 0.9999, 1.0001, 0.105, 0.0951, 9.5, 9.49, 0.95, 0.949];
for (let i=0;i<R.length;i++) {
  for (const f of fs) check(R[i].J*f, R[i].id+'*'+f);
  if (i>0) { const mid = Math.sqrt(R[i].J*R[i-1].J); for (const f of [1, 1+1e-12, 1-1e-12, 1.0000001, 0.9999999]) { check(mid*f, 'mid '+R[i-1].id+'/'+R[i].id+'*'+f); } }
}
// dense sweep
const lo=Math.log10(R[0].J)-1, hi=Math.log10(R[R.length-1].J)+1;
for (let e=lo; e<=hi; e+=0.0005) check(Math.pow(10,e), 'sweep');
const seen = new Map(); for (const b of bad) { const k=b[2].split(' ')[0]; seen.set(k,(seen.get(k)||0)+1); }
console.log('problems by kind', [...seen]);
const shown = new Set(); for (const b of bad) { const k=b[2].split(' ')[0]+b[0].split('*')[0]; if (shown.has(k)) continue; shown.add(k); console.log(b.join(' | ')); }
