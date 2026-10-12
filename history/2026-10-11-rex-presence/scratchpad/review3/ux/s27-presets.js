// Each effort preset on each solo tab at the default settings: the effort it picks, in order, against the least-disruptive one.
const { launch, open, OUT } = require('./lib');
const busy = (page) => page.evaluate(() => /working it out|Working out/i.test(document.querySelector('#bay').innerText));
(async () => {
  const b = await launch();
  const tabs = (process.argv[2] || 'throw,stomp,jump,punch,clap,sprint,pull').split(',');
  const extra = process.argv[3] ? JSON.parse(process.argv[3]) : {};
  for (const tab of tabs) {
    const { ctx, page, errs } = await open(b, 1280, 900, 'light', { wait: 800, storage: JSON.stringify(Object.assign({ group: 'solo', action: tab }, extra)) });
    const rows = [];
    for (const p of ['least', 'ceiling', 'rattle', 'plaster', 'windows', 'ground', 'houses', 'block', 'allout']) {
      await page.selectOption('#effort', p);
      for (let i = 0; i < 300; i++) { await page.waitForTimeout(100); if (!(await busy(page))) break; }
      const r = await page.evaluate(() => ({ head: document.querySelector('#bay .effort-read p').innerText, slider: Number(document.querySelector('#effort-use').value).toFixed(2), verdict: document.querySelector('#bay .verdict').innerText, chip: [...document.querySelectorAll('#bay .effort-read .status')].map((x) => x.innerText).join(';') }));
      rows.push([p, r.slider, r.head.slice(0, 150), r.verdict.slice(0, 70), r.chip]);
    }
    console.log('==', tab, JSON.stringify(extra));
    for (const x of rows) console.log('  ', x.join(' | '));
    await ctx.close();
  }
  await b.close();
})();
