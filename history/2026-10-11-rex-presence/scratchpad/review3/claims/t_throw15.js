const { P, D, g, surf, obj, ctxOf } = require('./eng.js');
const c = ctxOf(1e15);
const r = P.throwObject(Object.assign({}, c, { record: true }), obj('car'), 45);
const M = P.RESTRAINT.MOVES.throw, opt = { obj: obj('car'), angle: 45, near: 5, surface: c.surface, body: c.body };
console.log('launch', (r.v / 1000).toFixed(0), 'km/s; v/c', (r.v / P.K.c).toFixed(4), '; relativistic', r.flight.relativistic, '; landing', r.flight.vImpact.toFixed(1), 'm/s');
console.log('energy in car (Mt TNT)', (r.Eobj / 4.184e15).toFixed(2), '; drag loss (Mt TNT)', (r.dragLoss / 4.184e15).toFixed(2), '; Rex recoil', (r.recoilV / 1000).toFixed(0), 'km/s, energy (kt TNT)', (r.recoilE / 4.184e12).toFixed(0));
console.log('blast the page counts (J):', M.blast(r, opt));
console.log('drag loss as a blast: 6.9 kPa radius', (P.blastRadius(r.dragLoss, 6900) / 1000).toFixed(1), 'km; 26.8 kPa radius', (P.blastRadius(r.dragLoss, 26800) / 1000).toFixed(1), 'km; 100 Pa radius', (P.blastRadius(r.dragLoss, 100) / 1000).toFixed(0), 'km');
