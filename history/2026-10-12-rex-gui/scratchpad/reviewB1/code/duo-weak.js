const { open } = require('./harness.js');
(async () => {
  const h = await open('branch');
  for (const tab of ['arm', 'collide']) for (const e of ['plaster', 'ground']) {
    await h.load({ duoOpen: true, duoAction: tab, logKg: 3 }, 'duo-bay'); await h.settle('duo-bay');
    await h.page.selectOption('#duo-effort', e); await h.page.waitForTimeout(500); await h.settle('duo-bay');
    const t = await h.page.evaluate(() => (document.querySelector('#duo-bay .effort-read') || {}).textContent.replace(/\s+/g, ' '));
    console.log(tab, e, '->', t.slice(0, 200), /undefined/.test(t) ? '   <== "undefined"' : '');
  }
  console.log(h.errs.slice(0, 2));
  await h.browser.close();
})();
