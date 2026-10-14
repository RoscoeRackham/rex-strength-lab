const { open } = require('./harness.js');
(async () => {
  const h = await open('branch');
  for (const air of [0, 0.5]) {
    await h.load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 3, logKg: 20, airAbsorb: air }, 'duo-bay'); await h.settle('duo-bay', 120000);
    await h.page.selectOption('#duo-effort', 'allout'); await h.page.waitForTimeout(500); await h.settle('duo-bay', 120000);
    const t = await h.page.evaluate(() => { const b = document.getElementById('duo-bay'); return { verdict: b.querySelector('.verdict').textContent, items: Array.from(b.querySelectorAll('.happens li')).map((n) => n.textContent).filter((x) => /heat|fireball|plasma|drag/.test(x)) }; });
    console.log('air absorbed', air * 100 + '%:\n  VERDICT', t.verdict.slice(0, 400), '\n  ITEMS', t.items.join('\n        ').slice(0, 1200));
  }
  await h.browser.close();
})();
