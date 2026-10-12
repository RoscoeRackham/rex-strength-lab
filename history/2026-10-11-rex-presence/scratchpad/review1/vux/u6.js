const { open, tab, bayText } = require('./lib');
(async () => {
  const { browser, page, errs } = await open({ w: 390, h: 844, saved: { walker: 'both', action: 'walk', surface: 'concrete', walkD: 3 } });
  await tab(page, 'walk', false, 1500);
  const r = await page.evaluate(() => {
    const b = document.querySelector('#bay');
    const svg = b.querySelector('.viz svg');
    const paths = [...svg.querySelectorAll('path')].map((p) => p.getAttribute('d'));
    const vb = svg.viewBox.baseVal;
    // listener x
    const lines = [...svg.querySelectorAll('line')];
    const listener = lines.find((l) => l.getAttribute('stroke') === 'var(--ink)');
    const lx = Number(listener.getAttribute('x1'));
    // y at listener for each path: find nearest point
    const yAt = (d) => { const pts = d.split(/[ML]/).filter(Boolean).map((s) => s.trim().split(' ').map(Number)); let best = null; for (const p of pts) if (!best || Math.abs(p[0] - lx) < Math.abs(best[0] - lx)) best = p; return best; };
    // y axis mapping: find tick labels
    const texts = [...svg.querySelectorAll('text')].map((t) => [t.textContent, Number(t.getAttribute('x')), Number(t.getAttribute('y'))]);
    return { verdict: b.querySelector('.verdict').innerText, chips: b.querySelector('.status-row').innerText, legend: b.querySelector('.ladder-legend').innerText, lx, ys: paths.map(yAt), same: paths[0] === paths[1], texts: texts.filter((t) => /mm\/s|µm\/s|m\/s|ripples|felt/.test(t[0])), h: vb.height };
  });
  console.log(JSON.stringify(r, null, 1));
  // engine check: single-walker ppv at 3 m
  const v = await page.evaluate(() => { const P = window.DinoPhys; const sf = window.DINO_DATA.surfaces.find((s) => s.id === 'concrete'); const b = P.makeBody({ H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m, build: 'rex' }); const pr = P.presence(b, sf, { pace: 'walk', effort: 0, groundHolds: false }); return { one: pr.ppv(3), shimmer: P.VIB.TH.shimmer }; });
  console.log(v);
  await page.screenshot({ path: 'u6-walk-both.png', fullPage: true });
  await browser.close();
})();
