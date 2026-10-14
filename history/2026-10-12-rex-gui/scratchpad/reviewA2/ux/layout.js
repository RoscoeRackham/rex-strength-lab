const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  const sizes = [[360, 740], [390, 844], [768, 1024], [1024, 768], [1280, 900]];
  const themes = [['light', null], ['dark', null], ['light', 'dark'], ['dark', 'light']];
  for (const [w, h] of sizes) for (const [scheme, theme] of themes) {
    for (const cfg of [{ name: 'closed', state: null }, { name: 'open', state: { duoOpen: true, duoAction: 'arm' } }]) {
      const page = await open(b, { w, h, scheme, theme, state: cfg.state, wait: 3500 });
      if (cfg.name === 'open') { await page.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('ollie-setup').open = true; }); await page.waitForTimeout(300); }
      const r = await page.evaluate(() => {
        const ov = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const aside = document.querySelector('aside');
        const order = Array.from(aside.children).filter((n) => n.matches('details, .side-sec, .eyebrow, input#strength')).map((n) => n.id || n.className);
        // clipped text: elements whose content is wider than their box, not inside an overflow-x:auto wrapper
        const clipped = [];
        for (const n of document.querySelectorAll('aside *, #duo *, main *')) {
          if (!n.getClientRects().length) continue;
          const cs = getComputedStyle(n);
          if (n.scrollWidth > n.clientWidth + 1 && cs.overflowX !== 'visible' && !n.closest('.viz, .cases-wrap, .table-wrap') && n.tagName !== 'SELECT' && n.tagName !== 'INPUT') clipped.push((n.id || n.tagName + '.' + n.className) + ' ' + n.scrollWidth + '>' + n.clientWidth);
          // escaping the viewport
          const rc = n.getBoundingClientRect();
          if (rc.right > innerWidth + 1 && !n.closest('.viz, .cases-wrap, .table-wrap, .sr-only')) clipped.push('OUT ' + (n.id || n.tagName + '.' + n.className) + ' right=' + Math.round(rc.right));
        }
        const sum = document.querySelector('#duo > summary').getBoundingClientRect();
        return { ov, order, setupOpen: document.getElementById('setup').open, powersOpen: document.getElementById('powers').open, duoOpen: document.getElementById('duo').open, clipped: clipped.slice(0, 8), sumH: Math.round(sum.height), sumW: Math.round(sum.width) };
      });
      console.log(w + 'x' + h, scheme, theme || '-', cfg.name, JSON.stringify(r), page.errs.length ? 'ERRS ' + page.errs.join(' | ') : '');
      if (theme === null) await page.screenshot({ path: S + '/shots/' + cfg.name + '-' + w + '-' + scheme + '.png', fullPage: true });
      await page.context().close();
    }
  }
  await b.close();
})();
