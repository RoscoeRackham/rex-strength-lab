// Two bays each with an effort box: both have an input with id "near". Type a distance in the Rex + Ollie bay's
// field and press Enter: where does keyboard focus end up after the redraw? Also compare with main's page.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const v of ['branch', 'main']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((v) => { if (!sessionStorage.getItem('s')) { localStorage.setItem('rex-lab-v1', JSON.stringify(v === 'branch' ? { action: 'throw', duoAction: 'arm', duoOpen: true } : { action: 'throw', duoAction: 'arm', group: 'duo' })); sessionStorage.setItem('s', '1'); } }, v);
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(__dirname, '..', v + '.html'));
    const bay = v === 'branch' ? '#duo-bay' : '#bay';
    await page.waitForFunction((b) => { const x = document.querySelector(b); return x && x.querySelector('.verdict') && !/working/i.test(x.textContent); }, bay, { timeout: 60000 });
    const info = await page.evaluate(() => ({ nearIds: document.querySelectorAll('#near').length, labelsFor: Array.from(document.querySelectorAll('label[for=near]')).map((l) => (l.closest('.bay') || {}).id), labelControlBay: Array.from(document.querySelectorAll('label[for=near]')).map((l) => (l.control && l.control.closest('.bay') || {}).id) }));
    console.log(v, 'inputs with id near:', info.nearIds, '| label for=near in bays:', info.labelsFor, '| the input each label names is in:', info.labelControlBay);
    // open the duo bay's "Adjust effort" box and use its distance field from the keyboard
    await page.evaluate((b) => { document.querySelector(b + ' details.effort-adjust').open = true; }, bay);
    const inp = page.locator(bay + ' input[id=near]');
    await inp.focus();
    await inp.fill('20');
    await inp.press('Enter');
    await page.waitForTimeout(2500);
    const where = await page.evaluate(() => { const a = document.activeElement; return { tag: a.tagName, id: a.id, inBay: (a.closest('.bay') || {}).id || null }; });
    console.log(v, 'after Enter, focus is on', JSON.stringify(where), '| near saved =', await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).near));
    await ctx.close();
  }
  await browser.close();
})();
