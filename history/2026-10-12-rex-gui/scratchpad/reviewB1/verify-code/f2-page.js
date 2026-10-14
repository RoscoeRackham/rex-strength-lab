const { open, settle } = require('./lib.js');
(async () => {
  for (const share of [0, 0.5]) {
    const { browser, page, errs } = await open('branch', { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 3, logKg: 20, airAbsorb: share });
    await settle(page, '#duo-bay');
    await page.selectOption('#duo-effort', 'allout');
    await page.waitForTimeout(800);
    const t = await settle(page, '#duo-bay');
    const lines = t.split('\n').filter((l) => /heat|fireball|half its energy|carrying/.test(l));
    console.log('share', share); lines.forEach((l) => console.log('  ', l.slice(0, 400)));
    console.log('errs', errs);
    await browser.close();
  }
})();
