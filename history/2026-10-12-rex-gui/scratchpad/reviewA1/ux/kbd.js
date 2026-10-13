const { NEW, launch, DIR, path } = require('./common');
(async () => {
  const b = await launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(NEW()); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(2000);
  const desc = () => page.evaluate(() => { const a = document.activeElement; if (!a) return 'none'; const lab = a.getAttribute('aria-label') || (a.labels && a.labels[0] && a.labels[0].textContent.trim().slice(0, 30)) || a.textContent.trim().slice(0, 40); const sec = a.closest('#duo') ? 'DUO' : a.closest('main') ? 'MAIN' : a.closest('aside') ? 'ASIDE' : 'OTHER'; return sec + ' ' + a.tagName + (a.id ? '#' + a.id : '') + ' "' + lab.replace(/\s+/g, ' ') + '"'; });
  // tab order
  await page.evaluate(() => { document.getElementById('powers').open = true; document.body.focus(); });
  const seq = [];
  await page.focus('#strength');
  for (let i = 0; i < 70; i++) { seq.push(await desc()); await page.keyboard.press('Tab'); }
  console.log('TAB ORDER:\n' + seq.join('\n'));
  // focus visible on summary of duo
  await page.focus('#duo > summary');
  const fv = await page.evaluate(() => { const s = document.querySelector('#duo > summary'); const cs = getComputedStyle(s); return { outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, matches: s.matches(':focus-visible') }; });
  console.log('duo summary focus (programmatic):', JSON.stringify(fv));
  await page.screenshot({ path: path.join(DIR, 'shots', 'focus-duo-summary.png'), clip: { x: 400, y: 0, width: 880, height: 900 } });
  await b.close();
  console.log('errors', errs);
})();
