// Patched copy: scroll shadows on the sticky sidebar (CSS only), light and dark, top/middle/end of its own scroll
const { launch, open, S } = require('./lib.js');
const CSS = `@media (min-width: 920px) { .panel-controls {
  background:
    linear-gradient(var(--surface) 30%, transparent) center top / 100% 28px no-repeat local,
    linear-gradient(transparent, var(--surface) 70%) center bottom / 100% 28px no-repeat local,
    radial-gradient(farthest-side at 50% 0, color-mix(in srgb, var(--ink) 28%, transparent), transparent) center top / 100% 12px no-repeat scroll,
    radial-gradient(farthest-side at 50% 100%, color-mix(in srgb, var(--ink) 28%, transparent), transparent) center bottom / 100% 12px no-repeat scroll,
    var(--surface); } }`;
(async () => {
  const b = await launch();
  for (const scheme of ['light', 'dark']) {
    const page = await open(b, { w: 1366, h: 768, scheme, state: { duoOpen: true, duoAction: 'arm' }, wait: 3500 });
    await page.addStyleTag({ content: CSS });
    await page.evaluate(() => window.scrollTo(0, document.getElementById('duo').getBoundingClientRect().top + scrollY - 40)); await page.waitForTimeout(300);
    await page.screenshot({ path: S + '/shots/cuefix-' + scheme + '-top.png', clip: { x: 100, y: 0, width: 360, height: 768 } });
    await page.evaluate(() => { document.querySelector('aside').scrollTop = 1e6; }); await page.waitForTimeout(200);
    await page.screenshot({ path: S + '/shots/cuefix-' + scheme + '-end.png', clip: { x: 100, y: 0, width: 360, height: 768 } });
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(scheme, 'overflow', ov, page.errs);
    await page.context().close();
  }
  await b.close();
})();
