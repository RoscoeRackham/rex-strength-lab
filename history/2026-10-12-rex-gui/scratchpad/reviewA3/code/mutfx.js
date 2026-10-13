// What the surviving mutants do on the page (and the real page for comparison), plus the arrow keys in both tab rows.
const { chromium, CHROME, wrap, settle, readResult, S } = require('./h.js');
const builds = { real: S + '/work/rex-strength-lab/dist/index.html', m1: S + '/mut-m1/rex-strength-lab/dist/index.html', m4: S + '/mut-m4/rex-strength-lab/dist/index.html', m5: S + '/mut-m5/rex-strength-lab/dist/index.html' };
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const open = async (name, st) => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(wrap(builds[name], 'mfx-' + name + '.html'));
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(800);
    return page;
  };
  // 1. reopening after a change made while closed: what the element shows before its redraw
  for (const name of ['real', 'm1']) {
    const page = await open(name, { duoOpen: true, duoAction: 'collide' });
    await settle(page, 'duo-bay');
    const before = await page.$eval('#duo-bay .verdict', (n) => n.textContent);
    await page.click('#duo > summary'); await page.waitForTimeout(300);
    await page.click('#tier-chips .chip:nth-child(2)'); await page.waitForTimeout(500);
    await page.evaluate(() => { window.__seen = []; document.addEventListener('toggle', (e) => { if (e.target.id === 'duo' && e.target.open) { const t = () => (document.querySelector('#duo-bay .verdict') || document.getElementById('duo-bay')).textContent.slice(0, 120); window.__seen.push('at toggle: ' + t()); requestAnimationFrame(() => window.__seen.push('next frame: ' + t())); } }, true); });
    await page.click('#duo > summary'); await page.waitForTimeout(100);
    const seen = await page.evaluate(() => window.__seen);
    await settle(page, 'duo-bay');
    const after = await page.$eval('#duo-bay .verdict', (n) => n.textContent);
    console.log(name + ' reopen: before closing "' + before.slice(0, 90) + '"; ' + JSON.stringify(seen) + '; settled "' + after.slice(0, 90) + '"');
    await page.close();
  }
  // 2. a saved bolted footing: the switches
  for (const name of ['real', 'm4']) {
    const page = await open(name, { anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'collide' });
    await settle(page, 'duo-bay');
    const r = await page.evaluate(() => ({ rex: document.getElementById('bolt-rex').checked, ollie: document.getElementById('bolt-ollie').checked, sum: document.getElementById('powers-sum').textContent, verdict: document.querySelector('#duo-bay .verdict').textContent.slice(0, 90) }));
    console.log(name + ' saved bolted: ' + JSON.stringify(r));
    await page.close();
  }
  // 3. a save from before Wrestle's own angle (Rex's angle 30)
  for (const name of ['real', 'm5']) {
    const page = await open(name, { angle: 30, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw' });
    await settle(page, 'duo-bay');
    const r = await page.evaluate(() => ({ wAngle: (document.getElementById('w-angle') || {}).value, verdict: document.querySelector('#duo-bay .verdict').textContent.slice(0, 100) }));
    console.log(name + ' old save, Rex angle 30: ' + JSON.stringify(r));
    await page.close();
  }
  // 4. arrow keys in both tab rows (real page)
  {
    const page = await open('real', { duoOpen: true, duoAction: 'arm', action: 'throw' });
    await settle(page, 'duo-bay');
    await page.focus('#tab-throw'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300);
    const a = await page.evaluate(() => ({ focus: document.activeElement.id, action: JSON.parse(localStorage.getItem('rex-lab-v1')).action, duoAction: JSON.parse(localStorage.getItem('rex-lab-v1')).duoAction }));
    await page.focus('#tab-arm'); await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(600);
    const b = await page.evaluate(() => ({ focus: document.activeElement.id, action: JSON.parse(localStorage.getItem('rex-lab-v1')).action, duoAction: JSON.parse(localStorage.getItem('rex-lab-v1')).duoAction, labels: [document.getElementById('tabs').getAttribute('aria-label'), document.getElementById('duo-tabs').getAttribute('aria-label')] }));
    await page.keyboard.press('End'); await page.waitForTimeout(300);
    const c = await page.evaluate(() => document.activeElement.id);
    console.log('arrows: Rex row ' + JSON.stringify(a) + '; duo row ' + JSON.stringify(b) + '; End -> ' + c);
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
