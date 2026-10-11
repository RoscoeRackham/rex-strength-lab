global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const Dd = window.DINO_DATA;
const engines = { orig: require('/home/user/dino-strength-sim/src/engine.js'), fix: require(process.argv[2]) };
const g = 9.80665;
const objs = Dd.objects.filter((o) => o.m < 1e12);
const res = { orig: { n: 0, bad: 0, worst: 0, worstCase: null, maxLen: 0 }, fix: { n: 0, bad: 0, worst: 0, worstCase: null, maxLen: 0 } };
let spaceCases = 0;
for (const o of objs) for (let lk = 2.7; lk <= 34; lk += 0.5) for (const ang of [10, 30, 45, 60, 80]) for (const anchor of ['friction', 'bolted']) {
  for (const k of ['orig', 'fix']) {
    const P = engines[k];
    const body = P.makeBody({ H: 2, m: 180 });
    const surface = Dd.surfaces.find((s) => s.id === 'concrete');
    const c = { F: Math.pow(10, lk) * g, mode: 'comic', body, surface, groundHolds: false, anchor, record: true };
    let r; try { r = P.throwObject(c, o, ang); } catch (e) { continue; }
    const f = r.flight; if (!f || !f.path || f.path.length < 2 || f.relativistic || !f.landed) continue;
    let pm = 0; for (const p of f.path) pm = Math.max(pm, p[1]);
    const err = 1 - pm / f.apex;
    const R = res[k]; R.n++; R.maxLen = Math.max(R.maxLen, f.path.length);
    if (k === 'orig' && f.apex > 150e3) spaceCases++;
    if (Math.abs(err) > 0.005) R.bad++;
    if (Math.abs(err) > Math.abs(R.worst)) { R.worst = err; R.worstCase = [o.id, lk.toFixed(1), ang, anchor, (f.apex / 1e3).toFixed(0) + ' km', (pm / 1e3).toFixed(0) + ' km'].join(' '); }
  }
}
console.log('landed flights with apex>150km:', spaceCases);
console.log(JSON.stringify(res, null, 1));
