const { chromium, CHROME, preview, settle, OUT, fs } = require('./common.js');
(async () => {
  const url = preview();
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type()==='error') errs.push(m.text()); });
  await page.goto(url);
  for (const lm of [3.48, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 21, 22, 23, 24, 24.5, 25, 25.5, 26, 26.5, 26.7, 26.8, 27, 30]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action: 'weight', m: Math.pow(10, lm) });
    await page.reload(); await page.waitForTimeout(400); await settle(page, 'bay');
    const t = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).map((t) => [t.querySelector('.k')&&t.querySelector('.k').textContent, t.querySelector('.v')&&t.querySelector('.v').textContent, t.querySelector('.s')&&t.querySelector('.s').textContent]));
    const en = t.find(x => /^Energy/.test(x[0])); const ms = t.find(x => x[0]==='Mass');
    const sw = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(lm, '|', ms && ms.join(' / '), '|', en ? en.join(' / ') : 'no energy tile', sw ? 'OVERFLOW '+sw : '');
  }
  console.log('errors', errs);
  await browser.close();
})();
