const { P, g, sig, rex, ollie, ctx, ppv, ob, F0, sf } = require('./h.js');
// proxy for "planted catcher": both anchors bolted only for the catch. game() uses ctx for both throws and catches,
// so bolting changes the thrower too; with ownRecoil on the thrower is already bolted-like (ownAnchor).
for (const [lbl, F, oid, D] of [['1e9 fastball 10 m', 1e9 * g, 'baseball', 10], ['1e20 fastball 10 m', 1e20 * g, 'baseball', 10], ['1e6 car 30 m', 1e6 * g, 'car', 30], ['default baseball 30 m', F0, 'baseball', 30], ['default car 30 m', F0, 'car', 30]]) for (const anchor of ['friction', 'bolted']) {
  const cR = ctx({ F, anchor }), cO = ctx({ F, anchor }, ollie);
  const G = P.catchGame(cR, cO, ob(oid), D, 'hard');
  const a = G.a;
  console.log(lbl, anchor, a.result, 'trip', sig(G.round), 'forced', a.catch && a.catch.forced, 'tStroke', a.catch && sig(a.catch.tStroke), 'slide', a.catch && sig(a.catch.slide), 'carried', a.catch && a.catch.carried, 'uAfter', a.catch && sig(a.catch.uAfter), 'Ecatch', a.catch && sig(a.catch.Ecatch), 'bursts', a.bursts);
}
