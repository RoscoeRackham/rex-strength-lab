// The cue's own space keeps it showing after everything else fits: 1280x720, close Size and density
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  for (const h of [700, 720]) {
    const { page } = await open(browser, { w: 1280, h, file: process.argv[2] || 'branch.html' });
    await page.evaluate(() => window.scrollTo(0, 400)); await page.waitForTimeout(300);
    const s = () => page.evaluate(() => { const a = document.querySelector('.panel-controls'), cue = document.getElementById('more-below'), box = a.getBoundingClientRect();
      const last = document.querySelector('#powers > summary').getBoundingClientRect();
      return { cue: cue.hidden ? 'hidden' : cue.textContent, scrollTop: a.scrollTop, overflowPx: a.scrollHeight - a.clientHeight, powersSummary: [Math.round(last.top), Math.round(last.bottom)], boxBottom: Math.round(box.bottom), cueTop: cue.hidden ? null : Math.round(cue.getBoundingClientRect().top) }; });
    console.log('1280x' + h, 'first load:', JSON.stringify(await s()));
    await page.click('#setup > summary'); await page.waitForTimeout(400);
    console.log('1280x' + h, 'Size and density closed:', JSON.stringify(await s()));
    await page.screenshot({ path: __dirname + '/shots/cueself-1280x' + h + '.png', clip: Object.assign(await page.evaluate(() => { const r = document.querySelector('.panel-controls').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; })) });
    // what a click on it does
    await page.click('#more-below'); await page.waitForTimeout(800);
    console.log('1280x' + h, 'after clicking it:', JSON.stringify(await s()));
    await page.context().close();
  }
  await browser.close();
})();
