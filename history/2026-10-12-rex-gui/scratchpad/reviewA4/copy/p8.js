const { session } = require('./lib2');
(async () => {
  const s = await session();
  const cases = [
    { anchor: 'bolted', oAnchor: 'friction', surface: 'sand' },
    { anchor: 'friction', oAnchor: 'bolted', surface: 'sand', oH: 5, oM: 3007 * Math.pow(5 / 3.048, 3) },
    { anchor: 'bolted', oAnchor: 'bolted', surface: 'sand', oH: 5, oM: 3007 * Math.pow(5 / 3.048, 3) },
    { anchor: 'bolted', oAnchor: 'bolted', surface: 'concrete', logKg: 9 },
  ];
  for (const c of cases) {
    await s.load(Object.assign({ duoOpen: true, duoAction: 'arm' }, c));
    await s.page.selectOption('#duo-effort', 'allout'); await s.stable();
    const t = await s.text('#duo-bay');
    console.log('===', JSON.stringify(c));
    console.log(t.split('\n').filter(l => /bolt|tear|feet|Feet/i.test(l)).join('\n'));
  }
  console.log(s.errs);
  await s.browser.close();
})();
