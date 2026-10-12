const { launch, open, AUDIT, OUT } = require('./lib');
const fs = require('fs');
const EXTRA = `
window.__svgOverlap = () => { const o = []; for (const svg of document.querySelectorAll('#bay svg')) { const ts = [...svg.querySelectorAll('text')].map((t) => ({ t: t.textContent, r: t.getBoundingClientRect() })).filter((x) => x.r.width); for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) { const a = ts[i].r, b = ts[j].r; const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left), iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ix > 1 && iy > 2) o.push(ts[i].t + ' X ' + ts[j].t + ' (' + Math.round(ix) + 'x' + Math.round(iy) + ')'); } } return o; };
window.__selClip = (root) => { const cv = document.createElement('canvas').getContext('2d'); const o = []; for (const s of root.querySelectorAll('select')) { const r = s.getBoundingClientRect(); if (!r.width) continue; const cs = getComputedStyle(s); cv.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily; const t = s.options[s.selectedIndex] ? s.options[s.selectedIndex].text : ''; const tw = cv.measureText(t).width; const avail = s.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 20; if (tw > avail) o.push(s.id + ': "' + t + '" needs ' + Math.round(tw) + ' has ' + Math.round(avail)); } return o; };
window.__textOverflow = (root) => { const o = []; for (const e of root.querySelectorAll('*')) { if (e.closest('svg') || e.closest('.viz') || e.tagName === 'SELECT' || e.tagName === 'OPTION' || e.tagName === 'INPUT') continue; const cs = getComputedStyle(e); if (e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0 && (cs.overflowX === 'hidden' || cs.overflowX === 'clip' || cs.textOverflow === 'ellipsis')) o.push(e.tagName + '.' + e.className + ' ' + e.scrollWidth + '>' + e.clientWidth); } return o; };
`;
(async () => {
  const b = await launch();
  const VIEWS = [[360, 740], [390, 844], [768, 1024], [1280, 900]];
  const THEMES = process.env.DT ? [['light', 'dark'], ['dark', 'light']] : [['light', null], ['dark', null], ['light', 'dark'], ['dark', 'light']];
  const report = [];
  const only = process.argv[2];
  for (const [w, h] of VIEWS) for (const [scheme, theme] of THEMES) {
    const tag = `${w}-${scheme}${theme ? '-dt' + theme : ''}`;
    const { ctx, page, errs } = await open(b, w, h, scheme, { theme, wait: 2500 });
    await page.addScriptTag({ content: AUDIT + EXTRA });
    const first = await page.evaluate(() => ({ act: document.querySelector('.tab[aria-selected=true]') && document.querySelector('.tab[aria-selected=true]').id, effort: document.querySelector('#effort') && document.querySelector('#effort').value, bg: getComputedStyle(document.body).backgroundColor, dt: document.documentElement.getAttribute('data-theme') }));
    const rec = { tag, first, errs, tabs: {} };
    const tabsToCheck = [['solo', 'walk'], ['solo', 'lift'], ['solo', 'throw'], ['solo', 'jump'], ['solo', 'stomp'], ['solo', 'punch'], ['solo', 'clap'], ['solo', 'sprint'], ['solo', 'pull'], ['solo', 'weight'], ['duo', 'arm'], ['duo', 'wrestle'], ['duo', 'catch'], ['duo', 'collide']];
    for (const [grp, tab] of (only ? tabsToCheck.filter((x) => x[1] === only) : tabsToCheck)) {
      await page.click('#grp-' + grp); await page.click('#tab-' + tab);
      // wait for the effort search to finish
      for (let i = 0; i < 60; i++) { await page.waitForTimeout(150); const busy = await page.evaluate(() => /working it out|Working out/.test(document.querySelector('#bay').innerText)); if (!busy) break; }
      if (tab === 'weight') { await page.click('#grow-what-chicxulub').catch(() => {}); await page.waitForTimeout(400); }
      // open the effort details and hazard list so they are audited too
      await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details')) d.open = true; });
      await page.waitForTimeout(100);
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const aud = await page.evaluate(() => __textAudit(document.querySelector('#bay')));
      const small = aud.filter((x) => x.fs < 11);
      const lowC = aud.filter((x) => x.ratio != null && x.ratio < ((x.fs >= 24 || (x.fs >= 18.66 && x.bold)) ? 3 : 4.5));
      const clip = await page.evaluate(() => { const bay = document.querySelector('#bay').getBoundingClientRect(); const o = []; for (const e of document.querySelectorAll('#bay *')) { const r = e.getBoundingClientRect(); if (r.width && (r.right > bay.right + 1 || r.left < bay.left - 1) && !e.closest('.viz') && !e.closest('.cases-wrap')) o.push(e.tagName + '.' + (e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className) + ' ' + Math.round(r.left) + '-' + Math.round(r.right) + ' bay ' + Math.round(bay.left) + '-' + Math.round(bay.right)); } return o.slice(0, 6); });
      const svgClip = await page.evaluate(() => { const o = []; for (const svg of document.querySelectorAll('#bay svg')) { if (svg.closest('.status')) continue; const sr = svg.getBoundingClientRect(); for (const t of svg.querySelectorAll('text')) { const r = t.getBoundingClientRect(); if (r.width && (r.right > sr.right + 0.5 || r.left < sr.left - 0.5 || r.top < sr.top - 0.5 || r.bottom > sr.bottom + 0.5)) o.push(t.textContent + ' [' + Math.round(r.left) + ',' + Math.round(r.right) + '] svg [' + Math.round(sr.left) + ',' + Math.round(sr.right) + ']'); } } return o; });
      const vizScroll = await page.evaluate(() => [...document.querySelectorAll('#bay .viz')].map((v) => v.scrollWidth - v.clientWidth).filter((x) => x > 0));
      const overlap = await page.evaluate(() => __svgOverlap());
      const sel = await page.evaluate(() => __selClip(document.querySelector('#bay')));
      const tov = await page.evaluate(() => __textOverflow(document.querySelector('#bay')));
      rec.tabs[tab] = { ov, small: small.map((x) => x.t + ' ' + x.fs + 'px (' + x.tag + '.' + x.cls + ')').slice(0, 12), lowC: lowC.map((x) => x.t + ' ' + x.ratio + ' fs' + x.fs + ' ' + x.col + ' op' + x.op).slice(0, 12), clip, svgClip, vizScroll, overlap, sel, tov };
      await page.locator('main.panel').screenshot({ path: OUT + `bay-${tab}-${tag}.png` });
    }
    if (!only) {
      await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
      await page.waitForTimeout(200);
      await page.locator('#comic-setup').screenshot({ path: OUT + `comic-${tag}.png` });
      const aud = await page.evaluate(() => __textAudit(document.querySelector('#comic-setup')));
      rec.comic = { small: aud.filter((x) => x.fs < 11).map((x) => x.t + ' ' + x.fs), lowC: aud.filter((x) => x.ratio != null && x.ratio < 4.5).map((x) => x.t + ' ' + x.ratio + ' ' + x.col), sel: await page.evaluate(() => __selClip(document.querySelector('#comic-setup'))) };
    }
    rec.ovEnd = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    rec.errsEnd = errs.slice();
    report.push(rec);
    await ctx.close();
  }
  fs.writeFileSync(OUT + (process.env.DT ? 's1-report-dt.json' : 's1-report.json'), JSON.stringify(report, null, 1));
  for (const r of report) {
    console.log('==', r.tag, JSON.stringify(r.first), 'errs', r.errsEnd.length, JSON.stringify(r.errsEnd.slice(0, 2)), 'ovEnd', r.ovEnd);
    for (const [t, x] of Object.entries(r.tabs)) if (x.ov || x.small.length || x.lowC.length || x.clip.length || x.svgClip.length || x.vizScroll.length || x.overlap.length || x.sel.length || x.tov.length) console.log('  ', t, JSON.stringify(x));
    if (r.comic && (r.comic.small.length || r.comic.lowC.length || r.comic.sel.length)) console.log('   comic', JSON.stringify(r.comic));
  }
  await b.close();
})();
