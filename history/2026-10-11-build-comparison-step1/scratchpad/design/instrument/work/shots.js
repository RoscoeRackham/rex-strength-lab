const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const file = 'file://' + path.resolve(__dirname, '../mock.html');
  const out = path.resolve(__dirname, '..');
  let bad = 0;
  for (const [w, h] of [[390, 844], [1280, 900]]) for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: w < 500 ? 2 : 1 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto(file, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const info = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight,
      bad: /NaN|undefined|Infinity/.test(document.body.innerText) }));
    await page.screenshot({ path: `${out}/${w}-${scheme}.png`, fullPage: true });
    await page.screenshot({ path: `${out}/${w}-${scheme}-top.png`, fullPage: false });
    console.log(w, scheme, JSON.stringify(info), errs.length ? 'ERR ' + errs.join(' | ') : 'ok');
    if (info.sw > info.cw || info.bad || errs.length) bad++;
    await ctx.close();
  }
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
