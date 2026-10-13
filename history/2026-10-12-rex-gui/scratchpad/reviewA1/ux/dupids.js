const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(NEW()); await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true }))); await page.reload(); await page.waitForTimeout(3000);
  const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
  const DUO = [['arm'], ['wrestle', 'push'], ['wrestle', 'shove'], ['wrestle', 'lift'], ['wrestle', 'throw'], ['catch'], ['collide']];
  const found = {};
  for (const [d, mv] of DUO) {
    await page.click('#tab-' + d); await page.waitForTimeout(500);
    if (mv) { await page.click('#wm-' + mv); await page.waitForTimeout(500); }
    for (const s of SOLO) {
      await page.click('#tab-' + s); await page.waitForTimeout(250);
      const dups = await page.evaluate(() => { const c = {}; for (const n of document.querySelectorAll('[id]')) c[n.id] = (c[n.id] || 0) + 1; return Object.keys(c).filter((k) => c[k] > 1); });
      for (const id of dups) (found[id] = found[id] || []).push(s + '+' + d + (mv ? ':' + mv : ''));
    }
  }
  console.log(JSON.stringify(found, null, 1));
  console.log('errors', errs);
  await b.close();
})();
