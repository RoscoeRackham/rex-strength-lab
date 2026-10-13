const { BR, MAIN, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  for (const [name, url, st, vp, openP] of [
    ['branch duoOpen 1280x900 powers closed', BR, { duoOpen: true, duoAction: 'arm' }, { width: 1280, height: 900 }, false],
    ['main duo 1280x900', MAIN, { group: 'duo', duoAction: 'arm' }, { width: 1280, height: 900 }, false],
    ['branch duoOpen 1024x768 powers closed', BR, { duoOpen: true, duoAction: 'arm' }, { width: 1024, height: 768 }, false],
    ['main duo 1024x768', MAIN, { group: 'duo', duoAction: 'arm' }, { width: 1024, height: 768 }, false],
    ['main default 1024x768', MAIN, null, { width: 1024, height: 768 }, false],
  ]) {
    const { page, ctx } = await open(b, url, st, vp);
    await page.waitForTimeout(3000);
    const off = []; const seen = [];
    await page.evaluate(() => document.body.focus());
    for (let i = 0; i < 120; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(60);
      const r = await page.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const inAside = !!a.closest('.panel-controls'); const rc = a.getBoundingClientRect(); return { id: a.id || a.tagName + ':' + (a.textContent || '').slice(0, 20), inAside, top: Math.round(rc.top), bottom: Math.round(rc.bottom), H: innerHeight, y: Math.round(scrollY) }; });
      if (!r) continue;
      if (r.inAside) seen.push(r.id);
      if (r.inAside && (r.bottom > r.H || r.top < 0)) off.push(r.id + '@' + r.top + '-' + r.bottom + ' y=' + r.y);
    }
    console.log(name, 'sidebar stops', seen.length, 'off-screen:', off.length, JSON.stringify(off));
    await ctx.close();
  }
  await b.close();
})();
