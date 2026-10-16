const { P, g, sig, ctxOf, sf } = require('./common');
const { newCollide } = require('./proto');
const { facts } = require('./search');
const R = P.RESTRAINT;
for (const lg of [4, 4.5, 5, 5.5, 6, 6.25]) {
  const F = Math.pow(10, lg) * g;
  const cO = ctxOf('ollie', { F, unbreakable: false }), cR = ctxOf('rex', { F, unbreakable: false });
  const a = P.collide(cO, cR, { source: 'jump', toGround: true }), b = newCollide(cO, cR, { source: 'jump', toGround: true });
  const fa = facts(P.collide, { colSrc: 'jump', FR: F, FO: F }, { unbreakable: false }, 3), fb = facts(newCollide, { colSrc: 'jump', FR: F, FO: F }, { unbreakable: false }, 3);
  console.log('1e' + lg, 'v0', sig(a.v0), '| main', a.outcome, 'depth', sig(a.after.splat.depth), 'toGround', sig(a.toGround && a.toGround.J), 'harm', fa.harm, '| proto', b.outcome, 'depth', sig(b.after && b.after.splat.depth), 'toGround', sig(b.toGround && b.toGround.J), 'harm', fb.harm);
}
// the page's least:real search for shots.js 540-543: friction, jump, logKg 6.25, near 3
const { plan } = require('./search');
