const {open}=require('./lib');
(async()=>{
  for (const [gh,logKg] of [[false,undefined],[true,undefined],[false,7],[true,7]]) {
    const ls={gentleHold:gh}; if (logKg) ls.logKg=logKg;
    const {browser,page}=await open(1280,900,'light',ls);
    await page.click('#grp-solo'); await page.click('#tab-throw'); await page.waitForTimeout(3000);
    const r=await page.evaluate(()=>{const b=document.querySelector('#bay');
      const vis=[...b.querySelectorAll('.effort-read > p')].map(p=>p.innerText);
      const chips=[...b.querySelectorAll('.status-row *')].map(x=>x.textContent).filter(Boolean).slice(0,6);
      const visibleText=b.innerText; // innerText excludes closed details content
      return {sw: document.querySelector('#sw-gentle').checked, vis, chips, gentleVisible: /Gentle hold/.test(visibleText), gentleAnywhere: /Gentle hold/.test(b.textContent)}});
    console.log('gentle',gh,'logKg',logKg,JSON.stringify(r));
    await browser.close();
  }
})();
