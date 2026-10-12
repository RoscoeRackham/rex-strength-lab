const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.addInitScript(()=>{ if(!sessionStorage.getItem('x')){localStorage.setItem('rex-lab-v1',JSON.stringify({action:'weight'}));sessionStorage.setItem('x',1);} });
  await page.goto(URL); await page.waitForTimeout(2500);
  console.log('density chips',await page.$$eval('#density-chips button',bs=>bs.map(b=>b.id+':'+b.textContent).join(' | ')));
  console.log('absorb controls',await page.$$eval('[id^=absorb], input[name=absorb], #absorb option',bs=>bs.map(b=>b.id+':'+(b.value||'')+':'+b.textContent).join(' | ')));
  await browser.close();
})();
