const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const file = process.argv[2];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const action of ['stomp', 'jump', 'sprint', 'throw', 'lift', 'punch', 'clap', 'pull']) {
    const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
    await page.addInitScript((a) => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 12, action: a })); }, action);
    await page.goto('file://' + file);
    await page.waitForTimeout(5500);
    const info = await page.evaluate(() => {
      const out = [];
      for (const s of document.querySelectorAll('.viz svg')) {
        const vb = s.viewBox.baseVal; const r = s.getBoundingClientRect();
        const t = s.querySelector('text'); const sc = r.width / vb.width;
        // text clipping: any text bbox outside viewBox
        let clip = 0, overlaps = 0; const boxes = [];
        for (const tx of s.querySelectorAll('text')) { const b = tx.getBBox(); if (b.width === 0) continue; if (b.x < vb.x - 0.5 || b.x + b.width > vb.x + vb.width + 0.5) clip++; boxes.push(b); }
        for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) { const a = boxes[i], c = boxes[j]; if (a.x < c.x + c.width - 1 && c.x < a.x + a.width - 1 && a.y < c.y + c.height - 1 && c.y < a.y + a.height - 1) overlaps++; }
        out.push(vb.width + '->' + Math.round(r.width) + ' ' + (t ? (11 * sc).toFixed(2) : '-') + 'px clip=' + clip + ' overlap=' + overlaps + ' ' + (s.getAttribute('aria-label') || '').slice(0, 28));
      }
      return { out, scrollW: document.documentElement.scrollWidth };
    });
    console.log(action, 'scrollW=' + info.scrollW, '\n  ' + info.out.join('\n  '));
    await page.close();
  }
  await browser.close();
})();
