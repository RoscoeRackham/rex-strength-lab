const { chromium, CHROME, preview, settle, OUT, fs } = require('./common.js');
(async () => {
  const url = preview();
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url);
  for (const lm of [18, 20, 22, 24, 26, 26.7]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action: 'weight', m: Math.pow(10, lm) });
    await page.reload(); await page.waitForTimeout(400); await settle(page, 'bay');
    const t = await page.evaluate(() => document.getElementById('bay').innerText);
    const hits = t.split('\n').filter(l => /blow the Earth apart|holds the Earth together|×.*energy|energy.*×/.test(l));
    console.log('== m=10^'+lm); for (const h of hits) console.log('  ', h.slice(h.indexOf("Freed"), h.indexOf("Freed")+400));
  }
  await browser.close();
})();
