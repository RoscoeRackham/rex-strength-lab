const { open, close } = require('./h.js');
(async () => {
  const { page, ctx } = await open({ w: 1280, h: 900, state: { action: 'stomp', logKg: 12 }, wait: 0 });
  await page.waitForFunction(() => !document.querySelector('#ladder-never').textContent.includes('Working out'), null, { timeout: 30000 });
  const s = await page.locator('#ladder').ariaSnapshot();
  console.log(s.split('\n').slice(0, 12).join('\n'), '\n...', s.split('\n').length, 'lines');
  const b = await page.locator('#bay').ariaSnapshot();
  console.log(b.split('\n').filter(l => /img/.test(l)).join('\n'));
  for (const t of ['jump', 'sprint', 'pull', 'throw', 'lift']) { await page.click('#tab-' + t); console.log(t, (await page.locator('#bay').ariaSnapshot()).split('\n').filter(l => /img/.test(l)).join(' || ')); }
  await ctx.close(); await close();
})();
