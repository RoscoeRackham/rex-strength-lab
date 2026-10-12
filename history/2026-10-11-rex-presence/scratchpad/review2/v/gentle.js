const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const [logKg,gh] of [[7,false],[7,true],[Math.log10(100*907.18474),false],[Math.log10(100*907.18474),true]]){
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    await page.addInitScript((st)=>{ localStorage.setItem('rex-lab-v1',JSON.stringify(st)); },{action:'throw',logKg,gentleHold:gh,obj:'car'});
    await page.goto(URL); await page.waitForTimeout(2500);
    for(let i=0;i<80;i++){ const t=await page.evaluate(()=>document.querySelector('#bay').innerText); if(!/working it out|Working out/i.test(t)) break; await page.waitForTimeout(250);}
    await page.evaluate(()=>document.querySelectorAll('#bay details').forEach(d=>d.open=true));
    const r=await page.evaluate(()=>{const b=document.querySelector('#bay'); const t=b.innerText; return {sw:document.querySelector('#sw-gentle').checked, gentleText:/Gentle hold/i.test(t), lines:t.split('\n').filter(x=>/Effort:|Courtesy ceiling:|crush|Grip|Where each/.test(x))}});
    console.log(logKg.toFixed(2),'gentle',gh,JSON.stringify(r,null,1));
    await page.close();
  }
  await browser.close();
})();
