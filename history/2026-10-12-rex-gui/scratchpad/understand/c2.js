global.window = {};
const P = require('./head/engine.js'); require('./head/data.js'); const D = window.DINO_DATA;
const g = 9.80665;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const R = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({ H: 3.048, m: 3007, build: 'rex' }), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
const O = (o) => Object.assign(R(), { body: P.makeBody({ H: 3.048, m: 3007, build: 'ollie' }) }, o || {});
const f = (x) => (typeof x === 'number' ? x.toPrecision(3) : x);
const imp = (sf, J, T) => P.vibSource(sf, 'hann', 2 * J / T, T);
const show = (lbl, src) => console.log(lbl.padEnd(46), 'ppv5', f(P.ppvAt(src, 5) * 1000), 'mm/s', 'plaster@5', P.plasterOver(src, 5), 'plasterReach', f(P.plasterReach(src)), 'rattleReach', f(P.ppvReach(src, P.VIB.TH.rattle)), 'feelReach', f(P.ppvReach(src, P.VIB.TH.feel)));
for (const sid of ['concrete', 'sand', 'granite']) {
  const sf = surf(sid);
  console.log('---', sid);
  const st = P.stomp(R({ surface: sf }));
  show('solo stomp all-out (100 t dial)', P.RESTRAINT.MOVES.stomp.shake(st, { surface: sf, body: R().body }));
  const jp = P.jump(R({ surface: sf }));
  show('solo jump landing all-out', P.RESTRAINT.MOVES.jump.shake(jp, { surface: sf, body: R().body, m: 3007 }));
  for (const [lbl, cA, cB, opt] of [
    ['collide sprint splat Rex bolted', O({ surface: sf }), R({ surface: sf, anchor: 'bolted' }), { source: 'sprint' }],
    ['collide sprint bounce Rex bolted', O({ surface: sf }), R({ surface: sf, anchor: 'bolted' }), { source: 'sprint', bounce: true }],
    ['collide sprint splat friction (partial)', O({ surface: sf }), R({ surface: sf }), { source: 'sprint' }],
    ['collide jump splat (held: bearing)', O({ surface: sf }), R({ surface: sf }), { source: 'jump' }],
    ['collide set 1 km/s bolted', O({ surface: sf }), R({ surface: sf, anchor: 'bolted' }), { source: 'set', gb: 1000 / 299792458 }],
  ]) {
    const r = P.collide(cA, cB, opt);
    const b = !!opt.bounce, F = b ? r.contact.softEl : r.contact.soft;
    let J;
    if (r.held) J = b ? r.h.el.pT : r.h.inel.pT;
    else if (r.partial) J = r.partial.Jearth;
    else J = 0;
    show(lbl + ' J=' + f(J) + ' T=' + f(F.t), J > 0 ? imp(sf, J, F.t) : null);
    if (r.held) console.log('    quakeHeld (all of Q) M', f(r.quakeHeld), ' Q', f(r.Q), ' seismic 1e-4 Q =', f(1e-4 * r.Q), 'J');
  }
}
