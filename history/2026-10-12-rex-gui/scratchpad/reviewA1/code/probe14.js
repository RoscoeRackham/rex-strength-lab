const { launch, url, settle, text, S } = require('./lib.js');
(async () => {
  const br = await launch();
  const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url('branch.html'));
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', action: 'throw' })));
  await page.reload(); await page.waitForTimeout(300); await settle(page, 'bay'); await settle(page, 'duo-bay'); await page.waitForTimeout(500);
  const dups = await page.evaluate(() => { const c = {}; for (const n of document.querySelectorAll('[id]')) c[n.id] = (c[n.id] || 0) + 1; return Object.keys(c).filter((k) => c[k] > 1); });
  const labels = await page.evaluate(() => Array.from(document.querySelectorAll('input#angle')).map((n) => (n.closest('#bay') ? 'Rex' : 'duo') + ': ' + n.labels.length + ' label(s)'));
  console.log('duplicate ids:', dups, '| #angle inputs:', labels);
  const rex0 = await page.evaluate(() => document.querySelector('#bay .verdict').textContent);
  // move the angle slider in the Rex + Ollie element (Wrestle > Throw) with the keyboard
  await page.focus('#duo-bay input#angle');
  for (let i = 0; i < 15; i++) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(800); await settle(page, 'bay'); await settle(page, 'duo-bay'); await page.waitForTimeout(500);
  const rex1 = await page.evaluate(() => ({ v: document.querySelector('#bay .verdict').textContent, label: document.querySelector('#bay label[for=angle]').textContent, duoLabel: document.querySelector('#duo-bay label[for=angle]').textContent }));
  console.log('Rex verdict before:', rex0);
  console.log('after moving the two-player angle slider:', JSON.stringify(rex1));
  await br.close();
})();
