const { open } = require('../harness.js');
(async () => {
  const h = await open({});
  const { p } = h;
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => /measures|fails|reaches|lower/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  const opts = await p.evaluate(() => Array.from(document.querySelectorAll('#tShape option')).map((o) => o.value + '=' + o.textContent));
  console.log('base shapes:', opts.join(' | '));
  for (const [shape, t] of [['ansur2_m_p50', '80'], ['ansur2_m_p5', '80']]) {
    await p.selectOption('#tShape', shape);
    await p.fill('#tTarget', t);
    await p.click('#targetBtn');
    await p.waitForFunction(() => !/Drawing/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
    console.log(shape, t, '->', await p.evaluate(() => document.getElementById('targetStatus').textContent));
  }
  await h.close();
})().catch((e) => { console.error(e); process.exit(1); });
