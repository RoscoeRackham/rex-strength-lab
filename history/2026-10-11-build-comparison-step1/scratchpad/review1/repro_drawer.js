const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const file = process.argv[2];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + file); await p.waitForTimeout(1500);
  await p.click('.fig[data-id="ronnie_coleman"]'); await p.waitForTimeout(200);
  console.log('drawer open:', await p.evaluate(() => !!document.getElementById('drawer') && !document.getElementById('drawer').hidden));
  await p.click('#hReal'); await p.waitForTimeout(300);
  console.log('after Real heights: drawer exists:', await p.evaluate(() => !!document.getElementById('drawer')), 'hReal pressed:', await p.getAttribute('#hReal', 'aria-pressed'));
  console.log('page errors:', errs);
  // does a later click on a figure still open anything?
  await p.click('.fig[data-id="phil_heath"]').catch(e => console.log('click err', e.message));
  await p.waitForTimeout(200);
  console.log('after clicking Phil Heath: errors', errs.length, errs.slice(-1), 'drawer exists', await p.evaluate(() => !!document.getElementById('drawer')));
  await b.close();
})();
