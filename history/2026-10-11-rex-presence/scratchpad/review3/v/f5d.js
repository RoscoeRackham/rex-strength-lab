const {open}=require('./lib');
(async()=>{
  const {browser,page,errs}=await open(1280,900,'light',{inf:true,mode:'real',action:'throw',obj:'car'});
  const ids=await page.evaluate(()=>[...document.querySelectorAll('#bay select')].map(s=>s.id));
  console.log('selects',ids);
  for (const o of ['piano','tank','bus']) {
    await page.evaluate((o)=>{const s=document.querySelector('#obj'); s.value=o; s.dispatchEvent(new Event('change',{bubbles:true}));},o);
    const r=await page.evaluate(()=>{const w=/working it out|Working out/i.test(document.querySelector('#bay').textContent);
      const s=[...document.querySelectorAll('#bay summary')].find(x=>/Show the math/.test(x.textContent)); if(s) s.focus(); return {w, f: document.activeElement.textContent.slice(0,25)}});
    await page.waitForTimeout(6000);
    const post=await page.evaluate(()=>{const a=document.activeElement; return a===document.body?'BODY (focus lost)':a.tagName+':'+a.textContent.slice(0,20)});
    console.log(o, JSON.stringify(r), '=>', post);
  }
  await browser.close();
})();
