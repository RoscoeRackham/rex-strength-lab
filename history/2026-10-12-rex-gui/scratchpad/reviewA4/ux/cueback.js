// Shift+Tab from Rex's selected tab back into the sidebar: is the control focused under the cue?
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  for (const file of [process.argv[2] || 'branch.html']) for (const [w, h] of [[1280, 900], [1366, 768], [1024, 768], [1920, 1080]]) for (const powersOpen of [false, true]) {
    const { page } = await open(browser, { w, h, file });
    if (powersOpen) await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.waitForTimeout(300);
    await page.focus('#tab-throw');
    const seq = [];
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Shift+Tab'); await page.waitForTimeout(150);
      seq.push(await page.evaluate(() => {
        const a = document.activeElement, cue = document.getElementById('more-below');
        const ar = a.getBoundingClientRect(), cr = cue.getBoundingClientRect(); const shown = !cue.hidden && cr.height > 0;
        const ov = shown ? Math.max(0, Math.min(ar.bottom, cr.bottom) - Math.max(ar.top, cr.top)) : 0;
        const c = document.elementFromPoint((ar.left + ar.right) / 2, (ar.top + ar.bottom) / 2);
        return (a.id || a.tagName + ':' + a.textContent.trim().slice(0, 14)) + (ov ? ' [under cue ' + Math.round(ov) + '/' + Math.round(ar.height) + ' px' + (c === cue ? ', centre covered' : '') + ']' : '');
      }));
    }
    console.log(file, w + 'x' + h, 'powers', powersOpen ? 'open  ' : 'closed', seq.join(' <- '));
    await page.context().close();
  }
  await browser.close();
})();
