const { P, D, g, rex, ollie, surf, ON, OFF, ctx, DIAL } = require('./env.js');
const sig = (x, n = 3) => typeof x === 'number' ? (isFinite(x) ? Number(x.toPrecision(n)) : String(x)) : x;
const pick = (o, keys) => { const r = {}; for (const k of keys) if (o && o[k] !== undefined) r[k] = typeof o[k] === 'object' && o[k] ? JSON.stringify(o[k], (kk, v) => typeof v === 'number' ? sig(v) : v).slice(0, 200) : sig(o[k]); return r; };
const STR = [['least', 2570], ['dial', DIAL], ['1e9', 1e9], ['inf', Infinity]];
const ANC = [['ff', 'friction', 'friction'], ['bf', 'bolted', 'friction'], ['fb', 'friction', 'bolted'], ['bb', 'bolted', 'bolted']];
const which = process.argv[2];
for (const [pw, PW] of [['ON', ON], ['OFF', OFF]]) for (const [sn, kg] of STR) for (const [an, aR, aO] of ANC) {
  const cR = ctx(kg, rex, Object.assign({ anchor: aR }, PW)), cO = ctx(kg, ollie, Object.assign({ anchor: aO }, PW, { noKnockback: PW.noKnockback }));
  let r;
  try {
    if (which === 'arm') { r = P.armWrestle(cR, cO); console.log(pw, sn, an, JSON.stringify(pick(r, ['outcome', 'clash', 'oneSided', 'tableBreaks', 'tableBreaksBy', 'padLoad', 'AA', 'AB', 'contact', 'loserSlides', 'winnerSlides', 'draggedA', 'draggedB', 'tearA', 'tearB', 'winner']))); }
    if (which === 'armK') { const cR2 = Object.assign({}, cR, { keepForm: false }), cO2 = Object.assign({}, cO, { keepForm: false }); r = P.armWrestle(cR2, cO2); console.log(pw, sn, an, JSON.stringify(pick(r, ['outcome', 'clash', 'oneSided', 'tableBreaks', 'tableBreaksBy', 'padLoad', 'AA', 'AB', 'contact', 'loserSlides', 'winnerSlides', 'draggedA', 'draggedB', 'tearA', 'tearB', 'winner', 'pin']))); }
    if (which === 'push') { r = P.pushMatch(cR, cO); console.log(pw, sn, an, JSON.stringify(pick(r, ['outcome', 'clash', 'oneSided', 'DA', 'DB', 'HA', 'HB', 'vA', 'vB', 'slideA', 'slideB', 'winner', 'contact', 'tornA', 'tornB', 'footA', 'footB', 'recoilAbsorbedA', 'recoilAbsorbedB', 'accel', 'tear']))); }
    if (which === 'shove') { r = P.shove(cR, cO); console.log(pw, sn, an, JSON.stringify(pick(r, ['clash', 'oneSided', 'vA', 'vB', 'slideA', 'slideB', 'stalled', 'toGround', 'toGroundB', 'recoilAbsorbed', 'tearB']))); }
    if (which === 'both') { r = P.shoveBoth(cR, cO); console.log(pw, sn, an, JSON.stringify(pick(r, ['clash', 'oneSided', 'shover', 'both', 'vA', 'vB', 'slideA', 'slideB', 'stalled', 'toGround', 'toGroundA', 'toGroundB', 'tearA', 'tearB']))); }
    if (which === 'standoff') { r = P.standoff(cO, cR); console.log(pw, sn, an, JSON.stringify(pick(r, ['outcome', 'clash', 'oneSided', 'DA', 'HB', 'contact', 'net', 'pusherSlips', 'tearB', 'rock']))); }
    if (which === 'collide' || which === 'collideB' || which === 'collideJ') {
      const src = which === 'collideJ' ? 'jump' : 'sprint';
      r = P.collide(cO, cR, { source: src, gb: 100 / 299792458, bounce: which === 'collideB' });
      console.log(pw, sn, an, JSON.stringify(pick(r, ['outcome', 'heldBy', 'v0', 'carry', 'hitAbsorbed', 'toGround', 'Elocal']))); }
  } catch (e) { console.log(pw, sn, an, 'ERROR', e.message); }
}
