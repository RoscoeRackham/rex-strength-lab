const {P,D,g,ctx,obj}=require('./h.js');
// plush human car comic: strength needed to throw at 45
const base = { H:0.4, m:1.44, action:'throw' };
for (const mult of [2.6, 2.7, 3, 4, 7.8, 8]) {
  const lg = Math.log10(511*mult);
  const c = ctx(Object.assign({}, base, {logKg: lg}));
  const r = P.throwObject(c, obj('car'), 45);
  const rr = P.throwObject(Object.assign({}, c, {mode:'real'}), obj('car'), 45);
  console.log('x'+mult, 'comic canHold', r.canHold, 'canMove', r.canMove, 'v', r.v && r.v.toFixed(3), 'basis', r.basis, '| real canMove', rr.canMove, rr.v && rr.v.toFixed(3));
}
// 2m: car needs?
for (const mult of [2.6,2.7,3]) {
  const c = ctx({logKg: Math.log10(511*mult)});
  const r = P.throwObject(c, obj('car'), 45);
  console.log('2m x'+mult, r.canHold, r.canMove, r.v, r.basis, 'needed/Fdrive', r.needed/r.Fdrive);
}
