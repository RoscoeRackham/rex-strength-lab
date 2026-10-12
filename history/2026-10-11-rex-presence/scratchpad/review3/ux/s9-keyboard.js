// Keyboard: Tab through the bay and the comic switches; record each stop and whether a visible focus ring is drawn.
const { launch, open, OUT } = require('./lib');
async function walkTabs(page, startSel, max, label) {
  await page.focus(startSel);
  const stops = [];
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    const s = await page.evaluate(() => {
      const e = document.activeElement; if (!e || e === document.body) return null;
      const cs = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      const name = e.id || (e.tagName === 'SUMMARY' ? 'summary:' + e.innerText.slice(0, 30) : e.tagName + ':' + (e.innerText || e.value || '').slice(0, 20));
      return { name, inBay: !!e.closest('#bay'), inComic: !!e.closest('#comic-setup'), outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, fv: e.matches(':focus-visible'), vis: r.width > 0 && r.height > 0 };
    });
    if (!s) break;
    stops.push(s);
  }
  const bad = stops.filter((s) => (s.inBay || s.inComic) && (!s.fv || !/solid 3px/.test(s.outline) || !s.vis));
  console.log(label, 'stops:', stops.filter((s) => s.inBay || s.inComic).map((s) => s.name).join(' > '));
  if (bad.length) console.log('   no visible ring:', JSON.stringify(bad));
}
(async () => {
  const b = await launch();
  const cases = [
    ['throw', { group: 'solo', action: 'throw' }, true],
    ['walk', { group: 'solo', action: 'walk', walker: 'both' }, false],
    ['catch', { group: 'duo', duoAction: 'catch', oEffortOwn: false }, true],
  ];
  for (const [label, st, openAdj] of cases) {
    const { ctx, page, errs } = await open(b, 390, 844, 'light', { storage: JSON.stringify(st), wait: 2500 });
    if (openAdj) { await page.evaluate(() => { for (const d of document.querySelectorAll('#bay details')) d.open = true; }); await page.waitForTimeout(200); }
    await walkTabs(page, '#tab-' + label, 60, label);
    await ctx.close();
  }
  // comic switches with a growth mode on, and the weight tab's growth what-if
  {
    const { ctx, page } = await open(b, 390, 844, 'light', { storage: JSON.stringify({ group: 'solo', action: 'weight' }), wait: 2500 });
    await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
    await page.selectOption('#absorb', 'runaway'); await page.waitForTimeout(500);
    await walkTabs(page, '#comic-setup > summary', 20, 'comic(runaway)');
    await page.selectOption('#absorb', 'gradual'); await page.waitForTimeout(500);
    await walkTabs(page, '#comic-setup > summary', 20, 'comic(gradual)');
    await walkTabs(page, '#tab-weight', 30, 'weight');
    // the ring on a focused summary and select, in a screenshot
    await page.focus('#tab-throw'); await page.keyboard.press('Enter'); await page.waitForTimeout(800);
    for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
    const f = await page.evaluate(() => document.activeElement.id || document.activeElement.tagName);
    const box = await page.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    await page.screenshot({ path: OUT + 'focus-' + f + '.png', clip: { x: 0, y: Math.max(0, box.y - 30), width: 390, height: 120 } });
    console.log('screenshot of focus on', f);
    await ctx.close();
  }
  await b.close();
})();
