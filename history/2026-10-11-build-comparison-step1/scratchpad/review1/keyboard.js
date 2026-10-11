'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p } = await open(browser, { w: 390, h: 844, scheme: 'light', dpr: 2 });
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  const desc = () => p.evaluate(() => {
    const a = document.activeElement; if (!a) return null;
    const r = a.getBoundingClientRect(); const cs = getComputedStyle(a);
    const loc = document.getElementById('locator').getBoundingClientRect();
    const locStuck = loc.top <= 1 && loc.bottom > 0;
    return { tag: a.tagName.toLowerCase(), id: a.id, cls: String(a.className).slice(0, 20), text: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 40), outline: cs.outlineStyle + ' ' + cs.outlineWidth, top: Math.round(r.top), bottom: Math.round(r.bottom), underLocator: locStuck && r.top < loc.bottom - 1 ? Math.round(loc.bottom - r.top) : 0 };
  });
  const seq = [];
  for (let i = 0; i < 90; i++) { await p.keyboard.press('Tab'); seq.push(await desc()); }
  seq.forEach((d, i) => console.log(i, JSON.stringify(d)));
  // clickable but not focusable
  const nf = await p.evaluate(() => ['glance', 'locTape'].map((id) => { const el = document.getElementById(id); return id + ' tabIndex=' + el.tabIndex + ' role=' + el.getAttribute('role'); }));
  console.log('click-only:', nf);
  // shift-tab back through lineup figures to see if focus lands under the locator
  await p.evaluate(() => document.querySelector('.fig[data-id="rex"]').focus());
  const under = [];
  for (let i = 0; i < 40; i++) { await p.keyboard.press('Shift+Tab'); const d = await desc(); if (d.underLocator) under.push(d); }
  console.log('under locator while shift-tabbing:', JSON.stringify(under.slice(0, 5)), under.length);
  // Enter on a figure, then Escape
  await p.evaluate(() => document.querySelector('.fig[data-id="phil_heath"]').focus());
  await p.keyboard.press('Enter');
  await p.waitForTimeout(200);
  console.log('after Enter:', JSON.stringify(await desc()), 'drawer hidden?', await p.evaluate(() => document.getElementById('drawer').hidden));
  const cl = await p.evaluate(() => { const b = document.getElementById('drawerClose').getBoundingClientRect(); const l = document.getElementById('locator').getBoundingClientRect(); return { close: [Math.round(b.top), Math.round(b.bottom)], loc: [Math.round(l.top), Math.round(l.bottom)] }; });
  console.log('close button vs locator', JSON.stringify(cl));
  await p.screenshot({ path: path.join(DIR, 'k-drawer-open-390.png') });
  await p.keyboard.press('Escape');
  console.log('after Escape:', JSON.stringify(await desc()));
  // open from the forest by keyboard
  await p.evaluate(() => document.querySelector('#fp [data-open="eddie_hall"]').focus());
  const y0 = await p.evaluate(() => scrollY);
  await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  const y1 = await p.evaluate(() => scrollY);
  const cl2 = await p.evaluate(() => { const b = document.getElementById('drawerClose').getBoundingClientRect(); const l = document.getElementById('locator').getBoundingClientRect(); return { close: [Math.round(b.top), Math.round(b.bottom)], loc: [Math.round(l.top), Math.round(l.bottom)] }; });
  console.log('forest open: scroll', y0, '->', y1, 'focus', JSON.stringify(await desc()), 'close vs locator', JSON.stringify(cl2));
  await p.screenshot({ path: path.join(DIR, 'k-drawer-from-forest-390.png') });
  await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  const y2 = await p.evaluate(() => scrollY);
  console.log('forest close: scroll ->', y2, 'focus', JSON.stringify(await desc()));
  // Focus ring of a figure that has a right neighbour
  await p.evaluate(() => document.querySelector('.fig[data-id="phil_heath"]').scrollIntoView({ block: 'center' }));
  await p.keyboard.press('Tab'); await p.keyboard.press('Shift+Tab');
  await p.evaluate(() => { const f = document.querySelectorAll('#under25 .fig')[1]; f.focus(); f.scrollIntoView({ block: 'center' }); });
  // emulate keyboard-modality focus-visible: press Tab then Shift+Tab
  await p.keyboard.press('Tab'); await p.keyboard.press('Shift+Tab');
  const fr = await p.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, id: document.activeElement.dataset.id, fv: document.activeElement.matches(':focus-visible') }; });
  console.log('focused fig', JSON.stringify(fr));
  await p.screenshot({ path: path.join(DIR, 'k-fig-focus-390.png'), clip: { x: Math.max(0, fr.x - 20), y: Math.max(0, fr.y - 10), width: Math.min(390 - Math.max(0, fr.x - 20), fr.w + 60), height: Math.min(300, fr.h + 20) } });
  await ctx.close(); await browser.close();
})();
