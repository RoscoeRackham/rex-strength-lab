// the cue when the sidebar starts to overflow from a change inside it, with no scroll, toggle or resize
const { launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [w, h] of [[1280, 900], [1280, 1000], [1440, 1100], [1920, 1080]]) {
    const page = await open(b, 'branch.html', { viewport: { width: w, height: h }, state: null, wait: 1500 });
    const st = () => page.evaluate(() => { const a = document.querySelector('.panel-controls'), c = document.getElementById('more-below'), r = a.getBoundingClientRect();
      return { cueHidden: c.hidden, overflow: Math.round(a.scrollHeight - a.clientHeight - a.scrollTop), boxBottom: Math.round(r.bottom), vh: innerHeight, growBottom: Math.round(document.getElementById('grow-fields').getBoundingClientRect().bottom) }; });
    await page.evaluate(() => { window.scrollTo(0, 600); document.getElementById('setup').open = false; document.getElementById('powers').open = true; });
    await page.waitForTimeout(400);
    const a0 = await st();
    await page.selectOption('#absorb', 'gradual'); await page.waitForTimeout(600);
    const a1 = await st();
    console.log(w + 'x' + h, JSON.stringify({ before: a0, afterGradual: a1 }));
    if (a1.overflow > 4 && a1.cueHidden) await page.screenshot({ path: __dirname + '/p8-cue-' + w + 'x' + h + '.png' });
    await page.close();
  }
  await b.close();
})();
