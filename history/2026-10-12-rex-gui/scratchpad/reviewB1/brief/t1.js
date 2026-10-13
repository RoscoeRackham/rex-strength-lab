const { P, D, g, surf, rex, ollie, ON, ctxOf } = require('./setup.js');
for (const kg of [1e5, 1e7, 1e9]) {
  for (const pw of [{}, ON, { ownRecoil: true }]) {
    const cA = ctxOf(kg, pw, rex()), cB = ctxOf(kg, pw, ollie());
    const r = P.collide(cA, cB, { source: 'stomp', gb: 1, bounce: false });
    console.log(kg, JSON.stringify(pw), r.noCharge, r.charge && r.charge.why, r.v0, r.outcome);
  }
}
