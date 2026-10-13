const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = path.join(__dirname, '..');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', s); sessionStorage.setItem('x', 1); } }, JSON.stringify({ duoOpen: true, duoAction: 'arm', surface: 'sand', logKg: 6 }));
  const page = await ctx.newPage();
  await page.goto('file://' + path.join(S, 'branch.html'));
  await page.waitForTimeout(1500);
  await page.selectOption('#duo-effort', 'allout');
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => { const b = document.querySelector('#duo-bay'); const q = (x) => Array.from(b.querySelectorAll(x)).map((e) => e.textContent.replace(/\s+/g, ' ').trim()); return { verdict: q('.verdict'), status: q('.status-row'), math: q('.math .eq') }; });
  console.log(' verdict:', r.verdict[0]); console.log(' chips:', r.status[0]); console.log(' math:', (r.math[0].match(/Once it breaks[^.]*\./) || [''])[0]);
  await browser.close();
})();
