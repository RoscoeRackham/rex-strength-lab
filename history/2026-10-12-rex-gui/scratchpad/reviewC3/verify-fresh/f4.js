const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const prev = path.join(__dirname, 'prev-lab.html');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'weight' })); });
  await page.reload(); await page.waitForTimeout(3000);
  const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#src-table tbody tr')).map((tr) => tr.innerText.replace(/ /g, ' ')).filter((t) => /sound crossing|shortest harmless durations/i.test(t)));
  console.log(rows.join('\n----\n'));
  for (const [abs, s, unb] of [['instant', 1, true], ['instant', 1, false], ['instant', 0.5, true], ['gradual', 1, true], ['gradual', 0.5, true]]) {
    await page.reload(); await page.waitForTimeout(2500);
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    if (!unb) { await page.evaluate(() => { const b = document.getElementById('sw-unbreakable'); if (b.checked) b.click(); }); await page.waitForTimeout(400); }
    await page.selectOption('#absorb', abs); await page.waitForTimeout(400);
    await page.click('#grow-chips .chip[data-s="' + s + '"]'); await page.waitForTimeout(400);
    await page.click('#grow-what-chicxulub'); await page.waitForTimeout(1500);
    const t = await page.evaluate(() => document.querySelector('.growth-whatif').innerText.replace(/ /g, ' '));
    console.log('== ' + abs + ' s=' + s + ' unbreakable=' + unb + ': ' + (t.match(/All at once: over [^,]*,|Shortest harmless time: [^,]*,/) || ['?'])[0] + ' | ' + ((t.match(/his sides move out at about [^.]*\./) || [''])[0]));
  }
  await browser.close();
})();
