const { launch, open, R } = require('./lib');
(async () => {
  const b = await launch();
  for (const [w, h, sch] of [[360, 740, 'light'], [390, 844, 'dark'], [768, 1024, 'light'], [1024, 768, 'dark'], [1280, 900, 'light']]) {
    const { ctx, p } = await open(b, w, h, sch);
    const r = await p.evaluate(() => Array.from(document.querySelectorAll('#limitCards .limit')).map((card) => {
      const svg = card.querySelector('svg'), vb = svg.viewBox.baseVal, g = svg.querySelector('g'), bb = g.getBBox();
      // skull line: wall line with class skull
      const sk = svg.querySelector('line.skull'), skullY = sk ? +sk.getAttribute('y1') : null;
      const floor = svg.querySelector('line.floorl'), floorY = floor ? +floor.getAttribute('y1') : null;
      const cr = card.getBoundingClientRect(), sr = svg.getBoundingClientRect();
      const overflow = Array.from(card.querySelectorAll('.plate *')).filter((el) => { const q = el.getBoundingClientRect(); return q.width && q.right > cr.right + 0.5; }).map((el) => el.className);
      return { label: card.querySelector('.lb').textContent.slice(0, 30), vb: [vb.width, vb.height], bb: [bb.x, bb.y, bb.x + bb.width, bb.y + bb.height].map((x) => +x.toFixed(1)), skullY, floorY, figTopVsSkull: +(bb.y - skullY).toFixed(1), cardW: cr.width, svgH: sr.height, cardH: cr.height, overflow };
    }));
    console.log(w, sch);
    r.forEach((c) => console.log('  ', JSON.stringify(c)));
    await p.locator('#limits').screenshot({ path: R + `/limits-${w}-${sch}.png` });
    await ctx.close();
  }
  await b.close();
})();
