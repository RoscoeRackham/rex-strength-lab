global.window = {};
const which = process.argv[2];
const P = require(which === 'fix' ? './engine_fix.js' : '/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({});
const surf = (id) => D.surfaces.find(s => s.id === id);
const obj = (id) => D.objects.find(o => o.id === id);
function run(F, objId, ang, anchor, surface='concrete', mode='real') {
  const c = { F, mode, body, surface: surf(surface), groundHolds: false, anchor };
  const r = P.throwObject(c, obj(objId), ang);
  return `v=${r.v.toFixed(3)} range=${r.flight && r.flight.range != null ? r.flight.range.toFixed(2) : '-'} recoil=${r.recoilV.toFixed(2)} held=${r.heldBack} sink=${r.sinkRatio && r.sinkRatio.toExponential(2)} basis=${r.basis||''}`;
}
let bad = 0;
for (const surface of D.surfaces.map(s=>s.id)) for (const anc of ['friction','braced','bolted']) for (const o of D.objects.filter(o=>o.m < 1e9).map(o=>o.id)) for (const a of [0,10,30,45,60,80]) for (const mode of ['real','comic']) {
  const fin = run(1e34*g, o, a, anc, surface, mode), inf = run(Infinity, o, a, anc, surface, mode);
  if (mode === 'real' && fin.split(' ').slice(0,3).join() !== inf.split(' ').slice(0,3).join()) { bad++; if (bad <= 15) console.log(surface, anc, o, a, mode, '\n  1e34:', fin, '\n  inf :', inf); }
}
console.log('real-mode mismatches 1e34 vs inf:', bad);
for (const [o,a,anc] of [['car',45,'friction'],['tank',30,'friction'],['car',45,'braced'],['car',10,'friction']]) console.log(o,a,anc,'| inf real:', run(Infinity,o,a,anc), '| inf comic:', run(Infinity,o,a,anc,'concrete','comic'));
