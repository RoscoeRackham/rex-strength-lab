const { launch, url, settle, text } = require('./lib.js');
(async () => {
  const br = await launch();
  const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url('branch.html'));
  const [duoAction, tab] = process.argv.slice(2);
  const res = [];
  for (const open of [false, true, false]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), { action: tab, duoAction, duoOpen: open, walker: 'both' });
    await page.reload(); await page.waitForTimeout(400);
    await settle(page, 'bay'); if (open) await settle(page, 'duo-bay');
    await page.waitForTimeout(1500);
    res.push({ bay: await text(page, 'bay'), ladder: await page.evaluate(() => document.getElementById('ladder').textContent.replace(/\s+/g, ' ')) });
  }
  const show = (a, b) => { if (a === b) return 'same'; let i = 0; while (a[i] === b[i]) i++; return 'at ' + i + '\n  A: ' + a.slice(Math.max(0, i - 120), i + 200) + '\n  B: ' + b.slice(Math.max(0, i - 120), i + 200); };
  console.log('bay closed vs open:', show(res[0].bay, res[1].bay));
  console.log('ladder closed vs open:', show(res[0].ladder, res[1].ladder));
  console.log('bay closed vs closed:', show(res[0].bay, res[2].bay));
  console.log('ladder closed vs closed:', show(res[0].ladder, res[2].ladder));
  await br.close();
})();
