const { open, tab } = require('./lib');
(async () => {
  const { browser, page } = await open({ w: 1280, h: 900 });
  for (const [t, duo, sel, readSel] of [['throw', false, '#effort-use', '#bay .effort-read p'], ['walk', false, '#step-effort', '#bay .verdict'], ['arm', true, '#duo-effort-use', '#bay .effort-read p']]) {
    await tab(page, t, duo, 2500);
    // install a mutation counter on the bay
    await page.evaluate((rs) => { window.__changes = []; const read = () => { const e = document.querySelector(rs); return e ? e.innerText.slice(0, 60) : ''; }; window.__last = read(); window.__mo = new MutationObserver(() => { const r = read(); if (r !== window.__last) { window.__changes.push([performance.now(), r]); window.__last = r; } }); window.__mo.observe(document.querySelector('#bay'), { childList: true, subtree: true, characterData: true }); }, readSel);
    const box = await page.$eval(sel, (e) => { e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    const y = box.y + box.h / 2;
    const t0 = await page.evaluate(() => performance.now());
    await page.mouse.move(box.x + box.w * 0.5, y); await page.mouse.down();
    for (let i = 0; i < 60; i++) { await page.mouse.move(box.x + box.w * (0.5 - 0.4 * Math.sin(i / 60 * Math.PI)), y); await page.waitForTimeout(16); }
    const t1 = await page.evaluate(() => performance.now());
    await page.mouse.up();
    await page.waitForTimeout(800);
    const ch = await page.evaluate(() => { window.__mo.disconnect(); return window.__changes; });
    const during = ch.filter((c) => c[0] < t1).length, after = ch.filter((c) => c[0] >= t1).length;
    console.log(t, 'drag ms', Math.round(t1 - t0), 'readout changes during drag', during, 'after', after, ch.slice(0, 3).map((c) => [Math.round(c[0] - t0), c[1]]));
  }
  await browser.close();
})();
