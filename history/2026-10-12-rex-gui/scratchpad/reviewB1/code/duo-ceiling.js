const { open } = require('./harness.js');
(async () => {
  for (const name of ['main', 'branch']) {
    const h = await open(name);
    for (const tab of ['arm', 'collide', 'catch']) {
      await h.load({ duoOpen: true, duoAction: tab }, 'duo-bay'); await h.settle('duo-bay');
      const least = await h.page.evaluate(() => (document.querySelector('#duo-bay .effort-read') || {}).textContent.replace(/\s+/g, ' '));
      await h.page.selectOption('#duo-effort', 'allout'); await h.page.waitForTimeout(500); await h.settle('duo-bay');
      await h.page.waitForTimeout(3000); await h.settle('duo-bay');
      const allout = await h.page.evaluate(() => (document.querySelector('#duo-bay .effort-read') || {}).textContent.replace(/\s+/g, ' '));
      console.log(name, tab, '\n  least :', least.slice(0, 260), '\n  allout:', allout.slice(0, 260));
    }
    console.log(name, 'errors', h.errs.slice(0, 3));
    await h.browser.close();
  }
})();
