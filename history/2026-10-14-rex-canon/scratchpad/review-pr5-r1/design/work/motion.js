const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const url = prep();
const DUO = (x) => Object.assign({ duoOpen: true }, x);
const gb01 = Math.log10(0.001 / Math.sqrt(1 - 1e-6));
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const rm of ['reduce', 'no-preference']) {
    const pg = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: rm });
    await pg.goto(url); await loadOn(pg, DUO({ action: 'stomp', logKg: 9, duoAction: 'collide', colSrc: 'set', colGB: gb01 }), 'allout');
    await pg.selectOption('#effort', 'allout'); await pg.waitForTimeout(400); await settledOn(pg, 'bay');
    const r = await pg.evaluate(() => {
      const anims = document.getAnimations().map((a) => ({ name: a.animationName || (a.effect && a.effect.getKeyframes && JSON.stringify(a.effect.getKeyframes().map((k) => Object.keys(k).filter((x) => !['offset', 'easing', 'composite', 'computedOffset'].includes(x))))), target: a.effect && a.effect.target ? (a.effect.target.closest('.glow') ? 'glow' : a.effect.target.className || a.effect.target.tagName) : '?' }));
      const tr = Array.from(document.querySelectorAll('.glow, .glow i, .glow-art')).map((n) => getComputedStyle(n).transitionProperty + '/' + getComputedStyle(n).transitionDuration);
      return { anims: anims.reduce((m, a) => { const k = a.name + '@' + a.target; m[k] = (m[k] || 0) + 1; return m; }, {}), tr: [...new Set(tr)] };
    });
    console.log(rm, JSON.stringify(r));
    await pg.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
