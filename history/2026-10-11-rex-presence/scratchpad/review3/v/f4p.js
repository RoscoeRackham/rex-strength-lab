const {open}=require('./lib');
(async()=>{
  const {browser,page,errs}=await open(1280,900,'light',{inf:true,mode:'real',action:'throw',obj:'car'});
  await page.click('#grp-solo'); await page.click('#tab-throw'); await page.waitForTimeout(4000);
  const st=await page.evaluate(()=>({inf:document.body.innerText.includes('nlimited'), mode:document.querySelector('#mode-real').getAttribute('aria-pressed')}));
  console.log(st);
  await page.evaluate(()=>{const s=document.querySelector('#effort-use'); s.closest('details').open=true;});
  await page.waitForTimeout(300);
  const box=await (await page.$('#effort-use')).boundingBox();
  const mm=await page.evaluate(()=>{const s=document.querySelector('#effort-use'); return [s.min,s.max]});
  console.log('min/max',mm,box);
  // instrument long tasks
  await page.evaluate(()=>{window.__lt=[]; new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__lt.push([Math.round(e.startTime),Math.round(e.duration)])}).observe({entryTypes:['longtask']});});
  await page.mouse.move(box.x+box.width*0.05, box.y+box.height/2); await page.mouse.down();
  const vals=[];
  for (let i=0;i<=60;i++){ const t0=Date.now(); await page.mouse.move(box.x+box.width*(0.05+0.9*i/60), box.y+box.height/2); 
     await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
     const dt=Date.now()-t0; const v=await page.evaluate(()=>{const s=document.querySelector('#effort-use'); return s?s.value:null}); vals.push([Number(v).toFixed(2),dt]); }
  await page.mouse.up();
  const lt=await page.evaluate(()=>window.__lt);
  vals.sort((a,b)=>b[1]-a[1]); console.log('slowest frames',vals.slice(0,8).map(x=>x[0]+':'+x[1]+'ms').join(' '));
  console.log('frames>100ms',vals.filter(x=>x[1]>100).length,'of',vals.length);
  console.log('longtasks>200', lt.filter(x=>x[1]>200).map(x=>x[1]).join(','));
  console.log('errs',errs); await browser.close();
})();
