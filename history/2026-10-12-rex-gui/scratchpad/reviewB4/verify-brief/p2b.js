const {open}=require('./pg.js');
(async()=>{
  const {browser,page,load,pick,text,errs}=await open();
  for (const lk of [5.7, 7, 11]) {
    await load({action:'throw',obj:'car',angle:90,logKg:lk,mode:'comic'});
    await pick('#effort','plaster');
    const t=await page.evaluate(()=>document.querySelector('#bay .effort-read').textContent.replace(/\s+/g,' '));
    console.log('logKg',lk,'plaster preset:',t.slice(0,300));
  }
  await browser.close();
})();
