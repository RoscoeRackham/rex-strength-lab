const {open}=require('./lib');
(async()=>{
  const {browser,page,errs}=await open(1280,900);
  const res=[];
  for (const [grp,tab] of [['solo','throw'],['solo','punch'],['solo','stomp'],['solo','jump'],['duo','arm'],['duo','collide']]) {
    await page.click('#grp-'+grp); await page.click('#tab-'+tab); await page.waitForTimeout(grp==='duo'?2500:800);
    const id = grp==='duo' ? '#duo-effort-use' : '#effort-use';
    await page.evaluate(()=>document.querySelectorAll('details.effort-adjust, details').forEach(d=>{ if(d.querySelector('#effort-use,#duo-effort-use')) d.open=true; }));
    await page.waitForTimeout(200);
    const has = await page.$(id); if(!has){res.push(tab+' no slider'); continue;}
    await page.focus(id); await page.keyboard.press('End'); await page.waitForTimeout(grp==='duo'?2500:900);
    const r=await page.evaluate((id)=>{const s=document.querySelector(id); const rd=document.querySelector('.effort-read');
      return {min:s.min,max:s.max,value:s.value,vt:s.getAttribute('aria-valuetext'),read:(rd? rd.textContent.slice(0,160):null)}},id);
    res.push(tab+' '+JSON.stringify(r));
  }
  console.log(res.join('\n')); console.log('errs',errs);
  await browser.close();
})();
