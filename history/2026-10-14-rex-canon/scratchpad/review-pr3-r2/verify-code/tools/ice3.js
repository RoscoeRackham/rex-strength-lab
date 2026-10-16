const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const repo = process.argv[2] || path.join(__dirname, '..', 'repo');
(async () => {
  const f = path.join(__dirname, 'page2-verify-code.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(f).href);
  const settle = async (id) => { for (let i = 0; i < 160; i++) { const b = await page.evaluate((x) => /working it out|Working out/i.test(document.getElementById(x).textContent), id); if (!b) return; await page.waitForTimeout(250); } throw new Error('busy'); };
  const load = async (st) => { await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(800); await settle('bay'); };
  const pick = async (sel, v) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle('bay'); };
  const items = () => page.evaluate(() => Array.from(document.querySelectorAll('#bay .happens li')).map((n) => n.textContent.replace(/\s+/g, ' ')));
  await load({ saveV: 3, action: 'throw', obj: 'person', surface: 'ice', logKg: 9.15 }); await pick('#effort', 'allout');
  (await items()).filter((t) => /shak|ground|Impact|land/i.test(t)).forEach((t) => console.log('  * ' + t));
  await browser.close();
})();
