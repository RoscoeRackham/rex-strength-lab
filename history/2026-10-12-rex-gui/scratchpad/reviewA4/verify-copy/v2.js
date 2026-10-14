const { open } = require('./h');
(async () => {
  let browser;
  const runs = [
    ['push, Ollie pushes, both standing', { duoOpen: true, duoAction: 'collide', colMode: 'push', colWho: 'ollie', anchor: 'friction', oAnchor: 'friction' }],
    ['push, Ollie pushes, Ollie bolted', { duoOpen: true, duoAction: 'collide', colMode: 'push', colWho: 'ollie', anchor: 'friction', oAnchor: 'bolted' }],
    ['charge stomp, Rex charges, Rex bolted', { duoOpen: true, duoAction: 'collide', colMode: 'charge', colWho: 'rex', colSrc: 'stomp', anchor: 'bolted', oAnchor: 'friction' }],
    ['charge stomp, Rex charges, Rex standing', { duoOpen: true, duoAction: 'collide', colMode: 'charge', colWho: 'rex', colSrc: 'stomp', anchor: 'friction', oAnchor: 'friction' }],
    ['charge sprint, Rex charges, Rex bolted', { duoOpen: true, duoAction: 'collide', colMode: 'charge', colWho: 'rex', colSrc: 'sprint', anchor: 'bolted', oAnchor: 'friction' }],
    ['charge sprint, Rex charges, Rex standing', { duoOpen: true, duoAction: 'collide', colMode: 'charge', colWho: 'rex', colSrc: 'sprint', anchor: 'friction', oAnchor: 'friction' }],
  ];
  for (const [label, st] of runs) {
    const r = await open(Object.assign({ surface: 'concrete' }, st), { browser, wait: 4000 });
    browser = r.browser;
    const lines = await r.page.evaluate(() => document.querySelector('#duo-bay').innerText.split('\n').filter(l => /wins|Dead heat|pushes with|holds|stomp|charges at|hits at|bolted|Bolted/.test(l) && l.length > 25).slice(0, 5));
    console.log('==', label); lines.forEach(l => console.log('  ', l.slice(0, 300)));
    if (r.errs.length) console.log('ERRS', r.errs);
    await r.ctx.close();
  }
  await browser.close();
})();
