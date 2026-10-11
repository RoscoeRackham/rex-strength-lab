global.window = {}; const P0 = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const P = window.DinoPhys || P0, D = window.DINO_DATA, K = P.K, g = K.g;
const LMIN=1, LMAX=34;
function thresholds(state, steps) {
  const base = { F: 0, mode: state.mode, body: P.makeBody({ H: state.H, m: state.m }), surface: D.surfaces.find(s=>s.id===state.surface), groundHolds: state.groundHolds, anchor: state.anchor };
  const at = (kg, extra) => Object.assign({}, base, { F: kg * g }, extra || {});
  const car = D.objects.find(o=>o.id==='car');
  let calls = 0;
  const th = (pred) => P.threshold((x)=>{calls++; return pred(x);}, Math.pow(10, LMIN), Math.pow(10, LMAX));
  const W = (id) => D.overpressure.find((o) => o.id === id);
  const E = (id) => D.energyRefs.find((e) => e.id === id).J;
  const jumpPred = (extra) => (kg) => { const j = P.jump(at(kg, extra)); return j.v > 0 && (j.relativistic || j.flight.apex >= 93 || j.flight.escaped); };
  const defs = [
    ['boom', (kg) => P.punch(at(kg)).vFist >= K.a0],
    ['windows', (kg) => P.blastRadius(P.clap(at(kg)).E, W('windows').Pa) >= 10],
    ['carmach3', (kg) => P.throwObject(at(kg), car, 45).v >= 3 * K.a0],
    ['jumpliberty', jumpPred()],
    ['quake3', (kg) => P.stomp(at(kg)).quake >= 3],
    ['hiro', (kg) => P.punch(at(kg)).E >= E('hiroshima')],
    ['quake7', (kg) => P.stomp(at(kg)).quake >= 7],
    ['tsar', (kg) => P.clap(at(kg)).E >= E('tsar')],
    ['chix', (kg) => P.punch(at(kg)).E >= E('chicxulub')],
    ['earth', (kg) => P.punch(at(kg)).E >= E('earthbind')],
  ];
  const out = {}; const times = {};
  for (const [id, f] of defs) { const t=performance.now(); out[id]=th(f); times[id]=+(performance.now()-t).toFixed(1); }
  if (!isFinite(out.jumpliberty) && !state.groundHolds) { const t=performance.now(); out.jlRigid = th(jumpPred({groundHolds:true})); times.jlRigid=+(performance.now()-t).toFixed(1); }
  return { out, times, calls };
}
const cases = [
  {mode:'comic',H:2,m:180,surface:'concrete',anchor:'friction',groundHolds:false},
  {mode:'real',H:2,m:180,surface:'concrete',anchor:'friction',groundHolds:false},
  {mode:'real',H:50,m:180*Math.pow(25,3),surface:'concrete',anchor:'friction',groundHolds:false},
  {mode:'comic',H:50,m:180*Math.pow(25,3),surface:'concrete',anchor:'friction',groundHolds:false},
  {mode:'real',H:2,m:180,surface:'concrete',anchor:'friction',groundHolds:true},
];
// warm up
thresholds(cases[0]);
for (const c of cases) { for (let rep=0; rep<2; rep++) { const t=performance.now(); const r=thresholds(c); const tot=performance.now()-t; if (rep===1) console.log(c.mode, c.H+'m', 'gh='+c.groundHolds, 'total='+tot.toFixed(0)+'ms', 'calls='+r.calls, JSON.stringify(r.times)); } }
