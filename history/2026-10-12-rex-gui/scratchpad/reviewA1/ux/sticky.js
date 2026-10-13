const { NEW, OLD, launch, DIR, path } = require('./common');
(async () => {
  const b = await launch();
  for (const [lbl, url] of [['main', OLD()], ['new', NEW()]]) for (const vh of [900, 768]) for (const open of [false, true]) {
    const page = await b.newPage({ viewport: { width: 1280, height: vh } });
    await page.goto(url); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(2000);
    if (open) {
      if (lbl === 'new') { await page.click('#duo > summary'); }
      else { await page.click('#grp-duo'); }
      await page.waitForTimeout(3000);
    }
    const res = await page.evaluate(async (lbl) => {
      const vis = (s) => { const n = document.querySelector(s); if (!n) return false; const r = n.getBoundingClientRect(); return r.height > 0 && r.top >= 0 && r.bottom <= innerHeight; };
      const powSel = lbl === 'new' ? '#powers > summary' : '#comic-setup > summary';
      const boltSel = lbl === 'new' ? '#bolt-ollie' : '#o-anchor';
      const H = document.documentElement.scrollHeight;
      const rigBottom = document.querySelector('.rig').getBoundingClientRect().bottom + scrollY;
      const out = { asideH: Math.round(document.querySelector('aside').getBoundingClientRect().height), rigBottom: Math.round(rigBottom), powVisAt: [], duoTabsVisAt: [], verdictVisAt: [] };
      for (let y = 0; y < rigBottom; y += 25) {
        window.scrollTo(0, y); await new Promise((r) => requestAnimationFrame(r));
        if (vis(powSel)) out.powVisAt.push(y);
        if (vis(lbl === 'new' ? '#duo-tabs' : '#tabs')) out.duoTabsVisAt.push(y);
        if (vis(lbl === 'new' ? (document.getElementById('duo').open ? '#duo-bay .verdict' : '#bay .verdict') : '#bay .verdict')) out.verdictVisAt.push(y);
      }
      const rng = (a) => a.length ? a[0] + '-' + a[a.length - 1] + ' (' + a.length + ' stops)' : 'never';
      const both = out.powVisAt.filter((y) => out.verdictVisAt.includes(y));
      return { asideH: out.asideH, rigBottom: out.rigBottom, powersSummaryVisible: rng(out.powVisAt), tabsVisible: rng(out.duoTabsVisAt), resultVerdictVisible: rng(out.verdictVisAt), powersAndVerdictTogether: rng(both) };
    }, lbl);
    console.log(lbl, '1280x' + vh, open ? 'duo open' : 'solo', JSON.stringify(res));
    await page.close();
  }
  await b.close();
})();
