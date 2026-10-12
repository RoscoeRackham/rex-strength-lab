// Can the effort sliders reach all-out at their right end? Press End on each and read the readout.
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  const cases = [
    { storage: { action: 'throw', group: 'solo' }, sl: '#effort-use' },
    { storage: { action: 'punch', group: 'solo' }, sl: '#effort-use' },
    { storage: { action: 'jump', group: 'solo', logKg: 6 }, sl: '#effort-use' },
    { storage: { group: 'duo', duoAction: 'arm' }, sl: '#duo-effort-use' },
    { storage: { group: 'duo', duoAction: 'wrestle' }, sl: '#duo-effort-use' },
  ];
  for (const k of cases) {
    const { ctx, page, errs } = await open(b, 1280, 900, 'light', { storage: JSON.stringify(k.storage), wait: 1500 });
    for (let i = 0; i < 100; i++) { await page.waitForTimeout(100); if (!(await page.evaluate(() => /working it out|Working out/.test(document.querySelector('#bay').innerText)))) break; }
    await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details.effort-adjust')) d.open = true; });
    const before = await page.evaluate((s) => { const e = document.querySelector(s); return { min: e.min, max: e.max, value: e.value }; }, k.sl);
    await page.focus(k.sl); await page.keyboard.press('End'); await page.waitForTimeout(1500);
    const after = await page.evaluate((s) => { const e = document.querySelector(s); const rd = document.querySelector('.effort-read'); return { value: e.value, vt: e.getAttribute('aria-valuetext'), read: rd.innerText.split('\n')[0], sel: (document.querySelector('#effort') || document.querySelector('#duo-effort')).value, cards: [...document.querySelectorAll('.fighter')].map((f) => f.innerText.replace(/\n/g, ' / ')) }; }, k.sl);
    console.log(JSON.stringify(k.storage), '\n  before', JSON.stringify(before), '\n  after End', JSON.stringify(after));
    // now pick All-out from the select, for comparison
    const selId = k.sl === '#effort-use' ? '#effort' : '#duo-effort';
    await page.selectOption(selId, 'allout'); await page.waitForTimeout(1500);
    const ao = await page.evaluate(() => { const rd = document.querySelector('.effort-read'); return { read: rd.innerText.split('\n')[0], verdict: document.querySelector('#bay .verdict').innerText }; });
    console.log('  select all-out', JSON.stringify(ao));
    await ctx.close();
  }
  await b.close();
})();
