// The page (slimmed builds.json, browser) and Node (full builds.json) give the same scores and gaps.
const { open } = require('./harness.js');
const BC = require('/home/user/rex-strength-lab/build-calculator/src/calc.js');
const builds = require('/home/user/rex-strength-lab/build-calculator/data/builds.json');
const Compare = require('/home/user/rex-strength-lab/build-comparison/src/model.js');
const settings = require('/home/user/rex-strength-lab/build-comparison/data/settings.json');
(async () => {
  const model = Compare.create(BC.create(builds), { builds: settings.builds, fat_classes: settings.fat_classes });
  const node = model.all().map((e) => [e.id, e.score.value, e.score.lo, e.score.hi]);
  const ngaps = model.gaps(model.all(), Compare.ballScore(1060, 7.5), 1.25);
  const { browser, p } = await open();
  const page = await p.evaluate(() => ({ list: window.__bc.LIST.map((e) => [e.id, e.score.value, e.score.lo, e.score.hi]), gaps: window.__bc.GAPS }));
  let diff = 0;
  node.forEach((n, i) => { const q = page.list[i]; if (!q || q[0] !== n[0] || [1, 2, 3].some((k) => Math.abs(q[k] - n[k]) > 1e-9)) { diff++; console.log('differs', n, q); } });
  console.log('builds compared', node.length, 'differences', diff, '| gaps equal', JSON.stringify(ngaps) === JSON.stringify(page.gaps));
  console.log('gaps', page.gaps.map((g) => g.from.toFixed(1) + '-' + (g.to.toFixed ? g.to.toFixed(1) : g.to) + ' (' + g.below + ' / ' + g.above + ')').join('; '));
  await browser.close();
})();
