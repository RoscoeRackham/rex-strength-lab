const { P, ctx } = require('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/lib.js');
const K = P.K;
console.log('EARTH_BIND', K.EARTH_BIND, 'c', K.c);
for (const mode of ['comic','real']) for (const surface of ['concrete','sand','granite']) {
  console.log('==', mode, surface);
  for (const L of [8, 10, 12, 14, 15, 16, 18, 20, 22, 25, 28, 30, 32, 33, 33.5, 34]) {
    const c = ctx({ logKg: L, mode, surface });
    const r = P.jump(c);
    const s = P.stomp(c);
    const vB = r.push.vB;
    const capped = vB >= 0.01 * K.c * (1 - 1e-12);
    console.log(L, 'gF', r.groundFails, 'hb', r.heldBack, 'vB', vB.toExponential(3), capped ? 'CAP' : '', 'Eg', r.Eground.toExponential(3), 'Eg/bind', (r.Eground / K.EARTH_BIND).toExponential(2), 'mag', r.groundQuake.toFixed(2), 'work', (r.push.work).toExponential(3), 'Eg/work', (r.Eground / r.push.work).toExponential(2), 'v', r.v.toExponential(3), 'rel', r.relativistic, '| stompE', s.E.toExponential(3), 'disrupt', s.disrupts);
  }
}
