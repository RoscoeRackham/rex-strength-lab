const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const html = fs.readFileSync(path.join(__dirname, 'repo/rex-strength-lab/dist/index.html'), 'utf8');
  const f = path.join(__dirname, 'page.html');
  fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { action: 'pull', ownRecoil: false, anchor: 'bolted', obj: 'car' },
    { action: 'pull', ownRecoil: false, anchor: 'friction', obj: 'car' },
    { action: 'pull', ownRecoil: false, anchor: 'bolted', obj: 'tank' },
    { action: 'pull', ownRecoil: false, anchor: 'bolted', obj: 'car', logKg: Math.log10(3000) },
  ];
  for (const c of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto(pathToFileURL(f).href);
    await page.evaluate((c) => { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ saveV: 2 }, c))); }, c);
    await page.reload();
    for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/.test(t)) break; }
    const t = await page.evaluate(() => document.body.innerText);
    console.log('=== ' + JSON.stringify(c), errs);
    for (const re of [/[^\n]*before the power existed[^\n]*/g, /[^\n]*the pull takes all-out[^\n]*/g, /[^\n]*fraction of a second, so a quick bolted[^\n]*/g]) {
      for (const m of t.match(re) || []) {
        const i = m.indexOf(re === undefined ? '' : (m.includes('before the power existed') ? 'before the power existed' : m.includes('the pull takes all-out') ? 'the pull takes' : 'fraction of a second'));
        console.log('  > ...' + m.slice(Math.max(0, i - 260), i + 140) + '...');
      }
    }
    await page.close();
  }
  await browser.close();
})();
