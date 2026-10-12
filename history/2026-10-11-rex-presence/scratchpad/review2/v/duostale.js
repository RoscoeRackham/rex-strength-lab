const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.addInitScript(()=>{ if(!sessionStorage.getItem('x')){localStorage.setItem('rex-lab-v1',JSON.stringify({group:'duo',duoAction:'catch',cStyle:'hard'}));sessionStorage.setItem('x',1);} });
  await page.goto(URL); await page.waitForTimeout(500);
  const settle=async()=>{for(let i=0;i<200;i++){ const t=await page.evaluate(()=>document.querySelector('#bay').innerText); if(!/working it out/.test(t)) return; await page.waitForTimeout(200);}};
  await settle();
  await page.focus('#c-obj'); await page.selectOption('#c-obj','car'); await page.waitForTimeout(300); await settle();
  const snap=()=>page.evaluate(()=>{const s=document.querySelector('#duo-effort-use');return {active:document.activeElement.id,val:(+s.value).toFixed(2),vt:s.getAttribute('aria-valuetext'),read:document.querySelector('#bay .effort-read p').innerText.slice(0,80)}});
  console.log('kept',JSON.stringify(await snap()));
  await page.evaluate(()=>document.activeElement.blur()); await page.click('#tab-arm'); await page.waitForTimeout(500); await page.click('#tab-catch'); await settle();
  console.log('fresh',JSON.stringify(await snap()));
  await browser.close();
})();
