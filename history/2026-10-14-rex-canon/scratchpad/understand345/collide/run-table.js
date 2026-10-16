const { P, g, sig, F0, ctxOf, OFF, sf } = require('./common');
const { newCollide } = require('./proto');
const c = P.K.c;
const show = (r, bounce) => { if (r.outcome === 'paradox') return { outcome: r.outcome, heldBy: r.heldBy, v0: sig(r.v0) };
  const af = r.after && (bounce ? r.after.bounce : r.after.splat);
  return { outcome: r.outcome, v0: sig(r.v0), vB: sig(r.carry && r.carry.vB), supplied: sig(r.carry && r.carry.supplied), pGain: sig(r.carry && r.carry.pGain), Q: sig(r.Q), absorbedE: sig(r.absorbedE), slideOrDepth: sig(af && (af.slide != null ? af.slide : af.slideB != null ? af.slideB : af.depth)), D: sig(af && af.D), toGround: r.toGround && sig(r.toGround.J), T: r.toGround && sig(r.toGround.T), tHit: r.contact && sig((bounce ? r.contact.softEl : r.contact.soft).t), F: r.contact && sig((bounce ? r.contact.softEl : r.contact.soft).F) }; };
for (const [label, F, src, gb, extra] of [
  ['sprint, default dial', F0, 'sprint'], ['jump, 1e9', 1e9 * g, 'jump'], ['stomp, 1e9', 1e9 * g, 'stomp'],
  ['set 0.1% c', 1e6 * g, 'set', 1e-3], ['set 1% c', 1e6 * g, 'set', 0.01 / Math.sqrt(1 - 1e-4)], ['set 50% c', 1e6 * g, 'set', 0.5 / Math.sqrt(0.75)], ['light speed', 1e6 * g, 'set', Infinity],
  ['sprint, Rex bolted (unbreakable)', F0, 'sprint', undefined, { anchor: 'bolted' }],
  ['sprint, Rex bolted, real rock', F0, 'sprint', undefined, { anchor: 'bolted', unbreakable: false }],
  ['jump 1e9, real ground', 1e9 * g, 'jump', undefined, { unbreakable: false }],
  ['jump 1e6.25, real ground', Math.pow(10, 6.25) * g, 'jump', undefined, { unbreakable: false }],
  ['sprint, sand', F0, 'sprint', undefined, { surface: sf('sand') }],
  ['light speed, Rex bolted unbreakable', 1e6 * g, 'set', Infinity, { anchor: 'bolted' }],
]) {
  const cO = ctxOf('ollie', Object.assign({ F }, extra && extra.surface ? { surface: extra.surface } : {})), cR = ctxOf('rex', Object.assign({ F }, extra || {}));
  for (const bounce of [false, true]) {
    const r = newCollide(cO, cR, { source: src, gb, bounce });
    console.log(label, bounce ? 'bounce' : 'splat', JSON.stringify(show(r, bounce)));
  }
}
