const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const prev = process.argv[2] || '/home/user/dino-strength-sim/dist/preview.html';
const out = process.argv[3] || __dirname + '/tabs-320-x3.png';
const block = process.argv[4] === 'nofonts';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 320, height: 800 }, deviceScaleFactor: 3, ignoreHTTPSErrors: true });
  if (block) await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const page = await ctx.newPage();
  await page.goto('file://' + prev); await page.waitForTimeout(3000);
  const info = await page.evaluate(() => {
    const t = document.querySelector('#tabs'); const b = document.querySelector('.tab');
    return { tabsW: t.getBoundingClientRect().width, overflow: getComputedStyle(b).overflow, fam: getComputedStyle(b).fontFamily,
      over: [...document.querySelectorAll('.tab')].map(x => x.textContent + ':' + (x.scrollWidth - x.clientWidth)).join(' '),
      font: document.fonts.check('800 18px "Big Shoulders Display"') };
  });
  console.log(JSON.stringify(info));
  await (await page.$('#tabs')).screenshot({ path: out });
  await browser.close();
})();
