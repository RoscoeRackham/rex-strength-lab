const { session } = require('./lib2');
(async () => {
  const s = await session();
  for (const c of [{ colBounce: 'splat' }, { colBounce: 'bounce' }, { colBounce: 'bounce', colSrc: 'jump' }, { colBounce: 'bounce', colMode: 'push' }]) {
    await s.load(Object.assign({ duoOpen: true, duoAction: 'collide', colMode: 'charge', colWho: 'rex', oAnchor: 'bolted', surface: 'granite' }, c));
    const t = await s.text('#duo-bay');
    console.log('===', JSON.stringify(c));
    console.log(t.split('\n').filter(l => /rock|force|Peak|crush|bolt/i.test(l)).slice(0, 12).join('\n'));
    console.log(' math:', await s.page.evaluate(() => { const d = document.querySelector('#duo-bay details.math .eq'); return d ? d.textContent : null; }));
  }
  console.log(s.errs);
  await s.browser.close();
})();
