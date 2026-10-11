const fs=require('fs');
global.window = {};
const P = require('./engine_fix.js');
eval(fs.readFileSync('/home/user/dino-strength-sim/src/data.js','utf8'));
const D = window.DINO_DATA;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const mk = (F) => ({ F, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' });
for (const kg of [1e30, 1e34, Infinity]) {
  const c = mk(kg * P.K.g);
  console.log('kg', kg, 'punch lurch', P.punch(c).lurch.toFixed(4), 'jump sink', P.jump(c).sink.toFixed(4));
}
