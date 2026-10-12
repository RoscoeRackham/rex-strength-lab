const {open}=require('./lib');
(async()=>{
  const {browser,page,errs}=await open(1280,900,'light',{inf:true,mode:'real',action:'throw',obj:'car'});
  await page.click('#grp-solo'); await page.click('#tab-throw'); await page.waitForTimeout(4000);
  await page.evaluate(()=>{const s=document.querySelector('#effort-use'); s.closest('details').open=true;});
  const box=await (await page.$('#effort-use')).boundingBox();
  // real pointer: move to the x that corresponds to each value
  const [mn,mx]=await page.evaluate(()=>{const s=document.querySelector('#effort-use'); return [Number(s.min),Number(s.max)]});
  const out=[];
  await page.mouse.move(box.x+8, box.y+box.height/2); await page.mouse.down();
  for (const target of [5.0,5.59,5.65,6.0,6.3,7.0,7.32,8.0,10.15,10.3,11.35,12]) {
    // thumb travel width ~ box.width - thumb; approximate then fine adjust with arrow keys is not possible while dragging; so compute
    const frac=(target-mn)/(mx-mn); const x=box.x+8+frac*(box.width-16);
    const t0=Date.now(); await page.mouse.move(x, box.y+box.height/2);
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const dt=Date.now()-t0; const v=await page.evaluate(()=>document.querySelector('#effort-use').value);
    out.push(Number(v).toFixed(2)+':'+dt+'ms');
  }
  await page.mouse.up();
  console.log(out.join(' '));
  console.log('errs',errs); await browser.close();
})();
