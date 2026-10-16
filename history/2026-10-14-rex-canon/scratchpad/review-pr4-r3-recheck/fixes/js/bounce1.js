const { P, D, g, R3, O3, surf, mk } = require('./eng.js')(process.argv[2]);
const f = (x) => (x == null ? '-' : typeof x === 'number' ? Number(x.toPrecision(5)) : x);
const at = (kg, extra) => P.collide(mk(Object.assign({ F: kg * g, body: O3 }, extra || {})), mk(Object.assign({ F: kg * g }, extra || {})), { source: 'sprint', bounce: true });
for (const kg of [2600, 3000, 3190, 3278, 3310, 4000, 90718.474, 1e6, 1e9]) {
  const r = at(kg); const b = r.after && r.after.bounce;
  console.log(kg, 'v', f(r.vRel), 'v0', f(r.v0), 'vB', f(b && b.vB), 'T', f(r.contact && r.contact.softEl.t), 's', f(r.contact && r.contact.s), 'during', f(b && b.during), 'pi s', f(Math.PI * (r.contact && r.contact.s)), 'slideB', f(b && b.slideB), 'moved', f(b && b.moved), 'carry', !!r.carry, 'outcome', r.outcome);
}
// 5 m point
let lo = 2571, hi = 90718; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; const b = at(m).after.bounce; if (b.moved > 5) hi = m; else lo = m; }
console.log('bounce moved=5 m at', f(lo), 'kg-force');
lo = 2571, hi = 90718; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; const b = at(m).after.bounce; if (b.slideB > 5) hi = m; else lo = m; }
console.log('bounce slideB=5 m at', f(lo), 'kg-force');
// set speeds: bounce during at several speeds (set speed source)
for (const v of [1, 18, 100, 1000, 3e5, 2.9e6, 3.1e6, 3e7]) {
  const r = P.collide(mk({ body: O3 }), mk(), { source: 'speed', speed: v, bounce: true });
  const b = r.after && r.after.bounce;
  console.log('speed', v, 'vRel', f(r.vRel), 'T', f(r.contact && r.contact.softEl && r.contact.softEl.t), 'during', f(b && b.during), 'pi s', f(Math.PI * (r.contact && r.contact.s)), 'slideB', f(b && b.slideB), 'moved', f(b && b.moved), 'vB', f(b && b.vB));
}
