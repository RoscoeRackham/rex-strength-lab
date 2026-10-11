// Start measuring a big sheet, then press "Soldier sheet" at once: what does the status show, and when does the soldier result come?
const { open } = require('../harness.js');
const S = process.env.SRC;
(async () => {
  const h = await open({});
  const { p } = h;
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && !/Measuring/.test(document.getElementById('toolStatus').textContent), null, { timeout: 60000 });
  await p.setInputFiles('#file', S + '/big-p95.png');
  await p.waitForFunction(() => /^Loaded/.test(document.getElementById('toolStatus').textContent));
  await p.fill('#tH', '1.80');
  const t0 = Date.now();
  await p.click('#measureBtn');
  await p.waitForTimeout(2500);
  await p.click('#tSoldier');
  // Sample the status text every 250 ms.
  const seen = [];
  for (let i = 0; i < 80; i++) {
    const s = await p.evaluate(() => [document.getElementById('toolStatus').textContent.slice(0, 40), document.getElementById('measureBtn').disabled, document.getElementById('sheetName').textContent]);
    seen.push(((Date.now() - t0) / 1000).toFixed(1) + 's ' + JSON.stringify(s));
    if (!/Measuring/.test(s[0])) break;
    await p.waitForTimeout(250);
  }
  console.log(seen.filter((x, i) => i % 2 === 0 || !/Measuring/.test(x)).join('\n'));
  await h.close();
})().catch((e) => { console.error(e); process.exit(1); });
