global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = 9.80665;
const ball = D.objects.find(o => o.id === 'baseball');
for (const f of ['/home/user/dino-strength-sim/src/engine.js', './engine100.js', './engineHi.js']) {
  delete require.cache[require.resolve(f)];
  const P = require(f);
  const out = [];
  const t0 = Date.now();
  for (const [H, anchor, inf, lg] of [[2, 'braced', true, 0], [2, 'braced', false, 34], [2, 'friction', false, 34], [0.4, 'braced', false, 34], [0.4, 'friction', false, 34], [0.4, 'braced', false, 12], [2,'friction',false,3.7084]]) {
    const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
    const c = { F: inf ? Infinity : Math.pow(10, lg) * g, mode: 'real', body, surface: D.surfaces.find(s => s.id === 'granite'), groundHolds: false, anchor };
    const j = P.jump(c);
    out.push(`H=${H} ${anchor} ${inf ? 'inf' : 'lg' + lg}: punch ${P.punch(c).vFist.toFixed(4)} jump ${j.v.toFixed(4)} apex ${(j.flight.apex||j.flight.maxH||0)} whip ${P.throwObject(c, ball, 45).v.toFixed(4)} stomp ${P.stomp(c).vFoot.toFixed(3)} clap ${P.clap(c).vHand.toFixed(3)}`);
  }
  console.log('==', f, (Date.now() - t0) + 'ms'); console.log(out.join('\n'));
}
