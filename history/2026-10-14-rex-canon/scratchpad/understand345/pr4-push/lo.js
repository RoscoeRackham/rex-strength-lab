const { P, g, ON, DIAL, pair, sig, rex, ollie, surf } = require('./common.js');
const need = (m) => P.W8.WALK_LOAD * m * g / P.MUSCLE.jump.forceFrac;
console.log('WALK_LOAD', P.W8.WALK_LOAD, 'jump.forceFrac', P.MUSCLE.jump.forceFrac, 'lo N', need(3000), 'lo kgf', need(3000) / g);
for (const sid of ['concrete', 'sand', 'granite', 'softclay', 'ice', 'steel', 'gravel', 'stiffclay', 'asphalt']) { const s = surf(sid); if (!s) continue; const [cR] = pair(DIAL, Object.assign({}, ON, { surface: s })); cR.surface = s; const r = P.pushMatch(cR, Object.assign({}, cR, { body: ollie })); console.log(sid, 'grip', sig(r.holdA), 'lo/grip', sig(need(3000) / r.holdA)); }
console.log('surfaces', window.DINO_DATA.surfaces.map((s) => s.id).join(','));
console.log('strokes', JSON.stringify(rex.strokes), 'handEff', rex.handEff);
