// Compare full bay text between main's page and the branch's page for many saved states.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const DIR = __dirname;
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
async function bayText(page, id) {
  for (let i = 0; i < 160; i++) {
    const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id);
    if (!busy) break;
    await page.waitForTimeout(250);
  }
  return page.evaluate((id) => {
    const bay = document.getElementById(id);
    bay.querySelectorAll('details').forEach((d) => { d.open = true; });
    return bay.innerText;
  }, id);
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [];
  for (const anchor of ['friction', 'bolted']) for (const logKg of [4.96, 9, 20]) for (const tab of SOLO) cases.push({ tab, st: { anchor, logKg, action: tab } });
  for (const [a, b] of [['friction', 'friction'], ['bolted', 'friction'], ['friction', 'bolted'], ['bolted', 'bolted']])
    for (const logKg of [4.96, 12]) for (const tab of DUO) {
      if (tab === 'wrestle') for (const wm of ['push', 'shove', 'lift', 'throw']) for (const who of ['rex', 'ollie']) cases.push({ tab, st: { anchor: a, oAnchor: b, logKg, duoAction: tab, wrestleMove: wm, wrestleWho: who } });
      else if (tab === 'collide') for (const colWho of ['ollie', 'rex']) cases.push({ tab, st: { anchor: a, oAnchor: b, logKg, duoAction: tab, colWho } });
      else cases.push({ tab, st: { anchor: a, oAnchor: b, logKg, duoAction: tab } });
    }
  const which = process.argv[2] || 'both';
  const res = { main: [], branch: [] };
  for (const n of ['main', 'branch']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.goto('file://' + path.join(DIR, 'pages', n + '.html'));
    for (const c of cases) {
      const duo = DUO.includes(c.tab);
      const st = Object.assign({}, c.st, n === 'main' ? { group: duo ? 'duo' : 'solo' } : { duoOpen: duo });
      await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
      await page.reload(); await page.waitForTimeout(duo ? 900 : 300);
      const id = n === 'main' ? 'bay' : (duo ? 'duo-bay' : 'bay');
      res[n].push(await bayText(page, id));
    }
    console.log(n, 'errors', errs.length, errs.slice(0, 3));
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(DIR, 'compare-out.json'), JSON.stringify({ cases, res }, null, 1));
  let diffs = 0;
  for (let i = 0; i < cases.length; i++) {
    const a = res.main[i].split('\n'), b = res.branch[i].split('\n');
    const onlyA = a.filter((x) => !b.includes(x)), onlyB = b.filter((x) => !a.includes(x));
    if (onlyA.length || onlyB.length) {
      diffs++;
      console.log('=== ' + JSON.stringify(cases[i].st));
      for (const x of onlyA) console.log('  - ' + x.slice(0, 400));
      for (const x of onlyB) console.log('  + ' + x.slice(0, 400));
    }
  }
  console.log('cases', cases.length, 'with differences', diffs);
})().catch((e) => { console.error(e); process.exit(1); });
