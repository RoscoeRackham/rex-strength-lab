const { BR, MAIN, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  const cases = [
    ['branch duoOpen', BR, { duoOpen: true, duoAction: 'arm' }, '#powers > summary', false],
    ['branch duoOpen + fix CSS', BR, { duoOpen: true, duoAction: 'arm' }, '#powers > summary', true],
    ['branch closed duo', BR, null, '#powers > summary', false],
    ['main solo', MAIN, null, '#comic-setup > summary', false],
    ['main duo', MAIN, { group: 'duo', duoAction: 'arm' }, '#comic-setup > summary', false],
  ];
  for (const [name, url, st, q, fix] of cases) {
    const { page, ctx } = await open(b, url, st, { width: 1280, height: 900 });
    await page.waitForTimeout(3000);
    if (fix) await page.addStyleTag({ content: '@media (min-width: 920px) { .panel-controls { max-height: calc(100dvh - 24px); overflow-y: auto; overscroll-behavior: contain; } }' });
    const res = [];
    for (const y0 of [352, 1500]) {
      await page.evaluate((y) => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, y); }, y0);
      await page.waitForTimeout(200);
      await page.focus(q);
      await page.waitForTimeout(500);
      res.push(await page.evaluate(([q, y0]) => { const e = document.querySelector(q); const r = e.getBoundingClientRect(); const v = document.querySelector('#duo-bay .verdict') || document.querySelector('#bay .verdict'); const vr = v && v.getBoundingClientRect(); return 'from y=' + y0 + ' -> y=' + Math.round(scrollY) + ' summary top=' + Math.round(r.top) + ' bottom=' + Math.round(r.bottom) + ' onscreen=' + (r.top >= 0 && r.bottom <= innerHeight) + ' verdict top=' + (vr ? Math.round(vr.top) : '-'); }, [q, y0]));
    }
    console.log(name, JSON.stringify(res, null, 1));
    await ctx.close();
  }
  await b.close();
})();
