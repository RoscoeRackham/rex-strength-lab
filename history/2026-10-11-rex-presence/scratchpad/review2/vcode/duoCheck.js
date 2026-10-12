const { open } = require('./pw.js');
(async()=>{
 for (const r of ['rhead']) for (const kg of [4000, 4250, 4560, 7860, 8110]) {
  const st = {group:'duo', duoAction:'catch', cObj:'person', inf:true, mode:'real', cLogD:1.5, cStyle:'hard'};
  const { browser, page } = await open(__dirname+'/'+r, st);
  await page.waitForTimeout(1500);
  await page.evaluate((v)=>{ const s=document.querySelector('#duo-effort'); s.value='custom'; s.dispatchEvent(new Event('change')); }, 0);
  await page.waitForTimeout(300);
  await page.evaluate((v)=>{ const s=document.querySelector('#duo-effort-use'); s.value=String(v); s.dispatchEvent(new Event('input')); }, Math.log10(kg));
  await page.waitForTimeout(1500);
  const t = await page.evaluate(()=>document.querySelector('.effort-read').innerText.replace(/\n+/g,' / '));
  console.log(r, kg, t.slice(0,300));
  await browser.close();
 }
})();
