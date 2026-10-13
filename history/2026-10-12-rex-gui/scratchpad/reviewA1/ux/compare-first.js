const { NEW, OLD, launch, DIR, path } = require('./common');
(async () => {
  const b = await launch();
  for (const [lbl, url] of [['main', OLD()], ['new', NEW()]]) for (const [w, h] of [[360, 740], [390, 844], [768, 1024], [1280, 900]]) {
    const page = await b.newPage({ viewport: { width: w, height: h } });
    await page.goto(url); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(2500);
    const info = await page.evaluate(() => {
      const top = (s) => { const n = document.querySelector(s); return n ? Math.round(n.getBoundingClientRect().top + scrollY) : null; };
      return { aside: [top('aside.panel-controls'), Math.round(document.querySelector('aside.panel-controls').getBoundingClientRect().height)], tabs: top('#tabs'), verdict: top('#bay .verdict'), docH: document.documentElement.scrollHeight };
    });
    console.log(lbl, w + 'x' + h, JSON.stringify(info));
    await page.screenshot({ path: path.join(DIR, 'shots', `cmp-${lbl}-${w}.png`), fullPage: false, clip: { x: 0, y: 0, width: w, height: Math.min(2600, info.docH) } }).catch(async () => { await page.screenshot({ path: path.join(DIR, 'shots', `cmp-${lbl}-${w}.png`), fullPage: true }); });
    await page.close();
  }
  await b.close();
})();
