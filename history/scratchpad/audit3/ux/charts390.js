const { open, close } = require('./h.js');
(async () => {
  const cases = [
    ['sprint', { action: 'sprint' }],
    ['sprint-hi', { action: 'sprint', logKg: 20 }],
    ['stomp20', { action: 'stomp', logKg: 20 }],
    ['stomp24', { action: 'stomp', logKg: 24 }],
    ['pull24', { action: 'pull', obj: 'car', logKg: 24 }],
    ['pull', { action: 'pull', obj: 'cc177', logKg: 2.708 }],
    ['titanic20', { action: 'throw', obj: 'titanic', logKg: 20 }],
    ['nimitzreal', { action: 'throw', obj: 'nimitz', logKg: 12, mode: 'real' }],
    ['loco', { action: 'throw', obj: 'loco', logKg: 18.7, angle: 80 }],
    ['throw-desoto16', { action: 'throw', obj: 'desoto', logKg: 16 }],
    ['throw-car24', { action: 'throw', obj: 'car', logKg: 24 }],
  ];
  for (const [name, st] of cases) {
    const { page, ctx } = await open({ w: 390, h: 844, state: st, dpr: 2 });
    const info = await page.evaluate(() => [...document.querySelectorAll('#bay svg')].map((svg) => {
      const vb = svg.viewBox.baseVal;
      const ticks = [...svg.querySelectorAll('text')].filter((t) => +t.getAttribute('y') > vb.height - 20).map((t) => { const b = t.getBBox(); return t.textContent + '@' + b.x.toFixed(0) + '-' + (b.x + b.width).toFixed(0); });
      const rects = [...svg.querySelectorAll('rect')].map((r) => +(+r.getAttribute('x')).toFixed(0) + '+' + (+r.getAttribute('width')).toFixed(0));
      return { label: (svg.getAttribute('aria-label') || '').slice(0, 300), vbw: vb.width, w: svg.getBoundingClientRect().width.toFixed(0), ticks, rects };
    }));
    console.log('== ' + name); for (const i of info) console.log(JSON.stringify(i));
    const n = await page.$$('#bay .viz');
    for (let k = 0; k < n.length; k++) await n[k].screenshot({ path: `c390-${name}-${k}.png` });
    const tiles = await page.$('#bay .tiles'); if (tiles) await tiles.screenshot({ path: `c390-${name}-tiles.png` });
    await ctx.close();
  }
  await close();
})();
