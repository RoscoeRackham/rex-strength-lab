const { open } = require('./lib.js');
(async () => {
  for (const extra of [{}, { airAbsorb: 0 }]) {
    let { browser, page } = await open(null, { tag: 'cal' });
    const lk = await page.evaluate(() => Math.log10(window.DINO_DATA.tiers.find((t) => t.id === 'human').liftKg));
    await browser.close();
    ({ browser, page } = await open(null, { tag: 'cal', state: Object.assign({ build: 'human', H: 2, m: 180, logKg: lk, action: 'throw', obj: 'baseball' }, extra) }));
    const t = await page.evaluate(() => { const m = document.body.innerText.match(/Reality check[^\n]*/); return m && m[0]; });
    const st = await page.evaluate(() => localStorage.getItem('rex-lab-v1'));
    console.log(JSON.stringify(extra), '=>', t, '\n  saved:', st.slice(0, 200));
    await browser.close();
  }
})();
