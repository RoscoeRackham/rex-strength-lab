// controls that call resolveDuoEffort from an event handler: main vs branch
const { launch, url, settle, text } = require('./lib.js');
(async () => {
  const br = await launch();
  for (const act of ['arm', 'collide']) for (const [file, tag] of [['main.html', 'main'], ['branch.html', 'branch']]) {
    const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(url(file));
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), tag === 'main' ? { group: 'duo', duoAction: act } : { duoOpen: true, duoAction: act });
    await page.reload(); await page.waitForTimeout(500);
    const id = tag === 'main' ? 'bay' : 'duo-bay';
    await settle(page, id);
    const r0 = await page.evaluate((id) => document.querySelector('#' + id + ' .effort-read').textContent.replace(/\s+/g, ' ').slice(0, 120), id);
    await page.selectOption('#duo-effort', 'custom'); await page.waitForTimeout(500); await settle(page, id);
    const r1 = await page.evaluate((id) => ({ read: document.querySelector('#' + id + ' .effort-read').textContent.replace(/\s+/g, ' ').slice(0, 120), s: JSON.parse(localStorage.getItem('rex-lab-v1')).duoLogKg }), id);
    await page.selectOption('#duo-effort', 'least'); await page.waitForTimeout(500); await settle(page, id);
    await page.evaluate((id) => { document.querySelector('#' + id + ' details.effort-adjust').open = true; }, id);
    await page.check('#o-effort-own'); await page.waitForTimeout(500); await settle(page, id);
    const r2 = await page.evaluate((id) => ({ read: document.querySelector('#' + id + ' .effort-read').textContent.replace(/\s+/g, ' ').slice(0, 160), s: JSON.parse(localStorage.getItem('rex-lab-v1')).oEffortLogKg }), id);
    console.log(act, tag, JSON.stringify({ r0, r1, r2 }));
    await page.close();
  }
  await br.close();
})();
