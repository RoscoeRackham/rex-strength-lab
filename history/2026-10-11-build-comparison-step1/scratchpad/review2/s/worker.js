// Code F5 (worker), F8 (copy after edits), F9 (alpha sheets), F3 (skull rows in the page), L15 (picker), F2 (front+back) in the page.
const { open } = require('./h.js');
const S = __dirname + '/../sheets/';
async function load(p, file) {
  await p.setInputFiles('#file', file);
  await p.waitForFunction(() => /Loaded/.test(document.getElementById('toolStatus').textContent), null, { timeout: 60000 });
}
async function measure(p, H, skull) {
  await p.fill('#tH', String(H));
  if (skull != null) { await p.evaluate(() => { document.querySelector('details.adv').open = true; }); await p.fill('#tSkull', skull); }
  await p.evaluate(() => { window.__lt = []; window.__t0 = performance.now(); });
  await p.click('#measureBtn');
  // responsiveness probe: a timer every 100 ms, record the max gap
  await p.evaluate(() => { window.__gap = 0; let last = performance.now(); window.__iv = setInterval(() => { const n = performance.now(); window.__gap = Math.max(window.__gap, n - last); last = n; }, 100); });
  await p.waitForFunction(() => !document.getElementById('measureBtn').disabled, null, { timeout: 180000 });
  return p.evaluate(() => { clearInterval(window.__iv); return { ms: Math.round(performance.now() - window.__t0), maxGap: Math.round(window.__gap), lt: (window.__lt || []).map((x) => x[1]), status: document.getElementById('toolStatus').textContent.slice(0, 260), res: [...document.querySelectorAll('#results tr')].slice(0, 6).map((tr) => tr.innerText.replace(/\s+/g, ' ')).join(' | '), checks: document.getElementById('checks').innerText.replace(/\s+/g, ' ').slice(0, 400) }; });
}
(async () => {
  const { browser, p, errors } = await open({ w: 1280, fonts: false });
  await p.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: 'longtask' }); });
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => document.getElementById('results').innerHTML.length > 0 && /Tool test/.test(document.getElementById('validation').textContent), null, { timeout: 120000 });
  await p.waitForTimeout(3000);
  // F5
  await load(p, S + 'big2000.png');
  const big = await measure(p, 1.8);
  console.log('F5 2,000 px sheet:', big.ms, 'ms; max timer gap', big.maxGap, 'ms; long tasks', JSON.stringify(big.lt), '\n  ', big.status, '\n  ', big.res);
  // F8: edit height after measuring, copy
  await p.fill('#tH', '3.00');
  await p.evaluate(() => { window.__clip = null; try { navigator.clipboard.writeText = (t) => { window.__clip = t; return Promise.resolve(); }; } catch (e) {} });
  await p.click('#copyBtn'); await p.waitForTimeout(300);
  console.log('F8 copy after editing height:', await p.evaluate(() => document.getElementById('toolStatus').textContent), '| clip', await p.evaluate(() => window.__clip && window.__clip.slice(0, 80)));
  // F2 front+back in the page
  await load(p, S + 'frontback.png');
  const fb = await measure(p, 1.8);
  console.log('F2 front, mirrored front, back:', fb.status, '\n   checks:', fb.checks);
  // F9 alpha
  for (const f of ['alpha-black.png', 'alpha-white.png']) {
    await load(p, S + f);
    const st = await p.evaluate(() => document.getElementById('toolStatus').textContent);
    const r = await measure(p, 1.8);
    console.log('F9', f, '| on load:', st.slice(0, 120), '| result:', r.res.slice(0, 160), '| status', r.status.slice(0, 120));
  }
  // F3 skull rows in the page on s700 (true skull row 56)
  await load(p, S + 's700.png');
  for (const rows of ['640', '56', '100']) {
    const r = await measure(p, 1.8, rows);
    const line = await p.evaluate(() => [...document.querySelectorAll('#sheetGut span, .gutter span')].map((s) => s.textContent + '@' + s.style.top).join(' '));
    console.log('F3 skull rows', rows, '|', r.status.slice(0, 200), '|', r.res.slice(0, 120), '| gutter', line);
  }
  console.log('errors', errors);
  await browser.close();
})();
