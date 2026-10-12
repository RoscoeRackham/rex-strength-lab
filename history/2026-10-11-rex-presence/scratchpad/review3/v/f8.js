const {open}=require('./lib');
(async()=>{
  const {browser,page}=await open(1280,900);
  for (const tab of ['arm','collide']) {
    await page.click('#grp-duo'); await page.click('#tab-'+tab); await page.waitForTimeout(3000);
    await page.evaluate(()=>{const s=document.querySelector('#duo-effort-use'); s.closest('details').open=true;});
    await page.focus('#duo-effort-use'); await page.keyboard.press('Home'); await page.waitForTimeout(3000);
    let r=await page.evaluate(()=>{const s=document.querySelector('#duo-effort-use'); const rd=document.querySelector('#bay .effort-read');
      const cards=(document.querySelector('#bay').innerText.match(/using [\d.,]+ [kt]g?/g)||[]).join(';');
      return {min:s.min, value:s.value, vt:s.getAttribute('aria-valuetext'), read: rd.innerText.split('\n')[0], cards}});
    console.log(tab,'shared',JSON.stringify(r));
    await page.check('#o-effort-own'); await page.waitForTimeout(2500);
    await page.evaluate(()=>{const s=document.querySelector('#o-effort-use'); s.closest('details').open=true;});
    await page.focus('#o-effort-use'); await page.keyboard.press('Home'); await page.waitForTimeout(3000);
    r=await page.evaluate(()=>{const s=document.querySelector('#o-effort-use'); const rd=document.querySelector('#bay .effort-read');
      const cards=(document.querySelector('#bay').innerText.match(/using [\d.,]+ [kt]g?/g)||[]).join(';');
      return {min:s.min, value:s.value, vt:s.getAttribute('aria-valuetext'), read: rd.innerText.split('\n')[0], cards}});
    console.log(tab,'ollie',JSON.stringify(r));
    await page.uncheck('#o-effort-own'); await page.waitForTimeout(1500);
  }
  console.log('floor kg', 1.2*3007/1.4, 'log10', Math.log10(1.2*3007/1.4));
  await browser.close();
})();
