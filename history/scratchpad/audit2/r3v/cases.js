global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require(process.argv[2]);
const g = 9.80665;
const obj = (id) => D.objects.find((o) => o.id === id);
const mk = (H, surf, anchor, lk, gh) => ({ F: lk === 'inf' ? Infinity : Math.pow(10, lk) * g, mode: 'real', body: P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) }), surface: D.surfaces.find((s) => s.id === surf), groundHolds: !!gh, anchor });
const out = [];
out.push('punch steel braced 1e16: ' + P.punch(mk(2, 'steel', 'braced', 16)).vFist.toFixed(3));
out.push('punch steel braced inf: ' + P.punch(mk(2, 'steel', 'braced', 'inf')).vFist.toFixed(3));
for (const lk of [Math.log10(1.81436948e+23), Math.log10(5.9724e24), 'inf']) out.push('punch granite braced ' + lk + ': ' + P.punch(mk(2, 'granite', 'braced', lk)).vFist.toFixed(3));
for (const a of [45, 0]) { const t = P.throwObject(mk(2, 'steel', 'braced', 16), obj('baseball'), a); out.push('ball steel braced 1e16 ang' + a + ': v=' + t.v.toFixed(2) + ' range=' + t.flight.range.toFixed(1)); }
for (const lk of [16, 17, 20]) { const j = P.jump(mk(2, 'granite', 'friction', lk)); out.push('jump granite ' + lk + ': v=' + j.v.toFixed(3) + ' apex=' + j.flight.apex.toFixed(2) + ' heldBack=' + j.heldBack + ' sink=' + j.sink.toExponential(2) + ' Eground=' + j.Eground.toExponential(2)); }
for (const lk of [16, 20]) { const j = P.jump(mk(0.4, 'granite', 'friction', lk)); out.push('jump plush granite ' + lk + ': v=' + j.v.toFixed(3) + ' apex=' + j.flight.apex.toFixed(2)); }
out.push('punch plush steel braced 1e16: ' + P.punch(mk(0.4, 'steel', 'braced', 16)).vFist.toFixed(3) + ' cap 3.4');
console.log(out.join('\n'));
