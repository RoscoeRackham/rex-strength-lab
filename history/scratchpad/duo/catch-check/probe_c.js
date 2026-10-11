global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA, K = P.K, g = K.g;
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
const objs = DD.objects.filter((o) => !o.noThrow);
const t0 = Date.now();
for (const [dial, anchor, D, style] of [[1e5 * 0.90718474, 'friction', 10, 'hard'], [1e12, 'bolted', 100, 'hard'], [1e12, 'bolted', 1e6, 'easy'], [1e15, 'bolted', 1e7, 'hard']]) {
  console.log(`=== dial ${dial.toExponential(2)} kg, ${anchor}, D ${D}, ${style}`);
  for (const o of objs) {
    const c = mk({ F: dial * g, anchor, groundHolds: anchor === 'bolted' });
    let L; try { L = P.catchLeg(c, c, o, D, style); } catch (e) { console.log(o.id, 'ERROR', e.message); continue; }
    const k = L.catch || {};
    const flags = [];
    if (L.result === 'caught' && k.gripRatio > 1) flags.push('CAUGHT-BUT-PALMS-PUNCH-IN');
    if (k.plateNeeded > o.area) flags.push('PLATE>FRONT(' + (k.plateNeeded / o.area).toExponential(1) + 'x)');
    if (L.result === 'caught' && L.heat && L.heat.kind === 'destroyed') flags.push('CAUGHT-BUT-BURNED-UP');
    if (L.vArrive != null && !isFinite(L.vArrive)) flags.push('vArrive=' + L.vArrive);
    if (L.aim && L.vArrive > 0 && K.rho0 * L.aim.vL ** 2 > (o.crush || Infinity)) flags.push('RAM>CRUSH(' + (K.rho0 * L.aim.vL ** 2 / o.crush).toFixed(1) + 'x)');
    if (L.flight && L.flight.inSpaceAtX) flags.push('IN-SPACE-AT-X');
    console.log(o.id.padEnd(10), String(L.result).padEnd(12), 'vL', L.aim ? L.aim.vL.toExponential(2) : (L.vL ? L.vL.toExponential(2) : '-'), 'th', L.aim ? L.aim.thetaDeg.toFixed(2) : '-', 'vArr', L.vArrive != null ? L.vArrive.toExponential(2) : '-', 'heat', L.heat ? L.heat.kind : '-', 'F', k.F ? k.F.toExponential(2) : '-', flags.join(' '), L.fireball ? L.fireball.kind : '');
  }
}
console.log('elapsed s', (Date.now() - t0) / 1000);
