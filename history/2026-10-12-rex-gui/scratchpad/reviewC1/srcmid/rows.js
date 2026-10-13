global.window = {};
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const rows = D.sources || D.rows || D.sourceRows;
console.log(Object.keys(D).join(' '));
const R = rows.filter(r => /^Energy: /.test(r.label));
for (const r of R) if (/Hubble|Beirut|Space Station|Hiroshima|Chelyabinsk|Hoover|Bravo|Tsar|Krakatoa|World primary|hurricane|Sunlight|Chicxulub|solar luminosity/i.test(r.label)) console.log(r.status,'|',r.label,'|',r.value,'|',r.sources.map(s=>s.title.slice(0,60)+' <'+s.url+'>').join(' ; '));
