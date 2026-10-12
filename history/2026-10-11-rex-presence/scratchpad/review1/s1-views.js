const { launch, open, AUDIT, OUT } = require('./lib');
const fs = require('fs');
(async () => {
  const b = await launch();
  const VIEWS = [[360, 740], [390, 844], [768, 1024], [1280, 900]];
  const THEMES = [['light', null], ['dark', null], ['light', 'dark'], ['dark', 'light']];
  const report = [];
  for (const [w, h] of VIEWS) for (const [scheme, theme] of THEMES) {
    const tag = `${w}-${scheme}${theme ? '-dt' + theme : ''}`;
    const { ctx, page, errs } = await open(b, w, h, scheme, { theme });
    await page.addScriptTag({ content: AUDIT });
    const first = await page.evaluate(() => ({ act: document.querySelector('.tab[aria-selected=true]') && document.querySelector('.tab[aria-selected=true]').id, effort: document.querySelector('#effort') && document.querySelector('#effort').value, bg: getComputedStyle(document.body).backgroundColor }));
    const rec = { tag, first, errs, tabs: {} };
    const tabsToCheck = [['solo', 'throw'], ['solo', 'walk'], ['solo', 'punch'], ['solo', 'stomp'], ['solo', 'weight'], ['duo', 'arm'], ['duo', 'catch'], ['duo', 'wrestle'], ['duo', 'collide']];
    for (const [grp, tab] of tabsToCheck) {
      await page.click('#grp-' + grp); await page.click('#tab-' + tab); await page.waitForTimeout(grp === 'duo' ? 1200 : 900);
      if (tab === 'weight') { await page.click('#grow-what-chicxulub'); await page.waitForTimeout(400); }
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const aud = await page.evaluate(() => __textAudit(document.querySelector('#bay')));
      const small = aud.filter((x) => x.fs < 11);
      const lowC = aud.filter((x) => x.ratio != null && x.ratio < ((x.fs >= 24 || (x.fs >= 18.66 && x.bold)) ? 3 : 4.5));
      // elements wider than bay (clipped)
      const clip = await page.evaluate(() => { const bay = document.querySelector('#bay').getBoundingClientRect(); const o = []; for (const e of document.querySelectorAll('#bay *')) { const r = e.getBoundingClientRect(); if (r.width && (r.right > bay.right + 1 || r.left < bay.left - 1) && !e.closest('.viz') && !e.closest('.cases-wrap')) o.push(e.tagName + '.' + (e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className) + ' ' + Math.round(r.left) + '-' + Math.round(r.right) + ' bay ' + Math.round(bay.left) + '-' + Math.round(bay.right)); } return o.slice(0, 6); });
      // svg text extending outside the svg viewport
      const svgClip = await page.evaluate(() => { const o = []; for (const svg of document.querySelectorAll('#bay svg')) { const sr = svg.getBoundingClientRect(); for (const t of svg.querySelectorAll('text')) { const r = t.getBoundingClientRect(); if (r.width && (r.right > sr.right + 0.5 || r.left < sr.left - 0.5 || r.top < sr.top - 0.5 || r.bottom > sr.bottom + 0.5)) o.push(t.textContent + ' [' + Math.round(r.left) + ',' + Math.round(r.right) + '] svg [' + Math.round(sr.left) + ',' + Math.round(sr.right) + ']'); } } return o; });
      rec.tabs[tab] = { ov, small: small.map((x) => x.t + ' ' + x.fs + 'px (' + x.tag + '.' + x.cls + ')').slice(0, 12), lowC: lowC.map((x) => x.t + ' ' + x.ratio + ' fs' + x.fs + ' ' + x.col + ' op' + x.op).slice(0, 12), clip, svgClip };
      await page.locator('main.panel').screenshot({ path: OUT + `bay-${tab}-${tag}.png` });
    }
    // comic switches panel
    await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
    await page.waitForTimeout(200);
    await page.locator('#comic-setup').screenshot({ path: OUT + `comic-${tag}.png` });
    const aud = await page.evaluate(() => __textAudit(document.querySelector('#comic-setup')));
    rec.comic = { small: aud.filter((x) => x.fs < 11).map((x) => x.t + ' ' + x.fs), lowC: aud.filter((x) => x.ratio != null && x.ratio < 4.5).map((x) => x.t + ' ' + x.ratio + ' ' + x.col) };
    rec.ovEnd = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    rec.errsEnd = errs.slice();
    report.push(rec);
    await ctx.close();
  }
  fs.writeFileSync(OUT + 's1-report.json', JSON.stringify(report, null, 1));
  for (const r of report) {
    console.log('==', r.tag, JSON.stringify(r.first), 'errs', r.errsEnd.length, 'ovEnd', r.ovEnd);
    for (const [t, x] of Object.entries(r.tabs)) if (x.ov || x.small.length || x.lowC.length || x.clip.length || x.svgClip.length) console.log('  ', t, JSON.stringify(x));
    if (r.comic.small.length || r.comic.lowC.length) console.log('   comic', JSON.stringify(r.comic));
  }
  await b.close();
})();
