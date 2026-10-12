// Keyboard focus on something in the bay after the controls (a summary), while a background effort search finishes:
// is focus kept?
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  const cases = [
    ['duo catch fastball car', { group: 'duo', duoAction: 'catch', cObj: 'car', cStyle: 'hard' }],
    ['solo throw rattle', { group: 'solo', action: 'throw', inf: true, mode: 'real' }],
  ];
  for (const [label, st] of cases) {
    const { ctx, page, errs } = await open(b, 1280, 900, 'light', { storage: JSON.stringify(st), wait: 300 });
    // wait for any initial search to finish
    for (let i = 0; i < 200; i++) { await page.waitForTimeout(100); if (!(await page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText)))) break; }
    // now change something that restarts a search, via keyboard: for duo change the near distance? use the effort select
    if (st.group === 'duo') {
      // pick another object to restart the search: c-obj select via keyboard
      await page.focus('#c-obj');
      await page.selectOption('#c-obj', 'piano').catch(async () => { const o = await page.evaluate(() => [...document.querySelectorAll('#c-obj option')].map((x) => x.value)); console.log(o); });
    } else {
      await page.focus('#effort');
      await page.selectOption('#effort', 'rattle');
    }
    await page.waitForTimeout(50);
    const pend = await page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText));
    // Tab forward to the first summary after the verdict
    let name = null;
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      name = await page.evaluate(() => { const e = document.activeElement; const v = document.querySelector('#bay .verdict'); if (!e || !document.querySelector('#bay').contains(e)) return 'OUT:' + (e && (e.id || e.tagName)); const after = v && (v.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING); return after ? 'AFTER:' + (e.id || e.tagName + ':' + e.textContent.slice(0, 30)) : null; });
      if (name) break;
    }
    const t0 = Date.now();
    let res = null;
    for (let i = 0; i < 300; i++) { await page.waitForTimeout(100); if (!(await page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText)))) break; }
    await page.waitForTimeout(500);
    res = await page.evaluate(() => { const e = document.activeElement; return e === document.body ? 'BODY (focus lost)' : (e.id || e.tagName + ':' + e.textContent.slice(0, 30)); });
    console.log(label, '| pending after change:', pend, '| focused before search finished:', name, '| after', Date.now() - t0, 'ms focus is on:', res, errs.length ? errs : '');
    await ctx.close();
  }
  await b.close();
})();
