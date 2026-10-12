const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  for (const [name, st, sel, key, n] of [
    ['throw effort', { action: 'throw' }, '#effort-use', 'ArrowLeft', 60],
    ['walk step', { action: 'walk' }, '#step-effort', 'ArrowRight', 70],
    ['duo arm', { group: 'duo', duoAction: 'arm' }, '#duo-effort-use', 'ArrowLeft', 40],
  ]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('x', 1); } }, st);
    await page.goto(PREV); await page.waitForTimeout(1500);
    await page.focus(sel);
    const r0 = await page.evaluate((s) => ({ v: document.querySelector(s).value, vt: document.querySelector(s).getAttribute('aria-valuetext') }), sel);
    for (let i = 0; i < n; i++) await page.keyboard.press(key);
    await page.waitForTimeout(600);
    const r1 = await page.evaluate((s) => ({ v: document.querySelector(s).value, vt: document.querySelector(s).getAttribute('aria-valuetext'), focused: document.activeElement && document.activeElement.id, head: (document.querySelector('.effort-read p') || {}).innerText, verdict: (document.querySelector('#bay .verdict') || {}).innerText, live: document.querySelector('#bay-live').textContent }), sel);
    console.log('==', name, JSON.stringify(r0), '\n  after', n, key, JSON.stringify(r1));
    await ctx.close();
  }
  await b.close();
})();
