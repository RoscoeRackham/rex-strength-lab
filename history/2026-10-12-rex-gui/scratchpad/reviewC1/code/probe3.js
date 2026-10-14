global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab/';
require(R + 'src/data.js');
const D = window.DINO_DATA;
const L = require(R + 'src/ladder.js');
const refs = D.energyRefs;
for (const J of [-1, 0, -0, NaN, Infinity, -Infinity, Number.MAX_VALUE, Number.MIN_VALUE, 5e-324, 1e-310, 1e-300, '5', null, undefined, 1n === 1n ? 0.5 : 0, 0.99050*1.15, 0.99050/1.15, 0.9905/1.1500001, 0.861, 0.8613, 5.3613e47*1.15, 5.3613e47*1.1500001, 6.2e47, 1e308])
  { let c; try { c = L.compare(J, refs); console.log(String(J).padEnd(24), c.kind.padEnd(8), c.text, 'x=' + c.x); } catch (e) { console.log(String(J), 'THROWS', e.message); } }
// ties: J at geometric mean of two rungs
const s = refs.slice().sort((a,b)=>a.J-b.J);
for (let i=1;i<s.length;i++){ const mid=Math.sqrt(s[i].J*s[i-1].J); const c=L.compare(mid,s); if (i%7==0) console.log('mid', s[i-1].id, s[i].id, c.text); }
// duplicates
const dup = [{id:'a', short:'A', J:10, rough:false},{id:'b', short:'B', J:10, rough:true},{id:'c', short:'C', J:1000}];
console.log('dup', L.compare(10, dup).text, '|', L.compare(12, dup).text, '|', L.compare(100,dup).text);
// unsorted
console.log('unsorted', L.compare(50, [{short:'C',J:1000},{short:'A',J:10}]).text);
// empty
try { console.log(L.compare(5, []).text); } catch (e) { console.log('empty refs THROWS', e.message); }
// single
console.log('single', L.compare(5, [{short:'A',J:10}]).text, '|', L.compare(10, [{short:'A',J:10}]).text);
// gaps on dup/unsorted
console.log('gaps', JSON.stringify(L.gaps([{J:1},{J:1000},{J:10}]).map(g=>g.ratio)));
// num edge
for (const [x,n] of [[9.96,2],[9.95,2],[99.5,2],[0.0999,2],[9.5,1],[0.95,1],[1.5,1],[1.449,1],[10,2],[100,2],[0.105,2],[1e-7,2],[0,2],[-3.3,2]]) { try { console.log('num', x, n, L.num(x,n)); } catch(e) { console.log('num', x, 'THROWS', e.message);} }
