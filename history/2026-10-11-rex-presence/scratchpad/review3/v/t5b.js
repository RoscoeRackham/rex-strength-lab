const H = require('./h.js');
(async () => {
  let p = await H.open({ group: 'duo', duoAction: 'wrestle', wrestleMove: 'push' });
  await H.tab(p, 'wrestle', true);
  await H.settle(p, 20000);
  await p.evaluate(() => { const s = document.getElementById('duo-effort-use'); s.value = '3.5'; s.dispatchEvent(new Event('input', { bubbles: true })); });
  await p.waitForTimeout(2500);
  let t = await H.settle(p, 30000);
  const i = t.indexOf('Pushing straight');
  console.log(t.slice(i, i + 700));
  await H.close();
})();
