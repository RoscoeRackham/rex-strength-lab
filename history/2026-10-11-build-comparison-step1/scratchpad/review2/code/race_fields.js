// Change the height field while a measurement is running, then copy.
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
  await p.click('#measureBtn');
  await p.waitForTimeout(1000);
  await p.fill('#tH', '2.50');
  await p.waitForFunction(() => !/Measuring/.test(document.getElementById('toolStatus').textContent) && document.querySelectorAll('#results tr').length > 5, null, { timeout: 120000 });
  await p.click('#copyBtn'); await p.waitForTimeout(400);
  const st = await p.evaluate(() => document.getElementById('toolStatus').textContent.slice(0, 90));
  const copy = await p.evaluate(() => document.getElementById('copyOut').value);
  console.log('field tH now', await p.evaluate(() => document.getElementById('tH').value), '| status after Copy:', st, '| copied height', copy ? JSON.parse(copy).height_m.value : '(nothing copied)');
  await h.close();
})().catch((e) => { console.error(e); process.exit(1); });
