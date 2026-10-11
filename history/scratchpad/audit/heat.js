global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const surf=D.surfaces.find(s=>s.id==='concrete');
const src=require('fs').readFileSync('/home/user/dino-strength-sim/src/engine.js','utf8');
const m=src.match(/function catchGame\(([^)]*)\)/); console.log('catchGame sig', m&&m[1]);
const m2=src.match(/function catchLeg\(([^)]*)\)/); console.log('catchLeg sig', m2&&m2[1]);
