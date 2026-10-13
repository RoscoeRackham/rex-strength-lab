// screenshots of keyboard focus landing under the cue
const { open, launch } = require('./h.js');
const fs = require('fs');
fs.mkdirSync(__dirname + '/shots', { recursive: true });
(async () => {
  const browser = await launch();
  const cases = [
    [1280, 720, 'light', 'surface', 'Tab to the Ground menu'],
    [1280, 720, 'dark', 'surface', 'Tab to the Ground menu'],
    [1024, 768, 'light', 'density', 'Tab to the density slider'],
    [1280, 900, 'light', 'BH', 'Tab to the Black hole chip'],
    [1920, 1080, 'light', 'surface', 'Tab to the Ground menu'],
  ];
  for (const [w, h, scheme, target, what] of cases) {
    const { page } = await open(browser, { w, h, scheme });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.focus('body');
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab');
      const hit = await page.evaluate((t) => { const a = document.activeElement; return t === 'BH' ? /Black hole/.test(a.textContent) && a.closest('aside') : a.id === t; }, target);
      if (hit) break;
    }
    await page.waitForTimeout(300);
    const info = await page.evaluate(() => { const a = document.activeElement, cue = document.getElementById('more-below'); return { focused: a.id || a.textContent.trim().slice(0, 20), value: a.value, cue: cue.hidden ? null : cue.textContent, rect: a.getBoundingClientRect().toJSON(), cueRect: cue.getBoundingClientRect().toJSON() }; });
    console.log(w + 'x' + h + ' ' + scheme + ' ' + what + ': ' + JSON.stringify(info));
    const box = await page.evaluate(() => document.querySelector('.panel-controls').getBoundingClientRect().toJSON());
    const f = 'shots/cuefocus-' + w + 'x' + h + '-' + scheme + '-' + target + '.png';
    await page.screenshot({ path: __dirname + '/' + f, clip: { x: box.x, y: Math.max(0, box.bottom - 260), width: box.width, height: Math.min(260, box.bottom) } });
    console.log('   ' + f);
    await page.context().close();
  }
  await browser.close();
})();
