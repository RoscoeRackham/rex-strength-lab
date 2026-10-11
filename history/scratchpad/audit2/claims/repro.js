const { open } = require('./harness');
const cases = [
  ['A allstar punch comic', { mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', size: 2, chip: 'allstar', tab: 'punch' }],
  ['A2 earth stomp comic', { chip: 'earth', tab: 'stomp' }],
  ['A3 allstar jump', { chip: 'allstar', tab: 'jump' }],
  ['B inf real jump', { mode: 'real', chip: 'inf', tab: 'jump' }],
  ['C hulk real jump concrete', { mode: 'real', chip: 'hulk', tab: 'jump' }],
  ['C2 1e12 real jump granite', { mode: 'real', surface: 'granite', log: 12, tab: 'jump' }],
  ['D plush granite real 1e34 jump', { mode: 'real', surface: 'granite', size: 0.4, log: 34, tab: 'jump' }],
  ['D2 2m granite braced real 1e34 punch', { mode: 'real', surface: 'granite', size: 2, anchor: 'braced', log: 34, tab: 'punch' }],
  ['D3 2m granite braced real inf throw baseball 45', { mode: 'real', surface: 'granite', anchor: 'braced', chip: 'inf', tab: 'throw', obj: 'baseball', angle: 45 }],
  ['E throw 90 car hulk', { mode: 'comic', surface: 'concrete', anchor: 'friction', size: 2, chip: 'hulk', tab: 'throw', obj: 'car', angle: 90 }],
  ['F inf throw car 45 default', { mode: 'comic', surface: 'concrete', anchor: 'friction', size: 2, chip: 'inf', tab: 'throw', obj: 'car', angle: 45 }],
  ['G hulk jump default', { mode: 'comic', chip: 'hulk', tab: 'jump' }],
  ['H stomp bolted hulk', { anchor: 'bolted', chip: 'hulk', tab: 'stomp' }],
  ['I stomp comic ground 1e9', { anchor: 'friction', groundHolds: true, log: 9, tab: 'stomp' }],
  ['J pull bolted allstar car', { groundHolds: false, anchor: 'bolted', chip: 'allstar', tab: 'pull', obj: 'car' }],
  ['K sprint softclay spidey', { anchor: 'friction', surface: 'softclay', chip: 'spidey', tab: 'sprint' }],
  ['L kaiju hulk sprint', { surface: 'concrete', size: 50, chip: 'hulk', tab: 'sprint' }],
  ['L2 kaiju hulk lift car', { size: 50, chip: 'hulk', tab: 'lift', obj: 'car' }],
  ['M spidey stomp', { size: 2, chip: 'spidey', tab: 'stomp' }],
  ['N 1e34 stomp', { log: 34, tab: 'stomp' }],
  ['O hulk throw tank 0 comic', { chip: 'hulk', tab: 'throw', obj: 'tank', angle: 0 }],
];
(async () => {
  const { browser, page, errs } = await open();
  for (const [name, c] of cases) {
    const r = await page.evaluate((c) => { window.__set(c); const x = window.__snap(); delete x.text; return x; }, c);
    console.log('\n### ' + name + '  ' + JSON.stringify(c));
    console.log('dial: ' + r.dial.join(' | '));
    console.log('V: ' + r.verdict);
    console.log('C: ' + r.chips.join(' || '));
    console.log('T: ' + r.tiles.map((t) => t.filter(Boolean).join(' / ')).join(' || '));
    for (const h of r.happens) console.log('  - ' + h.slice(0, 330));
    if (process.env.SVG) for (const h of r.svg) if (h) console.log('  svg ' + h.slice(0, 300));
    if (process.env.MATH) for (const h of r.math) console.log('  math ' + h.replace(/\n/g, ' / ').slice(0, 400));
  }
  // dial scale label
  console.log('\nscale-ends:', await page.evaluate(() => document.querySelector('.scale-ends').innerText.replace(/\n/g, ' | ')));
  console.log('errs', errs);
  await browser.close();
})();
