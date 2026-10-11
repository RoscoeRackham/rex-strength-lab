const fs=require('fs');const path=require('path');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{
 const page=fs.readFileSync('/home/user/rex-strength-lab/build-comparison/dist/index.html','utf8');
 const sk='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+page+'</body></html>';
 const f=path.join(__dirname,'page.html');fs.writeFileSync(f,sk);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1280,height:900}});
 await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
 await p.goto('file://'+f);await p.waitForTimeout(800);
 const out=await p.evaluate(()=>{const L=window.__bc.LIST;return L.filter(x=>/^(rex|ollie|juggernaut|mr_america_1938_1954_mean|steve_reeves_1947)$/.test(x.id)).map(x=>({id:x.id,height:x.height,mass:x.mass,bodyFat:x.bodyFat,score:x.score,plain:x.plain,setting:x.setting}))});
 console.log(JSON.stringify(out,null,1));
 const keys=await p.evaluate(()=>Object.keys(window.__bc.LIST[0]));console.log(keys);
 await b.close();})();
