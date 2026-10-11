global.window = {};
const E = { orig: require('/home/user/dino-strength-sim/src/engine.js'), fix2: require(__dirname + '/engine_fix2.js') };
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = E.orig.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s])), O = Object.fromEntries(D.objects.map(o => [o.id, o]));
const b = E.orig.makeBody({ H: 2 });
const f = x => typeof x === 'number' ? x.toPrecision(3) : String(x);
for (const [sid, oid, kg, deg] of [['sand','car',511,0],['sand','car',511,1],['sand','car',3000,0],['sand','car',3000,1],['sand','car',9071.85,45],['clay','car',9071.85,45],['asphalt','tank',90718.5,0],['asphalt','tank',90718.5,1],['asphalt','tank',90718.5,11],['concrete','b747',90718.5,4],['concrete','b747',90718.5,45]]) {
  const c = { F: kg * g, mode: 'comic', body: b, surface: S[sid], groundHolds: false, anchor: 'friction' };
  const out = Object.keys(E).map(k => { const r = E[k].throwObject(c, O[oid], deg); return k + ': R ' + f(r.anchor.R) + ' v ' + f(r.v) + ' recoil ' + f(r.recoilV) + ' range ' + f(r.flight.range) + ' canMove ' + r.canMove; });
  console.log(sid, oid, kg, deg + 'deg |', out.join(' | '));
}
