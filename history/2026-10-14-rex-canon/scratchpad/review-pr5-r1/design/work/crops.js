const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const fs = require('fs');
const url = prep();
const DUO = (x) => Object.assign({ duoOpen: true }, x);
const gb01 = Math.log10(0.001 / Math.sqrt(1 - 1e-6));
const SC = [
  ['none', DUO({ action: 'walk', duoAction: 'collide', colMode: 'push' })],
  ['carleast', DUO({ action: 'throw', obj: 'car', duoAction: 'collide', colMode: 'push' })],
  ['stomp9', { action: 'stomp', logKg: 9 }, 'allout'],
  ['charge', DUO({ action: 'walk', duoAction: 'collide', colSrc: 'set', colGB: gb01 }), 'allout'],
  ['sun', { action: 'weight' }, null, 'sun'],
  ['full', DUO({ action: 'throw', obj: 'car', inf: true, duoAction: 'collide', colSrc: 'set', colGB: 4 }), 'allout'],
];
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const res = {};
  for (const [nm, st, eff, grow] of SC) {
    const pg = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await pg.goto(url);
    await loadOn(pg, st, eff);
    if (eff && st.duoOpen) { /* also set solo effort for full */ }
    if (nm === 'full' || nm === 'stomp9') { await pg.selectOption('#effort', 'allout'); await pg.waitForTimeout(500); await settledOn(pg, 'bay'); }
    if (grow) { await pg.click('#grow-what-' + grow); await pg.waitForTimeout(600); await settledOn(pg, 'bay'); }
    res[nm] = {};
    for (const [w, h] of [[1280, 900], [390, 844]]) {
      await pg.setViewportSize({ width: w, height: h }); await pg.waitForTimeout(700);
      await settledOn(pg, 'bay'); if (st.duoOpen) await settledOn(pg, 'duo-bay');
      for (const scheme of ['light', 'dark']) {
        await pg.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
        await pg.waitForTimeout(200);
        const info = await pg.evaluate(() => {
          const g = (q) => { const x = document.querySelector(q); if (!x) return null; const cs = getComputedStyle(x); return { hidden: x.hidden, strength: x.dataset.strength, opacity: cs.opacity, glow: x.style.getPropertyValue('--glow'), grow: x.style.getPropertyValue('--grow'), n: x.children.length, ah: x.getAttribute('aria-hidden'), pe: cs.pointerEvents, display: cs.display }; };
          const R = (q) => { const x = document.querySelector(q); if (!x) return null; const r = x.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(2)); };
          const tile = Array.from(document.querySelectorAll('.tile.shimmer')).map((t) => t.textContent);
          return { hero: g('#hero-glow'), col: g('#duo-bay .glow'), heroBox: R('#hero-art'), heroImg: R('#hero-art img'), colBox: R('#duo-bay .glow-art'), sx: document.documentElement.scrollWidth - document.documentElement.clientWidth, tile };
        });
        res[nm][w + scheme] = info;
        const he = await pg.$('#hero-art'); if (he) fs.writeFileSync(W + '/../shots/' + nm + '-hero-' + w + '-' + scheme + '.png', await he.screenshot());
        const ce = await pg.$('#duo-bay .glow-art'); if (ce) { await ce.scrollIntoViewIfNeeded(); fs.writeFileSync(W + '/../shots/' + nm + '-col-' + w + '-' + scheme + '.png', await ce.screenshot()); }
      }
    }
    res[nm].errs = errs;
    await pg.close();
  }
  fs.writeFileSync(W + '/crops.json', JSON.stringify(res, null, 1));
  for (const [k, v] of Object.entries(res)) console.log(k, JSON.stringify(v['1280light'].hero), JSON.stringify(v['1280light'].col), 'sx390', v['390light'].sx, v['390dark'].sx, 'errs', v.errs.length, '\n  tiles:', v['1280light'].tile.map((t) => t.slice(0, 200)).join(' || '));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
