const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [name, src] of [['branch', '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html'], ['main', path.join(__dirname, 'main-index.html')]]) {
    const body = fs.readFileSync(src, 'utf8');
    const prev = path.join(__dirname, 'page-' + name + '.html');
    fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(prev).href);
    await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'punch' })));
    await page.reload();
    let t = '';
    for (let i = 0; i < 60; i++) { await page.waitForTimeout(1000); t = await page.evaluate(() => document.getElementById('ladder-viz').textContent); if (/dinosaur/.test(t) && /Earth apart/.test(t)) break; }
    const m = await page.evaluate(() => Array.from(document.querySelectorAll('#ladder-viz g.mk')).map((g) => g.getAttribute('aria-label')).filter((s) => /dinosaur|Hiroshima|Tsar|Earth apart/.test(s)));
    console.log(name, m);
    const chix = await page.evaluate(() => { const r = (window.DINO_DATA.energyRefs || []).find((e) => e.id === 'chicxulub'); return r ? { J: r.J, rough: r.rough } : null; });
    console.log(name, 'chicxulub rung', chix);
    await page.close();
  }
  await browser.close();
})();
