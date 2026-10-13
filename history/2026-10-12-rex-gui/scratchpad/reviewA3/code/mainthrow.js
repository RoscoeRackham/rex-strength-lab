const { chromium, CHROME, wrap, settle, S } = require('./h.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(wrap(S + '/main-dist.html', 'mainthrow.html'));
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ angle: 30, group: 'duo', duoAction: 'wrestle', wrestleMove: 'throw' })));
  await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay');
  console.log(JSON.stringify(await page.evaluate(() => ({ angle: (document.getElementById('angle') || {}).value, verdict: document.querySelector('#bay .verdict').textContent }))));
  await browser.close();
})();
