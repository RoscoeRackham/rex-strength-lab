// interaction flows with the element open: after each, both bays must show what a fresh load of the same state shows
const { wrap, launch, settle, readResult, S } = require('./h.js');
const path = require('path');
const URL = wrap(path.join(S, 'lab/dist/index.html'), 'new');
(async () => {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  const q = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(URL); await q.goto(URL);
  const both = async (pg) => { await settle(pg, 'bay'); await settle(pg, 'duo-bay'); return { rex: await readResult(pg, 'bay'), duo: await readResult(pg, 'duo-bay') }; };
  const fresh = async () => { const st = await p.evaluate(() => localStorage.getItem('rex-lab-v1')); await q.evaluate((s) => localStorage.setItem('rex-lab-v1', s), st); await q.reload(); await q.waitForTimeout(800); return both(q); };
  const cmp = async (label) => { await p.waitForTimeout(700); const a = await both(p), z = await fresh();
    const d = ['rex', 'duo'].flatMap((w) => Object.keys(a[w]).filter((k) => JSON.stringify(a[w][k]) !== JSON.stringify(z[w][k])).map((k) => w + '.' + k));
    console.log(label.padEnd(60), d.length ? 'DIFFERS from a fresh load: ' + d.join(',') + '\n    page : ' + (a.duo.verdict || '') + ' | ' + (a.rex.verdict || '') + '\n    fresh: ' + (z.duo.verdict || '') + ' | ' + (z.rex.verdict || '') : 'same as a fresh load'); };
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'catch', action: 'throw' })));
  await p.reload(); await p.waitForTimeout(800); await both(p);
  // E: drag the strength dial (input events, 16 ms apart) then let go
  await p.evaluate(async () => { const s = document.getElementById('strength'); const v0 = Number(s.value); for (let i = 0; i < 25; i++) { s.value = String(v0 + 0.04 * (i + 1)); s.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 16)); } s.dispatchEvent(new Event('change', { bubbles: true })); });
  await cmp('E strength dial dragged up 1.0 decade (Catch open, Throw)');
  // G: Ollie's what-if dial
  await p.click('#ollie-setup > summary'); await p.click('#o-own'); await p.waitForTimeout(300);
  await p.evaluate(async () => { const s = document.getElementById('o-strength'); const v0 = Number(s.value); for (let i = 0; i < 25; i++) { s.value = String(v0 - 0.04 * (i + 1)); s.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 16)); } });
  await cmp('G Ollie’s what-if dial dragged down 1.0 decade');
  // H: Rex's density slider drag
  await p.evaluate(async () => { const s = document.getElementById('density'); const v0 = Number(s.value); for (let i = 0; i < 15; i++) { s.value = String(v0 + 0.03 * (i + 1)); s.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 16)); } });
  await cmp('H Rex’s density slider dragged');
  // C: rapid close/open clicks
  for (let i = 0; i < 7; i++) { await p.click('#duo > summary'); await p.waitForTimeout(30 + 40 * (i % 3)); }
  const st = await p.evaluate(() => ({ open: document.getElementById('duo').open, saved: JSON.parse(localStorage.getItem('rex-lab-v1')).duoOpen }));
  console.log('C after 7 rapid clicks on the summary', JSON.stringify(st));
  if (st.open) await cmp('C rapid close/open, ends open'); else { await p.click('#duo > summary'); await cmp('C rapid close/open, then opened'); }
  // I: Collide speed slider by keyboard
  await p.click('#tab-collide'); await p.waitForTimeout(500); await settle(p, 'duo-bay');
  await p.click('#cs-set'); await p.waitForTimeout(800); await settle(p, 'duo-bay');
  await p.focus('#col-gb'); for (let i = 0; i < 8; i++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(20); }
  await p.waitForTimeout(800);
  console.log('I focus after Collide speed keys:', await p.evaluate(() => document.activeElement.id));
  await cmp('I Collide speed slider moved by keyboard');
  // J: Wrestle throw angle
  await p.click('#tab-wrestle'); await p.waitForTimeout(400); await p.click('#wm-throw'); await p.waitForTimeout(600); await settle(p, 'duo-bay');
  await p.focus('#w-angle'); for (let i = 0; i < 8; i++) { await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(20); }
  await cmp('J Wrestle throw angle moved by keyboard');
  // K: arrow keys in the two-player tab row
  await p.focus('#tab-wrestle'); await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight'); await p.keyboard.press('End'); await p.keyboard.press('Home');
  console.log('K focus/tab after Right, Right, End, Home:', await p.evaluate(() => [document.activeElement.id, document.querySelector('#duo-tabs [aria-selected=true]').id]));
  await cmp('K two-player tab row arrow keys');
  console.log('page errors:', JSON.stringify(errs));
  await b.close();
})();
