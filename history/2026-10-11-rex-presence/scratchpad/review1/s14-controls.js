const { launch, OUT, PREV } = require('./lib');
// Does each new control visibly change the bay on the tab where it matters?
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(PREV); await page.waitForTimeout(1500);
  await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
  const bayText = () => page.evaluate(() => document.querySelector('#bay').innerText);
  const diff = (a, b) => { const A = a.split('\n'), B = new Set(b.split('\n')); const S = new Set(A); return { gone: A.filter((x) => !B.has(x)).slice(0, 3).map((x) => x.slice(0, 160)), added: b.split('\n').filter((x) => !S.has(x)).slice(0, 4).map((x) => x.slice(0, 220)) }; };
  const tests = [
    ['throw', 'gentle hold on throw (car)', async () => page.check('#sw-gentle'), async () => page.uncheck('#sw-gentle')],
    ['lift', 'gentle hold on lift', async () => page.check('#sw-gentle'), async () => page.uncheck('#sw-gentle')],
    ['throw', 'cool flight on throw (car, default)', async () => page.check('#sw-cool'), async () => page.uncheck('#sw-cool')],
    ['throw', 'safe passenger on throw (car)', async () => page.check('#sw-passenger'), async () => page.uncheck('#sw-passenger')],
    ['punch', 'silent strike on punch', async () => page.check('#sw-silent'), async () => page.uncheck('#sw-silent')],
    ['clap', 'silent strike on clap', async () => page.check('#sw-silent'), async () => page.uncheck('#sw-silent')],
    ['jump', 'soft landing on jump', async () => page.check('#sw-soft'), async () => page.uncheck('#sw-soft')],
    ['stomp', 'soft landing on stomp', async () => page.check('#sw-soft'), async () => page.uncheck('#sw-soft')],
    ['throw', 'absorb gradual, no absorbed switch on', async () => page.selectOption('#absorb', 'gradual'), async () => page.selectOption('#absorb', 'ocean')],
    ['punch', 'absorb instant with silent strike', async () => { await page.check('#sw-silent'); await page.waitForTimeout(300); }, null],
    ['punch', 'then absorb instant', async () => page.selectOption('#absorb', 'instant'), null],
    ['punch', 'then grow chip Pure size', async () => page.click('#grow-chips .chip:nth-child(2)'), null],
    ['punch', 'then absorb gradual', async () => page.selectOption('#absorb', 'gradual'), null],
    ['punch', 'then grow-t 0.01 s', async () => { await page.fill('#grow-t', '0.01'); await page.press('#grow-t', 'Tab'); }, null],
    ['punch', 'then absorb runaway', async () => page.selectOption('#absorb', 'runaway'), null],
    ['punch', 'then half-life 5', async () => { await page.fill('#half-life', '5'); await page.press('#half-life', 'Tab'); }, async () => { await page.selectOption('#absorb', 'ocean'); await page.uncheck('#sw-silent'); }],
    ['stomp', 'near 50 m on stomp', async () => { await page.fill('#near', '50'); await page.press('#near', 'Tab'); }, async () => { await page.fill('#near', '5'); await page.press('#near', 'Tab'); }],
    ['jump', 'goal 10 m on jump', async () => { await page.fill('#goal', '10'); await page.press('#goal', 'Tab'); }, async () => { await page.fill('#goal', '3'); await page.press('#goal', 'Tab'); }],
    ['walk', 'walker both', async () => page.click('#walker-both'), async () => page.click('#walker-rex')],
    ['walk', 'pace fast', async () => page.click('#pace-fast'), async () => page.click('#pace-walk')],
    ['walk', 'distance 20 m', async () => { await page.fill('#walk-d', '20'); await page.press('#walk-d', 'Tab'); }, async () => { await page.fill('#walk-d', '3'); await page.press('#walk-d', 'Tab'); }],
    ['walk', 'soft landing on walk', async () => page.check('#sw-soft'), async () => page.uncheck('#sw-soft')],
  ];
  for (const [tab, name, on, off] of tests) {
    if (!(await page.$('#tab-' + tab))) await page.click('#grp-solo');
    await page.click('#tab-' + tab); await page.waitForTimeout(1500);
    const a = await bayText();
    await on(); await page.waitForTimeout(1500);
    const c = await bayText();
    console.log('==', name, a === c ? 'NO VISIBLE CHANGE' : JSON.stringify(diff(a, c)));
    if (off) { await off(); await page.waitForTimeout(600); }
  }
  console.log('errors', errs);
  await b.close();
})();
