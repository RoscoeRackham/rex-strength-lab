const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const body = fs.readFileSync('/home/user/dino-strength-sim/dist/index.html', 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
  const prev = path.join(__dirname, 'preview.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const widths = (process.argv[2] || '390,320,1280').split(',').map(Number);
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 844 } });
    await page.goto('file://' + prev);
    await page.waitForTimeout(5500);
    const keys = await page.$$eval('#ladder-viz .mk', (gs) => gs.map((g) => g.getAttribute('data-key')));
    const rows = [];
    for (const k of keys) {
      const sel = `#ladder-viz .mk[data-key="${k}"]`;
      await page.focus(sel);
      await page.waitForTimeout(30);
      const r = await page.evaluate((sel) => {
        const g = document.querySelector(sel);
        const tip = document.querySelector('#ladder-viz .tip');
        const wrap = document.querySelector('#ladder-viz');
        const tr = tip.getBoundingClientRect();
        const inside = (r) => r.left >= tr.left && r.right <= tr.right && r.top >= tr.top && r.bottom <= tr.bottom;
        const inter = (r) => !(r.right <= tr.left || r.left >= tr.right || r.bottom <= tr.top || r.top >= tr.bottom);
        const c = g.querySelector('circle').getBoundingClientRect();
        const texts = [...g.querySelectorAll('text')].map((t) => t.getBoundingClientRect());
        const path = g.querySelector('path').getBoundingClientRect();
        const gr = g.getBoundingClientRect();
        // sample visible pixels: elementFromPoint at circle center
        const cx = (c.left + c.right) / 2, cy = (c.top + c.bottom) / 2;
        return {
          label: g.getAttribute('aria-label').slice(0, 50),
          tipTop: Math.round(tr.top - wrap.getBoundingClientRect().top), tipH: Math.round(tr.height), tipW: Math.round(tr.width), tipL: Math.round(tr.left),
          dotIn: inside(c), dotHit: inter(c),
          textsAllIn: texts.every(inside), textsIn: texts.filter(inside).length + '/' + texts.length, textsHit: texts.filter(inter).length,
          pathIn: inside(path),
          cyRel: Math.round(cy - tr.top), aboveFold: tr.top < 0,
          dotInViewport: cy > 0 && cy < innerHeight,
        };
      }, sel);
      rows.push({ k, ...r });
    }
    console.log('=== width', w);
    for (const r of rows) if (r.dotHit || r.textsHit) console.log(JSON.stringify(r));
    console.log('total markers', rows.length, 'dot covered', rows.filter((r) => r.dotIn).length, 'all text covered', rows.filter((r) => r.textsAllIn).length, 'dot+all text covered', rows.filter((r) => r.dotIn && r.textsAllIn).length);
    await page.close();
  }
  await browser.close();
})();
