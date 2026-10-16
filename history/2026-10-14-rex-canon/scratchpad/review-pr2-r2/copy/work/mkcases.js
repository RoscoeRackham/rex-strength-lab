const fs=require('fs');
const OFF={airAbsorb:0,keepForm:false,unbreakable:false,ownRecoil:false};
const CFG={def:{},bolted:{anchor:'bolted',oAnchor:'bolted'},recOff:{ownRecoil:false},unbOff:{unbreakable:false},off:OFF,offBolted:Object.assign({anchor:'bolted',oAnchor:'bolted'},OFF),recOffBolted:{ownRecoil:false,anchor:'bolted',oAnchor:'bolted'}};
const VIEWS=[];
for(const t of ['walk','lift','throw','jump','stomp','punch','clap','sprint','pull','weight'])VIEWS.push([t,{action:t}]);
VIEWS.push(['arm',{duoOpen:true,duoAction:'arm'}]);
for(const m of ['push','shove','lift','throw'])VIEWS.push(['wr-'+m,{duoOpen:true,duoAction:'wrestle',wrestleMove:m}]);
VIEWS.push(['wr-shove-both',{duoOpen:true,duoAction:'wrestle',wrestleMove:'shove',wrestleWho:'both'}]);
VIEWS.push(['catch-ball',{duoOpen:true,duoAction:'catch'}]);
VIEWS.push(['catch-hard',{duoOpen:true,duoAction:'catch',cStyle:'hard'}]);
VIEWS.push(['catch-partner',{duoOpen:true,duoAction:'catch',cObj:'partner'}]);
VIEWS.push(['catch-bus',{duoOpen:true,duoAction:'catch',cObj:'bus',cStyle:'hard'}]);
VIEWS.push(['collide',{duoOpen:true,duoAction:'collide'}]);
const which=process.argv[2]||'all', cfgs=(process.argv[3]||Object.keys(CFG).join(',')).split(',');
const out=[];
for(const c of cfgs)for(const [v,s] of VIEWS)for(const e of ['least','allout']){const st=Object.assign({saveV:2},s,CFG[c]);out.push({id:c+'|'+v+'|'+e,state:st,effort:e==='least'?undefined:e});}
fs.writeFileSync(process.argv[4]||'cases.json',JSON.stringify(out));console.log(out.length);
