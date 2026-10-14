const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const distFile = process.argv[2];
const states = JSON.parse(process.argv[3]);
(async () => {
  const body = fs.readFileSync(distFile, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = path.join(path.dirname(process.argv[1]), 'prev-' + path.basename(path.dirname(path.dirname(distFile))) + '.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  for (const st of states) {
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.reload(); await page.waitForTimeout(2500);
    if (st.absorb) { await page.evaluate(() => { document.getElementById('powers').open = true; }); await page.selectOption('#absorb', st.absorb); await page.waitForTimeout(400); }
    if (st.growS !== undefined) { await page.click('#grow-chips .chip[data-s="' + st.growS + '"]'); await page.waitForTimeout(400); }
    if (st.growWhat) { await page.click('#grow-what-' + st.growWhat); await page.waitForTimeout(1500); }
    const t = await page.evaluate(() => { const b = document.querySelector('.growth-whatif'); return b ? b.innerText.split('Dinosaur-killer impact\nThe Sun for 1 second')[1] || b.innerText : 'NO BOX'; });
    const saved = await page.evaluate(() => localStorage.getItem('rex-lab-v1'));
    console.log('=== ' + JSON.stringify(st) + '\n' + t.replace(/ /g, ' ') + '\n');
  }
  console.log('errors', errs);
  await browser.close();
})();
