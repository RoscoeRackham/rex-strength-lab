const { P, D, g, surf, obj, ctxOf } = require('./eng.js');
const ob = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
const cR = ctxOf(1e9, { F: 634e3 * g });
const cO = Object.assign({}, cR, { body: ob });
const t = P.throwPartner(cR, cO, 45);
const r = t.r, M = cR.body.m;
const Rs = P.anchorCapacity({ body: cR.body, surface: cR.surface, theta: 0, anchor: 'friction', groundHolds: false }).R;
const k = 0.5 * P.K.rho0 * cR.body.Cd * cR.body.frontArea;
const coast = (u) => M / (2 * k) * Math.log(1 + k * u * u / Rs);
console.log('range', r.flight.range.toFixed(0), 'recoilV', r.recoilV.toFixed(2), 'Rs', Rs.toFixed(0), 'slide (u=recoilV)', coast(r.recoilV).toFixed(2), 'm; slide (u=recoilV cos45)', coast(r.recoilV * Math.SQRT1_2).toFixed(2), 'm');
// compare with the shove: Ollie at 7.55 m/s slides 4.82 m on the page
console.log('check vs shove: coast(7.55) =', coast(7.55).toFixed(2));
