const {open}=require('./lib');
(async()=>{
 for (const w of [360,390,1280]) {
  const {browser,page,errs}=await open(w,844);
  await page.evaluate(()=>{document.querySelector('#comic-setup').open=true;});
  for (const m of ['gradual','instant','runaway']) {
    await page.selectOption('#absorb', m); await page.waitForTimeout(400);
    const r=await page.evaluate(()=>{
      const de=document.documentElement; const ov=de.scrollWidth-de.clientWidth;
      const lab=document.querySelector('label[for=half-life]').getBoundingClientRect();
      const inp=document.querySelector('#half-life').getBoundingClientRect();
      const pan=document.querySelector('#comic-setup').getBoundingClientRect();
      const hr=document.querySelector('#half-row');
      return {ov, halfHidden: hr.hidden, lab:[Math.round(lab.left),Math.round(lab.right)], inp:[Math.round(inp.left),Math.round(inp.right)], panel:[Math.round(pan.left),Math.round(pan.right)]};
    });
    console.log(w,m,JSON.stringify(r));
  }
  await page.selectOption('#absorb','runaway'); await page.waitForTimeout(300);
  await page.evaluate(()=>document.querySelector('#half-row').scrollIntoView({block:'center'}));
  await page.screenshot({path:`f1-runaway-${w}.png`});
  await browser.close();
 }
})();
