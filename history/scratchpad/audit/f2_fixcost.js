const P = require('/home/user/dino-strength-sim/src/engine.js');
for (const [v, th] of [[7950, 0], [9000, 0], [11000, 45], [8000, 45], [38.8, 0], [38.5, 90], [20000, 45], [7000, 89]]) {
  const t0 = process.hrtime.bigint();
  const f = P.fly({ v0: v, thetaDeg: th, h0: 1.8, m: 1, A: 1, Cd: 0, record: true, tMax: 4 * 86400 });
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  console.log('v', v, 'th', th, 'range km', (f.range / 1e3).toFixed(3), 'escaped', f.escaped, 'timedOut', f.timedOut, 'steps', f.steps, ms.toFixed(1) + ' ms');
}
