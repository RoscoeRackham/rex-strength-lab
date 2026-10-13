const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const prev = path.join(__dirname, 'prev-lab.html');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'punch' })); });
  await page.reload(); await page.waitForTimeout(5000);
  const r = await page.evaluate(() => {
    const g = document.querySelector('g.mk[data-key="R:chix"]');
    if (!g) return 'no marker; keys: ' + Array.from(document.querySelectorAll('g.mk')).map((x) => x.dataset.key).join(',');
    g.dispatchEvent(new FocusEvent('focus')); g.focus();
    return { aria: g.getAttribute('aria-label'), title: (g.querySelector('title') || {}).textContent, text: g.textContent };
  });
  await page.waitForTimeout(500);
  const tip = await page.evaluate(() => Array.from(document.querySelectorAll('[role=tooltip], .tip, .ladder-tip, .mk-tip')).map((n) => n.textContent).filter(Boolean));
  console.log(JSON.stringify(r, null, 1)); console.log('tips', tip);
  await browser.close();
})();
