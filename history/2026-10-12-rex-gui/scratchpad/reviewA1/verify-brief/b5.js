const { launch, openPage, waitIdle } = require('./lib');
(async () => {
  const b = await launch();
  for (const vp of [{ width: 1280, height: 900 }, { width: 1440, height: 900 }, { width: 1280, height: 1080 }]) {
    const { page, ctx } = await openPage(b, 'branch', { duoOpen: true, duoAction: 'arm' }, vp);
    await waitIdle(page, '#duo-bay', 30000);
    const m = async (label) => console.log(vp.width + 'x' + vp.height + ' ' + label + ': ' + JSON.stringify(await page.evaluate(() => {
      const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom)]; };
      return { vh: innerHeight, scrollY: Math.round(scrollY), aside: r('aside.panel-controls'), setupOpen: (document.querySelector('#setup') || document.querySelector('details.setup')).open, powersOpen: document.getElementById('powers').open, powersSummary: r('#powers > summary'), boltRex: r('#bolt-rex'), duoBay: r('#duo-bay'), duoTop: r('#duo') };
    })));
    await page.evaluate(() => window.scrollTo(0, document.getElementById('duo-bay').getBoundingClientRect().top + scrollY));
    await page.waitForTimeout(200);
    await m('duo-bay top at viewport top, powers closed');
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.waitForTimeout(200);
    await m('same, powers opened');
    // max reachable scroll position of the sidebar bottom while duo element is visible: scroll to the end of duo bay
    await page.evaluate(() => { const d = document.getElementById('duo-bay'); window.scrollTo(0, d.getBoundingClientRect().bottom + scrollY - innerHeight); });
    await page.waitForTimeout(200);
    await m('scrolled to the bottom of duo-bay, powers open');
    await page.screenshot({ path: 'b5-' + vp.width + 'x' + vp.height + '.png' });
    await ctx.close();
  }
  // main for comparison: duo group
  const { page, ctx } = await openPage(b, 'main', { group: 'duo', duoAction: 'arm' }, { width: 1280, height: 900 });
  await waitIdle(page, '#bay', 30000);
  await page.evaluate(() => window.scrollTo(0, document.getElementById('bay').getBoundingClientRect().top + scrollY));
  await page.waitForTimeout(200);
  console.log('main 1280x900, bay top at viewport top: ' + JSON.stringify(await page.evaluate(() => { const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom)]; }; return { aside: r('aside.panel-controls'), comic: r('#comic-setup > summary'), anchorSel: r('#anchor') }; })));
  await ctx.close();
  await b.close();
})();
