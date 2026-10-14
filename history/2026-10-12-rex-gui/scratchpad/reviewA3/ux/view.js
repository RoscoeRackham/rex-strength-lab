const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  const cfgs = [
    { n: 'aside-1280-light-powers', w: 1280, h: 900, scheme: 'light', act: async (p) => { await p.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('setup').open = false; }); }, clip: 'aside' },
    { n: 'aside-1280-dark-powers', w: 1280, h: 900, scheme: 'dark', act: async (p) => { await p.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('setup').open = false; }); }, clip: 'aside' },
    { n: 'duo-390-light-open', w: 390, h: 844, scheme: 'light', state: { duoOpen: true, duoAction: 'collide' }, act: async (p) => { await p.evaluate(() => { document.getElementById('ollie-setup').open = true; }); }, clip: '#duo' },
    { n: 'duo-390-dark-closed', w: 390, h: 844, scheme: 'dark', clip: '#duo' },
    { n: 'duo-1280-dark-open', w: 1280, h: 900, scheme: 'dark', state: { duoOpen: true, duoAction: 'wrestle' }, act: async (p) => { await p.evaluate(() => { document.getElementById('ollie-setup').open = true; }); }, clip: '#duo' },
    { n: 'phone-first-360', w: 360, h: 740, scheme: 'light' },
    { n: 'phone-first-390-dark', w: 390, h: 844, scheme: 'dark' },
  ];
  for (const c of cfgs) {
    const p = await open(b, { w: c.w, h: c.h, scheme: c.scheme, state: c.state || null, wait: 3500 });
    if (c.act) { await c.act(p); await p.waitForTimeout(800); }
    if (c.clip) { const e = await p.$(c.clip); await e.screenshot({ path: S + '/shots/' + c.n + '.png' }); }
    else await p.screenshot({ path: S + '/shots/' + c.n + '.png' });
    if (p.errs.length) console.log(c.n, p.errs);
    await p.context().close();
  }
  await b.close();
})();
