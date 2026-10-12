const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path=require('path');
const PREV='file://'+path.join(__dirname,'preview.html');
async function open(w,h,scheme,ls){
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport:{width:w,height:h||844}, colorScheme: scheme||'light' });
  const errs=[]; page.on('pageerror',e=>errs.push(e.message)); page.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  if(ls) await page.addInitScript((v)=>{ try{localStorage.setItem('rex-lab-v1',v)}catch(e){} }, JSON.stringify(ls));
  await page.goto(PREV); await page.waitForTimeout(2500);
  return {browser,page,errs};
}
module.exports={open,PREV};
