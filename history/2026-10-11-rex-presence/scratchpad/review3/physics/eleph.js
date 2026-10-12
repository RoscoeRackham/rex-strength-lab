const {P,D,g,surf,obj,rex,ollie}=require('./ph.js');
const sandSf=surf('sand'), firm=Object.assign({},sandSf,{id:'firmsand'});
for (const pace of ['stroll','walk','brisk','fast']) for (const e of [0,0.25,0.5,0.75,1]) {
  const row=[];
  for (const d of [5,10,20,40,60,80,100]) {
    const lo=P.presence(rex,firm,{pace,effort:e}).ppv(d)/P.elephantPPV(d), hi=P.presence(rex,sandSf,{pace,effort:e}).ppv(d)/P.elephantPPV(d);
    row.push(d+':'+lo.toPrecision(2)+'/'+hi.toPrecision(2)+(lo>hi?'!':''));
  }
  console.log(pace,e,row.join(' '));
}
