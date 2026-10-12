// worst case: ceiling preset selected, then a setting change makes a fresh plan that must be solved synchronously
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const URL = pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html').href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { name: 'jump real inf: concrete -> (ceiling) -> mode real click', st: { inf: true, mode: 'comic', action: 'jump', group: 'solo', surface: 'concrete' }, change: '#mode-real' },
    { name: 'throw car real inf: (ceiling) -> mode real', st: { inf: true, mode: 'comic', action: 'throw', obj: 'car', group: 'solo', surface: 'sand' }, change: '#mode-real' },
    { name: 'jump real inf: (ceiling) -> surface sand', st: { inf: true, mode: 'real', action: 'jump', group: 'solo', surface: 'concrete' }, surf: 'sand' },
    { name: 'jump real inf sand: (ceiling) -> surface concrete', st: { inf: true, mode: 'real', action: 'jump', group: 'solo', surface: 'sand' }, surf: 'concrete' },
  ];
  for (const cs of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((st) => {
      if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); sessionStorage.setItem('seeded', '1'); }
    }, cs.st);
    await page.goto(URL);
    await page.waitForFunction(() => !/Working out the courtesy ceiling/.test(document.querySelector('#bay').innerText), null, { timeout: 120000 });
    await page.evaluate(() => { const s = document.querySelector('#effort'); s.value = 'ceiling'; s.dispatchEvent(new Event('change')); });
    await page.waitForTimeout(300);
    const t = await page.evaluate(({ change, surf }) => {
      const a = performance.now();
      if (change) document.querySelector(change).click();
      else { const s = document.querySelector('#surface'); s.value = surf; s.dispatchEvent(new Event('change')); }
      return Math.round(performance.now() - a);
    }, cs);
    console.log(cs.name, '| synchronous handler', t, 'ms');
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
