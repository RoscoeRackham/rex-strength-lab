global.window = {}; require(process.argv[2] + '/src/data.js'); const D = window.DINO_DATA;
for (const r of D.energyRefs) console.log(r.id.padEnd(14), r.J.toExponential(3).padEnd(11), r.rough ? 'ROUGH' : '     ', r.short);
