const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', inf: true })); sessionStorage.setItem('x', 1); } });
  await page.goto(PREV); await page.waitForTimeout(3000);
  const r = await page.evaluate(() => ({ read: document.querySelector('.effort-read').innerText, h: document.querySelector('.effort-read').getBoundingClientRect().height, verdictToTiles: Math.round(document.querySelector('#bay .tiles').getBoundingClientRect().top - document.querySelector('#bay .verdict').getBoundingClientRect().top) }));
  console.log(JSON.stringify(r, null, 1));
  await page.locator('.effort-read').screenshot({ path: OUT + 'readout-throw-inf-390.png' });
  await b.close();
})();
