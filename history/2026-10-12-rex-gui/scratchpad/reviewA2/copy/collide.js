// Collide footing lines under footing combos.
const H = require('./harness');
const base = { duoAction: 'collide', duoOpen: true };
const cases = [
  ['charge, holder Rex standing', { colMode: 'charge' }],
  ['charge, holder Rex bolted', { colMode: 'charge', anchor: 'bolted' }],
  ['charge, holder Rex bolted, comic ground', { colMode: 'charge', anchor: 'bolted', groundHolds: true }],
  ['push, holder Rex bolted', { colMode: 'push', anchor: 'bolted' }],
  ['push, pusher Ollie bolted only, sand', { colMode: 'push', oAnchor: 'bolted', surface: 'sand' }],
  ['push, both bolted, sand', { colMode: 'push', anchor: 'bolted', oAnchor: 'bolted', surface: 'sand' }],
];
(async () => {
  const b = await H.launch();
  for (const [name, s] of cases) {
    const p = await H.open(b, H.NEW, Object.assign({}, base, s));
    await H.settle(p, '#duo-bay', 60000);
    const t = await p.evaluate(() => { const bay = document.querySelector('#duo-bay'); for (const d of bay.querySelectorAll('details')) d.open = true; return bay.innerText; });
    console.log('=====', name, '\n' + t.replace(/\n{2,}/g, '\n').split('\n').filter((l) => !/^(Least disruptive|Courtesy ceiling|Rattle|Risk|Break|Flatten|Level|All-out|Custom|[0-9.,]+ ?(k?N|MN|GN|m\/s|J|kJ|MJ)$)/.test(l)).join('\n').slice(0, 4000));
    await p.context().close();
  }
  await b.close();
})();
