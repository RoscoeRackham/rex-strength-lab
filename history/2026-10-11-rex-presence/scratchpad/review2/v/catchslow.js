const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const [obj,style] of [['car','hard'],['piano','hard'],['car','easy']]){
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    await page.addInitScript((st)=>{ localStorage.setItem('rex-lab-v1',JSON.stringify(st)); },{group:'duo',duoAction:'catch',cStyle:style,cObj:'baseball'});
    await page.goto(URL); await page.waitForTimeout(500);
    for(let i=0;i<80;i++){ const t=await page.evaluate(()=>document.querySelector('#bay').innerText); if(!/working it out/.test(t)) break; await page.waitForTimeout(250);}
    await page.focus('#c-obj');
    const t0=Date.now();
    await page.selectOption('#c-obj',obj);
    let live=null, verdict=null;
    for(let i=0;i<400;i++){ const r=await page.evaluate(()=>({b:document.querySelector('#bay').innerText, live:document.querySelector('#bay-live').textContent, v:(document.querySelector('#bay .verdict')||{}).textContent})); if(i===8){live=r.live;verdict=r.v;} if(!/working it out/.test(r.b)){ const read=(r.b.match(/Effort:[^\n]*/)||[''])[0]; console.log(obj,style,'ms',Date.now()-t0,'| live@~1s:',(live||'').slice(0,140),'| pending', /working/.test(verdict||'')?'':'' ,'| settled:',read.slice(0,100)); break;} await page.waitForTimeout(100);}
    await page.close();
  }
  await browser.close();
})();
