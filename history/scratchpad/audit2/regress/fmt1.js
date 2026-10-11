const { P, D, ctx, obj } = require('./common.js');
const K = P.K;
// copy of the page's sig/fmtSpeed
function sig(x, n) { if (!isFinite(x)) return x < 0 ? '−∞' : '∞'; if (x === 0) return '0'; const d = Math.floor(Math.log10(Math.abs(x))); const p = Math.pow(10, n - 1 - d); const r = Math.round(x * p) / p; return r.toLocaleString('en-US', { maximumFractionDigits: Math.max(0, n - 1 - d) }); }
function fmtSpeed(v) { if (!isFinite(v) || v >= K.c * (1 - 1e-12)) return 'light speed (to the last digit)'; if (v >= 0.01 * K.c) { const b = v / K.c; if (b > 0.999) return sig(b * 100, 8).replace(/0+$/, '') + '% of light speed'; return sig(b * 100, 3) + '% of light speed'; } return sig(v, 3) + ' m/s'; }
const tiers = D.tiers.filter((t) => t.chip && isFinite(t.liftKg));
for (const t of tiers) {
  const c = ctx({ kg: t.liftKg });
  const outs = { jump: P.jump(c).v, punch: P.punch(c).vFist, clap: P.clap(c).vHand, stompFoot: P.stomp(c).vFoot, stompBody: P.stomp(c).vBody, throwCar: P.throwObject(c, obj('car'), 45).v, throwBall: P.throwObject(c, obj('baseball'), 2).v, recoilCar: P.throwObject(c, obj('car'), 45).recoilV, sprint: P.sprint(c).vTop };
  const bad = Object.entries(outs).filter(([k, v]) => /^1(\.\d+)?% of light/.test(fmtSpeed(v)) && v / K.c > 0.5).map(([k, v]) => k + ' shows "' + fmtSpeed(v) + '" (v/c=' + (v / K.c).toPrecision(12) + ')');
  if (bad.length) console.log(t.chip, ':', bad.join('; '));
}
let n = 0; for (let lg = 15; lg <= 34; lg += 0.01) { const v = P.jump(ctx({ kg: Math.pow(10, lg) })).v; if (fmtSpeed(v).startsWith('1% ')) n++; }
console.log('slider positions (0.01 steps, 1e15-1e34) where the comic concrete jump shows "1% of light speed":', n);
