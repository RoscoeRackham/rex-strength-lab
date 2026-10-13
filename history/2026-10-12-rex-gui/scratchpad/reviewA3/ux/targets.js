const { launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [w, h] of [[390, 844], [1280, 900]]) {
    const page = await open(b, { w, h, state: { duoOpen: true }, wait: 3000 });
    await page.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('ollie-setup').open = true; });
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const out = [];
      const sel = ['label:has(#bolt-rex)', 'label:has(#bolt-ollie)', 'label:has(#ground-holds)', '#duo > summary', '#ollie-setup > summary', '#powers > summary', '#setup > summary', '#surface', '#o-same', '#o-own', '#duo-tabs .tab', '#tabs .tab'];
      for (const s of sel) for (const n of document.querySelectorAll(s)) { const rc = n.getBoundingClientRect(); if (rc.width < 24 || rc.height < 24) out.push(s + ' ' + Math.round(rc.width) + 'x' + Math.round(rc.height)); }
      const a = document.querySelector('label:has(#bolt-rex)').getBoundingClientRect(), c = document.querySelector('label:has(#bolt-ollie)').getBoundingClientRect();
      return { small: out, rexLabel: [Math.round(a.left), Math.round(a.top), Math.round(a.width), Math.round(a.height)], ollieLabel: [Math.round(c.left), Math.round(c.top), Math.round(c.width), Math.round(c.height)] };
    });
    console.log(w, JSON.stringify(r));
    await page.context().close();
  }
  await b.close();
})();
