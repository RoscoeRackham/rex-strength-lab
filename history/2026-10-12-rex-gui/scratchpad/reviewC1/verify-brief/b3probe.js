global.window={}; const R=process.argv[2]; require(R+'/src/data.js'); const L=require(R+'/src/ladder.js'); const D=window.DINO_DATA;
for (const J of [1.3e23, 1.19e14, 3.3e13, 1.8e9]) console.log(J, L.compare(J, D.energyRefs).text);
