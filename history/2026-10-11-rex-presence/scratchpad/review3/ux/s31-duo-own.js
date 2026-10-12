// Two-player effort box with Ollie's own effort, at 360 px: layout, cards, readout; and Ollie's slider drag and keyboard.
const { launch, open, OUT, AUDIT } = require('./lib');
const busy = (page) => page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText));
(async () => {
  const b = await launch();
  for (const tab of ['arm', 'collide', 'catch', 'wrestle']) {
    const { ctx, page, errs } = await open(b, 360, 740, 'dark', { storage: JSON.stringify({ group: 'duo', duoAction: tab }), wait: 800 });
    for (let i = 0; i < 200; i++) { await page.waitForTimeout(100); if (!(await busy(page))) break; }
    await page.evaluate(() => { const d = document.querySelector('#bay details.effort-adjust'); d.open = true; });
    await page.waitForTimeout(100);
    await page.click('#o-effort-own');
    for (let i = 0; i < 200; i++) { await page.waitForTimeout(100); if (!(await busy(page))) break; }
    // move Ollie's slider down with the keyboard
    await page.focus('#o-effort-use');
    for (let i = 0; i < 40; i++) await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(600);
    await page.addScriptTag({ content: AUDIT });
    const r = await page.evaluate(() => ({ ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, focus: document.activeElement.id, val: document.querySelector('#o-effort-use').value, vt: document.querySelector('#o-effort-use').getAttribute('aria-valuetext'), read: document.querySelector('#bay .effort-read').innerText.replace(/\n+/g, ' | '), cards: [...document.querySelectorAll('#bay .fighter')].map((f) => f.innerText.replace(/\n+/g, ' / ')), small: __textAudit(document.querySelector('#bay')).filter((x) => x.fs < 11).length, low: __textAudit(document.querySelector('#bay')).filter((x) => x.ratio && x.ratio < 4.5).map((x) => x.t + ' ' + x.ratio) }));
    console.log('==', tab, JSON.stringify(r));
    await page.locator('main.panel').screenshot({ path: OUT + 'duo-own-' + tab + '-360d.png' });
    if (errs.length) console.log('errs', errs);
    await ctx.close();
  }
  await b.close();
})();
