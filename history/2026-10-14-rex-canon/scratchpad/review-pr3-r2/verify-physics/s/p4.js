const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-physics/repo/rex-strength-lab';
(async () => {
  const html = fs.readFileSync(R + '/dist/index.html', 'utf8');
  const f = path.join(__dirname, 'p4.html');
  fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(f).href);
  const settle = async () => { for (let i = 0; i < 200; i++) { const b = await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent)); if (!b) return; await page.waitForTimeout(250); } };
  for (const st of [{ inf: true }, { logKg: 34 }, { logKg: 16 }]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, cLogD: 4.5, saveV: 3 }, s))), st);
    await page.reload(); await page.waitForTimeout(900); await settle();
    const opts = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-effort option')).map(o => o.value + ':' + o.textContent));
    for (const eff of ['least', 'ceiling', 'allout']) {
      if (!opts.some(o => o.startsWith(eff + ':'))) continue;
      await page.selectOption('#duo-effort', eff); await page.waitForTimeout(400); await settle();
      const e = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay .effort-read')).map(n => n.textContent.replace(/\s+/g, ' ')).join(' / '));
      console.log('###', JSON.stringify(st), eff, '\n', e.slice(0, 1500));
    }
    console.log('opts', opts);
  }
  await browser.close();
})();
