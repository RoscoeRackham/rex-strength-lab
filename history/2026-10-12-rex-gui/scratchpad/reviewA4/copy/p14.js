const { session } = require('./lib2');
(async () => {
  for (const [w, h] of [[1920, 1080], [1440, 900]]) {
    const s = await session({ w, h });
    await s.load({});
    await s.page.evaluate(() => window.scrollTo(0, 400)); await s.page.waitForTimeout(500);
    const r = await s.page.evaluate(() => {
      const a = document.querySelector('.panel-controls'), box = a.getBoundingClientRect(), cue = document.querySelector('#more-below');
      const g = document.querySelector('#surface').getBoundingClientRect(), gl = document.querySelector('#ground-sec label').getBoundingClientRect();
      return { boxTop: Math.round(box.top), boxBottom: Math.round(box.bottom), cue: cue.hidden ? '(hidden)' : cue.textContent, cueTop: Math.round(cue.getBoundingClientRect().top), groundLabel: [Math.round(gl.top), Math.round(gl.bottom)], groundSelect: [Math.round(g.top), Math.round(g.bottom)] };
    });
    console.log(w + 'x' + h, JSON.stringify(r));
    await s.page.locator('.panel-controls').screenshot({ path: __dirname + '/sidebar-' + w + 'x' + h + '.png' });
    await s.browser.close();
  }
})();
