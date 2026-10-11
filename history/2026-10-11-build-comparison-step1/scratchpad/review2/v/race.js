const { open, S } = require('./h.js');
(async () => {
  const { browser, p, errs } = await open(1280, 900);
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5, null, { timeout: 60000 });
  await p.waitForTimeout(3000);
  const st = () => p.evaluate(() => ({ status: document.getElementById('toolStatus').textContent.slice(0, 90), btn: document.getElementById('measureBtn').disabled, name: document.getElementById('sheetName').textContent, caps: document.getElementById('viewCaps').textContent, tH: document.getElementById('tH').value }));
  await p.setInputFiles('#file', S + '/sheets/big-2000.png');
  await p.waitForFunction(() => /Loaded/.test(document.getElementById('toolStatus').textContent));
  await p.fill('#tH', '1.80');
  await p.click('#measureBtn');
  const t0 = Date.now();
  await p.waitForTimeout(1500);
  await p.setInputFiles('#file', S + '/sheets/small-500.png');
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(1000);
    const s = await st();
    console.log(((Date.now() - t0) / 1000).toFixed(1), JSON.stringify(s));
    if (!s.btn && !/Loaded|Measuring/.test(s.status)) break;
  }
  const res = await p.evaluate(() => Array.from(document.querySelectorAll('#results tr')).slice(0, 12).map((r) => r.textContent).join(' | '));
  console.log('RESULTS', res);
  const gut = await p.evaluate(() => Array.from(document.querySelectorAll('#gutter span')).map((s) => s.textContent + '@' + s.style.top).join(' '));
  console.log('GUTTER', gut);
  await p.click('#copyBtn');
  await p.waitForTimeout(500);
  console.log('AFTER COPY', JSON.stringify(await st()));
  const clip = await p.evaluate(() => navigator.clipboard.readText().catch((e) => 'ERR ' + e));
  try { const j = JSON.parse(clip); console.log('CLIP name', j.name, 'height', j.height_m.value, 'weight', j.weight_kg.value, 'notes', j.notes.slice(0, 2)); } catch (e) { console.log('CLIP', clip.slice(0, 200)); }
  await p.screenshot({ path: S + '/race-tool.png', clip: await p.evaluate(() => { const r = document.getElementById('tool').getBoundingClientRect(); return { x: r.x, y: Math.max(0, r.y), width: r.width, height: Math.min(900, r.height) }; }) });
  // now measure small sheet alone
  await p.fill('#tH', '1.80'); await p.click('#measureBtn');
  await p.waitForFunction(() => !document.getElementById('measureBtn').disabled, null, { timeout: 60000 });
  const res2 = await p.evaluate(() => Array.from(document.querySelectorAll('#results tr')).slice(0, 4).map((r) => r.textContent).join(' | '));
  console.log('SMALL ALONE', res2);
  console.log('errs', errs);
  await browser.close();
})();
