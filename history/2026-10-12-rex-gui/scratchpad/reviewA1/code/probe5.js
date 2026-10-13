const { launch, url, settle, text, S } = require('./lib.js');
(async () => {
  const br = await launch();
  const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url('branch.html'));
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'collide' })));
  await page.addInitScript(() => {
    window.__log = [];
    let v;
    Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => { const f = x.collide; x.collide = function () { if (!window.__first) { window.__first = performance.now(); window.__log.push(['firstDuoCall', performance.now()]); } const t = performance.now(); while (performance.now() - t < 100) {} return f.apply(this, arguments); }; v = x; } });
    const oraf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => oraf((ts) => { const b = document.getElementById('duo-bay'); window.__log.push(['rAF', Math.round(performance.now()), b ? b.children.length : 'none', b ? b.textContent.slice(0, 40) : '', (document.querySelector('#duo-tabs [aria-selected=true]') || {}).id || null]); cb(ts); });
  });
  await page.reload(); await page.waitForTimeout(100); await settle(page, 'duo-bay');
  console.log(JSON.stringify(await page.evaluate(() => window.__log.slice(0, 6))));
  await br.close();
})();
