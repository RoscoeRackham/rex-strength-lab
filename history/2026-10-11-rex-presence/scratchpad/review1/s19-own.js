const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 360, height: 740 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ group: 'duo', duoAction: 'arm' })); sessionStorage.setItem('x', 1); } });
  await page.goto(PREV); await page.waitForTimeout(1500);
  await page.check('#o-effort-own'); await page.waitForTimeout(800);
  await page.evaluate(() => { const s = document.querySelector('#o-effort-use'); s.value = String(+s.min + 0.3); s.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => ({ read: document.querySelector('.effort-read').innerText, cards: [...document.querySelectorAll('.fighter')].map((f) => f.innerText.replace(/\n/g, ' | ')), verdict: document.querySelector('#bay .verdict').innerText, focusAfter: document.activeElement.id }));
  console.log(JSON.stringify(r, null, 1));
  await page.locator('main.panel').screenshot({ path: OUT + 'duo-own-360.png' });
  await b.close();
})();
