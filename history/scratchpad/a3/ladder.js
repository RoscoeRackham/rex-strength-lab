const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const S = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/';
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  fs.writeFileSync(S + 'preview2.html', '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, scheme] of [[390, 'dark'], [320, 'light']]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, colorScheme: scheme });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto('file://' + S + 'preview2.html'); await page.waitForTimeout(5000);
    const lad = await page.$('#ladder-viz');
    await lad.scrollIntoViewIfNeeded();
    // focus a marker by keyboard to show the focus ring and tooltip
    await page.focus('#ladder-viz .mk[data-key^="L:hulk"]');
    await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await lad.screenshot({ path: S + 'ladder-' + w + '.png' });
    console.log(w, 'errors', errs, 'overflow', await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
    await page.close();
  }
  await browser.close();
})();
