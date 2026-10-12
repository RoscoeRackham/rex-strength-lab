const { launch, OUT, PREV } = require('./lib');
// For each effort move at unlimited strength in real-muscle mode: time each preset change (synchronous handler),
// then record what the readout says and how long until the courtesy ceiling is worked out.
(async () => {
  const b = await launch();
  const moves = (process.argv[2] || 'throw,jump,stomp,punch,clap,sprint,pull').split(',');
  const st0 = JSON.parse(process.argv[3] || '{"inf":true,"mode":"real"}');
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('x', 1); } }, Object.assign({ action: moves[0] }, st0));
  await page.goto(PREV); await page.waitForTimeout(2000);
  for (const mv of moves) {
    const t0 = Date.now();
    await page.click('#tab-' + mv);
    await page.waitForFunction(() => !/Working out/.test(document.querySelector('.effort-read') ? document.querySelector('.effort-read').innerText : 'Working out'), null, { timeout: 120000 }).catch(() => null);
    const ceilMs = Date.now() - t0;
    const opts = await page.evaluate(() => [...document.querySelectorAll('#effort option')].map((o) => o.value));
    const rows = [];
    for (const v of opts) {
      const ms = await page.evaluate((v) => { const s = document.querySelector('#effort'); s.value = v; const t = performance.now(); s.dispatchEvent(new Event('change', { bubbles: true })); return Math.round(performance.now() - t); }, v);
      await page.waitForTimeout(150);
      const r = await page.evaluate(() => ({ head: (document.querySelector('.effort-read p') || {}).innerText, note: (document.querySelector('.effort-read .warn-ink') || {}).innerText, verdict: (document.querySelector('#bay .verdict') || {}).innerText, chip: [...document.querySelectorAll('.effort-read .status')].map((x) => x.innerText).join('|') }));
      rows.push([v, ms + 'ms', r.head, r.note || '', r.chip, (r.verdict || '').slice(0, 140)]);
    }
    await page.evaluate(() => { const s = document.querySelector('#effort'); s.value = 'least'; s.dispatchEvent(new Event('change', { bubbles: true })); });
    console.log('=====', mv, 'ceiling ready after', ceilMs, 'ms');
    for (const r of rows) console.log('  ', r.join(' || '));
  }
  console.log('errors', errs);
  await b.close();
})();
