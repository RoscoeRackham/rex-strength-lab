const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = process.argv[2];
const CANDS = [[0.47, 0.03], [0.48, 0.02], [0.49, 0.025], [0.50, 0.03], [0.51, 0.04], [0.30, 0.01], [0.33, 0.015]];
const HW = [0.006, 0.012];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const copy of ['repo', 'fixed']) {
    const html = fs.readFileSync(path.join(S, copy, 'rex-strength-lab', 'dist', 'index.html'), 'utf8');
    const page = path.join(S, 'page-' + copy + '.html');
    fs.writeFileSync(page, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
    for (const w of [1280, 390]) {
      const pg = await b.newPage({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
      await pg.goto('file://' + page);
      await pg.evaluate(() => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'walk' })); }); await pg.reload();
      await pg.waitForFunction(() => !/working it out|Working out/i.test(document.body.innerText), null, { timeout: 60000 }); await pg.waitForTimeout(500);
      const shot = async () => (await (await pg.$('#hero-art')).screenshot()).toString('base64');
      const none = await shot();
      await pg.evaluate(() => { const g = document.getElementById('hero-glow'); g.hidden = false; g.style.setProperty('--glow', '1'); g.style.setProperty('--grow', '1.2'); });
      await pg.waitForTimeout(100);
      const full = await shot();
      const W = await pg.evaluate(() => document.querySelector('#hero-art img').getBoundingClientRect().width);
      const pts = []; for (const c of CANDS) for (const hw of HW) pts.push([c[0], c[1], Math.max(1, Math.round(hw * W)), hw]);
      const lum = (b64) => pg.evaluate(async ([b, ps]) => { const im = new Image(); im.src = 'data:image/png;base64,' + b; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
        return ps.map(([fx, fy, h]) => { const cx = Math.round(fx * im.width), cy = Math.round(fy * im.height); const d = x.getImageData(Math.max(0, cx - h), Math.max(0, cy - h), 2 * h + 1, 2 * h + 1).data; let s = 0, n = 0; for (let i = 0; i < d.length; i += 4) { s += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; n++; } return s / n; }); }, [b64, pts]);
      const a = await lum(none), z = await lum(full);
      console.log(copy, w, 'W', W, pts.map((p, i) => `(${p[0]},${p[1]} hw${p[3]}=${p[2]}px) ${(z[i] - a[i]).toFixed(1)}`).join(' | '));
      await pg.close();
    }
  }
  await b.close();
})();
