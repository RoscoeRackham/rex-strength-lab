const { P, g, ctx, obj } = require('./lib.js');
const rows = [];
for (const surface of ['concrete', 'granite', 'sand']) for (const groundHolds of [false, true]) {
  let prev = {};
  for (let lg = 2.7; lg <= 34; lg += 0.05) {
    const c = ctx({ logKg: lg, surface, mode: 'real', groundHolds });
    const r = {
      jump: P.jump(c).v,
      punch: P.punch(c).vFist,
      clap: P.clap(c).vHand,
      stomp: P.stomp(c).vFoot,
      throwShot: P.throwObject(c, obj('shot'), 37).v,
      throwBall: P.throwObject(c, obj('baseball'), 0).v,
      throwCar: P.throwObject(c, obj('car'), 45).v,
    };
    for (const k of Object.keys(r)) {
      if (prev[k] != null && r[k] < prev[k] * 0.9) rows.push(`${surface} holds=${groundHolds} ${k}: drops ${prev[k].toFixed(3)} -> ${r[k].toFixed(3)} at lg ${lg.toFixed(2)}`);
      prev[k] = r[k];
    }
  }
}
console.log(rows.join('\n'));
