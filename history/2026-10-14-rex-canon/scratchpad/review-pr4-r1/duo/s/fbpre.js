const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const settle = () => page.evaluate(() => new Promise((resolve) => { const t0 = performance.now(); const poll = () => { const b = document.getElementById('duo-bay'); const busy = !b || !b.querySelector('.verdict, .callout') || /working it out|Working out/i.test(b.textContent); if (!busy || performance.now() - t0 > 60000) resolve(); else setTimeout(poll, 30); }; poll(); }));
  const FB = { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', logKg: 14, keepForm: false, airAbsorb: 0.5 };
  for (const pg of process.argv.slice(2)) for (const e of ['rattle', 'windows', 'houses', 'block']) {
    await page.goto(pathToFileURL(__dirname + '/' + pg + '.html').href);
    await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, FB); await page.reload(); await settle();
    await page.selectOption('#duo-effort', e); await page.waitForTimeout(300); await settle();
    const t = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay .effort-read')).map((n) => n.textContent.replace(/\s+/g, ' ').trim()).join(' / '));
    console.log(pg, e, '::', t.slice(0, 330));
  }
  await browser.close();
})();
