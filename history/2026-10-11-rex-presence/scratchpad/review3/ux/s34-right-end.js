// Drag the effort slider all the way right with the mouse (past the end) at the default strength: is it all-out?
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  for (const [st, sel] of [[{ group: 'solo', action: 'throw' }, '#effort-use'], [{ group: 'solo', action: 'stomp' }, '#effort-use'], [{ group: 'duo', duoAction: 'arm' }, '#duo-effort-use']]) {
    const { ctx, page } = await open(b, 1280, 900, 'light', { storage: JSON.stringify(st), wait: 1500 });
    await page.evaluate(() => { document.querySelector('#bay details.effort-adjust').open = true; });
    await page.waitForTimeout(200);
    const el = await page.$(sel); await el.scrollIntoViewIfNeeded();
    const box = await el.boundingBox(), y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width * 0.5, y); await page.mouse.down();
    for (let i = 0; i <= 10; i++) { await page.mouse.move(box.x + box.width * (0.5 + 0.6 * i / 10), y); await page.waitForTimeout(20); }
    await page.mouse.up(); await page.waitForTimeout(800);
    const r = await page.evaluate((s) => { const e = document.querySelector(s); return { min: e.min, max: e.max, value: e.value, gap: (Number(e.max) - Number(e.value)).toFixed(4), stepsByJS: ((Number(e.max) - Number(e.min)) / 0.01), vt: e.getAttribute('aria-valuetext'), read: document.querySelector('#bay .effort-read p').innerText, verdict: document.querySelector('#bay .verdict').innerText.slice(0, 90) }; }, sel);
    console.log(JSON.stringify(st), JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
