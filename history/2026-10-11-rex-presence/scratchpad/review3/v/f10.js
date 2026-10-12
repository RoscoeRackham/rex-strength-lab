const {open}=require('./lib');
(async()=>{
  const {browser,page}=await open(390,844);
  await page.click('#grp-solo'); await page.click('#tab-throw'); await page.waitForTimeout(1500);
  const openAdj = () => page.evaluate(()=>{const d=document.querySelector('#bay details.effort-adjust'); if(d) d.open=true;});
  for (const [id, val] of [['#near','2000'],['#near','0.2'],['#goal','5e9']]) {
    await openAdj();
    await page.fill(id, val); await page.keyboard.press('Enter'); await page.keyboard.press('Tab'); await page.waitForTimeout(800);
    await openAdj();
    const r=await page.evaluate((id)=>{const i=document.querySelector(id); const s=JSON.parse(localStorage.getItem('rex-lab-v1')||'{}');
      const lab=document.querySelector('label[for='+id.slice(1)+']');
      return {value:i.value, invalid:i.matches(':invalid'), msg:i.validationMessage, label: lab&&lab.textContent, savedNear:s.near, savedGoal:s.gThrow, ariaInvalid:i.getAttribute('aria-invalid')}}, id);
    console.log(id, val, JSON.stringify(r));
  }
  await page.click('#tab-walk'); await page.waitForTimeout(1200);
  await page.fill('#walk-d','20000'); await page.keyboard.press('Enter'); await page.keyboard.press('Tab'); await page.waitForTimeout(800);
  const r=await page.evaluate(()=>{const i=document.querySelector('#walk-d'); const s=JSON.parse(localStorage.getItem('rex-lab-v1')||'{}'); return {value:i.value, invalid:i.matches(':invalid'), msg:i.validationMessage, saved:s.walkD}});
  console.log('#walk-d 20000', JSON.stringify(r));
  // the height field for comparison
  await page.fill('#height','900'); await page.keyboard.press('Enter'); await page.keyboard.press('Tab'); await page.waitForTimeout(800);
  console.log('#height 900 ->', await page.evaluate(()=>document.querySelector('#height').value));
  await browser.close();
})();
