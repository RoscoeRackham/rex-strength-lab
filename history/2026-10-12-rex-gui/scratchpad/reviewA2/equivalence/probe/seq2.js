// Reproduce seq2-open: footing toggled with the two-player tests showing, then read Rex's Throw courtesy ceiling.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const URL = (v) => 'file://' + path.join(__dirname, '..', v + '.html');
async function run(browser, v, startDuo, steps, startAction) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const st = { action: startAction || 'pull', duoAction: 'catch', logKg: 6 };
  if (v === 'main') st.group = startDuo ? 'duo' : 'solo'; else st.duoOpen = !!startDuo;
  await ctx.addInitScript((s) => { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', s); sessionStorage.setItem('x', 1); } }, JSON.stringify(st));
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(URL(v));
  for (const [who, val] of steps) {
    await page.evaluate(([v, who, val]) => {
      if (v === 'main') { const s = document.querySelector(who === 'rex' ? '#anchor' : '#o-anchor'); s.value = val; s.dispatchEvent(new Event('change', { bubbles: true })); }
      else { const c = document.querySelector(who === 'rex' ? '#bolt-rex' : '#bolt-ollie'); c.checked = val === 'bolted'; c.dispatchEvent(new Event('change', { bubbles: true })); }
    }, [v, who, val]);
    await page.waitForTimeout(250);
  }
  if (v === 'main' && startDuo) await page.click('#grp-solo');
  await page.click('#tab-throw');
  let t = '';
  for (let i = 0; i < 200; i++) { t = await page.evaluate(() => document.querySelector('#bay').textContent); if (!/working it out|working out/i.test(t)) break; await page.waitForTimeout(150); }
  await page.waitForTimeout(500);
  t = await page.evaluate(() => document.querySelector('#bay .effort-read').textContent);
  await ctx.close();
  return (t.match(/Courtesy ceiling: [\d.]+%[^)]*\)/) || ['?'])[0] + (errs.length ? ' ERR ' + errs[0] : '');
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const seq = [['rex', 'bolted'], ['ollie', 'bolted'], ['rex', 'friction']];
  const fresh = [['ollie', 'bolted']];
  for (const v of ['main', 'branch']) {
    console.log(v, 'fresh final state (only Ollie bolted), solo start:', await run(browser, v, false, fresh));
    console.log(v, 'sequence, solo start               :', await run(browser, v, false, seq));
    console.log(v, 'sequence, two-player start         :', await run(browser, v, true, seq));
    console.log(v, 'sequence, two-player start again   :', await run(browser, v, true, seq));
    console.log(v, 'sequence, Throw showing            :', await run(browser, v, true, seq, 'throw'));
    console.log(v, 'Rex bolted then friction, Throw    :', await run(browser, v, false, [['rex', 'bolted'], ['rex', 'friction'], ['ollie', 'bolted']], 'throw'));
  }
  await browser.close();
})();
