const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url'), path = require('path');
const { readResult, settle } = require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/code/repo/rex-strength-lab/test/make-page-fixture.js');
const U = (n) => pathToFileURL(path.join(__dirname, n + '.html')).href;
const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(process.argv[2] ? U(process.argv[2]) : U('pr3'));
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay'); if (st.duoOpen) await settle(page, 'duo-bay'); };
  const pick = async (sel, v, bay) => { await page.selectOption(sel, v); await page.waitForTimeout(300); await settle(page, bay); };
  const txt = (id) => page.evaluate((i) => { const b = document.getElementById(i).cloneNode(true); b.querySelectorAll('script,style').forEach((x) => x.remove()); return b.textContent.replace(/\s+/g, ' '); }, id);
  const want = (process.argv[3] || '').split(',').filter(Boolean);
  const states = [];
  for (const sp of [true, false]) for (const pw of [{}, { keepForm: false, airAbsorb: 0 }, { keepForm: false, airAbsorb: 0, unbreakable: false, ownRecoil: false }]) {
    for (const dial of [{ inf: true }, { logKg: 20 }, { logKg: 17 }, { logKg: 14 }, { logKg: 9.15 }, { logKg: 8 }]) for (const eff of ['least', 'allout', 'ceiling']) states.push({ st: Object.assign({ saveV: 3, action: 'throw', obj: 'person', safePassenger: sp }, pw, dial), eff });
  }
  const out = [];
  for (const { st, eff } of states) {
    await load(st);
    if (eff !== 'least') { try { await pick('#effort', eff, 'bay'); } catch (e) { out.push('pick fail ' + eff + ' ' + e.message); } }
    const t = await txt('bay'); const b = bad(t);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const lands = (t.match(/They land at[^.]*\.[^.]*\.[^.]*\./) || [''])[0];
    const tile = (t.match(/Lands at[^·]{0,80}/) || [''])[0];
    if (b.length || ov > 0 || want.includes('all')) out.push(JSON.stringify(st) + ' ' + eff + ': bad=' + JSON.stringify(b) + ' ov=' + ov + ' | ' + lands.slice(0, 220) + ' | ' + tile);
  }
  // Catch with a person
  for (const sp of [true, false]) for (const dial of [{ inf: true }, { logKg: 20 }, { logKg: 12 }, {}]) for (const style of ['easy', 'hard']) for (const pw of [{}, { airAbsorb: 0, keepForm: false }]) for (const d of [1, 4, 7]) {
    const st = Object.assign({ saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: style, cMiss: true, cLogD: d, safePassenger: sp }, dial, pw);
    try { await load(st); } catch (e) { out.push('load fail ' + JSON.stringify(st) + e.message); continue; }
    const t = await txt('duo-bay'); const b = bad(t);
    const miss = (t.match(/If Ollie misses[^]*?(?:shakes it\.|across\.|quake\.|\)\.|down far away[^.]*\.)/) || [''])[0];
    if (b.length || want.includes('all') || want.includes('catch')) out.push('CATCH ' + JSON.stringify(st) + ': bad=' + JSON.stringify(b) + ' | ' + miss.slice(0, 300) + ' | chips: ' + (await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay .status-row')).map((n) => n.textContent).join(' / '))).slice(0, 300));
  }
  console.log(out.join('\n'));
  console.log('errors', errs.slice(0, 10));
  await browser.close();
})();
