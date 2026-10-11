global.window = {};
const which = process.argv[2] || 'orig';
const P = require(which === 'orig' ? '/home/user/dino-strength-sim/src/engine.js' : __dirname + '/engine_fix.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
const O = Object.fromEntries(D.objects.map(o => [o.id, o]));
const f = x => typeof x === 'number' ? x.toPrecision(4) : String(x);
function ctx(kg, sid, anchor) { return { F: kg * g, mode: 'comic', body: P.makeBody({ H: 2 }), surface: S[sid], groundHolds: false, anchor: anchor || 'friction' }; }
console.log('== ' + which);
for (const [sid, oid, kg, anc] of [['sand','car',3000],['clay','car',3000],['sand','bus',1e6],['sand','car',3000,'braced'],['sand','car',1e4]])
  for (const deg of [0, 0.001, 0.1, 1, 10, 45, 60]) {
    const r = P.throwObject(ctx(kg, sid, anc), O[oid], deg);
    console.log(sid, oid, anc||'friction', 'lift', kg, 'deg', deg, '| R', f(r.anchor.R), r.anchor.limit, 'Rbear', f(r.anchor.Rbear), 'Rhor', f(r.anchor.Rhor), '| F', f(r.F), 'v', f(r.v), 'recoil', f(r.recoilV), 'range', f(r.flight.range));
  }
const b = P.makeBody({H:2});
console.log('car m', O.car.m, 'bus m', O.bus.m, 'Nmax sand', S.sand.qult*2*b.footArea, 'clay', S.clay.qult*2*b.footArea, 'dino m', b.m, 'footArea', b.footArea);
