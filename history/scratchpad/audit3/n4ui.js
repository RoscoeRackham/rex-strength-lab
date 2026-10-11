const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(5000);
  // click Strongest human marker
  const ok = await page.evaluate(() => {
    const els = [...document.querySelectorAll('#ladder svg .mk, #ladder [role=button], #ladder button')];
    const t = els.find(e => /Strongest human/.test(e.textContent || e.getAttribute('aria-label') || ''));
    if (!t) return 'notfound ' + els.length;
    t.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return 'clicked ' + (t.getAttribute('aria-label') || t.textContent);
  });
  console.log(ok);
  await page.waitForTimeout(800);
  console.log('dial:', await page.textContent('#dial-big'));
  console.log('state:', await page.evaluate(() => localStorage.getItem('rex-lab-v1')));
  const txt = await page.evaluate(() => document.querySelector('main.panel').innerText);
  console.log('---COMIC---\n' + txt.slice(0, 1500));
  await page.screenshot({ path: 'n4-comic.png', fullPage: false });
  // switch to real
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); s.mode = 'real'; localStorage.setItem('rex-lab-v1', JSON.stringify(s)); });
  await page.reload(); await page.waitForTimeout(3000);
  const txt2 = await page.evaluate(() => document.querySelector('main.panel').innerText);
  console.log('---REAL---\n' + txt2.slice(0, 1500));
  await browser.close();
})();
