const {open}=require('./lib');
(async()=>{
  for (const near of [5,20]) {
    const {browser,page}=await open(1280,900,'light',{near});
    await page.click('#grp-duo'); await page.click('#tab-collide'); await page.waitForTimeout(6000);
    const r=await page.evaluate(()=>{const rd=document.querySelector('#bay .effort-read');
      return {hasNear: !!document.querySelector('#near'), labels:[...document.querySelectorAll('#bay label')].map(l=>l.textContent.slice(0,45)), read: rd&&rd.innerText.replace(/\n+/g,' | ')}});
    console.log('near',near,JSON.stringify(r));
    await browser.close();
  }
})();
