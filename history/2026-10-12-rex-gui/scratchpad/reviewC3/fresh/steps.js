global.window = {}; require(process.argv[2] + '/src/data.js'); const D = window.DINO_DATA;
const L = require(process.argv[2] + '/src/ladder.js');
const r = D.energyRefs.slice().sort((a, b) => a.J - b.J);
const steps = r.slice(1).map((x, i) => [x.J / r[i].J, r[i].id + '->' + x.id]).sort((a, b) => b[0] - a[0]);
console.log(steps.slice(0, 8).map((s) => s[0].toFixed(1) + ' ' + s[1]).join('\n'));
// every comparison wording at fine steps: check for oddities
const seen = {};
for (let lg = -1; lg <= 49; lg += 0.002) { const c = L.compare(Math.pow(10, lg), D.energyRefs); const k = c.text.replace(/[\d.]+/, '#'); if (!seen[k]) seen[k] = []; seen[k].push(c.text.match(/^[^a-z]*[\d.]+/) ? c.text.match(/[\d.]+/)[0] : ''); }
// figures used per rung
for (const [k, v] of Object.entries(seen)) { const u = [...new Set(v)]; if (u.some((x) => x === '10' || x === '100' || x === '1')) console.log('ODD', k, u.join(',')); }
console.log(Object.keys(seen).length, 'wordings');
