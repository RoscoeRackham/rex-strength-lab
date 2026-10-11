const { open } = require('./render.js');
(async () => {
  const { browser, p, errs } = await open(1280);
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => /measures|No outline|Every width/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  console.log('initial:', await p.evaluate(() => document.getElementById('targetStatus').textContent));
  const cases = [['ansur2_m_p50', 80], ['ansur2_m_p50', 78], ['steve_reeves_1947', 75], ['ronnie_coleman', 75], ['ansur2_m_largest_arm', 40], ['ansur2_m_largest_arm', 75], ['ansur2_m_p95', 60], ['ansur2_m_p5', 15], ['ansur2_m_p50', 900]];
  for (const [id, t] of cases) {
    await p.evaluate(([id, t]) => { document.getElementById('tShape').value = id; document.getElementById('tTarget').value = String(t); document.getElementById('targetStatus').textContent = ''; document.getElementById('targetBtn').click(); }, [id, t]);
    await p.waitForFunction(() => { const s = document.getElementById('targetStatus').textContent; return s && s !== 'Drawing…'; }, null, { timeout: 120000 });
    const s = await p.evaluate(() => document.getElementById('targetStatus').textContent);
    const cap = await p.evaluate(() => document.getElementById('capFront').textContent);
    console.log(id, t, '=>', s, '| caption:', cap);
  }
  // copy numbers for the last successful one
  console.log('ERRS', errs.filter((e) => !/Failed to load resource/.test(e)));
  await browser.close();
})();
