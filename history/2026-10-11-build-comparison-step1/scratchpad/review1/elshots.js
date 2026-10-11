'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const scheme of ['light', 'dark']) {
    const { ctx, p } = await open(browser, { w: 390, h: 844, scheme, dpr: 2 });
    // locator while in the strongmen stop
    const ids = await p.evaluate(() => window.__bc.SEQ.map((s) => s.id));
    console.log(scheme, ids.join(' '));
    await p.evaluate(() => document.getElementById('top').scrollIntoView({ block: 'start' }));
    await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(DIR, 'e-locator-top-' + scheme + '.png'), clip: { x: 0, y: 0, width: 390, height: 500 } });
    // strongmen / groups
    await p.locator('#limitCards').screenshot({ path: path.join(DIR, 'e-limits-' + scheme + '.png') });
    await p.locator('.forest').screenshot({ path: path.join(DIR, 'e-forest-' + scheme + '.png') });
    await p.locator('#fpAxis').screenshot({ path: path.join(DIR, 'e-fpaxis-' + scheme + '.png') });
    // forest axis right edge with border
    const fr = await p.evaluate(() => { const f = document.querySelector('.forest').getBoundingClientRect(); const ax = document.getElementById('fpAxis').getBoundingClientRect(); return { fx: f.left, fw: f.width, ay: ax.top + scrollY, ah: ax.height }; });
    await p.evaluate((y) => window.scrollTo(0, y - 100), fr.ay);
    await p.waitForTimeout(100);
    await p.screenshot({ path: path.join(DIR, 'e-fpaxis-edge-' + scheme + '.png'), clip: { x: 200, y: 80, width: 190, height: 120 } });
    // plates of thor and neighbours
    await p.evaluate(() => document.querySelector('.fig[data-id="thor"]').closest('.figs').scrollIntoView({ block: 'center' }));
    await p.locator('.fig[data-id="thor"]').evaluate((el) => el.closest('.figs')).then(() => {});
    const figs = p.locator('.figs', { has: p.locator('.fig[data-id="thor"]') });
    await figs.screenshot({ path: path.join(DIR, 'e-thor-row-' + scheme + '.png') });
    const figs2 = p.locator('.figs', { has: p.locator('.fig[data-id="luke_cage"]') });
    await figs2.screenshot({ path: path.join(DIR, 'e-luke-row-' + scheme + '.png') });
    // bottom of page: hidden drawer box
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(100);
    await p.screenshot({ path: path.join(DIR, 'e-bottom-' + scheme + '.png') });
    // gap tiles
    const gapIds = await p.evaluate(() => Array.from(document.querySelectorAll('.gaptile')).map((t) => t.getAttribute('data-gap')));
    for (const g of gapIds) await p.locator('.stop#' + g).screenshot({ path: path.join(DIR, 'e-gap-' + g + '-' + scheme + '.png') });
    await ctx.close();
  }
  await browser.close();
})();
