const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(pathToFileURL(process.argv[2]).href);
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'punch', logKg: 20, mode: 'comic' })));
  await page.reload(); await page.waitForTimeout(1500);
  const res = await page.evaluate(() => {
    const L = window.EnergyLadder, refs = window.DINO_DATA.energyRefs;
    const tile = Array.from(document.querySelectorAll('#bay .tile')).find((t) => t.querySelector('.k').textContent === 'Compared with');
    const v = tile.querySelector('.v');
    const out = [];
    const texts = refs.flatMap((r) => [L.compare(r.J, refs).text, L.compare(r.J * 3, refs).text, L.compare(r.J / 3, refs).text]).concat([L.compare(1e60, refs).text, L.compare(1e-3, refs).text]);
    for (const t of texts) { v.textContent = t; const over = document.documentElement.scrollWidth - document.documentElement.clientWidth; const tw = tile.scrollWidth - tile.clientWidth; if (over > 0 || tw > 0) out.push([t, over, tw]); }
    return { n: texts.length, out };
  });
  console.log(JSON.stringify(res));
  await browser.close();
})();
