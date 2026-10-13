const { open } = require('./common.js');
const dist = process.argv[2], w = Number(process.argv[3] || 1280);
(async () => {
  const { browser, page, load, errs, settle } = await open(dist, w);
  for (const absorb of ['ocean', 'gradual', 'instant', 'runaway']) for (const grow of ['krakatoa', 'chicxulub']) {
    await load({ action: 'weight' });
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.selectOption('#absorb', absorb); await page.waitForTimeout(300);
    await page.click('#grow-what-' + grow); await page.waitForTimeout(400); await settle(page, 'bay');
    const t = await page.evaluate(() => { const b = document.querySelector('#bay .growth-whatif'); return b ? b.innerText : 'NO BOX'; });
    console.log('=== ' + absorb + ' / ' + grow + '\n' + t);
  }
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('overflow', ov, 'errs', errs);
  await browser.close();
})();
