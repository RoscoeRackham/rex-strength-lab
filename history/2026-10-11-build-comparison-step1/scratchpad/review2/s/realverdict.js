const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, p } = await open(b, 1280, 900, 'light');
  await p.click('#hReal');
  const r = await p.evaluate(() => ({ pressed: document.getElementById('hReal').getAttribute('aria-pressed'), verdict: document.querySelector('#lineup .verdict').textContent, note: document.getElementById('modeNote').textContent,
    heights: ['bruce_banner', 'ansur2_m_p50', 'hulk_savage', 'rex'].map((id) => { const c = document.querySelector('.fig[data-id="' + id + '"] svg g'); return id + ' drawn ' + c.getBoundingClientRect().height.toFixed(0) + ' px'; }) }));
  console.log(JSON.stringify(r, null, 1));
  await p.evaluate(() => document.getElementById('lineupH').scrollIntoView());
  await p.evaluate(() => window.scrollBy(0, -140));
  await p.screenshot({ path: R + '/ux/real-heights-verdict-1280.png' });
  await ctx.close(); await b.close();
})();
