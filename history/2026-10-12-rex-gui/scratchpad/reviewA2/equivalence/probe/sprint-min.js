const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const v of ['main', 'branch']) for (const anchor of ['friction', 'bolted']) for (const lk of [4.96, 9]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', s); sessionStorage.setItem('x', 1); } }, JSON.stringify({ action: 'sprint', anchor, logKg: lk, group: 'solo' }));
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(__dirname, '..', v + '.html'));
    await page.waitForTimeout(1500);
    await page.evaluate(() => { const s = document.querySelector('#effort'); s.value = 'custom'; s.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.waitForTimeout(800);
    await page.evaluate(() => { const r = document.querySelector('#effort-use'); r.value = r.min; r.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.waitForTimeout(1500);
    const t = await page.evaluate(() => ({ v: document.querySelector('#bay .verdict').textContent, h: document.querySelector('#bay .happens') && document.querySelector('#bay .happens').textContent, e: document.querySelector('#bay .effort-read').textContent.slice(0, 200), m: Array.from(document.querySelectorAll('#bay .math .eq')).map((x) => x.textContent).join(' / ') }));
    console.log(v, anchor, lk, JSON.stringify(t));
    await ctx.close();
  }
  await browser.close();
})();
