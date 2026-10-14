const { session } = require('./lib2');
(async () => {
  const s = await session();
  for (const a of ['pull', 'punch']) {
    await s.load({ action: a, surface: 'ice', logKg: 8, anchor: 'bolted' });
    await s.page.selectOption('#effort', 'allout'); await s.stable();
    console.log('=====', a); console.log((await s.text('#bay')).split('\n').filter(l => l.trim()).slice(28, 200).join('\n'));
  }
  await s.browser.close();
})();
