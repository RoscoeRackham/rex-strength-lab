const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto('file:///home/user/rex-strength-lab/rex-strength-lab/dist/preview.html');
  const cases = [];
  for (const lg of [7, 12]) for (const co of ['semi', 'bus', 'tank']) cases.push({ group: 'duo', duoAction: 'catch', cObj: co, cStyle: 'hard', surface: 'concrete', logKg: lg });
  if (0)
  for (const sf of ['concrete', 'ice', 'sand']) for (const lg of [6, 9, 12]) {
    cases.push({ group: 'duo', duoAction: 'arm', surface: sf, logKg: lg });
    for (const wm of ['shove', 'throw']) cases.push({ group: 'duo', duoAction: 'wrestle', wrestleMove: wm, surface: sf, logKg: lg });
    for (const co of ['car', 'baseball', 'loco']) cases.push({ group: 'duo', duoAction: 'catch', cObj: co, cStyle: 'hard', surface: sf, logKg: lg });
    cases.push({ group: 'duo', duoAction: 'collide', surface: sf, logKg: lg });
  }
  for (const st of cases) {
    await page.evaluate((o) => { const s = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); Object.assign(s, o); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.reload();
    // wait for the search to finish
    let txt = '';
    for (let i = 0; i < 120; i++) { await page.waitForTimeout(500); txt = await page.evaluate(() => document.querySelector('#bay').innerText); if (!/working it out/i.test(txt)) break; }
    const least = txt.split('\n').filter((l) => /^(Effort|All-out|Courtesy ceiling|At this effort)/.test(l)).join(' / ');
    await page.evaluate(() => { const s = document.querySelector('#duo-effort'); s.value = 'allout'; s.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.waitForTimeout(1500);
    const txt2 = await page.evaluate(() => document.querySelector('#bay').innerText);
    const all = txt2.split('\n').filter((l) => /^(At this effort)/.test(l)).join(' / ');
    const flag = /none\. Nothing in this test harms/.test(least) && /At this effort/.test(all) ? '  <<< CONTRADICTION' : '';
    console.log(JSON.stringify(st), '\n   LEAST:', least, '\n   ALLOUT:', all || '(no harm)', flag);
  }
  console.log('errors', errs);
  await browser.close();
})();
