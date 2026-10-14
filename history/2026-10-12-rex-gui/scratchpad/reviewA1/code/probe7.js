const { launch, url, settle, text, S } = require('./lib.js');
(async () => {
  const br = await launch();
  const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url(process.argv[2] || 'branch.html'));
  const seen = {};
  for (const duoAction of ['arm', 'wrestle', 'catch', 'collide']) for (const action of ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight']) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), { duoOpen: true, duoAction, action });
    await page.reload(); await page.waitForTimeout(300); await settle(page, 'bay'); await settle(page, 'duo-bay');
    const d = await page.evaluate(() => { const c = {}; for (const n of document.querySelectorAll('[id]')) c[n.id] = (c[n.id] || 0) + 1; return Object.keys(c).filter((k) => c[k] > 1); });
    for (const id of d) (seen[id] = seen[id] || []).push(action + '+' + duoAction);
  }
  for (const [id, w] of Object.entries(seen)) console.log('duplicate id #' + id + ' in ' + w.length + ' combos, e.g. ' + w.slice(0, 8).join(', '));
  await br.close();
})();
