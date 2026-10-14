const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const DIR = process.argv[2];
(async () => {
  const prev = path.join(DIR, 'probe.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st, allout) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(700); await settle(page, 'bay'); if (allout) { await page.selectOption('#effort', 'allout'); await page.waitForTimeout(500); await settle(page, 'bay'); } };
  for (const action of ['punch', 'clap', 'stomp']) {
    await load({ action, inf: true, mode: 'comic' }, true);
    const tiles = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).map((t) => t.textContent.replace(/\s+/g, ' ')));
    console.log(action, 'inf', tiles.filter(t => /Energy|Compared/.test(t)), 'ovf', await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
  }
  // custom effort: pick custom then set slider low
  await load({ action: 'punch', logKg: 1, mode: 'comic' }, false);
  const opts = await page.$$eval('#effort option', os => os.map(o => o.value)); console.log('effort options', opts);
  console.log('errs', errs);
  await browser.close();
})();
