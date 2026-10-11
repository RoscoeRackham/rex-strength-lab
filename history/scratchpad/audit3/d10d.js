global.window = {};
require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const s = JSON.stringify(D.sourceRows)+JSON.stringify(D.assumptions);
for (const k of ['release','0.9','2.5','0.3 m','stance','whip']) { let i=-1; const hits=[]; while((i=s.indexOf(k,i+1))>=0 && hits.length<3) hits.push(s.slice(Math.max(0,i-60),i+60)); console.log('==',k,hits); }
