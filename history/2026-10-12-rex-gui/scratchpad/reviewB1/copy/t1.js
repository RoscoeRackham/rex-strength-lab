const H = require('./h.js');
(async () => {
  const p = await H.open({});
  await p.evaluate(() => { document.getElementById('powers').open = true; });
  console.log('SUM:', await p.$eval('#powers-sum', (n) => n.textContent));
  console.log(await H.text(p, '#powers'));
  for (const v of [0, 30, 50, 100]) {
    await p.$eval('#air-absorb', (n, v) => { n.value = v; n.dispatchEvent(new Event('input', { bubbles: true })); n.dispatchEvent(new Event('change', { bubbles: true })); }, v);
    await p.waitForTimeout(300);
    const r = await p.evaluate(() => ({ big: document.getElementById('air-absorb-big').textContent, read: document.getElementById('air-absorb-read').textContent, vt: document.getElementById('air-absorb').getAttribute('aria-valuetext'), sum: document.getElementById('powers-sum').textContent }));
    console.log(v, JSON.stringify(r));
  }
  console.log('errs', p.errs);
  await H.close();
})();
