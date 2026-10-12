// Mouse-drag the two-player sliders (#duo-effort-use, #o-effort-use, and Catch's #c-dist for comparison): does the drag
// keep working? Record the element's identity, focus at each input event, and the value after each move.
const { launch, open, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  const runs = [
    ['catch', '#duo-effort-use', { group: 'duo', duoAction: 'catch' }],
    ['arm', '#duo-effort-use', { group: 'duo', duoAction: 'arm' }],
    ['collide', '#duo-effort-use', { group: 'duo', duoAction: 'collide' }],
    ['catch c-dist', '#c-dist', { group: 'duo', duoAction: 'catch' }],
    ['arm o-effort', '#o-effort-use', { group: 'duo', duoAction: 'arm', oEffortOwn: true }],
    ['solo throw', '#effort-use', { group: 'solo', action: 'throw' }],
  ];
  for (const [label, sel, st] of runs) {
    const { ctx, page, errs } = await open(b, 1280, 900, 'light', { storage: JSON.stringify(st), wait: 2500 });
    if (st.oEffortOwn) { await page.evaluate(() => { const d = document.querySelector('#bay details.effort-adjust'); if (d) d.open = true; }); await page.waitForTimeout(100); await page.click('#o-effort-own'); await page.waitForTimeout(1500); }
    await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details.effort-adjust')) d.open = true; });
    await page.waitForTimeout(300);
    await page.evaluate((s) => {
      window.__log = [];
      const e = document.querySelector(s); e.dataset.tag = 'orig';
      document.addEventListener('input', (ev) => { if (ev.target.matches && ev.target.matches(s)) window.__log.push({ v: ev.target.value, focus: document.activeElement && (document.activeElement.id || document.activeElement.tagName), orig: ev.target.dataset.tag === 'orig' }); }, true);
    }, sel);
    const el = await page.$(sel);
    await el.scrollIntoViewIfNeeded();
    const box = await el.boundingBox();
    const y = box.y + box.height / 2, x0 = box.x + 8, x1 = box.x + box.width - 8;
    await page.mouse.move(x0 + (x1 - x0) * 0.2, y); await page.mouse.down();
    for (let i = 0; i <= 20; i++) { await page.mouse.move(x0 + (x1 - x0) * (0.2 + 0.6 * i / 20), y); await page.waitForTimeout(30); }
    await page.mouse.up(); await page.waitForTimeout(1200);
    const res = await page.evaluate((s) => { const e = document.querySelector(s); return { log: window.__log, now: e && e.value, stillOrig: e && e.dataset.tag === 'orig', min: e && e.min, max: e && e.max }; }, sel);
    const vals = [...new Set(res.log.map((x) => Number(x.v).toFixed(2)))];
    console.log(label, sel, 'inputs', res.log.length, 'distinct values', vals.length, JSON.stringify(vals.slice(0, 6)), 'focus at first input', res.log[0] && res.log[0].focus, '| final', Number(res.now).toFixed(2), 'expected about', (Number(res.min) + 0.8 * (Number(res.max) - Number(res.min))).toFixed(2), 'same element', res.stillOrig, errs.length ? errs : '');
    await ctx.close();
  }
  await b.close();
})();
