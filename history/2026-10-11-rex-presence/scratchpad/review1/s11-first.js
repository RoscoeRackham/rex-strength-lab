const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(PREV); await page.waitForTimeout(2000);
  const pageTop = await page.evaluate(() => ({ bayTop: Math.round(document.querySelector('#bay').getBoundingClientRect().top + scrollY), tabsTop: Math.round(document.querySelector('#tabs').getBoundingClientRect().top + scrollY), verdict: Math.round(document.querySelector('#bay .verdict').getBoundingClientRect().top + scrollY) }));
  console.log('fresh visit page offsets (px from page top):', JSON.stringify(pageTop));
  for (const [grp, tab] of [['solo', 'walk'], ['solo', 'lift'], ['solo', 'throw'], ['solo', 'jump'], ['solo', 'stomp'], ['solo', 'punch'], ['solo', 'clap'], ['solo', 'sprint'], ['solo', 'pull'], ['duo', 'arm'], ['duo', 'wrestle'], ['duo', 'catch'], ['duo', 'collide']]) {
    await page.click('#grp-' + grp); await page.click('#tab-' + tab); await page.waitForTimeout(1500);
    const m = await page.evaluate(() => {
      const bay = document.querySelector('#bay'), top = bay.getBoundingClientRect().top;
      const v = bay.querySelector('.verdict'), ctl = bay.querySelector('.bay-controls'), rd = bay.querySelector('.effort-read');
      const nCtl = ctl ? ctl.querySelectorAll('select, input, button').length : 0;
      return { verdictAt: v ? Math.round(v.getBoundingClientRect().top - top) : null, controlsH: ctl ? Math.round(ctl.getBoundingClientRect().height) : 0, nCtl, readoutAt: rd ? Math.round(rd.getBoundingClientRect().top - top) : null, readoutH: rd ? Math.round(rd.getBoundingClientRect().height) : 0, readoutWords: rd ? rd.innerText.split(/\s+/).length : 0, firstTileAt: bay.querySelector('.tiles') ? Math.round(bay.querySelector('.tiles').getBoundingClientRect().top - top) : null };
    });
    console.log(tab.padEnd(8), JSON.stringify(m));
    if (tab === 'throw' || tab === 'arm') { await page.evaluate(() => window.scrollTo(0, document.querySelector('#tabs').getBoundingClientRect().top + scrollY - 8)); await page.waitForTimeout(200); await page.screenshot({ path: OUT + 'firstscreen-' + tab + '-390.png' }); }
  }
  await b.close();
})();
