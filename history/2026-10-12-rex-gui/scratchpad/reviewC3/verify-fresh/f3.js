const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const states = JSON.parse(process.argv[2]);
(async () => {
  const prev = path.join(__dirname, 'prev-lab.html');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  for (const st of states) {
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.reload(); await page.waitForTimeout(4000);
    const t = await page.evaluate(() => { const b = document.getElementById('duo-bay'); return b ? b.innerText.replace(/ /g, ' ') : 'NO BAY'; });
    const lines = t.split('\n').filter((l) => /No contest|Energy freed|immovable here|t TNT|turned wholly|Sun/.test(l));
    console.log('=== ' + JSON.stringify(st) + '\n' + lines.slice(0, 8).join('\n') + '\n');
  }
  await browser.close();
})();
