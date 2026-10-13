// Open the Rex + Ollie element, close it, change Rex's strength, reopen: what does the duo bay show right after?
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => { if (!sessionStorage.getItem('s')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ duoAction: 'collide', colSrc: 'set', colGB: 1, logKg: 6 })); sessionStorage.setItem('s', '1'); } }); const page = await ctx.newPage();
  await page.goto('file://' + path.join(__dirname, '..', 'branch.html'));
  const vd = () => page.evaluate(() => {
    const t = document.querySelector('#duo-bay').textContent.replace(/\s+/g, ' ');
    const i = t.indexOf('Lifts');
    return t.slice(i, i + 40) + ' | ' + ((document.querySelector('#duo-bay .verdict') || {}).textContent || '');
  });
  await page.click('#duo > summary');
  await page.waitForFunction(() => { const b = document.querySelector('#duo-bay'); return b && b.querySelector('.verdict') && !/working/i.test(b.textContent); }, null, { timeout: 60000 });
  console.log('open, default strength:', await vd());
  await page.click('#duo > summary');
  await page.evaluate(() => { const s = document.querySelector('#strength'); s.value = '9'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.waitForTimeout(800);
  console.log('dial logKg now', await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).logKg));
  const t0 = Date.now();
  await page.click('#duo > summary');
  for (let i = 0; i < 30; i++) { console.log((Date.now() - t0) + ' ms:', await vd()); await page.waitForTimeout(150); }
  await browser.close();
})();
