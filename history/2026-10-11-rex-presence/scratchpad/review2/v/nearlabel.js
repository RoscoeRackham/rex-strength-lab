const {open}=require('./lib');
(async()=>{
  const {browser,page}=await open({wait:2500});
  await page.click('#tab-jump'); await page.waitForTimeout(3000);
  console.log(await page.evaluate(()=>{const l=document.querySelector('label[for=near]');return l&&l.textContent}));
  await browser.close();
})();
