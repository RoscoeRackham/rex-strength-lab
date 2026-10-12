const { launch, OUT, PREV } = require('./lib');
// Drag the effort slider with the mouse; record long tasks, renders, readout text and whether the slider survives.
(async () => {
  const b = await launch();
  const cases = [
    { name: 'throw-inf-real', st: { action: 'throw', inf: true, mode: 'real' }, sl: '#effort-use' },
    { name: 'throw-default', st: { action: 'throw' }, sl: '#effort-use' },
    { name: 'punch-inf-comic', st: { action: 'punch', inf: true }, sl: '#effort-use' },
    { name: 'jump-default', st: { action: 'jump' }, sl: '#effort-use' },
    { name: 'walk', st: { action: 'walk' }, sl: '#step-effort' },
    { name: 'duo-arm', st: { group: 'duo', duoAction: 'arm' }, sl: '#duo-effort-use' },
    { name: 'duo-catch', st: { group: 'duo', duoAction: 'catch' }, sl: '#duo-effort-use' },
  ];
  for (const cs of cases) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, cs.st);
    const t0 = Date.now();
    await page.goto(PREV);
    await page.waitForSelector(cs.sl, { timeout: 60000 });
    const loadMs = Date.now() - t0;
    await page.waitForTimeout(2500);
    await page.evaluate(() => {
      window.__lt = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: false });
      window.__muts = 0; new MutationObserver(() => window.__muts++).observe(document.querySelector('#bay'), { childList: true });
    });
    const sl = await page.$(cs.sl);
    await sl.scrollIntoViewIfNeeded();
    const box = await sl.boundingBox();
    const before = await page.evaluate((s) => ({ v: document.querySelector(s).value, vt: document.querySelector(s).getAttribute('aria-valuetext'), read: (document.querySelector('.effort-read') || {}).innerText, verdict: (document.querySelector('#bay .verdict') || {}).innerText }), cs.sl);
    const y = box.y + box.height / 2;
    const tStart = Date.now();
    await page.mouse.move(box.x + box.width * 0.9, y);
    await page.mouse.down();
    const samples = [];
    for (let i = 0; i <= 20; i++) {
      await page.mouse.move(box.x + box.width * (0.9 - 0.04 * i), y, { steps: 2 });
      await page.waitForTimeout(16);
      if (i % 5 === 0) samples.push(await page.evaluate((s) => { const e = document.querySelector(s); return { v: e && e.value, alive: !!e && e.isConnected }; }, cs.sl));
    }
    await page.mouse.up();
    const dragMs = Date.now() - tStart;
    await page.waitForTimeout(1500);
    const after = await page.evaluate((s) => ({ v: document.querySelector(s).value, vt: document.querySelector(s).getAttribute('aria-valuetext'), sel: (document.querySelector('#effort') || document.querySelector('#duo-effort') || {}).value, read: (document.querySelector('.effort-read') || {}).innerText, verdict: (document.querySelector('#bay .verdict') || {}).innerText, lt: window.__lt, muts: window.__muts, lbl: (document.querySelector('label[for="' + s.slice(1) + '"]') || {}).innerText }), cs.sl);
    console.log('==', cs.name, 'load', loadMs, 'ms; drag', dragMs, 'ms; errs', errs);
    console.log(' before', JSON.stringify(before).slice(0, 600));
    console.log(' samples', JSON.stringify(samples));
    console.log(' after', JSON.stringify(after).slice(0, 900));
    await ctx.close();
  }
  await b.close();
})();
