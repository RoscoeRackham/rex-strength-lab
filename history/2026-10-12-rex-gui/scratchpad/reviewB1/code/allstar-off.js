const { open } = require('./harness.js');
(async () => {
  for (const name of ['main', 'branch']) {
    const h = await open(name);
    await h.load(Object.assign({ action: 'throw', obj: 'baseball', angle: 0, logKg: 23.26, surface: 'concrete' }, name === 'branch' ? { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false } : {}));
    await h.page.selectOption('#effort', 'allout'); await h.page.waitForTimeout(300); await h.settle('bay');
    const t = await h.page.evaluate(() => Array.from(document.querySelectorAll('#bay .happens li')).map((n) => n.textContent).filter((x) => /plasma/.test(x)).join(' / '));
    const tiles = await h.page.evaluate(() => document.querySelector('#bay .tiles').textContent.replace(/\s+/g, ' '));
    console.log(name, ':', t, '\n  tiles:', tiles.slice(0, 200));
    await h.browser.close();
  }
})();
