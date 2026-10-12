const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  for (const st of [{ duoEffort: 'allout' }, { duoEffort: 'custom', duoLogKg: Math.log10(3200) }, { duoEffort: 'custom', duoLogKg: Math.log10(4000) }]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ group: 'duo', duoAction: 'collide' }, s))); sessionStorage.setItem('x', 1); } }, st);
    await page.goto(PREV); await page.waitForTimeout(1500);
    // duoEffort resets to least on load: set it through the UI
    if (st.duoEffort === 'allout') await page.selectOption('#duo-effort', 'allout');
    else await page.evaluate((v) => { const s = document.querySelector('#duo-effort-use'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, st.duoLogKg);
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => ({ head: document.querySelector('.effort-read').innerText.replace(/\n+/g, ' / '), verdict: document.querySelector('#bay .verdict').innerText.slice(0, 200) }));
    console.log(JSON.stringify(st), JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
