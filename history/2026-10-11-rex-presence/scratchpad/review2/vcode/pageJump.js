const { open } = require('./pw.js');
(async()=>{
 for (const r of ['r64','rhead']) for (const [surface, logKg, eff] of [['ice',12,'ceiling'],['ice',12,'ground'],['concrete',7,'ground']]) {
  const { browser, page, errs } = await open(__dirname+'/'+r, {action:'jump', surface, mode:'comic', logKg, group:'solo'});
  await page.waitForTimeout(1500);
  await page.selectOption('#effort', eff);
  await page.waitForFunction(()=>!/working it out/i.test(document.querySelector('main.panel').innerText), null, {timeout:60000}).catch(()=>{});
  await page.waitForTimeout(500);
  const t = await page.evaluate(()=>document.querySelector('.effort-read').innerText);
  console.log('==', r, surface, logKg, eff, '\n', t.slice(0,500).replace(/\n+/g,' / '));
  await browser.close();
 }
})();
