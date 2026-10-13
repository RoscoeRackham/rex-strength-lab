const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  for (const file of ['branch.html', 'main.html']) for (const [w, h] of [[360, 740], [390, 844]]) {
    const { page } = await open(browser, { w, h, file });
    const r = await page.evaluate(() => { const y = (s) => { const n = document.querySelector(s); return n ? Math.round(n.getBoundingClientRect().top + scrollY) : null; }; return { tabs: y('#tabs'), verdict: y('#bay .verdict'), duo: y('#duo'), screens: +(document.querySelector('#bay .verdict').getBoundingClientRect().top / innerHeight).toFixed(2) }; });
    console.log(file, w + 'x' + h, JSON.stringify(r));
    await page.context().close();
  }
  await browser.close();
})();
