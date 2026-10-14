global.window = {};
const P = require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/verifyR5/verify-catch/old/rex-strength-lab/src/engine.js');
require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/verifyR5/verify-catch/old/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (build, logKg, extra) => Object.assign({ F: Math.pow(10, logKg) * P.K.g, mode: 'comic', body: P.makeBody({ build, H: 3.048, m: 3007 }), surface, anchor: 'friction', airAbsorb: 0, keepForm: true, unbreakable: true, ownRecoil: true }, extra || {});
const o = D.objects.find(x => x.id === 'baseball');
const cases = process.argv.slice(2).length ? JSON.parse(process.argv[2]) : [[15, 4.0414, 'easy'], [15, 4.0414, 'hard'], [13.301, 4.0607, 'easy'], [13.301, 4.0607, 'hard']];
for (const [lk, lD, st, aa] of cases) {
  const cR = mk('rex', lk, { airAbsorb: aa || 0 }), cO = mk('ollie', lk, { airAbsorb: aa || 0 });
  const Dmin = P.catchMinD(cR.body, cO.body, o);
  const Dd = Math.max(Dmin, Math.pow(10, lD));
  const a = P.catchLeg(cR, cO, o, Dd, st);
  console.log(JSON.stringify({ lk, lD, st, aa, Dd, result: a.result, vL: a.aim && a.aim.vL, vLc: a.aim && a.aim.vL / P.K.c, vArrive: a.vArrive, sheath: a.sheath, Earr: a.fast, fullStrength: a.fullStrength }, (k, v) => typeof v === 'number' ? Number(v.toPrecision(6)) : v));
  if (a.sheath) {
    const share = a.sheath.share; const Etot = a.sheath.E / share;
    console.log('  share%', (100 * share).toFixed(4), 'E_KE', Etot.toExponential(4), 'E left', (Etot - a.sheath.E).toExponential(4), 'KE_arrive_obj(1/2 m v^2)', (0.5 * o.m * a.vArrive ** 2).toExponential(4));
  }
}
