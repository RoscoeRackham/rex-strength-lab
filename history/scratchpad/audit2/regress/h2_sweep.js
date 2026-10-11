const { P, ctx, obj } = require('./common.js');
const rows = [];
for (const [label, o, fn] of [
  ['punch steel braced', { surface: 'steel', anchor: 'braced' }, (c) => { const r = P.punch(c); return 'vFist ' + r.vFist.toFixed(3) + ' recoilV ' + r.recoilV.toFixed(3) + ' R ' + r.anchor.R.toExponential(3); }],
  ['punch granite braced', { surface: 'granite', anchor: 'braced' }, (c) => { const r = P.punch(c); return 'vFist ' + r.vFist.toFixed(3); }],
  ['jump granite friction', { surface: 'granite' }, (c) => { const r = P.jump(c); return 'v ' + r.v.toFixed(3) + ' apex ' + r.flight.apex.toFixed(2) + ' gf ' + r.groundFails + ' vB ' + r.push.vB.toFixed(3) + ' Eg ' + r.Eground.toExponential(2); }],
  ['baseball steel braced', { surface: 'steel', anchor: 'braced' }, (c) => { const r = P.throwObject(c, obj('baseball'), 0); return 'v ' + r.v.toFixed(3) + ' range ' + r.flight.range.toFixed(1); }],
]) {
  console.log('==', label);
  for (const lg of [12, 13, 14, 15, 15.5, 16, 17, 18, 20, 25, 34]) {
    const c = ctx(Object.assign({ kg: Math.pow(10, lg), mode: 'real' }, o));
    console.log('  1e' + lg, fn(c));
  }
  const ci = ctx(Object.assign({ inf: true, mode: 'real' }, o));
  console.log('  inf', fn(ci));
}
