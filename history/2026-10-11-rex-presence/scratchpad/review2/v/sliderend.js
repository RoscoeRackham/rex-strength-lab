const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const [st,sel] of [[{action:'throw'},'#effort-use'],[{action:'punch'},'#effort-use'],[{group:'duo',duoAction:'arm'},'#duo-effort-use'],[{action:'jump',logKg:6},'#effort-use']]){
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    await page.addInitScript((st)=>{ localStorage.setItem('rex-lab-v1',JSON.stringify(st)); },st);
    await page.goto(URL); await page.waitForTimeout(2500);
    for(let i=0;i<80;i++){ const t=await page.evaluate(()=>document.querySelector('#bay').innerText); if(!/working it out/i.test(t)) break; await page.waitForTimeout(250);}
    await page.evaluate(()=>document.querySelectorAll('#bay details.effort-adjust').forEach(d=>d.open=true));
    await page.focus(sel); await page.keyboard.press('End'); await page.waitForTimeout(2500);
    const r=await page.evaluate((sel)=>{const s=document.querySelector(sel);return {min:s.min,max:s.max,v:s.value,vt:s.getAttribute('aria-valuetext'),read:document.querySelector('#bay .effort-read p').innerText}},sel);
    // also mouse drag to the far right
    const box=await (await page.$(sel)).boundingBox();
    await page.mouse.move(box.x+box.width-2,box.y+box.height/2); await page.mouse.down(); await page.mouse.move(box.x+box.width+50,box.y+box.height/2); await page.mouse.up(); await page.waitForTimeout(2000);
    const r2=await page.evaluate((sel)=>{const s=document.querySelector(sel);return {v:s.value,read:document.querySelector('#bay .effort-read p').innerText}},sel);
    console.log(JSON.stringify(st),JSON.stringify(r),'\n   mouse-right:',JSON.stringify(r2));
    await page.close();
  }
  await browser.close();
})();
