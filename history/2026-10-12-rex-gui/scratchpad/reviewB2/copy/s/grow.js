const L = require('./lib.js');
(async () => {
  const st = JSON.parse(process.argv[2]), mode = process.argv[3], eff = process.argv[4];
  const { browser, page, errs } = await L.open({});
  await L.load(page, st, { effort: eff });
  await page.evaluate(() => { document.getElementById('powers').open = true; });
  await page.selectOption('#absorb', mode);
  await page.waitForTimeout(500); await L.settle(page, 'bay');
  const t = await page.evaluate(() => document.getElementById('bay').innerText);
  console.log(t.slice(t.indexOf('Unbreakable footing:'), t.length).slice(0, 4000));
  if (errs.length) console.log('ERRS', errs);
  await browser.close();
})();
