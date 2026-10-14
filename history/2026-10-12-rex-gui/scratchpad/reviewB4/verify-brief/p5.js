const {open}=require('./pg.js');
(async()=>{
  const {browser,page,load,pick,text,errs}=await open();
  const chips=()=>page.evaluate(()=>Array.from(document.querySelectorAll('#bay .status-row .status')).map(n=>n.textContent.trim()));
  for (const obj of ['car','baseball','piano','bowling','shot']) {
    await load({action:'throw',obj,angle:90,mode:'comic'});
    const t=await text('bay');
    const nd=(t.match(/No drag: their power takes back[^)]*\)?[^.]*\./)||['(no item)'])[0];
    const ch=await chips();
    const apex=(t.match(/(top|apex|height)[^.]{0,80}/i)||[''])[0];
    console.log(obj,'| chip:',ch.includes('No drag: their power'),'| item:',nd.slice(0,260));
  }
  // the 0% apex for bowling/shot at least-disruptive: compute from engine on page
  for (const obj of ['bowling','shot']) {
    await load({action:'throw',obj,angle:90,mode:'comic'});
    const r=await page.evaluate((id)=>{const P=window.DinoPhys,D=window.DINO_DATA;const t=document.getElementById('bay').textContent;return (t.match(/Effort:[^.]*\./)||[''])[0];},obj);
    console.log(obj,'effort',r);
  }
  await load({duoOpen:true,duoAction:'wrestle',wrestleMove:'throw',wAngle:90,mode:'comic'}); await pick('#duo-effort','allout');
  const w=await text('duo-bay'); const wc=await page.evaluate(()=>Array.from(document.querySelectorAll('#duo-bay .status-row .status')).map(n=>n.textContent.trim()));
  console.log('WRESTLE 90 allout chip:',wc.includes('No drag: their power'),'item:',(w.match(/Air resistance absorbed: their power takes back[^.]*\.[^.]*\./)||['none'])[0]);
  console.log('errs',errs); await browser.close();
})();
