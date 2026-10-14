const {open}=require('./pg.js');
(async()=>{
  const {browser,page,load,pick,text,errs}=await open();
  for (const lk of [3.3, 2.7085]) {
    await load({duoOpen:true,duoAction:'arm',logKg:lk,mode:'comic'}); await pick('#duo-effort','allout');
    const t=await text('duo-bay');
    const chips=await page.evaluate(()=>Array.from(document.querySelectorAll('#duo-bay .status-row .status')).map(n=>n.textContent.trim()));
    const tiles=await page.evaluate(()=>Array.from(document.querySelectorAll('#duo-bay .tile')).map(n=>n.textContent.replace(/\s+/g,' ')).filter(x=>/Table/.test(x)));
    const i=t.indexOf('Newton’s third law'); 
    console.log('logKg',lk,'CHIPS',JSON.stringify(chips),'\n  TILE',JSON.stringify(tiles),'\n  ITEM',t.slice(i,i+420));
    const pushI=t.match(/[^.]*push between[^.]*\./g); 
    const forces=await page.evaluate(()=>Array.from(document.querySelectorAll('#duo-bay svg text, #duo-bay .bars *')).map(n=>n.textContent).join(' ').slice(0,500));
    console.log('  FORCES',forces);
  }
  console.log('errs',errs); await browser.close();
})();
