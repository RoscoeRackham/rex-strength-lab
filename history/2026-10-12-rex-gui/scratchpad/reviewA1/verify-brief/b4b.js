const { launch, openPage, waitIdle } = require('./lib');
const { readResult, settle } = require('./repo/rex-strength-lab/test/make-page-fixture.js');
const BEFORE = require('./repo/rex-strength-lab/test/fixtures/page-before.json').results;
(async () => {
  const b = await launch();
  const POWERS_OFF = { groundHolds: false, gentleHold: false, safePassenger: false, silentStrike: false, softLanding: false, coolFlight: false };
  const norm = (r) => JSON.stringify(Object.assign({}, r, { verdict: r.verdict && r.verdict.replace(/^(Pushing straight across: )(\w)/, (m, a, c) => a + c.toLowerCase()) }));
  for (const which of ['branch', 'mutated']) {
    const { page, ctx } = await openPage(b, which, Object.assign({ mode: 'real', anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'collide' }, POWERS_OFF));
    await page.waitForTimeout(400); await settle(page, 'duo-bay');
    const got = await readResult(page, 'duo-bay');
    const full = await page.evaluate(() => document.getElementById('duo-bay').textContent);
    console.log(which + ': s1-collide ' + (norm(got) === norm(BEFORE['s1-collide']) ? 'same result as before (test PASSES)' : 'result changed (test FAILS)') + ' | page text has MUTATED line: ' + full.includes('MUTATED: the rock never gives'));
    await ctx.close();
  }
  await b.close();
})();
