const open = require('./pw.js');
(async () => {
  const { browser, page, errs, load, settle } = await open(1280);
  for (const [mode, s] of JSON.parse(process.argv[2])) for (const g of ['chicxulub', 'krakatoa']) {
    await load(Object.assign({ action: 'weight' }, JSON.parse(process.argv[3] || '{}')), false);
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.selectOption('#absorb', mode); await page.waitForTimeout(300);
    await page.evaluate((s) => { const r = document.getElementById('grow-s'); if (r) { r.value = String(s); r.dispatchEvent(new Event('input', { bubbles: true })); r.dispatchEvent(new Event('change', { bubbles: true })); } }, s);
    await page.waitForTimeout(300);
    await page.click('#grow-what-' + g); await page.waitForTimeout(400); await settle(page, 'bay');
    const t = await page.evaluate(() => document.querySelector('#bay .growth-whatif').innerText);
    console.log('=== ' + mode + ' s=' + s + ' ' + g + '\n' + t.split('\n').filter((l) => /^(It becomes|Gradual|PURE|MIX|The asteroid)/.test(l)).join('\n'));
  }
  console.log('ERRS', errs.slice(0, 5));
  await browser.close();
})();
