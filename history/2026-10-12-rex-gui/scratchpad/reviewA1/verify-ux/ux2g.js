const { BR, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  for (const fix of [false, true]) {
    const { page, ctx } = await open(b, BR, { duoOpen: true, duoAction: 'arm', powersOpen: true }, { width: 1280, height: 900 });
    await page.waitForTimeout(3000);
    if (fix) await page.addStyleTag({ content: '@media (min-width: 920px) { .panel-controls { max-height: calc(100dvh - 24px); overflow-y: auto; overscroll-behavior: contain; } }' });
    await page.evaluate(() => { document.querySelector('#powers').open = true; });
    await page.waitForTimeout(500);
    // focus Rex's first tab, then Shift+Tab back into the sidebar several times
    await page.focus('#bolt-ollie').catch(() => {});
    await page.evaluate(() => window.scrollTo(0, 1600));
    await page.waitForTimeout(200);
    await page.focus('#bolt-ollie');
    await page.waitForTimeout(400);
    console.log('fix=' + fix, await page.evaluate(() => { const e = document.querySelector('#bolt-ollie'); const r = e.getBoundingClientRect(); return '#bolt-ollie exists=' + !!e + ' y=' + Math.round(scrollY) + ' top=' + Math.round(r.top) + ' onscreen=' + (r.top >= 0 && r.bottom <= innerHeight); }));
    // shift-tab from first Rex tab
    const t = await page.evaluate(() => { const x = document.querySelector('#tabs [aria-selected=true]'); x.focus(); return x.id; });
    const out = [];
    for (let i = 0; i < 4; i++) { await page.keyboard.press('Shift+Tab'); await page.waitForTimeout(300); out.push(await page.evaluate(() => { const a = document.activeElement; const r = a.getBoundingClientRect(); return (a.id || a.tagName) + ' top=' + Math.round(r.top) + ' y=' + Math.round(scrollY) + (r.top >= 0 && r.bottom <= innerHeight ? ' ok' : ' OFFSCREEN'); })); }
    console.log('  shift-tab from', t, JSON.stringify(out));
    await ctx.close();
  }
  await b.close();
})();
