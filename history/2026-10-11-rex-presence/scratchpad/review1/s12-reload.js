const { launch, OUT, PREV } = require('./lib');
// Use the page loudly, reload, and see what it opens on.
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(PREV); await page.waitForTimeout(1500);
  // loud choices through the UI
  await page.selectOption('#effort', 'allout'); await page.waitForTimeout(300);
  await page.fill('#goal', '5000'); await page.press('#goal', 'Enter'); await page.waitForTimeout(300);
  await page.click('#tab-walk'); await page.waitForTimeout(300);
  await page.evaluate(() => { const s = document.querySelector('#step-effort'); s.value = 1; s.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(300);
  await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
  await page.check('#sw-gentle'); await page.selectOption('#absorb', 'runaway'); await page.waitForTimeout(300);
  await page.click('#tab-throw'); await page.waitForTimeout(800);
  const before = await page.evaluate(() => ({ st: JSON.parse(localStorage.getItem('rex-lab-v1')), read: document.querySelector('.effort-read').innerText.slice(0, 200), verdict: document.querySelector('#bay .verdict').innerText }));
  console.log('before reload: effort', before.st.effort, 'gThrow', before.st.gThrow, 'stepEffort', before.st.stepEffort, 'absorb', before.st.absorb, 'gentleHold', before.st.gentleHold, '| verdict', before.verdict);
  await page.reload(); await page.waitForTimeout(4000);
  const after = await page.evaluate(() => ({ sel: document.querySelector('#effort').value, read: document.querySelector('.effort-read').innerText, verdict: document.querySelector('#bay .verdict').innerText, comic: document.querySelector('#comic-sum').innerText, chips: [...document.querySelectorAll('#bay .status')].map((x) => x.innerText) }));
  console.log('after reload:', JSON.stringify(after, null, 1));
  await page.click('#tab-walk'); await page.waitForTimeout(500);
  console.log('walk after reload:', await page.evaluate(() => document.querySelector('#step-effort').value + ' ' + document.querySelector('#bay .verdict').innerText));
  await b.close();
})();
