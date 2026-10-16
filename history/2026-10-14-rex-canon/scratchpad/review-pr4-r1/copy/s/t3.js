const {P,D,g,ctx}=require('./eng.js');
const DIAL=90718.474;
const cR=ctx('rex',DIAL), cO=ctx('ollie',DIAL,{anchor:'bolted'});
const r=P.shoveBoth(cR,cO);
const pick=(x)=>{const o={};for(const k of ['shover','both','Fdrive','vA','vB','slideA','slideB','EA','EB','stalled','clash','basis','mode']) o[k]=x[k];return o;};
console.log(JSON.stringify(pick(r)));
console.log('back', r.back && JSON.stringify(pick(r.back)));
const r2=P.shoveBoth(cR,ctx('ollie',DIAL));
console.log(JSON.stringify(pick(r2)), r2.back&&JSON.stringify(pick(r2.back)));
