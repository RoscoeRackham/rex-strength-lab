const {open}=require('./pg.js');
(async()=>{
  const {browser,page,load,pick,text,errs}=await open();
  for (const obj of ['car','bowling','shot']) {
    await load({action:'throw',obj,angle:90,mode:'comic'});
    const t=await text('bay');
    const i=t.indexOf('No drag: their power takes back'); console.log(obj,'ITEM:',t.slice(i,i+200));
    const e=t.indexOf('Effort:'); console.log('   EFFORT:',t.slice(e,e+120));
    // what F does the page use? recompute: read from state via DinoPhys with the page's ctx is not accessible; scan tiles
    const tiles=await page.evaluate(()=>Array.from(document.querySelectorAll('#bay .tile')).map(n=>n.textContent.replace(/\s+/g,' ')).join(' | '));
    console.log('   TILES:',tiles.slice(0,400));
  }
  await load({duoOpen:true,duoAction:'wrestle',wrestleMove:'throw',wAngle:90,mode:'comic'}); await pick('#duo-effort','allout');
  const w=await text('duo-bay'); const i=w.indexOf('Air resistance absorbed: their power takes back'); console.log('WRESTLE ITEM:',w.slice(i,i+220));
  const tiles=await page.evaluate(()=>Array.from(document.querySelectorAll('#duo-bay .tile')).map(n=>n.textContent.replace(/\s+/g,' ')).join(' | ')); console.log('  TILES',tiles.slice(0,400));
  await browser.close();
})();
