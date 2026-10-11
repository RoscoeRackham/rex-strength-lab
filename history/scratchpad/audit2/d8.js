const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(800);
  const card = p.locator('article.feat', { hasText: 'Superman catches a 777' });
  console.log('CARD:', (await card.innerText()).replace(/\n+/g, ' | '));
  await card.locator('button.run').click();
  await p.waitForTimeout(800);
  const st = await p.evaluate(() => localStorage.getItem('rex-lab-v1'));
  console.log('STATE:', st);
  const bay = await p.evaluate(() => {
    const v = document.querySelector('.verdict'); const s = document.querySelector('.status-row');
    const rig = document.querySelector('.rig');
    return { verdict: v && v.innerText, status: s && s.innerText, rig: rig ? rig.innerText.slice(0, 3000) : null };
  });
  console.log(JSON.stringify(bay, null, 1));
  await p.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/d8.png' });
  await b.close();
})();
