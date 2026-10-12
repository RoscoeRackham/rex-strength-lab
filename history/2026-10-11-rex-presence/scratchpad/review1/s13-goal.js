const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  for (const st of [{ action: 'throw', gThrow: 5000 }, { action: 'jump', gJump: 500 }, { action: 'sprint', gSprint: 400 }, { action: 'pull', gPull: 0.05 }]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('x', 1); } }, st);
    await page.goto(PREV); await page.waitForTimeout(5000);
    const r = await page.evaluate(() => ({ sel: document.querySelector('#effort').value, read: document.querySelector('.effort-read').innerText.replace(/\n+/g, ' / '), verdict: document.querySelector('#bay .verdict').innerText }));
    console.log('==', JSON.stringify(st), JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
