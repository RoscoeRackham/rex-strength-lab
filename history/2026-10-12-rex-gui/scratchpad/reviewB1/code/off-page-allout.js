// main's page (its comic switches off) against the branch's page with the four powers off: every solo tab at a few
// settings. Prints only the fields that differ.
const { open } = require('./harness.js');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const read = (page) => page.evaluate(() => { const bay = document.getElementById('bay'); const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null); const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt);
  return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row').join(' | '), tiles: all('.tiles').join(' | '), effort: all('.effort-read').join(' | '), happens: all('.happens').join(' | '), callouts: all('.callout').join(' | ') }; });
(async () => {
  const cases = [];
  for (const action of ['throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) for (const [logKg, surface, extra] of [[5, 'concrete', {}], [8, 'sand', {}], [20, 'concrete', {}], [8, 'concrete', { m: 3e7 }]]) cases.push(Object.assign({ action, logKg, surface }, extra));
  cases.push({ action: 'throw', obj: 'baseball', angle: 0, logKg: 23.26, surface: 'concrete' });
  cases.push({ action: 'throw', obj: 'bus', angle: 45, logKg: 5, surface: 'ice' });
  const res = {};
  for (const name of ['main', 'branch']) {
    const h = await open(name);
    res[name] = [];
    for (const st of cases) { await h.load(name === 'branch' ? Object.assign({}, st, OFF) : st); await h.settle('bay', 120000); if (await h.page.$('#effort')) { await h.page.selectOption('#effort', 'allout'); await h.page.waitForTimeout(300); await h.settle('bay', 120000); } res[name].push(await read(h.page)); }
    res[name + 'Err'] = h.errs.slice(0, 3);
    await h.browser.close();
  }
  let nd = 0;
  cases.forEach((st, i) => { const a = res.main[i], b = res.branch[i]; for (const k of Object.keys(a)) if (a[k] !== b[k]) { nd++; console.log('\n==', JSON.stringify(st), k); // show the first difference with context
    const x = a[k] || '', y = b[k] || ''; let j = 0; while (j < x.length && x[j] === y[j]) j++; console.log('  main  : …' + x.slice(Math.max(0, j - 80), j + 220)); console.log('  branch: …' + y.slice(Math.max(0, j - 80), j + 220)); } });
  console.log('\n', nd, 'differing fields; errors', res.mainErr, res.branchErr);
})();
