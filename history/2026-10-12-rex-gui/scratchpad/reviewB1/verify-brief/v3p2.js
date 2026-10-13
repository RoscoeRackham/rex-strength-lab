const { open, settle } = require('./pw.js');
(async () => {
  for (const air of [1, 0.5]) {
    const { browser, page, errs } = await open({ action: 'throw', obj: 'baseball', angle: 0, logKg: Math.log10(200e18 * 907.18474) + 1e-12, airAbsorb: air });
    await page.selectOption('#effort', 'allout');
    await settle(page);
    const t = await page.evaluate(() => document.body.innerText);
    console.log('=== air', air);
    console.log(t.split('\n').filter(l => /plaster|Courtesy|All-out|never|fireball|leaves the Earth/i.test(l)).slice(0, 12).join('\n'));
    const M = await page.evaluate(() => { const P = window.DinoPhys; return null; });
    console.log('errs', errs);
    await browser.close();
  }
})();
