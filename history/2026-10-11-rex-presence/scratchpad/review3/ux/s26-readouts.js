// Full effort readouts on a fresh visit at 390 px, with word counts and heights, and a screenshot of the first screen
// from the tab row down for each tab.
const { launch, open, OUT } = require('./lib');
const busy = (page) => page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText));
(async () => {
  const b = await launch();
  const { ctx, page, errs } = await open(b, 390, 844, 'light', { wait: 1500 });
  for (const [grp, tab] of [['solo', 'throw'], ['solo', 'jump'], ['solo', 'stomp'], ['solo', 'punch'], ['solo', 'clap'], ['solo', 'sprint'], ['solo', 'pull'], ['duo', 'arm'], ['duo', 'wrestle'], ['duo', 'catch'], ['duo', 'collide']]) {
    await page.click('#grp-' + grp); await page.click('#tab-' + tab);
    for (let i = 0; i < 150; i++) { await page.waitForTimeout(100); if (!(await busy(page))) break; }
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => { const rd = document.querySelector('#bay .effort-read'); const v = document.querySelector('#bay .verdict'); const t = document.querySelector('#tabs'); const tl = document.querySelector('#bay .tiles'); return { text: rd && rd.innerText, words: rd ? rd.innerText.split(/\s+/).length : 0, h: rd ? Math.round(rd.getBoundingClientRect().height) : 0, verdictBelowTabsTop: Math.round(v.getBoundingClientRect().top - t.getBoundingClientRect().top), tilesBelowTabsTop: tl ? Math.round(tl.getBoundingClientRect().top - t.getBoundingClientRect().top) : null }; });
    console.log('==', tab, 'words', r.words, 'height', r.h, 'verdict', r.verdictBelowTabsTop, 'px below the tab row; first tiles', r.tilesBelowTabsTop);
    console.log(r.text);
    await page.evaluate(() => { const t = document.querySelector('#tabs'); window.scrollTo(0, t.getBoundingClientRect().top + scrollY - 8); });
    await page.waitForTimeout(150);
    await page.screenshot({ path: OUT + 'first3-390-' + tab + '.png' });
  }
  console.log('errs', errs);
  await b.close();
})();
