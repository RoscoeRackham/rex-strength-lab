const { open, close } = require('./h.js');
(async () => {
  for (const [w, touch] of [[390, true], [1280, false]]) {
    const { page, ctx } = await open({ w, h: 844, touch, mobile: touch, state: { action: 'lift' }, wait: 0 });
    await page.waitForFunction(() => !document.querySelector('#ladder-never').textContent.includes('Working out'), null, { timeout: 30000 });
    await page.waitForTimeout(300);
    // elementFromPoint at dot centres
    const efp = await page.evaluate(() => {
      const out = [];
      for (const g of document.querySelectorAll('#ladder-viz .mk')) {
        g.scrollIntoView({ block: 'center' });
        const c = g.querySelector('circle').getBoundingClientRect();
        const x = c.left + c.width / 2, y = c.top + c.height / 2;
        const hit = document.elementFromPoint(x, y);
        const hg = hit && hit.closest('.mk');
        // also label centre
        const t = g.querySelector('text').getBoundingClientRect();
        const hit2 = document.elementFromPoint(t.left + t.width / 2, t.top + t.height / 2);
        const hg2 = hit2 && hit2.closest('.mk');
        out.push([g.getAttribute('data-key'), hg ? hg.getAttribute('data-key') : (hit ? hit.tagName : null), hg2 ? hg2.getAttribute('data-key') : (hit2 ? hit2.tagName : null)]);
      }
      return out;
    });
    let dotOk = 0, dotNone = 0, dotWrong = [], lblWrong = [];
    for (const [k, d, l] of efp) { if (d === k) dotOk++; else if (!d || !d.includes(':')) dotNone++; else dotWrong.push(k + '->' + d); if (l !== k) lblWrong.push(k + '->' + l); }
    console.log(w, 'dot centre hits own marker:', dotOk, '| hits no marker:', dotNone, '| hits other marker:', dotWrong.join(', '), '| label centre wrong:', lblWrong.join(', ') || 'none');
    if (touch) {
      for (const key of ['L:spidey', 'L:hulk', 'L:human', 'L:cap', 'R:boom', 'R:jumpliberty', 'R:windows']) {
        await page.evaluate(() => { const s = document.querySelector('#strength'); s.value = 1.5; s.dispatchEvent(new Event('input')); });
        await page.waitForTimeout(250);
        const c = page.locator(`#ladder-viz .mk[data-key="${key}"] circle`);
        await c.scrollIntoViewIfNeeded();
        const b = await c.boundingBox();
        await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
        await page.waitForTimeout(300);
        const dial = await page.textContent('#dial-big'), who = await page.textContent('#dial-who');
        const lab = await page.getAttribute(`#ladder-viz .mk[data-key="${key}"]`, 'aria-label');
        console.log('  tap dot', key, '(' + lab + ') -> dial:', dial, '|', who);
        // tap the label
        await page.evaluate(() => { const s = document.querySelector('#strength'); s.value = 1.5; s.dispatchEvent(new Event('input')); });
        await page.waitForTimeout(250);
        const tl = page.locator(`#ladder-viz .mk[data-key="${key}"] text`).first();
        const tb = await tl.boundingBox();
        await page.touchscreen.tap(tb.x + tb.width / 2, tb.y + tb.height / 2);
        await page.waitForTimeout(300);
        console.log('  tap label', key, '-> dial:', await page.textContent('#dial-big'));
      }
    }
    await ctx.close();
  }
  await close();
})();
