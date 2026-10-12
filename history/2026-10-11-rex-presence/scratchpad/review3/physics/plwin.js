const {P,g,surf,obj,rex}=require('./ph.js');
const M=P.RESTRAINT.MOVES;
function scan(mv, c, o, lo, hi, n){
  const p=P.RESTRAINT.planNow(mv,c,o); const opt=p.opt;
  const res=p.result('hazard:plaster'), pre=p.result('preset:plaster');
  let prev=null, segs=[];
  for(let k=0;k<=n;k++){const u=lo*Math.pow(hi/lo,k/n)*g; const r=M[mv].run(Object.assign({},c,{use:u}),opt); const sh=M[mv].shake(r,opt); const on=P.plasterOver(sh,opt.near);
    const list=(Array.isArray(sh)?sh:[sh]).filter(Boolean); const info=list.map(x=>(P.ppvAt(x,opt.near)*1e3).toFixed(1)+'mm/s@'+(x.kind==='ramp'?1/(2*x.tau):1/x.T).toFixed(0)+'Hz').join(' ');
    if(on!==prev){segs.push((on?'ON ':'off')+' from '+(u/g).toExponential(2)+' kg  '+info); prev=on;}}
  console.log(mv, c.body.H, c.surface.id, (c.F/g).toExponential(1), o.obj?o.obj.id:'', '| search plaster hazard:', res.never?'never':(res.use/g).toExponential(2), '| preset:', pre.never?'never':(pre.use/g).toExponential(2), '| ceiling', p.ceiling().by, (p.ceiling().below/g).toExponential(2));
  segs.forEach(s=>console.log('   ',s));
}
for (const sid of ['concrete','sand','granite']) scan('jump',{F:1e8*g,mode:'comic',body:rex,surface:surf(sid),groundHolds:false,anchor:'friction'},{target:3},30,1e8,600);
scan('jump',{F:1e8*g,mode:'comic',body:rex,surface:surf('concrete'),groundHolds:true,anchor:'friction'},{target:3},30,1e8,600);
for (const oid of ['car','shot','bowling','piano','person']) scan('throw',{F:1e8*g,mode:'comic',body:rex,surface:surf('concrete'),groundHolds:false,anchor:'friction'},{obj:obj(oid),angle:45,target:30},30,1e8,400);
