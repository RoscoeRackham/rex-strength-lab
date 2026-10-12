// Each comic switch: does its tab visibly change, with a label naming the switch?
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  const busy = (page) => page.evaluate(() => /working it out|Working out/.test(document.querySelector('#bay').innerText));
  const cases = [
    ['sw-gentle', 'Gentle hold', { group: 'solo', action: 'lift', obj: 'car', logKg: 6 }],
    ['sw-gentle', 'Gentle hold', { group: 'solo', action: 'throw', obj: 'car', logKg: 7 }],
    ['sw-passenger', 'Safe passenger', { group: 'solo', action: 'throw', obj: 'person' }],
    ['sw-silent', 'Silent strike', { group: 'solo', action: 'punch', logKg: 9 }],
    ['sw-silent', 'Silent strike', { group: 'solo', action: 'clap', logKg: 9 }],
    ['sw-soft', 'Soft landing', { group: 'solo', action: 'jump', logKg: 7 }],
    ['sw-cool', 'Cool flight', { group: 'solo', action: 'throw', obj: 'baseball', logKg: 7 }],
    ['sw-gentle', 'Gentle hold', { group: 'duo', duoAction: 'catch', cObj: 'car', cStyle: 'hard' }],
    ['sw-passenger', 'Safe passenger', { group: 'duo', duoAction: 'catch', cObj: 'person' }],
  ];
  for (const [sw, name, st] of cases) {
    const { ctx, page, errs } = await open(b, 1280, 900, 'light', { storage: JSON.stringify(st), wait: 1000 });
    for (let i = 0; i < 300; i++) { await page.waitForTimeout(100); if (!(await busy(page))) break; }
    const before = await page.evaluate(() => document.querySelector('#bay').innerText);
    await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
    await page.click('#' + sw);
    for (let i = 0; i < 300; i++) { await page.waitForTimeout(100); if (!(await busy(page))) break; }
    const after = await page.evaluate(() => document.querySelector('#bay').innerText);
    const A = new Set(before.split('\n')), B = after.split('\n');
    const added = B.filter((l) => !A.has(l) && l.trim());
    const labelled = added.filter((l) => l.includes(name));
    console.log('==', name, JSON.stringify(st), 'changed lines', added.length, 'mention switch', labelled.length);
    for (const l of labelled.slice(0, 3)) console.log('   +', l.slice(0, 200));
    if (!labelled.length) for (const l of added.slice(0, 4)) console.log('   ~', l.slice(0, 200));
    if (errs.length) console.log('errs', errs);
    await ctx.close();
  }
  await b.close();
})();
