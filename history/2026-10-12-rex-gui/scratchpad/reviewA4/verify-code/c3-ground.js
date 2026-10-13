// code-3: where the Ground menu sits, and the proposed shots.js check, on the branch and on mutant C
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const name of process.argv.slice(2)) for (const w of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(pathToFileURL(__dirname + '/pages/' + name + '.html').href);
    await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(2500);
    const r = await page.evaluate(() => {
      const s = document.getElementById('surface'), aside = document.querySelector('aside.panel-controls');
      const ids = ['strength', 'setup', 'ground-sec', 'powers'], pos = ids.map((id) => Array.from(aside.querySelectorAll('*')).indexOf(document.getElementById(id)));
      const sections = Array.from(aside.querySelectorAll('details, .side-sec')).map((n) => n.id).join();
      const groundOk = !!s && document.getElementById('ground-sec').contains(s) && !document.getElementById('setup').contains(s) && !document.getElementById('powers').contains(s);
      const mass = document.getElementById('mass');
      return { inSec: s.closest('details, .side-sec').id, beforeMass: !!(s.compareDocumentPosition(mass) & Node.DOCUMENT_POSITION_FOLLOWING), visible: s.getClientRects().length > 0, setupOpen: document.getElementById('setup').open, pos, orderOk: pos.every((p, i) => p >= 0 && (!i || p > pos[i - 1])), sections, groundOk };
    });
    console.log(name.padEnd(5), w, JSON.stringify(r));
    await page.close();
  }
  await browser.close();
})();
