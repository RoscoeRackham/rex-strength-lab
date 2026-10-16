// usage: node view.js <page.html> '<state json>' <effortPick|-> <bay|duo-bay> [regex...]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const path = require('path');
(async () => {
  const [file, stJson, pick, bay, ...res] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(path.resolve(file)).href);
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', s), stJson);
  await page.reload();
  await page.waitForTimeout(1500);
  const settle = async () => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), bay); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); };
  await settle();
  if (pick && pick !== '-') { await page.selectOption(bay === 'duo-bay' ? '#duo-effort' : '#effort', pick); await page.waitForTimeout(400); await settle(); }
  const txt = await page.evaluate((id) => document.getElementById(id).textContent.replace(/\s+/g, ' '), bay);
  if (!res.length) console.log(txt);
  for (const r of res) { const m = txt.match(new RegExp(r, 'g')); console.log('[' + r + ']', m ? m.join(' || ') : '(none)'); }
  if (errs.length) console.log('console errors:', errs);
  await browser.close();
})();
