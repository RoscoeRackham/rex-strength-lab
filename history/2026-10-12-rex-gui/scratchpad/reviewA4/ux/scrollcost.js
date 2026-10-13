const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  const { page } = await open(browser, { w: 1280, h: 900, state: { duoOpen: true, duoAction: 'collide' } });
  await page.waitForTimeout(3000);
  const r = await page.evaluate(async () => {
    const out = {};
    for (const mode of ['with', 'without']) {
      const t0 = performance.now(); let frames = 0, worst = 0, last = t0;
      for (let y = 0; y < 4000; y += 40) { window.scrollTo(0, y); if (mode === 'with') window.dispatchEvent(new Event('scroll')); await new Promise((r) => requestAnimationFrame(r)); const n = performance.now(); worst = Math.max(worst, n - last); last = n; frames++; }
      out[mode] = { avgFrame: +((performance.now() - t0) / frames).toFixed(1), worst: Math.round(worst) };
    }
    return out;
  });
  console.log(JSON.stringify(r));
  await browser.close();
})();
