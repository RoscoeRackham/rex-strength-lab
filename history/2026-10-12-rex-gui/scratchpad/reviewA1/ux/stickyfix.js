const { NEW, launch, DIR, path } = require('./common');
(async () => {
  const b = await launch();
  for (const fix of [false, true]) {
    const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(NEW()); await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' }))); await page.reload(); await page.waitForTimeout(3000);
    if (fix) await page.addStyleTag({ content: '@media (min-width: 920px) { .panel-controls { max-height: calc(100dvh - 24px); overflow-y: auto; overscroll-behavior: contain; } }' });
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    // scroll so the duo verdict is on screen
    await page.evaluate(() => { const v = document.querySelector('#duo-bay .verdict'); window.scrollTo(0, v.getBoundingClientRect().top + scrollY - 300); });
    await page.waitForTimeout(200);
    // a keyboard user tabs to the Ollie Bolted switch: does focusing it scroll the page away from the duo result?
    await page.focus('#bolt-ollie'); await page.waitForTimeout(200);
    const r = await page.evaluate(() => { const v = document.querySelector('#duo-bay .verdict').getBoundingClientRect(); const bo = document.getElementById('bolt-ollie').getBoundingClientRect(); return { scrollY: Math.round(scrollY), verdictTop: Math.round(v.top), boltTop: Math.round(bo.top), bothVisible: v.top >= 0 && v.bottom <= innerHeight && bo.top >= 0 && bo.bottom <= innerHeight }; });
    console.log(fix ? 'with fix' : 'as built', JSON.stringify(r));
    await page.screenshot({ path: path.join(DIR, 'shots', 'sticky-' + (fix ? 'fix' : 'asbuilt') + '.png') });
    await page.close();
  }
  await b.close();
})();
