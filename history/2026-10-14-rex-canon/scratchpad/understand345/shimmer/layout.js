const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const M = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const S = __dirname;
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const body = fs.readFileSync(path.join(M, 'dist', 'index.html'), 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>';
  const prev = path.join(S, 'preview.html'); fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(pathToFileURL(prev).href);
    await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(2500);
    const hero = await page.evaluate(() => { const i = document.querySelector('header.hero img'); const r = i.getBoundingClientRect(); const cs = getComputedStyle(i); return { x: r.x, y: r.y, w: r.width, h: r.height, natural: [i.naturalWidth, i.naturalHeight], fit: cs.objectFit, pos: cs.objectPosition, parent: getComputedStyle(i.parentElement).display }; });
    console.log(w, 'hero img', JSON.stringify(hero));
    await page.screenshot({ path: path.join(S, 'hero-' + w + '.png'), clip: { x: 0, y: 0, width: w, height: Math.min(400, h) } });
    await page.click('#duo > summary'); await page.waitForTimeout(400);
    await page.click('#tab-collide'); await page.waitForTimeout(2500);
    const figs = await page.evaluate(() => [...document.querySelectorAll('#duo-bay figure.art-figure')].map((f) => { const i = f.querySelector('img'); const r = i.getBoundingClientRect(); const fr = f.getBoundingClientRect(); const cs = getComputedStyle(i); return { img: { x: r.x, y: r.y + window.scrollY, w: r.width, h: r.height }, fig: { w: fr.width, h: fr.height }, natural: [i.naturalWidth, i.naturalHeight], fit: cs.objectFit, pos: cs.objectPosition, alt: i.alt.slice(0, 40), cols: getComputedStyle(f).gridTemplateColumns }; }));
    console.log(w, 'collide art', JSON.stringify(figs));
    const tiles = await page.evaluate(() => [...document.querySelectorAll('#duo-bay .tiles')].map((t) => ({ n: t.children.length, cols: getComputedStyle(t).gridTemplateColumns, keys: [...t.querySelectorAll('.k')].map((k) => k.textContent) })));
    console.log(w, 'collide tiles', JSON.stringify(tiles));
    const sub = await page.evaluate(() => ({ colSrc: (document.querySelector('#duo-bay select') || {}).id, buttons: [...document.querySelectorAll('#duo-bay .seg button[aria-pressed="true"]')].map((b) => b.textContent) }));
    console.log(w, 'collide state', JSON.stringify(sub));
    const fig = await page.$('#duo-bay figure.art-figure');
    if (fig) { await fig.scrollIntoViewIfNeeded(); await fig.screenshot({ path: path.join(S, 'collide-art-' + w + '.png') }); }
    await page.close();
  }
  await browser.close();
})();
