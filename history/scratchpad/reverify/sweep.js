const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const states = [];
for (const H of [3.048, 2, 50, 500]) for (let e = 2; e <= 27; e += 1) states.push({ group: 'solo', action: 'weight', H, m: Math.pow(10, e) * (H === 3.048 ? 1 : 1.3) });
for (const a of ['friction','braced','bolted']) for (const oa of ['friction','braced','bolted']) for (const inf of [false, true]) for (const gh of [false, true]) states.push({ group: 'duo', duoAction: 'arm', anchor: a, oAnchor: oa, inf, groundHolds: gh });
for (const lk of [1, 2.7, 5, 12, 20]) for (const m of [1413, 7.06e9]) states.push({ action: 'pull', m, logKg: lk });
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  let bad = 0;
  for (const st of states) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    errs.length = 0;
    await page.reload(); await page.waitForTimeout(150);
    await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    const hits = [];
    for (const re of [/NaN/, /undefined/, /Infinity/, /\bnull\b/, /up up/, / 0 mm\b/, /Calculation failed/, /claws/i, /\b(\w+) \1\b/]) { const m = t.match(re); if (m) hits.push(m[0]); }
    if (errs.length || hits.length) { bad++; console.log(JSON.stringify(st), JSON.stringify(hits), JSON.stringify(errs)); }
  }
  console.log('states', states.length, 'bad', bad);
  await browser.close();
})();
