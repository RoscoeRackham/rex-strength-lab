const {open}=require('./pg.js');
(async()=>{
  const {browser,page,load,pick,text,errs}=await open();
  const rd=()=>page.evaluate(()=>{const b=document.getElementById('duo-bay');return (b.querySelector('.effort-read')||{}).textContent.replace(/\s+/g,' ')+' || VERDICT: '+((b.querySelector('.verdict')||{}).textContent||'').replace(/\s+/g,' ');});
  for (const [logKg, a] of [[16,0],[16,0.5],[13,0],[13,0.5]]) for (const e of ['windows','houses']) {
    await load({duoOpen:true,duoAction:'catch',cObj:'partner',cStyle:'hard',logKg,airAbsorb:a,mode:'comic'});
    await pick('#duo-effort',e);
    console.log('logKg',logKg,'share',a,e,'::',(await rd()).slice(0,400));
  }
  console.log('errs',errs);
  await browser.close();
})();
