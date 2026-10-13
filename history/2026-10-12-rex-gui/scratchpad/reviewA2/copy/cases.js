// Focused cases for the footing claims.
const H = require('./harness');
const cases = [
  ['sprint sand standing', { action: 'sprint', surface: 'sand' }, '#bay'],
  ['sprint sand bolted', { action: 'sprint', surface: 'sand', anchor: 'bolted' }, '#bay'],
  ['sprint softclay standing', { action: 'sprint', surface: 'softclay' }, '#bay'],
  ['sprint softclay bolted', { action: 'sprint', surface: 'softclay', anchor: 'bolted' }, '#bay'],
  ['shove sand Rex bolted -> Ollie standing', { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex', surface: 'sand', anchor: 'bolted', duoOpen: true }, '#duo-bay'],
  ['shove sand both bolted', { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex', surface: 'sand', anchor: 'bolted', oAnchor: 'bolted', duoOpen: true }, '#duo-bay'],
  ['push sand Rex bolted', { duoAction: 'wrestle', wrestleMove: 'push', surface: 'sand', anchor: 'bolted', duoOpen: true }, '#duo-bay'],
  ['push sand both bolted', { duoAction: 'wrestle', wrestleMove: 'push', surface: 'sand', anchor: 'bolted', oAnchor: 'bolted', duoOpen: true }, '#duo-bay'],
  ['lift Ollie bolted', { duoAction: 'wrestle', wrestleMove: 'lift', wrestleWho: 'rex', anchor: 'friction', oAnchor: 'bolted', duoOpen: true }, '#duo-bay'],
  ['throw Ollie bolted', { duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: 'rex', oAnchor: 'bolted', duoOpen: true }, '#duo-bay'],
];
(async () => {
  const b = await H.launch();
  for (const [name, s, sel] of cases) {
    const p = await H.open(b, H.NEW, s);
    await H.settle(p, sel, 60000);
    if (/effort/.test(name)) {}
    const t = await p.evaluate((q) => { const bay = document.querySelector(q); for (const d of bay.querySelectorAll('details')) d.open = true; return bay.innerText; }, sel);
    console.log('=====', name, '\n' + t.replace(/\n{2,}/g, '\n').slice(0, 2600));
    await p.context().close();
  }
  await b.close();
})();
