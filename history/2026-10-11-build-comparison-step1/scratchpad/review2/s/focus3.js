const { open, SHOTS } = require('./h.js');
(async () => {
  for (const dark of [false, true]) {
    const { browser, p } = await open({ w: 390, h: 844, dark, fonts: false, dpr: 2 });
    for (const id of ['hSame', 'hReal']) {
      const st = await p.evaluate((id) => { const el = document.getElementById(id); el.focus({ focusVisible: true }); const cs = getComputedStyle(el); return { oc: cs.outlineColor, bg: cs.backgroundColor, pressed: el.getAttribute('aria-pressed'), parentBg: getComputedStyle(el.parentElement).backgroundColor }; }, id);
      console.log(dark ? 'dark ' : 'light', id, JSON.stringify(st));
      await (await p.$('#' + id)).screenshot({ path: SHOTS + '/f-' + id + (dark ? '-dark' : '') + '.png' });
    }
    const fig = await p.$$('.fig'); await fig[1].evaluate((c) => c.focus({ focusVisible: true }));
    console.log('fig box', JSON.stringify(await fig[1].boundingBox()));
    await fig[1].screenshot({ path: SHOTS + '/f-fig' + (dark ? '-dark' : '') + '.png' });
    await browser.close();
  }
})();
