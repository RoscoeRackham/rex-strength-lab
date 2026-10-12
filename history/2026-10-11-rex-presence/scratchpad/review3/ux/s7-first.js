// First screen on a phone: where the result sits, how big the effort box is, per tab, with the default (folded) controls.
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, page, errs } = await open(b, 390, 844, 'light', { wait: 2500 });
  await page.screenshot({ path: OUT + 'first-390-top.png' });
  const geo = async (tab) => page.evaluate(() => {
    const bay = document.querySelector('#bay');
    const top = (e) => (e ? Math.round(e.getBoundingClientRect().top + scrollY) : null);
    const h = (e) => (e ? Math.round(e.getBoundingClientRect().height) : null);
    const ctl = bay.querySelector(':scope > .bay-controls');
    const v = bay.querySelector('.verdict'), rd = bay.querySelector('.effort-read'), tiles = bay.querySelector('.tiles');
    const tabs = document.querySelector('#tabs');
    return { pageTopOfBay: top(bay), tabsH: h(tabs), controlsH: h(ctl), verdictTop: top(v), verdictFromTabs: top(v) - top(tabs), verdictH: h(v), readoutH: h(rd), readoutWords: rd ? rd.innerText.split(/\s+/).length : 0, verdictWords: v ? v.innerText.split(/\s+/).length : 0, firstTilesTop: top(tiles) };
  });
  for (const [grp, tab] of [['solo', 'walk'], ['solo', 'throw'], ['solo', 'jump'], ['solo', 'stomp'], ['solo', 'punch'], ['solo', 'clap'], ['solo', 'sprint'], ['solo', 'pull'], ['duo', 'arm'], ['duo', 'catch'], ['duo', 'collide']]) {
    await page.click('#grp-' + grp); await page.click('#tab-' + tab); await page.waitForTimeout(1500);
    const gg = await geo(tab);
    console.log(tab, JSON.stringify(gg));
    if (tab === 'throw' || tab === 'stomp' || tab === 'arm') {
      await page.evaluate(() => { const t = document.querySelector('#tabs'); window.scrollTo(0, t.getBoundingClientRect().top + scrollY - 8); });
      await page.waitForTimeout(200);
      await page.screenshot({ path: OUT + 'first-390-' + tab + '.png' });
    }
  }
  console.log('errs', errs);
  await b.close();
})();
