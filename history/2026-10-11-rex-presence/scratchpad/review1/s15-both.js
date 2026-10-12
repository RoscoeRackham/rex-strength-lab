const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.addInitScript(() => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'walk', walker: 'both' })); sessionStorage.setItem('x', 1); } });
  await page.goto(PREV); await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const svg = document.querySelector('#bay .viz svg');
    const lis = [...svg.querySelectorAll('line')].find((l) => l.getAttribute('stroke') === 'var(--ink)');
    const x = +lis.getAttribute('x1');
    const paths = [...svg.querySelectorAll('path')].map((p) => { const pts = p.getAttribute('d').split(/[ML]/).filter(Boolean).map((s) => s.trim().split(' ').map(Number)); let best = pts[0]; for (const q of pts) if (Math.abs(q[0] - x) < Math.abs(best[0] - x)) best = q; return best; });
    // y of the threshold lines with labels
    const dashed = [...svg.querySelectorAll('line[stroke-dasharray="5 4"]')].map((l) => +l.getAttribute('y1'));
    const yTicks = [...svg.querySelectorAll('text')].filter((t) => /m\/s$/.test(t.textContent)).map((t) => [t.textContent, +t.getAttribute('y') - 4]);
    return { verdict: document.querySelector('#bay .verdict').innerText, chips: [...document.querySelectorAll('#bay .status')].map((s) => s.innerText), tile: document.querySelector('#bay .tile .v').innerText, listenerX: x, curveAtListener: paths, thresholdYs: dashed, yTicks };
  });
  console.log(JSON.stringify(r, null, 1));
  // convert curve y back to PPV with the tick positions (log axis)
  const t = r.yTicks; const y1 = t.find((x) => x[0] === '1 m/s')[1], y0 = t.find((x) => x[0] === '1 µm/s')[1];
  for (const p of r.curveAtListener) console.log('curve at listener ≈', (Math.pow(10, -6 + 6 * (y0 - p[1]) / (y0 - y1)) * 1000).toFixed(3), 'mm/s');
  const el = await page.$('#bay .viz'); await el.screenshot({ path: OUT + 'both-chart-390.png' });
  await b.close();
})();
