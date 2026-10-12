// The strength dial: do the effort sliders follow (range, value, value text) during and after a drag?
const { launch, open } = require('./lib');
(async () => {
  const b = await launch();
  for (const st of [{ group: 'solo', action: 'throw' }, { group: 'duo', duoAction: 'arm' }]) {
    const { ctx, page, errs } = await open(b, 1280, 900, 'light', { storage: JSON.stringify(st), wait: 2500 });
    const sel = st.group === 'solo' ? '#effort-use' : '#duo-effort-use';
    const snap = () => page.evaluate((s) => { const e = document.querySelector(s); const rd = document.querySelector('.effort-read'); return { max: (+e.max).toFixed(2), value: (+e.value).toFixed(2), vt: e.getAttribute('aria-valuetext'), read: rd.innerText.split('\n')[0].slice(0, 100), dial: document.querySelector('#dial-big').innerText }; }, sel);
    console.log(JSON.stringify(st), 'before', JSON.stringify(await snap()));
    const box = await (await page.$('#strength')).boundingBox();
    await page.mouse.move(box.x + box.width * 0.11, box.y + box.height / 2); await page.mouse.down();
    for (let i = 0; i <= 10; i++) { await page.mouse.move(box.x + box.width * (0.11 + 0.02 * i), box.y + box.height / 2); await page.waitForTimeout(40); }
    await page.mouse.up(); await page.waitForTimeout(3000);
    console.log('   after dial drag', JSON.stringify(await snap()));
    await ctx.close();
  }
  await b.close();
})();
