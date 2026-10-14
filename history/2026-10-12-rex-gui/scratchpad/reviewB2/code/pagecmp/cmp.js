const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const wrap = (b) => '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + b + '</body></html>';
fs.writeFileSync(S + '/pagecmp/main.html', wrap(fs.readFileSync(S + '/pagecmp/main-index.html', 'utf8')));
fs.writeFileSync(S + '/pagecmp/branch.html', wrap(fs.readFileSync(S + '/lab/dist/index.html', 'utf8')));
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const states = [];
for (const logKg of [4, 6.5, 9, 12]) for (const surface of ['concrete', 'sand']) {
  const base = { duoOpen: true, logKg, surface, mode: 'comic' };
  states.push(Object.assign({ duoAction: 'arm' }, base));
  states.push(Object.assign({ duoAction: 'wrestle', wrestleMove: 'shove' }, base));
  states.push(Object.assign({ duoAction: 'wrestle', wrestleMove: 'throw', wAngle: 30 }, base));
  states.push(Object.assign({ duoAction: 'catch', cObj: 'car', cStyle: 'hard', cLogD: 1.5 }, base));
  states.push(Object.assign({ duoAction: 'catch', cObj: 'baseball', cStyle: 'easy', cLogD: 2 }, base));
  states.push(Object.assign({ duoAction: 'collide', colSrc: 'sprint' }, base));
  states.push(Object.assign({ duoAction: 'collide', colSrc: 'jump', anchor: 'bolted' }, base));
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const read = async (file, st) => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(pathToFileURL(S + '/pagecmp/' + file).href);
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload(); await page.waitForTimeout(600);
    for (let i = 0; i < 240; i++) { const busy = await page.evaluate(() => { const d = document.getElementById('duo-bay'); return !d || !d.querySelector('.verdict, .callout') || /working it out|Working out/i.test(d.textContent); }); if (!busy) break; await page.waitForTimeout(250); }
    const r = await page.evaluate(() => { const d = document.getElementById('duo-bay'); const e = d.querySelector('.effort-read'); return { effort: e ? e.querySelector('p').textContent.replace(/\s+/g, ' ').trim() : null, ceiling: e ? Array.from(e.querySelectorAll('p')).map((p) => p.textContent).filter((t) => /Courtesy ceiling/.test(t)).join(' ').replace(/\s+/g, ' ') : null, verdict: (d.querySelector('.verdict') || {}).textContent }; });
    await page.close();
    return r;
  };
  let diffs = 0;
  for (const st of states) {
    const a = await read('main.html', st), b = await read('branch.html', Object.assign({}, st, OFF));
    const same = a.effort === b.effort && a.ceiling === b.ceiling;
    if (!same) { diffs++; console.log('DIFF', JSON.stringify(st), '\n  main  ', a.effort, '|', a.ceiling, '\n  branch', b.effort, '|', b.ceiling); }
    else if (a.verdict !== b.verdict) console.log('VERDICT-ONLY', JSON.stringify(st), '\n  main  ', a.verdict, '\n  branch', b.verdict);
  }
  console.log('states', states.length, 'effort/ceiling diffs', diffs);
  await browser.close();
})();
