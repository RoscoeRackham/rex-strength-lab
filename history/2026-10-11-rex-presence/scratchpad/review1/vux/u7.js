const { open, tab, bayText } = require('./lib');
(async () => {
  for (const [w, d] of [[390, 3], [1280, 3], [360, 1000], [1280, 700], [1280, 2000]]) {
    const { browser, page, errs } = await open({ w, h: 900, saved: { action: 'walk', walkD: d, walker: 'rex', surface: 'concrete' } });
    await tab(page, 'walk', false, 1500);
    const r = await page.evaluate(() => {
      const svg = document.querySelector('#bay .viz svg');
      const W = svg.viewBox.baseVal.width;
      const hl = [...svg.querySelectorAll('line')].filter((l) => l.getAttribute('stroke-dasharray') === '5 4').map((l) => Number(l.getAttribute('y1')));
      const lis = [...svg.querySelectorAll('line')].find((l) => l.getAttribute('stroke') === 'var(--ink)');
      const lx = lis ? Number(lis.getAttribute('x1')) : null;
      const labs = [...svg.querySelectorAll('text.lbl-strong')].map((t) => { const b = t.getBBox(); return { t: t.textContent, x0: b.x, x1: b.x + b.width, y0: b.y, y1: b.y + b.height }; });
      const crossed = [];
      for (const L of labs) {
        for (const y of hl) if (y > L.y0 + 1 && y < L.y1 - 1) crossed.push(L.t + ' crossed by threshold line y=' + y.toFixed(1));
        if (lx != null && L.t !== 'listener' && lx > L.x0 && lx < L.x1) crossed.push(L.t + ' crossed by listener x=' + lx.toFixed(1));
      }
      const li = labs.find((l) => l.t === 'listener');
      return { W, crossed, listener: li ? [li.x0.toFixed(0), li.x1.toFixed(0)] : 'NO LISTENER MARK', lx };
    });
    console.log(w, d, JSON.stringify(r));
    await browser.close();
  }
})();
