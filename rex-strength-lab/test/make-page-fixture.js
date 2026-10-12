// Records what the page shows for a set of saved states, so test/shots.js can check that the page reorganisation
// (BRIEF-gui.md sections 1-4) leaves those results unchanged. Run it on main's build from before the change:
//   git show <commit before the reorganisation>:rex-strength-lab/dist/index.html > /tmp/main.html
//   node test/make-page-fixture.js /tmp/main.html 'main at <commit>'   -> test/fixtures/page-before.json
// It refuses a page that already has the Rex + Ollie element. Each case saves a state in localStorage ('rex-lab-v1'),
// reloads, opens the tab and records the result text (verdict, status chips, tiles, the effort box, what happens, the
// callouts and the math), once no search is still 'working it out'.
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url'), { execSync } = require('child_process');
const loadPlaywright = () => {
  for (const p of [process.env.PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright']) { if (p) try { return require(p); } catch (e) { /* next */ } }
  return require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
};
const { chromium } = loadPlaywright();
const CHROME = [process.env.CHROME, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => p && fs.existsSync(p));

// The cases, in the old page's terms (group/duoAction pick the two-player tab). test/shots.js reaches the same tab
// on the new page and compares.
const CASES = [];
// section 1: real muscle, both bolted, on the Weight, Jump and Collide tabs
for (const tab of ['weight', 'jump', 'collide']) CASES.push({ id: 's1-' + tab, tab, state: { mode: 'real', anchor: 'bolted', oAnchor: 'bolted' } });
// section 3: each footing combination on Collide and Wrestle (shoving match)
for (const tab of ['collide', 'wrestle']) for (const a of ['friction', 'bolted']) for (const b of ['friction', 'bolted']) CASES.push({ id: 's3-' + tab + '-' + a + '-' + b, tab, state: { anchor: a, oAnchor: b } });
// section 4: a saved two-player tab
CASES.push({ id: 's4-catch', tab: 'catch', state: { group: 'duo', duoAction: 'catch' } });
// an older save's Wrestle throw at Rex's Throw angle (the new page gives Wrestle its own angle, started from this one)
CASES.push({ id: 's4-wrestle-throw', tab: 'wrestle', state: { angle: 30, wrestleMove: 'throw' } });
const DUO = ['arm', 'wrestle', 'catch', 'collide'];

// what the result is: the verdict, the status chips and the tiles of the bay that shows the tab
async function readResult(page, bayId) {
  return page.evaluate((id) => {
    const bay = document.getElementById(id);
    const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
    const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt);
    return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout'), math: all('details.math .eq') };
  }, bayId);
}
async function settle(page, bayId) {
  for (let i = 0; i < 120; i++) {
    const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), bayId);
    if (!busy) return;
    await page.waitForTimeout(250);
  }
  throw new Error('still working it out after 30 s');
}

if (require.main === module) (async () => {
  const file = process.argv[2];
  if (!file) { console.error('Give the path of main\'s build from before the page reorganisation (see the comment at the top).'); process.exit(1); }
  const body = fs.readFileSync(file, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const tmp = path.join(__dirname, '..', 'dist', 'fixture-src.html');
  fs.writeFileSync(tmp, wrapped);
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(tmp).href);
  if (await page.evaluate(() => !!document.getElementById('duo-bay'))) { console.error('This page already has the Rex + Ollie element: run this on main\'s build from before the reorganisation.'); await browser.close(); fs.unlinkSync(tmp); process.exit(1); }
  const out = {};
  for (const c of CASES) {
    const duo = DUO.includes(c.tab);
    const st = Object.assign({}, c.state, duo ? { group: 'duo', duoAction: c.tab } : { group: 'solo', action: c.tab });
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(800);
    await settle(page, 'bay');
    out[c.id] = await readResult(page, 'bay');
    console.log(c.id + ': ' + out[c.id].verdict);
  }
  await browser.close();
  fs.unlinkSync(tmp);
  const dest = path.join(__dirname, 'fixtures', 'page-before.json');
  fs.writeFileSync(dest, JSON.stringify({ note: 'Written by test/make-page-fixture.js from ' + (process.argv[3] || 'main\'s build') + ', before the page reorganisation (BRIEF-gui.md sections 1-4).', cases: CASES, results: out }, null, 1) + '\n');
  console.log('wrote ' + dest);
})().catch((e) => { console.error(e); process.exit(1); });

module.exports = { CASES, DUO, readResult, settle };
