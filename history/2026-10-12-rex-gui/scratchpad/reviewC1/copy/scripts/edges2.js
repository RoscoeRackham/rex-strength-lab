const { chromium, CHROME, preview, settle, OUT, fs } = require('./common.js');
(async () => {
  const url = preview();
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [w,h,scheme] of [[390,844,'light'],[390,844,'dark']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type()==='error'||m.type()==='warning') errs.push(m.text()); });
    await page.goto(url);
    // below the ladder: custom effort at the slider's minimum
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action: 'punch', logKg: 6 });
    await page.reload(); await page.waitForTimeout(400);
    await page.selectOption('#effort', 'custom'); await page.waitForTimeout(300);
    await page.evaluate(() => { const s = document.getElementById('effort-use'); s.value = s.min; s.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.waitForTimeout(600); await settle(page, 'bay');
    let r = await page.evaluate(() => { const t = Array.from(document.querySelectorAll('#bay .tile')).filter(t => /Compared with|Energy in/.test(t.innerText)); t[0] && t[0].scrollIntoView({ block: 'center' }); return { t: t.map(x => x.innerText.replace(/\n/g, ' / ')), sw: document.documentElement.scrollWidth - document.documentElement.clientWidth, min: document.getElementById('effort-use').min }; });
    console.log(w, scheme, 'below', JSON.stringify(r));
    await page.screenshot({ path: OUT + '/edge-below-' + w + '-' + scheme + '.png' });
    // the clap at the top of the dial with a 500 m Rex
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action: 'clap', logKg: 34, H: 500, m: 3007 * Math.pow(500/3.048, 3) });
    await page.reload(); await page.waitForTimeout(400); await page.selectOption('#effort', 'allout'); await page.waitForTimeout(400); await settle(page, 'bay');
    r = await page.evaluate(() => { const t = Array.from(document.querySelectorAll('#bay .tile')).filter(t => /Compared with|Energy released/.test(t.innerText)); t[1] && t[1].scrollIntoView({ block: 'center' }); return { t: t.map(x => x.innerText.replace(/\n/g, ' / ')), sw: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
    console.log(w, scheme, 'bigclap', JSON.stringify(r));
    await page.screenshot({ path: OUT + '/edge-bigclap-' + w + '-' + scheme + '.png' });
    // Collide near the top of the ladder
    for (const m of [1e24, 1e25, 1e26]) {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: 4, m, oM: m, colBounce: 'splat', H: 500, oH: 500 });
      await page.reload(); await page.waitForTimeout(400); try { await page.selectOption('#duo-effort', 'allout'); } catch (e) {} await page.waitForTimeout(400); await settle(page, 'duo-bay');
      r = await page.evaluate(() => { const t = Array.from(document.querySelectorAll('#duo-bay .tile')).filter(t => /Energy freed/.test(t.innerText)); t[0] && t[0].scrollIntoView({ block: 'center' }); return { t: t.map(x => x.innerText.replace(/\n/g, ' / ')), sw: document.documentElement.scrollWidth - document.documentElement.clientWidth, v: (document.querySelector('#duo-bay .verdict')||{}).innerText }; });
      console.log(w, scheme, 'collide m=' + m, JSON.stringify(r).slice(0, 400));
      await page.screenshot({ path: OUT + '/edge-collide-' + m + '-' + w + '-' + scheme + '.png' });
    }
    console.log('errors', errs);
    await page.close();
  }
  await browser.close();
})();
