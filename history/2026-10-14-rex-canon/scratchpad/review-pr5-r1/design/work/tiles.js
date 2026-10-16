const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const fs = require('fs');
const url = prep();
const DUO = (x) => Object.assign({ duoOpen: true }, x);
const gb01 = Math.log10(0.001 / Math.sqrt(1 - 1e-6));
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w, h] of [[390, 844], [1280, 900]]) for (const scheme of ['light', 'dark']) {
    const pg = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme, reducedMotion: 'reduce' });
    await pg.goto(url);
    await loadOn(pg, DUO({ action: 'throw', obj: 'car', duoAction: 'collide', colSrc: 'set', colGB: gb01 }), 'allout');
    const tag = w + '-' + scheme;
    let e = await pg.$('#bay .tile.shimmer'); e = await e.evaluateHandle((n) => n.parentElement); await e.screenshot({ path: W + '/../shots/tiles-throw-' + tag + '.png' });
    e = await pg.$('#duo-bay .tile.shimmer'); e = await e.evaluateHandle((n) => n.parentElement); await e.screenshot({ path: W + '/../shots/tiles-collide-' + tag + '.png' });
    // the header region
    await pg.evaluate(() => window.scrollTo(0, 0)); await pg.screenshot({ path: W + '/../shots/top-' + tag + '.png', clip: { x: 0, y: 0, width: w, height: Math.min(h, 400) } });
    // the Collide figure with its caption
    e = await pg.$('#duo-bay .art-figure'); await e.screenshot({ path: W + '/../shots/fig-' + tag + '.png' });
    const ov = await pg.evaluate(() => Array.from(document.querySelectorAll('.tile.shimmer, .tile.shimmer *')).filter((n) => n.scrollWidth > n.clientWidth + 1).map((n) => n.className + ' ' + n.scrollWidth + '>' + n.clientWidth));
    console.log(tag, 'overflowing:', ov);
    await pg.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
