const { launch, open, OUT } = require('./lib');
const busy = (page) => page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText));
(async () => {
  const b = await launch();
  for (const [label, st] of [
    ['duo catch fastball car', { group: 'duo', duoAction: 'catch', cObj: 'car', cStyle: 'hard' }],
    ['duo collide', { group: 'duo', duoAction: 'collide' }],
    ['solo throw inf real', { group: 'solo', action: 'throw', inf: true, mode: 'real', obj: 'car' }],
  ]) {
    const { ctx, page, errs } = await open(b, 1280, 900, 'light', { storage: JSON.stringify(st), wait: 50 });
    const p0 = await busy(page);
    // focus the first summary after the verdict directly (as a keyboard user who tabbed there would)
    const got = await page.evaluate(() => { const v = document.querySelector('#bay .verdict'); const s = [...document.querySelectorAll('#bay summary, #bay a, #bay button')].find((e) => v && (v.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING)); if (!s) return null; s.focus(); return s.textContent.slice(0, 40); });
    const p1 = await busy(page);
    for (let i = 0; i < 300; i++) { await page.waitForTimeout(100); if (!(await busy(page))) break; }
    await page.waitForTimeout(400);
    const res = await page.evaluate(() => { const e = document.activeElement; return e === document.body ? 'BODY (focus lost)' : (e.id || e.tagName + ':' + e.textContent.slice(0, 30)); });
    console.log(label, '| busy at load', p0, '| focused', JSON.stringify(got), 'while busy', p1, '| after the search, focus is on:', res);
    await ctx.close();
  }
  await b.close();
})();
