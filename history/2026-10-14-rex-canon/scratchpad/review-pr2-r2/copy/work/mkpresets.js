const fs=require('fs');
const out=[];
const add=(id,state,effort)=>out.push({id,state:Object.assign({saveV:2},state),effort});
for (const e of ['rattle','plaster','ground']) {
  for (const t of ['throw','stomp','punch','pull']) add('def|'+t+'|'+e,{action:t},e);
  add('def|throw-semi9|'+e,{action:'throw',obj:'semi',angle:0,logKg:9},e);
  add('def|throw-car45-9|'+e,{action:'throw',obj:'car',angle:45,logKg:9},e);
  add('recOff|throw-car45-9|'+e,{action:'throw',obj:'car',angle:45,logKg:9,ownRecoil:false},e);
  add('def|throw-loco9|'+e,{action:'throw',obj:'locomotive',angle:0,logKg:9},e);
  add('def|throw-semi30-6|'+e,{action:'throw',obj:'semi',angle:30,logKg:6},e);
  add('def|shove8|'+e,{duoOpen:true,duoAction:'wrestle',wrestleMove:'shove',logKg:8},e);
  add('def|wthrow9|'+e,{duoOpen:true,duoAction:'wrestle',wrestleMove:'throw',logKg:9},e);
  add('def|catchcar9|'+e,{duoOpen:true,duoAction:'catch',cObj:'car',cStyle:'hard',logKg:9},e);
  add('def|toss9|'+e,{duoOpen:true,duoAction:'catch',cObj:'partner',logKg:9},e);
  add('def|arm12|'+e,{duoOpen:true,duoAction:'arm',logKg:12},e);
}
fs.writeFileSync('cases-presets.json',JSON.stringify(out));console.log(out.length);
