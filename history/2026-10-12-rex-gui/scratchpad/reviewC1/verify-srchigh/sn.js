global.window = {};
const base = process.argv[2];
require(base + '/src/data.js');
const D = window.DINO_DATA;
const L = require(base + '/src/ladder.js');
const refs = D.energyRefs;
for (const r of refs) if (/supernova|Pluto|Mars|Earth apart|1998|hurricane/.test(r.short)) console.log(JSON.stringify({id:r.id,short:r.short,J:r.J,rough:r.rough,key:r.key}));
for (const J of [3.6e43, 6.8e43, 1e44, 1.2e44, 2e44, 5e44, 1.6e28, 1e31, 1e32]) {
  const c = L.compare(J, refs); console.log(J.toExponential(2), c.kind, c.ref && c.ref.key, '|', c.text);
}
