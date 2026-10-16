const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = process.argv[2], R = path.join(S, 'repo', 'rex-strength-lab');
const html = fs.readFileSync(path.join(R, 'dist', 'index.html'), 'utf8');
const page = path.join(S, 'page.html');
fs.writeFileSync(page, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
const TIPS = [[0.319, 0.029], [0.354, 0.007], [0.396, 0.002], [0.435, 0.018], [0.470, 0.029], [0.509, 0.075], [0.535, 0.125], [0.560, 0.170], [0.590, 0.215], [0.620, 0.255], [0.650, 0.300]];
const BG = [[0.47, 0.03], [0.50, 0.04], [0.33, 0.02], [0.53, 0.09]];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, dpr] of [[1280, 1], [390, 3]]) {
    const pg = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: dpr, reducedMotion: 'reduce', colorScheme: 'light' });
    const errs = []; pg.on('pageerror', (e) => errs.push(e.message));
    await pg.goto('file://' + page);
    const res = {};
    for (const [nm, st] of [['none', { action: 'walk' }], ['stomp9', { action: 'stomp', logKg: 9, effort: 'allout' }], ['full', { action: 'throw', obj: 'car', inf: true, effort: 'allout' }]]) {
      await pg.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
      await pg.reload();
      await pg.waitForFunction(() => !/working it out|Working out/i.test(document.body.innerText), null, { timeout: 60000 });
      await pg.waitForTimeout(800);
      const info = await pg.evaluate(() => { const g = document.getElementById('hero-glow'); const tile = Array.from(document.querySelectorAll('#bay *')).find((n) => /shimmer/i.test(n.textContent) && n.children.length < 4 && n.textContent.length < 300); return { hidden: g.hidden, s: g.dataset.strength, glow: g.style.getPropertyValue('--glow'), grow: g.style.getPropertyValue('--grow'), tile: tile ? tile.textContent.replace(/\s+/g, ' ').slice(0, 200) : null }; });
      const el = await pg.$('#hero-art');
      const buf = await el.screenshot({ path: path.join(S, 'out', `hero-${w}-${nm}.png`) });
      const px = await pg.evaluate(async ([b64, pts]) => { const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return { W: im.width, H: im.height, v: pts.map(([fx, fy]) => Array.from(x.getImageData(Math.min(im.width - 1, Math.round(fx * im.width)), Math.min(im.height - 1, Math.round(fy * im.height)), 1, 1).data).slice(0, 3)) }; }, [buf.toString('base64'), TIPS.concat(BG)]);
      res[nm] = { info, px };
    }
    console.log('=== width', w, 'dpr', dpr, 'errs', errs.length);
    for (const nm of ['stomp9', 'full']) console.log(nm, JSON.stringify(res[nm].info));
    const L = (c) => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
    TIPS.concat(BG).forEach((p, i) => {
      const lab = i < TIPS.length ? 'tip ' + (i + 1) : 'bg  ' + JSON.stringify(p);
      console.log(lab.padEnd(18), 'none', JSON.stringify(res.none.px.v[i]), 'stomp9', JSON.stringify(res.stomp9.px.v[i]), '(' + (L(res.stomp9.px.v[i]) - L(res.none.px.v[i])).toFixed(0) + ')', 'full', JSON.stringify(res.full.px.v[i]), '(' + (L(res.full.px.v[i]) - L(res.none.px.v[i])).toFixed(0) + ')');
    });
    await pg.close();
  }
  await b.close();
})();
