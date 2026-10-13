const { NEW, launch, DIR, path } = require('./common');
(async () => {
  const b = await launch();
  for (const fix of [false, true]) for (const target of ['duo', 'solo']) {
    const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(NEW()); await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm' }))); await page.reload(); await page.waitForTimeout(3000);
    if (fix) await page.addStyleTag({ content: '@media (min-width: 920px) { .panel-controls { max-height: calc(100dvh - 24px); overflow-y: auto; overscroll-behavior: contain; } }' });
    const sel = target === 'duo' ? '#duo-bay .verdict' : '#bay .verdict';
    await page.evaluate((sel) => { const v = document.querySelector(sel); window.scrollTo(0, Math.max(0, v.getBoundingClientRect().top + scrollY - 300)); }, sel);
    await page.waitForTimeout(200);
    const before = await page.evaluate(() => Math.round(scrollY));
    await page.focus('#powers > summary'); await page.waitForTimeout(300);
    const r = await page.evaluate((sel) => { const v = document.querySelector(sel).getBoundingClientRect(); const s = document.querySelector('#powers > summary').getBoundingClientRect(); return { scrollY: Math.round(scrollY), verdictTop: Math.round(v.top), powersSummaryTop: Math.round(s.top), verdictOnScreen: v.bottom > 0 && v.top < innerHeight, summaryOnScreen: s.top >= 0 && s.bottom <= innerHeight }; }, sel);
    console.log((fix ? 'with fix ' : 'as built ') + target + ' result; scrollY before focus ' + before, JSON.stringify(r));
    await page.close();
  }
  await b.close();
})();
