const { P, ctx, obj } = require('./common.js');
const surfaces = ['sand', 'concrete', 'granite', 'steel'];
const anchors = ['friction', 'braced', 'bolted'];
const out = {};
for (const H of [0.4, 2, 50]) for (const s of surfaces) for (const a of anchors) for (const gh of [false, true]) {
  let worst = {};
  for (let lg = 2; lg <= 34; lg += 0.25) {
    const c = ctx({ kg: Math.pow(10, lg), mode: 'real', surface: s, anchor: a, groundHolds: gh, H });
    const vm = (k) => P.MUSCLE[k].vmax * c.body.s;
    const pu = P.punch(c), cl = P.clap(c), st = P.stomp(c), ju = P.jump(c);
    const th = P.throwObject(c, obj('baseball'), 0), ts = P.throwObject(c, obj('shot'), 37), tc = P.throwObject(c, obj('car'), 45);
    const rows = { punch: (pu.push.vA + pu.push.vB) / vm('punch'), clap: (cl.push.vA + cl.push.vB) / vm('clap'), stomp: (st.push.vA + st.push.vB) / vm('stomp'), jump: (ju.push.vA + ju.push.vB) / vm('jump'),
      whip: th.push ? (th.push.vA + th.push.vB) / vm('throwWhip') : 0, shot: ts.push ? (ts.push.vA + ts.push.vB) / vm('throwPush') : 0, car: tc.push ? (tc.push.vA + tc.push.vB) / vm('throwPush') : 0 };
    for (const [k, v] of Object.entries(rows)) if (!(worst[k] && worst[k][0] >= v)) worst[k] = [v, lg];
  }
  const bad = Object.entries(worst).filter(([k, v]) => v[0] > 1.001).map(([k, v]) => k + ':' + v[0].toFixed(4) + '@1e' + v[1]);
  if (bad.length) console.log(`H=${H} ${s} ${a} holds=${gh}: ` + bad.join(' '));
}
