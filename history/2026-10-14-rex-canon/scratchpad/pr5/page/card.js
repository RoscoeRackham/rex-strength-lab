const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dist = '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', prev = path.join(__dirname, 'preview.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + fs.readFileSync(dist, 'utf8') + '</body></html>');
(async () => { const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); const p = await b.newPage(); await p.goto(pathToFileURL(prev).href); await p.waitForTimeout(800);
  console.log(await p.evaluate(() => Array.from(document.querySelectorAll('#assume > div')).map((d) => d.textContent).filter((t) => /shimmer/i.test(t)).join('\n\n'))); await b.close(); })();
