const { open, settle } = require('./pw.js');
(async () => {
  const { browser, page, errs } = await open({ action: 'stomp', logKg: Math.log10(1.75e13) + 0.01 });
  await page.waitForTimeout(4000); await settle(page);
  const t = await page.evaluate(() => document.body.innerText);
  console.log(t.split('\n').filter(l => /quake|magnitude/i.test(l)).slice(0, 12).join('\n'));
  await page.selectOption('#effort', 'allout'); await settle(page);
  const t2 = await page.evaluate(() => document.getElementById('bay').innerText);
  console.log('--- stomp tab all-out at 1.75e13 kg'); console.log(t2.split('\n').filter(l => /quake|magnitude|holds/i.test(l)).slice(0, 6).join('\n'));
  const st = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); return [s.unbreakable, s.logKg]; });
  console.log(st, errs);
  await browser.close();
})();
