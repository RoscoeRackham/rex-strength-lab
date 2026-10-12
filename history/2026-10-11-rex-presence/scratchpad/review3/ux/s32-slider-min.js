// Effort sliders at their left end (Home key): the spoken value, the readout and the fighter cards.
const { launch, open, OUT } = require('./lib');
const busy = (page) => page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText));
(async () => {
  const b = await launch();
  for (const [st, sel, own] of [[{ group: 'duo', duoAction: 'arm' }, '#duo-effort-use', false], [{ group: 'duo', duoAction: 'arm' }, '#o-effort-use', true], [{ group: 'duo', duoAction: 'collide' }, '#duo-effort-use', false]]) {
    const { ctx, page } = await open(b, 1280, 900, 'light', { storage: JSON.stringify(st), wait: 800 });
    for (let i = 0; i < 200; i++) { await page.waitForTimeout(100); if (!(await busy(page))) break; }
    await page.evaluate(() => { document.querySelector('#bay details.effort-adjust').open = true; });
    await page.waitForTimeout(100);
    if (own) { await page.click('#o-effort-own'); await page.waitForTimeout(800); }
    await page.focus(sel); await page.keyboard.press('Home'); await page.waitForTimeout(800);
    const r = await page.evaluate((s) => { const e = document.querySelector(s); return { min: Number(e.min).toFixed(4), value: Number(e.value).toFixed(4), vt: e.getAttribute('aria-valuetext'), read: document.querySelector('#bay .effort-read p').innerText, cards: [...document.querySelectorAll('#bay .fighter')].map((f) => (f.innerText.match(/using [^\n]*/) || ['(no using line)'])[0]) }; }, sel);
    console.log(JSON.stringify(st), sel, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
