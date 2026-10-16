const { P, g, sig, F0, ctxOf, sf } = require('./common');
const K = P.K;
// 1. the planet-strength argument for 'bolted on Unbreakable footing is held without limit'
const cO = ctxOf('ollie'), cR = ctxOf('rex', { anchor: 'bolted' });
const r = P.collide(cO, cR, { source: 'sprint' });
const s = r.contact.s, v = r.v0;
const Fcarry = K.M_E * v * v / (2 * s);
console.log('bolted unbreakable, main:', r.outcome, 'held', r.held, 'squash s', sig(s), 'm; to carry the Earth at', sig(v), 'm/s over the squash:', sig(Fcarry), 'N; F_HALVES', sig(P.COL.F_HALVES), 'N; ratio', sig(Fcarry / P.COL.F_HALVES));
console.log('  speed at which the planet could bear it (F = F_HALVES):', sig(Math.sqrt(2 * s * P.COL.F_HALVES / K.M_E)), 'm/s');
console.log('  main toGround for this hit:', r.toGround && sig(r.toGround.J), r.toGround && r.toGround.how, 'Earth dv splat', sig(r.earth.dvSplat));
// 2. light speed vs bolted on unbreakable, ownRecoil off: main's planetMoves
const rl = P.collide(ctxOf('ollie', { ownRecoil: false }), cR, { source: 'set', gb: Infinity });
console.log('light speed vs bolted unbreakable (ownRecoil off):', rl.outcome, rl.unlimitedVsBolted, 'held', rl.held);
// 3. the steady push, Rex bolted on real rock (the ground preset): rock crack radius at the uncapped push
const sA = ctxOf('ollie', { unbreakable: false }), sB = ctxOf('rex', { anchor: 'bolted', unbreakable: false });
const so = P.standoff(sA, sB);
const rockAt = (C, dip) => P.rockLoad(C, sB, so.dSep, dip);
console.log('push, Rex bolted on real rock: main contact', sig(so.contact), 'N rT', sig(so.rock.rT), 'm; uncapped 890 kN: rT', sig(rockAt(F0 * 0.9807 / 0.9807 * 1, false).rT), '(no dipole)', sig(rockAt(F0, true).rT), '(dipole)');
console.log('  push that cracks 5 cm of rock (rockBroke):', sig(2 * Math.PI * P.COL.ROCK_T * 0.05 * 0.05 / g), 'kg-force');
// 4. timing: one collide per source
for (const src of ['sprint', 'jump', 'stomp']) { const t0 = process.hrtime.bigint(); let n = 0; for (let i = 0; i < 20; i++) { P.collide(ctxOf('ollie', { F: (1 + i) * 1e5 * g }), ctxOf('rex'), { source: src }); n++; } console.log('collide', src, sig(Number(process.hrtime.bigint() - t0) / 1e6 / n, 2), 'ms per call'); }
