const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const cases = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, w, st] of cases) {
    const page = await browser.newPage({ viewport: { width: w, height: 1000 } });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    const t0 = Date.now();
    await page.reload({ waitUntil: 'load' });
    const tl = Date.now() - t0;
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    const cards = await page.evaluate(() => Array.from(document.querySelectorAll('.card, [class*=card]')).map(e => e.innerText.replace(/\n/g,' | ')).slice(0,4).join(' || '));
    const lines = t.split('\n').filter((l) => l.trim() && !/ · [\d.,]+ (k?g|t)$/.test(l));
    console.log('==== ' + name + ' load ' + tl + ' ms errors ' + JSON.stringify(errs) + '\n' + lines.join('\n').slice(0, +(process.env.MAXT || 1500)));
    await page.close();
  }
  await browser.close();
})();
