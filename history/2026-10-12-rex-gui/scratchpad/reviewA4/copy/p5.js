const { session } = require('./lib2');
(async () => {
  const s = await session();
  for (const anchor of ['friction', 'bolted']) {
    await s.load({ duoOpen: true, duoAction: 'collide', colMode: 'push', colWho: 'ollie', anchor: 'friction', oAnchor: anchor, surface: 'concrete' });
    const t = await s.text('#duo-bay');
    console.log('=== Ollie (pusher) anchor', anchor); console.log(t.split('\n').filter(l => /push|bolt|feet|Footing|holds/i.test(l)).slice(0, 14).join('\n'));
  }
  console.log(s.errs);
  await s.browser.close();
})();
