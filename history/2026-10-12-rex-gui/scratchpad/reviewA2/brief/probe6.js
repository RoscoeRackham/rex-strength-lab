const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path=require('path');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1280,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve('branch.html'));
  const dupsAll=new Set();
  const duoVariants=[{duoAction:'arm'},{duoAction:'wrestle',wrestleMove:'push'},{duoAction:'wrestle',wrestleMove:'shove'},{duoAction:'wrestle',wrestleMove:'lift'},{duoAction:'wrestle',wrestleMove:'throw'},{duoAction:'catch'},{duoAction:'catch',cObj:'partner'},{duoAction:'collide',colMode:'charge'},{duoAction:'collide',colMode:'push'}];
  for (const dv of duoVariants) {
    await p.evaluate(s=>localStorage.setItem('rex-lab-v1',JSON.stringify(s)),Object.assign({duoOpen:true,anchor:'bolted'},dv));
    await p.reload(); await p.waitForTimeout(1200);
    for (const t of ['walk','lift','throw','jump','stomp','punch','clap','sprint','pull','weight']) {
      await p.click('#tab-'+t); await p.waitForTimeout(150);
      // open all Adjust effort details in both bays to render everything
      await p.evaluate(()=>document.querySelectorAll('details.effort-adjust').forEach(d=>d.open=true));
      await p.waitForTimeout(100);
      const r=await p.evaluate(()=>{const seen={}; for(const n of document.querySelectorAll('[id]')) seen[n.id]=(seen[n.id]||0)+1; const d=Object.keys(seen).filter(k=>seen[k]>1);
        const unl=Array.from(document.querySelectorAll('#bay input, #bay select, #duo-bay input, #duo-bay select')).filter(n=>n.type!=='hidden' && !(n.labels&&n.labels.length) && !n.getAttribute('aria-label') && !n.getAttribute('aria-labelledby')).map(n=>n.id||n.outerHTML.slice(0,60));
        const badLab=Array.from(document.querySelectorAll('label[for]')).filter(l=>{const t=document.getElementById(l.htmlFor); return !t || (l.closest('#bay')&&!t.closest('#bay')) || (l.closest('#duo-bay')&&!t.closest('#duo-bay'));}).map(l=>l.htmlFor);
        return {d,unl,badLab};});
      if (r.d.length||r.unl.length||r.badLab.length) console.log(JSON.stringify(dv), t, JSON.stringify(r));
    }
  }
  console.log('done errs',errs);
  await b.close();
})();
