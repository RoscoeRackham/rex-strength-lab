const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const url = 'file://' + __dirname + '/mock.html';
  const runs = [[390, 844, 'light'], [390, 844, 'dark'], [1280, 900, 'light'], [1280, 900, 'dark']];
  const extra = process.argv.slice(2);
  for (const [w, h, scheme] of runs) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', e => errs.push(e.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const info = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight, bad: /NaN|undefined|Infinity/.test(document.body.innerText) }));
    await page.screenshot({ path: `${__dirname}/${w}-${scheme}.png`, fullPage: true });
    await page.screenshot({ path: `${__dirname}/${w}-${scheme}-first.png` });
    console.log(w, scheme, JSON.stringify(info), errs.join(' | '));
    await ctx.close();
  }
  await browser.close();
})();
