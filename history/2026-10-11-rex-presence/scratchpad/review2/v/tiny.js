const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for(const [logKg,action,group,duoAction] of [[20,'throw','solo'],[25,'pull','solo'],[15,'stomp','solo'],[20,'throw','duo','arm'],[12,'throw','solo']]){
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    await page.addInitScript((st)=>{ localStorage.setItem('rex-lab-v1',JSON.stringify(st)); },{logKg,action,group,duoAction});
    await page.goto(URL); await page.waitForTimeout(3000);
    for(let i=0;i<40;i++){ const t=await page.evaluate(()=>document.querySelector('#bay').innerText); if(!/working it out|Working out/.test(t)) break; await page.waitForTimeout(500);}
    await page.evaluate(()=>{document.querySelectorAll('details.haz-list').forEach(d=>d.open=true)});
    const t=await page.evaluate(()=>{const r=document.querySelector('#bay .effort-read');return r?r.innerText:''});
    console.log('==',logKg,group==='duo'?duoAction:action,'\n'+t.split('\n').filter(x=>/%|Effort|ceiling|from/.test(x)).join('\n'));
    await page.close();
  }
  await browser.close();
})();
