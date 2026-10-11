const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const prev = '/home/user/dino-strength-sim/dist/preview.html';
const fixes = {
  none: '',
  pad4_lt360: '@media (max-width: 359px){#tabs .tab{padding-left:4px;padding-right:4px}}',
  pad6_1rem_lt380: '@media (max-width: 379px){#tabs .tab{padding-left:6px;padding-right:6px;font-size:1rem}}',
  pad4_mobile: '#tabs .tab{padding-left:4px;padding-right:4px}@media (min-width:640px){#tabs .tab{padding:9px 14px}}',
};
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
  for (const nof of [false, true]) for (const [name, css] of Object.entries(fixes)) for (const w of [320, 340, 360, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, ignoreHTTPSErrors: true, deviceScaleFactor: 3 });
    if (nof) await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    const page = await ctx.newPage();
    await page.goto('file://' + prev); await page.waitForTimeout(2500);
    if (css) await page.addStyleTag({ content: css });
    await page.waitForTimeout(200);
    const r = await page.evaluate(() => [...document.querySelectorAll('.tab')].map(b => {
      const rg = document.createRange(); rg.selectNodeContents(b); const tr = rg.getBoundingClientRect(), br = b.getBoundingClientRect();
      return b.textContent + ':' + (br.right - 1 - tr.right).toFixed(1); }).join(' '));
    const h = await page.evaluate(() => document.querySelector('#tabs').getBoundingClientRect().height);
    console.log(`${nof ? 'fallback' : 'webfont '} ${name.padEnd(16)} ${w}px tabsH=${h.toFixed(0)}  room-to-border: ${r}`);
    if (!nof && name === 'pad4_lt360' && w === 320) await (await page.$('#tabs')).screenshot({ path: __dirname + '/fix-320.png' });
    await ctx.close();
  }
  await browser.close();
})();
