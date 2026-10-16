const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = process.argv[2], page = path.join(S, 'page.html');
const TIPS = [[0.319, 0.029], [0.354, 0.007], [0.396, 0.002], [0.435, 0.018], [0.470, 0.029], [0.509, 0.075], [0.535, 0.125], [0.560, 0.170], [0.590, 0.215], [0.620, 0.255], [0.650, 0.300]];
const BG = [[0.47, 0.03], [0.50, 0.04], [0.33, 0.02], [0.53, 0.09], [0.08, 0.06]];
const L = (c) => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, dpr] of [[1280, 1], [390, 3]]) {
    const pg = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: dpr, reducedMotion: 'reduce', colorScheme: 'light' });
    await pg.goto('file://' + page);
    const wait = async () => { await pg.waitForFunction(() => !/working it out|Working out/i.test(document.body.innerText), null, { timeout: 60000 }); await pg.waitForTimeout(600); };
    const shot = async (nm) => { const el = await pg.$('#hero-art'); const buf = await el.screenshot({ path: path.join(S, 'out', `hero-${w}-${nm}.png`) });
      return pg.evaluate(async ([b64, pts]) => { const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return pts.map(([fx, fy]) => Array.from(x.getImageData(Math.min(im.width - 1, Math.round(fx * im.width)), Math.min(im.height - 1, Math.round(fy * im.height)), 1, 1).data).slice(0, 3)); }, [buf.toString('base64'), TIPS.concat(BG)]); };
    const res = {};
    // real states: none (walk), and the throw of a car at unlimited strength, all-out (the test's 'full')
    await pg.evaluate(() => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'walk' })); }); await pg.reload(); await wait();
    res.none = await shot('none');
    await pg.evaluate(() => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', obj: 'car', inf: true })); }); await pg.reload(); await wait();
    await pg.selectOption('#effort', 'allout'); await wait();
    const info = await pg.evaluate(() => { const g = document.getElementById('hero-glow'); return { hidden: g.hidden, s: g.dataset.strength, glow: g.style.getPropertyValue('--glow'), grow: g.style.getPropertyValue('--grow') }; });
    console.log('=== width', w, 'dpr', dpr, 'real full:', JSON.stringify(info));
    res.realfull = await shot('realfull');
    // the 'about a faint glow' level (strength 0.262), drawn as setGlow draws it, on the walk page
    await pg.evaluate(() => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'walk' })); }); await pg.reload(); await wait();
    await pg.evaluate(() => { const g = document.getElementById('hero-glow'), s = 0.262, a = Math.sqrt(s); g.hidden = false; g.dataset.strength = String(s); g.style.setProperty('--glow', String(a)); g.style.setProperty('--grow', String(0.8 + 0.4 * a)); });
    res.faint = await shot('faint');
    TIPS.concat(BG).forEach((p, i) => {
      const lab = i < TIPS.length ? 'tip ' + (i + 1) : 'bg  ' + JSON.stringify(p);
      console.log(lab.padEnd(18), 'none', JSON.stringify(res.none[i]).padEnd(14), 'faint', JSON.stringify(res.faint[i]).padEnd(14), '(' + (L(res.faint[i]) - L(res.none[i])).toFixed(0).padStart(3) + ')', 'full', JSON.stringify(res.realfull[i]).padEnd(14), '(' + (L(res.realfull[i]) - L(res.none[i])).toFixed(0).padStart(3) + ')');
    });
    await pg.close();
  }
  await b.close();
})();
