const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const { settle } = require(process.argv[2] + '/test/make-page-fixture.js');
(async () => {
  const prev = path.join(process.argv[3], 'preview.html');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: Number(process.argv[6] || 390), height: 844 } });
  await page.goto(pathToFileURL(prev).href);
  const st = JSON.parse(process.argv[4]);
  await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
  await page.reload(); await page.waitForTimeout(500);
  const bay = st.duoOpen ? 'duo-bay' : 'bay';
  await settle(page, bay);
  if (process.argv[5]) { await page.selectOption(st.duoOpen ? '#duo-effort' : '#effort', process.argv[5]); await page.waitForTimeout(400); await settle(page, bay); }
  const t = await page.evaluate((b) => document.getElementById(b).innerText, bay);
  console.log(t);
  if (process.argv[7]) await page.screenshot({ path: process.argv[7], fullPage: true });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
