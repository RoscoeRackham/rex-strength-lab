// Drive the page through non-default states; flag NaN/undefined/Infinity anywhere in the page text, console errors, overflow
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const URL = pathToFileURL(process.argv[2]).href;
const W = Number(process.argv[3] || 390);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: W, height: 844 }, colorScheme: 'dark' });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(URL);
  await page.waitForTimeout(2500);
  const problems = [];
  const check = async (label) => {
    await page.waitForFunction(() => !/Working out the courtesy ceiling/.test(document.body.innerText), null, { timeout: 60000 }).catch(() => problems.push(label + ': ceiling never finished'));
    const r = await page.evaluate(() => ({ t: document.body.innerText, ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, calc: /Calculation failed/.test(document.body.innerText) }));
    const bad = r.t.match(/.{0,60}(NaN|undefined|(?<![∞\w])Infinity).{0,40}/g);
    if (bad) problems.push(label + ': broken text: ' + bad.slice(0, 3).join(' || '));
    if (r.ov > 0) problems.push(label + ': overflow ' + r.ov + 'px');
    if (r.calc) problems.push(label + ': Calculation failed');
    if (errs.length) { problems.push(label + ': console ' + errs.join(' ; ').slice(0, 300)); errs.length = 0; }
  };
  const sel = async (id, v) => page.evaluate(([id, v]) => { const s = document.querySelector(id); s.value = v; s.dispatchEvent(new Event('change')); }, [id, v]);
  const tab = async (t, duo) => { await page.click(duo ? '#grp-duo' : '#grp-solo'); await page.click('#tab-' + t); await page.waitForTimeout(300); };
  const presets = ['least', 'ceiling', 'rattle', 'plaster', 'windows', 'ground', 'houses', 'block', 'allout', 'custom'];
  for (const strength of ['default', 'inf']) {
    if (strength === 'inf') { await page.evaluate(() => { const c = [...document.querySelectorAll('#tier-chips .chip')].pop(); c.click(); }); await page.waitForTimeout(800); }
    for (const t of ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) {
      await tab(t);
      const hasEffort = await page.$('#effort');
      if (!hasEffort) { await check(strength + ' ' + t + ' (no effort control)'); continue; }
      for (const p of presets) { await sel('#effort', p); await page.waitForTimeout(150); await check(strength + ' ' + t + ' ' + p); }
      await sel('#effort', 'least');
    }
  }
  // switches and growth
  for (const id of ['sw-gentle', 'sw-passenger', 'sw-silent', 'sw-soft', 'sw-cool']) await page.evaluate((id) => { const c = document.getElementById(id); c.checked = true; c.dispatchEvent(new Event('change')); }, id);
  await page.evaluate(() => { const d = document.querySelector('#tier-chips .chip[data-id]'); }); 
  for (const ab of ['ocean', 'gradual', 'instant', 'runaway']) {
    await sel('#absorb', ab);
    for (const t of ['throw', 'jump', 'punch', 'clap']) { await tab(t); for (const p of ['least', 'allout']) { await sel('#effort', p); await page.waitForTimeout(150); await check('switches ' + ab + ' ' + t + ' ' + p); } }
    await tab('weight');
    for (const gw of ['krakatoa', 'chicxulub', 'sun']) { const b = await page.$('#grow-what-' + gw); if (b) { await b.click(); await page.waitForTimeout(200); await check('weight growth ' + ab + ' ' + gw); } else problems.push('no #grow-what-' + gw); }
    for (const s of ['1', '0']) { await page.evaluate((s) => { const b = document.querySelector('#grow-chips .chip[data-s="' + s + '"]'); b && b.click(); }, s); await page.waitForTimeout(200); await check('weight growth ' + ab + ' s=' + s); }
  }
  // person thrown
  await tab('throw'); await page.evaluate(() => { const c = document.getElementById('sw-passenger'); c.checked = false; c.dispatchEvent(new Event('change')); });
  const objSel = await page.$('#obj'); if (objSel) { await sel('#obj', 'person'); await page.waitForTimeout(300); for (const p of ['least', 'allout']) { await sel('#effort', p); await check('throw person ' + p); } }
  // walk
  await tab('walk');
  for (const w of ['rex', 'ollie', 'both']) for (const pace of ['stroll', 'fast']) {
    await page.click('#walker-' + w); await page.click('#pace-' + pace);
    await page.evaluate(() => { const s = document.getElementById('step-effort'); s.value = '1'; s.dispatchEvent(new Event('input')); }); await page.waitForTimeout(200);
    await check('walk ' + w + ' ' + pace + ' stamp');
  }
  for (const sf of ['ice', 'steel', 'sand', 'softclay', 'granite']) { await sel('#surface', sf); await page.waitForTimeout(200); await check('walk surface ' + sf); }
  await sel('#surface', 'concrete');
  // duo
  for (const t of ['arm', 'wrestle', 'catch', 'collide']) {
    await tab(t, true);
    for (const d of ['least', 'allout', 'custom']) { const s = await page.$('#duo-effort'); if (!s) { problems.push('no duo effort on ' + t); break; } await sel('#duo-effort', d); await page.waitForTimeout(300); await check('duo ' + t + ' ' + d); }
    await page.evaluate(() => { const c = document.getElementById('o-effort-own'); if (c) { c.checked = true; c.dispatchEvent(new Event('change')); } }); await page.waitForTimeout(300); await check('duo ' + t + ' ollie own');
    await page.evaluate(() => { const c = document.getElementById('o-effort-own'); if (c) { c.checked = false; c.dispatchEvent(new Event('change')); } });
  }
  console.log(W + 'px: ' + problems.length + ' problems');
  for (const p of problems) console.log(' - ' + p);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
