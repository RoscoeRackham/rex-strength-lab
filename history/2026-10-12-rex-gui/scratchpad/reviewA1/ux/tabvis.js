const { NEW, OLD, launch } = require('./common');
(async () => {
  const b = await launch();
  for (const [lbl, url] of [['main', OLD()], ['new', NEW()]]) for (const duo of [false, true]) for (const [w, h] of [[1280, 900], [1024, 768]]) {
    const page = await b.newPage({ viewport: { width: w, height: h } });
    await page.goto(url); await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), lbl === 'new' ? { duoOpen: duo } : { group: duo ? 'duo' : 'solo' }); await page.reload(); await page.waitForTimeout(3000);
    if (lbl === 'new') await page.evaluate(() => { document.getElementById('powers').open = false; });
    await page.focus('#strength');
    const hidden = []; let n = 0;
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press('Tab'); await page.waitForTimeout(60);
      const r = await page.evaluate(() => { const a = document.activeElement; if (!a.closest('aside')) return null; const b = a.getBoundingClientRect(); return { id: a.id || a.tagName + ':' + a.textContent.trim().slice(0, 18), top: Math.round(b.top), vis: b.top >= 0 && b.bottom <= innerHeight }; });
      if (!r) break; n++;
      if (!r.vis) hidden.push(r.id + '@' + r.top);
    }
    console.log(lbl, w + 'x' + h, duo ? 'duo open' : 'solo', 'sidebar stops:', n, 'focused off-screen:', hidden.length ? hidden.join(', ') : 'none');
    await page.close();
  }
  await b.close();
})();
