const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const w of [390,1280]){
  const page=await browser.newPage({viewport:{width:w,height:900},deviceScaleFactor:3});
  await page.addInitScript(()=>{ localStorage.setItem('rex-lab-v1',JSON.stringify({action:'walk'})); });
  await page.goto(URL); await page.waitForTimeout(2500);
  const svgEl=await page.$('#bay .viz svg'); await svgEl.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); const b=await svgEl.boundingBox();
  await page.screenshot({path:__dirname+'/walkzoom-'+w+'.png',clip:{x:b.x+b.width*0.45,y:b.y+100,width:b.width*0.55,height:80}});
  await page.close();}
  await browser.close();
})();
