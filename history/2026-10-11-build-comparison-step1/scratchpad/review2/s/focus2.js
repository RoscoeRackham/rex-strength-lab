const { open, SHOTS } = require('./h.js');
(async () => {
  for (const dark of [false, true]) {
    const { browser, p } = await open({ w: 390, h: 844, dark, fonts: false, dpr: 2 });
    for (const id of ['hSame', 'hReal', 'vFront', 'vSide', 'zAll', 'zHum']) {
      const st = await p.evaluate((id) => { const el = document.getElementById(id); el.focus({ focusVisible: true }); const cs = getComputedStyle(el); return { fv: el.matches(':focus-visible'), oc: cs.outlineColor, oo: cs.outlineOffset, bg: cs.backgroundColor, pressed: el.getAttribute('aria-pressed'), parentBg: getComputedStyle(el.parentElement).backgroundColor }; }, id);
      console.log(dark ? 'dark ' : 'light', id, JSON.stringify(st));
    }
    // L13: a figure cell (2nd in a row): screenshot ring
    const box = await p.evaluate(() => { const c = document.querySelectorAll('.fig')[1]; c.scrollIntoView({ block: 'center' }); c.focus({ focusVisible: true }); const r = c.getBoundingClientRect(); return { x: r.x - 4, y: r.y - 4, width: r.width + 8, height: Math.min(r.height + 8, 400) }; });
    await p.screenshot({ path: SHOTS + '/focus-fig' + (dark ? '-dark' : '') + '.png', clip: box });
    await browser.close();
  }
})();
