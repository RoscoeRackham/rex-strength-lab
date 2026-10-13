const { BR, MAIN, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  for (const [name, url, st, vp] of [
    ['branch duoOpen 1280x900', BR, { duoOpen: true, duoAction: 'arm' }, { width: 1280, height: 900 }],
    ['main duo 1280x900', MAIN, { group: 'duo', duoAction: 'arm' }, { width: 1280, height: 900 }],
  ]) {
    const { page, ctx } = await open(b, url, st, vp);
    await page.waitForTimeout(3000);
    await page.evaluate(() => document.body.focus());
    const log = [];
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab');
      const t = [];
      for (const w of [0, 60, 600]) {
        if (w) await page.waitForTimeout(w);
        t.push(await page.evaluate(() => { const a = document.activeElement; const rc = a.getBoundingClientRect(); return { id: a.id || a.tagName + ':' + (a.textContent || '').slice(0, 14), inAside: !!a.closest('.panel-controls'), top: Math.round(rc.top), b: Math.round(rc.bottom), y: Math.round(scrollY), asideTop: Math.round(document.querySelector('.panel-controls').getBoundingClientRect().top) }; }));
      }
      if (t[0].inAside && t.some((x) => x.b > 900 || x.top < 0)) log.push(t.map((x) => x.id + ' top=' + x.top + ' y=' + x.y + ' aside=' + x.asideTop).join(' | '));
    }
    console.log(name); log.forEach((l) => console.log('  ', l));
    await ctx.close();
  }
  await b.close();
})();
