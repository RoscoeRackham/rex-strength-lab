const { NEW, OLD, launch, open, settle, txt } = require('./lib.js');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const count = ({ names }) => { window.__duoCalls = 0; let v; Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => { for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; return f.apply(this, arguments); }; } v = x; } }); };
(async () => {
  const b = await launch();
  // 1. group duo -> open once; close; reload -> closed
  let p = await open(b, NEW, { group: 'duo', duoAction: 'catch' }, { init: { fn: count, arg: { names: DUO_FNS } } });
  await settle(p, 'duo-bay');
  console.log('group duo:', await p.evaluate(() => ({ open: document.getElementById('duo').open, sel: document.querySelector('#duo-tabs [aria-selected=true]').id, saved: JSON.parse(localStorage.getItem('rex-lab-v1')).group, duoOpen: JSON.parse(localStorage.getItem('rex-lab-v1')).duoOpen, calls: window.__duoCalls })));
  await p.click('#duo > summary'); await p.waitForTimeout(300);
  await p.reload(); await p.waitForTimeout(1500);
  console.log('after close+reload:', await p.evaluate(() => ({ open: document.getElementById('duo').open, saved: localStorage.getItem('rex-lab-v1').includes('group'), calls: window.__duoCalls })));
  await p.close();
  p = await open(b, NEW, { group: 'solo', duoAction: 'wrestle' }, { init: { fn: count, arg: { names: DUO_FNS } } });
  await p.waitForTimeout(1500);
  console.log('group solo:', await p.evaluate(() => ({ open: document.getElementById('duo').open, group: localStorage.getItem('rex-lab-v1').includes('"group"'), calls: window.__duoCalls })));
  // 2. open it -> renders current tab (wrestle)
  await p.click('#duo > summary'); await settle(p, 'duo-bay');
  console.log('opened:', await p.evaluate(() => ({ sel: document.querySelector('#duo-tabs [aria-selected=true]').id, verdict: (document.querySelector('#duo-bay .verdict') || {}).textContent, calls: window.__duoCalls })));
  // 3. while open, a settings change in the sidebar re-renders both bays
  const before = { rex: await txt(p, '#bay .verdict'), duo: await txt(p, '#duo-bay .verdict') };
  await p.selectOption('#surface', 'ice'); await p.waitForTimeout(300); await settle(p, 'duo-bay');
  const after = { rex: await txt(p, '#bay .verdict'), duo: await txt(p, '#duo-bay .verdict') };
  console.log('ground->ice:', JSON.stringify(before), '=>', JSON.stringify(after));
  // mode real
  await p.evaluate(() => document.getElementById('powers').open = true);
  await p.click('#mode-real'); await p.waitForTimeout(300); await settle(p, 'duo-bay');
  console.log('mode real:', await txt(p, '#bay .verdict'), '|', await txt(p, '#duo-bay .verdict'));
  // Rex's height (size chip Kaiju) 
  await p.evaluate(() => document.getElementById('setup').open = true);
  const chips = await p.$$eval('#size-chips .chip', (cs) => cs.map((c) => c.textContent));
  console.log('size chips', chips);
  await p.click('#size-chips .chip:nth-child(3)'); await p.waitForTimeout(300); await settle(p, 'duo-bay');
  console.log('kaiju:', await txt(p, '#bay .verdict'), '|', await txt(p, '#duo-bay .verdict'));
  // 4. keyboard: arrow keys in each tab list
  await p.focus('#tab-throw'); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(200);
  console.log('solo arrow ->', await p.evaluate(() => [document.activeElement.id, document.querySelector('#tabs [aria-selected=true]').id, document.querySelector('#duo-tabs [aria-selected=true]').id]));
  await p.keyboard.press('End'); await p.waitForTimeout(200);
  console.log('solo End ->', await p.evaluate(() => [document.activeElement.id, document.querySelector('#tabs [aria-selected=true]').id]));
  await p.focus('#tab-wrestle'); await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(200); await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(200);
  console.log('duo arrow <- <-', await p.evaluate(() => [document.activeElement.id, document.querySelector('#duo-tabs [aria-selected=true]').id, document.querySelector('#tabs [aria-selected=true]').id]));
  await p.keyboard.press('Home'); await p.waitForTimeout(200);
  console.log('duo Home', await p.evaluate(() => [document.activeElement.id, document.querySelector('#duo-tabs [aria-selected=true]').id]));
  console.log('errs', p.__errs);
  await p.close();
  await b.close();
})();
