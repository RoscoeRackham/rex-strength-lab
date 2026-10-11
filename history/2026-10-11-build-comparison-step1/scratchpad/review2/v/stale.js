const { open, S } = require('./h.js');
(async () => {
  const { browser, p, errs } = await open(1280, 900);
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5, null, { timeout: 60000 });
  await p.waitForTimeout(3000);
  for (const tab of [true, false]) {
    await p.setInputFiles('#file', S + '/sheets/big-2000.png');
    await p.waitForFunction(() => /Loaded/.test(document.getElementById('toolStatus').textContent));
    await p.fill('#tH', '1.80');
    await p.click('#measureBtn');
    await p.waitForTimeout(1000);
    await p.click('#tH'); await p.fill('#tH', '2.50');
    if (tab) await p.keyboard.press('Tab');
    await p.waitForFunction(() => !document.getElementById('measureBtn').disabled, null, { timeout: 60000 });
    const s = await p.evaluate(() => ({ tH: document.getElementById('tH').value, status: document.getElementById('toolStatus').textContent.slice(0, 80), mass: document.querySelectorAll('#results tr')[3].textContent }));
    console.log('tab=' + tab, JSON.stringify(s));
    await p.click('#copyBtn'); await p.waitForTimeout(400);
    const st = await p.evaluate(() => document.getElementById('toolStatus').textContent);
    const clip = await p.evaluate(() => navigator.clipboard.readText().catch((e) => 'ERR'));
    let h = null; try { h = JSON.parse(clip).height_m.value; } catch (e) {}
    console.log('  copy status:', st, '| clip height', h);
    await p.evaluate(() => navigator.clipboard.writeText(''));
  }
  await browser.close();
})();
