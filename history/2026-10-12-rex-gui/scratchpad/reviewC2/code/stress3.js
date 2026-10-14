global.window = {};
const R0='/home/user/rex-strength-lab/rex-strength-lab/';
require(R0+'src/data.js');
const D = window.DINO_DATA;
const L = require(R0+'src/ladder.js');
const R = D.energyRefs.slice();
for (const J of [-1, -1e40, 0, -0, NaN, Infinity, -Infinity, Number.MAX_VALUE, Number.MIN_VALUE, 5e-324, 1e-310, '1e20', null, undefined]) {
  let c; try { c = L.compare(J, R); } catch (e) { c = {err: e.message}; }
  console.log(String(J), '=>', JSON.stringify({kind:c.kind, x:c.x, text:c.text, err:c.err}));
}
// string input
try { console.log('string', L.compare('1e20', R).text); } catch(e) { console.log('string err', e.message); }
// empty refs
try { console.log('empty', L.compare(5, []).text); } catch(e) { console.log('empty refs err', e.message); }
// one rung
console.log('one rung', L.compare(5, [{id:'a', short:'A', J:5}]).text, '|', L.compare(50, [{id:'a', short:'A', J:5}]).text);
// duplicates
const dup = [{id:'a', short:'A', J:10}, {id:'b', short:'B', J:10}, {id:'c', short:'C', J:1000}];
console.log('dup', L.compare(10, dup).text, '|', L.compare(30, dup).text);
// unsorted
const uns = [{id:'c', short:'C', J:1000}, {id:'a', short:'A', J:10}, {id:'b', short:'B', J:100}];
console.log('unsorted', L.compare(30, uns).text, '|', L.compare(300, uns).text, '|', L.compare(5, uns).text, '|', L.compare(5000, uns).text);
// tie: exact geometric midpoint between 10 and 1000 = 100 ... use 10 and 40, mid=20
const tie = [{id:'a', short:'A', J:10}, {id:'b', short:'B', J:40}];
console.log('tie', L.compare(20, tie).text, '|', L.compare(Math.sqrt(10*40), tie).text);
// num edge cases
for (const [x,n] of [[9.95,2],[9.949,2],[99.5,2],[0.0995,2],[9.5,1],[0.95,1],[1,1],[1,2],[100,2],[10,2],[1.05,2],[1.15,2],[0.1,2],[12.5,2],[0.125,2],[1e-5,2],[0,2],[-3,2],[NaN,2],[2.5,1],[3.5,1],[0.35,1],[95,1],[96,1]]) console.log('num', x, n, '=>', L.num(x,n));
// gaps on unsorted/dup
console.log('gaps', JSON.stringify(L.gaps([{J:1},{J:1000},{J:1}]).map(g=>g.ratio)));
