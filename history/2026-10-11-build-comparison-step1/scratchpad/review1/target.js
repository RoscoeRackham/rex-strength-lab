// Target outline: does the drawn shape measure the score asked for, across the allowed 15-900?
const { open, R } = require('./harness.js');
(async () => {
  const { browser, p } = await open();
  await p.waitForFunction(() => /measures/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  const shapes = (process.argv[2] || 'ansur2_m_p50').split(',');
  const targets = (process.argv[3] || '15,20,60,100,150,200,300,400,500,700,900').split(',');
  for (const shape of shapes) for (const t of targets) {
    await p.evaluate(([s, t]) => { document.getElementById('tShape').value = s; document.getElementById('tTarget').value = t; document.getElementById('targetStatus').textContent = ''; }, [shape, t]);
    const t0 = Date.now();
    await p.click('#targetBtn');
    await p.waitForFunction(() => /measures|Enter a target/.test(document.getElementById('targetStatus').textContent), null, { timeout: 120000 });
    const ms = Date.now() - t0;
    const st = await p.evaluate(() => document.getElementById('targetStatus').textContent);
    const m = st.match(/measures ([\d,]+) \(target ([\d,]+)\)/);
    const got = m ? +m[1].replace(/,/g, '') : NaN;
    console.log(shape.padEnd(22), 'target', String(t).padStart(4), 'measures', String(got).padStart(5), 'miss', m ? ((got / +t - 1) * 100).toFixed(1) + '%' : '-', ms + ' ms', '|', st.slice(0, 90));
    if (t === '300' && shape === shapes[0]) await p.locator('#tgtFront').screenshot({ path: R + '/target300-front.png' }).catch(() => {});
    if (t === '900' && shape === shapes[0]) await p.locator('#tgtFront').screenshot({ path: R + '/target900-front.png' }).catch(() => {});
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
