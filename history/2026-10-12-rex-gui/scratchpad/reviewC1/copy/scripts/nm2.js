const { chromium, CHROME, preview, settle, OUT, fs } = require('./common.js');
(async () => {
  const url = preview();
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url);
  for (const st of [{ action: 'weight', H: 0.1, m: 3e13 }, { action: 'weight', H: 0.1, m: 1e15 }, { action: 'weight', H: 3.048, m: 1e18 }]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay');
    const t = await page.evaluate(() => document.getElementById('bay').innerText);
    const m = t.match(/For this Rex that’s.{0,110}/);
    console.log(JSON.stringify(st), '|', m && m[0]);
  }
  await browser.close();
})();
