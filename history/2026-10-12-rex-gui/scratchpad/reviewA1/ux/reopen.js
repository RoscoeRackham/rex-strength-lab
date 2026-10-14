const { NEW, launch } = require('./common');
(async () => {
  const b = await launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(NEW()); await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'catch', mode: 'real', cObj: 'bus' }))); await page.reload(); await page.waitForTimeout(8000);
  const read = () => page.evaluate(() => { const v = document.querySelector('#duo-bay .verdict'); const f = document.querySelector('#duo-bay .fighter'); return { verdict: v && v.textContent.slice(0, 70), fighter: f && f.textContent.replace(/\s+/g, ' ').slice(0, 40), working: /working it out/i.test(document.getElementById('duo-bay').textContent), sum: document.getElementById('duo-sum').textContent }; });
  console.log('open, settled:', JSON.stringify(await read()));
  await page.click('#duo > summary'); await page.waitForTimeout(300);
  await page.click('#tier-chips .chip >> nth=4'); await page.waitForTimeout(1000);
  console.log('closed, strength changed; dial:', await page.textContent('#dial-big'));
  // reopen and sample right after the toggle event
  const samples = await page.evaluate(async () => {
    const out = []; const d = document.getElementById('duo');
    const snap = (tag) => { const v = document.querySelector('#duo-bay .verdict'); const f = document.querySelector('#duo-bay .fighter'); out.push([tag, Math.round(performance.now() - t0), v && v.textContent.slice(0, 60), f && f.textContent.replace(/\s+/g, ' ').slice(0, 30)]); };
    const t0 = performance.now();
    d.open = true;
    await new Promise((r) => d.addEventListener('toggle', r, { once: true }));
    snap('after toggle event');
    await new Promise((r) => requestAnimationFrame(r)); snap('first frame after toggle (painted state)');
    await new Promise((r) => setTimeout(r, 3000)); snap('3 s later');
    return out;
  });
  for (const s of samples) console.log(JSON.stringify(s));
  await b.close();
})();
