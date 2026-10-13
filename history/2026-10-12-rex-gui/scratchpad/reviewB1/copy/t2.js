const H = require('./h.js');
(async () => {
  const p = await H.open({ state: { cObj: 'baseball', cStyle: 'hard', logKg: 8 } });
  await H.tab(p, 'catch', true);
  await H.setEffort(p, 'allout', true);
  const t = await p.evaluate(() => Array.from(document.querySelectorAll('#duo-bay li, #duo-bay .status')).map((n) => n.textContent).filter((x) => /shake|feet hand/.test(x)));
  console.log(t);
  await p.screenshot({ path: 'out/catch-1e8.png', fullPage: true });
  await H.close();
})();
