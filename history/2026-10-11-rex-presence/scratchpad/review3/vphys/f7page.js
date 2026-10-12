const pw = require('./pw');
(async () => {
  const p = await pw.open({ action: 'weight' }, { wait: 4000 });
  await p.evaluate(() => { const s = document.querySelector('#absorb'); s.value = 'instant'; s.dispatchEvent(new Event('change', { bubbles: true })); s.dispatchEvent(new Event('input', { bubbles: true })); }); await p.waitForTimeout(1500);
  await p.click('#grow-what-chicxulub'); await p.waitForTimeout(2500);
  const lines = await p.evaluate(() => [...document.querySelectorAll('#bay li, #bay p')].map((e) => e.innerText.replace(/\s+/g, ' ')));
  for (const l of [...new Set(lines)]) if (/blast|soles|ground|All at once|air at his/i.test(l)) console.log('  ', l.slice(0, 500));
  console.log('errs', p.errs);
  await pw.close();
})();
