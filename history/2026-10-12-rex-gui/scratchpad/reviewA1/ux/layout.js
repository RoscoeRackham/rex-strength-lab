const { NEW, launch, DIR, path } = require('./common');
(async () => {
  const url = NEW();
  const b = await launch();
  const VPS = [[360, 740], [390, 844], [768, 1024], [1024, 768], [1280, 900]];
  for (const [w, h] of VPS) for (const theme of ['light', 'dark', 'attr-dark', 'attr-light-on-dark']) {
    const scheme = theme === 'light' ? 'light' : (theme === 'attr-light-on-dark' ? 'dark' : (theme === 'attr-dark' ? 'light' : 'dark'));
    const page = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(url); await page.evaluate(() => localStorage.clear()); await page.reload();
    if (theme === 'attr-dark') await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    if (theme === 'attr-light-on-dark') await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(2500);
    const info = await page.evaluate(() => {
      const r = (id) => { const n = document.getElementById(id) || document.querySelector(id); if (!n) return null; const b = n.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top + scrollY), Math.round(b.width), Math.round(b.height)]; };
      const v = document.querySelector('#bay .verdict');
      return { ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, setupOpen: document.getElementById('setup').open, powersOpen: document.getElementById('powers').open, duoOpen: document.getElementById('duo').open,
        aside: r('aside.panel-controls'), main: r('main.panel'), duo: r('#duo'), verdict: r('#bay .verdict'), tabs: r('#tabs'), verdictText: v && v.textContent.slice(0, 80), docH: document.documentElement.scrollHeight };
    });
    console.log(w + 'x' + h, theme, JSON.stringify(info), errs.length ? 'ERR ' + errs.join('|') : '');
    const tag = `${w}-${theme}`;
    if (theme === 'light' || theme === 'dark') {
      await page.screenshot({ path: path.join(DIR, 'shots', `first-${tag}.png`) });
      await page.screenshot({ path: path.join(DIR, 'shots', `full-${tag}.png`), fullPage: true });
      // open powers and duo
      await page.evaluate(() => { document.getElementById('powers').open = true; });
      await page.click('#duo > summary');
      await page.waitForTimeout(2500);
      await page.evaluate(() => { document.getElementById('ollie-setup').open = true; });
      await page.waitForTimeout(300);
      const ov2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      console.log('   open: overflow', ov2);
      await page.screenshot({ path: path.join(DIR, 'shots', `fullopen-${tag}.png`), fullPage: true });
      const duo = await page.$('#duo'); await duo.screenshot({ path: path.join(DIR, 'shots', `duo-${tag}.png`) });
      const pw = await page.$('aside.panel-controls'); await pw.screenshot({ path: path.join(DIR, 'shots', `aside-${tag}.png`) });
    }
    await page.close();
  }
  await b.close();
})();
