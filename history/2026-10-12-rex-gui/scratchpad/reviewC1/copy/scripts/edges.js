const { chromium, CHROME, preview, settle, OUT, fs } = require('./common.js');
(async () => {
  const url = preview();
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w,h,scheme] of [[390,844,'light'],[390,844,'dark'],[1280,900,'light']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type()==='error'||m.type()==='warning') errs.push(m.text()); });
    await page.goto(url);
    const shots = [
      ['below', { action: 'punch', logKg: 6 }, async () => { await page.selectOption('#effort', 'custom'); await page.evaluate(() => { const s = document.querySelector('#effort-slider, input[type=range][id*=effort]'); if (s) { s.value = s.min; s.dispatchEvent(new Event('input', { bubbles: true })); } }); }],
      ['iss', { action: 'punch', logKg: 13 }, async () => { await page.selectOption('#effort', 'allout'); }],
      ['sungalaxy', { action: 'clap', logKg: 34, H: 500 }, async () => { await page.selectOption('#effort', 'allout'); }],
      ['top', { duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: 4, m: 1e27, oM: 1e27, colBounce: 'splat' }, async () => { try { await page.selectOption('#duo-effort', 'allout'); } catch (e) {} }],
      ['magnetar', { duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: 4, m: 1e20, oM: 1e20, colBounce: 'splat' }, async () => { try { await page.selectOption('#duo-effort', 'allout'); } catch (e) {} }],
    ];
    for (const [name, st, act] of shots) {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
      await page.reload(); await page.waitForTimeout(400); await act(); await page.waitForTimeout(400);
      const bay = st.duoOpen ? 'duo-bay' : 'bay'; await settle(page, bay);
      const r = await page.evaluate((bay) => { const tiles = Array.from(document.querySelectorAll('#' + bay + ' .tile')); const t = tiles.find(t => /Compared with|Energy freed|Energy released/.test(t.innerText));
        const sw = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const over = tiles.filter(t => t.scrollWidth > t.clientWidth + 1).map(t => t.innerText.slice(0,40));
        if (t) t.scrollIntoView({ block: 'center' });
        return { text: t && t.innerText.replace(/\n/g,' / '), sw, over }; }, bay);
      console.log(w, scheme, name, '|', r.text, '| page overflow', r.sw, '| tiles overflowing', r.over.length);
      await page.screenshot({ path: OUT + '/edge-' + name + '-' + w + '-' + scheme + '.png' });
    }
    console.log('errors', errs);
    await page.close();
  }
  await browser.close();
})();
