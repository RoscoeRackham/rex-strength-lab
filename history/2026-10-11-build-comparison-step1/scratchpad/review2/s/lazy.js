const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  for (const [w, h] of [[390, 844], [1280, 900]]) {
    const { ctx, p } = await open(b, w, h, 'light', { init: () => { window.__lt = []; new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push({ t: Math.round(e.startTime), d: Math.round(e.duration) }))).observe({ type: 'longtask', buffered: true }); } });
    await p.waitForTimeout(2500);
    const before = await p.evaluate(() => ({ rows: document.querySelectorAll('#results tr').length, val: document.getElementById('validation').textContent, ts: document.getElementById('toolStatus').textContent, tg: document.getElementById('targetStatus').textContent, imgs: Array.from(document.querySelectorAll('.target-imgs img')).map((i) => [i.getAttribute('src') ? 'src' : 'nosrc', Math.round(i.getBoundingClientRect().height)]), lt: window.__lt.slice() }));
    console.log(w, 'after load, tool not near:', JSON.stringify(before));
    const t0 = await p.evaluate(() => { window.__lt = []; window.__t0 = performance.now(); document.querySelector('.jumps a[href="#measure"]').click(); return 0; });
    // sample statuses over time
    const samples = [];
    for (let i = 0; i < 16; i++) {
      await p.waitForTimeout(250);
      samples.push(await p.evaluate(() => Math.round(performance.now() - window.__t0) + 'ms ts="' + document.getElementById('toolStatus').textContent.slice(0, 30) + '" tg="' + document.getElementById('targetStatus').textContent.slice(0, 20) + '" val="' + document.getElementById('validation').textContent.slice(0, 25) + '" rows=' + document.querySelectorAll('#results tr').length));
    }
    console.log(samples.join('\n'));
    await p.screenshot({ path: R + `/tool-start-${w}.png` });
    const lt = await p.evaluate(() => window.__lt.map((e) => ({ t: Math.round(e.t - window.__t0), d: e.d })));
    console.log(w, 'long tasks after jump:', JSON.stringify(lt));
    await ctx.close();
  }
  await b.close();
})();
