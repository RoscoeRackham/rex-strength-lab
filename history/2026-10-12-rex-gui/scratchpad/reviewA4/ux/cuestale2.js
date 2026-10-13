// Branch: the cue hidden because everything fits; a strength chip with a longer quote then pushes Their powers below
// the box's edge, and no event updates the cue
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  for (const h of [680, 690]) {
    const { page } = await open(browser, { w: 1280, h, file: process.argv[2] || 'branch.html' });
    await page.evaluate(() => window.scrollTo(0, 400)); await page.waitForTimeout(300);
    await page.click('#setup > summary'); await page.waitForTimeout(400);
    await page.evaluate(() => { const a = document.querySelector('.panel-controls'); a.scrollTop = a.scrollHeight; }); await page.waitForTimeout(400);
    const s = (label) => page.evaluate((label) => { const a = document.querySelector('.panel-controls'), cue = document.getElementById('more-below'), box = a.getBoundingClientRect(), p = document.querySelector('#powers > summary').getBoundingClientRect();
      return label + ' ' + JSON.stringify({ cue: cue.hidden ? 'hidden' : cue.textContent, overflow: a.scrollHeight - a.clientHeight - a.scrollTop, powersSummaryTop: Math.round(p.top), boxBottom: Math.round(box.bottom), powersVisible: p.bottom <= box.bottom }); }, label);
    console.log('1280x' + h, await s('Size and density closed, box at its end:'));
    await page.click('#tier-chips .chip:nth-child(5)'); await page.waitForTimeout(600);
    console.log('1280x' + h, await s('after the All-Star Superman chip:'));
    const r = await page.evaluate(() => { const r = document.querySelector('.panel-controls').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
    await page.screenshot({ path: __dirname + '/shots/cuestale-1280x' + h + '.png', clip: r });
    await page.context().close();
  }
  await browser.close();
})();
