// screenshots of the two pictures with the glow at 0 and full, and the bays, at 390/1280, light/dark
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dist = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html';
const outDir = process.argv[3] || path.join(__dirname, 'look'); fs.mkdirSync(outDir, { recursive: true });
const prev = path.join(__dirname, 'preview-look.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + fs.readFileSync(dist, 'utf8') + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(pathToFileURL(prev).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
  const states = { zero: { action: 'walk', duoOpen: true, duoAction: 'collide', colMode: 'push' }, full: { action: 'throw', inf: true, duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: 4 } };
  for (const [nm, st] of Object.entries(states)) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await page.reload(); await settled('bay'); await settled('duo-bay');
    if (nm === 'full') { await page.selectOption('#effort', 'allout'); await page.waitForFunction(() => Number(document.getElementById('hero-glow').dataset.strength) === 1, null, { timeout: 30000 }); }
    for (const [w, h] of [[1280, 900], [390, 844]]) for (const scheme of ['light', 'dark']) {
      await page.setViewportSize({ width: w, height: h }); await page.emulateMedia({ colorScheme: scheme }); await page.waitForTimeout(150);
      const hero = await page.$('#hero-art'); await hero.screenshot({ path: path.join(outDir, `hero-${nm}-${w}-${scheme}.png`) });
      const fig = await page.$('#duo-bay .art-figure'); await fig.scrollIntoViewIfNeeded(); await fig.screenshot({ path: path.join(outDir, `col-${nm}-${w}-${scheme}.png`) });
      if (nm === 'full') { await page.screenshot({ path: path.join(outDir, `top-${nm}-${w}-${scheme}.png`), clip: { x: 0, y: 0, width: w, height: 400 } }); }
    }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
