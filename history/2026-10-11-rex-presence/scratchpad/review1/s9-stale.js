const { launch, OUT, PREV } = require('./lib');
// Does the effort slider follow the strength dial? Move the dial (input events, as a drag does), then read the slider.
(async () => {
  const b = await launch();
  for (const [name, st, sel] of [['throw', { action: 'throw' }, '#effort-use'], ['duo-arm', { group: 'duo', duoAction: 'arm' }, '#duo-effort-use'], ['walk', { action: 'walk' }, '#step-effort']]) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('x', 1); } }, st);
    await page.goto(PREV); await page.waitForTimeout(1500);
    const rd = () => page.evaluate((s) => { const e = document.querySelector(s); return { min: (+e.min).toFixed(2), max: (+e.max).toFixed(2), v: (+e.value).toFixed(2), vt: e.getAttribute('aria-valuetext'), sel: (document.querySelector('#effort') || document.querySelector('#duo-effort') || {}).value, head: ((document.querySelector('.effort-read p') || {}).innerText || '').slice(0, 140), dial: document.querySelector('#dial-big').innerText, liveLive: document.querySelector('#bay-live').textContent.slice(0, 80) }; }, sel);
    console.log('==', name, 'before', JSON.stringify(await rd()));
    for (const target of [7, 3.2]) {
      await page.evaluate((t) => { const s = document.querySelector('#strength'); const v0 = +s.value; for (let i = 1; i <= 10; i++) { s.value = String(v0 + (t - v0) * i / 10); s.dispatchEvent(new Event('input', { bubbles: true })); } }, target);
      await page.waitForTimeout(3000);
      console.log('   dial ->', target, JSON.stringify(await rd()));
    }
    // now drag the effort slider to its right end: what effort does that set?
    await page.evaluate((s) => { const e = document.querySelector(s); e.value = e.max; e.dispatchEvent(new Event('input', { bubbles: true })); }, sel);
    await page.waitForTimeout(1500);
    console.log('   effort slider to its right end', JSON.stringify(await rd()));
    await ctx.close();
  }
  await b.close();
})();
