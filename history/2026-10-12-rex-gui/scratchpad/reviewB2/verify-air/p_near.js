const { open, load, pick, text } = require('./page');
(async () => {
  const { browser, page, errs } = await open();
  for (const share of [0.99, 1]) {
    await load(page, { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cLogD: 1, cStyle: 'hard', logKg: 16, airAbsorb: share }, 'duo-bay');
    await pick(page, '#duo-effort', 'allout', 'duo-bay');
    const v = await page.$eval('#duo-bay .verdict', (n) => n.textContent.replace(/\s+/g, ' '));
    const slider = await page.$eval('#air-absorb', (n) => n.value);
    console.log('share', share, 'slider', slider, '\n  ', v, '\n');
  }
  console.log('errs', errs);
  await browser.close();
})();
