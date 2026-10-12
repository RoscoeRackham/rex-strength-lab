const W = require('./pw.js');
(async () => {
  const p = await W.open({ action: 'weight' });
  await W.waitDone(p);
  const chips = await p.evaluate(() => [...document.querySelectorAll('#bay button')].map(b => b.id + ':' + b.textContent).filter(x => /Krakatoa|Dinosaur|Sun|None/.test(x)));
  console.log(chips);
  for (const mode of ['gradual', 'instant', 'runaway']) {
    await p.evaluate((m) => { const s = document.querySelector('#absorb'); s.value = m; s.dispatchEvent(new Event('change', { bubbles: true })); }, mode); await p.waitForTimeout(300);
    for (const what of ['Dinosaur-killer impact', 'The Sun for 1 second']) {
      await p.evaluate((w) => { const b = [...document.querySelectorAll('#bay button')].find(x => x.textContent.trim() === w); b.click(); }, what);
      await p.waitForTimeout(400);
      const t = await W.bayText(p);
      const i = t.indexOf('What if he absorbed');
      console.log('=== ' + mode + ' / ' + what); console.log(t.slice(i, i + 3500));
    }
  }
  if (p.errs.length) console.log(p.errs);
  await W.close();
})();
