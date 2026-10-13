const { launch, openPage, waitIdle } = require('./lib');
(async () => {
  const b = await launch();
  const { page, ctx } = await openPage(b, 'branch', { duoOpen: true, duoAction: 'arm' }, { width: 1280, height: 900 });
  await waitIdle(page, '#duo-bay', 30000);
  await page.addStyleTag({ content: '@media (min-width: 920px) { .panel-controls { max-height: calc(100vh - 24px); overflow-y: auto; overscroll-behavior: contain; } }' });
  await page.evaluate(() => window.scrollTo(0, document.getElementById('duo').getBoundingClientRect().top + scrollY));
  await page.waitForTimeout(200);
  const aside = page.locator('aside.panel-controls');
  await aside.evaluate((a) => (a.scrollTop = a.scrollHeight));
  await page.waitForTimeout(100);
  console.log(JSON.stringify(await page.evaluate(() => { const r = (s) => { const b = document.querySelector(s).getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom)]; }; return { aside: r('aside.panel-controls'), surface: r('#surface'), powers: r('#powers > summary'), hScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth }; })));
  await ctx.close(); await b.close();
})();
