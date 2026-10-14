global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab/';
require(R + 'src/data.js');
const D = window.DINO_DATA;
const L = require(R + 'src/ladder.js');
const refs = D.energyRefs.slice().sort((a,b)=>a.J-b.J);
const bad = [];
const sf = (s) => { s = s.replace(/,/g,''); if (s.includes('.')) return s.replace('.','').replace(/^0+/,'').length; return s.replace(/^0+/,'').replace(/0+$/,'').length; };
const check = (J, why) => {
  const c = L.compare(J, refs);
  const t = c.text;
  let m;
  const problems = [];
  if (/NaN|undefined|Infinity|e[+-]\d|≈/.test(t)) problems.push('bad token');
  if ((m = t.match(/^(roughly )?([\d.,]+)× /))) {
    const v = Number(m[2]);
    if (v > 10) problems.push('multiple >10');
    if (v <= 1 ) problems.push('multiple <=1');
    if (/^1$/.test(m[2])) problems.push('prints 1×');
    if (sf(m[2]) > (m[1]?1:2)) problems.push('too many digits');
    if (/\.\d*0$/.test(m[2])) problems.push('trailing zero');
  } else if ((m = t.match(/^(roughly )?([\d.,]+)% of /))) {
    const v = Number(m[2]);
    if (v < 10) problems.push('share <10%');
    if (v >= 100) problems.push('share >=100%');
    if (sf(m[2]) > (m[1]?1:2)) problems.push('too many digits');
  } else if (!/^(about|roughly) the same as |^beyond the ladder: |^more than any finite|^no energy/.test(t)) problems.push('unknown form');
  // check kind consistency
  if (c.kind === 'times' && c.x < 1) problems.push('times with x<1');
  if (c.kind === 'share' && c.x >= 1) problems.push('share with x>=1');
  if (problems.length) bad.push(why + ' J=' + J.toExponential(6) + ': ' + t + '  [' + problems.join(',') + '] x=' + c.x);
  return c;
};
const factors = [1, 10, 0.1, 1.15, 1/1.15, 1.5, 1/1.5, 1.149999, 1.150001, 1/1.149999, 1/1.150001, 1.4999, 1.5001, 9.9999, 10.0001, 9.95, 9.949, 0.0995, 0.09951, 0.0999, 0.10001, 2, 0.5, 3, 0.3, 0.995, 1.0049, 0.9949, 9.5, 9.49, 0.095, 0.0949, 0.15, 0.149];
for (const r of refs) for (const f of factors) check(r.J * f, r.id + '*' + f);
// midpoints
for (let i=1;i<refs.length;i++){ const mid=Math.sqrt(refs[i].J*refs[i-1].J); for (const f of [1, 1+1e-12, 1-1e-12, 1.0001, 0.9999]) check(mid*f, 'mid '+refs[i-1].id+'/'+refs[i].id+'*'+f); }
// dense sweep
for (let e = -2; e <= 49; e += 0.0005) check(Math.pow(10,e), 'sweep');
console.log('bad count', bad.length);
const byType = {};
for (const b of bad) { const k = b.match(/\[(.*)\]/)[1]; (byType[k] = byType[k] || []).push(b); }
for (const [k, v] of Object.entries(byType)) { console.log('==', k, v.length); for (const x of v.slice(0, 8)) console.log('  ', x); }
