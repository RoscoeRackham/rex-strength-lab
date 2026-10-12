const { open, tab, bayText } = require('./lib');
(async () => {
  const { browser, page } = await open({ w: 1280, h: 900 });
  for (const t of ['throw', 'punch', 'jump', 'weight']) {
    await tab(page, t, false, 2500);
    await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
    await page.selectOption('#absorb', 'ocean'); await page.waitForTimeout(1500);
    const a = await bayText(page);
    await page.selectOption('#absorb', 'gradual'); await page.waitForTimeout(1500);
    const b = await bayText(page);
    const panel = await page.$eval('#comic-setup', (e) => e.innerText);
    console.log(t, a === b ? 'NO VISIBLE CHANGE in bay' : 'bay changed');
    if (t === 'throw') console.log(panel);
  }
  await browser.close();
})();
