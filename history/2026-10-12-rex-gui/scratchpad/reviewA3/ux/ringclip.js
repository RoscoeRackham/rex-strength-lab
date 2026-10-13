// Tab through the sticky sidebar: is any focused control's 3px+2px focus ring cut off by the sidebar's scroll box?
const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [w, h] of [[1280, 900], [1024, 768], [1366, 768], [1280, 720]]) for (const dir of ['Tab', 'Shift+Tab']) {
    const page = await open(b, { w, h, wait: 3000 });
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    if (dir === 'Tab') await page.focus('#strength'); else { await page.focus('#tab-throw'); }
    const clipped = [];
    let shot = false;
    for (let i = 0; i < 45; i++) {
      await page.keyboard.press(dir); await page.waitForTimeout(60);
      const r = await page.evaluate(() => {
        const a = document.activeElement, aside = document.querySelector('aside.panel-controls');
        if (!aside.contains(a) || a === aside) return null;
        const rc = a.getBoundingClientRect(), sp = aside.getBoundingClientRect();
        const bl = parseFloat(getComputedStyle(aside).borderTopWidth) || 0;
        const top = sp.top + bl, bottom = sp.bottom - bl;
        const ringTop = rc.top - 5, ringBottom = rc.bottom + 5;
        const cutTop = Math.max(0, top - ringTop), cutBottom = Math.max(0, ringBottom - bottom);
        return { id: a.id || a.tagName + ':' + a.textContent.trim().slice(0, 18), cutTop: Math.round(cutTop * 10) / 10, cutBottom: Math.round(cutBottom * 10) / 10, scroll: Math.round(aside.scrollTop), elTop: Math.round(rc.top - top), elBottom: Math.round(bottom - rc.bottom) };
      });
      if (!r) continue;
      if (r.cutTop > 0 || r.cutBottom > 0) { clipped.push(r); if (!shot) { shot = true; await page.screenshot({ path: S + '/shots/ringclip-' + w + 'x' + h + '-' + dir.replace('+', '') + '.png', clip: { x: 0, y: 0, width: Math.min(w, 420), height: h } }); } }
    }
    console.log(w + 'x' + h, dir, 'clipped rings:', clipped.length, JSON.stringify(clipped.slice(0, 6)));
    await page.context().close();
  }
  await b.close();
})();
