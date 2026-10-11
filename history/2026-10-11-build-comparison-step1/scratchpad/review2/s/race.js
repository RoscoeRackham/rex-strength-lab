// A measurement still running in the worker when a new sheet is loaded.
const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, p } = await open(b, 1280, 900, 'light');
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && /measures/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  // 1. Load the big Coleman sheet and measure it.
  await p.setInputFiles('#file', R + '/coleman-2000.png');
  await p.waitForFunction(() => /Loaded/.test(document.getElementById('toolStatus').textContent), null, { timeout: 30000 });
  await p.fill('#tH', '1.80');
  const t0 = Date.now();
  await p.click('#measureBtn');
  await p.waitForTimeout(1500);
  // 2. While it runs, load the small soldier sheet instead.
  await p.setInputFiles('#file', R + '/soldier-500.png');
  await p.waitForFunction(() => /soldier-500/.test(document.getElementById('sheetName').textContent), null, { timeout: 30000 });
  const mid = [];
  for (let i = 0; i < 4; i++) { await p.waitForTimeout(700); mid.push(await p.evaluate(() => document.getElementById('toolStatus').textContent.slice(0, 60) + ' | tH="' + document.getElementById('tH').value + '" btnDisabled=' + document.getElementById('measureBtn').disabled)); }
  console.log('after loading soldier-500 while Coleman measures:\n  ' + mid.join('\n  '));
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5, null, { timeout: 120000 });
  const res = await p.evaluate(() => ({ name: document.getElementById('sheetName').textContent, status: document.getElementById('toolStatus').textContent.slice(0, 80), caps: document.getElementById('viewCaps').textContent, canvas: [document.getElementById('sheetCanvas').width, document.getElementById('sheetCanvas').height], vol: Array.from(document.querySelectorAll('#results tr')).filter((r) => /Volume|Mass|Chest/.test(r.textContent)).map((r) => r.textContent) }));
  console.log('elapsed', Date.now() - t0, 'ms\n', JSON.stringify(res, null, 1));
  await p.locator('#tool').screenshot({ path: R + '/race-tool.png' });
  // 3. Copy: which name and numbers go out?
  await p.click('#copyBtn');
  await p.waitForTimeout(300);
  const st = await p.evaluate(() => document.getElementById('toolStatus').textContent);
  const clip = await p.evaluate(() => navigator.clipboard.readText().catch((e) => 'ERR ' + e));
  console.log('copy status:', st);
  try { const j = JSON.parse(clip); console.log('copied name:', j.name, '| weight', j.weight_kg.value, '| chest', j.girths.chest.value, '| notes', j.notes[1]); } catch (e) { console.log('clip', clip.slice(0, 200)); }
  // Reference: the soldier-500 sheet measured on its own.
  await p.fill('#tH', '1.80'); await p.click('#measureBtn');
  await p.waitForFunction(() => !/Measuring/.test(document.getElementById('toolStatus').textContent) && document.querySelectorAll('#results tr').length > 5, null, { timeout: 60000 });
  console.log('soldier-500 measured on its own:', JSON.stringify(await p.evaluate(() => Array.from(document.querySelectorAll('#results tr')).filter((r) => /Volume|Mass|Chest/.test(r.textContent)).map((r) => r.textContent))));
  await ctx.close(); await b.close();
})();
