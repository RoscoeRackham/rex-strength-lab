const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  for (const [w, h] of [[390, 844], [1280, 900]]) {
    const { ctx, p } = await open(b, w, h, 'light', { init: () => { window.IntersectionObserver = undefined; } });
    // With no IntersectionObserver the tool starts 1.5 s after load; look before that.
    await p.evaluate(() => { const t = document.querySelector('.target'); t.scrollIntoView(); });
    await p.screenshot({ path: R + `/ux/target-before-start-${w}.png` });
    const r = await p.evaluate(() => ({ tg: document.getElementById('targetStatus').textContent, val: document.getElementById('validation').textContent, imgs: Array.from(document.querySelectorAll('.target-imgs img')).map((i) => ({ src: i.getAttribute('src'), h: i.getBoundingClientRect().height, w: i.getBoundingClientRect().width })) }));
    console.log(w, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
