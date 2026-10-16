const { P, g, R3, O3, ON, dial, c3, sig, surf } = require('./common.js');
const on = (x) => Object.assign({}, ON, x || {});
const charge = (FO, o, xR, xO, FR) => P.collide(c3(FO, O3, xO || on()), c3(FR == null ? FO : FR, R3, xR || on()), o);
function show(lab, r) {
  const k = r.carry;
  if (!k) { console.log(lab, r.outcome); return; }
  const H = r.hold.H;
  console.log(lab, { outcome: r.outcome, v: sig(k.v), F: sig(k.F), T: sig(k.T), FT: sig(k.F * k.T), pGain: sig(k.pGain), footJ: sig(k.footJ), supplied: sig(k.supplied), holdH: sig(H), tear: sig(k.tear), rockGives: k.rockGives, s: sig(r.contact.s) });
  // the alternative: F' = F + H, footJ = H*T
  const Hh = k.rockGives ? k.tear : H;
  console.log('   alt F+H', sig(k.F + Hh), ' footJ(no cap)=H*T', sig(Hh * k.T), ' supplied alt', sig(k.pGain + Hh * k.T), ' supplied/(F*T)', sig(k.supplied / (k.F * k.T)));
}
show('sprint all-out', charge(dial, { source: 'sprint' }));
show('sprint least 4.26t', charge(4260 * g, { source: 'sprint' }, on(), on(), dial));
show('sprint least 4.26t, Rex at 4.26t', charge(4260 * g, { source: 'sprint' }));
// bolted Rex on real rock
show('bolted Rex real rock all-out', charge(dial, { source: 'sprint' }, on({ anchor: 'bolted', unbreakable: false }), on({ unbreakable: false })));
// set speed 1 m/s
const gb = (v) => (v / P.K.c) / Math.sqrt(1 - (v / P.K.c) ** 2);
show('set 1 m/s', charge(dial, { source: 'set', gb: gb(1) }));
show('set 1.5 m/s', charge(dial, { source: 'set', gb: gb(1.5) }));
show('set 2 m/s', charge(dial, { source: 'set', gb: gb(2) }));
show('jump onto Rex real ground', charge(dial, { source: 'jump' }, on({ unbreakable: false }), on({ unbreakable: false })));
// splatWithFooting limit mA -> large
const r = charge(dial, { source: 'sprint' });
const s = r.contact.s, v = r.carry.v, H = r.hold.H;
const sw = P.COLLIDE ? null : null;
