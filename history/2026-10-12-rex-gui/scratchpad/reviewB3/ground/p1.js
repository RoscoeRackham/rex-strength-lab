const { open } = require('./page.js');
(async () => {
  const H = await open();
  await H.load({ duoOpen: true, duoAction: 'arm', logKg: 10 });
  await H.page.evaluate(() => { const d = document.querySelector('#duo-bay details.effort-adjust'); if (d) d.open = true; });
  await H.page.click('#o-effort-own');
  await H.page.waitForTimeout(500); await H.settle('duo-bay');
  await H.page.evaluate(() => { const s = document.getElementById('o-effort-use'); s.value = '4'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
  await H.page.waitForTimeout(1500); await H.settle('duo-bay');
  let r = await H.items('duo-bay');
  console.log('LEAST', JSON.stringify({ verdict: r.verdict, status: r.status, effort: r.effort, happens: r.happens.filter(x => /ground|pin/i.test(x)) }, null, 1));
  await H.pick('#duo-effort', 'plaster');
  r = await H.items('duo-bay');
  console.log('PLASTER', JSON.stringify({ verdict: r.verdict, status: r.status, effort: r.effort, happens: r.happens.filter(x => /ground|pin/i.test(x)), tiles: r.tiles.filter(x=>/pin/i.test(x)) }, null, 1));
  console.log(H.errs);
  await H.browser.close();
})();
