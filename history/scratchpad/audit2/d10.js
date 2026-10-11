global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const rows = D.sourceRows;
console.log('rows', rows.length);
const pats = [/231/, /474/, /20 ton/i, /log.?press/i, /2007/, /Bj[öo]rnsson/i, /vmax|Hill|top running|forceFrac/i, /Cd|drag/i, /frontal|0\.8 m/i, /Poncelet/i, /2\.5/, /whip|0\.3%/i, /stance/i];
for (const p of pats) {
  const hits = rows.filter(r => p.test(JSON.stringify(r)));
  console.log(String(p), hits.length, hits.map(r => r.label + ' => ' + r.value).slice(0,6));
}
console.log('tiers notes:'); for (const t of D.tiers) console.log(t.id, '|', t.note);
console.log('feats:'); for (const f of D.feats) if (/231|474|2007|20 tons/.test(JSON.stringify(f))) console.log(JSON.stringify(f));
