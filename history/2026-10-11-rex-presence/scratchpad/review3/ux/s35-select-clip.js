// Every option of the new selects, selected in turn at 360 px: does its text fit the closed select?
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  const { ctx, page } = await open(b, 360, 740, 'light', { storage: JSON.stringify({ group: 'solo', action: 'punch' }), wait: 1200 });
  const fit = (sel) => page.evaluate((s) => { const e = document.querySelector(s); const cv = document.createElement('canvas').getContext('2d'); const cs = getComputedStyle(e); cv.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily; return [...e.options].map((o) => { const tw = cv.measureText(o.text).width; const avail = e.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 20; return { t: o.text, need: Math.round(tw), has: Math.round(avail) }; }).filter((x) => x.need > x.has); }, sel);
  console.log('#effort', JSON.stringify(await fit('#effort')));
  await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
  console.log('#absorb', JSON.stringify(await fit('#absorb')));
  await page.click('#grp-duo'); await page.waitForTimeout(1500);
  console.log('#duo-effort', JSON.stringify(await fit('#duo-effort')));
  await ctx.close(); await b.close();
})();
