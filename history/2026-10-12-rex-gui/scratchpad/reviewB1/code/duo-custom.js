const { open } = require('./harness.js');
(async () => {
  for (const name of ['main', 'branch']) {
    const h = await open(name);
    await h.load({ duoOpen: true, duoAction: 'collide' }, 'duo-bay'); await h.settle('duo-bay');
    await h.page.selectOption('#duo-effort', 'custom'); await h.page.waitForTimeout(4000); await h.settle('duo-bay');
    const t = await h.page.evaluate(() => (document.querySelector('#duo-bay .effort-read') || {}).textContent.replace(/\s+/g, ' '));
    console.log(name, 'custom:', t.slice(0, 300));
    await h.browser.close();
  }
})();
