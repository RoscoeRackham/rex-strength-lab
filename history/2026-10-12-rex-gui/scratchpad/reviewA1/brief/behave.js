const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const DIR = __dirname;
const settle = async (page, id) => { for (let i = 0; i < 160; i++) { const b = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id); if (!b) return; await page.waitForTimeout(250); } };
const verdict = (page, id) => page.evaluate((id) => { const v = document.querySelector('#' + id + ' .verdict'); return v ? v.textContent : null; }, id);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.join(DIR, 'pages', 'branch.html'));
  const load = async (st) => { await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(1200); };

  // 1. Bolted hint vs what the page shows for both bolted, unlimited strength, shoving match on concrete
  await load({ anchor: 'bolted', oAnchor: 'bolted', inf: true, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push' });
  await settle(page, 'duo-bay');
  console.log('1 both bolted, inf, push:', await verdict(page, 'duo-bay'));
  await load({ anchor: 'bolted', oAnchor: 'bolted', inf: true, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove' });
  await settle(page, 'duo-bay');
  console.log('1b both bolted, inf, shove:', await verdict(page, 'duo-bay'));
  await load({ anchor: 'bolted', oAnchor: 'friction', logKg: 12, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'ollie' });
  await settle(page, 'duo-bay');
  console.log('1c Rex bolted, 1e12 kg, Ollie shoves:', await verdict(page, 'duo-bay'));
  console.log('   hint:', await page.evaluate(() => document.querySelector('#bolt-lbl').parentElement.querySelector('.hint').textContent));

  // 2. Keyboard: arrows stay inside each tab list
  await load({ duoOpen: true, duoAction: 'arm', action: 'throw' });
  await page.focus('#tab-arm'); await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(300);
  const k1 = await page.evaluate(() => ({ focus: document.activeElement.id, duo: JSON.parse(localStorage.getItem('rex-lab-v1')).duoAction, act: JSON.parse(localStorage.getItem('rex-lab-v1')).action }));
  await page.focus('#tab-throw'); await page.keyboard.press('End'); await page.waitForTimeout(300);
  const k2 = await page.evaluate(() => ({ focus: document.activeElement.id, duo: JSON.parse(localStorage.getItem('rex-lab-v1')).duoAction, act: JSON.parse(localStorage.getItem('rex-lab-v1')).action }));
  console.log('2 keyboard:', JSON.stringify(k1), JSON.stringify(k2));

  // 3. while open, a settings change re-renders both bays (surface)
  await load({ duoOpen: true, duoAction: 'collide', action: 'throw', surface: 'concrete' });
  await settle(page, 'duo-bay'); await settle(page, 'bay');
  const a0 = await verdict(page, 'duo-bay'), s0 = await verdict(page, 'bay');
  await page.selectOption('#surface', 'ice'); await page.waitForTimeout(1500); await settle(page, 'duo-bay'); await settle(page, 'bay');
  const a1 = await verdict(page, 'duo-bay'), s1 = await verdict(page, 'bay');
  console.log('3 surface change re-renders: duo', a0 !== a1, 'solo', s0 !== s1, '|', a1 && a1.slice(0, 120));

  // 4. saved group duo opens once; closing then reloading leaves it closed
  await load({ group: 'duo', duoAction: 'catch' });
  const o1 = await page.evaluate(() => document.getElementById('duo').open);
  await page.click('#duo > summary'); await page.waitForTimeout(300);
  await page.reload(); await page.waitForTimeout(1200);
  const o2 = await page.evaluate(() => ({ open: document.getElementById('duo').open, saved: JSON.parse(localStorage.getItem('rex-lab-v1')).duoOpen }));
  console.log('4 group duo: opened', o1, 'after close + reload', JSON.stringify(o2));
  await load({ group: 'solo', action: 'jump' });
  console.log('4b group solo: open', await page.evaluate(() => document.getElementById('duo').open));

  // 5. summaries
  await load({ mode: 'real', anchor: 'bolted', oAnchor: 'bolted', groundHolds: true, gentleHold: true });
  console.log('5 powers-sum:', await page.evaluate(() => document.getElementById('powers-sum').textContent), '| setup-sum:', await page.evaluate(() => document.getElementById('setup-sum').textContent), '| ollie-sum:', await page.evaluate(() => document.getElementById('ollie-sum').textContent));
  await load({ anchor: 'friction', oAnchor: 'bolted' });
  console.log('5b powers-sum:', await page.evaluate(() => document.getElementById('powers-sum').textContent));

  // 6. throw recoil text at friction, high strength
  await load({ action: 'throw', logKg: 9, anchor: 'friction', obj: 'car' });
  await settle(page, 'bay');
  const t6 = await page.evaluate(() => { const t = document.getElementById('bay').textContent; const i = t.indexOf('To stay put'); return i < 0 ? 'none' : t.slice(i, i + 120); });
  console.log('6 recoil:', t6);
  // with allout effort
  await page.selectOption('#effort', 'allout').catch(() => {}); await page.waitForTimeout(800); await settle(page, 'bay');
  const t6b = await page.evaluate(() => { const t = document.getElementById('bay').textContent; const i = t.indexOf('To stay put'); return i < 0 ? 'none' : t.slice(i, i + 120); });
  console.log('6b recoil allout:', t6b);

  // 7. record book run buttons
  await load({ duoOpen: true, duoAction: 'arm', action: 'walk' });
  const runs = await page.$$('button');
  const runBtns = await page.evaluate(() => Array.from(document.querySelectorAll('#feats button, .feats button, section button')).filter((b) => /run|try|show/i.test(b.textContent)).slice(0, 5).map((b) => b.textContent + ' @' + (b.closest('section') || {}).id));
  console.log('7 run buttons sample:', JSON.stringify(runBtns));

  // 8. Collide thought experiments and Walk who-walks
  await load({ duoOpen: true, duoAction: 'collide', action: 'walk' });
  await settle(page, 'duo-bay');
  console.log('8 collide immovable/light controls:', await page.evaluate(() => { const t = document.getElementById('duo-bay').textContent; return [/Truly immovable/.test(t), /Light speed/i.test(t)]; }), 'walk who:', await page.evaluate(() => /Ollie/.test(document.querySelector('#bay .bay-controls') ? document.querySelector('#bay .bay-controls').textContent : '')));
  console.log('errors', errs);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
