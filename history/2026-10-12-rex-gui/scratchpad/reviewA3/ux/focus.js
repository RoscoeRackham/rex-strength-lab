const { launch, open, S } = require('./lib.js');
const which = process.argv[2] || 'branch';
(async () => {
  const b = await launch();
  const results = [];
  const cases = [
    ['bay', { action: 'walk' }], ['bay', { action: 'throw' }], ['bay', { action: 'sprint' }],
    ['duo-bay', { duoAction: 'arm' }], ['duo-bay', { duoAction: 'wrestle', wrestleMove: 'throw' }], ['duo-bay', { duoAction: 'wrestle', wrestleMove: 'shove' }],
    ['duo-bay', { duoAction: 'catch' }], ['duo-bay', { duoAction: 'collide', colSrc: 'set' }],
  ];
  for (const [bayId, st] of cases) {
    const state = Object.assign({ duoOpen: true, duoAction: 'arm', action: 'throw' }, st);
    if (which === 'main') state.group = bayId === 'duo-bay' ? 'duo' : 'solo';
    const page = await open(b, { which, w: 1280, h: 900, state, wait: 3500 });
    const bid = which === 'main' ? 'bay' : bayId;
    // open the Adjust effort boxes so their controls can be reached
    await page.evaluate((bid) => { for (const d of document.querySelectorAll('#' + bid + ' details.effort-adjust')) d.open = true; }, bid);
    const n = await page.evaluate((bid) => document.querySelectorAll('#' + bid + ' input, #' + bid + ' select, #' + bid + ' button, #' + bid + ' summary').length, bid);
    for (let i = 0; i < Math.min(n, 30); i++) {
      const info = await page.evaluate(([bid, i]) => {
        const all = Array.from(document.querySelectorAll('#' + bid + ' input, #' + bid + ' select, #' + bid + ' button, #' + bid + ' summary'));
        const x = all[i]; if (!x || x.disabled) return null;
        x.focus();
        if (document.activeElement !== x) return null;
        const key = x.id || (x.tagName + ':' + x.textContent.trim().slice(0, 20));
        return { key, tag: x.tagName, type: x.type };
      }, [bid, i]);
      if (!info) continue;
      const k = info.tag === 'SUMMARY' ? 'Enter' : info.tag === 'SELECT' ? 'ArrowDown' : info.type === 'range' ? 'ArrowRight' : info.type === 'checkbox' ? 'Space' : info.type === 'number' ? 'ArrowUp' : 'Enter';
      await page.keyboard.press(k);
      if (info.type === 'number') await page.keyboard.press('Enter');
      await page.waitForTimeout(bayId === 'duo-bay' ? 2500 : 1200);
      const after = await page.evaluate((bid) => { const a = document.activeElement; const bay = a.closest('#bay, #duo-bay'); return { key: a.id || (a.tagName + ':' + a.textContent.trim().slice(0, 20)), bay: bay ? bay.id : (a === document.body ? 'BODY' : a.tagName + '#' + a.id), fv: a.matches(':focus-visible') }; }, bid);
      const ok = after.bay === bid && after.key === info.key;
      results.push((ok ? 'ok  ' : 'LOST') + ' ' + which + ' ' + JSON.stringify(st) + ' ' + info.key + ' [' + k + '] -> ' + after.key + ' in ' + after.bay + (after.fv ? '' : ' (no focus-visible)'));
    }
    await page.context().close();
  }
  console.log(results.filter((r) => !r.startsWith('ok')).join('\n') || 'all ok');
  console.log(results.length + ' checked');
  await b.close();
})();
