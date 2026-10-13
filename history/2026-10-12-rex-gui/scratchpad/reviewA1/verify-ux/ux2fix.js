const { BR, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  for (const vp of [{ width: 1280, height: 900 }, { width: 1024, height: 768 }]) {
    const { page, ctx } = await open(b, BR, { duoOpen: true, duoAction: 'arm' }, vp);
    await page.addStyleTag({ content: '@media (min-width: 920px) { .panel-controls { max-height: calc(100dvh - 24px); overflow-y: auto; overscroll-behavior: contain; } }' });
    await page.waitForTimeout(3000);
    const off = []; let n = 0;
    await page.evaluate(() => document.body.focus());
    for (let i = 0; i < 120; i++) {
      await page.keyboard.press('Tab'); await page.waitForTimeout(60);
      const r = await page.evaluate(() => { const a = document.activeElement; const rc = a.getBoundingClientRect(); return { id: a.id || a.tagName, inAside: !!a.closest('.panel-controls'), top: Math.round(rc.top), b: Math.round(rc.bottom), H: innerHeight }; });
      if (r.inAside) { n++; if (r.b > r.H || r.top < 0) off.push(r.id + '@' + r.top); }
    }
    console.log(JSON.stringify(vp), 'with fix: sidebar stops', n, 'off-screen', JSON.stringify(off), 'hscroll', await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
    await ctx.close();
  }
  await b.close();
})();
