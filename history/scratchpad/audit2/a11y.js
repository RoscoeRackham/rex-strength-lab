const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(800);
  console.log('--- tabs aria snapshot\n' + await page.locator('main').ariaSnapshot().then(s => s.split('\n').slice(0, 30).join('\n')));
  console.log('--- ladder aria snapshot\n' + await page.locator('#ladder').ariaSnapshot());
  // CDP AX tree: are ladder buttons exposed?
  const cdp = await page.context().newCDPSession(page);
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  const btns = nodes.filter(n => n.role && n.role.value === 'button' && !n.ignored).map(n => n.name && n.name.value);
  console.log('--- AX buttons containing "Set strength here":', btns.filter(b => b && b.includes('Set strength')).length);
  const tabpanels = nodes.filter(n => n.role && n.role.value === 'tabpanel');
  console.log('tabpanel nodes:', tabpanels.length);
  const live = await page.evaluate(() => [...document.querySelectorAll('[aria-live]')].map(e => e.id || e.className));
  console.log('aria-live regions:', live);
  await browser.close();
})();
