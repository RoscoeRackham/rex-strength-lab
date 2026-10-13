global.window = global;
const P = require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewA3/verify-equivalence/branch/rex-strength-lab/src/engine.js'); require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewA3/verify-equivalence/branch/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const g = 9.80665;
const body = P.makeBody({ H: 3.048, m: 3007, build: 'rex' });
const W = body.m * g;
for (const sid of ['concrete', 'sand']) {
  const surface = D.surfaces.find((s) => s.id === sid);
  for (const anchor of ['friction', 'bolted']) for (const kg of [3500, 1e4, 1e5, 1e7, 2e7, 1e9, 2e9]) {
    const F = kg * g;
    const r = P.sprint({ F, mode: 'comic', body, surface, groundHolds: false, anchor });
    console.log(sid.padEnd(9), anchor.padEnd(8), ('lift ' + kg.toExponential(1)).padEnd(13), 'beyond W ' + ((F - W) / 1e6).toPrecision(4).padStart(9) + ' MN', ' push-off ' + (r.thrust / 1e3).toPrecision(4).padStart(9) + ' kN', ' vTop ' + r.vTop.toPrecision(4).padStart(9) + ' m/s', ' limit ' + r.limit, '/', r.topLimit);
  }
}
