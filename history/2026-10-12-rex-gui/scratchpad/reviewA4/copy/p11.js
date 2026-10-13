const { session } = require('./lib2');
(async () => {
  const s = await session();
  for (const c of [{ anchor: 'bolted', angle: 30 }, { anchor: 'friction', angle: 30 }, { anchor: 'friction', angle: 60 }]) {
    await s.load(Object.assign({ action: 'throw', surface: 'sand', obj: 'car', logKg: 7 }, c));
    await s.page.selectOption('#effort', 'allout'); await s.stable();
    const t = await s.text('#bay');
    console.log('===', JSON.stringify(c));
    console.log(t.split('\n').filter(l => /sink|bolt|footing|recoil|upper bound/i.test(l)).slice(0, 10).join('\n'));
  }
  console.log(s.errs);
  await s.browser.close();
})();
