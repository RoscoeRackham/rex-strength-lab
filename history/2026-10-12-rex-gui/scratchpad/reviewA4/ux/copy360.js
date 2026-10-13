// The round 3 copy changes at phone width: overflow, broken text, and that the new sentences appear
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  const cases = [
    ['Wrestle sand', { duoOpen: true, duoAction: 'wrestle', surface: 'sand', wrestleMove: 'push' }, 'duo-bay', /Equal bodies \(same weight and feet\)/],
    ['Wrestle bolted', { duoOpen: true, duoAction: 'wrestle', anchor: 'bolted', wrestleMove: 'push' }, 'duo-bay', /nobody walks the other out/],
    ['Arm wrestle bolted, infinite', { duoOpen: true, duoAction: 'arm', anchor: 'bolted', oAnchor: 'friction', inf: true, surface: 'sand' }, 'duo-bay', /footing = μ × min/],
    ['Throw bolted sand', { action: 'throw', anchor: 'bolted', surface: 'sand', logKg: 9, obj: 'car', effort: 'allout' }, 'bay', /Bolted, his footing limits no part|drives his feet down/],
    ['Collide bounce', { duoOpen: true, duoAction: 'collide', colBounce: 'bounce', colSrc: 'set', colGB: -3 }, 'duo-bay', /perfect bounce peaks at twice/],
    ['Sprint gentle', { action: 'sprint' }, 'bay', /./],
  ];
  for (const [w, h] of [[360, 740], [1280, 900]]) for (const [name, st, bay, re] of cases) {
    const { page, errs } = await open(browser, { w, h, state: st });
    await page.waitForTimeout(4000);
    await page.evaluate((b) => { for (const d of document.querySelectorAll('#' + b + ' details')) d.open = true; }, bay);
    await page.waitForTimeout(300);
    const r = await page.evaluate(({ bay, src }) => {
      const t = document.getElementById(bay).innerText; const re = new RegExp(src);
      const vw = document.documentElement.clientWidth; const wide = [];
      for (const n of document.getElementById(bay).querySelectorAll('*')) { if (!n.getClientRects().length) continue; const r = n.getBoundingClientRect(); if (r.right > vw + 1) { let p = n, sc = false; while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll') { sc = true; break; } p = p.parentElement; } if (!sc) wide.push((n.id || n.tagName + '.' + n.className).slice(0, 30)); } }
      return { overflow: document.documentElement.scrollWidth - vw, found: re.test(t), bad: (t.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []), wide: wide.slice(0, 4), verdict: (document.querySelector('#' + bay + ' .verdict') || {}).textContent };
    }, { bay, src: re.source });
    console.log(w + ' ' + name + ': ' + JSON.stringify(r).slice(0, 400), errs.length ? 'ERRS ' + errs.join('|') : '');
    await page.context().close();
  }
  await browser.close();
})();
