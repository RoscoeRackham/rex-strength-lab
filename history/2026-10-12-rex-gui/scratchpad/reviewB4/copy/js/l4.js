const H = require('./h.js');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
const S = [
  ['throw', { obj: 'baseball', logKg: Math.log10(1.8e23), angle: 0, airAbsorb: 0.5 }, 'allout'],
  ['throw', { obj: 'car', logKg: 9, airAbsorb: 0.5 }, 'allout'],
  ['stomp', { logKg: 12 }, 'allout'],
  ['jump', { logKg: 8, surface: 'sand' }, 'allout'],
  ['pull', { obj: 'loco', logKg: 9 }, 'allout'],
  ['catch', { cObj: 'baseball', cStyle: 'hard', logKg: 15, airAbsorb: 0.5 }, 'allout'],
  ['catch', { cObj: 'partner', cStyle: 'hard', logKg: 8, cLogD: 4 }, 'allout'],
  ['wrestle', { wrestleMove: 'throw', logKg: 20, airAbsorb: 0.5 }, 'allout'],
  ['collide', { colSrc: 'jump', surface: 'sand', logKg: 7 }, 'allout'],
];
(async () => {
  for (const scheme of ['light', 'dark']) {
    const page = await H.open(390, 844, scheme);
    let i = 0;
    for (const [tab, st0, eff] of S) {
      const st = Object.assign({}, st0); const duo = !SOLO.includes(tab);
      if (duo) { st.duoAction = tab; st.duoOpen = true; } else st.action = tab;
      await H.load(page, st);
      await page.selectOption(duo ? '#duo-effort' : '#effort', eff); await H.settle(page);
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const wide = await page.evaluate(() => Array.from(document.querySelectorAll('.status, .tile, .verdict, li, p')).filter((n) => n.getBoundingClientRect().right > document.documentElement.clientWidth + 0.5 && n.offsetParent).map((n) => n.className + ':' + n.textContent.slice(0, 60)));
      if (scheme === 'light') { const el = await page.$(duo ? '#duo' : 'main.panel'); await el.screenshot({ path: H.DIR + `/shots/s390-${i}.png` }); }
      console.log(scheme, tab, 'overflow', ov, wide.slice(0, 3), page.errs);
      page.errs.length = 0; i++;
    }
    await page.close();
  }
  await H.close();
})();
