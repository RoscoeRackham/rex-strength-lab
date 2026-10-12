const {P,D,g,surf,obj,rex}=require('./ph.js');
const {check}=require('./dense.js');
const bodies={rex, calib:P.makeBody({})};
const mv=process.argv[2];
for (const bn of Object.keys(bodies)) for (const mode of ['real','comic']) for (const sid of ['softclay','ice','gravel','steel']) for (const Fk of [9.07e4,1e7,Infinity]) {
  const c={F:Fk*g, mode, body:bodies[bn], surface:surf(sid), groundHolds:false, anchor:'friction'};
  if (mv==='throw') { for (const oid of ['car','shot','person','bus','piano']) { try{check(mv,c,{obj:obj(oid),angle:45,target:30},[mv,bn,mode,sid,Fk,oid].join(' '),6);}catch(e){console.log('ERR',e.message)} } }
  else { const o = mv==='jump'?{target:3}:{}; try{check(mv,c,o,[mv,bn,mode,sid,Fk].join(' '),6);}catch(e){console.log('ERR',e.message)} }
}
// also near distances for jump/stomp on concrete with Rex
if (mv!=='throw') for (const near of [1,2,10,50]) for (const mode of ['comic','real']) { const c={F:1e7*g,mode,body:rex,surface:surf('concrete'),groundHolds:false,anchor:'friction'}; check(mv,c,mv==='jump'?{target:3,near}:{near},[mv,'rex',mode,'concrete near',near].join(' '),6); }
console.log('DONE');
