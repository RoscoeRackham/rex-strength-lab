global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
console.log(Object.keys(D));
for (const o of D.objects) console.log(JSON.stringify(o).slice(0,300));
