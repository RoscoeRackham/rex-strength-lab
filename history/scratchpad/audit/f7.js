global.window={};
const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
console.log(Object.keys(P).filter(k=>/phi|prem/i.test(k)));
const G=6.674e-11, ME=5.972e24, RE=6.371e6;
console.log('GM/R', G*ME/RE);
