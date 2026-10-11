const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true })).newPage();
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html'); await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const v = document.querySelector('#bay .tile .v'); const cs = getComputedStyle(v);
    const span = document.createElement('span'); span.style.font = cs.font; span.style.whiteSpace = 'nowrap'; document.body.append(span);
    const m = (s) => { span.textContent = s; return +span.getBoundingClientRect().width.toFixed(1); };
    const o = { tileContentW: v.clientWidth, bayW: document.querySelector('#bay').clientWidth };
    for (const s of ['1,490,000 m/s', '2,800,000 m/s', '0.000159 m/s', '0.000291 m/s', '1883 Krakatoa', '99.97512% of', '9.8 × 10²⁴ N', '445,425× the']) o[s] = m(s);
    return o;
  });
  console.log(r);
  await browser.close();
})();
