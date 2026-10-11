const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname + '/';
const [st, steps] = [JSON.parse(process.argv[2]), JSON.parse(process.argv[3] || '[]')];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file://' + S + 'preview.html');
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
  await page.reload(); await page.waitForTimeout(600);
  for (const [kind, sel, val] of steps) {
    if (kind === 'click') await page.evaluate(([s]) => document.querySelector(s).click(), [sel]);
    if (kind === 'check') await page.evaluate(([s]) => { const e = document.querySelector(s); e.checked = true; e.dispatchEvent(new Event('change', { bubbles: true })); }, [sel]);
    if (kind === 'range') await page.evaluate(([s, v]) => { const e = document.querySelector(s); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }, [sel, val]);
    await page.waitForTimeout(500);
  }
  await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
  const t = await page.evaluate(() => document.querySelector('#bay').innerText);
  console.log('errors ' + JSON.stringify(errs) + '\n' + t);
  await browser.close();
})();
