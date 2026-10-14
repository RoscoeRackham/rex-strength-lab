const fs = require('fs'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const states = [];
for (const logKg of [4, 8, 14]) for (const surface of ['concrete', 'sand', 'ice']) for (const action of ['throw', 'jump', 'stomp', 'punch', 'pull', 'sprint']) {
  states.push({ action, logKg, surface, mode: 'comic', obj: action === 'pull' ? 'bus' : 'car', angle: 45 });
}
for (const effort of ['plaster', 'windows', 'ground', 'rattle']) for (const action of ['throw', 'stomp', 'jump']) states.push({ action, logKg: 7, surface: 'concrete', mode: 'comic', obj: 'car', angle: 45, effort });
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const read = async (file, st) => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(S + '/pagecmp/' + file).href);
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload(); await page.waitForTimeout(500);
    if (st.effort) { await page.selectOption('#effort', st.effort); await page.waitForTimeout(300); }
    for (let i = 0; i < 240; i++) { const busy = await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('bay').textContent)); if (!busy) break; await page.waitForTimeout(250); }
    const r = await page.evaluate(() => { const d = document.getElementById('bay'); const e = d.querySelector('.effort-read'); const ps = e ? Array.from(e.querySelectorAll('p')).map((p) => p.textContent.replace(/\s+/g, ' ').trim()) : []; return { effort: ps[0] || null, rest: ps.slice(1).join(' || '), verdict: ((d.querySelector('.verdict') || {}).textContent || '').replace(/\s+/g, ' ') }; });
    await page.close();
    return r;
  };
  let diffs = 0, vd = 0;
  for (const st of states) {
    const a = await read('main.html', st), b = await read('branch.html', Object.assign({}, st, OFF));
    if (a.effort !== b.effort) { diffs++; console.log('EFFORT-DIFF', JSON.stringify(st), '\n  main  ', a.effort, '\n  branch', b.effort); }
    if (a.rest !== b.rest) console.log('NOTE-DIFF', JSON.stringify(st), '\n  main  ', a.rest.slice(0, 400), '\n  branch', b.rest.slice(0, 400));
    if (a.verdict !== b.verdict) { vd++; console.log('VERDICT-DIFF', JSON.stringify(st), '\n  main  ', a.verdict, '\n  branch', b.verdict); }
  }
  console.log('states', states.length, 'effort diffs', diffs, 'verdict diffs', vd);
  await browser.close();
})();
