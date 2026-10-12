const { open } = require('./pw.js');
(async()=>{
 for (const r of ['r64','rhead']) {
  const { browser, page, errs } = await open(__dirname+'/'+r, null);
  await page.waitForTimeout(1500);
  await page.click('#grp-solo'); await page.click('#tab-sprint'); await page.waitForTimeout(500);
  await page.evaluate(()=>{ document.querySelector('details.effort-adjust').open=true; });
  await page.fill('#goal','0.05'); await page.press('#goal','Enter'); await page.waitForTimeout(1500);
  const before = await page.evaluate(()=>({goal:document.querySelector('#goal').value, saved: JSON.parse(localStorage.getItem('rex-lab-v1')).gSprint, line:(document.querySelector('.effort-read')||{}).innerText}));
  await page.reload(); await page.waitForTimeout(1500);
  await page.click('#grp-solo').catch(()=>{}); await page.click('#tab-sprint'); await page.waitForTimeout(500);
  const after = await page.evaluate(()=>({goal:document.querySelector('#goal').value, saved: JSON.parse(localStorage.getItem('rex-lab-v1')).gSprint}));
  // growth time
  await page.click('#tab-weight').catch(()=>{});
  console.log(r, JSON.stringify(before).slice(0,300), JSON.stringify(after), errs);
  await browser.close();
 }
})();
