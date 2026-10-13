const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(NEW()); await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'wrestle', action: 'throw' }))); await page.reload(); await page.waitForTimeout(3500);
  const act = () => page.evaluate(() => { const a = document.activeElement; return (a.closest('#duo-bay') ? 'duo-bay ' : a.closest('#bay') ? 'bay ' : 'elsewhere ') + a.tagName + '#' + a.id + ' "' + a.textContent.trim().slice(0, 20) + '" connected=' + a.isConnected; });
  // Rex's bay: object select via keyboard
  await page.focus('#obj'); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(800); console.log('rex #obj ArrowDown ->', await act());
  await page.focus('#angle'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(800); console.log('rex #angle ArrowRight ->', await act());
  await page.focus('#effort'); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(1500); console.log('rex #effort ArrowDown ->', await act());
  // duo bay: wrestle move chips via keyboard (Enter)
  await page.focus('#wm-shove'); await page.keyboard.press('Enter'); await page.waitForTimeout(1500); console.log('duo #wm-shove Enter ->', await act());
  await page.focus('#ww-both').catch(() => {}); await page.keyboard.press('Enter'); await page.waitForTimeout(1500); console.log('duo #ww-both Enter ->', await act());
  await page.focus('#duo-effort'); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(2000); console.log('duo #duo-effort ArrowDown ->', await act());
  // focus in duo bay, then a sidebar change - focus stays in sidebar
  await page.focus('#surface'); await page.keyboard.press('ArrowUp'); await page.waitForTimeout(2000); console.log('sidebar #surface ArrowUp ->', await act());
  // focus in Rex's bay while the duo bay redraws after a duo control change via mouse
  await page.focus('#obj'); await page.evaluate(() => document.getElementById('wm-push').click()); await page.waitForTimeout(1500); console.log('rex #obj focused while duo redraws ->', await act());
  // collide
  await page.focus('#tab-collide'); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
  await page.focus('#cm-charge'); await page.keyboard.press('Tab'); const nx = await act(); await page.keyboard.press('Enter'); await page.waitForTimeout(1500); console.log('duo collide next control (' + nx + ') Enter ->', await act());
  console.log('errors', errs);
  await b.close();
})();
