const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
async function run(which, saved, duoSel) {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto('file://' + S + '/' + which + '.html');
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), saved);
  await page.reload();
  await page.waitForFunction((sel) => document.querySelector(sel + ' .verdict') && document.querySelector(sel + ' details.effort-adjust'), duoSel, { timeout: 60000 });
  await page.waitForTimeout(500);
  // open the duo bay's Adjust effort box
  await page.click(duoSel + ' details.effort-adjust > summary');
  await page.waitForTimeout(300);
  const nearCountBefore = await page.evaluate(() => document.querySelectorAll('[id="near"]').length);
  const field = page.locator(duoSel + ' input[id$="near"]');
  await field.focus();
  const before = await page.evaluate(() => { const a = document.activeElement; return { id: a.id, inBay: a.closest('#duo-bay') ? 'duo-bay' : a.closest('#bay') ? 'bay' : 'none' }; });
  await field.fill('20');
  await page.keyboard.press('Enter');
  // wait for duo render to complete
  await page.waitForTimeout(6000);
  const after = await page.evaluate(() => { const a = document.activeElement; return { tag: a.tagName, id: a.id, inBay: a.closest('#duo-bay') ? 'duo-bay' : a.closest('#bay') ? 'bay' : 'none', value: a.value, nearCount: document.querySelectorAll('[id="near"]').length, saved: JSON.parse(localStorage.getItem('rex-lab-v1')).near }; });
  console.log(which, JSON.stringify({ nearCountBefore, before, after }), errs);
  await b.close();
}
(async () => {
  await run('fixed', { action: 'throw', duoAction: 'arm', duoOpen: true }, '#duo-bay');
  
})();
