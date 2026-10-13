const { session } = require('./lib2');
(async () => {
  for (const [w, h] of [[1280, 900], [1280, 700], [1920, 1080], [1000, 1400], [1280, 1600]]) {
    const s = await session({ w, h });
    await s.load({});
    const r = await s.page.evaluate(() => {
      const a = document.querySelector('.panel-controls'), box = a.getBoundingClientRect(), cue = document.querySelector('#more-below');
      const pos = ['setup', 'ground-sec', 'powers'].map(id => [id, Math.round(document.getElementById(id).getBoundingClientRect().top)]);
      return { boxBottom: Math.round(box.bottom), cueTop: cue.hidden ? null : Math.round(cue.getBoundingClientRect().top), pos, cue: cue.hidden ? '(hidden)' : cue.textContent, setupOpen: document.querySelector('#setup').open };
    });
    console.log(w + 'x' + h, JSON.stringify(r));
    // scroll the page down a lot and re-check
    await s.page.mouse.wheel(0, 1500); await s.page.waitForTimeout(400);
    const r2 = await s.page.evaluate(() => { const cue = document.querySelector('#more-below'); return cue.hidden ? '(hidden)' : cue.textContent; });
    console.log('   after page scroll (mouse over bay?):', r2);
    await s.browser.close();
  }
})();
