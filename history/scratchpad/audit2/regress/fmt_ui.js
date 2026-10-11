const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file://' + __dirname + '/preview.html'); await page.waitForTimeout(400);
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(400);
  await page.click('#tier-chips .chip[data-id="allstar"]'); await page.waitForTimeout(200);
  for (const tab of ['throw', 'jump', 'punch', 'clap', 'stomp']) {
    await page.click('#tab-' + tab); await page.waitForTimeout(200);
    const t = await page.evaluate(() => document.querySelector('#dial-big').textContent + ' | ' + document.querySelector('.verdict').textContent + ' | ' + [...document.querySelectorAll('#bay .tile')].slice(0, 3).map((x) => x.textContent).join(' ; '));
    console.log(tab, '=>', t);
  }
  await browser.close();
})();
