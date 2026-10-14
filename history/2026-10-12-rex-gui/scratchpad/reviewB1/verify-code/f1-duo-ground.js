const { open, settle } = require('./lib.js');
(async () => {
  for (const logKg of [null, 6]) {
    const saved = { duoOpen: true, duoAction: 'collide', anchor: 'bolted' };
    if (logKg) saved.logKg = logKg;
    const { browser, page, errs } = await open('branch', saved);
    await settle(page, '#duo-bay');
    await page.selectOption('#duo-effort', 'ground');
    await page.waitForTimeout(500);
    const t = await settle(page, '#duo-bay');
    const read = await page.evaluate(() => document.querySelector('#duo-bay .effort-read').innerText);
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')));
    console.log('logKg', st.logKg, 'unbreakable', st.unbreakable, 'airAbsorb', st.airAbsorb, 'surface', st.surface, 'anchor', st.anchor);
    console.log(read);
    console.log('errs', errs);
    await browser.close();
  }
})();
