const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('x', 1); } }, JSON.parse(process.argv[2]));
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(__dirname + '/snap2/dist/preview.html').href);
  await page.waitForTimeout(400);
  for (const [id, v] of JSON.parse(process.argv[3] || '[]')) { await page.evaluate(([id, v]) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]); await page.waitForTimeout(200); }
  for (let i = 0; i < 300; i++) { const t = await page.evaluate(() => document.querySelector('#bay').innerText); if (!/Working out the courtesy ceiling/.test(t)) break; await page.waitForTimeout(100); }
  console.log((await page.evaluate(() => [...document.querySelectorAll('#bay svg[aria-label]')].map((s) => s.getAttribute('aria-label')))).join('\n'));
  await browser.close();
})();
