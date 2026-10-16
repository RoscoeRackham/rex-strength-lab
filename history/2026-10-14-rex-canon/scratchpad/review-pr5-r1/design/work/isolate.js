const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const fs = require('fs');
const url = prep();
const DUO = (x) => Object.assign({ duoOpen: true }, x);
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const pg = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await pg.goto(url);
  await loadOn(pg, DUO({ action: 'throw', obj: 'car', inf: true, duoAction: 'collide', colSrc: 'set', colGB: 4 }), 'allout');
  await pg.selectOption('#effort', 'allout'); await pg.waitForTimeout(500); await settledOn(pg, 'bay'); await settledOn(pg, 'duo-bay');
  const out = {};
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    await pg.setViewportSize({ width: w, height: h }); await pg.waitForTimeout(700); await settledOn(pg, 'bay'); await settledOn(pg, 'duo-bay');
    for (const scheme of ['light', 'dark']) {
      await pg.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' }); await pg.waitForTimeout(150);
      for (const [nm, sel] of [['hero', '#hero-art'], ['col', '#duo-bay .glow-art']]) {
        const box = await pg.$(sel); await box.scrollIntoViewIfNeeded(); await pg.waitForTimeout(100);
        const bb = await box.boundingBox();
        const pad = 14;
        const clip = { x: Math.max(0, Math.floor(bb.x) - pad), y: Math.max(0, Math.floor(bb.y) - pad), width: Math.ceil(bb.width) + 2 * pad, height: Math.ceil(bb.height) + 2 * pad };
        const on = await pg.screenshot({ clip });
        await pg.evaluate((s) => { document.querySelector(s + ' .glow').style.visibility = 'hidden'; }, sel);
        const off = await pg.screenshot({ clip });
        await pg.evaluate((s) => { document.querySelector(s + ' .glow').style.visibility = ''; }, sel);
        const k = nm + '-' + w + '-' + scheme;
        fs.writeFileSync(W + '/../shots/iso-on-' + k + '.png', on); fs.writeFileSync(W + '/../shots/iso-off-' + k + '.png', off);
        out[k] = { clip, bb };
      }
    }
  }
  fs.writeFileSync(W + '/iso.json', JSON.stringify(out));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
