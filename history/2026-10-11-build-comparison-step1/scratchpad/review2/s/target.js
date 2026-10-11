const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, p } = await open(b, 1280, 900, 'light', { init: () => { window.__lt = []; new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push({ t: e.startTime, d: Math.round(e.duration) }))).observe({ type: 'longtask', buffered: true }); } });
  await p.evaluate(() => document.querySelector('.jumps a[href="#measure"]').click());
  await p.waitForTimeout(400);
  await p.screenshot({ path: R + '/tool-early-1280.png' });
  await p.waitForFunction(() => /measures|No outline|Every width/.test(document.getElementById('targetStatus').textContent) && document.querySelectorAll('#results tr').length > 5, null, { timeout: 60000 });
  for (const [shape, tv] of [['ansur2_m_p50', 100], ['ansur2_m_p50', 900], ['ronnie_coleman', 900], ['ansur2_m_p05', 900], ['ansur2_m_p50', 15], ['steve_reeves', 500]]) {
    await p.selectOption('#tShape', shape).catch(() => {});
    await p.fill('#tTarget', String(tv));
    await p.evaluate(() => { window.__lt = []; window.__t0 = performance.now(); });
    await p.click('#targetBtn');
    await p.waitForFunction(() => !/Drawing/.test(document.getElementById('targetStatus').textContent), null, { timeout: 120000 });
    const r = await p.evaluate(() => ({ el: Math.round(performance.now() - window.__t0), lt: window.__lt.map((e) => e.d), st: document.getElementById('targetStatus').textContent, src: !!document.getElementById('tgtFront').getAttribute('src'), caps: [document.getElementById('capFront').textContent, document.getElementById('capSide').textContent] }));
    console.log(shape, tv, JSON.stringify(r));
  }
  const opts = await p.evaluate(() => Array.from(document.querySelectorAll('#tShape option')).map((o) => o.value + ':' + o.textContent));
  console.log(opts.join(' | '));
  await p.locator('.target').screenshot({ path: R + '/target-1280.png' });
  await ctx.close();
  await b.close();
})();
