const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(__dirname + '/shotmut/dist/preview.html').href);
  await page.waitForTimeout(2000);
  console.log(await page.evaluate(() => { const e = document.querySelector('#setup-sum'); const r = e.getBoundingClientRect(); return JSON.stringify({ text: e.closest('summary, details, section, div').innerText.slice(0, 120), inBay: !!e.closest('#bay'), visible: r.width > 0 && r.height > 0, bodyHasNaN: /NaN/.test(document.body.innerText) }); }));
  await browser.close();
})();
