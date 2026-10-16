const { P, D, ctx } = require('./eng.js');
const kg = 90718.474;
const objs = P.CATCH_OBJECTS || D.catchObjects || D.objects;
console.log(Object.keys(P).filter(k=>/catch/i.test(k)));
