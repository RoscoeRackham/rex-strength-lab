const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const { settle } = require(__dirname + '/repo/rex-strength-lab/test/make-page-fixture.js');
const extra = JSON.parse(process.argv[2] || '{}');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(__dirname + '/repo/rex-strength-lab/dist/index.html').href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay'); };
  const tiles = () => page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).filter((t) => t.querySelector('.k')).map((t) => t.querySelector('.k').textContent + ': ' + t.querySelector('.v').textContent + (t.querySelector('.s') ? ' / ' + t.querySelector('.s').textContent : '')));
  const seen = new Set();
  for (const action of ['punch', 'clap', 'stomp']) for (const logKg of [1, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 34]) {
    await load(Object.assign({ action, logKg, mode: 'comic' }, extra));
    const t = await tiles();
    const cmp = t.filter((x) => /^Compared with/.test(x));
    const en = t.filter((x) => /^Energy/.test(x));
    console.log(action, logKg, '|', en.join(' ; '), '|', cmp.join(' ; '));
    for (const c of cmp) seen.add(c.replace(/[\d.]+/g, '#'));
  }
  console.log('distinct wordings', seen.size, [...seen]);
  await browser.close();
})();
