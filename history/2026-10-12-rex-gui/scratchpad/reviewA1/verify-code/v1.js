const { wrap, open, S } = require('./h.js');
(async () => {
  const url = wrap(S + '/lab/dist/index.html', 'branch.html');
  // A: count duplicate ids across all tab pairs
  let { browser, page, errs } = await open(url, { duoOpen: true, duoAction: 'arm', action: 'throw' });
  const SOLO = ['walk','lift','throw','jump','stomp','punch','clap','sprint','pull','weight'], DUO = ['arm','wrestle','catch','collide'];
  let pairs = 0, dupPairs = {};
  for (const d of DUO) {
    await page.click('#tab-' + d); await page.waitForTimeout(1500);
    for (const s of SOLO) {
      await page.click('#tab-' + s); await page.waitForTimeout(500);
      const dups = await page.evaluate(() => { const c = {}; document.querySelectorAll('[id]').forEach((n) => { c[n.id] = (c[n.id] || 0) + 1; }); return Object.keys(c).filter((k) => c[k] > 1); });
      pairs++; if (dups.length) dupPairs[s + '+' + d] = dups;
    }
  }
  console.log('pairs', pairs, 'with dup ids', Object.keys(dupPairs).length);
  const byId = {}; for (const [k, v] of Object.entries(dupPairs)) for (const id of v) byId[id] = (byId[id] || 0) + 1;
  console.log('dup id counts', byId);
  await browser.close();

  // B: wrestle throw + rex throw
  ({ browser, page, errs } = await open(url, { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', action: 'throw' }));
  await page.waitForTimeout(2000);
  const info = await page.evaluate(() => {
    const r = {};
    for (const id of ['angle', 'near']) {
      const all = Array.from(document.querySelectorAll('#' + id));
      r[id] = all.map((n) => ({ inDuo: !!n.closest('#duo-bay'), labels: n.labels ? n.labels.length : null, name: n.labels && n.labels[0] ? n.labels[0].textContent : '' }));
    }
    return r;
  });
  console.log('ids/labels', JSON.stringify(info));
  // accessible name via the accessibility tree
  const snap = await page.accessibility.snapshot({ interestingOnly: true });
  const sliders = []; (function walk(n) { if (!n) return; if (n.role === 'slider' || n.role === 'spinbutton') sliders.push(n.role + ':' + JSON.stringify(n.name)); (n.children || []).forEach(walk); })(snap);
  console.log('a11y sliders/spinbuttons', sliders.join(' | '));
  const verdict = () => page.evaluate(() => ({ v: document.querySelector('#bay .verdict').textContent.slice(0, 60), lab: document.querySelector('#bay label[for=angle]').textContent }));
  console.log('Rex before', JSON.stringify(await verdict()));
  const duoAngle = await page.$('#duo-bay #angle');
  await duoAngle.focus();
  for (let i = 0; i < 15; i++) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(2500);
  console.log('Rex after 15x ArrowRight on duo angle', JSON.stringify(await verdict()));
  console.log('focus now in', await page.evaluate(() => { const a = document.activeElement; return (a.closest('#duo-bay') ? 'duo' : a.closest('#bay') ? 'rex' : 'other') + ' ' + a.tagName + '#' + a.id; }));
  await browser.close();

  // C: focus jump after Enter in duo #near
  ({ browser, page, errs } = await open(url, { duoOpen: true, duoAction: 'arm', action: 'throw' }));
  await page.waitForTimeout(2000);
  await page.evaluate(() => { document.querySelectorAll('#duo-bay details.effort-adjust').forEach((d) => d.open = true); });
  const near = await page.$('#duo-bay #near');
  await near.fill('20'); await near.press('Enter');
  await page.waitForTimeout(2500);
  console.log('after Enter in duo near, focus in', await page.evaluate(() => { const a = document.activeElement; return (a.closest('#duo-bay') ? 'duo' : a.closest('#bay') ? 'rex' : 'other') + ' ' + a.tagName + '#' + a.id; }));
  console.log('errs', errs);
  await browser.close();
})();
