// Timing: first render, the measuring tool's example, the duo.jpg validation, the target outline.
const { open } = require('./harness.js');
(async () => {
  const { browser, p, errs, tLoad } = await open();
  const nav = await p.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { domContentLoaded: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd) }; });
  console.log('goto(load) wall ms', tLoad, 'navigation timing', nav);
  const t1 = Date.now();
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && /\b(pass|fail)\b/i.test(document.getElementById('validation').textContent) && /measures/.test(document.getElementById('targetStatus').textContent), null, { timeout: 120000 });
  console.log('tool example + duo validation + initial target outline done', Date.now() - t1, 'ms after load');
  // Time each piece directly in the page.
  const r = await p.evaluate(() => {
    const out = {};
    let t = performance.now();
    document.getElementById('measureBtn').click();
    return new Promise((res) => {
      const iv = setInterval(() => {
        if (!/Measuring/.test(document.getElementById('toolStatus').textContent)) { clearInterval(iv); out.measureExampleMs = Math.round(performance.now() - t);
          t = performance.now(); document.getElementById('tTarget').value = '100'; document.getElementById('targetBtn').click();
          const iv2 = setInterval(() => { if (/measures/.test(document.getElementById('targetStatus').textContent)) { clearInterval(iv2); out.target100Ms = Math.round(performance.now() - t); out.target100 = document.getElementById('targetStatus').textContent;
            t = performance.now(); document.getElementById('tTarget').value = '900'; document.getElementById('targetBtn').click();
            const iv3 = setInterval(() => { if (/measures/.test(document.getElementById('targetStatus').textContent)) { clearInterval(iv3); out.target900Ms = Math.round(performance.now() - t); out.target900 = document.getElementById('targetStatus').textContent; res(out); } }, 20);
          } }, 20);
        }
      }, 20);
    });
  });
  console.log(JSON.stringify(r, null, 1));
  // A sheet at the model-sheet spec: figure 2,000 px tall.
  const big = await p.evaluate(() => {
    const e = window.__bc.LIST.find((x) => x.id === 'ansur2_m_p50');
    const g = {}; BuildCalc.SITES.forEach((s) => { g[s] = e.girths[s].value; });
    const T = window.COMPARE_DATA.outline;
    const f = Figure.human(T, 1.8, g, {}, { buttockFit: BuildCalc.FRUSTUM.M.buttock, armDeg: 35 });
    const y = f.dims.levels;
    const img = Figure.renderSheet({ front: f.front, side: f.side }, 1.8, { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee }, { figurePx: 2000 });
    const t = performance.now();
    const r = Measure.measureSheet(img, { heightM: 1.8, heightRef: 'top' });
    const t2 = performance.now();
    // duo.jpg segmentation as the page runs it
    return { w: img.width, h: img.height, ms: Math.round(t2 - t), ok: r.ok, score: r.score && r.score.value };
  });
  console.log('spec-size sheet (figure 2000 px) measureSheet in browser:', JSON.stringify(big));
  const big3 = await p.evaluate(() => {
    const e = window.__bc.LIST.find((x) => x.id === 'ansur2_m_p50');
    const g = {}; BuildCalc.SITES.forEach((s) => { g[s] = e.girths[s].value; });
    const T = window.COMPARE_DATA.outline;
    const f = Figure.human(T, 1.8, g, {}, { buttockFit: BuildCalc.FRUSTUM.M.buttock, armDeg: 35 });
    const img = Figure.renderSheet({ front: f.front, side: f.side }, 1.8, null, { figurePx: 3000 });
    const t = performance.now();
    const r = Measure.measureSheet(img, { heightM: 1.8, heightRef: 'top' });
    return { w: img.width, h: img.height, ms: Math.round(performance.now() - t), ok: r.ok };
  });
  console.log('figure 3000 px sheet:', JSON.stringify(big3));
  console.log('errors', errs);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
