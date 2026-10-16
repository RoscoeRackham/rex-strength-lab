const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const settle = () => page.evaluate(() => new Promise((resolve) => { const t0 = performance.now(); const poll = () => { const b = document.getElementById('duo-bay'); const busy = !b || !b.querySelector('.verdict, .callout') || /working it out|Working out/i.test(b.textContent); if (!busy || performance.now() - t0 > 30000) resolve(); else setTimeout(poll, 30); }; poll(); }));
  const read = () => page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay .effort-read')).map((n) => n.textContent.replace(/\s+/g, ' ').trim()).join(' / '));
  const url = pathToFileURL(__dirname + '/' + process.argv[2] + '.html').href;
  const st = JSON.parse(process.argv[3]), click = process.argv[4];
  await page.goto(url); await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st); await page.reload(); await settle();
  await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(300); await settle();
  console.log('before:', await read());
  await page.evaluate(() => { document.getElementById('powers').open = true; });
  await page.click(click); await page.waitForTimeout(500); await settle();
  console.log('after :', await read());
  await page.waitForTimeout(5000);
  console.log('after 5 s:', await read());
  await browser.close();
})();
