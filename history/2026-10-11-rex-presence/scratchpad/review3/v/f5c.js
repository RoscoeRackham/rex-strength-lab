const {open}=require('./lib');
(async()=>{
  const {browser,page,errs}=await open(1280,900,'light',{inf:true,mode:'real',action:'throw',obj:'car'});
  for (const pre of ['block','houses','windows','plaster']) {
    await page.selectOption('#effort', pre);
    const r=await page.evaluate(()=>{const w=/working it out|Working out/i.test(document.querySelector('#bay').textContent);
      const s=[...document.querySelectorAll('#bay summary')].find(x=>/Show the math|Where each|Hazards/.test(x.textContent)); if(s) s.focus(); return {w, f: document.activeElement.textContent.slice(0,25)}});
    let t=0; while(t<10000){ const w=await page.evaluate(()=>/working it out|Working out/i.test(document.querySelector('#bay').textContent)); if(!w) break; await page.waitForTimeout(200); t+=200; }
    await page.waitForTimeout(400);
    const post=await page.evaluate(()=>{const a=document.activeElement; return a===document.body?'BODY (focus lost)':a.tagName+':'+a.textContent.slice(0,20)});
    console.log(pre, JSON.stringify(r), 'waited', t, '=>', post);
    if (r.w) break;
  }
  await browser.close();
})();
