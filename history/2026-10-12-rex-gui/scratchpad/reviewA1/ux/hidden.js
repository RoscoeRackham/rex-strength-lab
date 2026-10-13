const { NEW, OLD, launch } = require('./common');
(async () => {
  const b = await launch();
  for (const [lbl, url, det] of [['main', OLD(), 'comic-setup'], ['new', NEW(), 'powers']]) {
    const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(url); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(1500);
    const r = await page.evaluate((det) => { document.getElementById(det).open = true; const out = {};
      for (const n of document.querySelectorAll('[hidden]')) { const cs = getComputedStyle(n); if (cs.display !== 'none') out[n.id || n.className] = cs.display + ' h=' + Math.round(n.getBoundingClientRect().height); }
      return out; }, det);
    console.log(lbl, 'hidden but displayed:', JSON.stringify(r));
    await page.close();
  }
  await b.close();
})();
