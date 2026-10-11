const { open, close } = require('./h.js');
(async () => {
  const { page, ctx } = await open({ w: 1280, h: 900, state: { action: 'throw' } });
  const snap = await page.locator('main').ariaSnapshot();
  console.log(snap.split('\n').slice(0, 14).join('\n'));
  console.log('live regions:', await page.evaluate(() => [...document.querySelectorAll('[aria-live]')].map(n => n.id + ':' + n.getAttribute('aria-live'))));
  console.log('tab stops:', await page.evaluate(() => [...document.querySelectorAll('[role=tab]')].map(t => t.id + '=' + t.tabIndex).join(' ')));
  await page.focus('#tab-throw');
  for (const k of ['End', 'Home', 'ArrowLeft', 'ArrowRight', 'ArrowRight']) { await page.keyboard.press(k); console.log(k, '->', await page.evaluate(() => document.activeElement.id + ' selected=' + document.activeElement.getAttribute('aria-selected'))); }
  // Tab from the selected tab goes where?
  await page.keyboard.press('Tab');
  console.log('Tab from tablist ->', await page.evaluate(() => document.activeElement.id || document.activeElement.tagName));
  // live region text after slider change
  await page.evaluate(() => { const s = document.querySelector('#strength'); s.value = 6; s.dispatchEvent(new Event('input')); });
  await page.waitForTimeout(100);
  const a = await page.textContent('#bay-live');
  await page.waitForTimeout(700);
  const b = await page.textContent('#bay-live');
  console.log('bay-live at 100ms:', JSON.stringify(a), '| at 800ms:', JSON.stringify(b), '| verdict:', await page.textContent('#bay .verdict'));
  // On page load, is a verdict announced? (polite)
  await ctx.close();
  await close();
})();
