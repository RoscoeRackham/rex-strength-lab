const { session } = require('./lib2');
(async () => {
  const s = await session();
  for (const c of [{ anchor: 'bolted', surface: 'sand' }, { surface: 'sand' }, { surface: 'concrete', oM: 4000 }, { surface: 'sand', oM: 4000 }, { anchor: 'bolted', oAnchor: 'bolted', surface: 'concrete' }]) {
    await s.load(Object.assign({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push' }, c));
    await s.page.selectOption('#duo-effort', 'allout'); await s.stable();
    const t = await s.text('#duo-bay');
    console.log('===', JSON.stringify(c));
    const lines = t.split('\n');
    const i = lines.findIndex(l => /^Pushing|^Neither|^Rex|^Ollie/.test(l) && l.length > 40);
    console.log(lines.filter(l => /Pushing straight|Neither moves|holds .*drives|Walking drive|Equal bodies|Both bolted|can’t be moved/.test(l)).join('\n'));
  }
  console.log(s.errs);
  await s.browser.close();
})();
