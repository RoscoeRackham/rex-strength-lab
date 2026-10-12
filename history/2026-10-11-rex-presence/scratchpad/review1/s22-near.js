const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  for (const near of [5, 10, 20, 50]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.addInitScript((n) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'stomp', near: n })); sessionStorage.setItem('x', 1); } }, near);
    await page.goto(PREV); await page.waitForTimeout(2500);
    const r = await page.evaluate(() => ({ sel: document.querySelector('#effort').value, read: document.querySelector('.effort-read').innerText.replace(/\n+/g, ' / '), verdict: document.querySelector('#bay .verdict').innerText }));
    console.log('near', near, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
