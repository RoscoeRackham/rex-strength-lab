const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(900);
    const res = [];
    for (const chip of ['Strongest human', 'Spider-Man', 'Hulk & Thor', 'Hulk, Secret Wars', 'All-Star Superman', 'Superman benches Earth']) {
      await page.click(`#tier-chips .chip:text-is("${chip}")`);
      await page.waitForTimeout(250);
      const r = await page.evaluate(() => {
        const svg = document.querySelector('#ladder-viz svg');
        const texts = [...svg.querySelectorAll('text')];
        const now = texts.find(t => t.textContent.startsWith('now'));
        const a = now.getBoundingClientRect();
        const covering = texts.filter(t => t !== now && (now.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING)).filter(t => { const b = t.getBoundingClientRect(); return Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 3; }).map(t => t.textContent);
        // labels struck through by the now line
        const line = [...svg.querySelectorAll('line')].find(l => l.getAttribute('x1') === '0');
        const ly = line.getBoundingClientRect().top;
        const struck = texts.filter(t => t !== now).filter(t => { const b = t.getBoundingClientRect(); return ly > b.top + 3 && ly < b.bottom - 3; }).map(t => t.textContent);
        return { covering, struck };
      });
      res.push(chip + ': now-label hidden by ' + JSON.stringify(r.covering) + ' | line strikes ' + JSON.stringify(r.struck));
    }
    console.log('== ' + w + '\n' + res.join('\n'));
    await page.close();
  }
  await browser.close();
})();
