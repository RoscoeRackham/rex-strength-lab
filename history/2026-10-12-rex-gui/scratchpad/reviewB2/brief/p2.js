const H = require('./harness.js'), fs = require('fs');
(async () => {
  const c = await H.open();
  for (const [st, eff, name] of [[{ action: 'jump', logKg: 8 }, 'allout', 'jump'], [{ action: 'jump', logKg: 8, unbreakable: false }, 'allout', 'jumpoff'], [{ action: 'throw', logKg: 9, obj: 'car', angle: 30 }, 'allout', 'throw'], [{ action: 'stomp', logKg: 8 }, 'allout', 'stomp'], [{ action: 'lift', logKg: 7, obj: 'bus', surface: 'sand' }, null, 'lift']]) {
    await H.load(c, st);
    if (eff) await H.pickEffort(c.page, '#effort', eff);
    await c.page.evaluate(() => { const s = document.getElementById('absorb'); s.value = 'gradual'; s.dispatchEvent(new Event('change', { bubbles: true })); });
    await H.settle(c.page);
    const t = await H.texts(c.page);
    fs.writeFileSync('out/grow-' + name + '.txt', t.solo);
    const g = t.solo.split('\n').filter((l) => /Gradual growth|absorbed\.|taken back|grow/i.test(l));
    console.log('== ' + name + '\n  ' + g.join('\n  '));
  }
  console.log(c.errs);
  await c.browser.close();
})();
