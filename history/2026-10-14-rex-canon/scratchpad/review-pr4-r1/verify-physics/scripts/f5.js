const { P, g, R3, O3, ON, dial, c3, sig } = require('./common.js');
const on = (x) => Object.assign({}, ON, x || {});
for (const [lab, xR, own] of [['standing, on', { unbreakable: false }, true], ['bolted, on', { unbreakable: false, anchor: 'bolted' }, true], ['bolted, off', { unbreakable: false, anchor: 'bolted', ownRecoil: false }, false], ['standing, off', { unbreakable: false, ownRecoil: false }, false]]) {
  const r = P.collide(c3(dial, O3, on({ unbreakable: false, ownRecoil: own })), c3(dial, R3, on(xR)), { source: 'jump' });
  const k = r.carry;
  console.log(lab, { outcome: r.outcome, held: r.held, holdH: sig(r.hold.H), holdWhy: r.hold.why, rockGives: k && k.rockGives, tear: k && sig(k.tear), F: k && sig(k.F), footJ: k && sig(k.footJ), supplied: k && sig(k.supplied), depth: r.after && r.after.splat && sig(r.after.splat.depth), Eground: r.after && r.after.splat && sig(r.after.splat.Eground) });
}
