const {open}=require('./lib');
(async()=>{
 for (const w of [360,390,1280]) {
  const {browser,page}=await open(w,844);
  await page.evaluate(()=>{document.querySelector('#comic-setup').open=true;
    const l=document.querySelector('label[for=half-life]'); l.style.flex='1 1 auto'; l.style.minWidth='0';
    document.querySelector('#half-life').style.flex='0 0 7em';});
  await page.selectOption('#absorb','runaway'); await page.waitForTimeout(300);
  const r=await page.evaluate(()=>{const de=document.documentElement;
   const lab=document.querySelector('label[for=half-life]').getBoundingClientRect(), inp=document.querySelector('#half-life').getBoundingClientRect(), pan=document.querySelector('#comic-setup').getBoundingClientRect();
   return {ov:de.scrollWidth-de.clientWidth, lab:[lab.left,lab.right,lab.height].map(Math.round), inp:[inp.left,inp.right].map(Math.round), panel:[pan.left,pan.right].map(Math.round)}});
  console.log(w,JSON.stringify(r));
  await page.evaluate(()=>document.querySelector('#half-row').scrollIntoView({block:'center'}));
  await page.screenshot({path:`f1fix-${w}.png`});
  await browser.close();
 }})();
