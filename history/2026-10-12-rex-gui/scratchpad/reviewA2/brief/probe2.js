const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path=require('path');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1280,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file://'+path.resolve('branch.html'));
  const hits={};
  const RE=/[^.]{0,80}(dug|claw|braced|shear|Settings|Comic switch|Ollie panel|sidebar|Rex alone|holds his ground|dig)[^.]{0,80}/gi;
  for (const [a,o,wm] of [['friction','friction','push'],['bolted','friction','lift'],['friction','bolted','lift'],['bolted','bolted','shove'],['friction','friction','throw']]) {
    await p.evaluate(s=>localStorage.setItem('rex-lab-v1',JSON.stringify(s)),{anchor:a,oAnchor:o,duoOpen:true,wrestleMove:wm,surface:'sand'});
    await p.reload(); await p.waitForTimeout(1000);
    for (const t of ['walk','lift','throw','jump','stomp','punch','clap','sprint','pull','weight']) { await p.click('#tab-'+t); await p.waitForTimeout(250);
      const txt=await p.evaluate(()=>document.getElementById('bay').textContent);
      for (const m of txt.match(RE)||[]) { const k=m.trim(); (hits[k]=hits[k]||new Set()).add(t+'/'+a+'/'+o); } }
    for (const t of ['arm','wrestle','catch','collide']) { await p.click('#tab-'+t); await p.waitForTimeout(1500);
      const txt=await p.evaluate(()=>document.getElementById('duo-bay').textContent);
      for (const m of txt.match(RE)||[]) { const k=m.trim(); (hits[k]=hits[k]||new Set()).add(t+'/'+a+'/'+o+'/'+wm); } }
  }
  const rest=await p.evaluate(()=>{ const t=[]; for (const id of ['src-table','model']) { const n=document.getElementById(id); if(n) t.push(n.textContent);} return document.body.textContent; });
  for (const m of rest.match(RE)||[]) { const k=m.trim(); (hits[k]=hits[k]||new Set()).add('page'); }
  for (const [k,v] of Object.entries(hits)) console.log(JSON.stringify(k), '<=', [...v].slice(0,4).join(' '));
  console.log('errs',errs);
  await b.close();
})();
