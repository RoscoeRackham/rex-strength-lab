const H = require('./hc.js');
(async () => {
  const p = await H.open();
  await H.setState(p, { surface: 'concrete', logKg: Math.log10(100 * 907.18474), inf: false, wrestleMove: 'push' });
  await H.tab(p, 'wrestle');
  await H.sel(p, '#duo-effort', 'custom');
  for (const v of [3.5, 4.2]) {
    await p.evaluate((v) => { const s = document.getElementById('duo-effort-use'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, v);
    await p.waitForTimeout(1500); await H.settle(p);
    const t = await p.evaluate(() => { const b = document.getElementById('bay'); return [...b.querySelectorAll('.verdict')].map((x) => x.innerText).join(' / ') + '\nEFFORT: ' + b.querySelector('.effort-read').innerText; });
    console.log('--- slider', v, '\n' + t);
  }
  await H.close();
})();
