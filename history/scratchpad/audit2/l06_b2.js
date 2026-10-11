const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(800);
  const ok = await p.evaluate(() => {
    const h = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim() === 'Atlas holds up the heavens');
    let n = h; while (n && !n.querySelector('button.run')) n = n.parentElement;
    n.querySelector('button.run').click(); return !!n;
  });
  await p.waitForTimeout(800);
  await p.locator('.rig').screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l06_atlas.png' });
  // Also: does dragging to the slider max allow lifting? And does a ladder chip / threshold path work?
  await b.close();
})();
