const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname;
(async () => {
  for (const [name, opts] of [
    ['default-headless', {}],
    ['classic', { ignoreDefaultArgs: ['--hide-scrollbars'] }],
    ['overlay', { ignoreDefaultArgs: ['--hide-scrollbars'], args: ['--enable-features=OverlayScrollbar,OverlayScrollbarFlashAfterAnyScrollUpdate,OverlayScrollbarFlashWhenMouseEnter'] }],
  ]) {
    const b = await chromium.launch(Object.assign({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }, opts));
    const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await p.goto('file://' + D + '/branch.html'); await p.waitForTimeout(1500);
    await p.evaluate(() => window.scrollTo(0, 400)); await p.waitForTimeout(1500);
    const m = await p.evaluate(() => { const a = document.querySelector('.panel-controls'); return { offsetW: a.offsetWidth, clientW: a.clientWidth, border: getComputedStyle(a).borderLeftWidth }; });
    await p.mouse.move(900, 500); await p.waitForTimeout(1500);
    await p.screenshot({ path: D + '/sb-' + name + '.png', clip: { x: 0, y: 0, width: 640, height: 900 } });
    console.log(name, JSON.stringify(m));
    await b.close();
  }
})();
