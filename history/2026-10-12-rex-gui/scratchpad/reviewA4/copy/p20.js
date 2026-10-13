// The Walk tab's clay footprint uses the clay values of the Sources row 'Ground shear strength (where the ground tears out around bolted feet)'
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const factor of [1, 0.5]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((factor) => {
      let d; Object.defineProperty(window, 'DINO_DATA', { configurable: true, get() { return d; }, set(v) { if (v && v.surfaces) for (const s of v.surfaces) if (/clay/.test(s.id)) s.shear *= factor; d = v; } });
      localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'walk', surface: 'softclay', walker: 'rex' }));
    }, factor);
    const page = await ctx.newPage();
    await page.goto('file://' + __dirname + '/branch.html'); await page.waitForTimeout(1500);
    const out = [];
    for (const e of [0.3, 0.4, 0.5, 0.6, 0.7]) {
      await page.evaluate((e) => { const r = document.querySelector('#step-effort'); r.value = String(e); r.dispatchEvent(new Event('input', { bubbles: true })); r.dispatchEvent(new Event('change', { bubbles: true })); }, e);
      await page.waitForTimeout(800);
      const t = await page.evaluate(() => document.querySelector('#bay').innerText);
      out.push('stepEffort ' + e + ': ' + t.split('\n').filter(l => /print|sink|mired|kPa|bears/i.test(l)).slice(0, 4).join(' | '));
    }
    console.log('clay shear x' + factor + '\n  ' + out.join('\n  '));
    await ctx.close();
  }
  await browser.close();
})();
