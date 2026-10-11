const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const skel of ['host', 'task']) for (const w of [360, 390, 768, 1280]) {
    const p = await open(b, { width: w, height: 900, skel });
    for (const z of ['zAll', 'zHum']) {
      await p.click('#' + z);
      const r = await p.evaluate(() => {
        const tp = document.querySelector('#fpAxis .tp').getBoundingClientRect(), card = document.querySelector('.forest').getBoundingClientRect();
        const bs = Array.from(document.querySelectorAll('#fpAxis .tp b')); const lastB = bs[bs.length - 1], firstB = bs[0];
        const lr = lastB.getBoundingClientRect(), fr = firstB.getBoundingClientRect();
        return { last: lastB.textContent, lastSpan: [lr.left, lr.right].map(x => +x.toFixed(1)), tapeRight: +tp.right.toFixed(1), cardRight: +card.right.toFixed(1), pastTape: +(lr.right - tp.right).toFixed(1), pastCardBorder: +(lr.right - card.right).toFixed(1), first: firstB.textContent, firstPastLeft: +(tp.left - fr.left).toFixed(1), sw: document.documentElement.scrollWidth };
      });
      console.log(skel, w, z, JSON.stringify(r));
    }
    if (skel === 'host' && w === 390) { await p.click('#zAll'); const el = await p.$('#fpAxis'); await el.scrollIntoViewIfNeeded(); const bb = await el.boundingBox(); await p.screenshot({ path: `${DIR}/l11-390.png`, clip: { x: 250, y: bb.y, width: 140, height: bb.height } }); }
    await p._ctx.close();
  }
  await b.close();
})();
