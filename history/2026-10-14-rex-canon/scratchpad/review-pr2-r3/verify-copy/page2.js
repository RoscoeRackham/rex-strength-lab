const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const f = path.join(__dirname, 'page.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const c of [{ action: 'pull', ownRecoil: false, anchor: 'bolted', obj: 'loco' }, { action: 'pull', ownRecoil: false, anchor: 'bolted', obj: 'b777' }, { action: 'pull', ownRecoil: false, unbreakable: false, airAbsorb: 0, keepForm: false, anchor: 'friction', obj: 'car' }]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(f).href);
    await page.evaluate((c) => { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ saveV: 2 }, c))); }, c);
    await page.reload();
    for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/.test(t)) break; }
    const sel = await page.evaluate(() => document.querySelector('#obj') && document.querySelector('#obj').value);
    const t = await page.evaluate(() => document.body.textContent);
    console.log('=== ' + JSON.stringify(c), 'obj select=', sel);
    for (const key of ['the pull takes all-out', 'Ground shaking: not counted', 'which all-out takes a fraction']) {
      let i = t.indexOf(key); if (i < 0) { console.log('  [no] ' + key); continue; }
      console.log('  > ...' + t.slice(Math.max(0, i - 120), i + 160).replace(/\s+/g, ' ') + '...');
    }
    await page.close();
  }
  await browser.close();
})();
