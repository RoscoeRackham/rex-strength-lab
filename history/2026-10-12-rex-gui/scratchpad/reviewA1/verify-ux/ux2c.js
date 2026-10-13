const { BR, MAIN, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  for (const [name, url, st, vp] of [
    ['branch duoOpen 1280x900', BR, { duoOpen: true, duoAction: 'arm' }, { width: 1280, height: 900 }],
    ['branch default 1280x900', BR, null, { width: 1280, height: 900 }],
    ['main default 1280x900', MAIN, null, { width: 1280, height: 900 }],
    ['main duo 1280x900', MAIN, { group: 'duo', duoAction: 'arm' }, { width: 1280, height: 900 }],
    ['branch duoOpen 1024x768', BR, { duoOpen: true, duoAction: 'arm' }, { width: 1024, height: 768 }],
    ['main default 1024x768', MAIN, null, { width: 1024, height: 768 }],
  ]) {
    const { page, ctx } = await open(b, url, st, vp);
    await page.waitForTimeout(3000);
    // open Their powers / comic switches so their controls are tabbable
    await page.evaluate(() => { for (const q of ['#powers', '#comic-setup', '#ollie-setup']) { const d = document.querySelector(q); if (d) d.open = true; } });
    await page.waitForTimeout(1500);
    const off = [];
    await page.evaluate(() => document.body.focus());
    for (let i = 0; i < 160; i++) {
      await page.keyboard.press('Tab');
      const r = await page.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const inAside = !!a.closest('.panel-controls'); const rc = a.getBoundingClientRect(); return { id: a.id || a.tagName + ':' + (a.textContent || '').slice(0, 20), inAside, top: Math.round(rc.top), bottom: Math.round(rc.bottom), H: innerHeight, y: Math.round(scrollY) }; });
      if (!r) continue;
      if (!r.inAside) { if (off.length || i > 5) {} }
      if (r.inAside && (r.bottom > r.H || r.top < 0)) off.push(r.id + '@' + r.top + '-' + r.bottom + ' y=' + r.y);
    }
    console.log(name, 'sidebar focus off-screen:', off.length, JSON.stringify(off.slice(0, 12)));
    await ctx.close();
  }
  await b.close();
})();
