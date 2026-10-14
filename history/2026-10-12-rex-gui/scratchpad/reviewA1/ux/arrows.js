const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(NEW()); await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true }))); await page.reload(); await page.waitForTimeout(3500);
  const st = () => page.evaluate(() => ({ focus: document.activeElement.id, solo: (document.querySelector('#tabs [aria-selected=true]') || {}).id, duo: (document.querySelector('#duo-tabs [aria-selected=true]') || {}).id, soloTabindex0: Array.from(document.querySelectorAll('#tabs [tabindex="0"]')).map((x) => x.id), duoTabindex0: Array.from(document.querySelectorAll('#duo-tabs [tabindex="0"]')).map((x) => x.id) }));
  await page.focus('#tab-throw');
  for (const k of ['ArrowRight', 'End', 'ArrowRight', 'ArrowLeft', 'Home', 'ArrowLeft']) { const t0 = Date.now(); await page.keyboard.press(k); console.log('solo', k, Date.now() - t0 + 'ms', JSON.stringify(await st())); }
  await page.focus('#tab-arm');
  for (const k of ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'End', 'Home', 'ArrowLeft']) { const t0 = Date.now(); await page.keyboard.press(k); const ms = Date.now() - t0; await page.waitForTimeout(50); console.log('duo', k, ms + 'ms', JSON.stringify(await st())); }
  // ArrowUp/Down do nothing (horizontal lists); Tab from duo tablist goes into duo panel
  await page.focus('#tab-collide'); await page.keyboard.press('Tab');
  console.log('Tab from duo tab ->', await page.evaluate(() => { const a = document.activeElement; return a.tagName + '#' + a.id + ' in ' + (a.closest('#duo-bay') ? 'duo-bay' : a.closest('#bay') ? 'bay' : '?'); }));
  console.log('errors', errs);
  await b.close();
})();
