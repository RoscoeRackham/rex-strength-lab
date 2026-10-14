global.window = {};
const P = require('./head/engine.js'); require('./head/data.js'); const D = window.DINO_DATA;
const g = 9.80665;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const R = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({ H: 3.048, m: 3007, build: 'rex' }), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
const O = (o) => Object.assign(R(), { body: P.makeBody({ H: 3.048, m: 3007, build: 'ollie' }) }, o || {});
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
for (const [lbl, cA, cB, opt] of [
  ['sprint splat friction', O(), R(), { source: 'sprint' }],
  ['sprint splat Rex bolted', O(), R({ anchor: 'bolted' }), { source: 'sprint' }],
  ['sprint bounce Rex bolted', O(), R({ anchor: 'bolted' }), { source: 'sprint', bounce: true }],
  ['sprint splat gh both', O({ groundHolds: true }), R({ groundHolds: true }), { source: 'sprint' }],
  ['sprint splat imm', O(), R({ immovable: true }), { source: 'sprint' }],
  ['jump splat friction', O(), R(), { source: 'jump' }],
  ['jump splat gh', O({ groundHolds: true }), R({ groundHolds: true }), { source: 'jump' }],
  ['stomp splat', O(), R(), { source: 'stomp' }],
  ['set 0.001c bolted', O(), R({ anchor: 'bolted' }), { source: 'set', gb: 1e-3 }],
  ['set 1000 m/s bolted gh', O({ groundHolds: true }), R({ anchor: 'bolted', groundHolds: true }), { source: 'set', gb: 1000 / 299792458 }],
]) {
  const r = P.collide(cA, cB, opt);
  const h = r.h || {};
  const sp = r.contact ? r.contact.soft : null, se = r.contact ? r.contact.softEl : null;
  console.log(lbl, '| outcome', r.outcome, 'held', r.held, 'v0', fmt(r.v0), 'pA', fmt(r.pA), 'Q', fmt(r.Q), 'quakeHeld', fmt(r.quakeHeld), 'inel.pT', fmt(h.inel && h.inel.pT), 'el.pT', fmt(h.el && h.el.pT), 'soft F,t', sp && fmt(sp.F), sp && fmt(sp.t), 'softEl F,t', se && fmt(se.F), se && fmt(se.t), 'partial', r.partial ? JSON.stringify(Object.fromEntries(Object.entries(r.partial).map(([k, v]) => [k, fmt(v)]))) : '-', 'after', JSON.stringify(r.after), 'hold', r.hold && r.hold.why, fmt(r.hold && r.hold.H));
}
