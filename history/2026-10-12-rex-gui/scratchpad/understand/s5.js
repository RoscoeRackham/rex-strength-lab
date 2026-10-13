global.window={};
const A=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const B=require('./engine-calfalse.js');
for (const k of ['throwPush','throwWhip','punch','clap','jump','stomp']) console.log(k, A.MUSCLE[k].comicFrac.toPrecision(15), B.MUSCLE[k].comicFrac.toPrecision(15), A.MUSCLE[k].comicFrac===B.MUSCLE[k].comicFrac ? 'same':'DIFFERENT');
