// Sheath-catch flight time: engine's out.time vs numerical integral of ds / v(s) using the engine's own v(s) law
function load(dir) {
  global.window = {};
  const P = require(dir + '/engine.js'); require(dir + '/data.js');
  return { P, D: window.DINO_DATA };
}
const which = process.argv[2] || 'new';
const { P, D } = load(which === 'old' ? __dirname + '/old' : '/home/user/rex-strength-lab/rex-strength-lab/src');
const K = P.K;
const obj = D.objects.find((x) => x.id === 'baseball');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const conc = D.surfaces.find((s) => s.id === 'concrete');
const ctx = (kg, body, share) => ({ F: kg * K.g, mode: 'comic', body, surface: conc, anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true });
const cases = [[1e17, 0.5, 62], [1e17, 0.5, 200], [1e17, 0, 1000], [1e15, 0.5, 1000], [2e13, 0, 11500], [1e19, 0.5, 1000]];
for (const [kg, sh, Dd] of cases) {
  const L = P.catchLeg(ctx(kg, rex, sh), ctx(kg, ollie, sh), obj, Dd, 'hard');
  if (!L.fast || !L.sheath) { console.log(JSON.stringify({ kg, sh, Dd, result: L.result, kind: L.fireball && L.fireball.kind })); continue; }
  const k = 1 - sh, v0 = L.aim.vL, vA = L.vArrive, Lc = L.chord;
  // engine's law v(s) = v0 / (1 + x(s)/gamma); recover gamma from v0 and vA at s = Lc: 1 + X/gamma = v0/vA, X ∝ s
  const a = (v0 / vA - 1) / Lc;    // 1/v(s) = (1 + a s)/v0
  // numerical integral (Simpson, 2000 steps)
  const N = 2000; let S = 0;
  for (let i = 0; i <= N; i++) { const s = Lc * i / N, w = i === 0 || i === N ? 1 : i % 2 ? 4 : 2; S += w * (1 + a * s) / v0; }
  const tTrue = S * Lc / N / 3;
  // independent of the engine's lump speed: gamma from v0, x from rho0 A k s / m
  const g = 1 / Math.sqrt(1 - (v0 / K.c) ** 2);
  const X = k * K.rho0 * obj.area * Lc / obj.m;
  const tClosed = Lc / v0 * (1 + X / (2 * g));
  console.log(JSON.stringify({ kg, sh, Dd, result: L.result, v0_c: +(v0 / K.c).toPrecision(4), vA: +vA.toPrecision(4), vA_check: +(v0 / (1 + X / g)).toPrecision(4), chord: +Lc.toPrecision(5), hitsGround: !!L.hitsGround, shown: +L.time.toPrecision(4), integral: +tTrue.toPrecision(4), closed: +tClosed.toPrecision(4), ratio: +(L.time / tTrue).toFixed(3), share: +L.sheath.share.toPrecision(3) }));
}
