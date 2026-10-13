const { chromium, CHROME, preview, settle, OUT, fs } = require('./common.js');
(async () => {
  const url = preview();
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url); await page.evaluate(() => localStorage.clear());
  await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action: 'weight' });
  await page.reload(); await page.waitForTimeout(600);
  await page.evaluate(() => { document.getElementById('setup').open = true; });
  for (const v of ['1e20', '1e24']) {
    await page.fill('#mass', v); await page.press('#mass', 'Enter'); await page.dispatchEvent('#mass', 'change');
    await page.waitForTimeout(800); await settle(page, 'bay');
    const t = await page.evaluate(() => document.getElementById('bay').innerText);
    const m = t.match(/For this Rex that’s.{0,120}/); const tile = t.match(/Energy released[^\n]*\n[^\n]*\n[^\n]*/);
    console.log('#mass =', v, '|', m && m[0], '| tile:', tile ? tile[0].replace(/\n/g, ' / ') : 'none');
  }
  await browser.close();
})();
