const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const prev = pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html').href;
  await page.goto(prev); await page.waitForTimeout(1500);
  for (const [tab, id, open] of [['arm', '#duo-effort-use', true], ['catch', '#c-dist', false], ['throw', '#effort-use', true]]) {
    await page.click(tab === 'throw' ? '#grp-solo' : '#grp-duo'); await page.click('#tab-' + tab); await page.waitForTimeout(1500);
    if (open) await page.evaluate(() => { const d = document.querySelector('details.effort-adjust'); if (d) d.open = true; });
    await page.waitForTimeout(300);
    const box = await (await page.$(id)).boundingBox();
    const before = await page.$eval(id, (e) => e.value);
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2); await page.mouse.down();
    for (let i = 1; i <= 21; i++) { await page.mouse.move(box.x + box.width * (0.2 + 0.6 * i / 21), box.y + box.height / 2); await page.waitForTimeout(30); }
    await page.mouse.up(); await page.waitForTimeout(800);
    const after = await page.$eval(id, (e) => [e.value, e.min, e.max]);
    console.log(tab, id, 'before', before, 'after', after);
  }
  await browser.close();
})();
