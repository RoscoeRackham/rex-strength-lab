// usage: node pw.js '<settings json or "">' '<js to eval returning value>' [waitms]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const settings = process.argv[2]; const code = process.argv[3]; const wait = Number(process.argv[4] || 5000);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto('file://' + __dirname + '/preview.html');
  if (settings) { await page.evaluate((s) => localStorage.setItem('rex-lab-v1', s), settings); await page.reload(); }
  await page.waitForTimeout(wait);
  const fn = new Function('page', 'return (async () => {' + code + '})()');
  const out = await fn(page);
  console.log(typeof out === 'string' ? out : JSON.stringify(out, null, 1));
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
