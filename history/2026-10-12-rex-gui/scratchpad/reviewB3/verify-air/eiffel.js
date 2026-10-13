const { P, D, g, obj, rex, ollie, ctxOf, sig } = require('./common.js');
const M = P.RESTRAINT.MOVES;
const ids = D.objects.map(x => x.id); 
const id = ids.find(x => /eiffel/.test(x)); console.log('id', id);
for (const lk of [18.7602, 18.8, 19, 19.2, 19.5, 20]) {
  const ex = { airAbsorb: 0, keepForm: true, unbreakable: true, ownRecoil: true };
  const cx = ctxOf(Math.pow(10, lk) * g, ex);
  const r = P.throwObject(cx, obj(id), 0);
  const fa = r.flight.relativistic ? P.fastAir(obj(id), r.Eobj, 0, 1) : null;
  console.log('logKg', lk, 'v/c', sig(r.v / P.K.c), 'rel', r.flight.relativistic, 'vOut m/s', fa ? sig(fa.vOut) : '-', 'x', fa ? sig(fa.x) : '-');
}
// galaxy thresholds
const es = D.escape, vSun = 240e3;
const worstPage = es.galaxyHi + vSun;
const worstOwn = Math.hypot(Math.hypot(es.galaxyHi + vSun, es.sun) + es.sun * Math.SQRT1_2, es.earth);
const lowPage = es.galaxyLo - vSun;
const lowOwn = Math.hypot(Math.hypot(es.galaxyLo - vSun, es.sun) - es.sun * Math.SQRT1_2, es.earth);
const uSun = Math.hypot(es.sun * (1 + Math.SQRT1_2), es.earth);
console.log('uSun', sig(uSun), 'worst page', worstPage, 'worst own-method', sig(worstOwn), 'low page', lowPage, 'low own-method', sig(lowOwn));
// with the ecliptic tilted ~60 deg to the galactic plane: Earth's orbital component along the Sun's galactic motion <= 29.8 cos(60)
const vE = es.sun * Math.SQRT1_2;
console.log('Earth orbital', sig(vE), 'worst w/ 60deg geometry', sig(Math.hypot(Math.hypot(es.galaxyHi + vSun, es.sun) + vE * 0.5, es.earth)));
// heliocentric speed at infinity for u=844 km/s, worst direction, page's own method
const u = 844e3; const vh = Math.sqrt(Math.max(0, (Math.sqrt(u * u - es.earth ** 2) - vE) ** 2 - es.sun ** 2));
console.log('u=844: v_inf from Sun, Earth motion fully against', sig(vh), 'vs needed', worstPage);
