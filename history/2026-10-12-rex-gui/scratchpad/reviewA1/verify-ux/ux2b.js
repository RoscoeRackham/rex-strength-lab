const { BR, MAIN, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  for (const [name, url, st, vSel, pSel] of [
    ['branch duoOpen arm', BR, { duoOpen: true, duoAction: 'arm' }, '#duo-bay .verdict', '#powers > summary'],
    ['branch duoOpen arm, Size&density closed', BR, { duoOpen: true, duoAction: 'arm', setupOpen: false }, '#duo-bay .verdict', '#powers > summary'],
    ['branch solo throw', BR, { action: 'throw' }, '#bay .verdict', '#powers > summary'],
    ['main duo arm', MAIN, { group: 'duo', duoAction: 'arm' }, '#bay .verdict', '#comic-setup > summary'],
    ['main solo throw', MAIN, { group: 'solo', action: 'throw' }, '#bay .verdict', '#comic-setup > summary'],
  ]) {
    const { page, ctx } = await open(b, url, st, { width: 1280, height: 900 });
    await page.waitForTimeout(3000);
    const r = await page.evaluate(async ([vSel, pSel]) => {
      const H = innerHeight, max = document.documentElement.scrollHeight - H;
      const vis = (q) => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= H && r.height > 0; };
      const rng = (arr) => { const out = []; let s = null, prev = null; for (const y of arr) { if (s == null) s = y; else if (y - prev > 25) { out.push([s, prev]); s = y; } prev = y; } if (s != null) out.push([s, prev]); return out; };
      const vY = [], pY = [], both = [];
      for (let y = 0; y <= max; y += 25) { window.scrollTo(0, y); await new Promise((r) => requestAnimationFrame(r)); const a = vis(vSel), p = vis(pSel); if (a) vY.push(y); if (p) pY.push(y); if (a && p) both.push(y); }
      window.scrollTo(0, 0);
      return { verdict: rng(vY), powers: rng(pY), both: rng(both), setupOpen: document.querySelector('#setup') && document.querySelector('#setup').open };
    }, [vSel, pSel]);
    console.log(name, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
