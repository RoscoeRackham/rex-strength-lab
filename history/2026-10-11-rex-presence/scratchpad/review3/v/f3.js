const {open}=require('./lib');
(async()=>{
  const {browser,page,errs}=await open(1280,900);
  for (const tab of ['throw','stomp','punch','jump','clap','sprint']) {
    await page.click('#grp-solo'); await page.click('#tab-'+tab); await page.waitForTimeout(1500);
    for (const pre of ['least','rattle']) {
      await page.selectOption('#effort', pre); await page.waitForTimeout(2500);
      const r=await page.evaluate(()=>{const rd=document.querySelector('.effort-read'); const v=document.querySelector('.verdict, #verdict, .bay h3, .bay .big');
        const sl=document.querySelector('#effort-use');
        return {sl: sl&&sl.value, read: rd&&rd.innerText.replace(/\n+/g,' | ').slice(0,420), verdict: v&&v.textContent.slice(0,120)}});
      console.log(tab,pre,JSON.stringify(r));
    }
  }
  console.log('errs',errs); await browser.close();
})();
