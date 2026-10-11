global.window = {}; require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const P = window.DinoPhys || require('/home/user/dino-strength-sim/src/engine.js'), D = window.DINO_DATA, K = P.K, g = K.g;
for (const [mode, H] of [['comic', 2], ['real', 2], ['comic', 50], ['real', 50]]) {
  const base = { mode, body: P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' };
  const at = (kg, extra) => Object.assign({}, base, { F: kg * g }, extra || {});
  const car = D.objects.find(o => o.id === 'car');
  const E = (id) => D.energyRefs.find((e) => e.id === id).J;
  const W = (id) => D.overpressure.find((o) => o.id === id);
  const jumpPred = (extra) => (kg) => { const j = P.jump(at(kg, extra)); return j.v > 0 && (j.relativistic || j.flight.apex >= 93 || j.flight.escaped); };
  const preds = {
    boom: (kg) => P.punch(at(kg)).vFist >= K.a0, windows: (kg) => P.blastRadius(P.clap(at(kg)).E, W('windows').Pa) >= 10,
    carmach3: (kg) => P.throwObject(at(kg), car, 45).v >= 3 * K.a0, jumpliberty: jumpPred(), quake3: (kg) => P.stomp(at(kg)).quake >= 3,
    hiro: (kg) => P.punch(at(kg)).E >= E('hiroshima'), quake7: (kg) => P.stomp(at(kg)).quake >= 7, tsar: (kg) => P.clap(at(kg)).E >= E('tsar'),
    chix: (kg) => P.punch(at(kg)).E >= E('chicxulub'), earth: (kg) => P.punch(at(kg)).E >= E('earthbind'), jumpRigid: jumpPred({ groundHolds: true }) };
  const row = [];
  for (const [k, f] of Object.entries(preds)) { let n = 0; const t = process.hrtime.bigint(); const kg = P.threshold((x) => { n++; return f(x); }, 10, 1e34); row.push(k + '=' + Math.round(Number(process.hrtime.bigint() - t) / 1e6) + 'ms/' + n + (isFinite(kg) ? '' : '(never)')); }
  console.log(mode, H + 'm', row.join(' '));
}
