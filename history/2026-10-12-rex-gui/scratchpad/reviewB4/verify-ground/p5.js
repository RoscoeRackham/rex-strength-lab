const { open, settle, load, text } = require('./harness.js');
(async () => {
  const { browser, pg, errs } = await open();
  await load(pg, { duoOpen: true, duoAction: 'arm', logKg: 13 + 1e-12 });
  await settle(pg, 'duo-bay');
  await pg.selectOption('#duo-effort', 'allout'); await pg.waitForTimeout(600); await settle(pg, 'duo-bay');
  // open adjust and tick Ollie's own
  await pg.evaluate(() => { const d = document.querySelector('#duo-bay details.effort-adjust'); if (d) d.open = true; });
  await pg.click('#o-effort-own'); await pg.waitForTimeout(600); await settle(pg, 'duo-bay');
  await pg.evaluate(() => { const s = document.getElementById('o-effort-use'); s.value = '12.5'; s.dispatchEvent(new Event('input', { bubbles: true })); });
  await pg.waitForTimeout(1500); await settle(pg, 'duo-bay');
  const t = await text(pg, 'duo-bay');
  console.log(t.split('\n').filter((l) => /quake|no net push|sound barrier|Effort|pins|At this effort|Courtesy/i.test(l)).slice(0, 14).join('\n'));
  console.log('errors', errs);
  await browser.close();
})();
