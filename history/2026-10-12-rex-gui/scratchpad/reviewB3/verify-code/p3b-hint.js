const { open, settle } = require('./lib.js');
(async () => {
  for (const share of [1, 0.5]) {
    const { browser, page } = await open(null, { tag: 'hint', state: { action: 'throw', obj: 'baseball', angle: 0, logKg: Math.log10(7e7), airAbsorb: share } });
    await page.selectOption('#effort', 'windows'); await page.waitForTimeout(300); await settle(page);
    const t = await page.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' '));
    const m = t.match(/(Even all-out|Effort: )[^.]*\.[^.]*\./);
    console.log('share', share, '|', m && m[0].slice(0, 260), '| hint shown:', /Lower Air resistance absorbed/.test(t));
    await browser.close();
  }
})();
