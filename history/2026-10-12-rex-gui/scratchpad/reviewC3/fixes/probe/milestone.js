const { open } = require('./common.js');
const dist = process.argv[2], w = Number(process.argv[3] || 1280);
(async () => {
  const { browser, page, load, errs, settle } = await open(dist, w);
  for (const st of [{ action: 'punch' }, { action: 'punch', mode: 'real' }, { action: 'punch', H: 0.1, m: 0.03 }, { action: 'punch', H: 500, m: 3e9 }]) {
    await load(st); await page.waitForTimeout(6000);
    const r = await page.evaluate(() => Array.from(document.querySelectorAll('#ladder-viz g.mk')).map((g) => g.getAttribute('aria-label')).filter((t) => /dinosaur|Hiroshima|Tsar/.test(t || '')));
    console.log(JSON.stringify(st), r);
    const g = await page.$$('#ladder-viz g.mk');
    for (const h of g) { const l = await h.getAttribute('aria-label'); if (/dinosaur/.test(l || '')) { await h.hover(); await page.waitForTimeout(300); const tip = await page.evaluate(() => { const t = document.querySelector('#ladder-viz .lv-detail, #ladder-detail, .ladder-detail, #ladder-viz + p, [id*=detail]'); return t ? t.textContent : ''; }); console.log('  hover detail:', tip.slice(0, 300)); await h.click(); await page.waitForTimeout(800); await settle(page, 'bay'); const dial = await page.evaluate(() => { const n = document.getElementById('kg-readout') || document.querySelector('.dial-read, #strength output, #strength .readout'); return n ? n.textContent : ''; }); console.log('  after click dial:', dial.slice(0, 200)); const tiles = await page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).map((t) => (t.querySelector('.k') || {}).textContent + ': ' + ((t.querySelector('.v') || {}).textContent || '')).filter((x) => /Energy|Compared/.test(x))); console.log('  tiles:', tiles.join(' | ')); } }
  }
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('overflow', ov, 'errs', errs);
  await browser.close();
})();
