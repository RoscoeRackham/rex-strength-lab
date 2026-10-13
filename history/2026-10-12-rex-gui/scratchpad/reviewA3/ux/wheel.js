const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const which of ['branch', 'main']) for (const [w, h] of [[1280, 900], [1024, 768]]) for (const duoOpen of [false, true]) {
    const st = which === 'main' ? { group: duoOpen ? 'duo' : 'solo' } : { duoOpen };
    const page = await open(b, { which, w, h, state: st, wait: 3500 });
    const x = 120; // over the sidebar (wrap padding 16 + panel)
    const log = [];
    await page.mouse.move(x, 400);
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(150);
      log.push(await page.evaluate(() => Math.round(scrollY) + '/' + Math.round(document.querySelector('aside').scrollTop)));
    }
    const geo = await page.evaluate(() => { const a = document.querySelector('aside'); return { asideH: a.scrollHeight, client: a.clientHeight, docH: document.documentElement.scrollHeight }; });
    console.log(which, w + 'x' + h, 'duoOpen=' + duoOpen, JSON.stringify(geo), 'page/aside scroll after each wheel:', log.join(' '));
    await page.context().close();
  }
  await b.close();
})();
