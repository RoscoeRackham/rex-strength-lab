const path = process.argv[2];
const P = require(path); global.window = {}; require(process.argv[3]); const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const ollie = P.makeBody({ build: 'ollie', ...(P.DEFAULT_BODIES.ollie||P.DEFAULT_BODIES.rex) });
const surf = D.surfaces.find(s => s.id === 'concrete');
const base = { F: Infinity, mode: 'comic', surface: surf, airAbsorb: 1, keepForm: true, unbreakable: false, ownRecoil: true };
for (const [lab, ra, ob] of [['RexOwnRecoil friction, Ollie bolted, unbreak off',{},{}], ['Rex ownRecoil off', {ownRecoil:false},{ownRecoil:false}], ['unbreak on', {unbreakable:true},{unbreakable:true}], ['Ollie unbreak only', {}, {unbreakable:true}]]) {
 const cA = { ...base, body: rex, anchor: 'friction', ...ra };
 const cB = { ...base, body: ollie, anchor: 'bolted', ...ob };
 const r = P.shove(cA, cB);
 const pick = o => ({ clash: o.clash, tearA: o.tearA, tearB: o.tearB, vA: o.vA, vB: o.vB, slideA: o.slideA, slideB: o.slideB, stalled: o.stalled, recoilAbsorbed: o.recoilAbsorbed, toGround: o.toGround, toGroundB: o.toGroundB, basis: o.basis });
 console.log(lab, JSON.stringify(pick(r)));
 const r2 = P.shoveBoth(cA, cB); console.log('  both', JSON.stringify(pick(r2)), r2.shover);
}
