const { session } = require('./lib2');
(async () => {
  const s = await session({ w: 1920, h: 1080 });
  await s.load({});
  await s.page.evaluate(() => window.scrollTo(0, 400));
  const rows = [];
  for (let h = 1040; h <= 1110; h += 5) {
    await s.page.setViewportSize({ width: 1920, height: h }); await s.page.waitForTimeout(250);
    rows.push(await s.page.evaluate((h) => {
      const cue = document.querySelector('#more-below'), gl = document.querySelector('#ground-sec label').getBoundingClientRect(), sel = document.querySelector('#surface').getBoundingClientRect();
      const ct = cue.getBoundingClientRect().top;
      return h + ': cue="' + (cue.hidden ? '(hidden)' : cue.textContent) + '" cueTop=' + Math.round(ct) + ' groundLabel=' + Math.round(gl.top) + '-' + Math.round(gl.bottom) + ' select=' + Math.round(sel.top) + '-' + Math.round(sel.bottom) + (gl.top > ct && !/Ground/.test(cue.textContent) ? '  <-- Ground heading under the cue, not named' : '');
    }, h));
  }
  console.log(rows.join('\n'));
  await s.browser.close();
})();
