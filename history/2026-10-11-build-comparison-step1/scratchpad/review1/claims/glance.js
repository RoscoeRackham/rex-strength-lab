const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 })).newPage();
  await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await p.goto('file://' + path.join(__dirname, 'page.html')); await p.waitForTimeout(2000);
  const el = await p.$('.glance'); await el.screenshot({ path: path.join(__dirname, 'glance-1280.png') });
  const ticks = await p.evaluate(() => { const X = document.getElementById('glance')._X; const bc = window.__bc; return { gap0: [X(bc.GAPS[0].from), X(bc.GAPS[0].to)], thor: X(bc.LIST.find(e => e.id === 'thor').score.value), thing: X(bc.LIST.find(e => e.id === 'thing').score.value) }; });
  console.log(JSON.stringify(ticks));
  await p.evaluate(() => document.getElementById('empty').scrollIntoView());
  const g = await p.$('#empty'); await g.screenshot({ path: path.join(__dirname, 'gap1.png') });
  await b.close();
})();
