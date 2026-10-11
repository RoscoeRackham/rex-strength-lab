const { open, close } = require('./h.js');
const measure = (page) => page.evaluate(() => [...document.querySelectorAll('#bay svg, #ladder-viz svg')].filter(s => s.viewBox.baseVal && s.viewBox.baseVal.width > 50).map((svg) => { const vb = svg.viewBox.baseVal.width, w = svg.getBoundingClientRect().width; const t = svg.querySelector('text'); const fs = t ? parseFloat(getComputedStyle(t).fontSize) * w / vb : null; return (svg.getAttribute('aria-label') || '').slice(0, 22) + ': vb ' + vb + ' drawn ' + w.toFixed(0) + ' text ' + (fs && fs.toFixed(1)) + 'px'; }));
(async () => {
  for (const tab of ['stomp', 'throw', 'lift']) {
    const { page, ctx } = await open({ w: 844, h: 390, state: { action: tab, logKg: 12 } });
    console.log(tab, 'landscape 844x390:', JSON.stringify(await measure(page)));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    console.log(tab, 'rotated to 390x844:', JSON.stringify(await measure(page)));
    await page.setViewportSize({ width: 320, height: 640 });
    await page.waitForTimeout(500);
    console.log(tab, 'resized to 320x640:', JSON.stringify(await measure(page)));
    await ctx.close();
  }
  const { page, ctx } = await open({ w: 320, h: 640, state: { action: 'stomp', logKg: 12 } });
  console.log('fresh load 320:', JSON.stringify(await measure(page)));
  await page.locator('#bay').screenshot({ path: 'w320-stomp.png' });
  await ctx.close();
  await close();
})();
