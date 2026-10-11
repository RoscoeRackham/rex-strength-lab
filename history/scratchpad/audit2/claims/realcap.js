global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js'); const K = P.K, g = K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const logs = [3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34];
for (const H of [0.4, 2, 50]) for (const sid of ['sand', 'concrete', 'granite']) for (const gh of [false, true]) for (const anchor of ['friction', 'braced', 'bolted']) {
  const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) }); const surface = D.surfaces.find((s) => s.id === sid);
  const s = body.s;
  const rows = { jump: [], punch: [], clap: [], stomp: [], throwBall: [], throwCar: [], throwPyr: [] };
  for (const lg of logs) {
    const c = { F: Math.pow(10, lg) * g, mode: 'real', body, surface, groundHolds: gh, anchor };
    rows.jump.push(P.jump(c).v);
    rows.punch.push(P.punch(c).vFist);
    rows.clap.push(P.clap(c).vHand);
    rows.stomp.push(P.stomp(c).vFoot);
    rows.throwBall.push(P.throwObject(c, obj('baseball'), 45).v);
    rows.throwCar.push(P.throwObject(c, obj('car'), 45).v);
    rows.throwPyr.push(P.throwObject(c, obj('pyramid'), 45).v);
  }
  const caps = { jump: 12 * s, punch: 17 * s, clap: 17 * s, stomp: 16 * s, throwBall: 84.6 * s, throwCar: 35 * s, throwPyr: 35 * s };
  const issues = [];
  for (const [k, arr] of Object.entries(rows)) {
    arr.forEach((v, i) => { if (v > caps[k] * 1.02) issues.push(k + '@1e' + logs[i] + ' v=' + v.toFixed(2) + ' cap=' + caps[k].toFixed(2)); });
    // non-monotone drops > 3%
    for (let i = 1; i < arr.length; i++) if (arr[i] < arr[i - 1] * 0.97 && arr[i - 1] > 0) issues.push(k + ' drops 1e' + logs[i - 1] + '->1e' + logs[i] + ' ' + arr[i - 1].toFixed(2) + '->' + arr[i].toFixed(2));
    for (let i = 1; i < arr.length; i++) if (arr[i] > arr[i - 1] * 1.05 && logs[i] >= 14) issues.push(k + ' jumps up 1e' + logs[i - 1] + '->1e' + logs[i] + ' ' + arr[i - 1].toFixed(2) + '->' + arr[i].toFixed(2));
  }
  if (issues.length) console.log(H, sid, gh ? 'comic' : '', anchor, '\n   ' + issues.join('\n   '));
}
