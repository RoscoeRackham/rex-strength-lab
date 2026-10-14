const { open } = require('./h');
(async () => {
  let browser;
  for (const f of [1, 0.5]) {
    const init = `(() => { let v; Object.defineProperty(window, 'DINO_DATA', { configurable: true, get() { return v; }, set(x) { if (x && x.surfaces) x.surfaces.forEach(s => { if (/clay/.test(s.id)) s.shear *= ${f}; }); v = x; } }); })();`;
    const r = await open({ action: 'weight', surface: 'softclay', m: 9000 }, { browser, init, wait: 3000 });
    browser = r.browser;
    const out = await r.page.evaluate(() => ({ su: window.DINO_DATA.surfaces.find(s => s.id === 'softclay').shear, lines: document.body.innerText.split('\n').filter(l => /sinks|mired|hips|knees/.test(l)).slice(0, 3) }));
    console.log('factor', f, JSON.stringify(out));
    await r.ctx.close();
  }
  await browser.close();
})();
