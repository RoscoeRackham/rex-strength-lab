const { chromium } = require('/opt/node22/lib/node_modules/playwright'); const { pathToFileURL } = require('url');
(async () => { const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); const p = await b.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html').href);
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'weight' }))); await p.reload(); await p.waitForTimeout(1200);
  await p.evaluate(() => { document.getElementById('powers').open = true; });
  await p.selectOption('#absorb', 'gradual').catch(async () => { await p.click('#absorb-gradual'); }); await p.waitForTimeout(500);
  for (const g of ['krakatoa', 'chicxulub', 'sun']) { await p.click('#grow-what-' + g); await p.waitForTimeout(500);
    console.log(await p.evaluate(() => Array.from(document.querySelectorAll('#bay .growth-whatif p, #bay .growth-whatif li')).map((n) => n.textContent).filter((t) => /becomes|It becomes/.test(t)).join(' || '))); }
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'punch' }))); await p.reload(); await p.waitForTimeout(6000);
  console.log(await p.evaluate(() => { const t = document.body.textContent; const i = t.indexOf('dinosaur-killer impact'); return t.slice(i - 30, i + 120); }));
  console.log('errors', errs); await b.close(); })();
