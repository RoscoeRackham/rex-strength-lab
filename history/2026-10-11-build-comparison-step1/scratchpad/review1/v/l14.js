const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const [w, h, skel] of [[390, 844, 'host'], [390, 844, 'task'], [360, 740, 'host']]) {
    const p = await open(b, { width: w, height: h, skel });
    const r = await p.evaluate((h) => {
      const top = (sel) => { const el = document.querySelector(sel); return el ? Math.round(el.getBoundingClientRect().top + scrollY) : null; };
      const o = { lede: top('#lede'), spec: top('#spec'), glance: top('#glance'), jumps: top('.jumps'), controls: top('.controls'), lineupH: top('#lineupH'), locator: top('#locator'), firstTag: top('.stop .tag'), firstVerdict: top('.stop .verdict'), firstFig: top('.fig'), rex: top('.fig[data-id="rex"]'), page: document.documentElement.scrollHeight };
      o.firstFigScreens = +(o.firstFig / h).toFixed(1); o.rexScreens = +(o.rex / h).toFixed(1);
      return o;
    }, h);
    console.log(w, h, skel, JSON.stringify(r));
    if (skel === 'host' && w === 390) await p.screenshot({ path: `${DIR}/l14-first-390.png` });
    await p._ctx.close();
  }
  await b.close();
})();
