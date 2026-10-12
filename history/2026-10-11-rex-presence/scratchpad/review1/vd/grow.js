const { open } = require('./pw.js');
(async () => {
  const s = await open({ state: { action: 'weight' } });
  await s.tab('weight');
  for (const lbl of ['Krakatoa', 'Dinosaur-killer impact']) {
    await s.page.click('#bay button:has-text("' + lbl + '")');
    await s.page.waitForTimeout(1200);
    const t = await s.bay();
    const L = t.split('\n'); const i = L.findIndex((l) => /What if he absorbed/.test(l));
    console.log('---', lbl, '\n' + L.slice(i, i + 16).join('\n'));
  }
  await s.browser.close();
})();
