const { BR, open, launch } = require('./lib');
const where = () => { const a = document.activeElement; return a.tagName + '#' + a.id + ' in ' + (a.closest('#bay') ? 'bay' : a.closest('#duo-bay') ? 'duo-bay' : 'neither'); };
(async () => {
  const b = await launch();
  const { page, ctx, errs } = await open(b, BR, { duoOpen: true, duoAction: 'arm', action: 'throw' });
  await page.waitForTimeout(2500);
  // open Adjust effort in both bays
  for (const sel of ['#bay details.effort-adjust > summary', '#duo-bay details.effort-adjust > summary']) {
    const s = page.locator(sel); console.log(sel, await s.count());
    const isOpen = await page.evaluate((q) => document.querySelector(q).parentElement.open, sel);
    if (!isOpen) { await s.click(); await page.waitForTimeout(300); }
  }
  console.log('open states', await page.evaluate(() => Array.from(document.querySelectorAll('details.effort-adjust')).map((d) => (d.closest('#bay') ? 'bay' : 'duo') + ':' + d.open)));
  const cdp = await ctx.newCDPSession(page);
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  console.log('spinbutton AX names', JSON.stringify(nodes.filter((n) => n.role && n.role.value === 'spinbutton').map((n) => n.name && n.name.value)));
  console.log('near labels', await page.evaluate(() => Array.from(document.querySelectorAll('#near')).map((n) => (n.closest('#bay') ? 'bay' : 'duo') + ' labels=' + n.labels.length)));
  await page.locator('#duo-bay label[for=near]').click();
  console.log('after clicking duo label:', await page.evaluate(where));
  // close Rex's adjust effort and click duo label again
  await page.locator('#bay details.effort-adjust > summary').click(); await page.waitForTimeout(300);
  console.log('open states', await page.evaluate(() => Array.from(document.querySelectorAll('details.effort-adjust')).map((d) => (d.closest('#bay') ? 'bay' : 'duo') + ':' + d.open)));
  await page.locator('#duo-bay label[for=near]').click();
  console.log('after clicking duo label with Rex adjust closed:', await page.evaluate(where));
  // reopen Rex adjust; type into duo near
  if (!(await page.evaluate(() => document.querySelector('#bay details.effort-adjust').open))) { await page.locator('#bay details.effort-adjust > summary').click(); await page.waitForTimeout(300); }
  const dn = page.locator('#duo-bay #near');
  await dn.focus(); console.log('focused before typing:', await page.evaluate(where));
  await dn.fill('40'); await dn.press('Enter');
  await page.waitForTimeout(4000);
  console.log('after 40+Enter in duo near:', await page.evaluate(where));
  console.log('near values', await page.evaluate(() => Array.from(document.querySelectorAll('#near')).map((x) => (x.closest('#bay') ? 'bay' : 'duo') + '=' + x.value)));
  console.log('errs', errs);
  await ctx.close(); await b.close();
})();
