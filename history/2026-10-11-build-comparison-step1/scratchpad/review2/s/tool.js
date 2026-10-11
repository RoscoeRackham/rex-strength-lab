// Code F10 (lazy start, main-thread time), model F3 / code F4 (target tool), code F8 (copy), L15 (sheet picker).
const { open } = require('./h.js');
(async () => {
  const { browser, p, errors } = await open({ w: 1280, fonts: false });
  await p.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: 'longtask', buffered: true }); });
  await p.waitForTimeout(2500);
  const before = await p.evaluate(() => ({ lt: window.__lt.slice(), res: document.getElementById('results').innerHTML.length, tgt: document.getElementById('targetStatus').textContent, val: document.getElementById('validation').textContent }));
  console.log('before scrolling: long tasks', JSON.stringify(before.lt), 'results len', before.res, 'target', JSON.stringify(before.tgt), 'validation', JSON.stringify(before.val));
  const t0 = await p.evaluate(() => { window.__lt = []; document.getElementById('tool').scrollIntoView(); return performance.now(); });
  await p.waitForFunction(() => document.getElementById('results').innerHTML.length > 0 && /passes|No outline|fails|reaches only/.test(document.getElementById('targetStatus').textContent) && /Tool test/.test(document.getElementById('validation').textContent), null, { timeout: 120000 });
  const after = await p.evaluate((t0) => ({ lt: window.__lt.map((x) => [x[0] - Math.round(t0), x[1]]), done: Math.round(performance.now() - t0), status: document.getElementById('toolStatus').textContent, tgt: document.getElementById('targetStatus').textContent, val: document.getElementById('validation').textContent }), t0);
  console.log('after scroll: done in', after.done, 'ms; long tasks [start, dur]:', JSON.stringify(after.lt));
  console.log('  toolStatus:', after.status.slice(0, 400));
  console.log('  target:', after.tgt);
  console.log('  validation:', after.val);
  // Target runs
  const runs = [['ansur2_m_p50', 15], ['ansur2_m_p50', 20], ['ansur2_m_p50', 217], ['ansur2_m_p50', 900], ['ronnie_coleman', 15], ['ronnie_coleman', 300], ['ronnie_coleman', 900], ['ansur2_m_p5', 900], ['steve_reeves_1947', 600], ['ansur2_m_largest_arm', 900], ['ansur2_m_p95', 15]];
  for (const [shape, tv] of runs) {
    await p.selectOption('#tShape', shape); await p.fill('#tTarget', String(tv));
    const s0 = Date.now();
    await p.evaluate(() => { window.__lt = []; document.getElementById('targetStatus').textContent = ''; });
    await p.click('#targetBtn');
    await p.waitForFunction(() => { const t = document.getElementById('targetStatus').textContent; return t && t !== 'Drawing…'; }, null, { timeout: 180000 });
    const r = await p.evaluate(() => ({ t: document.getElementById('targetStatus').textContent, lt: window.__lt.map((x) => x[1]) }));
    console.log('target', shape, tv, '(' + (Date.now() - s0) + ' ms, longest task ' + Math.max(0, ...r.lt) + ' ms):', r.t);
  }
  console.log('errors', errors);
  await browser.close();
})();
