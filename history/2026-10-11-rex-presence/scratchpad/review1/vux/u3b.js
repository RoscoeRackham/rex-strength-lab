const { open, tab, bayText } = require('./lib');
(async () => {
  const { browser, page, errs } = await open({});
  await tab(page, 'collide', true, 2500);
  const out = await page.evaluate(() => {
    const P = window.DinoPhys, g = 9.80665;
    const E = (kgTnt) => kgTnt;
    const res = {};
    // collision energy for Ollie at 2.64 m/s into Rex, splat: reduced mass
    const m = 3007, v = 2.64, Q = 0.5 * (m * m / (2 * m)) * v * v;
    res.Q = Q; res.r100 = P.blastRadius(Q, 100);
    res.r100_10kJ = P.blastRadius(10000, 100);
    return res;
  });
  console.log(out);
  // set custom effort 3.17 t via state
  await page.evaluate(() => { const s = document.querySelector('#duo-effort-use'); s.value = String(Math.log10(3170)); s.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(1500);
  const t = await bayText(page);
  const i = t.indexOf('Effort:');
  console.log(t.slice(i, i + 400));
  const j = t.indexOf('Ollie hits'); console.log(t.slice(j - 200, j + 600));
  await browser.close();
})();
