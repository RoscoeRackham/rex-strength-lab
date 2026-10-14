const { BR, MAIN, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  for (const [name, url, st, vp] of [
    ['branch default 1280x900', BR, null, { width: 1280, height: 900 }],
    ['main default 1280x900', MAIN, null, { width: 1280, height: 900 }],
    ['branch duoOpen arm 1280x900', BR, { duoOpen: true, duoAction: 'arm' }, { width: 1280, height: 900 }],
    ['main duo arm 1280x900', MAIN, { group: 'duo', duoAction: 'arm' }, { width: 1280, height: 900 }],
  ]) {
    const { page, ctx } = await open(b, url, st, vp);
    await page.waitForTimeout(2500);
    const r = await page.evaluate(() => {
      const a = document.querySelector('.panel-controls'); const ar = a.getBoundingClientRect();
      const kids = Array.from(a.querySelectorAll(':scope > details, :scope > section, :scope > div, :scope > *')).map((k) => { const kr = k.getBoundingClientRect(); return (k.id || k.className || k.tagName) + '@' + Math.round(kr.top - ar.top) + (k.tagName === 'DETAILS' ? (k.open ? '(open)' : '(closed)') : ''); });
      return { asideH: Math.round(ar.height), docH: document.documentElement.scrollHeight, kids };
    });
    console.log(name, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
