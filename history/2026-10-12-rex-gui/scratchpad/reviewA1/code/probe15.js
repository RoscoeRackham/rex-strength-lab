const { launch, url, settle, text, S } = require('./lib.js');
(async () => {
  const br = await launch();
  const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url('branch.html'));
  for (const st of [{ inf: true, anchor: 'bolted', duoAction: 'collide' }, { inf: true, anchor: 'bolted', oAnchor: 'bolted', duoAction: 'wrestle' }, { inf: true, anchor: 'bolted', duoAction: 'arm' }]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true }, st));
    await page.reload(); await page.waitForTimeout(300); await settle(page, 'duo-bay');
    const t = await text(page, 'duo-bay');
    const m = t.match(/[^.]*(tears out|tear out|torn|rock gives|rock around)[^.]*\./gi);
    console.log(JSON.stringify(st), '\n  verdict:', await page.evaluate(() => document.querySelector('#duo-bay .verdict').textContent.slice(0, 250)), '\n  ', (m || []).slice(0, 3).join(' | ').slice(0, 500));
  }
  await br.close();
})();
