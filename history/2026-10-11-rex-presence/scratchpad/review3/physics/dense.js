const {P,D,g,surf,obj,rex,ollie,ctxOf}=require('./ph.js');
const R=P.RESTRAINT;
function check(mv, c, o, label, ppd=8){
  const p=R.planNow(mv,c,o); const M=R.MOVES[mv]; const opt=p.opt;
  const lo=p.lo, hi=p.hi; const n=Math.ceil(ppd*Math.log10(hi/lo));
  const pts=[]; for(let k=0;k<=n;k++) pts.push(lo*Math.pow(hi/lo,k/n));
  const out=[];
  const runAt=(u)=>M.run(Object.assign({},c,{use:u}),opt);
  const rs=pts.map(u=>[u,runAt(u)]);
  // goal
  const gl=p.goal();
  const firstGoal=rs.find(([u,r])=>M.goal(r,opt));
  const gUse = gl.reached? gl.use : Infinity;
  if(firstGoal && firstGoal[0] < gUse*0.98) out.push('GOAL missed: search '+(gUse/g).toExponential(3)+' dense first '+(firstGoal[0]/g).toExponential(3));
  if(!firstGoal && gl.reached) out.push('GOAL dense none but search '+(gl.use/g).toExponential(3));
  for(const h of R.HAZARDS){
    const res=p.result('hazard:'+h.id);
    const first=rs.find(([u,r])=>h.test(M,r,opt));
    const sUse = res.never? Infinity : res.use;
    if(first && first[0] < sUse*0.98) out.push('HAZ '+h.id+' missed: search '+(res.never?'never':(sUse/g).toExponential(3))+(res.onlyUnlimited?'(onlyUnl)':'')+' dense first '+(first[0]/g).toExponential(3));
  }
  for(const h of R.PRESETS){
    const res=p.result('preset:'+h.id);
    const first=rs.find(([u,r])=>h.test(M,r,opt));
    const sUse = res.never? Infinity : res.use;
    if(first && first[0] < sUse*0.98) out.push('PRESET '+h.id+' missed: search '+(res.never?'never':(sUse/g).toExponential(3))+' dense first '+(first[0]/g).toExponential(3));
  }
  console.log((out.length?'** ':'ok ')+label+(out.length?'\n    '+out.join('\n    '):''));
  return out;
}
module.exports={check};
if(require.main===module && !process.env.NOMAIN){
  const bodies={rex, calib:P.makeBody({}), big:P.makeBody({build:'rex',H:50,m:3007*Math.pow(50/3.048,3)})};
  const Fs=[1e4,1e6,9.07e4,1e8,1e10,Infinity];
  const objs=['piano','shot','car','person','bus','semi','tank','loco','baseball'];
  const args=process.argv.slice(2);
  const mvs = args.length?args:['throw'];
  for(const mv of mvs) for(const bn of Object.keys(bodies)) for(const mode of ['real','comic']) for(const sid of ['concrete','sand','granite']) for(const Fk of Fs){
    const c={F:Fk*g, mode, body:bodies[bn], surface:surf(sid), groundHolds:false, anchor:'friction'};
    if(mv==='throw'){ for(const oid of objs) { try{check(mv,c,{obj:obj(oid),angle:45,target:30}, [mv,bn,mode,sid,Fk,oid].join(' '),6);}catch(e){console.log('ERR',mv,bn,mode,sid,Fk,oid,e.message)} } }
    else { const o = mv==='jump'?{target:3}: mv==='punch'?{target:10.4}: mv==='clap'?{target:6}: mv==='sprint'?{target:12.42}: mv==='pull'?{obj:obj('bus'),target:10}:{}; try{check(mv,c,o,[mv,bn,mode,sid,Fk].join(' '),6);}catch(e){console.log('ERR',mv,bn,mode,sid,Fk,e.message)} }
  }
}
