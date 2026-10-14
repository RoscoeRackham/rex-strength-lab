// type a goal, then grab Rex's effort slider and drag it: does the drag survive the goal's commit (main: sync redraw; branch: deferred)?
const { launch, open, settle } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const f of ['main.html', 'branch.html']) {
    const page = await open(b, f, { state: { action: 'throw', group: 'solo' }, wait: 1500 });
    await settle(page, 'bay');
    await page.evaluate(() => { document.querySelector('#bay details.effort-adjust').open = true; });
    await page.waitForTimeout(200);
    await page.focus('#goal'); await page.keyboard.press('Control+A'); await page.keyboard.type('40');
    const box = await page.$eval('#effort-use', (n) => { const r = n.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, v: n.value }; });
    await page.mouse.move(box.x + box.w * 0.3, box.y + box.h / 2);
    await page.mouse.down();
    await page.waitForTimeout(100);
    for (let i = 1; i <= 10; i++) { await page.mouse.move(box.x + box.w * (0.3 + 0.04 * i), box.y + box.h / 2); await page.waitForTimeout(40); }
    const mid = await page.evaluate(() => ({ v: document.getElementById('effort-use').value, eff: JSON.parse(localStorage.getItem('rex-lab-v1')).effort, logKg: JSON.parse(localStorage.getItem('rex-lab-v1')).effortLogKg, goal: JSON.parse(localStorage.getItem('rex-lab-v1')).gThrow }));
    await page.mouse.up();
    await page.waitForTimeout(500);
    const end = await page.evaluate(() => ({ v: document.getElementById('effort-use').value, eff: JSON.parse(localStorage.getItem('rex-lab-v1')).effort, logKg: JSON.parse(localStorage.getItem('rex-lab-v1')).effortLogKg, read: (document.querySelector('#bay .effort-read b') || {}).textContent }));
    console.log(f, JSON.stringify({ start: box.v, mid, end }), page.errs.join('|'));
    await page.close();
  }
  await b.close();
})();
