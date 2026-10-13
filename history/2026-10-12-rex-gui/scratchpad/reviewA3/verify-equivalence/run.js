// usage: node run.js <branch|main> '<json state>' [regex filter]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const which = process.argv[2], st = JSON.parse(process.argv[3]), filt = process.argv[4] ? new RegExp(process.argv[4], 'i') : null;
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(String(e)));
  const url = 'file://' + path.join(__dirname, which + '.html');
  await p.goto(url);
  await p.evaluate((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  await p.goto(url);
  await p.waitForTimeout(4000);
  // open every "Show the math" details
  await p.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
  await p.waitForTimeout(500);
  const txt = await p.evaluate(() => document.body.innerText);
  const lines = txt.split('\n').map((s) => s.trim()).filter(Boolean);
  for (const l of lines) if (!filt || filt.test(l)) console.log('| ' + l);
  if (errs.length) console.log('ERRORS', errs);
  await b.close();
})();
