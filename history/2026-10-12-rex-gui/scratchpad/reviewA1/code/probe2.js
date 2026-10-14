// effort-cap leak: Rex's bay and the ladder with the Rex + Ollie element open (capped effort) vs closed
const { launch, url, settle, text } = require('./lib.js');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
(async () => {
  const br = await launch();
  const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(url('branch.html'));
  const extra = JSON.parse(process.argv[2] || '{}');
  let diffs = 0;
  for (const duoAction of ['arm', 'wrestle', 'catch', 'collide']) {
    for (const tab of SOLO) {
      const res = [];
      for (const open of [false, true]) {
        await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ action: tab, duoAction, duoOpen: open, walker: 'both' }, extra));
        await page.reload(); await page.waitForTimeout(400);
        await settle(page, 'bay');
        if (open) await settle(page, 'duo-bay');
        // nudge a re-render of both bays after the duo render (a settings change while open): toggle a no-op setting
        await page.evaluate(() => { const s = document.getElementById('surface'); s.dispatchEvent(new Event('change')); });
        await page.waitForTimeout(300); await settle(page, 'bay'); if (open) await settle(page, 'duo-bay');
        for (let i = 0; i < 100 && await page.evaluate(() => /Working out the thresholds/.test(document.getElementById('ladder').textContent)); i++) await page.waitForTimeout(200);
        const eff = open ? await page.evaluate(() => (document.querySelector('#duo-bay .effort-read b') || {}).textContent) : null;
        res.push({ bay: await text(page, 'bay'), ladder: await page.evaluate(() => document.getElementById('ladder').textContent.replace(/\s+/g, ' ')), eff });
      }
      const same = res[0].bay === res[1].bay && res[0].ladder === res[1].ladder;
      if (!same) { diffs++; console.log('DIFF', duoAction, tab, res[1].eff); }
      else if (tab === 'throw') console.log('same', duoAction, tab, 'duo effort:', res[1].eff);
    }
  }
  console.log('diffs', diffs, 'errors', errs);
  await br.close();
})();
