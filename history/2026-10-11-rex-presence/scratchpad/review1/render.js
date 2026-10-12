const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + __dirname + '/preview.html');
  await p.waitForTimeout(1500);
  // go to Walk tab
  const tabs = await p.$$eval('button, [role=tab]', (xs) => xs.map((x) => x.textContent.trim()).filter((t) => t.length < 30));
  console.log('TABS', tabs.slice(0, 40).join(' | '));
  const walk = await p.$('text=Walk');
  if (walk) await walk.click();
  await p.waitForTimeout(2500);
  const txt = await p.evaluate(() => document.querySelector('main') ? document.querySelector('main').innerText : document.body.innerText);
  const i = txt.indexOf('Effort per step');
  console.log(txt.slice(Math.max(0, i - 300), i + 6000));
  console.log('ERRS', errs);
  await p.screenshot({ path: __dirname + '/walk-1280.png', fullPage: false });
  await b.close();
})();
