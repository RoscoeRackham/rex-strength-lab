const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'punch', silentStrike: true })); sessionStorage.setItem('x', 1); } });
  await page.goto(PREV); await page.waitForTimeout(1500); await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
  for (const m of ['instant', 'gradual']) {
    await page.selectOption('#absorb', m); await page.waitForTimeout(800);
    const t = await page.evaluate(() => [...document.querySelectorAll('#bay .callout')].map((c) => c.innerText).find((x) => /absorbed/.test(x)));
    console.log('==', m, '\n' + t);
  }
  await b.close();
})();
