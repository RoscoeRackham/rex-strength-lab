// cue staleness: content in the sidebar grows below the edge with no scroll, toggle or resize
const { launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [w, h] of [[1280, 900], [1440, 900], [1280, 800]]) {
    const page = await open(b, 'branch.html', { viewport: { width: w, height: h }, state: null, wait: 1500 });
    const st = () => page.evaluate(() => { const a = document.querySelector('.panel-controls'), c = document.getElementById('more-below');
      return { hidden: c.hidden, text: c.textContent, remaining: Math.round(a.scrollHeight - a.clientHeight - a.scrollTop), scrollTop: Math.round(a.scrollTop), growShown: !document.getElementById('grow-fields').hidden, growTop: Math.round(document.getElementById('grow-fields').getBoundingClientRect().top), boxBottom: Math.round(a.getBoundingClientRect().bottom) }; });
    // page scrolled so the sidebar sticks; Their powers open; sidebar scrolled to its end
    await page.evaluate(() => { window.scrollTo(0, 600); document.getElementById('powers').open = true; });
    await page.waitForTimeout(300);
    await page.evaluate(() => { const a = document.querySelector('.panel-controls'); a.scrollTop = a.scrollHeight; });
    await page.waitForTimeout(300);
    const atEnd = await st();
    await page.selectOption('#absorb', 'gradual');
    await page.waitForTimeout(800);
    const afterAbsorb = await st();
    // now scroll the sidebar by 1px: the cue updates
    await page.evaluate(() => { const a = document.querySelector('.panel-controls'); a.scrollTop -= 1; });
    await page.waitForTimeout(200);
    const afterNudge = await st();
    console.log(w + 'x' + h, JSON.stringify({ atEnd, afterAbsorb, afterNudge }));
    await page.screenshot({ path: __dirname + '/p1-cue-' + w + 'x' + h + '.png' });
    if (page.errs.length) console.log('errors', page.errs);
    await page.close();
  }
  await b.close();
})();
