const { P, g, sig, rex: rex0, ollie: ollie0, sf, ob } = require('./h.js');
// tests use 3,007 kg bodies
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (F, extra) => Object.assign({ F, mode: 'comic', body: rex, surface: sf('concrete'), anchor: 'friction' }, extra || {});
const cmp = (label, c, Dd, oid, style) => {
  const cO = Object.assign({}, c, { body: ollie }), cOb = Object.assign({}, cO, { anchor: 'bolted' });
  const a = P.catchLeg(c, cO, ob(oid), Dd, style), b = P.catchLeg(c, cOb, ob(oid), Dd, style);
  const s = (L) => L.result + (L.catch ? (L.catch.carried ? ' carried' : '') + (L.catch.clean ? ' clean' : ' notclean') : '') + (L.bursts ? ' bursts' : '');
  console.log(label, Dd, oid, style, '| friction:', s(a), '| planted:', s(b));
};
for (const sh of [0.99, 0.9993, 0.99935, 0.9999]) cmp('l218 1e20 ON air ' + sh, ctxOf(1e20 * g, Object.assign({}, ON, { airAbsorb: sh })), 1000, 'baseball', 'hard');
for (const Dd of [60, 62, 63, 70, 200]) cmp('l497 1e17 ON air .5', ctxOf(1e17 * g, Object.assign({}, ON, { airAbsorb: 0.5 })), Dd, 'baseball', 'hard');
cmp('l501 1e15 ON', ctxOf(1e15 * g, ON), 1000, 'baseball', 'hard');
cmp('l544 1e14 ON .5', ctxOf(1e14 * g, Object.assign({}, ON, { airAbsorb: 0.5 })), 1000, 'baseball', 'hard');
cmp('l548 1e15 ON .5', ctxOf(1e15 * g, Object.assign({}, ON, { airAbsorb: 0.5 })), 1000, 'baseball', 'hard');
for (const kf of [true, false]) for (const sh of [0, 0.5]) for (const Dd of [1e5, 1e6]) cmp('l490 allstar kf ' + kf + ' sh ' + sh, ctxOf(200e18 * 907.18474 * g, Object.assign({}, ON, { airAbsorb: sh, keepForm: kf })), Dd, 'baseball', 'hard');
// 5b grid with keepForm only (ownRecoil off): unaffected; skip
// game-of-catch page default: default dial, every object at 30 m, plus the page's distance range
const F0 = 100 * 907.18474 * g;
for (const oid of ['baseball', 'car', 'piano', 'person', 'shot', 'bus', 'tank']) for (const lgD of [1, 1.5, 2, 3]) for (const lg of [Math.log10(F0 / g), 6, 9, 12, 16, 20]) for (const style of ['easy', 'hard']) {
  const c = Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: rex0, surface: sf('concrete'), anchor: 'friction' }, ON);
  const cO = Object.assign({}, c, { body: ollie0 }), cOb = Object.assign({}, cO, { anchor: 'bolted' });
  const o = ob(oid); if (!o) continue;
  const a = P.catchLeg(c, cO, o, Math.pow(10, lgD), style), b = P.catchLeg(c, cOb, o, Math.pow(10, lgD), style);
  if (a.result !== b.result || !!a.bursts !== !!b.bursts) console.log('PAGE FLIP', oid, lgD, sig(lg), style, a.result, '->', b.result, a.bursts, b.bursts);
}
console.log('done');
