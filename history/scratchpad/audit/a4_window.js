const { P, g, ctx, obj } = require('./common.js');
const acts = {
  punch: (c) => P.punch(c).vFist,
  clap: (c) => P.clap(c).vHand,
  stomp: (c) => P.stomp(c).vFoot,
  jump: (c) => P.jump(c).v,
  throwBall45: (c) => P.throwObject(c, obj('baseball'), 45).v,
  throwShot45: (c) => P.throwObject(c, obj('shot'), 45).v,
  throwCar45: (c) => P.throwObject(c, obj('car'), 45).v,
  throwBus45: (c) => P.throwObject(c, obj('bus'), 45).v,
};
for (const extra of [{}, { groundHolds: true }]) {
  console.log('== real mode, concrete, friction', JSON.stringify(extra));
  for (const [name, f] of Object.entries(acts)) {
    let inBad = false, start = null; const wins = [];
    let prevOK = null;
    for (let lg = 2.5; lg <= 16; lg += 0.01) {
      const kg = Math.pow(10, lg);
      const v = f(ctx(kg, 'real', extra));
      const bad = !(v > 0) && prevOK; // was moving, now zero
      if (v > 0) prevOK = true;
      if (!(v > 0) && prevOK && !inBad) { inBad = true; start = kg; }
      if (v > 0 && inBad) { inBad = false; wins.push([start, kg]); }
    }
    if (inBad) wins.push([start, Infinity]);
    console.log(name.padEnd(12), wins.map(([a, b]) => a.toExponential(2) + ' .. ' + b.toExponential(2) + ' kg').join(', ') || 'no zero-window');
  }
}
