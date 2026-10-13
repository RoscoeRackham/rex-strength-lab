global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA;
const keys = Object.keys(D); 
const rows = D.sourcesTable || D.sources || D.sourceRows;
console.log(keys.filter(k=>/source/i.test(k)));
const s = JSON.stringify(D);
let re = /AJ 152/g, m; while ((m = re.exec(s))) console.log('...', s.slice(m.index-700, m.index+120).replace(/\\n/g,' '), '\n');
