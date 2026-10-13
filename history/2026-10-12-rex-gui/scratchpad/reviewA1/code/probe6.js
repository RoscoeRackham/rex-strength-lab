const { launch, url, settle, text, S } = require('./lib.js');
(async () => {
  const br = await launch();
  const page = await br.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url('branch.html'));
  await page.addInitScript(() => {
    window.__frames = [];
    const loop = () => { const b = document.getElementById('duo-bay'); const d = document.getElementById('duo'); window.__frames.push([Math.round(performance.now()), d && d.open ? 1 : 0, b ? b.children.length : -1]); if (window.__frames.length < 400) requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  });
  for (const tab of ['arm', 'wrestle', 'catch', 'collide']) for (const st of [{}, { inf: true }]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true, duoAction: tab }, st));
    await page.reload(); await page.waitForTimeout(100); await settle(page, 'duo-bay');
    const f = await page.evaluate(() => window.__frames);
    const empty = f.filter((x) => x[1] === 1 && x[2] === 0), full = f.find((x) => x[1] === 1 && x[2] > 0);
    console.log(tab, JSON.stringify(st), 'frames painted open+empty:', empty.length, empty.length ? 'from ' + empty[0][0] + ' to ' + empty[empty.length - 1][0] : '', '; first frame with content', full && full[0]);
  }
  await br.close();
})();
