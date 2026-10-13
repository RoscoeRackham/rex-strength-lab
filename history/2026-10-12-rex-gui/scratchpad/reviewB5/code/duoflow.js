const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const file = path.join(__dirname, 'page.html');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(file).href);
  const read = () => page.evaluate(() => (document.querySelector('#duo-bay .effort-read') || {}).textContent || '');
  const busy = async () => /working it out|Working out/i.test(await page.evaluate(() => document.getElementById('duo-bay').textContent));
  const settle = async () => { for (let i = 0; i < 400; i++) { if (!(await busy())) return i; await page.waitForTimeout(100); } return -1; };
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 2, logKg: 10 })));
  await page.reload(); await page.waitForTimeout(500); console.log('least settle', await settle());
  const least = (await read()).replace(/\s+/g, ' ');
  console.log('LEAST:', least.slice(0, 200));
  // pick block, then immediately switch to windows, then to least, before anything settles
  await page.selectOption('#duo-effort', 'block'); await page.waitForTimeout(150);
  console.log('block busy?', await busy());
  await page.selectOption('#duo-effort', 'windows'); await page.waitForTimeout(150);
  console.log('windows busy?', await busy());
  await page.selectOption('#duo-effort', 'least'); await page.waitForTimeout(150);
  const t0 = Date.now(); console.log('least again settle', await settle(), Date.now() - t0, 'ms');
  const least2 = (await read()).replace(/\s+/g, ' ');
  console.log('same least as before:', least2 === least);
  // a stale background job may still be running: watch for redraws for 15 s
  await page.evaluate(() => { window.__redraws = 0; new MutationObserver(() => window.__redraws++).observe(document.getElementById('duo-bay'), { childList: true }); });
  await page.waitForTimeout(15000);
  console.log('redraws of the duo bay in 15 s while idle on least:', await page.evaluate(() => window.__redraws));
  const least3 = (await read()).replace(/\s+/g, ' ');
  console.log('least still same:', least3 === least, 'sel', await page.$eval('#duo-effort', (n) => n.value));
  // now windows, settle, verify
  await page.selectOption('#duo-effort', 'windows'); await page.waitForTimeout(300); console.log('windows settle', await settle());
  console.log('WINDOWS:', (await read()).replace(/\s+/g, ' ').slice(0, 300));
  // change a setting mid-search (slider to 0%) and check the result is for the new setting
  await page.selectOption('#duo-effort', 'houses'); await page.waitForTimeout(100);
  await page.evaluate(() => { document.getElementById('powers').open = true; const s = document.getElementById('air-absorb'); s.value = '0'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.waitForTimeout(300); console.log('houses@0 settle', await settle());
  console.log('HOUSES@0:', (await read()).replace(/\s+/g, ' ').slice(0, 300));
  console.log('errors', errs);
  await browser.close();
})();
