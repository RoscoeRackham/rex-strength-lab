const { open, S } = require('./h.js');
(async () => {
  for (const w of [390, 1280]) {
    const { browser, p } = await open(w, 900, w === 390 ? 'dark' : 'light');
    await p.waitForTimeout(1000);
    const o = await p.evaluate(() => Array.from(document.querySelectorAll('#limitCards .limit')).map((c) => {
      const svg = c.querySelector('svg'), g = svg.querySelector('g'), bb = g.getBBox();
      const skull = svg.querySelector('line.skull'), floor = svg.querySelector('line.floorl');
      return { label: c.querySelector('.plate').innerText.split('\n')[0], viewBox: svg.getAttribute('viewBox'), top: +bb.y.toFixed(1), bottom: +(bb.y + bb.height).toFixed(1), width: +bb.width.toFixed(1), skullY: skull && +skull.getAttribute('y1'), floorY: floor && +floor.getAttribute('y1') };
    }));
    console.log(w, JSON.stringify(o));
    await p.evaluate(() => document.getElementById('limitCards').scrollIntoView());
    await p.screenshot({ path: S + '/limits-' + w + '.png' });
    await browser.close();
  }
  const L = require(S + '/tree/build-comparison/data/limits.json');
  for (const it of L.items) { const pts = it.figure.parts.flatMap((q) => q.poly); const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]); console.log(it.id, 'width m', (Math.max(...xs) - Math.min(...xs)).toFixed(3), 'height m', (Math.max(...ys) - Math.min(...ys)).toFixed(3)); }
})();
