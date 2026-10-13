global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA;
for (const r of D.sourceRows) if (/krakatoa|chicxulub|dinosaur|asteroid|Sun|grenade|pitch|baseball|Corolla|binding|Hiroshima|Tsar|Bravo|TNT/i.test(r.label + r.value) && !/^Energy:/.test(r.label)) console.log(`[${r.status}] ${r.label}\n   ${r.value}\n   ${r.sources.map(s=>s.title).join(' | ')}`);
