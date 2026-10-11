const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(800);
  // Aria snapshot of main
  const snap = await p.locator('main').ariaSnapshot();
  console.log('--- main aria snapshot (first 30 lines)');
  console.log(snap.split('\n').slice(0, 30).join('\n'));
  console.log('tabpanel count:', await p.getByRole('tabpanel').count());
  console.log('tab count:', await p.getByRole('tab').count());
  console.log('tablist name attrs:', await p.$eval('#tabs', e => [e.getAttribute('aria-label'), e.getAttribute('aria-labelledby')]));
  console.log('bay attrs:', await p.$eval('#bay', e => [e.getAttribute('role'), e.getAttribute('aria-labelledby'), e.getAttribute('tabindex')]));
  console.log('tab tabindex:', await p.$$eval('[role=tab]', es => es.map(e => e.id + ':' + e.getAttribute('tabindex') + ':' + e.tabIndex + ':' + e.getAttribute('aria-selected'))));
  // Live regions
  console.log('live regions:', await p.$$eval('[aria-live],[role=status],[role=alert],[role=log]', es => es.map(e => (e.id || e.className) + ' live=' + e.getAttribute('aria-live') + ' role=' + e.getAttribute('role'))));
  // Tab traversal: focus first tab, press Tab and see where focus goes
  await p.focus('#tab-lift');
  const seq = [];
  for (let i = 0; i < 10; i++) {
    await p.keyboard.press('Tab');
    seq.push(await p.evaluate(() => { const a = document.activeElement; return a.id || a.tagName + '.' + a.className; }));
  }
  console.log('Tab sequence from #tab-lift:', seq.join(' > '));
  // Home / End
  await p.focus('#tab-throw'); await p.click('#tab-throw');
  await p.keyboard.press('End');
  console.log('after End: active=', await p.evaluate(() => document.activeElement.id), 'selected=', await p.$eval('[role=tab][aria-selected=true]', e => e.id));
  await p.keyboard.press('Home');
  console.log('after Home: active=', await p.evaluate(() => document.activeElement.id), 'selected=', await p.$eval('[role=tab][aria-selected=true]', e => e.id));
  await p.keyboard.press('ArrowRight');
  console.log('after ArrowRight: active=', await p.evaluate(() => document.activeElement.id), 'selected=', await p.$eval('[role=tab][aria-selected=true]', e => e.id));
  // Check whether bay verdict sits inside any live region
  console.log('bay inside live region:', await p.$eval('#bay', e => !!e.closest('[aria-live]')));
  console.log('bay contains live region:', await p.$eval('#bay', e => !!e.querySelector('[aria-live],[role=status],[role=alert]')));
  // Slider step: what changes in dial-read and bay
  await p.click('#tab-throw');
  const before = await p.$eval('#bay', e => e.innerText.slice(0, 200));
  const dialBefore = await p.$eval('.dial-read', e => e.innerText);
  await p.focus('#strength');
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(200);
  const after = await p.$eval('#bay', e => e.innerText.slice(0, 200));
  const dialAfter = await p.$eval('.dial-read', e => e.innerText);
  console.log('slider valuetext:', await p.$eval('#strength', e => e.getAttribute('aria-valuetext')));
  console.log('dial before/after:', JSON.stringify(dialBefore), JSON.stringify(dialAfter));
  console.log('bay before:', JSON.stringify(before));
  console.log('bay after :', JSON.stringify(after));
  console.log('errors', errs);
  await b.close();
})();
