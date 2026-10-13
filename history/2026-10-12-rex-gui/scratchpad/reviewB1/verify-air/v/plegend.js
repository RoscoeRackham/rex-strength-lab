const { withPage } = require('./page.js');
(async () => {
  const errs = await withPage(async (page, load) => {
    for (const st of [null, { airAbsorb: 0.5 }]) {
      await load(st);
      const info = await page.evaluate(() => {
        const legends = [...document.querySelectorAll('.legend, [class*=legend]')].map((e) => e.innerText);
        const chips = [...document.querySelectorAll('.chip, .status')].map((e) => e.innerText).filter((t) => /drag/i.test(t));
        const svg = [...document.querySelectorAll('svg path, svg polyline')].map((p) => (p.getAttribute('d') || p.getAttribute('points') || '').slice(0, 60) + ' | dash=' + (p.getAttribute('stroke-dasharray') || ''));
        return { legends, chips, svg: svg.slice(0, 6) };
      });
      console.log(JSON.stringify(st), JSON.stringify(info, null, 1));
    }
    await page.screenshot({ path: __dirname + '/legend.png', fullPage: false });
  });
  console.log('errors', errs);
})();
