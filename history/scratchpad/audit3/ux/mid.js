const { open, close } = require('./h.js');
(async () => {
  for (const [w, name, st] of [[1280, 'stomp24', { action: 'stomp', logKg: 24 }], [1280, 'pyramid24', { action: 'throw', obj: 'pyramid', logKg: 24 }], [390, 'car24', { action: 'throw', obj: 'car', logKg: 24 }], [390, 'pickup16', { action: 'throw', obj: 'pickup', logKg: 16 }], [390, 'punch20', { action: 'punch', logKg: 20 }]]) {
    const { page, ctx } = await open({ w, h: 900, state: st, dpr: 1 });
    const r = await page.evaluate(() => [...document.querySelectorAll('#bay .tile')].map(t => { const v = t.querySelector('.v'); const lines = Math.round(v.getBoundingClientRect().height / parseFloat(getComputedStyle(v).lineHeight)); return t.querySelector('.k').textContent + ' = ' + v.textContent + ' [' + lines + ' lines, tile ' + Math.round(t.getBoundingClientRect().width) + 'px]'; }));
    console.log(w, name, JSON.stringify(r));
    await page.locator('#bay .tiles').screenshot({ path: `mid-${w}-${name}.png` });
    await ctx.close();
  }
  await close();
})();
