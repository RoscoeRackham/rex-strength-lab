const { open, SHOTS } = require('./h.js');
(async () => {
  const { browser, p } = await open({ w: 1280, h: 900 });
  const info = await p.evaluate(() => {
    const t = document.querySelector('#empty-2 .gaptile, #empty-2 svg') ; const sec = document.getElementById('empty-2');
    const svg = sec.querySelector('.gaptile svg');
    const rects = [...svg.querySelectorAll('rect')].filter((r) => r.getAttribute('fill') === 'var(--chalk-band)').map((r) => ({ x: r.getAttribute('x'), w: r.getAttribute('width'), stroke: r.getAttribute('stroke') }));
    const lines = [...svg.querySelectorAll('line')].filter((l) => l.getAttribute('stroke') === 'var(--chalk)').length;
    const arrows = [...svg.querySelectorAll('path')].filter((l) => l.getAttribute('stroke') === 'var(--chalk)').map((a) => a.getAttribute('d'));
    return { rects, lines, arrows };
  });
  console.log('L16 empty-2 tile:', JSON.stringify(info));
  const el = await p.$('#empty-2 .gaptile'); await el.screenshot({ path: SHOTS + '/l16-empty2.png' });
  await browser.close();
})();
