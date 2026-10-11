// How long the target drawing blocks the page (it runs on the main thread).
const { open } = require('../harness.js');
(async () => {
  const h = await open({});
  const { p } = h;
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => /measures|fails|reaches|lower/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  for (const [shape, t] of [['ansur2_m_p50', '100'], ['ansur2_m_p5', '15'], ['ronnie_coleman', '250'], ['ronnie_coleman', '900'], ['ansur2_m_p5', '22']]) {
    await p.selectOption('#tShape', shape); await p.fill('#tTarget', t);
    const r = await p.evaluate(() => new Promise((res) => {
      let longest = 0; const obs = new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (e.duration > longest) longest = e.duration; })); obs.observe({ entryTypes: ['longtask'] });
      const t0 = performance.now(); document.getElementById('targetBtn').click();
      const poll = () => { if (/Drawing/.test(document.getElementById('targetStatus').textContent)) return setTimeout(poll, 20); setTimeout(() => { obs.disconnect(); res({ ms: Math.round(performance.now() - t0), longest: Math.round(longest), status: document.getElementById('targetStatus').textContent.slice(0, 160) }); }, 50); };
      setTimeout(poll, 20);
    }));
    console.log(shape, t, JSON.stringify(r));
  }
  await h.close();
})().catch((e) => { console.error(e); process.exit(1); });
