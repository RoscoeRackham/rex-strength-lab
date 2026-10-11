const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const [,, file, outPrefix, ...rest] = process.argv;
  const full = rest.includes('--full');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const sizes = [[390, 844], [1280, 900]];
  for (const scheme of ['light', 'dark']) for (const [w, h] of sizes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', e => errs.push(String(e)));
    const fs=require("fs");const tmp=path.resolve(file)+".wrapped.html";fs.writeFileSync(tmp,"<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\"><style>:root{padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>"+fs.readFileSync(file,"utf8")+"</body></html>");await page.goto("file://"+tmp);
    await page.waitForTimeout(600);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    const out = `${outPrefix}-${w}-${scheme}.png`;
    await page.screenshot({ path: out, fullPage: full });
    console.log(out, 'scrollWidth', sw, errs.length ? 'ERR ' + errs.join(' | ') : '');
    await ctx.close();
  }
  await browser.close();
})();
