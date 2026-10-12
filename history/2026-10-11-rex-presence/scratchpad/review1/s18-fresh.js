const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(PREV); await page.waitForTimeout(1500);
  for (const [grp, tab] of [['solo', 'walk'], ['solo', 'lift'], ['solo', 'throw'], ['solo', 'jump'], ['solo', 'stomp'], ['solo', 'punch'], ['solo', 'clap'], ['solo', 'sprint'], ['solo', 'pull'], ['solo', 'weight'], ['duo', 'arm'], ['duo', 'wrestle'], ['duo', 'catch'], ['duo', 'collide']]) {
    await page.click('#grp-' + grp); await page.click('#tab-' + tab);
    await page.waitForFunction(() => !/Working out/.test((document.querySelector('.effort-read') || {}).innerText || ''), null, { timeout: 60000 }).catch(() => null);
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => ({ sel: (document.querySelector('#effort') || document.querySelector('#duo-effort') || {}).value, head: ((document.querySelector('.effort-read p') || {}).innerText || '').slice(0, 170), warn: [...document.querySelectorAll('#bay .status')].map((s) => s.innerText).filter((t) => /ceiling|At this effort|injury|crush|break|fail|boom/i.test(t)), verdict: (document.querySelector('#bay .verdict') || {}).innerText.slice(0, 150) }));
    console.log(tab.padEnd(8), JSON.stringify(r));
  }
  await b.close();
})();
