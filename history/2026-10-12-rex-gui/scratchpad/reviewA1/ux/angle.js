const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(NEW()); await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', action: 'throw' }))); await page.reload(); await page.waitForTimeout(3500);
  const cdp = await page.context().newCDPSession(page);
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  console.log('sliders:', nodes.filter((n) => n.role && n.role.value === 'slider' && !n.ignored).map((n) => JSON.stringify((n.name && n.name.value) || '')).join(', '));
  const before = await page.evaluate(() => Array.from(document.querySelectorAll('#angle')).map((n) => (n.closest('#duo-bay') ? 'duo ' : 'rex ') + n.value));
  await page.focus('#duo-bay #angle'); for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight'); await page.waitForTimeout(1500);
  const after = await page.evaluate(() => ({ vals: Array.from(document.querySelectorAll('#angle')).map((n) => (n.closest('#duo-bay') ? 'duo ' : 'rex ') + n.value), labels: Array.from(document.querySelectorAll('label[for="angle"]')).map((l) => l.textContent), focus: document.activeElement.id + (document.activeElement.closest('#duo-bay') ? ' (duo)' : ' (rex)') }));
  console.log('before', before, 'after 5x ArrowRight on the Wrestle throw angle:', JSON.stringify(after));
  await b.close();
})();
