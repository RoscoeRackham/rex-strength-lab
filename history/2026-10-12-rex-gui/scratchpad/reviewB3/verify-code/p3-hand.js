const { open } = require('./lib.js');
(async () => {
  for (const share of [0, 0.01]) {
    const { browser, page } = await open(null, { tag: 'hand', state: { action: 'throw', obj: 'baseball', angle: 0, logKg: 8, airAbsorb: share } });
    await page.selectOption('#effort', 'windows').catch((e) => console.log('sel', e.message));
    await require('./lib.js').settle(page);
    const t = await page.evaluate(() => document.body.innerText);
    const lines = t.split('\n').filter((l) => /hand|Effort|window|across the street|real air|blast/i.test(l)).slice(0, 25);
    console.log('==== share', share); lines.forEach((l) => console.log('  ' + l.slice(0, 400)));
    await browser.close();
  }
})();
