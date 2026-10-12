const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async()=>{
 const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
 for (const r of ['rmain','rhead']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript((s)=>{ if(!sessionStorage.getItem('x')){localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('x','1');} }, {action:'throw', obj:'pickup', surface:'sand', mode:'real', inf:false, logKg:20, group:'solo'});
  await page.goto(pathToFileURL(__dirname+'/'+r+'/rex-strength-lab/dist/preview.html').href);
  await page.waitForTimeout(3000);
  const res = await page.evaluate(async ()=>{
    const s=document.querySelector('#strength'); const out=[];
    for (let i=0;i<12;i++){ const v=20+i*0.75; const t0=performance.now(); s.value=String(v); s.dispatchEvent(new Event('input',{bubbles:true}));
      await new Promise(r=>requestAnimationFrame(()=>setTimeout(r,0))); out.push(Math.round(performance.now()-t0)); }
    return out;
  });
  console.log(r, 'ms per drag frame', res.join(' '));
  await page.close();
 }
 await browser.close();
})();
