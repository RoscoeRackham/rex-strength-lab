// Same as reveal.js with real mouse-wheel notches over the results column, 1366x768, branch and main
const { launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const which of ['branch', 'main']) {
    const page = await open(b, { w: 1366, h: 768, which, wait: 3500 });
    const sel = which === 'branch' ? '#powers > summary' : '#comic-setup > summary';
    await page.mouse.move(900, 400);
    const vis = [];
    for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, 200); await page.waitForTimeout(120);
      vis.push(await page.evaluate((sel) => { const a = document.querySelector('aside').getBoundingClientRect(); const g = document.getElementById('surface').getBoundingClientRect(); const p = document.querySelector(sel).getBoundingClientRect();
        const inBox = (r) => r.top >= Math.max(0, a.top) && r.bottom <= Math.min(innerHeight, a.bottom);
        return Math.round(scrollY) + (inBox(g) ? 'G' : '') + (inBox(p) ? 'P' : ''); }, sel));
    }
    console.log(which, vis.join(' '));
    await page.context().close();
  }
  await b.close();
})();
