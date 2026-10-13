const { launch, url, settle, text, S } = require('./lib.js');
(async () => {
  const br = await launch();
  const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(url('branch.html'));
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm', action: 'throw' })));
  await page.reload(); await page.waitForTimeout(300); await settle(page, 'bay'); await settle(page, 'duo-bay');
  const lab = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input#near'));
    return inputs.map((n) => ({ inBay: n.closest('#bay') ? 'Rex' : n.closest('#duo-bay') ? 'duo' : '?', labels: n.labels.length }));
  });
  console.log('#near inputs and their label count:', JSON.stringify(lab));
  // accessible name via the accessibility tree
  const snap = await page.locator('#duo-bay input#near').evaluate((n) => n.labels.length ? n.labels[0].textContent : '(no label)');
  console.log('duo #near label:', snap);
  // click the duo's label: which input gets focus?
  await page.evaluate(() => { document.querySelector('#duo-bay details.effort-adjust').open = true; });
  await page.click('#duo-bay label[for=near]');
  console.log('after clicking the duo label, focus is in:', await page.evaluate(() => document.activeElement.closest('#bay') ? 'Rex\'s bay' : document.activeElement.closest('#duo-bay') ? 'duo bay' : document.activeElement.tagName));
  // type a distance in the duo's box and press Enter
  await page.click('#duo-bay input#near');
  await page.fill('#duo-bay input#near', '20');
  await page.press('#duo-bay input#near', 'Enter');
  await page.waitForTimeout(500); await settle(page, 'duo-bay'); await page.waitForTimeout(300);
  console.log('after Enter in the duo box, focus is in:', await page.evaluate(() => { const a = document.activeElement; return (a.closest('#bay') ? 'Rex\'s bay' : a.closest('#duo-bay') ? 'duo bay' : a.tagName) + ' (' + a.tagName + '#' + a.id + ')'; }), ' state.near =', await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')).near));
  await page.screenshot({ path: S + '/near-focus.png' });
  console.log('errors', errs);
  await br.close();
})();
