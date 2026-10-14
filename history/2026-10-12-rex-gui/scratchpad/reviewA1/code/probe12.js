// shots.js's section 3 loop, under CPU throttling (a slow CI runner): fixed 400 ms waits for the deferred redraw
const { launch, url, S } = require('./lib.js');
const fs = require('fs');
const { readResult, settle } = require(S + '/repo/rex-strength-lab/test/make-page-fixture.js');
const BEFORE = JSON.parse(fs.readFileSync(S + '/repo/rex-strength-lab/test/fixtures/page-before.json', 'utf8')).results;
const norm = (r) => JSON.stringify(Object.assign({}, r, { verdict: r.verdict && r.verdict.replace(/^(Pushing straight across: )(\w)/, (m, a, b) => a + b.toLowerCase()) }));
(async () => {
  const br = await launch();
  const rate = Number(process.argv[2] || 6);
  const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
  const cdp = await page.context().newCDPSession(page);
  await page.goto(url('branch.html'));
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  const load = async (st) => { await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(800); };
  const duoResult = async () => { await page.waitForTimeout(400); await settle(page, 'duo-bay'); return readResult(page, 'duo-bay'); };
  let bad = 0;
  for (const tab of ['collide', 'wrestle']) {
    await load({ anchor: 'friction', oAnchor: 'friction', duoOpen: true, duoAction: tab });
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    for (const [a, b] of [['friction', 'friction'], ['bolted', 'friction'], ['bolted', 'bolted'], ['friction', 'bolted'], ['friction', 'friction']]) {
      await page.setChecked('#bolt-rex', a === 'bolted'); await page.setChecked('#bolt-ollie', b === 'bolted');
      const got = await duoResult(), id = 's3-' + tab + '-' + a + '-' + b;
      const ok = norm(got) === norm(BEFORE[id]);
      if (!ok) bad++;
      console.log(rate + 'x', id, ok ? 'same' : 'CHANGED: ' + (got.verdict || '').slice(0, 90));
    }
  }
  console.log('mismatches', bad);
  await br.close();
})();
