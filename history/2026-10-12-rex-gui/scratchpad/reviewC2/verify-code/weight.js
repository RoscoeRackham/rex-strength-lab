const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const prev = path.join(__dirname, 'preview.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  for (const st of [{ H: 3.048, m: 5.5e26 }, { H: 3.048, m: 5.8e26 }, { H: 3.048, m: 6e26 }, { H: 500, m: 9e28 }, { H: 500, m: 9.6e28 }, { H: 500, m: 1e29 }]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ action: 'weight' }, s))), st);
    await page.reload(); await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const t = document.getElementById('bay').textContent.replace(/ /g, ' ').replace(/\s+/g, ' ');
      const tile = Array.from(document.querySelectorAll('#bay .tile')).map((x) => x.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ')).filter((x) => /Energy/.test(x));
      const nm = (t.match(/For this Rex that’s.{0,200}?Earth apart\./) || ['(no dense-matter text)'])[0];
      const st = window.localStorage.getItem('rex-lab-v1');
      return { tile, nm, saved: JSON.parse(st).m };
    });
    console.log(JSON.stringify(st), JSON.stringify(r));
  }
  await browser.close();
})();
