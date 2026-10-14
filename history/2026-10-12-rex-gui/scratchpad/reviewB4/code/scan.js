// Scan many settings with the powers on (and partly on) for broken text (NaN, undefined, bare Infinity) and page errors.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const fs = require('fs');
const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity|\[object/g) || []);
async function settle(page, id) { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((x) => /working it out|Working out/i.test(document.getElementById(x).textContent), id); if (!busy) return true; await page.waitForTimeout(250); } return false; }
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL('pages/branch.html').href);
  const cases = [];
  const shares = [1, 0.5, 0, 0.9999];
  const solo = (st, eff) => cases.push({ st, eff, bay: 'bay' });
  const duo = (st, eff) => cases.push({ st: Object.assign({ duoOpen: true }, st), eff, bay: 'duo-bay' });
  for (const airAbsorb of shares) for (const kf of [true, false]) {
    const pw = { airAbsorb, keepForm: kf, unbreakable: true, ownRecoil: true };
    for (const obj of ['car', 'baseball', 'allstar', 'person']) for (const logKg of [5, 14, 23]) for (const angle of [0, 45]) solo(Object.assign({ action: 'throw', obj, logKg, angle }, pw), 'allout');
    for (const cObj of ['baseball', 'car', 'partner']) for (const logKg of [6, 14, 30]) for (const cStyle of ['easy', 'hard']) duo(Object.assign({ duoAction: 'catch', cObj, cStyle, logKg, cLogD: 2 }, pw), 'allout');
  }
  for (const pw of [{ unbreakable: true, ownRecoil: false, airAbsorb: 0, keepForm: false }, { unbreakable: false, ownRecoil: true, airAbsorb: 0, keepForm: false }, { unbreakable: true, ownRecoil: true, airAbsorb: 1, keepForm: true }])
    for (const action of ['jump', 'stomp', 'punch', 'pull', 'lift', 'weight', 'walk', 'sprint', 'clap']) for (const surface of ['sand', 'concrete', 'ice']) for (const logKg of [4, 12]) for (const eff of ['least', 'ground']) solo(Object.assign({ action, surface, logKg, obj: 'bus' }, pw), eff);
  for (const pw of [{ unbreakable: true, ownRecoil: true, airAbsorb: 1, keepForm: true }, { unbreakable: true, ownRecoil: false, airAbsorb: 0.5, keepForm: false }])
    for (const duoAction of ['arm', 'wrestle', 'collide']) for (const surface of ['sand', 'concrete']) for (const logKg of [5, 12]) for (const anchor of ['friction', 'bolted']) for (const eff of ['least', 'ground']) {
      const subs = duoAction === 'wrestle' ? [{ wrestleMove: 'shove' }, { wrestleMove: 'throw' }, { wrestleMove: 'lift' }] : duoAction === 'collide' ? [{ colSrc: 'jump' }, { colSrc: 'sprint' }] : [{}];
      for (const s of subs) duo(Object.assign({ duoAction, surface, logKg, anchor }, pw, s), eff);
    }
  const found = [];
  let i = 0;
  for (const c of cases) {
    i++;
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), c.st);
    await page.reload(); await page.waitForTimeout(150);
    let ok = await settle(page, c.bay);
    if (c.eff !== 'least') { const sel = c.bay === 'bay' ? '#effort' : '#duo-effort'; if (await page.$(sel)) { const opts = await page.$$eval(sel + ' option', (os) => os.map((o) => o.value)); if (opts.includes(c.eff)) { await page.selectOption(sel, c.eff); await page.waitForTimeout(200); ok = await settle(page, c.bay) && ok; } } }
    const t = await page.evaluate((id) => document.getElementById(id).textContent.replace(/\s+/g, ' '), c.bay);
    const b = bad(t);
    if (b.length || !ok || errs.length) { found.push({ st: c.st, eff: c.eff, bad: b, ok, errs: errs.splice(0), ctx: b.length ? (t.match(new RegExp('.{0,160}(' + b[0].replace(/[\[\]]/g, '\\$&') + ').{0,80}')) || [''])[0] : '' }); }
    if (i % 100 === 0) console.log(i, '/', cases.length, 'found', found.length);
  }
  fs.writeFileSync('scan-out.json', JSON.stringify(found, null, 1));
  console.log('done', cases.length, 'found', found.length);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
