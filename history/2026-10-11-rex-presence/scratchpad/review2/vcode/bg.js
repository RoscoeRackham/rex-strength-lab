const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async()=>{
 const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
 for (const r of ['rhead']) for (const leave of [false, true]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript((s)=>{ window.__long=[]; new PerformanceObserver((l)=>{ for (const e of l.getEntries()) window.__long.push({t:Math.round(e.startTime), d:Math.round(e.duration)}); }).observe({type:'longtask', buffered:true}); if(!sessionStorage.getItem('x')){localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('x','1');} }, {action:'throw', obj:'pickup', surface:'sand', mode:'real', inf:true, group:'solo'});
  await page.goto(pathToFileURL(__dirname+'/'+r+'/rex-strength-lab/dist/preview.html').href);
  const tStart = await page.evaluate(()=>performance.now());
  if (leave) { await page.click('#tab-lift'); }
  const tClick = await page.evaluate(()=>performance.now());
  let doneAt=null;
  for (let i=0;i<120;i++){ await page.waitForTimeout(250); if(!leave){ const p = await page.evaluate(()=>/working it out/i.test(document.querySelector('main.panel').innerText)); if(!p){doneAt=await page.evaluate(()=>performance.now()); break;} } else if (i>=80) break; }
  const L = await page.evaluate((t)=>window.__long.filter(x=>x.t>=t), tClick);
  const sum = L.reduce((a,b)=>a+b.d,0), mx = Math.max(0,...L.map(x=>x.d));
  console.log(r, leave?'left for Lift tab':'stayed on Throw', 'pending for ms', doneAt? Math.round(doneAt-tStart):'n/a', 'long tasks after', L.length, 'sum ms', sum, 'max', mx, 'last long task at +', L.length? Math.round(L[L.length-1].t - tClick):0);
  await page.close();
 }
 await browser.close();
})();
