const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const f of process.argv.slice(2)) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(pathToFileURL(f).href);
    await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'punch', logKg: 20, mode: 'comic', growWhat: 'chicxulub', absorb: 'instant' })));
    await page.reload();
    await page.waitForTimeout(6000);
    const t = await page.evaluate(() => { const w = document.querySelector('#ladder-viz'); return w ? w.textContent : 'none'; });
    const m = t.match(/(Punch carries a Hiroshima bomb|Clap = Tsar Bomba|Punch out-hits the dinosaur-killer impact|Punch could blow Earth apart)[^A-Z]{0,40}/g);
    console.log(f.split('/').slice(-3).join('/'), JSON.stringify(m), 'errors', errs.slice(0, 3));
    await page.close();
  }
  await browser.close();
})();
