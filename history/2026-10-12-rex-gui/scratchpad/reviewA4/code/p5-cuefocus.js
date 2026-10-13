const { launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  const page = await open(b, 'branch.html', { state: null, wait: 1500 });
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(300);
  const before = await page.evaluate(() => { const c = document.getElementById('more-below'); return { hidden: c.hidden, text: c.textContent }; });
  await page.click('#more-below');
  await page.waitForTimeout(1000);
  const after = await page.evaluate(() => ({ active: document.activeElement.id || document.activeElement.tagName, hidden: document.getElementById('more-below').hidden }));
  await page.keyboard.press('Tab');
  const tab1 = await page.evaluate(() => { const a = document.activeElement; return (a.id || a.tagName) + ' in ' + (a.closest('aside') ? 'aside' : a.closest('#duo') ? 'duo' : a.closest('main') ? 'main' : 'other'); });
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Shift+Tab');
  const back = await page.evaluate(() => { const a = document.activeElement; return a.id || a.tagName; });
  console.log(JSON.stringify({ before, after, tab1, back, errs: page.errs }));
  await b.close();
})();
