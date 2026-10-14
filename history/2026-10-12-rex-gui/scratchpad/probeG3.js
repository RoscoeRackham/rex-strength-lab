const { chromium } = require('/opt/node22/lib/node_modules/playwright'); const { pathToFileURL } = require('url');
(async () => { const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); const p = await b.newPage();
  await p.goto(pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html').href);
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'weight' }))); await p.reload(); await p.waitForTimeout(1200);
  await p.evaluate(() => { document.getElementById('powers').open = true; }); await p.selectOption('#absorb', 'gradual'); await p.waitForTimeout(400);
  for (const g of ['krakatoa', 'chicxulub', 'sun']) { await p.click('#grow-what-' + g); await p.waitForTimeout(500);
    console.log(g, await p.evaluate(() => Array.from(document.querySelectorAll('#bay .growth-whatif tr')).map((r) => r.textContent.replace(/ /g, ' ')).join(' | '))); }
  await b.close(); })();
