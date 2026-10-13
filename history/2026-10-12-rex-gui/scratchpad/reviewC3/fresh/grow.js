const open = require('./pw.js');
(async () => {
  const { browser, page, errs, load, settle } = await open(+process.argv[2] || 1280);
  for (const mode of ['ocean', 'gradual', 'instant', 'runaway']) for (const g of ['krakatoa', 'chicxulub', 'sun']) {
    await load({ action: 'weight' }, false);
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    if (mode !== 'ocean') { await page.selectOption('#absorb', mode); await page.waitForTimeout(300); }
    await page.click('#grow-what-' + g); await page.waitForTimeout(400); await settle(page, 'bay');
    const t = await page.evaluate(() => document.querySelector('#bay .growth-whatif').innerText);
    console.log('=== ' + mode + ' ' + g + '\n' + t);
  }
  console.log('ERRS', errs.slice(0, 5));
  await browser.close();
})();
