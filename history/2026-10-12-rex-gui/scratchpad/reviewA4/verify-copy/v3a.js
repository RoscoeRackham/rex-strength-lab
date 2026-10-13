const { open } = require('./h');
(async () => {
  const r = await open(null, { wait: 2500 });
  const out = await r.page.evaluate(() => {
    const D = window.DINO_DATA; const keys = Object.keys(D);
    const rows = (D.sources || D.rows || []);
    return { keys, rows: JSON.stringify(D).match(/.{0,200}(undrained|shear strength).{0,300}/gi) };
  });
  console.log(out.keys);
  (out.rows || []).forEach(x => console.log('--', x));
  // DOM
  await r.page.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true));
  await r.page.waitForTimeout(800);
  const dom = await r.page.evaluate(() => [...document.querySelectorAll('tr, li, .row')].map(t => t.innerText.replace(/\s+/g, ' ')).filter(t => /shear strength|undrained/i.test(t)));
  dom.forEach(x => console.log('DOM:', x.slice(0, 500)));
  await r.browser.close();
})();
