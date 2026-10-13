const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const page_file = process.argv[2], width = Number(process.argv[3] || 1280);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(page_file).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(500); await page.selectOption('#effort', 'allout'); await page.waitForTimeout(700); };
  const read = () => page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).map((t) => (t.querySelector('.k')||{}).textContent + ' = ' + (t.querySelector('.v')||{}).textContent + ' | ' + (Array.from(t.children).slice(2).map(c=>c.textContent).join(' '))).filter(x=>/Energy|Compared/.test(x)));
  const scroll = () => page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  const bad = [];
  for (const action of ['punch', 'clap', 'stomp', 'weight']) for (const logKg of [1, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 32, 34]) {
    await load({ action, logKg, mode: 'comic' });
    const t = await read();
    if (await scroll()) bad.push('HSCROLL ' + action + ' ' + logKg);
    console.log(action.padEnd(6), String(logKg).padEnd(3), JSON.stringify(t));
  }
  for (const inf of [true]) for (const action of ['punch','clap','stomp']) { await load({ action, logKg: 34, inf, mode: 'comic' }); console.log('INF', action, JSON.stringify(await read()), await scroll() ? 'HSCROLL' : ''); }
  console.log('bad', bad, 'errors', errs.slice(0, 5));
  await browser.close();
})();
