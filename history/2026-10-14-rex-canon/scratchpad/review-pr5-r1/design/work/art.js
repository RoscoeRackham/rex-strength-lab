const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const fs = require('fs');
const u5 = prep(), u4 = prep(W + '/pr4-dist.html', 'pr4');
const DUO = (x) => Object.assign({ duoOpen: true }, x);
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w, h] of [[390, 844], [1280, 900]]) for (const scheme of ['light', 'dark']) {
    const shots = {};
    for (const [nm, u] of [['pr4', u4], ['pr5', u5]]) {
      const pg = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme, reducedMotion: 'reduce' });
      await pg.goto(u); await loadOn(pg, DUO({ action: 'walk', duoAction: 'collide', colMode: 'push' }));
      const st = await pg.evaluate(() => Array.from(document.querySelectorAll('.hero img, #duo-bay .art-figure img')).map((i) => { const cs = getComputedStyle(i); return [cs.filter, cs.mixBlendMode, cs.opacity, cs.objectFit, i.naturalWidth + 'x' + i.naturalHeight, i.src.length]; }));
      await pg.evaluate(() => window.scrollTo(0, 0));
      shots[nm] = { hero: await (await pg.$('.hero img')).screenshot(), st };
      const ci = await pg.$('#duo-bay .art-figure img'); await ci.scrollIntoViewIfNeeded(); await pg.waitForTimeout(100); shots[nm].col = await ci.screenshot();
      await pg.close();
    }
    console.log(w, scheme, 'hero identical:', Buffer.compare(shots.pr4.hero, shots.pr5.hero) === 0, 'col identical:', Buffer.compare(shots.pr4.col, shots.pr5.col) === 0, JSON.stringify(shots.pr5.st), JSON.stringify(shots.pr4.st) === JSON.stringify(shots.pr5.st));
    for (const k of ['pr4','pr5']) for (const q of ['hero','col']) fs.writeFileSync(W + '/../shots/art-' + k + '-' + q + '-' + w + scheme + '.png', shots[k][q]);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
