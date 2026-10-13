// The cue against content whose height changes without a scroll, toggle or resize: the strength dial's text
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  const st = (page) => page.evaluate(() => { const a = document.querySelector('.panel-controls'), cue = document.getElementById('more-below');
    // overflow of the real content (the cue's own space left out)
    const cueSpace = cue.hidden ? 0 : cue.offsetHeight + 12 - 16;
    const realBelow = a.scrollHeight - cueSpace - a.clientHeight - a.scrollTop;
    return { cueHidden: cue.hidden, realBelow: Math.round(realBelow), scrollH: a.scrollHeight, clientH: a.clientHeight, dial: document.getElementById('strength').innerText.split('\n').length }; });
  for (const h of [640, 660, 680, 700, 720, 740]) {
    const { page } = await open(browser, { w: 1280, h, file: process.argv[2] || 'branch.html' });
    await page.click('#setup > summary'); await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo(0, 400)); await page.waitForTimeout(200);
    const chips = await page.$$eval('#tier-chips .chip', (c) => c.map((x) => x.textContent.trim()));
    const rows = [];
    for (let i = 0; i < chips.length; i++) {
      await page.click('#tier-chips .chip:nth-child(' + (i + 1) + ')'); await page.waitForTimeout(400);
      const s = await st(page);
      const wrong = (s.cueHidden && s.realBelow > 4) || (!s.cueHidden && s.realBelow <= 0);
      rows.push(chips[i] + ':' + (s.cueHidden ? 'hidden' : 'shown') + '/' + s.realBelow + (wrong ? ' WRONG' : ''));
    }
    console.log('1280x' + h, rows.join(' | '));
    await page.context().close();
  }
  await browser.close();
})();
