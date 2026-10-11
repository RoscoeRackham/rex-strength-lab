const { open, close } = require('./h.js');
(async () => {
  const { page, ctx } = await open({ w: 1280, h: 900, state: { action: 'stomp' } });
  await page.click('details.math summary');
  const res = await page.evaluate(async () => {
    const raf = () => new Promise((r) => requestAnimationFrame(r));
    const s = document.querySelector('#strength');
    const ops = [], tops = [], mathOpen = [];
    for (let i = 0; i < 30; i++) {
      s.value = 4 + i * 0.1; s.dispatchEvent(new Event('input'));
      await raf(); await raf();
      const v = document.querySelector('#bay .verdict');
      ops.push(+getComputedStyle(v).opacity); tops.push(v.getBoundingClientRect().top);
      mathOpen.push(document.querySelector('#bay details.math').open);
    }
    return { minOp: Math.min(...ops), maxOp: Math.max(...ops), jitter: Math.max(...tops) - Math.min(...tops), mathAllOpen: mathOpen.every(Boolean) };
  });
  console.log('stomp strength drag:', JSON.stringify(res));
  // tab change animation still exists? and math stays open across tabs?
  await page.click('#tab-punch');
  const r2 = await page.evaluate(async () => { await new Promise(r => requestAnimationFrame(r)); return { op: getComputedStyle(document.querySelector('#bay .verdict')).opacity, math: document.querySelector('#bay details.math').open, enter: document.querySelector('#bay').classList.contains('enter') }; });
  console.log('after tab switch:', JSON.stringify(r2));
  // angle drag on throw: opacity
  await page.click('#tab-throw');
  await page.waitForTimeout(400);
  const r3 = await page.evaluate(async () => {
    const raf = () => new Promise((r) => requestAnimationFrame(r));
    const a = document.querySelector('#angle'); const ops = [];
    for (let i = 0; i < 20; i++) { a.value = 45 - i; a.dispatchEvent(new Event('input')); await new Promise(r => setTimeout(r, 40)); await raf(); ops.push(+getComputedStyle(document.querySelector('#bay .verdict')).opacity); }
    return { minOp: Math.min(...ops) };
  });
  console.log('throw angle drag:', JSON.stringify(r3));
  await ctx.close();
  await close();
})();
