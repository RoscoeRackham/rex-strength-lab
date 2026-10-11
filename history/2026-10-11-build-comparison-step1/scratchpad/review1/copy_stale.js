// Measure the example at 1.80 m, then change the height field without measuring again, and copy.
const { open } = require('./harness.js');
(async () => {
  const { browser, p } = await open();
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5 && /measures/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  await p.fill('#tH', '1.80'); await p.click('#measureBtn');
  await p.waitForFunction(() => !/Measuring/.test(document.getElementById('toolStatus').textContent), null, { timeout: 60000 });
  for (const h of ['3.00', 'abc']) {
    await p.fill('#tH', h);
    await p.click('#copyBtn');
    await p.waitForTimeout(300);
    const j = JSON.parse(await p.evaluate(() => document.getElementById('copyOut').value));
    console.log('field ' + h + ' -> copied height_m.value', j.height_m.value, '| weight_kg', j.weight_kg.value, '| notes', j.notes[1], '| results table mass:', await p.evaluate(() => (document.getElementById('results').innerText.match(/Mass\s+([\d,]+ kg)/) || [])[1]));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
