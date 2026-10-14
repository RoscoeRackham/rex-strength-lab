const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const file = process.argv[2];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(file).href);
  for (const action of ['punch', 'clap', 'stomp']) for (const lk of [-3, -2, -1, 0]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), { action });
    await page.reload(); await page.waitForTimeout(800);
    
    await page.waitForTimeout(300);
    await page.evaluate((v) => { const s = document.querySelector('#effort-use'); if (s) { s.value = s.min; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); } }, lk);
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => { const tiles = Array.from(document.querySelectorAll('#bay .tile')); const i = tiles.findIndex((t) => /Compared with/.test(t.innerText)); const ov = tiles.filter((t) => t.scrollWidth > t.clientWidth + 1).length; return { e: i > 0 ? tiles[i - 1].innerText.replace(/\s+/g, ' ') : '', c: i >= 0 ? tiles[i].innerText.replace(/\s+/g, ' ') : '', ov, sw: document.documentElement.scrollWidth, ids: Array.from(document.querySelectorAll('input[id^=effort]')).map((x) => x.id + '=' + x.value) }; });
    console.log(action, lk, JSON.stringify(r));
  }
  console.log('errors', JSON.stringify(errs));
  await page.screenshot({ path: process.argv[3] });
  await browser.close();
})();
