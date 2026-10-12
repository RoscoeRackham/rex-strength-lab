const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  for (const st of [{ action: 'throw', logKg: 3.2 }, { action: 'jump', logKg: 3.6 }, { action: 'sprint', logKg: 3.6 }, { group: 'duo', duoAction: 'catch' }, { group: 'duo', duoAction: 'collide' }, { group: 'duo', duoAction: 'wrestle' }]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('x', 1); } }, st);
    await page.goto(PREV); await page.waitForTimeout(2500);
    const r = await page.evaluate(() => ({ sel: (document.querySelector('#effort') || document.querySelector('#duo-effort') || {}).value, read: (document.querySelector('.effort-read') || {}).innerText, verdict: (document.querySelector('#bay .verdict') || {}).innerText }));
    console.log('==', JSON.stringify(st), JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
