// Fields edited while the worker is still measuring: are the results then marked stale?
const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, p } = await open(b, 1280, 900, 'light');
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && /measures/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  await p.setInputFiles('#file', R + '/coleman-2000.png');
  await p.waitForFunction(() => /Loaded/.test(document.getElementById('toolStatus').textContent));
  await p.fill('#tH', '1.80');
  await p.click('#measureBtn');
  await p.waitForTimeout(1000);
  await p.fill('#tH', '2.50'); await p.press('#tH', 'Tab');   // the reader corrects the height while it measures, then moves on
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && !/Measuring/.test(document.getElementById('toolStatus').textContent), null, { timeout: 120000 });
  const shown = await p.evaluate(() => ({ field: document.getElementById('tH').value, status: document.getElementById('toolStatus').textContent.slice(0, 60), score: Array.from(document.querySelectorAll('#results tr')).filter((r) => /^(Score|Mass)\d/.test(r.textContent)).map((r) => r.textContent).join(" ; ") }));
  console.log('after the result arrives:', JSON.stringify(shown));
  await p.click('#copyBtn'); await p.waitForTimeout(300);
  const st = await p.evaluate(() => document.getElementById('toolStatus').textContent);
  const raw = await p.evaluate(() => navigator.clipboard.readText()); const clip = raw ? JSON.parse(raw) : { height_m: { value: 'clipboard empty' } };
  console.log('copy status:', st, '| copied height', clip.height_m.value, '| field now', shown.field);
  // Same fields, measured fresh:
  await p.click('#measureBtn');
  await p.waitForFunction(() => !/Measuring/.test(document.getElementById('toolStatus').textContent) && document.querySelectorAll('#results tr').length > 5, null, { timeout: 120000 });
  console.log('measured again with 2.50:', await p.evaluate(() => Array.from(document.querySelectorAll('#results tr')).filter((r) => /^(Score|Mass)\d/.test(r.textContent)).map((r) => r.textContent).join(" ; ")));
  await ctx.close(); await b.close();
})();
