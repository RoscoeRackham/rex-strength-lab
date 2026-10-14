// The sticky sidebar beside the open element at 1280x900, light and dark: screenshots while reading the element
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  for (const scheme of ['light', 'dark']) {
    const { page } = await open(browser, { w: 1280, h: 900, scheme, state: { duoOpen: true, duoAction: 'collide' } });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { document.getElementById('powers').open = true; window.scrollTo(0, document.getElementById('duo').getBoundingClientRect().top + scrollY - 20); });
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => { const a = document.querySelector('.panel-controls').getBoundingClientRect(); const c = document.getElementById('more-below'); return { asideTop: Math.round(a.top), asideBottom: Math.round(a.bottom), cue: c.hidden ? null : c.textContent }; });
    console.log(scheme, JSON.stringify(r));
    await page.screenshot({ path: __dirname + '/shots/stuck-1280-' + scheme + '.png' });
    // then the end of the element: does the sidebar leave with the rig, never overlapping the ladder?
    await page.evaluate(() => { const d = document.getElementById('duo').getBoundingClientRect(); window.scrollTo(0, d.bottom + scrollY - 300); });
    await page.waitForTimeout(300);
    const e = await page.evaluate(() => { const a = document.querySelector('.panel-controls').getBoundingClientRect(), rig = document.querySelector('.rig').getBoundingClientRect(); return { asideBottom: Math.round(a.bottom), rigBottom: Math.round(rig.bottom) }; });
    console.log('  end of element', JSON.stringify(e));
    await page.context().close();
  }
  await browser.close();
})();
