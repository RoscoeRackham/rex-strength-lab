// screenshots of the header picture's glow at none, a faint glow (the stomp at 10^9 kg) and full, at 390 and 1280 px,
// light and dark, reduced motion: node crops.js <repo rex-strength-lab dir> <out dir>
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = process.argv[2], OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
const prev = path.join(OUT, 'preview.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h, dpr] of [[1280, 900, 2], [390, 844, 3]]) for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: 'reduce', colorScheme: scheme });
    await page.goto(pathToFileURL(prev).href);
    for (const [nm, st, eff] of [['none', { action: 'walk' }], ['faint', { action: 'stomp', logKg: 9 }, 'allout'], ['full', { action: 'throw', obj: 'car', inf: true }, 'allout']]) {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await page.reload();
      await page.waitForFunction(() => { const b = document.getElementById('bay'); return b && b.children.length && !/working it out/i.test(b.textContent); });
      if (eff) { await page.evaluate(() => { for (const n of document.getElementById('bay').children) n.r5old = true; }); await page.selectOption('#effort', eff); await page.waitForFunction(() => Array.from(document.getElementById('bay').children).some((n) => !n.r5old)); }
      const s = await page.$eval('#hero-glow', (g) => (g.hidden ? 0 : g.dataset.strength));
      await (await page.$('#hero-art')).screenshot({ path: path.join(OUT, 'hero-' + w + '-' + scheme + '-' + nm + '.png') });
      console.log(w, scheme, nm, 'strength', s);
    }
    await page.close();
  }
  await browser.close(); fs.unlinkSync(prev);
})().catch((e) => { console.error(e); process.exit(1); });
