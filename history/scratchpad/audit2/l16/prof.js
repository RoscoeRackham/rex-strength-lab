global.window = {}; const P0 = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const P = window.DinoPhys || P0, D = window.DINO_DATA, g = P.K.g;
const base = { mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s=>s.id==='concrete'), groundHolds: false, anchor: 'friction' };
for (let k=0;k<30;k++) for (let e=1;e<34;e+=1.5) P.stomp(Object.assign({}, base, {F: Math.pow(10,e)*g}));
