const {open}=require('./lib');
(async()=>{
  const {browser,page,errs}=await open();
  async function dragTest(tab, sel, duo){
    await page.click(duo?'#grp-duo':'#grp-solo'); await page.click('#tab-'+tab);
    await page.waitForTimeout(duo?6000:1500);
    // wait for not pending
    for(let i=0;i<60;i++){ const t=await page.evaluate(()=>document.querySelector('#bay').innerText); if(!/working it out/.test(t)) break; await page.waitForTimeout(500);}
    await page.evaluate(()=>{document.querySelectorAll('#bay details.effort-adjust').forEach(d=>d.open=true);});
    await page.waitForTimeout(200);
    const has=await page.$(sel); if(!has){console.log(tab,sel,'missing');return;}
    await page.evaluate((sel)=>{window.__n=[];window.__el=document.querySelector(sel);window.__focusAtFirst=null;
      document.addEventListener('input',e=>{ if(e.target.id===sel.slice(1)){ if(!window.__n.length) window.__focusAtFirst=document.activeElement.tagName+'#'+document.activeElement.id; window.__n.push(e.target.value);} },true);
      document.activeElement && document.activeElement.blur && document.activeElement.blur();
    },sel);
    await page.$eval(sel,e=>e.scrollIntoView({block:'center'}));
    const box=await (await page.$(sel)).boundingBox();
    const y=box.y+box.height/2, x0=box.x+box.width*0.2, x1=box.x+box.width*0.8;
    const info0=await page.$eval(sel,e=>({min:e.min,max:e.max,v:e.value}));
    await page.mouse.move(x0,y); await page.mouse.down();
    for(let i=1;i<=21;i++){ await page.mouse.move(x0+(x1-x0)*i/21,y); await page.waitForTimeout(30);}
    await page.mouse.up(); await page.waitForTimeout(400);
    const r=await page.evaluate((sel)=>{const e=document.querySelector(sel);return {n:window.__n.length,distinct:[...new Set(window.__n)].length,first:window.__n.slice(0,3),focus:window.__focusAtFirst,final:e&&e.value,same:e===window.__el, read:(document.querySelector('#bay .effort-read')||{}).innerText}},sel);
    const exp=+info0.min+0.8*(info0.max-info0.min);
    console.log(tab,sel,JSON.stringify(r),'expected~',exp.toFixed(2), 'range',info0);
  }
  await dragTest('throw','#effort-use',false);
  await dragTest('catch','#duo-effort-use',true);
  await dragTest('catch','#c-dist',true);
  await dragTest('arm','#duo-effort-use',true);
  await dragTest('collide','#duo-effort-use',true);
  console.log('errs',errs);
  await browser.close();
})();
