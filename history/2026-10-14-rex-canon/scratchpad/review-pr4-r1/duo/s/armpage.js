const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const settle = () => page.evaluate(() => new Promise((resolve) => { const t0 = performance.now(); const poll = () => { const b = document.getElementById('duo-bay'); const busy = !b || !b.querySelector('.verdict, .callout') || /working it out|Working out/i.test(b.textContent); if (!busy || performance.now() - t0 > 30000) resolve(); else setTimeout(poll, 30); }; poll(); }));
  await page.goto(pathToFileURL(__dirname + '/' + (process.argv[2] || 'pr35') + '.html').href);
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm', keepForm: false, unbreakable: false, oAnchor: 'bolted', logKg: 6 })); });
  await page.reload(); await settle();
  await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.click('#o-own'); await page.waitForTimeout(300);
  await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, Math.log10(90718.474));
  await page.waitForTimeout(800); await settle();
  await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(300); await settle();
  const r = await page.evaluate(() => { const b = document.getElementById('duo-bay'); const t = (s) => Array.from(b.querySelectorAll(s)).map((n) => n.textContent.replace(/\s+/g, ' ').trim()).join(' / '); return { v: t('.verdict'), s: t('.status-row'), tiles: t('.tiles'), h: t('.happens') }; });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();
