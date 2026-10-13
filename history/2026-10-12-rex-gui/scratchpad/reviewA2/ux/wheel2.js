const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const fix of [false, true]) {
    const page = await open(b, { w: 1280, h: 900, state: { duoOpen: true }, wait: 3500 });
    if (fix) await page.addStyleTag({ content: '@media (min-width:920px){.panel-controls{overscroll-behavior:auto !important}}' });
    await page.mouse.move(120, 400);
    const log = [];
    for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(150); log.push(await page.evaluate(() => Math.round(scrollY) + '/' + Math.round(document.querySelector('aside').scrollTop))); }
    console.log('fix=' + fix, 'wheel over sidebar, page/aside:', log.join(' '));
    // keyboard: click a strength chip (focus stays on it), then PageDown
    await page.evaluate(() => { scrollTo(0, 0); document.querySelector('aside').scrollTop = 0; });
    await page.click('#tier-chips .chip:nth-child(3)');
    await page.waitForTimeout(800);
    const k = [];
    for (let i = 0; i < 6; i++) { await page.keyboard.press('PageDown'); await page.waitForTimeout(300); k.push(await page.evaluate(() => Math.round(scrollY) + '/' + Math.round(document.querySelector('aside').scrollTop))); }
    console.log('fix=' + fix, 'PageDown with focus on a strength chip, page/aside:', k.join(' '));
    await page.context().close();
  }
  await b.close();
})();
