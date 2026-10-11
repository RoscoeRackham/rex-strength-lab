// Weight tab: count bullets and check matter caveat presence; also items that would be cut (re-run builder isn't accessible, so we compare bullet count to 6)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  const bad = [];
  for (const gh of [false, true]) for (const H of [3.048, 2, 30]) for (let lm = 3; lm <= 26.01; lm += 0.5) {
    const st = { action: 'weight', H, m: Math.pow(10, lm), groundHolds: gh };
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(150);
    const r = await page.evaluate(() => {
      const lis = [...document.querySelectorAll('#bay ul.happens li')].map((l) => l.innerText);
      const t = document.querySelector('#bay').innerText;
      const rho = (t.match(/Rex \(([^)]*kg\/m³)\)/) || [])[1];
      return { n: lis.length, cav: lis.some((x) => /Osmium is the densest/.test(x)), osChip: /Held together only by being indestructible/.test(t), rho, bad: /undefined|NaN|up up/.test(t) ? (t.match(/.{40}(undefined|NaN|up up).{40}/) || [''])[0] : '' };
    });
    const line = JSON.stringify(st) + ' n=' + r.n + ' cav=' + r.cav + ' chip=' + r.osChip + ' rho=' + r.rho + (r.bad ? ' BAD:' + r.bad : '') + (errs.length ? ' ERR ' + errs.splice(0) : '');
    if ((r.osChip && !r.cav) || r.n >= 6 || r.bad) bad.push(line);
  }
  console.log(bad.join('\n'));
  await browser.close();
})();
