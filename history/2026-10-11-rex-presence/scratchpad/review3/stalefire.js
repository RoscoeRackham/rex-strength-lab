// fromFire is set in effortReadout, after resolveEffort has already written its note: does a stale value leak?
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const url = pathToFileURL(__dirname + '/preview.html').href;
const obj = process.argv[2] || 'baseball', preset = process.argv[3] || 'windows';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript((o) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', inf: true, obj: o })); sessionStorage.setItem('seeded', '1'); } }, obj);
  await page.goto(url);
  const settle = async () => { for (let i = 0; i < 600; i++) { const p = await page.evaluate(() => /Working out|working it out/.test(document.querySelector('#bay').textContent)); if (!p) return; await page.waitForTimeout(100); } };
  const read = async (label) => { await settle(); await page.waitForTimeout(500); console.log(label + ':', (await page.evaluate(() => [...document.querySelectorAll('.effort-read p')].map((p) => p.textContent).join(' / '))).slice(0, 500)); };
  await settle();
  await page.selectOption('#effort', preset);
  await read('unlimited, ' + obj + ', ' + preset);
  await page.click('#tier-chips .chip[data-id="hulk"]');
  await read('then Hulk & Thor');
  // re-render without changing anything (pick the same preset again via another and back)
  await page.selectOption('#effort', 'allout'); await settle();
  await page.selectOption('#effort', preset);
  await read('same settings, re-rendered');
  await browser.close();
})();
