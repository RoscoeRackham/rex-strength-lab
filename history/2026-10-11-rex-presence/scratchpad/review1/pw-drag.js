// Dial drag on the Jump / Throw tab with the default least-disruptive effort: time of each frame's bay render
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const URL = pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html').href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [act, mode, surface, preset] of [['jump', 'real', 'sand', 'least'], ['jump', 'real', 'concrete', 'ceiling'], ['throw', 'comic', 'sand', 'least'], ['throw', 'comic', 'sand', 'ceiling']]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((st) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); sessionStorage.setItem('seeded', '1'); } }, { inf: false, logKg: 20, mode, action: act, obj: 'car', surface, group: 'solo' });
    await page.goto(URL);
    await page.waitForTimeout(500);
    if (preset !== 'least') await page.evaluate((p) => { const s = document.querySelector('#effort'); s.value = p; s.dispatchEvent(new Event('change')); }, preset);
    await page.waitForTimeout(300);
    const times = await page.evaluate(async () => {
      const out = [];
      const r = document.querySelector('#strength');
      for (let i = 0; i < 12; i++) {
        const v = 20 + i * 0.8;
        const a = performance.now();
        r.value = String(v); r.dispatchEvent(new Event('input'));
        await new Promise((res) => requestAnimationFrame(() => setTimeout(res, 0)));
        out.push(Math.round(performance.now() - a));
      }
      return out;
    });
    console.log(act, mode, surface, preset, 'per-frame ms while dragging the dial from 1e20 to 1e29 kg:', JSON.stringify(times));
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
