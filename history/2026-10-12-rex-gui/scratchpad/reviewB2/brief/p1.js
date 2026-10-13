const H = require('./harness.js');
(async () => {
  const c = await H.open();
  await H.load(c, null);
  let t = await H.texts(c.page);
  console.log('=== DEFAULT THROW ===\n' + t.solo.slice(0, 3000));
  const r = await c.page.evaluate(() => [document.getElementById('air-absorb-big').textContent, document.getElementById('air-absorb-read').textContent, document.getElementById('air-absorb').getAttribute('aria-valuetext'), document.getElementById('powers-sum').textContent]);
  console.log('READOUT 100:', r);
  await c.page.evaluate(() => { const s = document.getElementById('air-absorb'); s.value = '70'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
  await H.settle(c.page);
  console.log('READOUT 70:', await c.page.evaluate(() => [document.getElementById('air-absorb-big').textContent, document.getElementById('air-absorb-read').textContent, document.getElementById('powers-sum').textContent]));
  await c.page.evaluate(() => { const s = document.getElementById('air-absorb'); s.value = '0'; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
  await H.settle(c.page);
  console.log('READOUT 0:', await c.page.evaluate(() => [document.getElementById('air-absorb-big').textContent, document.getElementById('air-absorb-read').textContent]));
  console.log('ERRS', c.errs);
  await c.browser.close();
})();
