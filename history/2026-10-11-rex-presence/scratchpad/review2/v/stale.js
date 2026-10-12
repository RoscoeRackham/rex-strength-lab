const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  async function pg(st){
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    await page.addInitScript((st)=>{ if(!sessionStorage.getItem('x')){ localStorage.setItem('rex-lab-v1',JSON.stringify(st)); sessionStorage.setItem('x','1'); } },st);
    await page.goto(URL); await page.waitForTimeout(2500); return page;
  }
  const snap=async(page,sel)=>page.evaluate((sel)=>{const s=document.querySelector(sel);const r=document.querySelector('#bay .effort-read p');return {read:r&&r.innerText, val:s&&s.value, vt:s&&s.getAttribute('aria-valuetext')}},sel);
  // 1: unlimited, real, throw; focus obj, pick person, bus, tank
  let page=await pg({inf:true,mode:'real',action:'throw',group:'solo'});
  console.log('S1 start',await snap(page,'#effort-use'));
  for(const o of ['person','bus','tank']){
    const ids=await page.$$eval('#obj option',os=>os.map(o=>o.value)); if(!ids.includes(o)){console.log('no',o,ids.join(','));continue;}
    await page.focus('#obj'); await page.selectOption('#obj',o); await page.waitForTimeout(4000);
    console.log('S1',o,'active',await page.evaluate(()=>document.activeElement.id),await snap(page,'#effort-use'));
  }
  await page.close();
  // 2: default throw: drag angle 45->80 via keyboard (focus stays in bay)
  page=await pg({action:'throw',group:'solo'});
  console.log('S2 start',await snap(page,'#effort-use'));
  await page.focus('#angle'); for(let i=0;i<35;i++){await page.keyboard.press('ArrowRight'); await page.waitForTimeout(40);} await page.waitForTimeout(3000);
  console.log('S2 after angle 80 (keyboard)',await page.$eval('#angle',e=>e.value),await snap(page,'#effort-use'));
  // full re-render for comparison
  await page.evaluate(()=>document.activeElement.blur()); await page.click('#tab-jump'); await page.waitForTimeout(800); await page.click('#tab-throw'); await page.waitForTimeout(3000);
  console.log('S2 fresh render',await snap(page,'#effort-use'));
  await page.close();
  await browser.close();
})();
