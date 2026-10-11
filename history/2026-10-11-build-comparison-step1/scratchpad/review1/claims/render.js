const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = parseInt(process.argv[2] || '1280');
const page0 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page0 + '</body></html>';
const out = path.join(__dirname, 'page.html'); fs.writeFileSync(out, html);
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await b.newContext({ viewport: { width: W, height: 900 } });
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  const p = await ctx.newPage();
  await p.goto('file://' + out); await p.waitForTimeout(2500);
  fs.writeFileSync(path.join(__dirname, 'text-' + W + '.txt'), await p.evaluate(() => document.body.innerText));
  await p.screenshot({ path: path.join(__dirname, 'glance-' + W + '.png'), clip: { x: 0, y: 0, width: W, height: W < 600 ? 900 : 700 } });
  await b.close();
})();
