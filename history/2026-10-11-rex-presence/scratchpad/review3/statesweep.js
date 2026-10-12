// Browser sweep of non-default page states: every solo tab, two strengths, both muscle modes, all comic switches on,
// every effort preset, every absorbed-energy mode. Flags NaN/undefined/Infinity text, page errors, horizontal scroll,
// and an effort above the ceiling stated in the same readout.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const url = pathToFileURL(__dirname + '/preview.html').href;
const tabs = (process.argv[2] || 'throw,jump,stomp,punch,clap,sprint,pull,walk,lift,weight').split(',');
const width = Number(process.argv[3] || 1280);
const EFF = ['least', 'ceiling', 'rattle', 'plaster', 'windows', 'ground', 'houses', 'block', 'allout', 'custom'];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  let states = 0, problems = 0;
  for (const action of tabs) for (const chip of ['hulk', 'inf']) for (const mode of ['comic', 'real']) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
    await page.addInitScript((st) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); sessionStorage.setItem('seeded', '1'); } },
      { mode, action, group: 'solo', inf: chip === 'inf', gentleHold: true, safePassenger: true, silentStrike: true, softLanding: true, coolFlight: true, obj: process.env.OBJ || 'car' });
    await page.goto(url);
    const settle = async () => { for (let i = 0; i < 600; i++) { const p = await page.evaluate(() => /Working out|working it out/.test(document.querySelector('#bay').textContent)); if (!p) return true; await page.waitForTimeout(100); } return false; };
    const check = async (label) => {
      const ok = await settle();
      await page.waitForTimeout(60);
      const r = await page.evaluate(() => {
        const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove());
        const t = b.textContent;
        const bad = (t.match(/.{0,60}(NaN|undefined|(?<![∞\w])Infinity).{0,30}/g) || []);
        const ov = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const rd = document.querySelector('.effort-read');
        return { bad, ov, rd: rd ? rd.textContent : '' };
      });
      states++;
      const issues = [];
      if (!ok) issues.push('never settled');
      if (r.bad.length) issues.push('text: ' + r.bad.slice(0, 2).join(' | '));
      if (r.ov > 0) issues.push('overflow ' + r.ov);
      if (errs.length) issues.push('errors: ' + errs.splice(0).slice(0, 2).join(' | '));
      if (issues.length) { problems++; console.log(JSON.stringify({ action, chip, mode, label, issues })); }
    };
    await check('load');
    const hasEffort = await page.$('#effort');
    if (hasEffort) for (const e of EFF) { await page.selectOption('#effort', e); await check('effort ' + e); }
    if (hasEffort) await page.selectOption('#effort', 'allout');
    for (const a of ['gradual', 'instant', 'runaway', 'ocean']) { await page.evaluate((v) => { const s = document.querySelector('#absorb'); s.value = v; s.dispatchEvent(new Event('change')); }, a); await check('absorb ' + a); }
    await page.close();
  }
  console.log('states', states, 'with problems', problems);
  await browser.close();
})();
