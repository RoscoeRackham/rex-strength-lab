const { open, settle } = require('./pw.js');
(async () => {
  for (const eff of ['allout', 'ground']) {
    const { browser, page, errs } = await open({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', logKg: 7 });
    const opts = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-effort option')).map(o => o.value));
    if (eff === 'allout') console.log('duo effort options:', opts.join(','));
    await page.selectOption('#duo-effort', eff);
    await settle(page);
    const t = await page.evaluate(() => document.getElementById('duo').innerText);
    const i = t.indexOf('Effort');
    console.log('=== effort', eff);
    console.log(t.split('\n').filter(l => /Effort|ground|sink|feet|gives way|holds|break/i.test(l)).slice(0, 20).join('\n'));
    console.log('errs', errs);
    await page.screenshot({ path: __dirname + '/v7-' + eff + '.png', fullPage: true });
    await browser.close();
  }
})();
