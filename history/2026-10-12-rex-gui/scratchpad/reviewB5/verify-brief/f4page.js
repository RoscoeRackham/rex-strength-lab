const { open } = require('./harness.js');
(async () => {
  const h = await open();
  const grab = (t, re) => t.split('\n').filter(l => re.test(l)).map(l => '   > ' + l.slice(0, 600)).join('\n');
  const re = /sink|print|Footprint|give|pressed|holds it|no craters/i;
  for (const [act, extra] of [['lift', { obj: 'bus' }], ['throw', { obj: 'car' }], ['walk', {}], ['weight', {}]]) {
    await h.load(Object.assign({ action: act, surface: 'sand' }, extra));
    if (await h.page.$('#effort')) await h.pick('#effort', 'allout');
    const t = await h.text();
    console.log('=== ' + act + ' (sand, 100 t dial, all-out where an effort exists) ===\n' + grab(t, re));
  }
  console.log('errs', h.errs);
  await h.browser.close();
})();
