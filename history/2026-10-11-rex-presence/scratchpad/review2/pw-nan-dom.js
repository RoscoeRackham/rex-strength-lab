const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage();
  await page.goto(pathToFileURL(process.argv[2]).href);
  for (const tab of ['throw', 'pull']) {
    await page.click('#tab-' + tab); await page.waitForTimeout(1500);
    const r = await page.evaluate(() => ({ inner: (document.body.innerText.match(/NaN/g) || []).length, content: (document.querySelector('#bay').textContent.match(/NaN/g) || []).length, closedDetails: [...document.querySelectorAll('#bay details')].filter((d) => !d.open && /NaN/.test(d.textContent)).map((d) => d.className) }));
    console.log(tab, 'NaN in body innerText:', r.inner, '| in bay textContent:', r.content, '| closed details holding it:', r.closedDetails);
  }
  await b.close();
})();
