const { open, settle } = require('./pw.js');
(async () => {
  const { browser, page, errs } = await open({ action: 'throw', obj: 'bus', angle: 45, logKg: 9 });
  const opts = await page.evaluate(() => Array.from(document.querySelectorAll('#effort option')).map(o => o.value + '=' + o.textContent));
  console.log(opts.join(' | '));
  await page.selectOption('#effort', 'plaster');
  await settle(page);
  const t = await page.evaluate(() => document.body.innerText);
  console.log(t.split('\n').filter(l => /plaster|Courtesy|Effort/i.test(l)).slice(0, 10).join('\n'));
  console.log('errs', errs);
  await browser.close();
})();
