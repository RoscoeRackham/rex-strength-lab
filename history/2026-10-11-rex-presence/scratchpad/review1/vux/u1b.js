const { open, tab, bayText } = require('./lib');
(async () => {
  const { browser, page } = await open({ w: 1280, h: 900 });
  const out = [];
  for (const logKg of [2, 3, 4.96, 6, 9, 'inf']) for (const surface of ['concrete', 'soil', 'grass', 'sand', 'mud']) {
    const saved = logKg === 'inf' ? { inf: true, surface } : { inf: false, logKg, surface };
    await page.evaluate((s) => { const cur = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign(cur, s))); }, saved);
    await page.reload(); await page.waitForTimeout(600);
    for (const t of ['throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) {
      await page.click('#grp-solo'); await page.click('#tab-' + t);
      // wait until ceiling known
      for (let k = 0; k < 40; k++) { const w = await page.evaluate(() => /Working out the courtesy ceiling/.test(document.querySelector('#bay').innerText)); if (!w) break; await page.waitForTimeout(150); }
      const txt = await page.evaluate(() => { const e = document.querySelector("#bay .effort-read"); return e ? e.innerText : ""; });
      if (/Above the courtesy ceiling/.test(txt)) out.push([logKg, surface, t, (txt.match(/(Effort|All-out):[^\n]*/) || [''])[0].slice(0, 90), (txt.match(/Courtesy ceiling:[^\n]*/) || [''])[0].slice(0, 110)]);
    }
  }
  for (const o of out) console.log(JSON.stringify(o));
  await browser.close();
})();
