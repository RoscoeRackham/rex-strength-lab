const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.goto(URL); await page.waitForTimeout(2500);
  const snap=async()=>page.evaluate(()=>{const s=document.querySelector('#effort-use');const r=document.querySelector('#bay .effort-read p');return {read:r&&r.innerText.slice(0,90), val:s&&(+s.value).toFixed(2), vt:s&&s.getAttribute('aria-valuetext')}});
  for(const o of ['bus','person','tank','piano','fridge']){
    const ids=await page.$$eval('#obj option',os=>os.map(o=>o.value)); if(!ids.includes(o)){continue;}
    // mouse click on select then choose: emulate by focusing then selectOption
    await page.click('#obj'); await page.keyboard.press('Escape'); await page.selectOption('#obj',o); await page.waitForTimeout(4000);
    const a=await snap();
    await page.evaluate(()=>document.activeElement.blur()); await page.click('#tab-jump'); await page.waitForTimeout(500); await page.click('#tab-throw'); await page.waitForTimeout(3000);
    console.log(o,'kept:',JSON.stringify(a),'fresh:',JSON.stringify(await snap()));
  }
  await browser.close();
})();
