const { launch, open } = require('./lib.js');
const CASES = [
  ['group duo, bad duoAction', { group: 'duo', duoAction: 'walk' }],
  ['duoOpen string', { duoOpen: 'yes' }],
  ['duoOpen 1', { duoOpen: 1 }],
  ['braced + bolted', { anchor: 'braced', oAnchor: 'bolted' }],
  ['no wAngle, angle 95', { angle: 95, wrestleMove: 'throw' }],
  ['no wAngle, angle 60', { angle: 60 }],
  ['wAngle null', { wAngle: null, angle: 20 }],
  ['group solo', { group: 'solo', duoAction: 'catch' }],
  ['corrupt json', '{"anchor": "bolted",'],
  ['number json', '5'],
  ['string json', '"abc"'],
  ['array json', '[1,2]'],
  ['anchor object', { anchor: { x: 1 }, oAnchor: null }],
  ['group duo + duoOpen false', { group: 'duo', duoOpen: false }],
];
(async () => {
  const b = await launch();
  for (const [name, st] of CASES) {
    const page = await open(b, 'branch.html', { count: true, state: st, wait: 1500 });
    const r = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1'));
      return { open: document.getElementById('duo').open, calls: window.__duoCalls, saved: { group: s.group, duoOpen: s.duoOpen, duoAction: s.duoAction, anchor: s.anchor, oAnchor: s.oAnchor, angle: s.angle, wAngle: s.wAngle, extra: Object.keys(s).filter((k) => /^\d+$/.test(k)) },
        sw: [document.getElementById('bolt-rex').checked, document.getElementById('bolt-ollie').checked], tab: (document.querySelector('#duo-tabs [aria-selected="true"]') || {}).id, rex: !!document.querySelector('#bay .verdict') }; });
    console.log(name.padEnd(28), JSON.stringify(r), page.errs.length ? 'ERRS ' + page.errs.join(' | ') : '');
    await page.close();
  }
  await b.close();
})();
