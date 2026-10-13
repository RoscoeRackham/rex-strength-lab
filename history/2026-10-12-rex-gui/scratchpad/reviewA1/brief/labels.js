const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file://' + path.join(__dirname, 'pages', 'branch.html'));
  for (const st of [{ duoOpen: true, duoAction: 'arm', action: 'throw' }, { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', action: 'throw' }]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(2500);
    const r = await page.evaluate(() => ['near', 'angle'].map((id) => Array.from(document.querySelectorAll('[id="' + id + '"]')).map((n) => id + '@' + (n.closest('#duo-bay') ? 'duo-bay' : 'bay') + ' labels=' + n.labels.length)));
    console.log(JSON.stringify(st.duoAction + (st.wrestleMove ? ':' + st.wrestleMove : '')), JSON.stringify(r));
    const snap = await page.locator('#duo-bay input#near').first().evaluate((n) => n.getAttribute('aria-label'));
    const name = await page.locator('#duo-bay [id="near"]').evaluate(async (n) => n.labels.length ? n.labels[0].textContent : '(no label)');
    console.log('  duo near accessible label via labels:', name);
  }
  await browser.close();
})();
