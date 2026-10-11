const { open, close } = require('./h.js');
(async () => {
  const { page, ctx } = await open({ w: 1280, h: 900, state: { action: 'throw' } });
  const res = await page.evaluate(async () => {
    const out = [];
    const sel = (id) => { const s = document.querySelector('#obj'); s.value = id; s.dispatchEvent(new Event('change')); };
    const objs = [...document.querySelectorAll('#obj option')].map(o => o.value);
    for (const id of objs) for (const ang of [10, 30, 45, 70, 89]) {
      sel(id);
      const a = document.querySelector('#angle'); a.value = ang; a.dispatchEvent(new Event('input'));
      await new Promise(r => setTimeout(r, 40));
      for (let lg = 3; lg <= 34; lg += 1) {
        const s = document.querySelector('#strength'); s.value = lg;
        const t0 = performance.now(); s.dispatchEvent(new Event('input')); const dt = performance.now() - t0;
        out.push([dt, id, ang, lg]);
      }
    }
    out.sort((a, b) => b[0] - a[0]);
    return out.slice(0, 8).map(x => x[0].toFixed(0) + ' ms ' + x.slice(1).join(' '));
  });
  console.log(res.join('\n'));
  await ctx.close(); await close();
})();
