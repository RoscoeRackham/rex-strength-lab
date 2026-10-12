const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const st of [{action:'walk'},{action:'walk',walker:'both',oM:6000}]){
  const page=await browser.newPage({viewport:{width:390,height:900},deviceScaleFactor:3});
  await page.addInitScript((st)=>{ localStorage.setItem('rex-lab-v1',JSON.stringify(st)); },st);
  await page.goto(URL); await page.waitForTimeout(2500);
  const r=await page.evaluate(()=>{const v=document.querySelector('#bay .viz'); const leg=v.previousElementSibling; return {legend:[...leg.querySelectorAll('span')].map(s=>s.textContent+' => '+s.querySelector('i').style.borderTop), paths:[...v.querySelectorAll('path')].map(p=>p.getAttribute('stroke')+' dash='+p.getAttribute('stroke-dasharray'))}});
  console.log(JSON.stringify(st),JSON.stringify(r,null,1));
  const leg=await page.$('#bay .viz'); await leg.scrollIntoViewIfNeeded(); const b=await leg.boundingBox();
  await page.screenshot({path:__dirname+'/legend-'+(st.walker||'rex')+'.png',clip:{x:b.x,y:b.y-70,width:b.width,height:70+b.height}});
  await page.close();}
  await browser.close();
})();
