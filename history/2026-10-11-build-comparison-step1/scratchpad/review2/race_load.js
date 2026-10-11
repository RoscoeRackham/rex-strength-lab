// Load a new sheet while an earlier measurement is still running.
const { open } = require('./harness.js');
const S = process.env.SCR;
(async () => {
  const h = await open({});
  const { p } = h;
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && !/Measuring/.test(document.getElementById('toolStatus').textContent), null, { timeout: 60000 });
  await p.setInputFiles('#file', S + '/big-p95.png');
  await p.waitForFunction(() => /^Loaded/.test(document.getElementById('toolStatus').textContent));
  await p.fill('#tH', '1.80');
  await p.click('#measureBtn');
  await p.waitForTimeout(300);
  // While big-p95.png is being measured, load another sheet.
  await p.setInputFiles('#file', S + '/small-wide.png');
  await p.waitForFunction(() => /small-wide/.test(document.getElementById('sheetName').textContent));
  console.log('after loading the second file:', await p.evaluate(() => document.getElementById('sheetName').textContent + ' | ' + document.getElementById('toolStatus').textContent.slice(0, 120)));
  // Wait for the first measurement to come back.
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5, null, { timeout: 120000 });
  const st = await p.evaluate(() => ({ name: document.getElementById('sheetName').textContent, status: document.getElementById('toolStatus').textContent.slice(0, 100), caps: document.getElementById('viewCaps').textContent, vol: document.querySelector('#results tbody tr:nth-child(2) td.n').textContent, score: Array.from(document.querySelectorAll('#results tr')).map((r) => r.textContent).filter((t) => /^Score/.test(t)).join(' | '), tH: document.getElementById('tH').value }));
  console.log('after the first measurement returned:', JSON.stringify(st));
  await p.click('#copyBtn');
  await p.waitForTimeout(500);
  const copy = await p.evaluate(() => document.getElementById('copyOut').value);
  const j = JSON.parse(copy);
  console.log('copied entry: name=' + j.name + ' weight=' + j.weight_kg.value + ' notes=' + j.notes.slice(0, 2).join(' / '));
  await p.locator('#sheetCanvas').screenshot({ path: S + '/race_load.png' });
  // For reference: what the second sheet actually measures.
  await p.click('#measureBtn');
  await p.waitForFunction(() => !/Measuring/.test(document.getElementById('toolStatus').textContent) && document.querySelectorAll('#results tr').length > 5, null, { timeout: 120000 });
  console.log('re-measured second sheet:', await p.evaluate(() => Array.from(document.querySelectorAll('#results tr')).map((r) => r.textContent).filter((t) => /^(Score|Volume)/.test(t)).join(' | ')));
  await h.close();
})().catch((e) => { console.error(e); process.exit(1); });
