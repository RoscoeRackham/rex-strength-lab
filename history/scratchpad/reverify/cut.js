const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/reverify/out/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, w, st, scheme] of JSON.parse(process.argv[2])) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2, colorScheme: scheme || 'light' });
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(800);
    const svg = await page.$('#bay svg[aria-label*="ut"], #bay figure svg, #bay svg.cut');
    const all = await page.$$('#bay svg');
    let target = null;
    for (const s of all) { const t = await s.evaluate((e) => e.textContent); if (/inner core/.test(t)) { target = s; break; } }
    if (target) await target.screenshot({ path: S + name + '.png' }); else console.log('no cut svg', name);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(name, 'overflow', ov);
    await ctx.close();
  }
  await browser.close();
})();
